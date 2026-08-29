export const DEFAULT_CHARACTER_CREATION_IMAGE =
  "/assets/covers/crestfall-camellia-cover.png";

export const DEFAULT_GENERAL_CREATION_IMAGE =
  "/assets/covers/crestfall-compass-cover.png";

export const DEFAULT_ROOM_CREATION_IMAGE =
  "/assets/covers/crestfall-statue-cover.png";

export const DEFAULT_NARRATOR_CREATION_IMAGE =
  "/assets/covers/crestfall-book-cover.png";

export const DEFAULT_SCENARIO_CREATION_IMAGE =
  "/assets/covers/crestfall-sundial-cover.png";


export const DEFAULT_POSE_CREATION_IMAGE =
  "/assets/covers/crestfall-ballerina-cover.png";

export const DEFAULT_CLOTHING_CREATION_IMAGE =
  "/assets/covers/crestfall-cloak-cover.png";

export const DEFAULT_TEMPLATE_CREATION_IMAGE =
  "/assets/covers/crestfall-drawings-cover.png";

export const DEFAULT_REGISTRY_CREATION_IMAGE =
  "/assets/covers/crestfall-scrolls-cover.png";

  export const DEFAULT_IMAGE_CREATION_IMAGE =
  "/assets/covers/crestfall-painting-cover.png";

/**
 * Temporary backward-compatible alias for the old misspelled export.
 * Remove later if nothing imports it anymore.
 */

export const DEFAULT_SCENERIO_CREATION_IMAGE =
  DEFAULT_SCENARIO_CREATION_IMAGE;

export const DEFAULT_CREATION_IMAGE = DEFAULT_CHARACTER_CREATION_IMAGE;

const CHARACTER_LIKE_CREATION_TYPES = new Set([
  "CHARACTER",
  "PLAYER_CHARACTER",
]);

const ROOM_LIKE_CREATION_TYPES = new Set([
  "ROOM_TEMPLATE",
]);

const NARRATOR_LIKE_CREATION_TYPES = new Set([
  "NARRATOR",
]);

const SCENARIO_LIKE_CREATION_TYPES = new Set([
  "SCENARIO",
]);


const POSE_LIKE_CREATION_TYPES = new Set([
  "POSE",
]);

const IMAGE_PRESET_LIKE_CREATION_TYPES = new Set([
  "IMAGE_PRESET",
]);

const TEMPLATE_LIKE_CREATION_TYPES = new Set([
  "CHARACTER_TEMPLATE",
]);

const CLOTHING_LIKE_CREATION_TYPES = new Set([
  "CLOTHING",
]);

const CODEX_LIKE_CREATION_TYPES = new Set([
  "RULES_CODEX",
  "LORE",
]);

const PROFILE_LIKE_CREATION_TYPES = new Set([
  "ACTOR_MECHANICS_PROFILE",
  "STATS_POOLS_PROFILE",
  "PROGRESSION_PROFILE",
  "SKILLS_PROFILE",
  "ABILITY_SPELL_PROFILE",
  "WALLET_PROFILE",
]);

const REGISTRY_LIKE_CREATION_TYPES = new Set([
  "NPC_REGISTRY",
  "LOCATION_REGISTRY",
  "FACTION_REGISTRY",
  "ORGANIZATION_REGISTRY",
  "EVENT_REGISTRY",
  "QUEST_REGISTRY",
  "ITEM_REGISTRY",
]);

export function getDefaultCreationImageForType(type) {
  const normalizedType = String(type || "").trim().toUpperCase();

  if (CHARACTER_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_CHARACTER_CREATION_IMAGE;
  }

  if (ROOM_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_ROOM_CREATION_IMAGE;
  }

  if (NARRATOR_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_NARRATOR_CREATION_IMAGE;
  }

  if (SCENARIO_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_SCENARIO_CREATION_IMAGE;
  }



  if (POSE_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_POSE_CREATION_IMAGE;
  }

  if (TEMPLATE_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_TEMPLATE_CREATION_IMAGE;
  }

  if (IMAGE_PRESET_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_IMAGE_CREATION_IMAGE;
  }
  if (CLOTHING_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_CLOTHING_CREATION_IMAGE;
  }
  if (REGISTRY_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_REGISTRY_CREATION_IMAGE;
  }
  if (CODEX_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_NARRATOR_CREATION_IMAGE;
  }
  if (PROFILE_LIKE_CREATION_TYPES.has(normalizedType)) {
    return DEFAULT_NARRATOR_CREATION_IMAGE;
  }
  return DEFAULT_GENERAL_CREATION_IMAGE;
}

export const FEATURED_MEDIA_LABELS = ["Primary", "Alt 1", "Alt 2", "Alt 3"];

export function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getImageUrl(item) {
  if (typeof item === "string") return item;

  if (!isPlainObject(item)) return null;

  return (
    item.displayImageUrl ||
    item.display_image_url ||
    item.displayUrl ||
    item.display_url ||
    item.imageUrl ||
    item.image_url ||
    item.url ||
    item.thumbnailUrl ||
    item.thumbnail_url ||
    item.assetUrl ||
    item.asset_url ||
    null
  );
}

