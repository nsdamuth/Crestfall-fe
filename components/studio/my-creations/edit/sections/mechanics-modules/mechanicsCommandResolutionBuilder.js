export const MECHANICS_COMMAND_RESOLUTION_BUILDER_VERSION =
  "mechanics_command_resolution_builder_v1";

export const MECHANICS_COMMAND_RESOLUTION_VERSION =
  "mechanics_command_resolution_v6";

export const COMMAND_RESOLUTION_MODES = [
  "NO_ROLL_DETERMINISTIC",
  "THRESHOLD_DIE",
  "OPPOSED_DIE",
];

export const COMMAND_RESOLUTION_ROLL_MODES = [
  "NORMAL",
  "ADVANTAGE",
  "DISADVANTAGE",
];

export const COMMAND_OPPOSED_TIE_POLICIES = [
  "OPPOSITION_WINS",
  "ACTOR_WINS",
];

export const COMMAND_RESOLUTION_MODIFIER_SOURCE_TYPES = [
  "MECHANICS_VALUE",
  "TARGET_MECHANICS_VALUE",
  "TARGET_PROPERTY",
];

export const COMMAND_RESOLUTION_MODIFIER_BUCKETS = [
  "METER",
  "COUNTER",
];

export const COMMAND_RESOLUTION_MODIFIER_SCOPE_MODES = [
  "COMMAND_SOURCE",
  "ROOT",
  "EXPLICIT",
];

export const COMMAND_RESOLUTION_TARGET_PROPERTIES = [
  "IS_PRESENT",
  "IS_HELD_BY_ACTOR",
  "IS_CURRENT",
  "IS_CONNECTED",
  "QUANTITY",
  "CONDITION_PERCENT",
];

export const COMMAND_RESOLUTION_MODIFIER_ROUNDING = [
  "NONE",
  "ROUND",
  "FLOOR",
  "CEIL",
  "TRUNCATE",
];

export const COMMAND_RESOLUTION_MODIFIER_MISSING_POLICIES = [
  "IGNORE",
  "REJECT",
];

const BOOLEAN_TARGET_PROPERTIES = new Set([
  "IS_PRESENT",
  "IS_HELD_BY_ACTOR",
  "IS_CURRENT",
  "IS_CONNECTED",
]);

const ROLLING_RESOLUTION_MODES = new Set([
  "THRESHOLD_DIE",
  "OPPOSED_DIE",
]);

const MAX_MODIFIERS = 40;
const MAX_MODIFIER_SOURCES = 40;

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

function normalizeResolutionMode(value) {
  const requested = normalizeString(value).toUpperCase();
  const aliases = {
    OPPOSED: "OPPOSED_DIE",
    CONTESTED: "OPPOSED_DIE",
    CONTESTED_DIE: "OPPOSED_DIE",
    VERSUS: "OPPOSED_DIE",
    VERSUS_DIE: "OPPOSED_DIE",
  };
  const mode = aliases[requested] || requested;

  return COMMAND_RESOLUTION_MODES.includes(mode)
    ? mode
    : "NO_ROLL_DETERMINISTIC";
}

function normalizeRollMode(value, resolutionMode) {
  if (!isRollingMechanicsCommandResolutionMode(resolutionMode)) {
    return "NORMAL";
  }

  const requested = normalizeString(value).toUpperCase();
  const aliases = {
    STANDARD: "NORMAL",
    NONE: "NORMAL",
    KEEP_HIGHEST: "ADVANTAGE",
    HIGHEST: "ADVANTAGE",
    HIGH: "ADVANTAGE",
    KEEP_LOWEST: "DISADVANTAGE",
    LOWEST: "DISADVANTAGE",
    LOW: "DISADVANTAGE",
  };
  const mode = aliases[requested] || requested;

  return COMMAND_RESOLUTION_ROLL_MODES.includes(mode)
    ? mode
    : "NORMAL";
}

function normalizeDie(value = {}, fallback = {}) {
  const source = normalizeObject(value);
  const fallbackDie = normalizeObject(fallback);

  return {
    count: clampInteger(
      source.count ?? source.number ?? fallbackDie.count,
      1,
      1,
      20
    ),
    sides: clampInteger(
      source.sides ?? source.size ?? fallbackDie.sides,
      20,
      2,
      1000
    ),
  };
}

