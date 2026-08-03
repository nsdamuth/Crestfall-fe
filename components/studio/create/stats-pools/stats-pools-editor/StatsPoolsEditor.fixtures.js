import {
  STATS_POOLS_CAPABILITY_MODE_OPTIONS,
  STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS,
  STATS_POOLS_DURATION_POLICY_OPTIONS,
  STATS_POOLS_EDITOR_LIMITS,
  STATS_POOLS_FORMULA_OPERAND_TYPE_OPTIONS,
  STATS_POOLS_FORMULA_OPERATION_OPTIONS,
  STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS,
  STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS,
  STATS_POOLS_FORMULA_ROUNDING_OPTIONS,
  STATS_POOLS_MODIFIER_OPERATION_OPTIONS,
  STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS,
  STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
  STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS,
  STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS,
  STATS_POOLS_PROFILE_MODE_OPTIONS,
  STATS_POOLS_SCALE_MODE_OPTIONS,
  STATS_POOLS_STACK_POLICY_OPTIONS,
  STATS_POOLS_VALUE_TYPE_OPTIONS,
} from "./StatsPoolsEditor.contract";

const NOOP = () => {};

const formula = (operation, operands, rounding = "ROUND") => ({
  formulaVersion: "stats_pools_formula_v0",
  root: { nodeType: "OPERATION", operation, operands },
  rounding,
  notes: "",
});

const statReference = (referenceId, field = "CURRENT") => ({
  nodeType: "REFERENCE",
  referenceType: "STAT",
  referenceId,
  field,
});

const constant = (value) => ({ nodeType: "CONSTANT", value });

function decorateStat(definition, expanded = false, issues = []) {
  return {
    enabled: true,
    category: "CORE",
    valueType: "INTEGER",
    tags: [],
    order: 0,
    ...definition,
    expanded,
    issues,
    tagsInput: (definition.tags || []).join(", "),
  };
}

function decoratePool(definition, expanded = false, issues = []) {
  return {
    enabled: true,
    category: "RESOURCE",
    valueType: "INTEGER",
    tags: [],
    order: 0,
    ...definition,
    expanded,
    issues,
    tagsInput: (definition.tags || []).join(", "),
  };
}

function decorateModifier(definition, expanded = false, issues = []) {
  return {
    enabled: true,
    description: "",
    priority: 0,
    notes: "",
    ...definition,
    expanded,
    issues,
    tagsInput: "",
  };
}

function decorateCondition(definition, expanded = false, issues = []) {
  return {
    enabled: true,
    description: "",
    tags: [],
    order: 0,
    ...definition,
    expanded,
    issues,
    tagsInput: (definition.tags || []).join(", "),
    modifierDefinitionIdsInput: (definition.modifierDefinitionIds || []).join(", "),
  };
}

const sharedProps = {
  disabled: false,
  enabled: true,
  profileModeOptions: STATS_POOLS_PROFILE_MODE_OPTIONS,
  capabilityModeOptions: STATS_POOLS_CAPABILITY_MODE_OPTIONS,
  numericResolutionOptions: STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
  valueTypeOptions: STATS_POOLS_VALUE_TYPE_OPTIONS,
  scaleModeOptions: STATS_POOLS_SCALE_MODE_OPTIONS,
  poolMaximumModeOptions: STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS,
  poolDefaultCurrentOptions: STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS,
  formulaOperationOptions: STATS_POOLS_FORMULA_OPERATION_OPTIONS,
  formulaRoundingOptions: STATS_POOLS_FORMULA_ROUNDING_OPTIONS,
  formulaOperandTypeOptions: STATS_POOLS_FORMULA_OPERAND_TYPE_OPTIONS,
  formulaReferenceTypeOptions: STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS,
  formulaReferenceFieldOptions: STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS,
  modifierTargetTypeOptions: STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS,
  modifierOperationOptions: STATS_POOLS_MODIFIER_OPERATION_OPTIONS,
  stackPolicyOptions: STATS_POOLS_STACK_POLICY_OPTIONS,
  durationPolicyOptions: STATS_POOLS_DURATION_POLICY_OPTIONS,
  conditionStackPolicyOptions: STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS,
  limits: STATS_POOLS_EDITOR_LIMITS,
  globalIssues: [],
  errorCount: 0,
  warningCount: 0,
  valid: true,
  titleCharacterLimit: STATS_POOLS_EDITOR_LIMITS.maxTitleLength,
  descriptionCharacterLimit: STATS_POOLS_EDITOR_LIMITS.maxDescriptionLength,
  capabilityNotesCharacterLimit: STATS_POOLS_EDITOR_LIMITS.maxNotesLength,
  onSetActivePanel: NOOP,
  onSetEnabled: NOOP,
  onUpdateProfile: NOOP,
  onUpdateCapability: NOOP,
  onToggleExpanded: NOOP,
  onAddDefinition: NOOP,
  onRemoveDefinition: NOOP,
  onMoveDefinition: NOOP,
  onUpdateDefinition: NOOP,
  onUpdateFormula: NOOP,
  onUpdateFormulaOperand: NOOP,
  onAddFormulaOperand: NOOP,
  onRemoveFormulaOperand: NOOP,
};

