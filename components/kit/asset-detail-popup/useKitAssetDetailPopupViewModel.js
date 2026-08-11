"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Primary-action label is
// derived here (display concern only, not a data transform): R9
// rules Play universal for all three asset kinds, superseding the
// prior per-kind Continue label for adventure.
function toCallback(value) {
  return typeof value === "function" ? value : null;
}

function normalizeMedia(media) {
  if (!Array.isArray(media)) return [];

  return media
    .filter((item) => item && typeof item.src === "string" && item.src)
    .map((item, index) => ({
      id: item.id || `media-${index + 1}`,
      src: item.src,
    }))
    .slice(0, 4);
}

function normalizeCreator(creator) {
  if (!creator || typeof creator.handle !== "string" || !creator.handle) return null;
  return { handle: creator.handle, href: creator.href || null };
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag) => typeof tag === "string" && tag);
}

export function useKitAssetDetailPopupViewModel({
  assetKind = "character",
  title = "",
  subtitle = "",
  creator = null,
  media = [],
  badges = [],
  stats = {},
  description = "",
  tags = [],
  isLiked = false,
  isSaved = false,
  onLike = null,
  onPrimaryAction = null,
  onShare = null,
  onSave = null,
  onViewCatalogue = null,
  credits = [],
  onClose = null,
} = {}) {
  return {
    assetKind,
    primaryActionLabel: "Play",
    title,
    subtitle,
    creator: normalizeCreator(creator),
    media: normalizeMedia(media),
    badges: Array.isArray(badges) ? badges : [],
    stats: stats || {},
    description,
    tags: normalizeTags(tags),
    isLiked: Boolean(isLiked),
    isSaved: Boolean(isSaved),
    onLike: toCallback(onLike),
    onPrimaryAction: toCallback(onPrimaryAction),
    onShare: toCallback(onShare),
    onSave: toCallback(onSave),
    onViewCatalogue: toCallback(onViewCatalogue),
    credits: Array.isArray(credits) ? credits : [],
    onClose: toCallback(onClose),
  };
}
