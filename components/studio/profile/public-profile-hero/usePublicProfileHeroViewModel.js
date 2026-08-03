const DEFAULT_PROFILE_BANNER = "/assets/covers/banner.png";
const DEFAULT_USERNAME = "crestfallen_creator";

const DEFAULT_STATS = Object.freeze([
  Object.freeze({ value: "0", label: "Characters" }),
  Object.freeze({ value: "0", label: "Rooms" }),
  Object.freeze({ value: "0", label: "Images" }),
  Object.freeze({ value: "0", label: "Likes" }),
]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function fallbackValue(value, fallback) {
  return value || fallback;
}

export function formatPublicProfileDisplayName(username) {
  const text = normalizeText(username).trim();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
}

export function normalizePublicProfileStats(stats) {
  if (!Array.isArray(stats)) {
    return DEFAULT_STATS.map((stat) => ({ ...stat }));
  }

  return stats
    .map((stat) => {
      if (Array.isArray(stat)) {
        return {
          value: fallbackValue(stat[0], "0"),
          label: normalizeText(stat[1]),
        };
      }

      const source = normalizeObject(stat);
      return {
        value: fallbackValue(source.value, "0"),
        label: normalizeText(source.label),
      };
    })
    .filter((stat) => stat.label);
}

export function normalizePublicProfileHero({
  profile,
  stats,
  followCounts,
} = {}) {
  const source = normalizeObject(profile);
  const counts = normalizeObject(followCounts);
  const username = normalizeText(
    fallbackValue(source.username, DEFAULT_USERNAME)
  );
  const encodedUsername = encodeURIComponent(username);

  return {
    username,
    displayName: formatPublicProfileDisplayName(username),
    avatarUrl:
      source.avatar_url || source.avatarUrl || source.avatar_asset_url || null,
    bannerUrl:
      source.banner_url ||
      source.bannerUrl ||
      source.banner_asset_url ||
      DEFAULT_PROFILE_BANNER,
    bio: normalizeText(
      fallbackValue(source.bio, "No public bio yet.")
    ),
    stats: normalizePublicProfileStats(stats),
    followersCount: fallbackValue(counts.followers, 0),
    followingCount: fallbackValue(counts.following, 0),
    followersHref: `/studio/profile/${encodedUsername}/connections?tab=followers`,
    followingHref: `/studio/profile/${encodedUsername}/connections?tab=following`,
  };
}

export function usePublicProfileHeroViewModel(props = {}) {
  return {
    creatorEyebrow: "Crestfall Creator",
    bannerPlaceholderEyebrow: "Banner Slot",
    bannerPlaceholderDescription:
      "Generated profile banner will appear here.",
    ...normalizePublicProfileHero(props),
  };
}
