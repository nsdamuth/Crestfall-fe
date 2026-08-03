import { toCreationEditPayload } from "@/lib/server/services/creations/getOwnedCreationForEdit";

const CANON_LOCKED_STATUSES = new Set([
  "OFFICIAL",
  "CANON",
  "ACCEPTED",
  "CANDIDATE",
]);

function isCanonLocked(canonStatus) {
  return CANON_LOCKED_STATUSES.has(String(canonStatus || "NONE").toUpperCase());
}
function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function archiveOwnedCreation({
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

  if (isCanonLocked(currentCreation.canon_status)) {
    return {
      data: null,
      error: null,
      validationErrors: [
        "Canon creations cannot be archived from owner tools.",
      ],
      code: "CANON_LOCKED",
    };
  }
    if (currentCreation.status === "IN_REVIEW") {
    return {
        data: null,
        error: null,
        validationErrors: [
        "Creations in review must be cancelled from review before they can be archived.",
        ],
        code: "CREATION_IN_REVIEW",
    };
    }
  if (currentCreation.status === "ARCHIVED") {
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

  const lifecycle = isPlainObject(currentData.lifecycle)
    ? currentData.lifecycle
    : {};

  const archivedAt = new Date().toISOString();

  const { data: archivedCreation, error: updateError } =
    await creationRepository.updateOwned({
      ownerId,
      creationId,
      updates: {
        status: "ARCHIVED",
        visibility: "PRIVATE",
        data: {
          ...currentData,
          lifecycle: {
            ...lifecycle,
            archived_at: archivedAt,
          },
        },
      },
    });

  if (updateError) {
    return {
      data: null,
      error: updateError,
      validationErrors: [],
      code: "ARCHIVE_FAILED",
    };
  }

  return {
    data: archivedCreation ? toCreationEditPayload(archivedCreation) : null,
    error: null,
    validationErrors: [],
    code: null,
  };
}