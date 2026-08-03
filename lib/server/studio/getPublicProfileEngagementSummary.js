export async function getPublicProfileEngagementSummary({
  baseStats = [],
  baseFollowCounts = {
    followers: 0,
    following: 0,
  },
} = {}) {
  return {
    stats: baseStats,
    followCounts: baseFollowCounts,
    loadError: null,
  };
}