function normalizeTiePolicy(value) {
  const requested = normalizeString(value).toUpperCase();
  const aliases = {
    ACTOR: "ACTOR_WINS",
    ATTACKER_WINS: "ACTOR_WINS",
    INITIATOR_WINS: "ACTOR_WINS",
    SUCCESS: "ACTOR_WINS",
    OPPONENT: "OPPOSITION_WINS",
    DEFENDER_WINS: "OPPOSITION_WINS",
    TARGET_WINS: "OPPOSITION_WINS",
    FAILURE: "OPPOSITION_WINS",
    TIES_FAIL: "OPPOSITION_WINS",
  };
  const policy = aliases[requested] || requested;

  return COMMAND_OPPOSED_TIE_POLICIES.includes(policy)
    ? policy
    : "OPPOSITION_WINS";
}

export function isRollingMechanicsCommandResolutionMode(value) {
  return ROLLING_RESOLUTION_MODES.has(
    normalizeString(value).toUpperCase()
  );
}

export function isBooleanMechanicsCommandResolutionTargetProperty(value) {
  return BOOLEAN_TARGET_PROPERTIES.has(
    normalizeString(value).toUpperCase()
  );
}

export function normalizeMechanicsCommandResolutionModifier(
  modifier = {},
  index = 0
) {
  const source =
    typeof modifier === "number"
      ? { value: modifier }
      : normalizeObject(modifier);
  const id = normalizeIdentifier(
    source.id || source.key,
    `modifier_${index + 1}`
  );

  return {
    ...source,
    id,
    label:
      normalizeString(
        source.label || source.title || source.name || source.reason
      ) || id.replace(/[_-]+/g, " "),
    value: clampNumber(
      source.value ?? source.amount ?? source.modifier ?? source.bonus,
      0,
      -1000,
      1000
    ),
    sourceType: "CONFIGURED",
    sourceId:
      normalizeIdentifier(source.sourceId || source.source_id) || null,
    scopeKey: normalizeString(source.scopeKey || source.scope_key),
    enabled: normalizeBoolean(source.enabled, true),
  };
}

function normalizeResolutionModifiers(value = []) {
  return normalizeArray(value)
    .map(normalizeMechanicsCommandResolutionModifier)
    .slice(0, MAX_MODIFIERS);
}

export function createMechanicsCommandResolutionModifier(index = 0) {
  return normalizeMechanicsCommandResolutionModifier(
    {
      id: `modifier_${index + 1}`,
      label: `Modifier ${index + 1}`,
      value: 1,
      enabled: true,
    },
    index
  );
}

