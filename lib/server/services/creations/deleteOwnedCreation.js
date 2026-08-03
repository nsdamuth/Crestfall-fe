const DELETABLE_STATUSES = new Set(["DRAFT", "ARCHIVED"]);

const CANON_LOCKED_STATUSES = new Set([
  "OFFICIAL",
  "CANON",
  "ACCEPTED",
  "CANDIDATE",
]);

function isCanonLocked(canonStatus) {
  return CANON_LOCKED_STATUSES.has(String(canonStatus || "NONE").toUpperCase());
}

function normalizeStatus(status) {
  return String(status || "DRAFT").toUpperCase();
}

export async function deleteOwnedCreation({
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
        "Canon creations cannot be deleted from owner tools.",
      ],
      code: "CANON_LOCKED",
    };
  }

  const status = normalizeStatus(currentCreation.status);

  if (!DELETABLE_STATUSES.has(status)) {
    return {
      data: null,
      error: null,
      validationErrors: [
        "Only draft or archived creations can be deleted.",
      ],
      code: "CREATION_NOT_DELETABLE",
    };
  }

  const { data: deletedCreation, error: deleteError } =
    await creationRepository.deleteOwned({
      ownerId,
      creationId,
    });

  if (deleteError) {
    return {
      data: null,
      error: deleteError,
      validationErrors: [],
      code: "DELETE_FAILED",
    };
  }

  return {
    data: deletedCreation
      ? {
          id: deletedCreation.id,
        }
      : null,
    error: null,
    validationErrors: [],
    code: null,
  };
}