export async function unfollowPublicProfile({
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

  const { error: unfollowError } = await profileFollowRepository.unfollow({
    followerId,
    followingId: targetProfile.id,
  });

  if (unfollowError) {
    return { data: null, error: unfollowError, validationErrors: [] };
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
      isFollowing: false,
      canFollow: targetProfile.id !== followerId,
      counts,
    },
    error: null,
    validationErrors: [],
  };
}