export function normalizeMechanicsCommandResolutionModifierSource(
  value = {},
  index = 0
) {
  const source = normalizeObject(value);
  const requestedType = normalizeString(
    source.type || source.sourceType || source.source_type || source.kind
  ).toUpperCase();
  const aliases = {
    STATE_VALUE: "MECHANICS_VALUE",
    MECHANICS_STATE_VALUE: "MECHANICS_VALUE",
    TRACKER_VALUE: "MECHANICS_VALUE",
    TARGET_STATE_VALUE: "TARGET_MECHANICS_VALUE",
    TARGET_TRACKER_VALUE: "TARGET_MECHANICS_VALUE",
    TARGET_VALUE: "TARGET_PROPERTY",
    TARGET_FIELD: "TARGET_PROPERTY",
  };
  const type = COMMAND_RESOLUTION_MODIFIER_SOURCE_TYPES.includes(
    aliases[requestedType] || requestedType
  )
    ? aliases[requestedType] || requestedType
    : "MECHANICS_VALUE";
  const id = normalizeIdentifier(
    source.id || source.key,
    `modifier_source_${index + 1}`
  );
  const rawBucket = normalizeString(
    source.bucket || source.mechanicsBucket || source.stateType || "METER"
  ).toUpperCase();
  const bucketAliases = {
    METERS: "METER",
    TRACKER: "METER",
    TRACKERS: "METER",
    COUNTERS: "COUNTER",
  };
  const bucket = bucketAliases[rawBucket] || rawBucket;
  const rawScopeMode = normalizeString(
    source.scopeMode || source.scope_mode || source.scope || "COMMAND_SOURCE"
  ).toUpperCase();
  const scopeAliases = {
    COMMAND: "COMMAND_SOURCE",
    SOURCE: "COMMAND_SOURCE",
    STORY_ROOM: "ROOT",
    ROOM: "ROOT",
    GLOBAL: "ROOT",
  };
  const scopeMode = scopeAliases[rawScopeMode] || rawScopeMode;
  const rawProperty = normalizeString(
    source.property || source.targetProperty || source.field || "IS_PRESENT"
  ).toUpperCase();
  const propertyAliases = {
    PRESENT: "IS_PRESENT",
    HELD: "IS_HELD_BY_ACTOR",
    HELD_BY_ACTOR: "IS_HELD_BY_ACTOR",
    CURRENT: "IS_CURRENT",
    CONNECTED: "IS_CONNECTED",
    CONDITION: "CONDITION_PERCENT",
    DURABILITY: "CONDITION_PERCENT",
  };
  const property = propertyAliases[rawProperty] || rawProperty;
  const rounding = normalizeString(source.rounding || source.round || "NONE").toUpperCase();
  const missingPolicy = normalizeString(
    source.missingPolicy ||
      source.missing_policy ||
      source.onMissing ||
      (normalizeBoolean(source.required, false) ? "REJECT" : "IGNORE")
  ).toUpperCase();
  const minModifier = clampNumber(
    source.minModifier ?? source.min_modifier,
    -1000,
    -1000,
    1000
  );
  const maxModifier = clampNumber(
    source.maxModifier ?? source.max_modifier,
    1000,
    -1000,
    1000
  );

  return {
    ...source,
    id,
    label:
      normalizeString(source.label || source.title || source.name) ||
      id.replace(/[_-]+/g, " "),
    type,
    argumentName: type.startsWith("TARGET_")
      ? normalizeIdentifier(
          source.argumentName ||
            source.argument_name ||
            source.targetArgumentName ||
            "target",
          "target"
        )
      : "",
    bucket: type.includes("MECHANICS_VALUE")
      ? COMMAND_RESOLUTION_MODIFIER_BUCKETS.includes(bucket)
        ? bucket
        : "METER"
      : "",
    mechanicsId: type.includes("MECHANICS_VALUE")
      ? normalizeIdentifier(
          source.mechanicsId ||
            source.mechanics_id ||
            source.trackerId ||
            source.counterId ||
            source.targetId
        )
      : "",
    scopeMode:
      type === "MECHANICS_VALUE"
        ? COMMAND_RESOLUTION_MODIFIER_SCOPE_MODES.includes(scopeMode)
          ? scopeMode
          : "COMMAND_SOURCE"
        : type === "TARGET_MECHANICS_VALUE"
          ? "TARGET"
          : "",
    scopeKey:
      type === "MECHANICS_VALUE" && scopeMode === "EXPLICIT"
        ? normalizeString(source.scopeKey || source.scope_key)
        : "",
    property:
      type === "TARGET_PROPERTY"
        ? COMMAND_RESOLUTION_TARGET_PROPERTIES.includes(property)
          ? property
          : "IS_PRESENT"
        : "",
    expected: normalizeBoolean(source.expected, true),
    valueWhenTrue: clampNumber(
      source.valueWhenTrue ?? source.value_when_true,
      1,
      -1000,
      1000
    ),
    valueWhenFalse: clampNumber(
      source.valueWhenFalse ?? source.value_when_false,
      0,
      -1000,
      1000
    ),
    multiplier: clampNumber(source.multiplier, 1, -1000, 1000),
    divisor: clampNumber(source.divisor, 1, -1000, 1000) || 1,
    offset: clampNumber(source.offset, 0, -1000, 1000),
    rounding: COMMAND_RESOLUTION_MODIFIER_ROUNDING.includes(rounding)
      ? rounding
      : "NONE",
    minModifier: Math.min(minModifier, maxModifier),
    maxModifier: Math.max(minModifier, maxModifier),
    missingPolicy:
      COMMAND_RESOLUTION_MODIFIER_MISSING_POLICIES.includes(missingPolicy)
        ? missingPolicy
        : "IGNORE",
    enabled: normalizeBoolean(source.enabled, true),
  };
}

function normalizeResolutionModifierSources(value = []) {
  return normalizeArray(value)
    .map(normalizeMechanicsCommandResolutionModifierSource)
    .slice(0, MAX_MODIFIER_SOURCES);
}

