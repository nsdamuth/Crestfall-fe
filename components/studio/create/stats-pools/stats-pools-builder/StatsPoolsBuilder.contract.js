export const STATS_POOLS_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";
export const STATS_POOLS_PROFILE_CREATION_TYPE = "STATS_POOLS_PROFILE";

export const STATS_POOLS_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const STATS_POOLS_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

export const STATS_POOLS_BUILDER_VIEW_CONTRACT = Object.freeze({
  version: STATS_POOLS_BUILDER_VIEW_CONTRACT_VERSION,
  feature: "StatsPoolsBuilder",
  description:
    "Portable create-flow presentation for a persisted Stats & Pools Profile.",
});