function getThumbnailUrl(item, fallbackUrl = null) {
  if (typeof item === "string") return item;
  if (!isPlainObject(item)) return fallbackUrl;

  return (
    item.thumbnailUrl ||
    item.thumbnail_url ||
    fallbackUrl ||
    null
  );
}

function getOriginalUrl(item, fallbackUrl = null) {
  if (typeof item === "string") return item;
  if (!isPlainObject(item)) return fallbackUrl;

  return (
    item.originalUrl ||
    item.original_url ||
    item.assetUrl ||
    item.asset_url ||
    fallbackUrl ||
    null
  );
}

export function normalizeCreationMediaItem(
  item,
  index,
  { idPrefix = "media", fallbackTitle = "Creation preview" } = {}
) {
  const imageUrl = getImageUrl(item);

  if (!imageUrl) return null;

  const thumbnailUrl = getThumbnailUrl(item, imageUrl);
  const originalUrl = getOriginalUrl(item, imageUrl);

  if (typeof item === "string") {
    return {
      id: `${idPrefix}-${index + 1}`,
      url: imageUrl,
      imageUrl,
      displayUrl: imageUrl,
      displayImageUrl: imageUrl,
      thumbnailUrl,
      originalUrl,
      assetUrl: originalUrl,
      title: fallbackTitle,
      label: FEATURED_MEDIA_LABELS[index] || `Preview ${index + 1}`,
      presentationMetadata: null,
      isPlaceholder: false,
    };
  }

  const presentationMetadata = isPlainObject(item.presentationMetadata)
    ? item.presentationMetadata
    : isPlainObject(item.presentation_metadata)
      ? item.presentation_metadata
      : null;

  return {
    id: item.id || `${idPrefix}-${index + 1}`,
    url: imageUrl,
    imageUrl,
    displayUrl: imageUrl,
    displayImageUrl: imageUrl,
    thumbnailUrl,
    originalUrl,
    assetUrl: originalUrl,
    title: item.title || item.label || fallbackTitle,
    label:
      item.label ||
      item.title ||
      FEATURED_MEDIA_LABELS[index] ||
      `Preview ${index + 1}`,
    presentationMetadata,
    isPlaceholder: Boolean(item.isPlaceholder),
  };
}

function getRawCreationMedia(row = {}, data = {}) {
  const possibleMediaArrays = [
    data.featuredMedia,
    data.featured_media,
    data.featuredImages,
    data.featured_images,
    data.media,
    data.images,
    row.featuredMedia,
    row.featured_media,
    row.media,
    row.images,
  ];

  const mediaArray = possibleMediaArrays.find((item) => Array.isArray(item));

  const directImages = [
    data.imageUrl,
    data.image_url,
    data.coverImage,
    data.cover_image,
    data.profileImage,
    data.profile_image,
    row.imageUrl,
    row.image_url,
    row.coverImage,
    row.cover_image,
  ].filter(Boolean);

  return mediaArray?.length ? mediaArray : directImages;
}

export function buildFeaturedMedia({
  row = {},
  data,
  title,
  max = 4,
  padTo = 0,
  usePlaceholder = true,
  idPrefix = "media",
} = {}) {
  const safeData = isPlainObject(data)
    ? data
    : isPlainObject(row.data)
      ? row.data
      : {};

  const defaultImage = getDefaultCreationImageForType(
    row.type || safeData.type
  );

  const fallbackTitle =
    title || row.title || safeData.title || safeData.name || "Creation preview";

  const rawMedia = getRawCreationMedia(row, safeData);

  const featuredMedia = rawMedia
    .map((item, index) =>
      normalizeCreationMediaItem(item, index, {
        idPrefix,
        fallbackTitle,
      })
    )
    .filter(Boolean)
    .slice(0, max);

  if (!featuredMedia.length && usePlaceholder) {
    featuredMedia.push({
      id: `${idPrefix}-1`,
      url: defaultImage,
      imageUrl: defaultImage,
      title: fallbackTitle,
      label: FEATURED_MEDIA_LABELS[0],
      isPlaceholder: true,
    });
  }

  while (padTo && featuredMedia.length < Math.min(padTo, max)) {
    const index = featuredMedia.length;

    featuredMedia.push({
      id: `${idPrefix}-${index + 1}`,
      url: null,
      imageUrl: null,
      title: fallbackTitle,
      label: FEATURED_MEDIA_LABELS[index] || `Slot ${index + 1}`,
      isPlaceholder: false,
    });
  }

  return featuredMedia;
}

export function getFirstCreationImageUrl(
  featuredMedia,
  fallback = DEFAULT_CREATION_IMAGE
) {
  const firstMediaWithImage = featuredMedia?.find(
    (media) => media?.imageUrl || media?.url
  );

  return firstMediaWithImage?.imageUrl || firstMediaWithImage?.url || fallback;
}