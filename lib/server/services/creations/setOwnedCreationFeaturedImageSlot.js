import { getImageOutputDisplayUrl } from "@/lib/server/image-generation/imageOutputUrls";

const FEATURED_SLOT_KEYS = new Set(["primary", "alt1", "alt2", "alt3"]);
const ELIGIBLE_IMAGE_MODERATION_STATUSES = new Set(["CLEAR", "APPROVED"]);

export async function setOwnedCreationFeaturedImageSlot({
  creationRepository,
  ownerId,
  creationId,
  slotKey,
  libraryEntryId,
}) {
  const normalizedSlotKey = String(slotKey || "").trim().toLowerCase();

  if (!FEATURED_SLOT_KEYS.has(normalizedSlotKey)) {
    return {
      data: null,
      error: null,
      validationErrors: ["Invalid featured image slot."],
      code: "INVALID_FEATURED_SLOT",
    };
  }

  if (!libraryEntryId) {
    return {
      data: null,
      error: null,
      validationErrors: ["Library entry is required."],
      code: "LIBRARY_ENTRY_REQUIRED",
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

  const { data: entry, error: entryError } =
    await creationRepository.getCreationImageLibraryEntryById({
      creationId,
      libraryEntryId,
    });

  if (entryError) {
    return {
      data: null,
      error: entryError,
      validationErrors: [],
      code: "LIBRARY_ENTRY_LOAD_FAILED",
    };
  }

  if (!entry) {
    return {
      data: null,
      error: null,
      validationErrors: ["Image is not in this character library."],
      code: "LIBRARY_ENTRY_NOT_FOUND",
    };
  }

  if (entry.library_visibility !== "VISIBLE") {
    return {
      data: null,
      error: null,
      validationErrors: ["Hidden library images cannot be used as featured images."],
      code: "LIBRARY_ENTRY_HIDDEN",
    };
  }

  if (entry.library_review_status !== "APPROVED") {
    return {
      data: null,
      error: null,
      validationErrors: ["Unapproved library images cannot be used as featured images."],
      code: "LIBRARY_ENTRY_NOT_APPROVED",
    };
  }

  const { data: output, error: outputError } =
    await creationRepository.getImageGenerationOutputById({
      outputId: entry.image_output_id,
    });

  if (outputError) {
    return {
      data: null,
      error: outputError,
      validationErrors: [],
      code: "IMAGE_OUTPUT_LOAD_FAILED",
    };
  }

  if (!output) {
    return {
      data: null,
      error: null,
      validationErrors: ["Image output could not be found."],
      code: "IMAGE_OUTPUT_NOT_FOUND",
    };
  }

  const moderationStatus = output.moderation_status || "CLEAR";

  if (!ELIGIBLE_IMAGE_MODERATION_STATUSES.has(moderationStatus)) {
    return {
      data: null,
      error: null,
      validationErrors: ["Flagged or rejected images cannot be used as featured images."],
      code: "IMAGE_OUTPUT_NOT_ELIGIBLE",
    };
  }

  const { data: slot, error: slotError } =
    await creationRepository.upsertCreationFeaturedImageSlot({
      creationId,
      slotKey: normalizedSlotKey,
      libraryEntryId,
      assignedByUserId: ownerId,
    });

  if (slotError) {
    return {
      data: null,
      error: slotError,
      validationErrors: [],
      code: "FEATURED_SLOT_SAVE_FAILED",
    };
  }

  return {
    data: {
      slot,
      image: {
        id: entry.id,
        creationId: entry.creation_id,
        imageOutputId: entry.image_output_id,
        displayUrl: getImageOutputDisplayUrl(output),
        thumbnailUrl: output.thumbnail_url || null,
        storagePath: output.storage_path || null,
        moderationStatus,
      },
    },
    error: null,
    validationErrors: [],
    code: null,
  };
}