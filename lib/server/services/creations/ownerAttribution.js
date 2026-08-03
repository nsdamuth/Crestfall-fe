function cleanUsername(value) {
  if (typeof value !== "string") return "";

  return value.trim().replace(/^@/, "").toLowerCase();
}

function getProfileAttribution(profile) {
  const username = cleanUsername(profile?.username);

  if (!username) {
    return {
      creatorUsername: "",
      creatorHandle: "",
      creatorProfileHref: null,
    };
  }

  return {
    creatorUsername: username,
    creatorHandle: `@${username}`,
    creatorProfileHref: `/studio/profile/${encodeURIComponent(username)}`,
  };
}

export async function getOwnerAttributionById({
  creationRepository,
  ownerIds = [],
}) {
  const uniqueOwnerIds = [...new Set(ownerIds.filter(Boolean))];

  if (!uniqueOwnerIds.length) {
    return {
      data: new Map(),
      error: null,
    };
  }

  const { data: profiles, error } = await creationRepository.listOwnerProfiles({
    ownerIds: uniqueOwnerIds,
  });

  if (error) {
    return {
      data: new Map(),
      error,
    };
  }

  const attributionByOwnerId = new Map();

  profiles?.forEach((profile) => {
    attributionByOwnerId.set(profile.id, getProfileAttribution(profile));
  });

  return {
    data: attributionByOwnerId,
    error: null,
  };
}

export function applyOwnerAttribution(row, attributionByOwnerId) {
  const attribution = attributionByOwnerId.get(row.owner_id) || {};
  const data =
    row.data && typeof row.data === "object" && !Array.isArray(row.data)
      ? row.data
      : {};

  return {
    ...row,
    creatorUsername: attribution.creatorUsername || "",
    creatorHandle: attribution.creatorHandle || "",
    creatorProfileHref: attribution.creatorProfileHref || null,
    data: {
      ...data,
      creator_username: attribution.creatorUsername || data.creator_username,
      creator_handle: attribution.creatorHandle || data.creator_handle,
      creator_profile_href:
        attribution.creatorProfileHref || data.creator_profile_href,
    },
  };
}