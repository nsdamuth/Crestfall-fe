import {
  generateProgressionThresholdTable,
  normalizeProgressionCurveMode,
  normalizeProgressionRequirementMode,
  PROGRESSION_CURVE_GENERATOR_VERSION,
  PROGRESSION_CURVE_MODES,
  PROGRESSION_CURVE_TYPES,
  PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES,
  PROGRESSION_REQUIREMENT_MODES,
  PROGRESSION_ROUNDING_POLICIES,
} from "./progressionCurveGenerator.js";

export {
  generateProgressionThresholdTable,
  PROGRESSION_CURVE_GENERATOR_VERSION,
  PROGRESSION_CURVE_MODES,
  PROGRESSION_CURVE_TYPES,
  PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES,
  PROGRESSION_REQUIREMENT_MODES,
  PROGRESSION_ROUNDING_POLICIES,
};

export const PROGRESSION_PROFILE_CONTRACT_VERSION =
  "progression_profile_contract_v0";
export const PROGRESSION_CURVE_DEFINITION_VERSION =
  "progression_curve_definition_v0";
export const PROGRESSION_TIER_DEFINITION_VERSION =
  "progression_tier_definition_v0";

export const PROGRESSION_PROFILE_EDITOR_CONTRACT_VERSION =
  "progression_profile_editor_view_contract_v0_1";

export const PROGRESSION_PROFILE_EDITOR_LIMITS = Object.freeze({
  maxLevels: 10000,
  maxExplicitLevels: 500,
  maxOverrides: 1000,
  maxTiers: 64,
  maxTags: 24,
  maxIdentifierLength: 96,
  maxTitleLength: 160,
  maxDescriptionLength: 2400,
  maxExperience: Number.MAX_SAFE_INTEGER,
  maxPreviewRows: 12,
});

export const PROGRESSION_CURVE_MODE_OPTIONS = Object.freeze([
  {
    value: "GENERATED_CURVE",
    label: "Generated Curve",
    description: "Calculate every level threshold from reusable curve settings.",
  },
  {
    value: "GENERATED_CURVE_WITH_OVERRIDES",
    label: "Generated Curve with Overrides",
    description: "Generate the curve, then replace selected level costs or thresholds.",
  },
  {
    value: "EXPLICIT_TABLE",
    label: "Explicit Threshold Table",
    description: "Author one cumulative XP threshold for every level.",
  },
]);

export const PROGRESSION_CURVE_TYPE_OPTIONS = Object.freeze([
  { value: "LINEAR", label: "Linear" },
  { value: "GEOMETRIC", label: "Geometric" },
  { value: "POWER", label: "Power" },
  { value: "HYBRID", label: "Hybrid" },
]);

export const PROGRESSION_REQUIREMENT_MODE_OPTIONS = Object.freeze([
  { value: "PER_LEVEL_COST", label: "Per-level XP cost" },
  { value: "CUMULATIVE_THRESHOLD", label: "Cumulative XP threshold" },
]);

export const PROGRESSION_ROUNDING_OPTIONS = Object.freeze([
  { value: "NONE", label: "None" },
  { value: "ROUND", label: "Round" },
  { value: "FLOOR", label: "Floor" },
  { value: "CEIL", label: "Ceil" },
  { value: "TRUNCATE", label: "Truncate" },
]);

export const PROGRESSION_MAXIMUM_EXPERIENCE_OPTIONS = Object.freeze([
  { value: "CONTINUE_ACCUMULATING", label: "Continue accumulating XP" },
  { value: "CAP_AT_MAXIMUM_THRESHOLD", label: "Cap XP at maximum threshold" },
]);

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = normalizeString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function normalizeNumber(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function normalizeNullableNumber(value, minimum = 0) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(minimum, parsed);
}

function normalizeIdentifier(value, fallback = "") {
  return normalizeString(value).toLowerCase() || fallback;
}

function normalizeTags(value) {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const seen = new Set();
  const result = [];

  for (const item of source) {
    const candidate = normalizeString(item).toLowerCase();
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    result.push(candidate);
    if (result.length >= PROGRESSION_PROFILE_EDITOR_LIMITS.maxTags) break;
  }

  return result;
}

