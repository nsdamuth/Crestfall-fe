import {
  buildFeaturedMedia,
  getFirstCreationImageUrl,
  isPlainObject,
} from "@/lib/shared/creations/creationMedia";
import {
  getProfileHrefForUsername,
  normalizeProfileUsername,
} from "@/lib/shared/creations/creationAttribution";

function cleanStringArray(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function cleanHandle(value) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim().replace(/^@/, "");

  return trimmed ? `@${trimmed}` : "";
}

function getCreatorFields(row, data) {
  const creatorUsername = normalizeProfileUsername(
    row.creatorUsername ||
      row.creator_username ||
      data.creatorUsername ||
      data.creator_username
  );

  const creatorHandle = creatorUsername
    ? `@${creatorUsername}`
    : cleanHandle(
        row.creatorHandle ||
          row.creator_handle ||
          data.creatorHandle ||
          data.creator_handle
      );

  const creatorProfileHref =
    row.creatorProfileHref ||
    row.creator_profile_href ||
    data.creatorProfileHref ||
    data.creator_profile_href ||
    getProfileHrefForUsername(creatorUsername);

  return {
    creatorUsername,
    creatorHandle,
    creatorProfileHref: creatorProfileHref || null,
  };
}

function toCreationSummary(row, { includeData = false } = {}) {
  const data = isPlainObject(row.data) ? row.data : {};
  const title = row.title || data.title || data.name || "Untitled Creation";
  const creator = getCreatorFields(row, data);

  const featuredMedia = buildFeaturedMedia({
    row,
    data,
    title,
    max: 4,
    padTo: 0,
    usePlaceholder: true,
    idPrefix: "media",
  });

  const stats = isPlainObject(data.stats) ? data.stats : {};

  return {
    id: row.id,
    ownerId: row.owner_id,
    type: row.type,
    title,
    slug: row.slug,
    description:
      row.description ||
      data.description ||
      data.summary ||
      "No description has been added yet.",
    visibility: row.visibility,
    status: row.status,
    contentRating: row.content_rating,
    canonStatus: row.canon_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(includeData ? { data } : {}),

    subtitle:
      data.subtitle ||
      data.role ||
      data.scope ||
      data.archetype ||
      data.tagline ||
      "",

    renderingStyle:
      data.rendering_style ||
      data.renderingStyle ||
      "EITHER",

    creatorUsername: creator.creatorUsername,
    creatorHandle: creator.creatorHandle,
    creatorProfileHref: creator.creatorProfileHref,

    featured: Boolean(data.featured),
    recentlyUpdated: Boolean(data.recentlyUpdated || data.recently_updated),

    stats: {
      likes: toNumber(stats.likes),
      messages: toNumber(stats.messages),
      images: toNumber(stats.images),
      videos: toNumber(stats.videos),
    },

    tags: cleanStringArray(data.tags),
    imageUrl: getFirstCreationImageUrl(featuredMedia),
    featuredMedia,
  };
}

export { toCreationSummary };