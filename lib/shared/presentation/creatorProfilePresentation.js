import { projectCommunityCreation } from "./communityPresentation.js";

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function statsArrayToMap(stats = []) {
  return (Array.isArray(stats) ? stats : []).reduce((map, row) => {
    if (!Array.isArray(row) || row.length < 2) return map;
    const [value, label] = row;
    const key = normalizeText(label).toLowerCase();
    if (key) map[key] = normalizeNumber(value);
    return map;
  }, {});
}

export function projectLiveCreatorProfile({
  profile = {},
  creations = [],
  badges = [],
  stats = [],
  followCounts = {},
  followState = {},
} = {}) {
  const publicStats = statsArrayToMap(stats);
  const handle = normalizeText(profile.username || profile.handle).replace(/^@/, "");

  return {
    profile: {
      ...profile,
      id: normalizeText(profile.id),
      handle,
      displayName: normalizeText(
        profile.displayName || profile.display_name || handle,
        "Crestfall Creator"
      ),
      bio: normalizeText(
        profile.description || profile.bio || profile.tagline,
        "No public bio yet."
      ),
      avatarSrc: normalizeText(profile.avatarUrl || profile.avatar_url) || null,
    },
    stats: {
      followers: normalizeNumber(followCounts.followers),
      following: normalizeNumber(followCounts.following),
      likes: normalizeNumber(publicStats.likes),
      works: Array.isArray(creations) ? creations.length : 0,
    },
    followState: {
      isFollowing: Boolean(followState.isFollowing),
      canFollow: Boolean(followState.canFollow),
      isOwnProfile: Boolean(followState.isOwnProfile),
    },
    works: (Array.isArray(creations) ? creations : []).map((creation, index) =>
      projectCommunityCreation(creation, index)
    ),
    badges: (Array.isArray(badges) ? badges : []).map((badge, index) => ({
      id: normalizeText(badge.id, `creator-badge-${index + 1}`),
      label: normalizeText(badge.label, "Badge"),
      description: normalizeText(badge.description, "Public creator badge."),
      imageSrc: normalizeText(badge.imageUrl || badge.image_url) || null,
    })),
  };
}

export function projectLiveCreatorConnections({
  profile = {},
  followCounts = {},
  followers = [],
  following = [],
} = {}) {
  const normalizeConnection = (entry, index) => ({
    id: normalizeText(entry.id, `connection-${index + 1}`),
    handle: normalizeText(entry.username || entry.handle).replace(/^@/, ""),
    displayName: normalizeText(
      entry.displayName || entry.display_name || entry.username || entry.handle,
      "Crestfall Creator"
    ),
    avatarSrc: normalizeText(entry.avatarUrl || entry.avatar_url) || null,
    isFollowing: Boolean(entry.followState?.isFollowing),
    canFollow: Boolean(entry.followState?.canFollow),
    isOwnProfile: Boolean(entry.followState?.isOwnProfile),
  });

  return {
    profile: {
      handle: normalizeText(profile.username || profile.handle).replace(/^@/, ""),
      displayName: normalizeText(
        profile.displayName || profile.display_name || profile.username,
        "Crestfall Creator"
      ),
    },
    followCounts: {
      followers: normalizeNumber(followCounts.followers),
      following: normalizeNumber(followCounts.following),
    },
    followers: (Array.isArray(followers) ? followers : []).map(normalizeConnection),
    following: (Array.isArray(following) ? following : []).map(normalizeConnection),
  };
}
