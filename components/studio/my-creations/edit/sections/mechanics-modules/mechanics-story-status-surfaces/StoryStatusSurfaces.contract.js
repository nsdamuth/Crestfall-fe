export const STORY_STATUS_SURFACE_AUTHORING_CONTRACT = Object.freeze({
  version: "story_status_surface_v1",
  storagePath: "instanceData.storyStatusSurfaces",
  hosts: Object.freeze(["INLINE"]),
  placements: Object.freeze(["TOP", "BOTTOM"]),
  sourceDomains: Object.freeze(["MECHANICS", "STATS_POOLS", "PROGRESSION", "WALLET"]),
  statsKinds: Object.freeze(["STAT", "POOL"]),
  mechanicsBuckets: Object.freeze(["METER", "FLAG", "COUNTER", "STAGE"]),
  maxSurfaces: 8,
  maxReadouts: 16,
});

export const STORY_STATUS_SURFACE_CONTRACT_VERSION =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.version;
export const STORY_STATUS_SURFACE_HOSTS =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.hosts;
export const STORY_STATUS_SURFACE_PLACEMENTS =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.placements;
export const STORY_STATUS_SURFACE_SOURCE_DOMAINS =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.sourceDomains;
export const STORY_STATUS_SURFACE_STATS_KINDS =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.statsKinds;
export const STORY_STATUS_SURFACE_MECHANICS_BUCKETS =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.mechanicsBuckets;
export const STORY_STATUS_SURFACE_MAX_SURFACES =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.maxSurfaces;
export const STORY_STATUS_SURFACE_MAX_READOUTS =
  STORY_STATUS_SURFACE_AUTHORING_CONTRACT.maxReadouts;

export const STORY_STATUS_SURFACE_PROGRESSION_VALUE_OPTIONS = Object.freeze([
  Object.freeze({ value: "level", label: "Level" }),
  Object.freeze({ value: "tier", label: "Tier" }),
  Object.freeze({ value: "experience", label: "Experience (XP)" }),
  Object.freeze({ value: "experience_progress", label: "XP Progress" }),
  Object.freeze({ value: "next_level", label: "Next Level" }),
  Object.freeze({ value: "next_level_threshold", label: "Next Level Threshold" }),
  Object.freeze({ value: "experience_to_next_level", label: "XP To Next Level" }),
  Object.freeze({ value: "progress_percent", label: "Progress Percent" }),
  Object.freeze({ value: "unspent_points", label: "Unspent Points" }),
  Object.freeze({ value: "at_maximum_level", label: "At Maximum Level" }),
]);