function issue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function createDefaultProgressionGeneration() {
  return {
    curveType: "HYBRID",
    requirementMode: "PER_LEVEL_COST",
    startingRequirement: 300,
    linearIncrease: 250,
    multiplier: 1.12,
    exponent: 1.2,
    minimumIncrease: 50,
    roundTo: 50,
    rounding: "ROUND",
  };
}

export function createDefaultProgressionThresholds({
  minimumLevel = 1,
  maximumLevel = 5,
} = {}) {
  const minimum = normalizeInteger(
    minimumLevel,
    1,
    1,
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
  );
  const maximum = normalizeInteger(
    maximumLevel,
    minimum,
    minimum,
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
  );
  const thresholds = [];
  let cumulativeExperience = 0;

  for (let level = minimum; level <= maximum; level += 1) {
    thresholds.push({ level, cumulativeExperience, metadata: {} });
    cumulativeExperience += Math.max(100, (level - minimum + 1) * 50);
  }

  return thresholds;
}

export function createDefaultProgressionProfile() {
  return {
    contractVersion: PROGRESSION_PROFILE_CONTRACT_VERSION,
    title: "Adventurer Progression",
    description:
      "A deterministic cumulative-experience progression curve with reusable level tiers.",
    enabled: true,
    curve: {
      definitionVersion: PROGRESSION_CURVE_DEFINITION_VERSION,
      mode: "EXPLICIT_TABLE",
      minimumLevel: 1,
      maximumLevel: 5,
      capPolicy: "CLAMP_TO_MAXIMUM",
      maximumExperiencePolicy: "CONTINUE_ACCUMULATING",
      generation: createDefaultProgressionGeneration(),
      overrides: [],
      thresholds: [
        { level: 1, cumulativeExperience: 0, metadata: {} },
        { level: 2, cumulativeExperience: 100, metadata: {} },
        { level: 3, cumulativeExperience: 250, metadata: {} },
        { level: 4, cumulativeExperience: 450, metadata: {} },
        { level: 5, cumulativeExperience: 700, metadata: {} },
      ],
      metadata: {},
    },
    tierDefinitions: [
      {
        definitionVersion: PROGRESSION_TIER_DEFINITION_VERSION,
        id: "tier.novice",
        title: "Novice",
        description: "Entry progression tier.",
        enabled: true,
        minimumLevel: 1,
        maximumLevel: 2,
        tags: ["entry"],
        order: 0,
        metadata: {},
      },
      {
        definitionVersion: PROGRESSION_TIER_DEFINITION_VERSION,
        id: "tier.veteran",
        title: "Veteran",
        description: "Experienced progression tier.",
        enabled: true,
        minimumLevel: 3,
        maximumLevel: 4,
        tags: ["experienced"],
        order: 1,
        metadata: {},
      },
      {
        definitionVersion: PROGRESSION_TIER_DEFINITION_VERSION,
        id: "tier.master",
        title: "Master",
        description: "Maximum-level progression tier.",
        enabled: true,
        minimumLevel: 5,
        maximumLevel: 5,
        tags: ["capstone"],
        order: 2,
        metadata: {},
      },
    ],
    tags: ["progression"],
    metadata: {},
  };
}

export function createDefaultGeneratedProgressionProfile() {
  const profile = createDefaultProgressionProfile();
  return {
    ...profile,
    title: "Generated Character Advancement",
    description:
      "A compact algorithmic progression curve equivalent to the MC7X.1 character advancement profile.",
    curve: {
      ...profile.curve,
      mode: "GENERATED_CURVE",
      maximumLevel: 20,
      thresholds: [],
      overrides: [],
      generation: createDefaultProgressionGeneration(),
    },
    tierDefinitions: [],
    tags: ["progression", "generated"],
  };
}

