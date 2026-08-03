import { getImageOutputDisplayUrl } from "@/lib/server/image-generation/imageOutputUrls";

const FEATURED_SLOT_KEYS = ["primary", "alt1", "alt2", "alt3"];

const FEATURED_SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};

const ELIGIBLE_IMAGE_MODERATION_STATUSES = new Set(["CLEAR", "APPROVED"]);

function toOutputMap(outputs = []) {
  return new Map(outputs.map((output) => [output.id, output]));
}

function isFeaturedEligible({ entry, output }) {
  if (!entry || !output) return false;

  const moderationStatus = output.moderation_status || "CLEAR";

  return (
    entry.library_visibility === "VISIBLE" &&
    entry.library_review_status === "APPROVED" &&
    ELIGIBLE_IMAGE_MODERATION_STATUSES.has(moderationStatus)
  );
}

function toLibraryImagePayload({ entry, output }) {
  const moderationStatus = output?.moderation_status || "CLEAR";
  const displayUrl = getImageOutputDisplayUrl(output || {});

  return {
    id: entry.id,
    creationId: entry.creation_id,
    imageOutputId: entry.image_output_id,
    ownerId: output?.owner_id || null,
    linkedByUserId: entry.linked_by_user_id,

    libraryVisibility: entry.library_visibility,
    libraryReviewStatus: entry.library_review_status,
    isHiddenFromLibrary: entry.library_visibility === "HIDDEN",

    moderationStatus,
    isFlagged: moderationStatus === "FLAGGED",
    isRejected: moderationStatus === "REJECTED",
    canUseAsFeatured: isFeaturedEligible({ entry, output }),

    displayUrl,
    thumbnailUrl: output?.thumbnail_url || null,
    storagePath: output?.storage_path || null,
    storageProvider: output?.storage_provider || null,

    width: output?.width || null,
    height: output?.height || null,
    seed: output?.seed || null,
    contentRating: output?.content_rating || "SFW",

    metadata: entry.metadata || {},
    providerMetadata: output?.provider_metadata || {},

    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    outputCreatedAt: output?.created_at || null,
  };
}

function buildFeaturedSlots({ slots = [], imageByEntryId }) {
  const bySlotKey = new Map(slots.map((slot) => [slot.slot_key, slot]));

  return FEATURED_SLOT_KEYS.reduce((acc, slotKey) => {
    const slot = bySlotKey.get(slotKey);
    const image = slot ? imageByEntryId.get(slot.library_entry_id) : null;

    acc[slotKey] = {
      slotKey,
      label: FEATURED_SLOT_LABELS[slotKey],
      libraryEntryId: slot?.library_entry_id || null,
      assignedByUserId: slot?.assigned_by_user_id || null,
      assignedAt: slot?.assigned_at || null,
      image: image || null,
    };

    return acc;
  }, {});
}

export async function getOwnedCreationImageLibrary({
  creationRepository,
  ownerId,
  creationId,
}) {
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

  const {
    data: entries,
    error: entriesError,
  } = await creationRepository.listCreationImageLibraryEntries({
    creationId,
  });

  if (entriesError) {
    return {
      data: null,
      error: entriesError,
      validationErrors: [],
      code: "IMAGE_LIBRARY_LOAD_FAILED",
    };
  }

  const outputIds = [
    ...new Set((entries || []).map((entry) => entry.image_output_id)),
  ];

  const {
    data: outputs,
    error: outputsError,
  } = await creationRepository.listImageGenerationOutputsByIds({
    outputIds,
  });

  if (outputsError) {
    return {
      data: null,
      error: outputsError,
      validationErrors: [],
      code: "IMAGE_OUTPUTS_LOAD_FAILED",
    };
  }

  const {
    data: slots,
    error: slotsError,
  } = await creationRepository.listCreationFeaturedImageSlots({
    creationId,
  });

  if (slotsError) {
    return {
      data: null,
      error: slotsError,
      validationErrors: [],
      code: "FEATURED_SLOTS_LOAD_FAILED",
    };
  }

  const outputById = toOutputMap(outputs || []);

  const images = (entries || []).map((entry) =>
    toLibraryImagePayload({
      entry,
      output: outputById.get(entry.image_output_id),
    })
  );

  const imageByEntryId = new Map(images.map((image) => [image.id, image]));

  return {
    data: {
      creation: {
        id: creation.id,
        ownerId: creation.owner_id,
        type: creation.type,
        title: creation.title,
        visibility: creation.visibility,
        status: creation.status,
        contentRating: creation.content_rating,
      },
      images,
      featuredSlots: buildFeaturedSlots({
        slots: slots || [],
        imageByEntryId,
      }),
    },
    error: null,
    validationErrors: [],
    code: null,
  };
}