const vitality = decorateStat(
  {
    id: "vitality",
    title: "Vitality",
    description: "Physical resilience and life-force capacity.",
    category: "CORE",
    scale: { mode: "BOUNDED", minimum: 0, maximum: 100, defaultValue: 50 },
    derived: { enabled: false, formula: null },
    tags: ["physical", "core"],
  },
  true
);

const agility = decorateStat({
  id: "agility",
  title: "Agility",
  description: "Coordination, speed, and reactive movement.",
  category: "CORE",
  scale: { mode: "BOUNDED", minimum: 0, maximum: 100, defaultValue: 40 },
  derived: { enabled: false, formula: null },
  tags: ["physical", "core"],
});

const defense = decorateStat({
  id: "defense",
  title: "Defense",
  description: "A derived defensive rating.",
  category: "DERIVED",
  scale: { mode: "BOUNDED", minimum: 0, maximum: 200, defaultValue: 0 },
  derived: {
    enabled: true,
    formula: formula("ADD", [
      statReference("vitality"),
      statReference("agility"),
    ]),
  },
  tags: ["combat", "derived"],
});

const health = decoratePool(
  {
    id: "hp",
    title: "Health",
    description: "Current physical health.",
    minimum: 0,
    maximum: {
      mode: "DERIVED",
      value: null,
      formula: formula("MULTIPLY", [statReference("vitality"), constant(10)]),
    },
    defaultCurrent: { mode: "MAXIMUM", value: null },
    allowOverfill: false,
    tags: ["health", "combat"],
  },
  true
);

const stamina = decoratePool({
  id: "stamina",
  title: "Stamina",
  description: "Physical exertion and endurance reserve.",
  minimum: 0,
  maximum: { mode: "FIXED", value: 100, formula: null },
  defaultCurrent: { mode: "MAXIMUM", value: null },
  allowOverfill: false,
  tags: ["physical"],
});

const mana = decoratePool({
  id: "mana",
  title: "Mana",
  description: "Available magical energy.",
  minimum: 0,
  maximum: { mode: "FIXED", value: 100, formula: null },
  defaultCurrent: { mode: "FIXED", value: 25 },
  allowOverfill: false,
  tags: ["magic"],
});

const woundedModifier = decorateModifier(
  {
    id: "wounded.vitality",
    title: "Wounded Vitality Penalty",
    description: "Reduces current Vitality while the actor is wounded.",
    target: { targetType: "STAT_CURRENT", definitionId: "vitality" },
    operation: "ADD",
    value: -10,
    stackPolicy: "REPLACE",
    durationPolicy: "SCENE",
    defaultDurationTurns: 0,
  },
  true
);

const woundedCondition = decorateCondition(
  {
    id: "wounded",
    title: "Wounded",
    description: "A temporary injury state.",
    stackPolicy: "UNIQUE",
    maximumStacks: 1,
    modifierDefinitionIds: ["wounded.vitality"],
    tags: ["injury"],
  },
  true
);

function buildFixture(overrides = {}) {
  const stats = overrides.stats || [];
  const pools = overrides.pools || [];
  const modifiers = overrides.modifiers || [];
  const conditions = overrides.conditions || [];
  const title = overrides.title || "";
  const description = overrides.description || "";
  const capabilityPolicy = overrides.capabilityPolicy || {
    mode: "STANDARD",
    numericResolutionPolicy: "DETERMINISTIC",
    workingModeProfile: "",
    notes: "",
  };

  return {
    ...sharedProps,
    title,
    description,
    profileMode: overrides.profileMode || "SPARSE",
    capabilityPolicy,
    activePanel: overrides.activePanel || "STATS",
    panelCounts: {
      STATS: stats.length,
      POOLS: pools.length,
      MODIFIERS: modifiers.length,
      CONDITIONS: conditions.length,
    },
    stats,
    pools,
    modifiers,
    conditions,
    statOptions: stats.map((item) => ({ value: item.id, label: item.title || item.id })),
    poolOptions: pools.map((item) => ({ value: item.id, label: item.title || item.id })),
    modifierOptions: modifiers.map((item) => ({ value: item.id, label: item.title || item.id })),
    globalIssues: overrides.globalIssues || [],
    errorCount: overrides.errorCount || 0,
    warningCount: overrides.warningCount || 0,
    valid: overrides.valid !== false,
    disabled: overrides.disabled === true,
    enabled: overrides.enabled !== false,
    metrics: {
      statCount: stats.length,
      poolCount: pools.length,
      modifierCount: modifiers.length,
      conditionCount: conditions.length,
      derivedStatCount: stats.filter((item) => item.derived?.enabled).length,
      derivedPoolCount: pools.filter((item) => item.maximum?.mode === "DERIVED").length,
    },
    titleCharacterCount: title.length,
    descriptionCharacterCount: description.length,
    capabilityNotesCharacterCount: capabilityPolicy.notes.length,
  };
}

