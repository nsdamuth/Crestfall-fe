import {
  createMechanicsProgressionProfileBuilder,
  normalizeMechanicsProgressionProfileBuilder,
} from "../mechanicsProgressionProfileBuilder.js";

const FIXTURES = Object.freeze([
  Object.freeze({
    id: "generated",
    label: "Generated Curve",
    description: "Current generated progression with one derived counter.",
    profile: Object.freeze({
      ...createMechanicsProgressionProfileBuilder(),
      id: "character_advancement",
      label: "Character Advancement",
      sourceValueId: "experience_points",
      rankValueId: "character_level",
      advancementCounterId: "level_ups",
      endingRank: 20,
      derivedValues: Object.freeze([
        Object.freeze({
          id: "proficiency_bonus",
          label: "Proficiency Bonus",
          method: "RANK_INTERVAL",
          startingValue: 2,
          increaseEveryRanks: 4,
          increaseAmount: 1,
          rounding: "NONE",
          enabled: true,
        }),
      ]),
    }),
  }),
  Object.freeze({
    id: "overrides",
    label: "Curve With Overrides",
    description: "Generated curve with explicit rank overrides and metadata.",
    profile: Object.freeze({
      ...createMechanicsProgressionProfileBuilder(),
      id: "renown_progression",
      label: "Renown Progression",
      mode: "GENERATED_CURVE_WITH_OVERRIDES",
      curve: Object.freeze({
        ...createMechanicsProgressionProfileBuilder().curve,
        futureCurveMetadata: Object.freeze({ retained: true }),
      }),
      sourceValueId: "renown_points",
      rankValueId: "renown_rank",
      endingRank: 10,
      overrides: Object.freeze([
        Object.freeze({
          id: "rank_5_override",
          rank: 5,
          requirement: 2500,
          totalRequirement: null,
          futureOverrideMetadata: Object.freeze({ retained: true }),
        }),
      ]),
      futureProfileMetadata: Object.freeze({ retained: true }),
    }),
  }),
  Object.freeze({
    id: "explicit",
    label: "Explicit Table",
    description: "Explicit threshold mode retained for JSON-authored tables.",
    profile: Object.freeze({
      ...createMechanicsProgressionProfileBuilder(),
      id: "guild_rank",
      label: "Guild Rank",
      mode: "EXPLICIT_TABLE",
      sourceValueId: "guild_reputation",
      rankValueId: "guild_rank",
      endingRank: 5,
      thresholds: Object.freeze([
        Object.freeze({ rank: 2, totalRequirement: 100 }),
        Object.freeze({ rank: 3, totalRequirement: 300 }),
        Object.freeze({ rank: 4, totalRequirement: 700 }),
        Object.freeze({ rank: 5, totalRequirement: 1500 }),
      ]),
      derivedValues: Object.freeze([
        Object.freeze({
          id: "explicit_reward",
          label: "Explicit Reward",
          method: "EXPLICIT_TABLE",
          rows: Object.freeze([
            Object.freeze({
              rank: 1,
              value: 0,
              futureRowMetadata: Object.freeze({ retained: true }),
            }),
            Object.freeze({ rank: 5, value: 4 }),
          ]),
          enabled: true,
        }),
      ]),
    }),
  }),
  Object.freeze({
    id: "legacy",
    label: "Legacy Aliases",
    description: "Legacy aliases and unknown metadata normalize without loss.",
    profile: Object.freeze({
      profile_id: "legacy_advancement",
      title: "Legacy Advancement",
      progression_mode: "generated_curve_with_overrides",
      experience_id: "legacy_xp",
      level_id: "legacy_level",
      level_up_counter_id: "legacy_level_ups",
      starting_level: 1,
      ending_level: 8,
      allow_rank_decrease: "true",
      maximum_policy: "cap_at_maximum_threshold",
      curve: Object.freeze({
        requirement_mode: "cumulative_threshold",
        method: "linear",
        starting_requirement: 100,
        linear_increase: 100,
        futureCurveMetadata: Object.freeze({ retained: true }),
      }),
      requirementMode: "cumulative_threshold",
      curveType: "linear",
      startingRequirement: 100,
      linearIncrease: 100,
      derived_values: Object.freeze([
        Object.freeze({
          target_id: "talent_points",
          title: "Talent Points",
          type: "linear",
          starting_value: 0,
          multiplier_per_rank: 1,
          increase_amount: 1,
          futureDerivedMetadata: Object.freeze({ retained: true }),
        }),
      ]),
      futureProfileMetadata: Object.freeze({ retained: true }),
    }),
  }),
  Object.freeze({
    id: "recoverable",
    label: "Malformed but Recoverable",
    description: "Invalid values recover to safe bounded progression data.",
    profile: Object.freeze({
      id: "bad progression id",
      label: "Recoverable",
      mode: "MAGIC",
      startingRank: 20,
      endingRank: 1,
      curve: Object.freeze({
        type: "UNKNOWN",
        requirementMode: "INVALID",
        startingRequirement: -50,
        roundTo: 0,
      }),
      overrides: "invalid",
      thresholds: null,
      derivedValues: Object.freeze([
        Object.freeze({
          id: "broken derived",
          method: "INVALID",
          increaseEveryRanks: 0,
          minValue: 10,
          maxValue: 2,
        }),
      ]),
    }),
  }),
]);

export function listMechanicsProgressionProfileFixtures() {
  return FIXTURES.map((fixture) => ({
    ...fixture,
    profile: structuredClone(fixture.profile),
    normalized: normalizeMechanicsProgressionProfileBuilder(fixture.profile),
  }));
}
