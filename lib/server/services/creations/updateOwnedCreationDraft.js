import { normalizeCreationPayload } from "@/lib/server/creations/validateCreationPayload";
import { toCreationEditPayload } from "@/lib/server/services/creations/getOwnedCreationForEdit";
import { syncCreationAssetEdges } from "@/lib/server/services/creations/syncCreationAssetEdges";
import { evaluateMeaningfulCreationUpdate } from "@/lib/server/services/creations/meaningfulUpdatePolicy";

const NORMAL_EDIT_STATUSES = ["DRAFT", "REJECTED"];
const NORMAL_EDIT_VISIBILITIES = ["PRIVATE", "UNLISTED"];

function getLifecycleEditBlockReason(creation) {
  const status = creation.status || "DRAFT";
  const visibility = creation.visibility || "PRIVATE";
  const canonStatus = creation.canon_status || "NONE";

  if (canonStatus === "OFFICIAL") {
    return {
      message: "Official canon creations cannot be edited from owner tools.",
      code: "OFFICIAL_CANON_LOCKED",
    };
  }

  if (status === "IN_REVIEW") {
    return {
      message: "This creation is currently in review. Editing is paused until review is resolved.",
      code: "CREATION_IN_REVIEW",
    };
  }

  if (status === "ARCHIVED") {
    return {
      message: "Archived creations cannot be edited from normal owner tools.",
      code: "CREATION_ARCHIVED",
    };
  }

  if (visibility === "PUBLIC" && status === "APPROVED") {
    return {
      message:
        "Public approved creations must be unlisted for editing before changes can be saved.",
      code: "PUBLIC_LIVE_LOCKED",
    };
  }

  if (!NORMAL_EDIT_VISIBILITIES.includes(visibility)) {
    return {
      message: "Only private or internal/unlisted creations can be edited.",
      code: "VISIBILITY_NOT_EDITABLE",
    };
  }

  if (!NORMAL_EDIT_STATUSES.includes(status)) {
    return {
      message:
        "This creation must be moved to internal editing before changes can be saved.",
      code: "STATUS_NOT_EDITABLE",
    };
  }

  return null;
}

export async function updateOwnedCreationDraft({
  creationRepository,
  ownerId,
  creationId,
  payload,
}) {
  const { data: currentCreation, error: loadError } =
    await creationRepository.getOwnedById({
      ownerId,
      creationId,
    });

  if (loadError) {
    return {
      data: null,
      error: loadError,
      validationErrors: [],
      code: "CREATION_LOAD_FAILED",
    };
  }

  if (!currentCreation) {
    return {
      data: null,
      error: null,
      validationErrors: [],
      code: "CREATION_NOT_FOUND",
    };
  }

  const lifecycleBlock = getLifecycleEditBlockReason(currentCreation);

  if (lifecycleBlock) {
    return {
      data: null,
      error: null,
      validationErrors: [lifecycleBlock.message],
      code: lifecycleBlock.code,
    };
  }

  const { data: normalized, errors } = normalizeCreationPayload(payload, {
    partial: true,
  });

  if (errors.length) {
    return {
      data: null,
      error: null,
      validationErrors: errors,
      code: "VALIDATION_ERROR",
    };
  }

  if (!Object.keys(normalized).length) {
    return {
      data: null,
      error: null,
      validationErrors: ["No valid update fields provided."],
      code: "EMPTY_PATCH",
    };
  }

  const meaningfulUpdate = evaluateMeaningfulCreationUpdate({
    beforeCreation: currentCreation,
    updates: normalized,
  });

  const updates = meaningfulUpdate.isMeaningful
    ? {
        ...normalized,
        last_meaningful_update_at: new Date().toISOString(),
      }
    : normalized;

  const { data, error } = await creationRepository.updateOwned({
    ownerId,
    creationId,
    updates,
  });

  if (error) {
    return {
      data: null,
      error,
      validationErrors: [],
      code: "UPDATE_FAILED",
    };
  }

  if (data) {
    const { error: edgeSyncError } = await syncCreationAssetEdges({
      creationRepository,
      sourceCreationId: data.id,
      sourceType: data.type,
      data: data.data,
    });

    if (edgeSyncError) {
      return {
        data: null,
        error: edgeSyncError,
        validationErrors: [],
        code: "EDGE_SYNC_FAILED",
      };
    }
  }

  return {
    data: data ? toCreationEditPayload(data) : null,
    error: null,
    validationErrors: [],
    code: null,
  };
}