export const STATS_POOLS_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";
export const STATS_POOLS_PROFILE_CONTRACT_VERSION =
  "stats_pools_profile_contract_v0";
export const STATS_POOLS_STAT_DEFINITION_VERSION =
  "stats_pools_stat_definition_v0";
export const STATS_POOLS_POOL_DEFINITION_VERSION =
  "stats_pools_pool_definition_v0";
export const STATS_POOLS_FORMULA_VERSION = "stats_pools_formula_v0";
export const STATS_POOLS_MODIFIER_DEFINITION_VERSION =
  "stats_pools_modifier_definition_v0";
export const STATS_POOLS_CONDITION_DEFINITION_VERSION =
  "stats_pools_condition_definition_v0";

export const STATS_POOLS_EDITOR_LIMITS = Object.freeze({
  maxStats: 64,
  maxPools: 32,
  maxModifierDefinitions: 128,
  maxConditionDefinitions: 64,
  maxFormulaOperands: 12,
  maxTags: 24,
  maxIdentifierLength: 96,
  maxTitleLength: 160,
  maxDescriptionLength: 2400,
  maxNotesLength: 4000,
});

export const STATS_POOLS_PROFILE_MODE_OPTIONS = Object.freeze([
  {
    value: "SPARSE",
    label: "Sparse",
    description:
      "Only meaningful actor values need to exist. Recommended for important NPCs and lightweight profiles.",
  },
  {
    value: "FULL",
    label: "Full",
    description:
      "Every enabled non-derived Stat and every enabled Pool requires actor-owned state.",
  },
]);

export const STATS_POOLS_CAPABILITY_MODE_OPTIONS = Object.freeze([
  {
    value: "STANDARD",
    label: "Standard",
    description: "Ordinary deterministic numeric resolution is allowed.",
  },
  {
    value: "BEYOND_SCALE",
    label: "Beyond Scale",
    description:
      "Unrestricted capability cannot be reduced to ordinary numeric opposed checks.",
  },
]);

export const STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS = Object.freeze([
  {
    value: "DETERMINISTIC",
    label: "Deterministic",
    description: "Resolve numeric comparisons through supported mechanics.",
  },
  {
    value: "WORKING_MODE_ONLY",
    label: "Working Mode Only",
    description:
      "Only an explicitly restricted manifestation may use ordinary numeric resolution.",
  },
  {
    value: "NARRATIVE_ONLY",
    label: "Narrative Only",
    description: "Do not resolve this profile through ordinary numeric checks.",
  },
]);

export const STATS_POOLS_VALUE_TYPE_OPTIONS = Object.freeze([
  { value: "INTEGER", label: "Integer" },
  { value: "DECIMAL", label: "Decimal" },
]);

export const STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS = Object.freeze([
  {
    value: "PRIMARY",
    label: "Main HUD",
    description: "Show this value in the compact player Actor HUD.",
  },
  {
    value: "DETAIL",
    label: "More",
    description: "Keep this value available under the HUD More control.",
  },
  {
    value: "HIDDEN",
    label: "Hidden",
    description: "Do not expose this value in player-facing readouts.",
  },
]);

export const STATS_POOLS_SCALE_MODE_OPTIONS = Object.freeze([
  {
    value: "BOUNDED",
    label: "Bounded",
    description: "The value remains between a minimum and maximum.",
  },
  {
    value: "UNBOUNDED",
    label: "Unbounded",
    description: "The value is numeric but has no fixed upper bound.",
  },
  {
    value: "BEYOND_SCALE",
    label: "Beyond Scale",
    description: "The unrestricted value is intentionally non-numeric.",
  },
]);

export const STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS = Object.freeze([
  { value: "FIXED", label: "Fixed Maximum" },
  { value: "DERIVED", label: "Derived Maximum" },
]);

export const STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS = Object.freeze([
  { value: "MAXIMUM", label: "Start at Maximum" },
  { value: "FIXED", label: "Start at Fixed Value" },
  { value: "MINIMUM", label: "Start at Minimum" },
]);

export const STATS_POOLS_FORMULA_OPERATION_OPTIONS = Object.freeze([
  { value: "ADD", label: "Add" },
  { value: "SUBTRACT", label: "Subtract" },
  { value: "MULTIPLY", label: "Multiply" },
  { value: "DIVIDE", label: "Divide" },
  { value: "MIN", label: "Minimum" },
  { value: "MAX", label: "Maximum" },
]);

export const STATS_POOLS_FORMULA_ROUNDING_OPTIONS = Object.freeze([
  { value: "NONE", label: "No Rounding" },
  { value: "FLOOR", label: "Round Down" },
  { value: "CEIL", label: "Round Up" },
  { value: "ROUND", label: "Round Normally" },
]);

export const STATS_POOLS_FORMULA_OPERAND_TYPE_OPTIONS = Object.freeze([
  { value: "CONSTANT", label: "Constant" },
  { value: "REFERENCE", label: "Stat or Pool Reference" },
]);

export const STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS = Object.freeze([
  { value: "STAT", label: "Stat" },
  { value: "POOL", label: "Pool" },
]);

export const STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS = Object.freeze([
  { value: "BASE", label: "Base" },
  { value: "CURRENT", label: "Current" },
  { value: "DEFAULT", label: "Default" },
  { value: "MINIMUM", label: "Minimum" },
  { value: "MAXIMUM", label: "Maximum" },
]);

