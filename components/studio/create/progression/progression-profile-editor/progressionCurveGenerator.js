export const PROGRESSION_CURVE_GENERATOR_VERSION =
  "progression_curve_generator_v0_1";

export const PROGRESSION_CURVE_MODES = Object.freeze([
  "GENERATED_CURVE",
  "GENERATED_CURVE_WITH_OVERRIDES",
  "EXPLICIT_TABLE",
]);
export const PROGRESSION_LEGACY_CURVE_MODES = Object.freeze([
  "THRESHOLD_TABLE",
]);
export const PROGRESSION_REQUIREMENT_MODES = Object.freeze([
  "PER_LEVEL_COST",
  "CUMULATIVE_THRESHOLD",
]);
export const PROGRESSION_CURVE_TYPES = Object.freeze([
  "LINEAR",
  "GEOMETRIC",
  "POWER",
  "HYBRID",
]);
export const PROGRESSION_ROUNDING_POLICIES = Object.freeze([
  "NONE",
  "ROUND",
  "FLOOR",
  "CEIL",
  "TRUNCATE",
]);
export const PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES = Object.freeze([
  "CONTINUE_ACCUMULATING",
  "CAP_AT_MAXIMUM_THRESHOLD",
]);

const MAX_SAFE_VALUE = Number.MAX_SAFE_INTEGER;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeInteger(value, fallback, minimum, maximum) {
  const number = normalizeNumber(value, fallback);
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = normalizeString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

export function normalizeProgressionCurveMode(
  value,
  fallback = "EXPLICIT_TABLE"
) {
  const normalized = normalizeString(value).toUpperCase();
  if (PROGRESSION_LEGACY_CURVE_MODES.includes(normalized)) {
    return "EXPLICIT_TABLE";
  }
  return PROGRESSION_CURVE_MODES.includes(normalized)
    ? normalized
    : fallback;
}

export function normalizeProgressionRequirementMode(
  value,
  fallback = "PER_LEVEL_COST"
) {
  const normalized = normalizeString(value).toUpperCase();
  if (normalized === "PER_RANK_COST") return "PER_LEVEL_COST";
  return PROGRESSION_REQUIREMENT_MODES.includes(normalized)
    ? normalized
    : fallback;
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

function calculateGeneratedRequirement({ generation, transitionIndex }) {
  const index = Math.max(0, transitionIndex);
  const levelPosition = index + 1;
  const linearBase =
    generation.startingRequirement + generation.linearIncrease * index;

  if (generation.curveType === "LINEAR") return linearBase;
  if (generation.curveType === "GEOMETRIC") {
    return generation.startingRequirement * generation.multiplier ** index;
  }
  if (generation.curveType === "POWER") {
    return generation.startingRequirement * levelPosition ** generation.exponent;
  }

  return (
    linearBase *
    generation.multiplier ** index *
    levelPosition ** Math.max(0, generation.exponent - 1)
  );
}

function normalizeMonotonicThreshold({
  cumulativeExperience,
  previousTotal,
  minimumIncrease,
  roundTo,
  rounding,
}) {
  let next = roundToStep(cumulativeExperience, roundTo, rounding);
  const minimum = previousTotal + minimumIncrease;

  if (!Number.isFinite(next) || next < minimum) {
    next = roundToStep(minimum, roundTo, "CEIL");
  }

  return Math.min(MAX_SAFE_VALUE, Math.max(0, next));
}

function normalizeGeneration(value = {}) {
  return {
    curveType: normalizeEnum(
      value.curveType ?? value.type,
      PROGRESSION_CURVE_TYPES,
      "HYBRID"
    ),
    requirementMode: normalizeProgressionRequirementMode(
      value.requirementMode,
      "PER_LEVEL_COST"
    ),
    startingRequirement: Math.min(
      MAX_SAFE_VALUE,
      Math.max(1, normalizeNumber(value.startingRequirement, 300))
    ),
    linearIncrease: Math.min(
      MAX_SAFE_VALUE,
      Math.max(-MAX_SAFE_VALUE, normalizeNumber(value.linearIncrease, 250))
    ),
    multiplier: Math.min(
      1000000,
      Math.max(0.000001, normalizeNumber(value.multiplier, 1.12))
    ),
    exponent: Math.min(
      100,
      Math.max(0.000001, normalizeNumber(value.exponent, 1.2))
    ),
    minimumIncrease: Math.min(
      MAX_SAFE_VALUE,
      Math.max(0.000001, normalizeNumber(value.minimumIncrease, 50))
    ),
    roundTo: Math.min(
      MAX_SAFE_VALUE,
      Math.max(0.000001, normalizeNumber(value.roundTo, 50))
    ),
    rounding: normalizeEnum(
      value.rounding,
      PROGRESSION_ROUNDING_POLICIES,
      "ROUND"
    ),
  };
}

function normalizeOverride(value = {}, index = 0) {
  return {
    id: normalizeString(value.id) || `override_${index + 1}`,
    level: normalizeInteger(
      value.level ?? value.rank,
      index + 2,
      1,
      1000000
    ),
    experienceCost:
      value.experienceCost === null ||
      value.experienceCost === undefined ||
      value.experienceCost === ""
        ? null
        : Math.max(
            0,
            normalizeNumber(
              value.experienceCost ?? value.requirement ?? value.perRankCost,
              0
            )
          ),
    cumulativeExperience:
      value.cumulativeExperience === null ||
      value.cumulativeExperience === undefined ||
      value.cumulativeExperience === ""
        ? null
        : Math.max(
            0,
            normalizeNumber(
              value.cumulativeExperience ??
                value.totalRequirement ??
                value.threshold,
              0
            )
          ),
  };
}

function normalizeExplicitThreshold(value = {}, index = 0) {
  return {
    level: normalizeInteger(value.level, index + 1, 1, 1000000),
    cumulativeExperience: Math.min(
      MAX_SAFE_VALUE,
      Math.max(0, normalizeNumber(value.cumulativeExperience, 0))
    ),
  };
}

export function generateProgressionThresholdTable(value = {}) {
  const mode = normalizeProgressionCurveMode(value.mode, "EXPLICIT_TABLE");
  const minimumLevel = normalizeInteger(value.minimumLevel, 1, 1, 1000000);
  const maximumLevel = normalizeInteger(
    value.maximumLevel,
    minimumLevel,
    minimumLevel,
    1000000
  );
  const generation = normalizeGeneration(value.generation || value.curve || {});
  const overrides = Array.isArray(value.overrides)
    ? value.overrides.map(normalizeOverride)
    : [];
  const overrideByLevel = new Map(
    overrides.map((override) => [override.level, override])
  );

  const rows = [
    {
      level: minimumLevel,
      experienceCost: 0,
      cumulativeExperience: 0,
      source: "BASE",
    },
  ];

  if (mode === "EXPLICIT_TABLE") {
    const explicitByLevel = new Map(
      (Array.isArray(value.thresholds) ? value.thresholds : [])
        .map(normalizeExplicitThreshold)
        .map((entry) => [entry.level, entry.cumulativeExperience])
    );
    let previousTotal = 0;

    for (let level = minimumLevel + 1; level <= maximumLevel; level += 1) {
      const requested = explicitByLevel.get(level);
      const cumulativeExperience = normalizeMonotonicThreshold({
        cumulativeExperience:
          requested ?? previousTotal + generation.minimumIncrease,
        previousTotal,
        minimumIncrease: generation.minimumIncrease,
        roundTo: generation.roundTo,
        rounding: generation.rounding,
      });
      rows.push({
        level,
        experienceCost: cumulativeExperience - previousTotal,
        cumulativeExperience,
        source: "EXPLICIT",
      });
      previousTotal = cumulativeExperience;
    }

    return rows;
  }

  let previousRequirement = 0;
  let previousTotal = 0;
  const useOverrides = mode === "GENERATED_CURVE_WITH_OVERRIDES";

  for (let level = minimumLevel + 1; level <= maximumLevel; level += 1) {
    const transitionIndex = level - minimumLevel - 1;
    const override = useOverrides ? overrideByLevel.get(level) : null;
    const generated = calculateGeneratedRequirement({
      generation,
      transitionIndex,
    });
    let experienceCost;
    let cumulativeExperience;

    if (generation.requirementMode === "CUMULATIVE_THRESHOLD") {
      cumulativeExperience =
        override?.cumulativeExperience ?? override?.experienceCost ?? generated;
      cumulativeExperience = normalizeMonotonicThreshold({
        cumulativeExperience,
        previousTotal,
        minimumIncrease: generation.minimumIncrease,
        roundTo: generation.roundTo,
        rounding: generation.rounding,
      });
      experienceCost = cumulativeExperience - previousTotal;
    } else {
      experienceCost =
        override?.experienceCost ??
        (override?.cumulativeExperience !== null &&
        override?.cumulativeExperience !== undefined
          ? override.cumulativeExperience - previousTotal
          : generated);
      experienceCost = roundToStep(
        experienceCost,
        generation.roundTo,
        generation.rounding
      );
      experienceCost = Math.max(
        generation.minimumIncrease,
        previousRequirement
          ? Math.max(
              experienceCost,
              previousRequirement + generation.minimumIncrease
            )
          : experienceCost
      );
      experienceCost = roundToStep(
        experienceCost,
        generation.roundTo,
        "CEIL"
      );
      cumulativeExperience = Math.min(
        MAX_SAFE_VALUE,
        previousTotal + experienceCost
      );
    }

    rows.push({
      level,
      experienceCost,
      cumulativeExperience,
      source: override ? "OVERRIDE" : "GENERATED",
    });
    previousRequirement = experienceCost;
    previousTotal = cumulativeExperience;
  }

  return rows;
}
