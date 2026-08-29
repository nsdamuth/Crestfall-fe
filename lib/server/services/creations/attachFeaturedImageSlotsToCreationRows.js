import { getImageOutputDisplayUrl } from "@/lib/server/image-generation/imageOutputUrls";
import { isPlainObject } from "@/lib/shared/creations/creationMedia";

const FEATURED_SLOT_ORDER = ["primary", "alt1", "alt2", "alt3"];

const FEATURED_SLOT_LABELS = {
  primary: "Primary",
  alt1: "Alt 1",
  alt2: "Alt 2",
  alt3: "Alt 3",
};

const ELIGIBLE_IMAGE_MODERATION_STATUSES = new Set(["CLEAR", "APPROVED"]);

function uniqueValues(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function getRowTitle(row = {}) {
  const data = isPlainObject(row.data) ? row.data : {};

  return row.title || data.title || data.name || "Creation preview";
}

function isSlotImageEligible({ entry, output }) {
  if (!entry || !output) return false;

  const moderationStatus = output.moderation_status || "CLEAR";

  return (
    entry.library_visibility === "VISIBLE" &&
    entry.library_review_status === "APPROVED" &&
    ELIGIBLE_IMAGE_MODERATION_STATUSES.has(moderationStatus)
  );
}

function buildMediaItem({ slotKey, entry, output, title }) {
  if (!isSlotImageEligible({ entry, output })) return null;

  const displayUrl = getImageOutputDisplayUrl(output);

  if (!displayUrl) return null;

  const thumbnailUrl =
    output.thumbnail_url ||
    output.thumbnailUrl ||
    displayUrl;

  return {
    id: entry.id,
    label: FEATURED_SLOT_LABELS[slotKey] || "Preview",
    title,
    url: displayUrl,
    imageUrl: displayUrl,
    displayUrl,
    displayImageUrl: displayUrl,
    thumbnailUrl,
    assetUrl: displayUrl,
    imageOutputId: output.id,
    libraryEntryId: entry.id,
    storagePath: output.storage_path || null,
    storageProvider: output.storage_provider || null,
    contentRating: output.content_rating || "SFW",
    isPlaceholder: false,
  };
}

function buildFeaturedMediaForRow({
  row,
  slotsByCreationId,
  entriesById,
  outputsById,
}) {
  const slots = slotsByCreationId.get(row.id) || [];
  const slotsByKey = new Map(slots.map((slot) => [slot.slot_key, slot]));
  const title = getRowTitle(row);

  return FEATURED_SLOT_ORDER.map((slotKey) => {
    const slot = slotsByKey.get(slotKey);
    const entry = slot ? entriesById.get(slot.library_entry_id) : null;
    const output = entry ? outputsById.get(entry.image_output_id) : null;

    return buildMediaItem({
      slotKey,
      entry,
      output,
      title,
    });
  }).filter(Boolean);
}

function attachFeaturedMediaToRow(row, featuredMedia) {
  if (!featuredMedia.length) return row;

  const data = isPlainObject(row.data) ? row.data : {};

  return {
    ...row,
    featuredMedia,
    featured_media: featuredMedia,
    data: {
      ...data,
      featuredMedia,
      featured_media: featuredMedia,
    },
  };
}

export async function attachFeaturedImageSlotsToCreationRows({
  creationRepository,
  rows = [],
}) {
  if (!rows.length) {
    return {
      data: [],
      error: null,
    };
  }

  const creationIds = uniqueValues(rows.map((row) => row.id));

  const {
    data: slots,
    error: slotsError,
  } = await creationRepository.listCreationFeaturedImageSlotsByCreationIds({
    creationIds,
  });

  if (slotsError) {
    return {
      data: null,
      error: slotsError,
    };
  }

  const libraryEntryIds = uniqueValues(
    (slots || []).map((slot) => slot.library_entry_id)
  );

  const {
    data: entries,
    error: entriesError,
  } = await creationRepository.listCreationImageLibraryEntriesByIds({
    libraryEntryIds,
  });

  if (entriesError) {
    return {
      data: null,
      error: entriesError,
    };
  }

  const outputIds = uniqueValues(
    (entries || []).map((entry) => entry.image_output_id)
  );

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
    };
  }

  const slotsByCreationId = new Map();
  const entriesById = new Map((entries || []).map((entry) => [entry.id, entry]));
  const outputsById = new Map((outputs || []).map((output) => [output.id, output]));

  (slots || []).forEach((slot) => {
    const existing = slotsByCreationId.get(slot.creation_id) || [];
    existing.push(slot);
    slotsByCreationId.set(slot.creation_id, existing);
  });

  return {
    data: rows.map((row) => {
      const featuredMedia = buildFeaturedMediaForRow({
        row,
        slotsByCreationId,
        entriesById,
        outputsById,
      });

      return attachFeaturedMediaToRow(row, featuredMedia);
    }),
    error: null,
  };
}