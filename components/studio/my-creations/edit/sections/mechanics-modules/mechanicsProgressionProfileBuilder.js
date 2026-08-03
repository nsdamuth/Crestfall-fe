export const MECHANICS_PROGRESSION_PROFILE_VERSION =
  "mechanics_progression_profile_v1";

export const MECHANICS_PROGRESSION_PROFILE_BUILDER_VERSION =
  "mechanics_progression_profile_builder_v1";

export const MECHANICS_PROGRESSION_MODES = [
  "GENERATED_CURVE",
  "GENERATED_CURVE_WITH_OVERRIDES",
  "EXPLICIT_TABLE",
];

export const MECHANICS_PROGRESSION_REQUIREMENT_MODES = [
  "PER_RANK_COST",
  "CUMULATIVE_THRESHOLD",
];

export const MECHANICS_PROGRESSION_CURVE_TYPES = [
  "LINEAR",
  "GEOMETRIC",
  "POWER",
  "HYBRID",
];

export const MECHANICS_PROGRESSION_ROUNDING = [
  "NONE",
  "ROUND",
  "FLOOR",
  "CEIL",
  "TRUNCATE",
];

export const MECHANICS_PROGRESSION_MAXIMUM_POLICIES = [
  "CONTINUE_ACCUMULATING",
  "CAP_AT_MAXIMUM_THRESHOLD",
];

export const MECHANICS_PROGRESSION_DERIVED_METHODS = [
  "RANK_INTERVAL",
  "LINEAR",
  "EXPLICIT_TABLE",
];

const MAX_SAFE_VALUE = Number.MAX_SAFE_INTEGER;
const MAX_RANK_SPAN = 10000;
const MAX_OVERRIDES = 1000;
const MAX_DERIVED_VALUES = 64;
const MAX_EXPLICIT_ROWS = 10000;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;

  const normalized = normalizeString(value).toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;

  return fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampNumber(value, fallback, min, max) {
  const number = normalizeNumber(value, fallback);
  return Math.min(max, Math.max(min, number));
}

function clampInteger(value, fallback, min, max) {
  return Math.trunc(clampNumber(value, fallback, min, max));
}

function normalizeIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function normalizeEnum(value, values, fallback) {
  const requested = normalizeString(value).toUpperCase();
  return values.includes(requested) ? requested : fallback;
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeThresholdRows(value = []) {
  return normalizeArray(value)
    .map((entry, index) => {
      const source = normalizeObject(entry);
      return {
        ...source,
        rank: clampInteger(
          source.rank ?? source.level ?? source.tier,
          index + 1,
          -1000000,
          1000000
        ),
        totalRequirement: clampNumber(
          source.totalRequirement ??
            source.total_requirement ??
            source.threshold ??
            source.totalXp ??
            source.total_xp,
          0,
          0,
          MAX_SAFE_VALUE
        ),
      };
    })
    .filter((entry) => Number.isFinite(entry.rank))
    .slice(0, MAX_EXPLICIT_ROWS)
    .sort((left, right) => left.rank - right.rank);
}

function normalizeOverrides(value = []) {
  return normalizeArray(value)
    .map((entry, index) => {
      const source = normalizeObject(entry);
      return {
        ...source,
        id: normalizeIdentifier(
          source.id || source.key,
          `override_${index + 1}`
        ),
        rank: clampInteger(
          source.rank ?? source.level ?? source.tier,
          index + 2,
          -1000000,
          1000000
        ),
        requirement: normalizeNullableNumber(
          source.requirement ??
            source.perRankCost ??
            source.per_rank_cost ??
            source.cost
        ),
        totalRequirement: normalizeNullableNumber(
          source.totalRequirement ??
            source.total_requirement ??
            source.threshold ??
            source.totalXp ??
            source.total_xp
        ),
      };
    })
    .slice(0, MAX_OVERRIDES)
    .sort((left, right) => left.rank - right.rank);
}

function normalizeDerivedValue(value = {}, index = 0) {
  const source = normalizeObject(value);
  const method = normalizeEnum(
    source.method || source.type,
    MECHANICS_PROGRESSION_DERIVED_METHODS,
    "RANK_INTERVAL"
  );
  const rows = normalizeArray(source.rows || source.table)
    .map((entry, rowIndex) => {
      const row = normalizeObject(entry);
      return {
        ...row,
        rank: clampInteger(
          row.rank ?? row.level,
          rowIndex + 1,
          -1000000,
          1000000
        ),
        value: normalizeNumber(row.value, 0),
      };
    })
    .slice(0, MAX_EXPLICIT_ROWS)
    .sort((left, right) => left.rank - right.rank);
  const minValue = normalizeNullableNumber(
    source.minValue ?? source.min_value ?? source.min
  );
  const maxValue = normalizeNullableNumber(
    source.maxValue ?? source.max_value ?? source.max
  );

  return {
    ...source,
    id: normalizeIdentifier(
      source.id || source.targetId || source.target_id,
      `derived_value_${index + 1}`
    ),
    label:
      normalizeString(source.label || source.title || source.name) ||
      `Derived Value ${index + 1}`,
    bucket: "COUNTER",
    method,
    startingValue: clampNumber(
      source.startingValue ?? source.starting_value,
      0,
      -MAX_SAFE_VALUE,
      MAX_SAFE_VALUE
    ),
    increaseEveryRanks: clampInteger(
      source.increaseEveryRanks ??
        source.increase_every_ranks ??
        source.increaseEveryLevels ??
        source.increase_every_levels,
      1,
      1,
      1000000
    ),
    increaseAmount: clampNumber(
      source.increaseAmount ?? source.increase_amount,
      1,
      -MAX_SAFE_VALUE,
      MAX_SAFE_VALUE
    ),
    multiplierPerRank: clampNumber(
      source.multiplierPerRank ?? source.multiplier_per_rank,
      1,
      -1000000,
      1000000
    ),
    offset: clampNumber(source.offset, 0, -MAX_SAFE_VALUE, MAX_SAFE_VALUE),
    rounding: normalizeEnum(
      source.rounding || source.round,
      MECHANICS_PROGRESSION_ROUNDING,
      "NONE"
    ),
    minValue:
      minValue === null || maxValue === null
        ? minValue
        : Math.min(minValue, maxValue),
    maxValue:
      minValue === null || maxValue === null
        ? maxValue
        : Math.max(minValue, maxValue),
    rows,
    enabled: normalizeBoolean(source.enabled, true),
  };
}

export function createMechanicsProgressionDerivedValue(index = 0) {
  return normalizeDerivedValue(
    {
      id: `derived_value_${index + 1}`,
      label: `Derived Value ${index + 1}`,
      method: "RANK_INTERVAL",
      startingValue: 0,
      increaseEveryRanks: 1,
      increaseAmount: 1,
      multiplierPerRank: 1,
      offset: 0,
      rounding: "NONE",
      minValue: null,
      maxValue: null,
      enabled: true,
    },
    index
  );
}

export function normalizeMechanicsProgressionProfileBuilder(value = {}) {
  const source = normalizeObject(value);
  const startingRank = clampInteger(
    source.startingRank ?? source.starting_rank ?? source.startingLevel,
    1,
    -1000000,
    1000000
  );
  const requestedEndingRank = clampInteger(
    source.endingRank ?? source.ending_rank ?? source.endingLevel,
    20,
    -1000000,
    1000000
  );
  const endingRank = Math.min(
    startingRank + MAX_RANK_SPAN,
    Math.max(startingRank + 1, requestedEndingRank)
  );
  const curveSource = normalizeObject(source.curve);
  const curve = {
    ...curveSource,
    type: normalizeEnum(
      curveSource.type || curveSource.method || source.curveType,
      MECHANICS_PROGRESSION_CURVE_TYPES,
      "HYBRID"
    ),
    requirementMode: normalizeEnum(
      curveSource.requirementMode ||
        curveSource.requirement_mode ||
        source.requirementMode,
      MECHANICS_PROGRESSION_REQUIREMENT_MODES,
      "PER_RANK_COST"
    ),
    startingRequirement: clampNumber(
      curveSource.startingRequirement ??
        curveSource.starting_requirement ??
        source.startingRequirement,
      300,
      1,
      MAX_SAFE_VALUE
    ),
    linearIncrease: clampNumber(
      curveSource.linearIncrease ??
        curveSource.linear_increase ??
        source.linearIncrease,
      250,
      -MAX_SAFE_VALUE,
      MAX_SAFE_VALUE
    ),
    multiplier: clampNumber(
      curveSource.multiplier ?? source.multiplier,
      1.12,
      0.000001,
      1000000
    ),
    exponent: clampNumber(
      curveSource.exponent ?? source.exponent,
      1.2,
      0.000001,
      100
    ),
    minimumIncrease: clampNumber(
      curveSource.minimumIncrease ??
        curveSource.minimum_increase ??
        source.minimumIncrease,
      50,
      0.000001,
      MAX_SAFE_VALUE
    ),
    roundTo: clampNumber(
      curveSource.roundTo ?? curveSource.round_to ?? source.roundTo,
      50,
      0.000001,
      MAX_SAFE_VALUE
    ),
    rounding: normalizeEnum(
      curveSource.rounding || curveSource.round,
      MECHANICS_PROGRESSION_ROUNDING,
      "ROUND"
    ),
  };

  return {
    ...source,
    version:
      normalizeString(source.version) || MECHANICS_PROGRESSION_PROFILE_VERSION,
    id: normalizeIdentifier(
      source.id || source.profileId || source.profile_id,
      "progression"
    ),
    label:
      normalizeString(source.label || source.title || source.name) ||
      "Progression",
    mode: normalizeEnum(
      source.mode || source.progressionMode || source.progression_mode,
      MECHANICS_PROGRESSION_MODES,
      "GENERATED_CURVE"
    ),
    sourceValueId: normalizeIdentifier(
      source.sourceValueId ||
        source.source_value_id ||
        source.experienceId ||
        source.experience_id,
      "experience_points"
    ),
    rankValueId: normalizeIdentifier(
      source.rankValueId ||
        source.rank_value_id ||
        source.levelId ||
        source.level_id,
      "character_level"
    ),
    advancementCounterId: normalizeIdentifier(
      source.advancementCounterId ||
        source.advancement_counter_id ||
        source.levelUpCounterId ||
        source.level_up_counter_id,
      "level_ups"
    ),
    startingRank,
    endingRank,
    allowRankDecrease: normalizeBoolean(
      source.allowRankDecrease ?? source.allow_rank_decrease,
      false
    ),
    maximumPolicy: normalizeEnum(
      source.maximumPolicy || source.maximum_policy,
      MECHANICS_PROGRESSION_MAXIMUM_POLICIES,
      "CONTINUE_ACCUMULATING"
    ),
    curve,
    overrides: normalizeOverrides(source.overrides),
    thresholds: normalizeThresholdRows(
      source.thresholds || source.explicitThresholds || source.explicit_table
    ),
    derivedValues: normalizeArray(
      source.derivedValues || source.derived_values
    )
      .map(normalizeDerivedValue)
      .slice(0, MAX_DERIVED_VALUES),
  };
}

export function createMechanicsProgressionProfileBuilder() {
  return normalizeMechanicsProgressionProfileBuilder({
    id: "progression",
    label: "Progression",
    mode: "GENERATED_CURVE",
    sourceValueId: "experience_points",
    rankValueId: "character_level",
    advancementCounterId: "level_ups",
    startingRank: 1,
    endingRank: 20,
    allowRankDecrease: false,
    maximumPolicy: "CONTINUE_ACCUMULATING",
    curve: {
      type: "HYBRID",
      requirementMode: "PER_RANK_COST",
      startingRequirement: 300,
      linearIncrease: 250,
      multiplier: 1.12,
      exponent: 1.2,
      minimumIncrease: 50,
      roundTo: 50,
      rounding: "ROUND",
    },
    overrides: [],
    thresholds: [],
    derivedValues: [],
  });
}

function applyRounding(value, mode) {
  if (!Number.isFinite(value)) return 0;
  if (mode === "ROUND") return Math.round(value);
  if (mode === "FLOOR") return Math.floor(value);
  if (mode === "CEIL") return Math.ceil(value);
  if (mode === "TRUNCATE") return Math.trunc(value);
  return value;
}

function roundToStep(value, step, rounding) {
  const safeStep = Math.max(Number.EPSILON, normalizeNumber(step, 1));
  return applyRounding(value / safeStep, rounding) * safeStep;
}

function calculateGeneratedRequirement({ curve, transitionIndex }) {
  const index = Math.max(0, transitionIndex);
  const rankPosition = index + 1;
  const linearBase = curve.startingRequirement + curve.linearIncrease * index;

  if (curve.type === "LINEAR") return linearBase;
  if (curve.type === "GEOMETRIC") {
    return curve.startingRequirement * curve.multiplier ** index;
  }
  if (curve.type === "POWER") {
    return curve.startingRequirement * rankPosition ** curve.exponent;
  }

  return (
    linearBase *
    curve.multiplier ** index *
    rankPosition ** Math.max(0, curve.exponent - 1)
  );
}

function getOverrideForRank(profile, rank) {
  return profile.overrides.find((override) => override.rank === rank) || null;
}

function normalizeMonotonicThreshold({
  totalRequirement,
  previousTotal,
  minimumIncrease,
  roundTo,
  rounding,
}) {
  let next = roundToStep(totalRequirement, roundTo, rounding);
  const minimum = previousTotal + minimumIncrease;

  if (!Number.isFinite(next) || next < minimum) {
    next = roundToStep(minimum, roundTo, "CEIL");
  }

  return Math.min(MAX_SAFE_VALUE, Math.max(0, next));
}

export function generateMechanicsProgressionTable(value = {}) {
  const profile = normalizeMechanicsProgressionProfileBuilder(value);
  const rows = [
    {
      rank: profile.startingRank,
      requirement: 0,
      totalRequirement: 0,
    },
  ];

  if (profile.mode === "EXPLICIT_TABLE") {
    const explicitByRank = new Map(
      profile.thresholds.map((entry) => [entry.rank, entry.totalRequirement])
    );
    let previousTotal = 0;

    for (
      let rank = profile.startingRank + 1;
      rank <= profile.endingRank;
      rank += 1
    ) {
      const requested = explicitByRank.get(rank);
      const totalRequirement = normalizeMonotonicThreshold({
        totalRequirement:
          requested ?? previousTotal + profile.curve.minimumIncrease,
        previousTotal,
        minimumIncrease: profile.curve.minimumIncrease,
        roundTo: profile.curve.roundTo,
        rounding: profile.curve.rounding,
      });
      rows.push({
        rank,
        requirement: totalRequirement - previousTotal,
        totalRequirement,
      });
      previousTotal = totalRequirement;
    }

    return rows;
  }

  let previousRequirement = 0;
  let previousTotal = 0;

  for (
    let rank = profile.startingRank + 1;
    rank <= profile.endingRank;
    rank += 1
  ) {
    const transitionIndex = rank - profile.startingRank - 1;
    const override = getOverrideForRank(profile, rank);
    const generated = calculateGeneratedRequirement({
      curve: profile.curve,
      transitionIndex,
    });
    let requirement;
    let totalRequirement;

    if (profile.curve.requirementMode === "CUMULATIVE_THRESHOLD") {
      totalRequirement =
        override?.totalRequirement ??
        override?.requirement ??
        generated;
      totalRequirement = normalizeMonotonicThreshold({
        totalRequirement,
        previousTotal,
        minimumIncrease: profile.curve.minimumIncrease,
        roundTo: profile.curve.roundTo,
        rounding: profile.curve.rounding,
      });
      requirement = totalRequirement - previousTotal;
    } else {
      requirement =
        override?.requirement ??
        (override?.totalRequirement !== null &&
        override?.totalRequirement !== undefined
          ? override.totalRequirement - previousTotal
          : generated);
      requirement = roundToStep(
        requirement,
        profile.curve.roundTo,
        profile.curve.rounding
      );
      requirement = Math.max(
        profile.curve.minimumIncrease,
        previousRequirement
          ? Math.max(requirement, previousRequirement + profile.curve.minimumIncrease)
          : requirement
      );
      requirement = roundToStep(
        requirement,
        profile.curve.roundTo,
        "CEIL"
      );
      totalRequirement = Math.min(
        MAX_SAFE_VALUE,
        previousTotal + requirement
      );
    }

    rows.push({ rank, requirement, totalRequirement });
    previousRequirement = requirement;
    previousTotal = totalRequirement;
  }

  return rows;
}

export function resolveMechanicsProgressionRank(value = {}, sourceValue = 0) {
  const profile = normalizeMechanicsProgressionProfileBuilder(value);
  const table = generateMechanicsProgressionTable(profile);
  const safeSourceValue = Math.max(0, normalizeNumber(sourceValue, 0));
  let rank = profile.startingRank;

  for (const row of table) {
    if (safeSourceValue >= row.totalRequirement) rank = row.rank;
    else break;
  }

  return {
    profile,
    table,
    rank: Math.min(profile.endingRank, Math.max(profile.startingRank, rank)),
    maximumThreshold: table.at(-1)?.totalRequirement ?? 0,
  };
}

export function resolveMechanicsProgressionDerivedValue(
  derivedValue = {},
  rank,
  startingRank = 1
) {
  const rule = normalizeDerivedValue(derivedValue);
  const safeRank = normalizeNumber(rank, startingRank);
  const offset = Math.max(0, safeRank - startingRank);
  let value = rule.startingValue;

  if (rule.method === "RANK_INTERVAL") {
    value +=
      Math.floor(offset / rule.increaseEveryRanks) * rule.increaseAmount;
  } else if (rule.method === "LINEAR") {
    value =
      rule.startingValue * rule.multiplierPerRank ** offset +
      rule.increaseAmount * offset +
      rule.offset;
  } else if (rule.method === "EXPLICIT_TABLE") {
    const selected = rule.rows
      .filter((row) => row.rank <= safeRank)
      .at(-1);
    value = selected ? selected.value : rule.startingValue;
  }

  value = applyRounding(value, rule.rounding);
  if (rule.minValue !== null) value = Math.max(rule.minValue, value);
  if (rule.maxValue !== null) value = Math.min(rule.maxValue, value);

  return value;
}

export function summarizeMechanicsProgressionProfile(value = {}) {
  const profile = normalizeMechanicsProgressionProfileBuilder(value);
  const table = generateMechanicsProgressionTable(profile);
  const maximum = table.at(-1)?.totalRequirement ?? 0;

  return {
    profileId: profile.id,
    mode: profile.mode,
    curveType: profile.curve.type,
    startingRank: profile.startingRank,
    endingRank: profile.endingRank,
    transitionCount: Math.max(0, profile.endingRank - profile.startingRank),
    maximumThreshold: maximum,
    derivedValueCount: profile.derivedValues.filter(
      (entry) => entry.enabled !== false
    ).length,
    label: `${profile.startingRank}–${profile.endingRank} · ${profile.curve.type.replaceAll("_", " ")} · max ${Math.round(maximum).toLocaleString("en-US")}`,
  };
}