export function normalizeProgressionThreshold(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    level: normalizeInteger(
      source.level,
      index + 1,
      1,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels
    ),
    cumulativeExperience: normalizeInteger(
      source.cumulativeExperience,
      0,
      0,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExperience
    ),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeProgressionCurveOverride(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    id: normalizeIdentifier(source.id, `override_${index + 1}`),
    level: normalizeInteger(
      source.level ?? source.rank,
      index + 2,
      1,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels
    ),
    experienceCost: normalizeNullableNumber(
      source.experienceCost ?? source.requirement
    ),
    cumulativeExperience: normalizeNullableNumber(
      source.cumulativeExperience ?? source.totalRequirement
    ),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeProgressionGeneration(value = {}) {
  const source = normalizeObject(value);
  const fallback = createDefaultProgressionGeneration();
  return {
    curveType: normalizeEnum(
      source.curveType ?? source.type,
      PROGRESSION_CURVE_TYPES,
      fallback.curveType
    ),
    requirementMode: normalizeProgressionRequirementMode(
      source.requirementMode,
      fallback.requirementMode
    ),
    startingRequirement: normalizeNumber(
      source.startingRequirement,
      fallback.startingRequirement,
      1,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExperience
    ),
    linearIncrease: normalizeNumber(
      source.linearIncrease,
      fallback.linearIncrease,
      -PROGRESSION_PROFILE_EDITOR_LIMITS.maxExperience,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExperience
    ),
    multiplier: normalizeNumber(
      source.multiplier,
      fallback.multiplier,
      0.000001,
      1000000
    ),
    exponent: normalizeNumber(
      source.exponent,
      fallback.exponent,
      0.000001,
      100
    ),
    minimumIncrease: normalizeNumber(
      source.minimumIncrease,
      fallback.minimumIncrease,
      0.000001,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExperience
    ),
    roundTo: normalizeNumber(
      source.roundTo,
      fallback.roundTo,
      0.000001,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExperience
    ),
    rounding: normalizeEnum(
      source.rounding,
      PROGRESSION_ROUNDING_POLICIES,
      fallback.rounding
    ),
  };
}

export function normalizeProgressionTierDefinition(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    definitionVersion:
      normalizeString(source.definitionVersion) ||
      PROGRESSION_TIER_DEFINITION_VERSION,
    id: normalizeIdentifier(source.id, `tier.${index + 1}`),
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    minimumLevel: normalizeInteger(
      source.minimumLevel,
      1,
      1,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels
    ),
    maximumLevel: normalizeInteger(
      source.maximumLevel,
      1,
      1,
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels
    ),
    tags: normalizeTags(source.tags),
    order: normalizeInteger(source.order, index, 0, 100000),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeProgressionProfileEditorValue(value = {}) {
  const source = normalizeObject(value);
  const fallback = createDefaultProgressionProfile();
  const curveSource = normalizeObject(source.curve);
  const minimumLevel = normalizeInteger(
    curveSource.minimumLevel,
    fallback.curve.minimumLevel,
    1,
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels
  );
  const maximumLevel = normalizeInteger(
    curveSource.maximumLevel,
    fallback.curve.maximumLevel,
    minimumLevel,
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels
  );
  const mode = normalizeProgressionCurveMode(
    curveSource.mode,
    "EXPLICIT_TABLE"
  );
  const rawThresholds = normalizeArray(curveSource.thresholds);

  return {
    contractVersion:
      normalizeString(source.contractVersion) ||
      PROGRESSION_PROFILE_CONTRACT_VERSION,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    curve: {
      definitionVersion:
        normalizeString(curveSource.definitionVersion) ||
        PROGRESSION_CURVE_DEFINITION_VERSION,
      mode,
      minimumLevel,
      maximumLevel,
      capPolicy: "CLAMP_TO_MAXIMUM",
      maximumExperiencePolicy: normalizeEnum(
        curveSource.maximumExperiencePolicy ?? curveSource.maximumPolicy,
        PROGRESSION_MAXIMUM_EXPERIENCE_POLICIES,
        "CONTINUE_ACCUMULATING"
      ),
      generation: normalizeProgressionGeneration(curveSource.generation),
      overrides:
        mode === "GENERATED_CURVE_WITH_OVERRIDES"
          ? normalizeArray(curveSource.overrides)
              .slice(0, PROGRESSION_PROFILE_EDITOR_LIMITS.maxOverrides)
              .map(normalizeProgressionCurveOverride)
              .sort((left, right) => left.level - right.level)
          : [],
      thresholds:
        mode === "EXPLICIT_TABLE"
          ? (
              rawThresholds.length
                ? rawThresholds.map(normalizeProgressionThreshold)
                : createDefaultProgressionThresholds({
                    minimumLevel,
                    maximumLevel: Math.min(
                      maximumLevel,
                      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
                    ),
                  })
            ).sort((left, right) => left.level - right.level)
          : [],
      metadata: normalizeObject(curveSource.metadata),
    },
    tierDefinitions: normalizeArray(source.tierDefinitions)
      .slice(0, PROGRESSION_PROFILE_EDITOR_LIMITS.maxTiers)
      .map(normalizeProgressionTierDefinition),
    tags: normalizeTags(source.tags),
    metadata: normalizeObject(source.metadata),
  };
}

export function validateProgressionProfileEditorValue(value = {}) {
  const raw = normalizeObject(value);
  const normalized = normalizeProgressionProfileEditorValue(value);
  const errors = [];
  const warnings = [];
  const add = (entry) =>
    entry.severity === "WARNING" ? warnings.push(entry) : errors.push(entry);

  if (normalized.contractVersion !== PROGRESSION_PROFILE_CONTRACT_VERSION) {
    add(
      issue(
        "PROGRESSION_PROFILE_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${PROGRESSION_PROFILE_CONTRACT_VERSION}.`
      )
    );
  }

  if (!normalized.title) {
    add(issue("PROGRESSION_TITLE_REQUIRED", "title", "A profile title is required."));
  }
  if (normalized.title.length > PROGRESSION_PROFILE_EDITOR_LIMITS.maxTitleLength) {
    add(issue("PROGRESSION_TITLE_TOO_LONG", "title", "Profile title is too long."));
  }
  if (
    normalized.description.length >
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxDescriptionLength
  ) {
    add(
      issue(
        "PROGRESSION_DESCRIPTION_TOO_LONG",
        "description",
        "Profile description is too long."
      )
    );
  }

  const expectedLevelCount =
    normalized.curve.maximumLevel - normalized.curve.minimumLevel + 1;
  const resolvedThresholds = generateProgressionThresholdTable(
    normalized.curve
  );

  if (resolvedThresholds.length !== expectedLevelCount) {
    add(
      issue(
        "PROGRESSION_GENERATED_THRESHOLD_COUNT_INVALID",
        "curve",
        "The curve must resolve one threshold for every configured level."
      )
    );
  }

  if (normalized.curve.mode === "EXPLICIT_TABLE") {
    if (
      expectedLevelCount >
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
    ) {
      add(
        issue(
          "PROGRESSION_EXPLICIT_LEVEL_LIMIT_EXCEEDED",
          "curve.maximumLevel",
          `Explicit tables support up to ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels} levels. Choose a generated curve for a larger cap.`
        )
      );
    }
    if (normalized.curve.thresholds.length !== expectedLevelCount) {
      add(
        issue(
          "PROGRESSION_THRESHOLD_COUNT_INVALID",
          "curve.thresholds",
          `Exactly one threshold is required for levels ${normalized.curve.minimumLevel} through ${normalized.curve.maximumLevel}.`
        )
      );
    }

    let previous = null;
    normalized.curve.thresholds.forEach((threshold, index) => {
      const expectedLevel = normalized.curve.minimumLevel + index;
      if (threshold.level !== expectedLevel) {
        add(
          issue(
            "PROGRESSION_THRESHOLD_LEVEL_SEQUENCE_INVALID",
            `curve.thresholds[${index}].level`,
            `Expected level ${expectedLevel}.`
          )
        );
      }
      if (index === 0 && threshold.cumulativeExperience !== 0) {
        add(
          issue(
            "PROGRESSION_MINIMUM_LEVEL_THRESHOLD_MUST_BE_ZERO",
            `curve.thresholds[${index}].cumulativeExperience`,
            "The minimum level must begin at 0 XP."
          )
        );
      }
      if (
        previous !== null &&
        threshold.cumulativeExperience <= previous
      ) {
        add(
          issue(
            "PROGRESSION_THRESHOLD_EXPERIENCE_NOT_INCREASING",
            `curve.thresholds[${index}].cumulativeExperience`,
            "Cumulative XP thresholds must increase strictly."
          )
        );
      }
      previous = threshold.cumulativeExperience;
    });
  }

  const overrideIds = new Set();
  const overrideLevels = new Set();
  normalized.curve.overrides.forEach((override, index) => {
    const path = `curve.overrides[${index}]`;
    if (!IDENTIFIER_PATTERN.test(override.id)) {
      add(
        issue(
          "PROGRESSION_OVERRIDE_IDENTIFIER_INVALID",
          `${path}.id`,
          "Override IDs must use lowercase letters, numbers, dots, colons, underscores, or hyphens."
        )
      );
    }
    if (overrideIds.has(override.id)) {
      add(
        issue(
          "PROGRESSION_OVERRIDE_IDENTIFIER_DUPLICATE",
          `${path}.id`,
          `Duplicate override ID '${override.id}'.`
        )
      );
    }
    overrideIds.add(override.id);
    if (
      override.level <= normalized.curve.minimumLevel ||
      override.level > normalized.curve.maximumLevel
    ) {
      add(
        issue(
          "PROGRESSION_OVERRIDE_LEVEL_OUTSIDE_RANGE",
          `${path}.level`,
          "Override level must be above the minimum and at or below the maximum level."
        )
      );
    }
    if (overrideLevels.has(override.level)) {
      add(
        issue(
          "PROGRESSION_OVERRIDE_LEVEL_DUPLICATE",
          `${path}.level`,
          `Level ${override.level} already has an override.`
        )
      );
    }
    overrideLevels.add(override.level);
    if (
      override.experienceCost === null &&
      override.cumulativeExperience === null
    ) {
      add(
        issue(
          "PROGRESSION_OVERRIDE_VALUE_REQUIRED",
          path,
          "Enter a per-level XP cost or cumulative XP threshold."
        )
      );
    }
  });

  if (
    normalized.curve.mode === "GENERATED_CURVE" &&
    normalized.curve.overrides.length
  ) {
    add(
      issue(
        "PROGRESSION_OVERRIDES_INACTIVE",
        "curve.overrides",
        "Overrides are ignored until Generated Curve with Overrides is selected.",
        "WARNING"
      )
    );
  }

  let previousResolved = null;
  resolvedThresholds.forEach((threshold, index) => {
    if (!Number.isSafeInteger(threshold.cumulativeExperience)) {
      add(
        issue(
          "PROGRESSION_GENERATED_THRESHOLD_UNSAFE",
          `curve.preview[${index}]`,
          "Generated XP thresholds must remain within the safe integer range."
        )
      );
    }
    if (
      previousResolved !== null &&
      threshold.cumulativeExperience <= previousResolved
    ) {
      add(
        issue(
          "PROGRESSION_GENERATED_THRESHOLD_NOT_INCREASING",
          `curve.preview[${index}]`,
          "Generated XP thresholds must increase strictly."
        )
      );
    }
    previousResolved = threshold.cumulativeExperience;
  });

  const tierIds = new Set();
  const tierCoverage = new Map();
  normalized.tierDefinitions.forEach((tier, index) => {
    const path = `tierDefinitions[${index}]`;
    if (!tier.id || !IDENTIFIER_PATTERN.test(tier.id)) {
      add(
        issue(
          "PROGRESSION_TIER_IDENTIFIER_INVALID",
          `${path}.id`,
          "Tier ID must use a valid lowercase identifier."
        )
      );
    }
    if (tierIds.has(tier.id)) {
      add(
        issue(
          "PROGRESSION_TIER_IDENTIFIER_DUPLICATE",
          `${path}.id`,
          `Duplicate tier ID '${tier.id}'.`
        )
      );
    }
    tierIds.add(tier.id);
    if (!tier.title) {
      add(
        issue(
          "PROGRESSION_TIER_TITLE_REQUIRED",
          `${path}.title`,
          "Tier title is required."
        )
      );
    }
    if (!tier.enabled) return;
    if (tier.maximumLevel < tier.minimumLevel) {
      add(
        issue(
          "PROGRESSION_TIER_RANGE_INVALID",
          path,
          "Tier maximum level must be at least its minimum level."
        )
      );
      return;
    }
    if (
      tier.minimumLevel < normalized.curve.minimumLevel ||
      tier.maximumLevel > normalized.curve.maximumLevel
    ) {
      add(
        issue(
          "PROGRESSION_TIER_OUTSIDE_CURVE_RANGE",
          path,
          "Tier levels must remain inside the curve range."
        )
      );
    }
    for (
      let level = tier.minimumLevel;
      level <= tier.maximumLevel;
      level += 1
    ) {
      if (tierCoverage.has(level)) {
        add(
          issue(
            "PROGRESSION_TIER_OVERLAP",
            path,
            `Level ${level} is already covered by tier '${tierCoverage.get(level)}'.`
          )
        );
        break;
      }
      tierCoverage.set(level, tier.id);
    }
  });

  if (
    raw.curve?.thresholds?.length >
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels ||
    raw.curve?.overrides?.length >
      PROGRESSION_PROFILE_EDITOR_LIMITS.maxOverrides ||
    raw.tierDefinitions?.length > PROGRESSION_PROFILE_EDITOR_LIMITS.maxTiers
  ) {
    add(
      issue(
        "PROGRESSION_LIMIT_EXCEEDED",
        "profile",
        "The Progression Profile exceeds one or more collection limits."
      )
    );
  }

  return {
    valid: errors.length === 0,
    normalized,
    errors,
    warnings,
    metrics: {
      curveMode: normalized.curve.mode,
      curveType: normalized.curve.generation.curveType,
      minimumLevel: normalized.curve.minimumLevel,
      maximumLevel: normalized.curve.maximumLevel,
      thresholdCount: resolvedThresholds.length,
      storedThresholdCount: normalized.curve.thresholds.length,
      overrideCount: normalized.curve.overrides.length,
      tierCount: normalized.tierDefinitions.length,
      maximumThreshold:
        resolvedThresholds.at(-1)?.cumulativeExperience ?? 0,
    },
  };
}

export function rebuildProgressionThresholds({
  thresholds = [],
  minimumLevel = 1,
  maximumLevel = 1,
} = {}) {
  const minimum = normalizeInteger(
    minimumLevel,
    1,
    1,
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
  );
  const maximum = normalizeInteger(
    maximumLevel,
    minimum,
    minimum,
    PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels
  );
  const existingByLevel = new Map(
    normalizeArray(thresholds)
      .map(normalizeProgressionThreshold)
      .map((threshold) => [threshold.level, threshold])
  );
  const result = [];
  let priorExperience = 0;

  for (let level = minimum; level <= maximum; level += 1) {
    const existing = existingByLevel.get(level);
    const cumulativeExperience =
      level === minimum
        ? 0
        : existing?.cumulativeExperience ??
          priorExperience + Math.max(100, (level - minimum) * 50);
    const threshold = {
      level,
      cumulativeExperience,
      metadata: existing?.metadata || {},
    };
    result.push(threshold);
    priorExperience = cumulativeExperience;
  }

  return result;
}

export function buildProgressionCurvePreview(curve = {}) {
  return generateProgressionThresholdTable(curve);
}

export function buildProgressionCurvePreviewRows(
  curve = {},
  limit = PROGRESSION_PROFILE_EDITOR_LIMITS.maxPreviewRows
) {
  const rows = buildProgressionCurvePreview(curve);
  if (rows.length <= limit) {
    return { rows, omittedCount: 0 };
  }
  const headCount = Math.ceil(limit / 2);
  const tailCount = Math.floor(limit / 2);
  return {
    rows: [...rows.slice(0, headCount), ...rows.slice(-tailCount)],
    omittedCount: rows.length - headCount - tailCount,
  };
}
