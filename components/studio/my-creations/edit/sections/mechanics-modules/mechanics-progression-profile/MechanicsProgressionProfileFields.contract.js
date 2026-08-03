export const MECHANICS_PROGRESSION_PROFILE_VIEW_CONTRACT_VERSION =
  "crestfall.loom.mechanics-progression-profile.v1";

export const MECHANICS_PROGRESSION_PROFILE_PHASE = "M3";
export const MECHANICS_PROGRESSION_PROFILE_STATUS =
  "SHARED_EFFECT_DOMAIN_PACKAGE";

export const MECHANICS_PROGRESSION_PROFILE_STORAGE_PATHS = Object.freeze([
  "instanceData.commands[].effects[].progressionProfile",
  "instanceData.commands[].composition.mechanicsSteps[].effects[].progressionProfile",
]);

export const MECHANICS_PROGRESSION_PROFILE_CANONICAL_KEYS = Object.freeze([
  "version",
  "id",
  "label",
  "mode",
  "sourceValueId",
  "rankValueId",
  "advancementCounterId",
  "startingRank",
  "endingRank",
  "allowRankDecrease",
  "maximumPolicy",
  "curve",
  "overrides",
  "thresholds",
  "derivedValues",
]);

export const MECHANICS_PROGRESSION_PROFILE_LEGACY_ALIASES = Object.freeze({
  profileId: Object.freeze(["profile_id"]),
  sourceValueId: Object.freeze([
    "source_value_id",
    "experienceId",
    "experience_id",
  ]),
  rankValueId: Object.freeze(["rank_value_id", "levelId", "level_id"]),
  advancementCounterId: Object.freeze([
    "advancement_counter_id",
    "levelUpCounterId",
    "level_up_counter_id",
  ]),
  startingRank: Object.freeze(["starting_rank", "startingLevel"]),
  endingRank: Object.freeze(["ending_rank", "endingLevel"]),
  allowRankDecrease: Object.freeze(["allow_rank_decrease"]),
  maximumPolicy: Object.freeze(["maximum_policy"]),
  derivedValues: Object.freeze(["derived_values"]),
  thresholds: Object.freeze(["explicitThresholds", "explicit_table"]),
});
