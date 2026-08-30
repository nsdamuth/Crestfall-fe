import { getFirstCreationMediaUrl } from "../creations/creationMedia.js";

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeUsername(value) {
  return normalizeText(value).replace(/^@/, "").toLowerCase();
}

function normalizeFeaturedImage(creation = {}) {
  const media = Array.isArray(creation.featuredMedia)
    ? creation.featuredMedia
    : Array.isArray(creation.featured_media)
      ? creation.featured_media
      : [];

  return (
    getFirstCreationMediaUrl(media, {
      variant: "thumbnail",
      fallback:
        creation.thumbnailUrl ||
        creation.thumbnail_url ||
        creation.imageUrl ||
        creation.image_url ||
        null,
    }) || null
  );
}

function buildRecentWorkThumbnails(creatorId, creations = []) {
  return creations
    .filter((creation) => creation?.ownerId === creatorId || creation?.owner_id === creatorId)
    .map((creation, index) => {
      const imageSrc = normalizeFeaturedImage(creation);
      if (!imageSrc) return null;

      return {
        id: normalizeText(creation.id, `${creatorId}-work-${index + 1}`),
        creationId: normalizeText(creation.id) || null,
        imageSrc,
        alt: normalizeText(creation.title, "Recent creator work"),
        title: normalizeText(creation.title, "Untitled creation"),
        updatedAt: creation.updatedAt || creation.updated_at || null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);
}

export function projectCommunityCreator(
  creator = {},
  {
    creations = [],
    followingUsernames = [],
    viewerUsername = null,
  } = {}
) {
  const username = normalizeUsername(creator.username || creator.handle || creator.displayName);
  const viewer = normalizeUsername(viewerUsername);
  const following = new Set(
    (Array.isArray(followingUsernames) ? followingUsernames : []).map(normalizeUsername).filter(Boolean)
  );
  const stats = creator?.stats && typeof creator.stats === "object" ? creator.stats : {};

  return {
    id: normalizeText(creator.id, username || "creator"),
    username,
    handle: username ? `@${username}` : "@creator",
    displayName: normalizeText(
      creator.displayName || creator.display_name || creator.username || creator.handle,
      "Crestfall Creator"
    ),
    summary: normalizeText(
      creator.tagline || creator.description || creator.bio,
      "Crestfall creator."
    ),
    avatarSrc: normalizeText(creator.avatarUrl || creator.avatar_url) || null,
    canonContributor: Boolean(creator.canonContributor || creator.canon_contributor || normalizeNumber(stats.canon) > 0),
    followers: normalizeNumber(stats.followers),
    likes: normalizeNumber(stats.likes),
    plays: null,
    works: normalizeNumber(stats.characters ?? stats.works),
    recency: 0,
    thumbnails: buildRecentWorkThumbnails(creator.id, creations),
    isFollowing: Boolean(username && following.has(username)),
    canFollow: Boolean(username && viewer && username !== viewer),
    isOwnProfile: Boolean(username && viewer && username === viewer),
  };
}

export function projectCommunityCreators(
  creators = [],
  options = {}
) {
  return Array.isArray(creators)
    ? creators.map((creator) => projectCommunityCreator(creator, options))
    : [];
}