export const STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS = Object.freeze([
  { value: "STAT_BASE", label: "Stat Base" },
  { value: "STAT_CURRENT", label: "Stat Current" },
  { value: "POOL_CURRENT", label: "Pool Current" },
  { value: "POOL_MAXIMUM", label: "Pool Maximum" },
]);

export const STATS_POOLS_MODIFIER_OPERATION_OPTIONS = Object.freeze([
  { value: "ADD", label: "Add" },
  { value: "MULTIPLY", label: "Multiply" },
  { value: "SET_MINIMUM", label: "Set Minimum" },
  { value: "SET_MAXIMUM", label: "Set Maximum" },
  { value: "OVERRIDE", label: "Override" },
]);

export const STATS_POOLS_STACK_POLICY_OPTIONS = Object.freeze([
  { value: "STACK", label: "Stack" },
  { value: "HIGHEST", label: "Highest Wins" },
  { value: "LOWEST", label: "Lowest Wins" },
  { value: "REPLACE", label: "Replace" },
  { value: "UNIQUE", label: "Unique" },
  { value: "REFRESH", label: "Refresh Duration" },
]);

export const STATS_POOLS_DURATION_POLICY_OPTIONS = Object.freeze([
  { value: "PERSISTENT", label: "Persistent" },
  { value: "TURN_COUNT", label: "Turn Count" },
  { value: "SCENE", label: "Current Scene" },
  { value: "WORLD_TIME", label: "World Time" },
]);

export const STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS = Object.freeze([
  { value: "UNIQUE", label: "Unique" },
  { value: "STACK", label: "Stack" },
  { value: "REFRESH", label: "Refresh" },
]);

export function createEmptyFormulaOperand(overrides = {}) {
  return {
    nodeType: "CONSTANT",
    value: 0,
    referenceType: "STAT",
    referenceId: "",
    field: "CURRENT",
    ...overrides,
  };
}

export function createEmptyFormula(overrides = {}) {
  return {
    formulaVersion: STATS_POOLS_FORMULA_VERSION,
    root: {
      nodeType: "OPERATION",
      operation: "ADD",
      operands: [
        createEmptyFormulaOperand(),
        createEmptyFormulaOperand({ value: 1 }),
      ],
    },
    rounding: "NONE",
    notes: "",
    ...overrides,
  };
}

export function createEmptyStatDefinition(index = 0, overrides = {}) {
  return {
    definitionVersion: STATS_POOLS_STAT_DEFINITION_VERSION,
    id: `stat.${index + 1}`,
    title: "",
    description: "",
    enabled: true,
    category: "CORE",
    valueType: "INTEGER",
    scale: {
      mode: "BOUNDED",
      minimum: 0,
      maximum: 100,
      defaultValue: 0,
    },
    derived: {
      enabled: false,
      formula: null,
    },
    playerReadout: {
      visibility: "PRIMARY",
    },
    tags: [],
    order: index,
    metadata: {},
    ...overrides,
  };
}

export function createEmptyPoolDefinition(index = 0, overrides = {}) {
  return {
    definitionVersion: STATS_POOLS_POOL_DEFINITION_VERSION,
    id: `pool.${index + 1}`,
    title: "",
    description: "",
    enabled: true,
    category: "RESOURCE",
    valueType: "INTEGER",
    minimum: 0,
    maximum: {
      mode: "FIXED",
      value: 100,
      formula: null,
    },
    defaultCurrent: {
      mode: "MAXIMUM",
      value: null,
    },
    allowOverfill: false,
    playerReadout: {
      visibility: "PRIMARY",
    },
    tags: [],
    order: index,
    metadata: {},
    ...overrides,
  };
}

export function createEmptyModifierDefinition(index = 0, overrides = {}) {
  return {
    definitionVersion: STATS_POOLS_MODIFIER_DEFINITION_VERSION,
    id: `modifier.${index + 1}`,
    title: "",
    description: "",
    enabled: true,
    target: {
      targetType: "STAT_CURRENT",
      definitionId: "",
    },
    operation: "ADD",
    value: 0,
    stackPolicy: "STACK",
    durationPolicy: "PERSISTENT",
    defaultDurationTurns: 0,
    priority: 0,
    notes: "",
    metadata: {},
    ...overrides,
  };
}

export function createEmptyConditionDefinition(index = 0, overrides = {}) {
  return {
    definitionVersion: STATS_POOLS_CONDITION_DEFINITION_VERSION,
    id: `condition.${index + 1}`,
    title: "",
    description: "",
    enabled: true,
    stackPolicy: "UNIQUE",
    maximumStacks: 1,
    modifierDefinitionIds: [],
    tags: [],
    order: index,
    metadata: {},
    ...overrides,
  };
}

export const EMPTY_STATS_POOLS_EDITOR_VALUE = Object.freeze({
  contractVersion: STATS_POOLS_PROFILE_CONTRACT_VERSION,
  title: "",
  description: "",
  enabled: true,
  profileMode: "SPARSE",
  capabilityPolicy: {
    mode: "STANDARD",
    numericResolutionPolicy: "DETERMINISTIC",
    workingModeProfile: "",
    notes: "",
  },
  statDefinitions: [],
  poolDefinitions: [],
  modifierDefinitions: [],
  conditionDefinitions: [],
  metadata: {},
});