export function createMechanicsCommandResolutionModifierSource(
  type = "MECHANICS_VALUE",
  index = 0
) {
  return normalizeMechanicsCommandResolutionModifierSource(
    {
      id: `modifier_source_${index + 1}`,
      label: `Modifier Source ${index + 1}`,
      type,
      argumentName: "target",
      bucket: "METER",
      mechanicsId: "",
      scopeMode: "COMMAND_SOURCE",
      scopeKey: "",
      property: "IS_PRESENT",
      expected: true,
      valueWhenTrue: 1,
      valueWhenFalse: 0,
      multiplier: 1,
      divisor: 1,
      offset: 0,
      rounding: "NONE",
      minModifier: -1000,
      maxModifier: 1000,
      missingPolicy: "IGNORE",
      enabled: true,
    },
    index
  );
}

function normalizeDegreeOfSuccess(value = {}, resolutionMode) {
  const source =
    typeof value === "boolean" ? { enabled: value } : normalizeObject(value);
  const hasConfiguration = Object.keys(source).length > 0;

  return {
    version: "mechanics_degree_of_success_v1",
    enabled:
      isRollingMechanicsCommandResolutionMode(resolutionMode) &&
      normalizeBoolean(source.enabled, hasConfiguration),
    criticalSuccessMargin: clampInteger(
      source.criticalSuccessMargin ?? source.criticalMargin,
      10,
      1,
      1000000
    ),
    fumbleMargin: clampInteger(
      source.fumbleMargin ?? source.catastrophicFailureMargin,
      -10,
      -1000000,
      -1
    ),
    naturalOutcomePrecedence: true,
    tiePolicyPrecedence: true,
  };
}

function normalizeOpposed(value = {}, fallbackDie = {}) {
  const source = normalizeObject(value);
  const die = normalizeDie(
    source.die || source.opposedDie || source.defenderDie,
    fallbackDie
  );

  return {
    label:
      normalizeString(source.label || source.title || source.name) ||
      "Opposition",
    die,
    rollMode: normalizeRollMode(
      source.rollMode || source.advantageMode || source.keepMode,
      "OPPOSED_DIE"
    ),
    modifiers: normalizeResolutionModifiers(
      source.modifiers || source.opposedModifiers
    ),
    modifierSources: normalizeResolutionModifierSources(
      source.modifierSources || source.authoritativeModifierSources
    ),
    tiePolicy: normalizeTiePolicy(
      source.tiePolicy || source.tieBreaker
    ),
    criticalOnNaturalMax: normalizeBoolean(
      source.criticalOnNaturalMax,
      true
    ),
    fumbleOnNaturalMin: normalizeBoolean(
      source.fumbleOnNaturalMin,
      true
    ),
  };
}

export function normalizeMechanicsCommandResolutionBuilder(value = {}) {
  const source = normalizeObject(value);
  const mode = normalizeResolutionMode(
    source.mode || source.type || source.resolutionMode
  );
  const die = normalizeDie(
    source.die || source.thresholdDie || source.actorDie
  );
  const maximum = die.count * die.sides;
  const targetNumber = clampInteger(
    source.targetNumber ?? source.difficulty ?? source.threshold,
    Math.min(11, maximum),
    1,
    1000000
  );
  const opposedSource =
    source.opposed ||
    source.opposition ||
    source.opponent ||
    source.defender ||
    source.targetCheck;
  const degreeSource =
    source.degreeOfSuccess ||
    source.marginBands ||
    source.degreesOfSuccess ||
    {};

  return {
    version: MECHANICS_COMMAND_RESOLUTION_VERSION,
    mode,
    rollMode: normalizeRollMode(
      source.rollMode || source.advantageMode || source.keepMode,
      mode
    ),
    die,
    targetNumber: mode === "THRESHOLD_DIE" ? targetNumber : null,
    modifiers: isRollingMechanicsCommandResolutionMode(mode)
      ? normalizeResolutionModifiers(
          source.modifiers || source.actorModifiers
        )
      : [],
    modifierSources: isRollingMechanicsCommandResolutionMode(mode)
      ? normalizeResolutionModifierSources(
          source.modifierSources ||
            source.authoritativeModifierSources ||
            source.actorModifierSources
        )
      : [],
    opposed:
      mode === "OPPOSED_DIE"
        ? normalizeOpposed(opposedSource, die)
        : null,
    degreeOfSuccess: normalizeDegreeOfSuccess(degreeSource, mode),
    criticalOnNaturalMax: normalizeBoolean(
      source.criticalOnNaturalMax,
      true
    ),
    fumbleOnNaturalMin: normalizeBoolean(
      source.fumbleOnNaturalMin,
      true
    ),
  };
}

