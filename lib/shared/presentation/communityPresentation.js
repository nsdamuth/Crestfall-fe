import { getCreationCredits } from "../creations/creationAttribution.js";
import { isLegacyDefaultCreationImageSrc } from "../creations/creationMedia.js";
import { getCreationTypeDisplayName } from "./terminology.js";
import { getAssetKindForCreationType } from "./typeBuckets.js";

const CONTENT_RATING_TO_TIER = Object.freeze({
  SFW: "EVERYONE",
  MATURE: "TEEN",
  EXPLICIT: "ADULT",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeRenderingStyle(value) {
  const normalized = normalizeText(value, "EITHER").toUpperCase();

  if (normalized === "ANIME") return "anime";
  if (normalized === "REALISTIC") return "realistic";
  if (normalized === "AUTO") return "auto";
  return "either";
}

function normalizeFeaturedMedia(creation = {}) {
  const media = Array.isArray(creation.featuredMedia)
    ? creation.featuredMedia
    : [];

  return media
    .map((entry, index) => {
      const displaySrc = normalizeText(
        entry?.displayImageUrl ||
          entry?.displayUrl ||
          entry?.imageUrl ||
          entry?.url ||
          entry?.src
      );
      if (!displaySrc) return null;

      const thumbnailSrc = normalizeText(
        entry?.thumbnailUrl || entry?.thumbnail_url || displaySrc
      );

      return {
        id: normalizeText(entry?.id, `community-media-${index + 1}`),
        src: displaySrc,
        displaySrc,
        thumbnailSrc,
        isPlaceholder: Boolean(entry?.isPlaceholder),
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

export function projectCommunityCreation(creation = {}, index = 0) {
  const data = normalizeObject(creation.data);
  const stats = normalizeObject(creation.stats || data.stats);
  const type = normalizeText(creation.type || data.type, "CHARACTER").toUpperCase();
  const title = normalizeText(
    creation.title || data.title || data.name,
    "Untitled Creation"
  );
  const creatorHandle = normalizeText(
    creation.creatorHandle || data.creator_handle || data.creatorHandle
  );
  const creatorHref =
    creation.creatorProfileHref ||
    data.creator_profile_href ||
    data.creatorProfileHref ||
    null;
  const media = normalizeFeaturedMedia(creation);
  const assignedMedia = media.find((entry) => !entry.isPlaceholder) || null;
  const directImageSrc = normalizeText(creation.imageUrl);
  const imageSrc =
    assignedMedia?.src ||
    (directImageSrc && !isLegacyDefaultCreationImageSrc(directImageSrc)
      ? directImageSrc
      : null);
  const canonStatus = normalizeText(
    creation.canonStatus || creation.canon_status || data.canonStatus || data.canon_status,
    "NONE"
  ).toUpperCase();
  const updatedAt = creation.updatedAt || creation.updated_at || null;
  const updatedTimestamp = updatedAt ? new Date(updatedAt).getTime() : 0;
  const typeLabel = getCreationTypeDisplayName(type);

  return {
    id: normalizeText(creation.id, `community-creation-${index}`),
    rawCreation: creation,
    type,
    assetKind: getAssetKindForCreationType(type),
    title,
    subtitle: [typeLabel, creatorHandle ? `by ${creatorHandle}` : ""]
      .filter(Boolean)
      .join(" · "),
    creatorHandle,
    creatorHref,
    creator: creatorHandle ? { handle: creatorHandle, href: creatorHref } : null,
    imageSrc,
    detailMedia: media.filter((entry) => !entry.isPlaceholder),
    extraMedia: media.filter((entry) => !entry.isPlaceholder).slice(1).map((entry) => entry.src),
    isCanon: ["OFFICIAL", "ACCEPTED", "CANON"].includes(canonStatus),
    isFeatured: Boolean(creation.featured || data.featured),
    isRemixable: Boolean(
      creation.isRemixable ||
        creation.is_remixable ||
        data.isRemixable ||
        data.is_remixable
    ),
    ratingTier:
      CONTENT_RATING_TO_TIER[
        normalizeText(creation.contentRating || creation.content_rating, "SFW").toUpperCase()
      ] || "EVERYONE",
    renderingStyle: normalizeRenderingStyle(
      creation.renderingStyle || creation.rendering_style || data.renderingStyle || data.rendering_style
    ),
    plays: normalizeNumber(stats.messages ?? stats.plays ?? stats.interactions),
    hearts: normalizeNumber(stats.likes ?? stats.hearts),
    saves: normalizeNumber(stats.bookmarks ?? stats.saves),
    recency: Number.isFinite(updatedTimestamp) ? updatedTimestamp : 0,
    recentlyUpdated: Boolean(
      creation.recentlyUpdated || creation.recently_updated || data.recentlyUpdated || data.recently_updated
    ),
    description: normalizeText(
      creation.description || data.description || data.summary,
      "No description has been added yet."
    ),
    tags: Array.isArray(creation.tags)
      ? creation.tags.filter((tag) => typeof tag === "string" && tag.trim())
      : [],
    credits: getCreationCredits(creation),
    canonStatus,
  };
}

export function projectCommunityCreations(creations = []) {
  return Array.isArray(creations)
    ? creations.map((creation, index) => projectCommunityCreation(creation, index))
    : [];
}
