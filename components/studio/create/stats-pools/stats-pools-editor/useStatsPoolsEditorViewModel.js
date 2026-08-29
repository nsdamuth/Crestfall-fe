"use client";

import { useMemo, useState } from "react";

import {
  EMPTY_STATS_POOLS_EDITOR_VALUE,
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
  STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
  STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS,
  STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS,
  STATS_POOLS_PROFILE_CONTRACT_VERSION,
  STATS_POOLS_PROFILE_MODE_OPTIONS,
  STATS_POOLS_SCALE_MODE_OPTIONS,
  STATS_POOLS_STACK_POLICY_OPTIONS,
  STATS_POOLS_VALUE_TYPE_OPTIONS,
  createEmptyConditionDefinition,
  createEmptyFormula,
  createEmptyFormulaOperand,
  createEmptyModifierDefinition,
  createEmptyPoolDefinition,
  createEmptyStatDefinition,
} from "./StatsPoolsEditor.contract.js";

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

function normalizeEnum(value, options, fallback) {
  const allowed = options.map((option) => option.value);
  const normalized = normalizeString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeNumber(value, fallback = null) {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeInteger(value, fallback = 0, minimum = -1000000, maximum = 1000000) {
  const parsed = normalizeNumber(value, fallback);
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(raw.map((entry) => normalizeString(entry).toLowerCase()).filter(Boolean))]
    .slice(0, STATS_POOLS_EDITOR_LIMITS.maxTags);
}

function nextUniqueId(items, prefix) {
  const existing = new Set(items.map((item) => item.id));
  let index = items.length + 1;
  let candidate = `${prefix}.${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `${prefix}.${index}`;
  }
  return candidate;
}

function normalizeFormulaOperand(value = {}) {
  const source = normalizeObject(value);
  const nodeType = source.nodeType === "REFERENCE" ? "REFERENCE" : "CONSTANT";

  return {
    nodeType,
    value: normalizeNumber(source.value, 0),
    referenceType:
      source.referenceType === "POOL" ? "POOL" : "STAT",
    referenceId: normalizeString(source.referenceId).toLowerCase(),
    field: ["BASE", "CURRENT", "DEFAULT", "MINIMUM", "MAXIMUM"].includes(
      normalizeString(source.field).toUpperCase()
    )
      ? normalizeString(source.field).toUpperCase()
      : "CURRENT",
  };
}

function flattenFormulaOperand(operand) {
  if (operand.nodeType === "REFERENCE") {
    return {
      nodeType: "REFERENCE",
      referenceType: operand.referenceType,
      referenceId: operand.referenceId,
      field: operand.field,
    };
  }

  return {
    nodeType: "CONSTANT",
    value: normalizeNumber(operand.value, 0),
  };
}

function normalizeFormula(value = {}) {
  const source = normalizeObject(value);
  const root = normalizeObject(source.root);
  const operands = normalizeArray(root.operands)
    .slice(0, STATS_POOLS_EDITOR_LIMITS.maxFormulaOperands)
    .map(normalizeFormulaOperand);

  return {
    formulaVersion: "stats_pools_formula_v0",
    root: {
      nodeType: "OPERATION",
      operation: normalizeEnum(
        root.operation,
        STATS_POOLS_FORMULA_OPERATION_OPTIONS,
        "ADD"
      ),
      operands:
        operands.length >= 2
          ? operands.map(flattenFormulaOperand)
          : createEmptyFormula().root.operands,
    },
    rounding: normalizeEnum(
      source.rounding,
      STATS_POOLS_FORMULA_ROUNDING_OPTIONS,
      "NONE"
    ),
    notes: normalizeString(source.notes),
  };
}

function normalizeStat(value = {}, index = 0) {
  const source = normalizeObject(value);
  const scale = normalizeObject(source.scale);
  const derived = normalizeObject(source.derived);
  const playerReadout = normalizeObject(source.playerReadout);
  const derivedEnabled = derived.enabled === true;
  const scaleMode = normalizeEnum(
    scale.mode,
    STATS_POOLS_SCALE_MODE_OPTIONS,
    "BOUNDED"
  );

  return {
    ...createEmptyStatDefinition(index),
    definitionVersion: "stats_pools_stat_definition_v0",
    id: normalizeString(source.id).toLowerCase() || `stat.${index + 1}`,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    category: normalizeString(source.category).toUpperCase() || "CORE",
    valueType: normalizeEnum(
      source.valueType,
      STATS_POOLS_VALUE_TYPE_OPTIONS,
      "INTEGER"
    ),
    scale: {
      mode: scaleMode,
      minimum:
        scaleMode === "BOUNDED" ? normalizeNumber(scale.minimum, 0) : null,
      maximum:
        scaleMode === "BOUNDED" ? normalizeNumber(scale.maximum, 100) : null,
      defaultValue:
        scaleMode === "BEYOND_SCALE"
          ? null
          : normalizeNumber(scale.defaultValue, 0),
    },
    derived: {
      enabled: derivedEnabled,
      formula: derivedEnabled ? normalizeFormula(derived.formula) : null,
    },
    playerReadout: {
      visibility: normalizeEnum(
        playerReadout.visibility,
        STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
        derivedEnabled ? "DETAIL" : "PRIMARY"
      ),
    },
    tags: normalizeTags(source.tags),
    order: normalizeInteger(source.order, index, 0, 100000),
    metadata: normalizeObject(source.metadata),
  };
}

function normalizePool(value = {}, index = 0) {
  const source = normalizeObject(value);
  const maximum = normalizeObject(source.maximum);
  const defaultCurrent = normalizeObject(source.defaultCurrent);
  const playerReadout = normalizeObject(source.playerReadout);
  const maximumMode = normalizeEnum(
    maximum.mode,
    STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS,
    "FIXED"
  );

  return {
    ...createEmptyPoolDefinition(index),
    definitionVersion: "stats_pools_pool_definition_v0",
    id: normalizeString(source.id).toLowerCase() || `pool.${index + 1}`,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    category: normalizeString(source.category).toUpperCase() || "RESOURCE",
    valueType: normalizeEnum(
      source.valueType,
      STATS_POOLS_VALUE_TYPE_OPTIONS,
      "INTEGER"
    ),
    minimum: normalizeNumber(source.minimum, 0),
    maximum: {
      mode: maximumMode,
      value:
        maximumMode === "FIXED" ? normalizeNumber(maximum.value, 100) : null,
      formula:
        maximumMode === "DERIVED" ? normalizeFormula(maximum.formula) : null,
    },
    defaultCurrent: {
      mode: normalizeEnum(
        defaultCurrent.mode,
        STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS,
        "MAXIMUM"
      ),
      value: normalizeNumber(defaultCurrent.value, null),
    },
    allowOverfill: source.allowOverfill === true,
    playerReadout: {
      visibility: normalizeEnum(
        playerReadout.visibility,
        STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
        "PRIMARY"
      ),
    },
    tags: normalizeTags(source.tags),
    order: normalizeInteger(source.order, index, 0, 100000),
    metadata: normalizeObject(source.metadata),
  };
}

function normalizeModifier(value = {}, index = 0) {
  const source = normalizeObject(value);
  const target = normalizeObject(source.target);
  return {
    ...createEmptyModifierDefinition(index),
    definitionVersion: "stats_pools_modifier_definition_v0",
    id: normalizeString(source.id).toLowerCase() || `modifier.${index + 1}`,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    target: {
      targetType: normalizeEnum(
        target.targetType,
        STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS,
        "STAT_CURRENT"
      ),
      definitionId: normalizeString(target.definitionId).toLowerCase(),
    },
    operation: normalizeEnum(
      source.operation,
      STATS_POOLS_MODIFIER_OPERATION_OPTIONS,
      "ADD"
    ),
    value: normalizeNumber(source.value, 0),
    stackPolicy: normalizeEnum(
      source.stackPolicy,
      STATS_POOLS_STACK_POLICY_OPTIONS,
      "STACK"
    ),
    durationPolicy: normalizeEnum(
      source.durationPolicy,
      STATS_POOLS_DURATION_POLICY_OPTIONS,
      "PERSISTENT"
    ),
    defaultDurationTurns: normalizeInteger(
      source.defaultDurationTurns,
      0,
      0,
      100000
    ),
    priority: normalizeInteger(source.priority, 0, -100000, 100000),
    notes: normalizeString(source.notes),
    metadata: normalizeObject(source.metadata),
  };
}

function normalizeCondition(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    ...createEmptyConditionDefinition(index),
    definitionVersion: "stats_pools_condition_definition_v0",
    id: normalizeString(source.id).toLowerCase() || `condition.${index + 1}`,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    stackPolicy: normalizeEnum(
      source.stackPolicy,
      STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS,
      "UNIQUE"
    ),
    maximumStacks: normalizeInteger(source.maximumStacks, 1, 1, 1000),
    modifierDefinitionIds: normalizeTags(source.modifierDefinitionIds),
    tags: normalizeTags(source.tags),
    order: normalizeInteger(source.order, index, 0, 100000),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeStatsPoolsEditorValue(value = {}) {
  const source = normalizeObject(value);
  const capabilityPolicy = normalizeObject(source.capabilityPolicy);
  const capabilityMode = normalizeEnum(
    capabilityPolicy.mode,
    STATS_POOLS_CAPABILITY_MODE_OPTIONS,
    "STANDARD"
  );

  return {
    ...EMPTY_STATS_POOLS_EDITOR_VALUE,
    contractVersion:
      normalizeString(source.contractVersion) ||
      STATS_POOLS_PROFILE_CONTRACT_VERSION,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    profileMode: normalizeEnum(
      source.profileMode,
      STATS_POOLS_PROFILE_MODE_OPTIONS,
      "SPARSE"
    ),
    capabilityPolicy: {
      mode: capabilityMode,
      numericResolutionPolicy:
        capabilityMode === "STANDARD"
          ? "DETERMINISTIC"
          : normalizeEnum(
              capabilityPolicy.numericResolutionPolicy,
              STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
              "WORKING_MODE_ONLY"
            ),
      workingModeProfile: normalizeString(
        capabilityPolicy.workingModeProfile
      ),
      notes: normalizeString(capabilityPolicy.notes),
    },
    statDefinitions: normalizeArray(source.statDefinitions)
      .slice(0, STATS_POOLS_EDITOR_LIMITS.maxStats)
      .map(normalizeStat),
    poolDefinitions: normalizeArray(source.poolDefinitions)
      .slice(0, STATS_POOLS_EDITOR_LIMITS.maxPools)
      .map(normalizePool),
    modifierDefinitions: normalizeArray(source.modifierDefinitions)
      .slice(0, STATS_POOLS_EDITOR_LIMITS.maxModifierDefinitions)
      .map(normalizeModifier),
    conditionDefinitions: normalizeArray(source.conditionDefinitions)
      .slice(0, STATS_POOLS_EDITOR_LIMITS.maxConditionDefinitions)
      .map(normalizeCondition),
    metadata: normalizeObject(source.metadata),
  };
}

function issue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

function validateIdentifier(value, path, label, issues) {
  if (!value) {
    issues.push(issue("IDENTIFIER_REQUIRED", path, `${label} identifier is required.`));
  } else if (value.length > STATS_POOLS_EDITOR_LIMITS.maxIdentifierLength) {
    issues.push(issue("IDENTIFIER_TOO_LONG", path, `${label} identifier is too long.`));
  } else if (!IDENTIFIER_PATTERN.test(value)) {
    issues.push(
      issue(
        "IDENTIFIER_INVALID",
        path,
        `${label} identifiers may use lowercase letters, numbers, dots, colons, underscores, and hyphens.`
      )
    );
  }
}

function validateTitleDescription(definition, path, label, issues) {
  if (!definition.title) {
    issues.push(issue("TITLE_REQUIRED", `${path}.title`, `${label} title is required.`));
  }
  if (definition.title.length > STATS_POOLS_EDITOR_LIMITS.maxTitleLength) {
    issues.push(issue("TITLE_TOO_LONG", `${path}.title`, `${label} title is too long.`));
  }
  if (definition.description.length > STATS_POOLS_EDITOR_LIMITS.maxDescriptionLength) {
    issues.push(
      issue("DESCRIPTION_TOO_LONG", `${path}.description`, `${label} description is too long.`)
    );
  }
}

function validateFormula(formula, path, stats, pools, issues) {
  const operands = normalizeArray(formula?.root?.operands);
  if (operands.length < 2) {
    issues.push(issue("FORMULA_OPERANDS_REQUIRED", `${path}.root.operands`, "A derived formula requires at least two operands."));
  }

  operands.forEach((operand, index) => {
    if (operand.nodeType !== "REFERENCE") return;
    const targetMap = operand.referenceType === "POOL" ? pools : stats;
    if (!operand.referenceId || !targetMap.has(operand.referenceId)) {
      issues.push(
        issue(
          "FORMULA_REFERENCE_UNKNOWN",
          `${path}.root.operands[${index}].referenceId`,
          `Formula references an unknown ${operand.referenceType === "POOL" ? "Pool" : "Stat"}.`
        )
      );
    }
  });
}

export function validateStatsPoolsEditorValue(value = {}) {
  const normalized = normalizeStatsPoolsEditorValue(value);
  const issues = [];

  if (normalized.contractVersion !== STATS_POOLS_PROFILE_CONTRACT_VERSION) {
    issues.push(
      issue(
        "CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${STATS_POOLS_PROFILE_CONTRACT_VERSION}.`
      )
    );
  }
  if (!normalized.title) {
    issues.push(issue("PROFILE_TITLE_REQUIRED", "title", "Profile title is required."));
  }
  if (normalized.title.length > STATS_POOLS_EDITOR_LIMITS.maxTitleLength) {
    issues.push(issue("PROFILE_TITLE_TOO_LONG", "title", "Profile title is too long."));
  }
  if (normalized.description.length > STATS_POOLS_EDITOR_LIMITS.maxDescriptionLength) {
    issues.push(issue("PROFILE_DESCRIPTION_TOO_LONG", "description", "Profile description is too long."));
  }
  if (
    normalized.capabilityPolicy.mode === "BEYOND_SCALE" &&
    normalized.capabilityPolicy.numericResolutionPolicy === "DETERMINISTIC"
  ) {
    issues.push(
      issue(
        "BEYOND_SCALE_DETERMINISTIC_FORBIDDEN",
        "capabilityPolicy.numericResolutionPolicy",
        "Beyond Scale capability cannot use ordinary deterministic numeric resolution."
      )
    );
  }
  if (
    normalized.capabilityPolicy.mode === "BEYOND_SCALE" &&
    normalized.capabilityPolicy.numericResolutionPolicy === "WORKING_MODE_ONLY" &&
    !normalized.capabilityPolicy.workingModeProfile
  ) {
    issues.push(
      issue(
        "WORKING_MODE_PROFILE_RECOMMENDED",
        "capabilityPolicy.workingModeProfile",
        "Identify the restricted working-mode profile used for ordinary numeric resolution.",
        "WARNING"
      )
    );
  }

  const allCollections = [
    [normalized.statDefinitions, "statDefinitions", "Stat"],
    [normalized.poolDefinitions, "poolDefinitions", "Pool"],
    [normalized.modifierDefinitions, "modifierDefinitions", "Modifier"],
    [normalized.conditionDefinitions, "conditionDefinitions", "Condition"],
  ];

  allCollections.forEach(([collection, path, label]) => {
    const seen = new Set();
    collection.forEach((definition, index) => {
      validateIdentifier(definition.id, `${path}[${index}].id`, label, issues);
      validateTitleDescription(definition, `${path}[${index}]`, label, issues);
      if (seen.has(definition.id)) {
        issues.push(
          issue(
            "IDENTIFIER_DUPLICATE",
            `${path}[${index}].id`,
            `Duplicate ${label.toLowerCase()} identifier '${definition.id}'.`
          )
        );
      }
      seen.add(definition.id);
    });
  });

  const stats = new Map(normalized.statDefinitions.map((item) => [item.id, item]));
  const pools = new Map(normalized.poolDefinitions.map((item) => [item.id, item]));
  const modifiers = new Map(
    normalized.modifierDefinitions.map((item) => [item.id, item])
  );

  normalized.statDefinitions.forEach((definition, index) => {
    const path = `statDefinitions[${index}]`;
    if (
      definition.scale.mode === "BOUNDED" &&
      definition.scale.maximum <= definition.scale.minimum
    ) {
      issues.push(
        issue(
          "STAT_SCALE_INVALID",
          `${path}.scale.maximum`,
          "Bounded Stat maximum must be greater than its minimum."
        )
      );
    }
    if (
      definition.scale.mode === "BOUNDED" &&
      (definition.scale.defaultValue < definition.scale.minimum ||
        definition.scale.defaultValue > definition.scale.maximum)
    ) {
      issues.push(
        issue(
          "STAT_DEFAULT_OUT_OF_RANGE",
          `${path}.scale.defaultValue`,
          "Stat default must remain within its bounds."
        )
      );
    }
    if (definition.derived.enabled) {
      validateFormula(definition.derived.formula, `${path}.derived.formula`, stats, pools, issues);
    }
  });

  normalized.poolDefinitions.forEach((definition, index) => {
    const path = `poolDefinitions[${index}]`;
    if (
      definition.maximum.mode === "FIXED" &&
      definition.maximum.value <= definition.minimum
    ) {
      issues.push(
        issue(
          "POOL_MAXIMUM_INVALID",
          `${path}.maximum.value`,
          "Pool maximum must be greater than its minimum."
        )
      );
    }
    if (definition.maximum.mode === "DERIVED") {
      validateFormula(definition.maximum.formula, `${path}.maximum.formula`, stats, pools, issues);
    }
    if (
      definition.defaultCurrent.mode === "FIXED" &&
      definition.defaultCurrent.value === null
    ) {
      issues.push(
        issue(
          "POOL_DEFAULT_CURRENT_REQUIRED",
          `${path}.defaultCurrent.value`,
          "A fixed starting value is required."
        )
      );
    }
    if (
      definition.defaultCurrent.mode === "FIXED" &&
      definition.maximum.mode === "FIXED" &&
      !definition.allowOverfill &&
      (definition.defaultCurrent.value < definition.minimum ||
        definition.defaultCurrent.value > definition.maximum.value)
    ) {
      issues.push(
        issue(
          "POOL_DEFAULT_CURRENT_OUT_OF_RANGE",
          `${path}.defaultCurrent.value`,
          "Pool starting value must remain within its fixed bounds."
        )
      );
    }
  });

  normalized.modifierDefinitions.forEach((definition, index) => {
    const targetMap = definition.target.targetType.startsWith("POOL_")
      ? pools
      : stats;
    if (!definition.target.definitionId || !targetMap.has(definition.target.definitionId)) {
      issues.push(
        issue(
          "MODIFIER_TARGET_UNKNOWN",
          `modifierDefinitions[${index}].target.definitionId`,
          "Modifier target must reference a Stat or Pool in this profile."
        )
      );
    }
    if (
      definition.durationPolicy === "TURN_COUNT" &&
      definition.defaultDurationTurns < 1
    ) {
      issues.push(
        issue(
          "MODIFIER_TURN_DURATION_REQUIRED",
          `modifierDefinitions[${index}].defaultDurationTurns`,
          "Turn-count modifiers require at least one default turn."
        )
      );
    }
  });

  normalized.conditionDefinitions.forEach((definition, index) => {
    definition.modifierDefinitionIds.forEach((modifierId) => {
      if (!modifiers.has(modifierId)) {
        issues.push(
          issue(
            "CONDITION_MODIFIER_UNKNOWN",
            `conditionDefinitions[${index}].modifierDefinitionIds`,
            `Condition references unknown modifier '${modifierId}'.`
          )
        );
      }
    });
  });

  const errors = issues.filter((entry) => entry.severity !== "WARNING");
  const warnings = issues.filter((entry) => entry.severity === "WARNING");

  return {
    valid: errors.length === 0,
    normalized,
    issues,
    errors,
    warnings,
  };
}

