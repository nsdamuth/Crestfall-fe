import { PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS } from "./PublicProfileBadges.contract";

const CATEGORY_LABELS = Object.freeze({
  STAFF: "Staff",
  EARLY_ACCESS: "Early Access",
  CONTRIBUTION: "Contribution",
  COMMUNITY: "Community",
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toSortOrder(value) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function normalizeBadge(badge, index) {
  const category = normalizeString(badge?.category).toUpperCase();
  const slug = normalizeString(badge?.slug);
  const label = normalizeString(badge?.label) || slug || "Badge";

  return {
    id:
      normalizeString(badge?.id) ||
      slug ||
      `profile-badge-${index + 1}`,
    slug,
    label,
    description: normalizeString(badge?.description),
    category,
    categoryLabel:
      CATEGORY_LABELS[category] ||
      normalizeString(badge?.categoryLabel) ||
      "Badge",
    imageUrl:
      normalizeString(badge?.imageUrl || badge?.image_url) || null,
    awardedAt:
      normalizeString(badge?.awardedAt || badge?.awarded_at) || null,
    sortOrder: toSortOrder(badge?.sortOrder ?? badge?.sort_order),
  };
}

export function buildPublicProfileBadgesViewProps({ badges = [] } = {}) {
  const normalizedBadges = (Array.isArray(badges) ? badges : [])
    .filter((badge) => badge && typeof badge === "object")
    .map(normalizeBadge)
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.label.localeCompare(right.label);
    });

  return {
    ...PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS,
    badges: normalizedBadges,
  };
}

export function usePublicProfileBadgesViewModel(props) {
  return buildPublicProfileBadgesViewProps(props);
}
