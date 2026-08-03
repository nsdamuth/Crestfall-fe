import { toCreationEditPayload } from "@/lib/server/services/creations/getOwnedCreationForEdit";

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function moveOwnedCreationToInternalEditing({
  creationRepository,
  ownerId,
  creationId,
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

  if (currentCreation.canon_status === "OFFICIAL") {
    return {
      data: null,
      error: null,
      validationErrors: [
        "Official canon creations cannot be moved to internal editing from owner tools.",
      ],
      code: "OFFICIAL_CANON_LOCKED",
    };
  }

  if (currentCreation.status === "IN_REVIEW") {
    return {
      data: null,
      error: null,
      validationErrors: [
        "This creation is currently in review and cannot be moved to internal editing.",
      ],
      code: "CREATION_IN_REVIEW",
    };
  }

  if (currentCreation.status === "ARCHIVED") {
    return {
      data: null,
      error: null,
      validationErrors: [
        "Archived creations cannot be moved to internal editing.",
      ],
      code: "CREATION_ARCHIVED",
    };
  }

  if (currentCreation.status !== "APPROVED") {
    return {
      data: toCreationEditPayload(currentCreation),
      error: null,
      validationErrors: [],
      code: null,
    };
  }

  const currentData = isPlainObject(currentCreation.data)
    ? currentCreation.data
    : {};

  const review = isPlainObject(currentData.review)
    ? currentData.review
    : {};

  const movedAt = new Date().toISOString();

  const { data: updatedCreation, error: updateError } =
    await creationRepository.updateOwned({
      ownerId,
      creationId,
      updates: {
        visibility: "UNLISTED",
        status: "DRAFT",
        data: {
          ...currentData,
          review: {
            ...review,
            needs_resubmission: true,
            moved_to_internal_editing_at: movedAt,
            previous_status: currentCreation.status,
            previous_visibility: currentCreation.visibility,
          },
        },
      },
    });

  if (updateError) {
    return {
      data: null,
      error: updateError,
      validationErrors: [],
      code: "MOVE_TO_INTERNAL_EDITING_FAILED",
    };
  }

  return {
    data: updatedCreation ? toCreationEditPayload(updatedCreation) : null,
    error: null,
    validationErrors: [],
    code: null,
  };
}