const ALLOWED_LIBRARY_VISIBILITY = new Set(["VISIBLE", "HIDDEN"]);

export async function updateOwnedCreationImageLibraryEntry({
  creationRepository,
  ownerId,
  creationId,
  libraryEntryId,
  libraryVisibility,
}) {
  const normalizedVisibility = String(libraryVisibility || "")
    .trim()
    .toUpperCase();

  if (!ALLOWED_LIBRARY_VISIBILITY.has(normalizedVisibility)) {
    return {
      data: null,
      error: null,
      validationErrors: ["Invalid library visibility."],
      code: "INVALID_LIBRARY_VISIBILITY",
    };
  }

  const { data: creation, error: creationError } =
    await creationRepository.getOwnedById({
      ownerId,
      creationId,
    });

  if (creationError) {
    return {
      data: null,
      error: creationError,
      validationErrors: [],
      code: "CREATION_LOAD_FAILED",
    };
  }

  if (!creation) {
    return {
      data: null,
      error: null,
      validationErrors: [],
      code: "CREATION_NOT_FOUND",
    };
  }

  const { data: existingEntry, error: existingEntryError } =
    await creationRepository.getCreationImageLibraryEntryById({
      creationId,
      libraryEntryId,
    });

  if (existingEntryError) {
    return {
      data: null,
      error: existingEntryError,
      validationErrors: [],
      code: "LIBRARY_ENTRY_LOAD_FAILED",
    };
  }

  if (!existingEntry) {
    return {
      data: null,
      error: null,
      validationErrors: ["Image is not in this character library."],
      code: "LIBRARY_ENTRY_NOT_FOUND",
    };
  }

  const { data: entry, error: updateError } =
    await creationRepository.updateCreationImageLibraryEntryVisibility({
      creationId,
      libraryEntryId,
      libraryVisibility: normalizedVisibility,
      hiddenByUserId: ownerId,
    });

  if (updateError) {
    return {
      data: null,
      error: updateError,
      validationErrors: [],
      code: "LIBRARY_ENTRY_UPDATE_FAILED",
    };
  }

  return {
    data: {
      entry,
    },
    error: null,
    validationErrors: [],
    code: null,
  };
}