const REFERENCE_CONFIGURATION_DEFINITIONS = [
  {
    id: "AUTOMATIC_SUCCESS",
    label: "Automatic Success",
    description: "No roll. The command resolves as Success.",
    resolution: {
      mode: "NO_ROLL_DETERMINISTIC",
    },
  },
  {
    id: "STANDARD_D20",
    label: "Standard d20 Check",
    description: "Roll 1d20 against target number 11.",
    resolution: {
      mode: "THRESHOLD_DIE",
      rollMode: "NORMAL",
      die: { count: 1, sides: 20 },
      targetNumber: 11,
    },
  },
  {
    id: "ADVANTAGE_D20",
    label: "Advantage d20 Check",
    description: "Roll two 1d20 sets and keep the higher result.",
    resolution: {
      mode: "THRESHOLD_DIE",
      rollMode: "ADVANTAGE",
      die: { count: 1, sides: 20 },
      targetNumber: 11,
    },
  },
  {
    id: "DISADVANTAGE_D20",
    label: "Disadvantage d20 Check",
    description: "Roll two 1d20 sets and keep the lower result.",
    resolution: {
      mode: "THRESHOLD_DIE",
      rollMode: "DISADVANTAGE",
      die: { count: 1, sides: 20 },
      targetNumber: 11,
    },
  },
  {
    id: "OPPOSED_D20",
    label: "Opposed d20 Check",
    description: "Actor and opposition each roll 1d20; ties favor opposition.",
    resolution: {
      mode: "OPPOSED_DIE",
      rollMode: "NORMAL",
      die: { count: 1, sides: 20 },
      opposed: {
        label: "Opposition",
        die: { count: 1, sides: 20 },
        rollMode: "NORMAL",
        tiePolicy: "OPPOSITION_WINS",
      },
    },
  },
  {
    id: "DEGREE_D20",
    label: "Degree-of-Success d20",
    description: "Standard d20 check with Critical at +5 and Fumble at -5 margin.",
    resolution: {
      mode: "THRESHOLD_DIE",
      rollMode: "NORMAL",
      die: { count: 1, sides: 20 },
      targetNumber: 11,
      degreeOfSuccess: {
        enabled: true,
        criticalSuccessMargin: 5,
        fumbleMargin: -5,
      },
    },
  },
];

export const COMMAND_RESOLUTION_REFERENCE_CONFIGURATIONS =
  REFERENCE_CONFIGURATION_DEFINITIONS.map(
    ({ id, label, description }) => ({ id, label, description })
  );

export function buildMechanicsCommandResolutionReferenceConfiguration(id) {
  const requested = normalizeString(id).toUpperCase();
  const definition = REFERENCE_CONFIGURATION_DEFINITIONS.find(
    (entry) => entry.id === requested
  );

  return definition
    ? normalizeMechanicsCommandResolutionBuilder(definition.resolution)
    : null;
}

export function formatMechanicsCommandResolutionBuilderSummary(value = {}) {
  const resolution = normalizeMechanicsCommandResolutionBuilder(value);

  if (resolution.mode === "NO_ROLL_DETERMINISTIC") {
    return "No roll";
  }

  const actor = `${resolution.die.count}d${resolution.die.sides}`;
  const rollMode =
    resolution.rollMode === "NORMAL"
      ? ""
      : ` (${resolution.rollMode.toLowerCase()})`;

  if (resolution.mode === "THRESHOLD_DIE") {
    return `${actor}${rollMode} ≥ ${resolution.targetNumber}`;
  }

  const opposed = resolution.opposed;
  const opposition = `${opposed.die.count}d${opposed.die.sides}`;
  const opposedRollMode =
    opposed.rollMode === "NORMAL"
      ? ""
      : ` (${opposed.rollMode.toLowerCase()})`;

  return `${actor}${rollMode} vs ${opposition}${opposedRollMode}`;
}
