export async function followPublicProfile({
  profileRepository,
  profileFollowRepository,
  followerId,
  username,
}) {
  const { data: targetProfile, error: profileError } =
    await profileRepository.getPublicByUsername({ username });

  if (profileError) {
    return { data: null, error: profileError, validationErrors: [] };
  }

  if (!targetProfile) {
    return {
      data: null,
      error: null,
      validationErrors: ["Profile not found."],
      code: "PROFILE_NOT_FOUND",
    };
  }

  if (targetProfile.id === followerId) {
    return {
      data: null,
      error: null,
      validationErrors: ["You cannot follow yourself."],
      code: "SELF_FOLLOW",
    };
  }

  const { error: followError } = await profileFollowRepository.follow({
    followerId,
    followingId: targetProfile.id,
  });

  if (followError) {
    return { data: null, error: followError, validationErrors: [] };
  }

  const { data: counts, error: countsError } =
    await profileFollowRepository.getPublicCounts({
      profileId: targetProfile.id,
    });

  if (countsError) {
    return { data: null, error: countsError, validationErrors: [] };
  }

  return {
    data: {
      isFollowing: true,
      canFollow: true,
      counts,
    },
    error: null,
    validationErrors: [],
  };
}