function issuesForPrefix(issues, prefix) {
  return issues.filter((entry) => entry.path === prefix || entry.path.startsWith(`${prefix}.`));
}

function withOrder(items) {
  return items.map((item, order) => ({ ...item, order }));
}

export function useStatsPoolsEditorViewModel({
  value = EMPTY_STATS_POOLS_EDITOR_VALUE,
  onChange = null,
  disabled = false,
} = {}) {
  const normalized = useMemo(() => normalizeStatsPoolsEditorValue(value), [value]);
  const validation = useMemo(
    () => validateStatsPoolsEditorValue(normalized),
    [normalized]
  );
  const [activePanel, setActivePanel] = useState("STATS");
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    stats: {},
    pools: {},
    modifiers: {},
    conditions: {},
  });

  function commit(nextValue) {
    if (disabled) return;
    onChange?.(normalizeStatsPoolsEditorValue(nextValue));
  }

  function updateProfile(field, nextValue) {
    commit({ ...normalized, [field]: nextValue });
  }

  function applyJsonProfile(nextProfile) {
    commit(normalizeStatsPoolsEditorValue(nextProfile));
  }

  function updateCapability(field, nextValue) {
    const nextMode = field === "mode" ? nextValue : normalized.capabilityPolicy.mode;
    commit({
      ...normalized,
      capabilityPolicy: {
        ...normalized.capabilityPolicy,
        [field]: nextValue,
        numericResolutionPolicy:
          field === "mode" && nextMode === "STANDARD"
            ? "DETERMINISTIC"
            : field === "mode" && nextMode === "BEYOND_SCALE"
              ? "WORKING_MODE_ONLY"
              : normalized.capabilityPolicy.numericResolutionPolicy,
      },
    });
  }

  function toggleExpanded(collection, id) {
    setExpanded((current) => ({
      ...current,
      [collection]: {
        ...current[collection],
        [id]: !current[collection]?.[id],
      },
    }));
  }

  function updateCollection(collectionKey, updater) {
    commit({
      ...normalized,
      [collectionKey]: withOrder(updater(normalized[collectionKey])),
    });
  }

  function addDefinition(kind) {
    if (kind === "stat") {
      const item = createEmptyStatDefinition(normalized.statDefinitions.length, {
        id: nextUniqueId(normalized.statDefinitions, "stat"),
      });
      updateCollection("statDefinitions", (items) => [...items, item]);
      setActivePanel("STATS");
      setExpanded((current) => ({
        ...current,
        stats: { ...current.stats, [item.id]: true },
      }));
      return;
    }
    if (kind === "pool") {
      const item = createEmptyPoolDefinition(normalized.poolDefinitions.length, {
        id: nextUniqueId(normalized.poolDefinitions, "pool"),
      });
      updateCollection("poolDefinitions", (items) => [...items, item]);
      setActivePanel("POOLS");
      setExpanded((current) => ({
        ...current,
        pools: { ...current.pools, [item.id]: true },
      }));
      return;
    }
    if (kind === "modifier") {
      const firstStat = normalized.statDefinitions[0]?.id || "";
      const item = createEmptyModifierDefinition(
        normalized.modifierDefinitions.length,
        {
          id: nextUniqueId(normalized.modifierDefinitions, "modifier"),
          target: { targetType: "STAT_CURRENT", definitionId: firstStat },
        }
      );
      updateCollection("modifierDefinitions", (items) => [...items, item]);
      setActivePanel("MODIFIERS");
      setExpanded((current) => ({
        ...current,
        modifiers: { ...current.modifiers, [item.id]: true },
      }));
      return;
    }

    const item = createEmptyConditionDefinition(
      normalized.conditionDefinitions.length,
      { id: nextUniqueId(normalized.conditionDefinitions, "condition") }
    );
    updateCollection("conditionDefinitions", (items) => [...items, item]);
    setActivePanel("CONDITIONS");
    setExpanded((current) => ({
      ...current,
      conditions: { ...current.conditions, [item.id]: true },
    }));
  }

  function removeDefinition(kind, id) {
    const key = {
      stat: "statDefinitions",
      pool: "poolDefinitions",
      modifier: "modifierDefinitions",
      condition: "conditionDefinitions",
    }[kind];
    updateCollection(key, (items) => items.filter((item) => item.id !== id));
  }

  function moveDefinition(kind, id, direction) {
    const key = {
      stat: "statDefinitions",
      pool: "poolDefinitions",
      modifier: "modifierDefinitions",
      condition: "conditionDefinitions",
    }[kind];
    updateCollection(key, (items) => {
      const index = items.findIndex((item) => item.id === id);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= items.length) return items;
      const next = [...items];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function updateDefinition(kind, id, field, nextValue) {
    const key = {
      stat: "statDefinitions",
      pool: "poolDefinitions",
      modifier: "modifierDefinitions",
      condition: "conditionDefinitions",
    }[kind];

    updateCollection(key, (items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        if (field === "id") {
          const nextId = String(nextValue || "").toLowerCase();
          const collectionName = {
            stat: "stats",
            pool: "pools",
            modifier: "modifiers",
            condition: "conditions",
          }[kind];
          setExpanded((current) => {
            const nextCollection = { ...current[collectionName] };
            const wasExpanded = Boolean(nextCollection[id]);
            delete nextCollection[id];
            if (nextId) nextCollection[nextId] = wasExpanded;
            return { ...current, [collectionName]: nextCollection };
          });
          return { ...item, id: nextId };
        }
        if (field === "tags") return { ...item, tags: normalizeTags(nextValue) };
        if (field === "modifierDefinitionIds") {
          return { ...item, modifierDefinitionIds: normalizeTags(nextValue) };
        }
        if (field.startsWith("scale.")) {
          const nested = field.split(".")[1];
          const nextScale = { ...item.scale, [nested]: nextValue };
          if (nested === "mode" && nextValue === "BEYOND_SCALE") {
            nextScale.minimum = null;
            nextScale.maximum = null;
            nextScale.defaultValue = null;
          }
          return { ...item, scale: nextScale };
        }
        if (field.startsWith("maximum.")) {
          const nested = field.split(".")[1];
          const nextMaximum = { ...item.maximum, [nested]: nextValue };
          if (nested === "mode" && nextValue === "DERIVED" && !nextMaximum.formula) {
            nextMaximum.value = null;
            nextMaximum.formula = createEmptyFormula();
          }
          if (nested === "mode" && nextValue === "FIXED") {
            nextMaximum.value = 100;
            nextMaximum.formula = null;
          }
          return { ...item, maximum: nextMaximum };
        }
        if (field.startsWith("defaultCurrent.")) {
          const nested = field.split(".")[1];
          return {
            ...item,
            defaultCurrent: { ...item.defaultCurrent, [nested]: nextValue },
          };
        }
        if (field.startsWith("playerReadout.")) {
          const nested = field.split(".")[1];
          return {
            ...item,
            playerReadout: {
              ...normalizeObject(item.playerReadout),
              [nested]: nextValue,
            },
          };
        }
        if (field.startsWith("target.")) {
          const nested = field.split(".")[1];
          const target = { ...item.target, [nested]: nextValue };
          if (nested === "targetType") {
            const options = String(nextValue).startsWith("POOL_")
              ? normalized.poolDefinitions
              : normalized.statDefinitions;
            target.definitionId = options[0]?.id || "";
          }
          return { ...item, target };
        }
        if (field === "derivedEnabled") {
          const enablingDerived = Boolean(nextValue);
          return {
            ...item,
            derived: {
              enabled: enablingDerived,
              formula: enablingDerived
                ? item.derived?.formula || createEmptyFormula()
                : null,
            },
            playerReadout: enablingDerived
              ? { visibility: "DETAIL" }
              : item.playerReadout,
          };
        }
        return { ...item, [field]: nextValue };
      })
    );
  }

  function updateFormula(kind, id, field, nextValue) {
    const key = kind === "stat" ? "statDefinitions" : "poolDefinitions";
    updateCollection(key, (items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const formula =
          kind === "stat"
            ? item.derived.formula || createEmptyFormula()
            : item.maximum.formula || createEmptyFormula();
        const nextFormula = {
          ...formula,
          [field]: nextValue,
          root:
            field === "operation"
              ? { ...formula.root, operation: nextValue }
              : formula.root,
        };
        if (field === "operation") delete nextFormula.operation;

        return kind === "stat"
          ? { ...item, derived: { ...item.derived, formula: nextFormula } }
          : { ...item, maximum: { ...item.maximum, formula: nextFormula } };
      })
    );
  }

  function updateFormulaOperand(kind, id, operandIndex, field, nextValue) {
    const key = kind === "stat" ? "statDefinitions" : "poolDefinitions";
    updateCollection(key, (items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const formula =
          kind === "stat"
            ? item.derived.formula || createEmptyFormula()
            : item.maximum.formula || createEmptyFormula();
        const operands = formula.root.operands.map((operand, index) => {
          if (index !== operandIndex) return operand;
          if (field === "nodeType") {
            return flattenFormulaOperand(
              normalizeFormulaOperand(
                createEmptyFormulaOperand({ nodeType: nextValue })
              )
            );
          }
          return { ...operand, [field]: nextValue };
        });
        const nextFormula = {
          ...formula,
          root: { ...formula.root, operands },
        };
        return kind === "stat"
          ? { ...item, derived: { ...item.derived, formula: nextFormula } }
          : { ...item, maximum: { ...item.maximum, formula: nextFormula } };
      })
    );
  }

  function addFormulaOperand(kind, id) {
    const key = kind === "stat" ? "statDefinitions" : "poolDefinitions";
    updateCollection(key, (items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const formula =
          kind === "stat"
            ? item.derived.formula || createEmptyFormula()
            : item.maximum.formula || createEmptyFormula();
        if (formula.root.operands.length >= STATS_POOLS_EDITOR_LIMITS.maxFormulaOperands) {
          return item;
        }
        const nextFormula = {
          ...formula,
          root: {
            ...formula.root,
            operands: [...formula.root.operands, { nodeType: "CONSTANT", value: 0 }],
          },
        };
        return kind === "stat"
          ? { ...item, derived: { ...item.derived, formula: nextFormula } }
          : { ...item, maximum: { ...item.maximum, formula: nextFormula } };
      })
    );
  }

  function removeFormulaOperand(kind, id, operandIndex) {
    const key = kind === "stat" ? "statDefinitions" : "poolDefinitions";
    updateCollection(key, (items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const formula =
          kind === "stat"
            ? item.derived.formula || createEmptyFormula()
            : item.maximum.formula || createEmptyFormula();
        if (formula.root.operands.length <= 2) return item;
        const nextFormula = {
          ...formula,
          root: {
            ...formula.root,
            operands: formula.root.operands.filter((_, index) => index !== operandIndex),
          },
        };
        return kind === "stat"
          ? { ...item, derived: { ...item.derived, formula: nextFormula } }
          : { ...item, maximum: { ...item.maximum, formula: nextFormula } };
      })
    );
  }

  const decorate = (items, prefix, collectionName) =>
    items.map((item, index) => ({
      ...item,
      expanded: Boolean(expanded[collectionName]?.[item.id]),
      issues: issuesForPrefix(validation.issues, `${prefix}[${index}]`),
      tagsInput: (Array.isArray(item.tags) ? item.tags : []).join(", "),
      modifierDefinitionIdsInput: (
        Array.isArray(item.modifierDefinitionIds)
          ? item.modifierDefinitionIds
          : []
      ).join(", "),
    }));

  const statOptions = normalized.statDefinitions.map((item) => ({
    value: item.id,
    label: item.title || item.id,
  }));
  const poolOptions = normalized.poolDefinitions.map((item) => ({
    value: item.id,
    label: item.title || item.id,
  }));
  const modifierOptions = normalized.modifierDefinitions.map((item) => ({
    value: item.id,
    label: item.title || item.id,
  }));

  return {
    profile: normalized,
    disabled,
    enabled: normalized.enabled,
    title: normalized.title,
    description: normalized.description,
    profileMode: normalized.profileMode,
    capabilityPolicy: normalized.capabilityPolicy,
    activePanel,
    panelCounts: {
      STATS: normalized.statDefinitions.length,
      POOLS: normalized.poolDefinitions.length,
      MODIFIERS: normalized.modifierDefinitions.length,
      CONDITIONS: normalized.conditionDefinitions.length,
    },
    stats: decorate(normalized.statDefinitions, "statDefinitions", "stats"),
    pools: decorate(normalized.poolDefinitions, "poolDefinitions", "pools"),
    modifiers: decorate(
      normalized.modifierDefinitions,
      "modifierDefinitions",
      "modifiers"
    ),
    conditions: decorate(
      normalized.conditionDefinitions,
      "conditionDefinitions",
      "conditions"
    ),
    statOptions,
    poolOptions,
    modifierOptions,
    profileModeOptions: STATS_POOLS_PROFILE_MODE_OPTIONS,
    capabilityModeOptions: STATS_POOLS_CAPABILITY_MODE_OPTIONS,
    numericResolutionOptions: STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
    valueTypeOptions: STATS_POOLS_VALUE_TYPE_OPTIONS,
    playerReadoutVisibilityOptions:
      STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
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
    globalIssues: validation.issues.filter(
      (entry) =>
        !entry.path.startsWith("statDefinitions[") &&
        !entry.path.startsWith("poolDefinitions[") &&
        !entry.path.startsWith("modifierDefinitions[") &&
        !entry.path.startsWith("conditionDefinitions[")
    ),
    errorCount: validation.errors.length,
    warningCount: validation.warnings.length,
    valid: validation.valid,
    jsonEditorOpen,
    onOpenJsonEditor: () => setJsonEditorOpen(true),
    onCloseJsonEditor: () => setJsonEditorOpen(false),
    onApplyJsonProfile: applyJsonProfile,
    metrics: {
      statCount: normalized.statDefinitions.length,
      poolCount: normalized.poolDefinitions.length,
      modifierCount: normalized.modifierDefinitions.length,
      conditionCount: normalized.conditionDefinitions.length,
      derivedStatCount: normalized.statDefinitions.filter(
        (item) => item.derived.enabled
      ).length,
      derivedPoolCount: normalized.poolDefinitions.filter(
        (item) => item.maximum.mode === "DERIVED"
      ).length,
    },
    titleCharacterCount: normalized.title.length,
    titleCharacterLimit: STATS_POOLS_EDITOR_LIMITS.maxTitleLength,
    descriptionCharacterCount: normalized.description.length,
    descriptionCharacterLimit: STATS_POOLS_EDITOR_LIMITS.maxDescriptionLength,
    capabilityNotesCharacterCount: normalized.capabilityPolicy.notes.length,
    capabilityNotesCharacterLimit: STATS_POOLS_EDITOR_LIMITS.maxNotesLength,
    onSetActivePanel: setActivePanel,
    onSetEnabled: (nextValue) => updateProfile("enabled", nextValue),
    onUpdateProfile: updateProfile,
    onUpdateCapability: updateCapability,
    onToggleExpanded: toggleExpanded,
    onAddDefinition: addDefinition,
    onRemoveDefinition: removeDefinition,
    onMoveDefinition: moveDefinition,
    onUpdateDefinition: updateDefinition,
    onUpdateFormula: updateFormula,
    onUpdateFormulaOperand: updateFormulaOperand,
    onAddFormulaOperand: addFormulaOperand,
    onRemoveFormulaOperand: removeFormulaOperand,
  };
}
