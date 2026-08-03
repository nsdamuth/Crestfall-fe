import { normalizeCreationPayload } from "@/lib/server/creations/validateCreationPayload";
import { toCreationEditPayload } from "@/lib/server/services/creations/getOwnedCreationForEdit";
import { syncCreationAssetEdges } from "@/lib/server/services/creations/syncCreationAssetEdges";

export async function createOwnedCreationDraft({
  creationRepository,
  ownerId,
  payload,
}) {
  const { data: normalized, errors } = normalizeCreationPayload(payload, {
    partial: false,
  });

  if (errors.length) {
    return {
      data: null,
      error: null,
      validationErrors: errors,
      code: "VALIDATION_ERROR",
    };
  }

  const { data, error } = await creationRepository.createOwned({
    ownerId,
    input: normalized,
  });

  if (error) {
    return {
      data: null,
      error,
      validationErrors: [],
      code: "CREATE_FAILED",
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