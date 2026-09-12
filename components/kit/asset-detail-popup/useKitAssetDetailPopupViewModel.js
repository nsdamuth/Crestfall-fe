"use client";

import {
  buildCreationCardMetrics,
  normalizeCreationCardMetricEntries,
} from "../../../lib/shared/presentation/creationCardMetrics.js";

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
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;

      const displaySrc =
        (typeof item.displaySrc === "string" && item.displaySrc) ||
        (typeof item.src === "string" && item.src) ||
        "";

      if (!displaySrc) return null;

      const thumbnailSrc =
        (typeof item.thumbnailSrc === "string" && item.thumbnailSrc) ||
        displaySrc;

      return {
        id: item.id || `media-${index + 1}`,
        src: displaySrc,
        displaySrc,
        thumbnailSrc,
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

function normalizeCreator(creator) {
  if (!creator || typeof creator.handle !== "string" || !creator.handle) return null;
  return { handle: creator.handle, href: creator.href || null };
}


function inferCreationType(assetKind) {
  switch (String(assetKind || "").trim().toLowerCase()) {
    case "character":
      return "CHARACTER";
    case "story":
    case "adventure":
      return "ROOM_TEMPLATE";
    default:
      return String(assetKind || "").trim().toUpperCase();
  }
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag) => typeof tag === "string" && tag);
}

function normalizeRelatedItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const id = String(item.id || "").trim();
      if (!id) return null;

      return {
        id,
        title: typeof item.title === "string" ? item.title : "Untitled",
        imageSrc:
          (typeof item.imageSrc === "string" && item.imageSrc) ||
          (typeof item.cardSrc === "string" && item.cardSrc) ||
          "",
        metrics: normalizeCreationCardMetricEntries(item.metrics),
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : index,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .slice(0, 4);
}

export function useKitAssetDetailPopupViewModel({
  assetKind = "character",
  creationType = null,
  title = "",
  subtitle = "",
  creator = null,
  media = [],
  badges = [],
  metrics = null,
  usageMetrics = null,
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
  moreFromCreator = [],
  onOpenMoreFromCreator = null,
  onClose = null,
  // onEdit, ADDED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5, Studio
  // brief S5). Optional; the View renders the Edit action only when
  // this resolves to a function.
  onEdit = null,
} = {}) {
  return {
    assetKind,
    primaryActionLabel: "Play",
    title,
    subtitle,
    creator: normalizeCreator(creator),
    media: normalizeMedia(media),
    badges: Array.isArray(badges) ? badges : [],
    metrics: Array.isArray(metrics)
      ? normalizeCreationCardMetricEntries(metrics)
      : buildCreationCardMetrics({
          creationType: creationType || inferCreationType(assetKind),
          usageMetrics,
          fallbackStats: stats,
        }),
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
    moreFromCreator: normalizeRelatedItems(moreFromCreator),
    onOpenMoreFromCreator: toCallback(onOpenMoreFromCreator),
    onClose: toCallback(onClose),
    onEdit: toCallback(onEdit),
  };
}
