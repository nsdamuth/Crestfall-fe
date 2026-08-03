function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function getCreationStats(creation) {
  const data = isPlainObject(creation.data) ? creation.data : {};
  const stats = isPlainObject(data.stats) ? data.stats : {};

  return {
    likes: toNumber(stats.likes),
    messages: toNumber(stats.messages),
    images: toNumber(stats.images),
    videos: toNumber(stats.videos),
  };
}

function summarizeCreations(creations) {
  return creations.reduce(
    (summary, creation) => {
      const stats = getCreationStats(creation);

      summary.total += 1;
      summary.likes += stats.likes;
      summary.messages += stats.messages;
      summary.images += stats.images;
      summary.videos += stats.videos;

      if (creation.type === "CHARACTER") {
        summary.characters += 1;
      }

      if (creation.canon_status === "OFFICIAL") {
        summary.canon += 1;
      }

      return summary;
    },
    {
      total: 0,
      characters: 0,
      canon: 0,
      likes: 0,
      messages: 0,
      images: 0,
      videos: 0,
    }
  );
}

async function getFollowCountsByProfileId(profileFollowRepository, profiles) {
  if (!profileFollowRepository || !profiles.length) {
    return {
      countsByProfileId: new Map(),
      error: null,
    };
  }

  const results = await Promise.all(
    profiles.map(async (profile) => {
      const { data, error } = await profileFollowRepository.getPublicCounts({
        profileId: profile.id,
      });

      return {
        profileId: profile.id,
        counts: data || { followers: 0, following: 0 },
        error,
      };
    })
  );

  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    return {
      countsByProfileId: new Map(),
      error: failedResult.error,
    };
  }

  return {
    countsByProfileId: new Map(
      results.map((result) => [result.profileId, result.counts])
    ),
    error: null,
  };
}

function toPublicCreatorSummary(profile, creations = [], followCounts = {}) {
  const stats = summarizeCreations(creations);
  const handle = profile.username;
  const displayName = profile.username || "Crestfall Creator";

  return {
    id: profile.id,
    displayName,
    handle,
    username: profile.username,
    tagline: profile.tagline || profile.bio || "Crestfall creator.",
    description: profile.description || profile.bio || "No public bio yet.",
    avatarUrl: profile.avatar_url || null,
    bannerUrl: null,
    featured: false,
    recentlyActive: false,
    canonContributor: stats.canon > 0,
    stats: {
      followers: followCounts.followers || 0,
      following: followCounts.following || 0,
      characters: stats.total,
      canon: stats.canon,
      likes: stats.likes,
      messages: stats.messages,
      images: stats.images,
      videos: stats.videos,
    },
  };
}

export async function listPublicCreatorSummaries({
  profileRepository,
  creationRepository,
  profileFollowRepository,
}) {
  const { data: profiles, error: profileError } =
    await profileRepository.listPublic();

  if (profileError) {
    return {
      data: null,
      error: profileError,
    };
  }

  const publicProfiles = profiles || [];
  const ownerIds = publicProfiles.map((profile) => profile.id);

  const { data: creations, error: creationsError } =
    await creationRepository.listPublicForOwners({
      ownerIds,
    });

  if (creationsError) {
    return {
      data: null,
      error: creationsError,
    };
  }

  const { countsByProfileId, error: followCountsError } =
    await getFollowCountsByProfileId(profileFollowRepository, publicProfiles);

  if (followCountsError) {
    return {
      data: null,
      error: followCountsError,
    };
  }

  const creationsByOwner = (creations || []).reduce((map, creation) => {
    const ownerCreations = map.get(creation.owner_id) || [];
    ownerCreations.push(creation);
    map.set(creation.owner_id, ownerCreations);
    return map;
  }, new Map());

  return {
    data: publicProfiles.map((profile) =>
      toPublicCreatorSummary(
        profile,
        creationsByOwner.get(profile.id) || [],
        countsByProfileId.get(profile.id) || { followers: 0, following: 0 }
      )
    ),
    error: null,
  };
}