export const statsPoolsEmptyViewFixture = Object.freeze(
  buildFixture({
    title: "",
    description: "",
    valid: false,
    errorCount: 1,
    globalIssues: [
      {
        code: "PROFILE_TITLE_REQUIRED",
        path: "title",
        message: "Profile title is required.",
        severity: "ERROR",
      },
    ],
  })
);

export const statsPoolsFullAdventurerViewFixture = Object.freeze(
  buildFixture({
    title: "Core Adventurer Stats and Pools",
    description: "Full reusable actor definitions for core attributes and resources.",
    profileMode: "FULL",
    activePanel: "STATS",
    stats: [vitality, agility, defense],
    pools: [health, stamina, mana],
    modifiers: [woundedModifier],
    conditions: [woundedCondition],
  })
);

export const statsPoolsPoolsViewFixture = Object.freeze(
  buildFixture({
    title: "Core Adventurer Stats and Pools",
    description: "Full reusable actor definitions for core attributes and resources.",
    profileMode: "FULL",
    activePanel: "POOLS",
    stats: [vitality, agility, defense],
    pools: [health, stamina, mana],
    modifiers: [woundedModifier],
    conditions: [woundedCondition],
  })
);

export const statsPoolsEffectsViewFixture = Object.freeze(
  buildFixture({
    title: "Core Adventurer Stats and Pools",
    description: "Full reusable actor definitions for core attributes and resources.",
    profileMode: "FULL",
    activePanel: "MODIFIERS",
    stats: [vitality, agility, defense],
    pools: [health, stamina, mana],
    modifiers: [woundedModifier],
    conditions: [woundedCondition],
  })
);

export const statsPoolsBeyondScaleViewFixture = Object.freeze(
  buildFixture({
    title: "Restricted Divine Manifestation",
    description: "Sparse definitions for a restricted working manifestation.",
    profileMode: "SPARSE",
    capabilityPolicy: {
      mode: "BEYOND_SCALE",
      numericResolutionPolicy: "WORKING_MODE_ONLY",
      workingModeProfile: "LEVEL_100_EQUIVALENT",
      notes: "The unrestricted entity is narrative-only. Only the manifested form is mechanically comparable.",
    },
    stats: [
      decorateStat(
        {
          id: "true_power",
          title: "True Power",
          description: "Unrestricted capability beyond ordinary numeric comparison.",
          category: "COSMIC",
          scale: { mode: "BEYOND_SCALE", minimum: null, maximum: null, defaultValue: null },
          derived: { enabled: false, formula: null },
          tags: ["divine", "beyond-scale"],
        },
        true
      ),
    ],
  })
);

export const statsPoolsValidationViewFixture = Object.freeze(
  buildFixture({
    title: "Broken Profile",
    description: "Fixture demonstrating definition-level errors.",
    valid: false,
    errorCount: 3,
    warningCount: 1,
    stats: [
      decorateStat(
        {
          id: "Vitality Invalid",
          title: "",
          description: "",
          scale: { mode: "BOUNDED", minimum: 100, maximum: 10, defaultValue: 999 },
          derived: { enabled: false, formula: null },
        },
        true,
        [
          { code: "IDENTIFIER_INVALID", message: "Stat identifier is invalid.", severity: "ERROR" },
          { code: "TITLE_REQUIRED", message: "Stat title is required.", severity: "ERROR" },
          { code: "STAT_SCALE_INVALID", message: "Bounded Stat maximum must be greater than its minimum.", severity: "ERROR" },
        ]
      ),
    ],
    globalIssues: [
      {
        code: "WORKING_MODE_PROFILE_RECOMMENDED",
        path: "capabilityPolicy.workingModeProfile",
        message: "A Beyond Scale profile should identify its restricted working mode.",
        severity: "WARNING",
      },
    ],
  })
);

export const statsPoolsDisabledViewFixture = Object.freeze(
  buildFixture({
    title: "Disabled Legacy Profile",
    description: "Definitions retained but currently inactive.",
    enabled: false,
    disabled: true,
    stats: [vitality],
    pools: [stamina],
  })
);
