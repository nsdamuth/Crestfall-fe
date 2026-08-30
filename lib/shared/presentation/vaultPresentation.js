import { getCreationCredits } from "../creations/creationAttribution.js";
import { buildFeaturedMedia, getFirstAssignedCreationImageUrl } from "../creations/creationMedia.js";
import { getCreationTypeDisplayName } from "./terminology.js";
import { getAssetKindForCreationType } from "./typeBuckets.js";

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

function normalizeDetailMedia(media = [], idPrefix = "vault-media") {
  if (!Array.isArray(media)) return [];

  return media
    .filter((entry) => !entry?.isPlaceholder)
    .map((entry, index) => {
      const displaySrc = normalizeText(
        entry?.displayImageUrl ||
          entry?.displayUrl ||
          entry?.imageUrl ||
          entry?.url ||
          entry?.src
      );
      if (!displaySrc) return null;

      return {
        id: normalizeText(entry?.id, `${idPrefix}-${index + 1}`),
        src: displaySrc,
        displaySrc,
        thumbnailSrc: normalizeText(
          entry?.thumbnailUrl || entry?.thumbnail_url || displaySrc
        ),
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

export function getVaultVisibility(creation = {}) {
  const canonStatus = normalizeText(
    creation.canonStatus || creation.canon_status || creation.data?.canonStatus || creation.data?.canon_status,
    "NONE"
  ).toUpperCase();

  if (["OFFICIAL", "CANON", "ACCEPTED"].includes(canonStatus)) {
    return "CANON";
  }

  const visibility = normalizeText(
    creation.visibility || creation.data?.visibility,
    "PRIVATE"
  ).toUpperCase();

  // V2 uses the product-facing word Internal for Crestfall's current
  // UNLISTED owner-editing state.
  if (visibility === "UNLISTED" || visibility === "INTERNAL") {
    return "INTERNAL";
  }

  if (visibility === "PUBLIC") return "PUBLIC";
  return "PRIVATE";
}

export function projectCreationToVaultItem(creation = {}, index = 0, { isOwn = true } = {}) {
  const data = normalizeObject(creation.data);
  const type = normalizeText(creation.type || data.type, "CHARACTER").toUpperCase();
  const title = normalizeText(creation.title || data.title || data.name, "Untitled Creation");
  const typeLabel = getCreationTypeDisplayName(type);
  const subtitleDetail = normalizeText(
    creation.subtitle || data.subtitle || data.role || data.scope || data.archetype || data.tagline
  );
  const featuredMedia = Array.isArray(creation.featuredMedia) && creation.featuredMedia.length
    ? creation.featuredMedia
    : buildFeaturedMedia({
        row: creation,
        data,
        title,
        max: 4,
        padTo: 0,
        usePlaceholder: false,
        idPrefix: `vault-${creation.id || index}-media`,
      });
  const detailMedia = normalizeDetailMedia(
    featuredMedia,
    `vault-${creation.id || index}-media`
  );
  const stats = normalizeObject(creation.stats || data.stats);
  const updatedAt = creation.updatedAt || creation.updated_at || data.updatedAt || data.updated_at || null;
  const updatedTimestamp = updatedAt ? new Date(updatedAt).getTime() : 0;
  const creatorHandle = normalizeText(
    creation.creatorHandle || data.creator_handle || data.creatorHandle
  );
  const visibility = getVaultVisibility(creation);

  return {
    id: normalizeText(creation.id, `vault-creation-${index}`),
    rawCreation: creation,
    type,
    assetKind: getAssetKindForCreationType(type),
    title,
    subtitle: [typeLabel, subtitleDetail].filter(Boolean).join(" · "),
    imageSrc:
      detailMedia[0]?.displaySrc ||
      getFirstAssignedCreationImageUrl(featuredMedia, null),
    detailMedia,
    extraMedia: detailMedia.slice(1).map((media) => media.displaySrc),
    isOwn: Boolean(isOwn),
    visibility,
    isCanon: visibility === "CANON",
    isRemix: Boolean(data.isRemix || data.is_remix || creation.isRemix),
    plays: normalizeNumber(stats.plays ?? stats.messages ?? stats.interactions),
    hearts: normalizeNumber(stats.likes ?? stats.hearts),
    saves: normalizeNumber(stats.bookmarks ?? stats.saves),
    recency: Number.isFinite(updatedTimestamp) ? updatedTimestamp : 0,
    description: normalizeText(
      creation.description || data.description || data.summary,
      "No description has been added yet."
    ),
    creatorHandle,
    creatorHref:
      creation.creatorProfileHref || data.creator_profile_href || data.creatorProfileHref || null,
    status: normalizeText(creation.status || data.status, "DRAFT").toUpperCase(),
    canonStatus: normalizeText(
      creation.canonStatus || creation.canon_status || data.canonStatus || data.canon_status,
      "NONE"
    ).toUpperCase(),
    credits: getCreationCredits(creation),
  };
}

export function projectCreationsToVaultItems(creations = [], options = {}) {
  return Array.isArray(creations)
    ? creations.map((creation, index) => projectCreationToVaultItem(creation, index, options))
    : [];
}

export function canArchiveVaultItem(item = {}) {
  const canonStatus = normalizeText(item.canonStatus, "NONE").toUpperCase();
  const status = normalizeText(item.status, "DRAFT").toUpperCase();

  return !["OFFICIAL", "CANON", "ACCEPTED", "CANDIDATE"].includes(canonStatus) && status !== "ARCHIVED";
}

export function canDeleteVaultItem(item = {}) {
  const canonStatus = normalizeText(item.canonStatus, "NONE").toUpperCase();
  const status = normalizeText(item.status, "DRAFT").toUpperCase();

  return (
    !["OFFICIAL", "CANON", "ACCEPTED", "CANDIDATE"].includes(canonStatus) &&
    ["DRAFT", "ARCHIVED"].includes(status)
  );
}
