const VALID_LAYOUTS = new Set(["grid", "list"]);
const VALID_ASSET_KINDS = new Set(["image", "character", "story", "adventure"]);
const VALID_BADGE_VARIANTS = new Set(["canon", "status", "meta"]);

function toCallback(value) {
  return typeof value === "function" ? value : null;
}

function toBadges(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((badge) => badge && typeof badge.label === "string" && badge.label)
    .map((badge) => ({
      label: badge.label,
      variant: VALID_BADGE_VARIANTS.has(badge.variant) ? badge.variant : "status",
    }));
}

function toStatValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function useKitCreationCardViewModel(props) {
  const layout = VALID_LAYOUTS.has(props?.layout) ? props.layout : "grid";
  const assetKind = VALID_ASSET_KINDS.has(props?.assetKind) ? props.assetKind : "character";

  return {
    layout,
    assetKind,
    title: typeof props?.title === "string" ? props.title : "",
    subtitle: typeof props?.subtitle === "string" ? props.subtitle : "",
    imageSrc: typeof props?.imageSrc === "string" ? props.imageSrc : null,
    badges: toBadges(props?.badges),
    stats: {
      plays: toStatValue(props?.stats?.plays),
      hearts: toStatValue(props?.stats?.hearts),
      saves: toStatValue(props?.stats?.saves),
      followers: toStatValue(props?.stats?.followers),
    },
    liked: Boolean(props?.liked),
    bookmarked: Boolean(props?.bookmarked),
    isDisabled: Boolean(props?.isDisabled),
    onOpenImageOverlay: toCallback(props?.onOpenImageOverlay),
    onOpenAssetDetail: toCallback(props?.onOpenAssetDetail),
    onLike: toCallback(props?.onLike),
    onBookmark: toCallback(props?.onBookmark),
    onPlay: toCallback(props?.onPlay),
    onGenerate: toCallback(props?.onGenerate),
    isOwner: Boolean(props?.isOwner),
    onEdit: toCallback(props?.onEdit),
    onGenerateImage: toCallback(props?.onGenerateImage),
    onShare: toCallback(props?.onShare),
    onArchive: toCallback(props?.onArchive),
    onDelete: toCallback(props?.onDelete),
  };
}
