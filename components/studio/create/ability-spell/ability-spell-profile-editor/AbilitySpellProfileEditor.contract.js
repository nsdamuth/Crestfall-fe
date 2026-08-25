export const ABILITY_SPELL_PROFILE_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";
export const ABILITY_SPELL_PROFILE_CONTRACT_VERSION = "ability_spell_profile_contract_v0";
export const ABILITY_SPELL_DEFINITION_VERSION = "ability_spell_definition_v0";
export const ABILITY_SPELL_PREREQUISITE_VERSION = "ability_spell_prerequisite_v0";
export const ABILITY_SPELL_COST_VERSION = "ability_spell_cost_v0";
export const ABILITY_SPELL_TARGET_MODEL_VERSION = "ability_spell_target_model_v0";
export const ABILITY_SPELL_RESTRICTIONS_VERSION = "ability_spell_restrictions_v0";
export const ABILITY_SPELL_OPERATION_REFERENCE_VERSION = "ability_spell_operation_reference_v0";
export const ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION =
  "ability_spell_operation_reference_v1";
export const ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION =
  "ability_spell_operation_target_binding_v0";
export const ABILITY_SPELL_COOLDOWN_POLICY_VERSION = "ability_spell_cooldown_policy_v0";
export const ABILITY_SPELL_CHARGE_POLICY_VERSION = "ability_spell_charge_policy_v0";
export const ABILITY_SPELL_MASTERY_POLICY_VERSION = "ability_spell_mastery_policy_v0";
export const ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION =
  "ability_spell_actor_configuration_v1";

export const ABILITY_SPELL_DEFINITION_SELECTION_MODES = Object.freeze([
  "NONE",
  "GROUPS",
]);

export const ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODES = Object.freeze([
  "NONE",
  "GROUPS",
]);

export const ABILITY_SPELL_ROOM_LOCAL_DEFINITION_MECHANICS_MODES = Object.freeze([
  "NARRATIVE_ONLY",
]);

export const ABILITY_SPELL_ROOM_LOCAL_REQUIRED_FIELDS = Object.freeze([
  "DESCRIPTION",
  "NARRATIVE_DESCRIPTION",
]);

export const ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS = Object.freeze([
  "SCHOOL",
  "CATEGORY",
  "DESCRIPTION",
  "NARRATIVE_DESCRIPTION",
]);

export const ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES = Object.freeze([
  "AUTO",
  "FREE_ENTRY",
  "FIXED_LIST",
  "LIST_PLUS_CUSTOM",
]);

export const ABILITY_SPELL_ROOM_LOCAL_CUSTOM_FIELD_INPUT_MODES = Object.freeze([
  "LONG_TEXT",
  "TEXT",
  "SINGLE_SELECT",
  "SINGLE_SELECT_OR_CUSTOM",
]);
export const ABILITY_SPELL_DEFINITION_SELECTION_MODE_OPTIONS = Object.freeze([
  { value: "NONE", label: "No starting Ability/Spell selection" },
  { value: "GROUPS", label: "Starting definition groups" },
]);
export const ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODE_OPTIONS = Object.freeze([
  { value: "NONE", label: "No player-authored room-local definitions" },
  { value: "GROUPS", label: "Player-authored room-local definition groups" },
]);

export const ABILITY_SPELL_PROFILE_LIMITS = Object.freeze({
  maxDefinitions: 128,
  maxAliases: 24,
  maxRequiredUnlocks: 32,
  maxRequiredSkills: 32,
  maxTierIds: 24,
  maxCosts: 16,
  maxOperationReferences: 16,
  maxTags: 24,
  maxIdentifierLength: 96,
  maxTitleLength: 160,
  maxDescriptionLength: 4000,
  maxNotesLength: 2400,
  maxCostAmount: 1000000000,
  maxPolicyAmount: 1000000,
  maxTargets: 1000,
  maxSelectionGroups: 16,
  maxSelectionsPerGroup: 16,
  maxSelectionFilterValues: 32,
  maxRoomLocalAuthoringGroups: 16,
  maxRoomLocalDefinitionsPerGroup: 16,
  maxRoomLocalCustomTextFields: 24,
  maxRoomLocalCustomTextLength: 4000,
});

export const ABILITY_SPELL_TYPES = Object.freeze([
  "SPELL",
  "ABILITY",
  "TECHNIQUE",
  "SPECIAL_ATTACK",
  "PASSIVE",
]);

export const ABILITY_SPELL_UNLOCK_TYPES = Object.freeze([
  "ABILITY",
  "SPELL",
  "SKILL",
  "FEATURE",
  "PASSIVE",
  "COMMAND",
  "EQUIPMENT_ACCESS",
  "ITEM_ACCESS",
  "TITLE",
  "CUSTOM",
]);

export const ABILITY_SPELL_COST_RESOURCE_TYPES = Object.freeze([
  "POOL",
  "CHARGE",
  "ITEM",
  "CURRENCY",
  "CUSTOM",
]);

export const ABILITY_SPELL_COST_TIMINGS = Object.freeze([
  "ON_ATTEMPT",
  "ON_SUCCESS",
  "ON_USE",
  "CUSTOM",
]);

export const ABILITY_SPELL_TARGET_MODES = Object.freeze([
  "NONE",
  "SELF",
  "ACTOR_SINGLE",
  "ACTOR_MULTIPLE",
  "LOCATION",
  "AREA",
  "ITEM",
  "CUSTOM",
]);

export const ABILITY_SPELL_COOLDOWN_MODES = Object.freeze([
  "NONE",
  "TURN_COUNT",
  "SCENE",
  "WORLD_TIME",
  "CUSTOM",
]);

export const ABILITY_SPELL_COOLDOWN_UNITS = Object.freeze([
  "TURN",
  "MINUTE",
  "HOUR",
  "CUSTOM",
]);

export const ABILITY_SPELL_CHARGE_MODES = Object.freeze([
  "UNLIMITED",
  "FIXED",
  "CUSTOM",
]);

export const ABILITY_SPELL_CHARGE_RESET_POLICIES = Object.freeze([
  "NONE",
  "TURN",
  "SCENE",
  "REST",
  "WORLD_TIME",
  "CUSTOM",
]);

export const ABILITY_SPELL_MASTERY_MODES = Object.freeze([
  "NONE",
  "RANKED",
  "NUMERIC",
  "CUSTOM",
]);

export const ABILITY_SPELL_OPERATION_REFERENCE_VERSIONS = Object.freeze([
  ABILITY_SPELL_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
]);

export const ABILITY_SPELL_OPERATION_TARGET_BINDING_MODES = Object.freeze([
  "SOURCE_ACTOR",
  "AUTHORIZED_ABILITY_TARGET",
]);

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeIdentifier(value, fallback = "") {
  return normalizeString(value).toLowerCase() || fallback;
}

function normalizeInteger(value, fallback = 0, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function normalizeNumber(value, fallback = 0, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function uniqueStrings(values, { lowercase = true, limit = ABILITY_SPELL_PROFILE_LIMITS.maxTags } = {}) {
  const source = Array.isArray(values)
    ? values
    : typeof values === "string"
      ? values.split(",")
      : [];
  const seen = new Set();
  const result = [];

  source.forEach((value) => {
    const raw = normalizeString(value);
    const candidate = lowercase ? raw.toLowerCase() : raw;
    if (!candidate || seen.has(candidate) || result.length >= limit) return;
    seen.add(candidate);
    result.push(candidate);
  });

  return result;
}

function normalizeEnum(value, allowed, fallback) {
  const candidate = normalizeUpper(value);
  return allowed.includes(candidate) ? candidate : candidate || fallback;
}

function createIssue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function normalizeAbilitySpellUnlockRequirement(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    unlockType: normalizeEnum(source.unlockType || source.type, ABILITY_SPELL_UNLOCK_TYPES, "CUSTOM"),
    unlockId: normalizeIdentifier(source.unlockId || source.id) || null,
    referenceType: normalizeUpper(source.referenceType) || null,
    referenceId: normalizeString(source.referenceId) || null,
    title: normalizeString(source.title) || `Unlock ${index + 1}`,
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellSkillRequirement(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    skillId: normalizeIdentifier(source.skillId || source.id, `skill.${index + 1}`),
    minimumRank: normalizeInteger(source.minimumRank ?? source.rank, 1, 0, 20),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellPrerequisites(value = {}) {
  const source = normalizeObject(value);
  return {
    prerequisiteVersion: normalizeString(source.prerequisiteVersion) || ABILITY_SPELL_PREREQUISITE_VERSION,
    minimumLevel: normalizeInteger(source.minimumLevel, 0, 0),
    requiredTierIds: uniqueStrings(source.requiredTierIds, { limit: ABILITY_SPELL_PROFILE_LIMITS.maxTierIds }),
    requiredUnlocks: normalizeArray(source.requiredUnlocks)
      .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxRequiredUnlocks)
      .map(normalizeAbilitySpellUnlockRequirement),
    requiredSkills: normalizeArray(source.requiredSkills)
      .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxRequiredSkills)
      .map(normalizeAbilitySpellSkillRequirement),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellCost(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    costVersion: normalizeString(source.costVersion) || ABILITY_SPELL_COST_VERSION,
    id: normalizeIdentifier(source.id, `cost.${index + 1}`),
    resourceType: normalizeEnum(source.resourceType, ABILITY_SPELL_COST_RESOURCE_TYPES, "POOL"),
    resourceId: normalizeIdentifier(source.resourceId) || null,
    amount: normalizeNumber(source.amount, 0, 0, ABILITY_SPELL_PROFILE_LIMITS.maxCostAmount),
    timing: normalizeEnum(source.timing, ABILITY_SPELL_COST_TIMINGS, "ON_USE"),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellTargetModel(value = {}) {
  const source = normalizeObject(value);
  const mode = normalizeEnum(source.mode, ABILITY_SPELL_TARGET_MODES, "SELF");
  const defaultMinimum = mode === "NONE" ? 0 : 1;
  const minimumTargets = normalizeInteger(
    source.minimumTargets,
    defaultMinimum,
    0,
    ABILITY_SPELL_PROFILE_LIMITS.maxTargets
  );
  const maximumTargets = normalizeInteger(
    source.maximumTargets,
    Math.max(defaultMinimum, minimumTargets),
    0,
    ABILITY_SPELL_PROFILE_LIMITS.maxTargets
  );
  return {
    targetVersion: normalizeString(source.targetVersion) || ABILITY_SPELL_TARGET_MODEL_VERSION,
    mode,
    minimumTargets,
    maximumTargets,
    rangeClass: normalizeUpper(source.rangeClass) || (mode === "SELF" ? "SELF" : "UNSPECIFIED"),
    requiresLineOfSight: source.requiresLineOfSight === true,
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellRestrictions(value = {}) {
  const source = normalizeObject(value);
  return {
    restrictionVersion: normalizeString(source.restrictionVersion) || ABILITY_SPELL_RESTRICTIONS_VERSION,
    requiredTags: uniqueStrings(source.requiredTags),
    forbiddenTags: uniqueStrings(source.forbiddenTags),
    notes: normalizeString(source.notes),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellOperationTargetBinding(value = {}) {
  const source = normalizeObject(value);
  return {
    bindingVersion:
      normalizeString(source.bindingVersion || source.version) ||
      ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
    mode: normalizeEnum(
      source.mode,
      ABILITY_SPELL_OPERATION_TARGET_BINDING_MODES,
      "SOURCE_ACTOR"
    ),
  };
}

export function normalizeAbilitySpellOperationReference(value = {}, index = 0) {
  const source = normalizeObject(value);
  const referenceVersion =
    normalizeString(source.referenceVersion) ||
    ABILITY_SPELL_OPERATION_REFERENCE_VERSION;
  const executable =
    referenceVersion === ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION;
  const targetBindingSource = normalizeObject(
    source.targetBinding || source.target_binding
  );

  return {
    referenceVersion,
    id: normalizeIdentifier(source.id, `operation.${index + 1}`),
    domain: normalizeUpper(source.domain) || "CUSTOM",
    operation: normalizeUpper(source.operation),
    version: normalizeString(source.version) || null,
    ...(executable
      ? {
          targetBinding: Object.keys(targetBindingSource).length
            ? normalizeAbilitySpellOperationTargetBinding(targetBindingSource)
            : null,
          arguments: normalizeObject(source.arguments || source.parameters),
        }
      : {}),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellCooldownPolicy(value = {}) {
  const source = normalizeObject(value);
  return {
    policyVersion: normalizeString(source.policyVersion) || ABILITY_SPELL_COOLDOWN_POLICY_VERSION,
    mode: normalizeEnum(source.mode, ABILITY_SPELL_COOLDOWN_MODES, "NONE"),
    amount: normalizeInteger(source.amount, 0, 0, ABILITY_SPELL_PROFILE_LIMITS.maxPolicyAmount),
    unit: normalizeEnum(source.unit, ABILITY_SPELL_COOLDOWN_UNITS, "TURN"),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellChargePolicy(value = {}) {
  const source = normalizeObject(value);
  return {
    policyVersion: normalizeString(source.policyVersion) || ABILITY_SPELL_CHARGE_POLICY_VERSION,
    mode: normalizeEnum(source.mode, ABILITY_SPELL_CHARGE_MODES, "UNLIMITED"),
    maximumCharges: normalizeInteger(source.maximumCharges, 0, 0, ABILITY_SPELL_PROFILE_LIMITS.maxPolicyAmount),
    resetPolicy: normalizeEnum(source.resetPolicy, ABILITY_SPELL_CHARGE_RESET_POLICIES, "NONE"),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellMasteryPolicy(value = {}) {
  const source = normalizeObject(value);
  return {
    policyVersion: normalizeString(source.policyVersion) || ABILITY_SPELL_MASTERY_POLICY_VERSION,
    mode: normalizeEnum(source.mode, ABILITY_SPELL_MASTERY_MODES, "NONE"),
    maximumMastery: normalizeInteger(source.maximumMastery, 0, 0, ABILITY_SPELL_PROFILE_LIMITS.maxPolicyAmount),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellDefinition(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    definitionVersion: normalizeString(source.definitionVersion) || ABILITY_SPELL_DEFINITION_VERSION,
    id: normalizeIdentifier(source.id, `ability.${index + 1}`),
    title: normalizeString(source.title) || `Ability ${index + 1}`,
    aliases: uniqueStrings(source.aliases, { lowercase: false, limit: ABILITY_SPELL_PROFILE_LIMITS.maxAliases }),
    type: normalizeEnum(source.type, ABILITY_SPELL_TYPES, "ABILITY"),
    school: normalizeUpper(source.school) || "GENERAL",
    category: normalizeUpper(source.category) || "GENERAL",
    description: normalizeString(source.description),
    narrativeDescription: normalizeString(source.narrativeDescription),
    enabled: source.enabled !== false,
    prerequisites: normalizeAbilitySpellPrerequisites(source.prerequisites),
    costs: normalizeArray(source.costs)
      .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxCosts)
      .map(normalizeAbilitySpellCost),
    targetModel: normalizeAbilitySpellTargetModel(source.targetModel),
    restrictions: normalizeAbilitySpellRestrictions(source.restrictions),
    operationReferences: normalizeArray(source.operationReferences)
      .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxOperationReferences)
      .map(normalizeAbilitySpellOperationReference),
    cooldownPolicy: normalizeAbilitySpellCooldownPolicy(source.cooldownPolicy),
    chargePolicy: normalizeAbilitySpellChargePolicy(source.chargePolicy),
    masteryPolicy: normalizeAbilitySpellMasteryPolicy(source.masteryPolicy),
    tags: uniqueStrings(source.tags),
    metadata: normalizeObject(source.metadata),
  };
}


export function normalizeAbilitySpellSelectionGroup(value = {}, index = 0) {
  const source = normalizeObject(value);
  const minimumSelections = normalizeInteger(
    source.minimumSelections ?? source.minimum ?? source.min,
    0,
    0,
    ABILITY_SPELL_PROFILE_LIMITS.maxSelectionsPerGroup
  );
  return {
    id: normalizeIdentifier(source.id, `selection.${index + 1}`),
    title: normalizeString(source.title) || `Starting Ability Group ${index + 1}`,
    minimumSelections,
    maximumSelections: normalizeInteger(
      source.maximumSelections ?? source.maximum ?? source.max,
      Math.max(1, minimumSelections),
      minimumSelections,
      ABILITY_SPELL_PROFILE_LIMITS.maxSelectionsPerGroup
    ),
    allowedTypes: uniqueStrings(source.allowedTypes, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }).map(normalizeUpper),
    allowedSchools: uniqueStrings(source.allowedSchools, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }).map(normalizeUpper),
    allowedCategories: uniqueStrings(source.allowedCategories, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }).map(normalizeUpper),
    requireSameSchool: source.requireSameSchool === true,
    metadata: normalizeObject(source.metadata),
  };
}


export function normalizeAbilitySpellRoomLocalCustomTextField(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    id: normalizeIdentifier(source.id, `field.${index + 1}`),
    title: normalizeString(source.title) || `Custom field ${index + 1}`,
    helperText: normalizeString(source.helperText || source.description),
    required: source.required === true,
    inputMode: normalizeEnum(
      source.inputMode || source.input_mode,
      ABILITY_SPELL_ROOM_LOCAL_CUSTOM_FIELD_INPUT_MODES,
      "LONG_TEXT"
    ),
    options: uniqueStrings(source.options || source.choices, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }),
    maxLength: normalizeInteger(
      source.maxLength,
      1200,
      1,
      ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalCustomTextLength
    ),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellRoomLocalDefinitionAuthoringGroup(value = {}, index = 0) {
  const source = normalizeObject(value);
  const minimumDefinitions = normalizeInteger(
    source.minimumDefinitions ?? source.minimum ?? source.min,
    0,
    0,
    ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalDefinitionsPerGroup
  );
  const maximumDefinitions = normalizeInteger(
    source.maximumDefinitions ?? source.maximum ?? source.max,
    Math.max(1, minimumDefinitions),
    minimumDefinitions,
    ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalDefinitionsPerGroup
  );
  return {
    id: normalizeIdentifier(source.id, `authoring.${index + 1}`),
    title: normalizeString(source.title) || `Player-authored definition group ${index + 1}`,
    minimumDefinitions,
    maximumDefinitions,
    allowedTypes: uniqueStrings(source.allowedTypes, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }).map(normalizeUpper),
    allowedSchools: uniqueStrings(source.allowedSchools, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }).map(normalizeUpper),
    allowedCategories: uniqueStrings(source.allowedCategories, {
      lowercase: false,
      limit: ABILITY_SPELL_PROFILE_LIMITS.maxSelectionFilterValues,
    }).map(normalizeUpper),
    visibleFields: uniqueStrings(
      Array.isArray(source.visibleFields)
        ? source.visibleFields
        : ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS,
      {
        lowercase: false,
        limit: ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS.length,
      }
    ).map(normalizeUpper),
    schoolInputMode: normalizeEnum(
      source.schoolInputMode || source.school_input_mode,
      ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES,
      "AUTO"
    ),
    categoryInputMode: normalizeEnum(
      source.categoryInputMode || source.category_input_mode,
      ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES,
      "AUTO"
    ),
    requireSameSchool: source.requireSameSchool === true,
    requiredFields: uniqueStrings(source.requiredFields, {
      lowercase: false,
      limit: ABILITY_SPELL_ROOM_LOCAL_REQUIRED_FIELDS.length,
    }).map(normalizeUpper),
    customTextFields: normalizeArray(source.customTextFields)
      .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalCustomTextFields)
      .map(normalizeAbilitySpellRoomLocalCustomTextField),
    mechanicsMode: normalizeEnum(
      source.mechanicsMode,
      ABILITY_SPELL_ROOM_LOCAL_DEFINITION_MECHANICS_MODES,
      "NARRATIVE_ONLY"
    ),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeAbilitySpellActorConfiguration(value = {}) {
  const source = normalizeObject(value);
  const selectionSource = normalizeObject(
    source.definitionSelection || source.definition_selection
  );
  const requestedMode = normalizeUpper(selectionSource.mode);
  const mode = ABILITY_SPELL_DEFINITION_SELECTION_MODES.includes(requestedMode)
    ? requestedMode
    : "NONE";
  const authoringSource = normalizeObject(
    source.roomLocalDefinitionAuthoring || source.room_local_definition_authoring
  );
  const requestedAuthoringMode = normalizeUpper(authoringSource.mode);
  const authoringMode = ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODES.includes(
    requestedAuthoringMode
  )
    ? requestedAuthoringMode
    : "NONE";

  return {
    version:
      normalizeString(source.version) || ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION,
    definitionSelection: {
      mode,
      requireUniqueDefinitions:
        mode === "GROUPS" ? selectionSource.requireUniqueDefinitions !== false : false,
      groups:
        mode === "GROUPS"
          ? normalizeArray(selectionSource.groups)
              .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxSelectionGroups)
              .map(normalizeAbilitySpellSelectionGroup)
          : [],
      metadata: normalizeObject(selectionSource.metadata),
    },
    roomLocalDefinitionAuthoring: {
      mode: authoringMode,
      requireUniqueTitles:
        authoringMode === "GROUPS" ? authoringSource.requireUniqueTitles !== false : false,
      groups:
        authoringMode === "GROUPS"
          ? normalizeArray(authoringSource.groups)
              .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalAuthoringGroups)
              .map(normalizeAbilitySpellRoomLocalDefinitionAuthoringGroup)
          : [],
      metadata: normalizeObject(authoringSource.metadata),
    },
  };
}
function abilityDefinitionMatchesSelectionGroup(definition = {}, group = {}) {
  if (definition?.enabled === false) return false;
  const type = normalizeUpper(definition?.type);
  const school = normalizeUpper(definition?.school) || "GENERAL";
  const category = normalizeUpper(definition?.category) || "GENERAL";
  return (
    (!normalizeArray(group.allowedTypes).length || group.allowedTypes.includes(type)) &&
    (!normalizeArray(group.allowedSchools).length || group.allowedSchools.includes(school)) &&
    (!normalizeArray(group.allowedCategories).length || group.allowedCategories.includes(category))
  );
}

function selectionGroupEligibleDefinitions(profile = {}, group = {}) {
  return normalizeArray(profile?.abilityDefinitions).filter((definition) =>
    abilityDefinitionMatchesSelectionGroup(definition, group)
  );
}

function requiredUniqueSelectionAssignmentPossible(profile = {}, groups = []) {
  const requiredSlots = [];
  for (const group of normalizeArray(groups)) {
    const eligibleIds = selectionGroupEligibleDefinitions(profile, group).map(
      (definition) => definition.id
    );
    for (let index = 0; index < Number(group.minimumSelections || 0); index += 1) {
      requiredSlots.push({ eligibleIds });
    }
  }
  const assignedSlotByDefinition = new Map();
  function assign(slotIndex, visited) {
    const slot = requiredSlots[slotIndex];
    for (const definitionId of slot.eligibleIds) {
      if (visited.has(definitionId)) continue;
      visited.add(definitionId);
      if (
        !assignedSlotByDefinition.has(definitionId) ||
        assign(assignedSlotByDefinition.get(definitionId), visited)
      ) {
        assignedSlotByDefinition.set(definitionId, slotIndex);
        return true;
      }
    }
    return false;
  }
  return requiredSlots.every((_slot, index) => assign(index, new Set()));
}

export function normalizeAbilitySpellProfileEditorValue(value = {}) {
  const source = normalizeObject(value);
  return {
    contractVersion: normalizeString(source.contractVersion) || ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    actorConfiguration: normalizeAbilitySpellActorConfiguration(source.actorConfiguration),
    abilityDefinitions: normalizeArray(source.abilityDefinitions)
      .slice(0, ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions)
      .map(normalizeAbilitySpellDefinition),
    tags: uniqueStrings(source.tags),
    metadata: normalizeObject(source.metadata),
  };
}

function validateIdentifier(value, path, label, issues) {
  if (!IDENTIFIER_PATTERN.test(value)) {
    issues.push(createIssue(
      "ABILITY_SPELL_IDENTIFIER_INVALID",
      path,
      `${label} must use lowercase letters, numbers, dots, colons, underscores, or hyphens.`
    ));
  }
  if (value.length > ABILITY_SPELL_PROFILE_LIMITS.maxIdentifierLength) {
    issues.push(createIssue(
      "ABILITY_SPELL_IDENTIFIER_TOO_LONG",
      path,
      `${label} must not exceed ${ABILITY_SPELL_PROFILE_LIMITS.maxIdentifierLength} characters.`
    ));
  }
}

export function validateAbilitySpellProfileEditorValue(value = {}) {
  const raw = normalizeObject(value);
  const normalized = normalizeAbilitySpellProfileEditorValue(value);
  const issues = [];

  if (normalized.contractVersion !== ABILITY_SPELL_PROFILE_CONTRACT_VERSION) {
    issues.push(createIssue(
      "ABILITY_SPELL_PROFILE_CONTRACT_VERSION_UNSUPPORTED",
      "contractVersion",
      `Expected ${ABILITY_SPELL_PROFILE_CONTRACT_VERSION}.`
    ));
  }

  if (!normalized.title) {
    issues.push(createIssue("ABILITY_SPELL_PROFILE_TITLE_REQUIRED", "title", "An Ability & Spell Profile title is required."));
  } else if (normalized.title.length > ABILITY_SPELL_PROFILE_LIMITS.maxTitleLength) {
    issues.push(createIssue(
      "ABILITY_SPELL_PROFILE_TITLE_TOO_LONG",
      "title",
      `Title must not exceed ${ABILITY_SPELL_PROFILE_LIMITS.maxTitleLength} characters.`
    ));
  }

  if (normalized.description.length > ABILITY_SPELL_PROFILE_LIMITS.maxDescriptionLength) {
    issues.push(createIssue(
      "ABILITY_SPELL_PROFILE_DESCRIPTION_TOO_LONG",
      "description",
      `Description must not exceed ${ABILITY_SPELL_PROFILE_LIMITS.maxDescriptionLength} characters.`
    ));
  }

  if (normalizeArray(raw.abilityDefinitions).length > ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions) {
    issues.push(createIssue(
      "ABILITY_SPELL_PROFILE_DEFINITION_LIMIT_EXCEEDED",
      "abilityDefinitions",
      `At most ${ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions} definitions are supported.`
    ));
  }

  const definitionIds = new Set();
  let enabledDefinitionCount = 0;

  normalized.abilityDefinitions.forEach((definition, definitionIndex) => {
    const path = `abilityDefinitions[${definitionIndex}]`;
    if (definition.enabled) enabledDefinitionCount += 1;

    if (definition.definitionVersion !== ABILITY_SPELL_DEFINITION_VERSION) {
      issues.push(createIssue(
        "ABILITY_SPELL_DEFINITION_VERSION_UNSUPPORTED",
        `${path}.definitionVersion`,
        `Expected ${ABILITY_SPELL_DEFINITION_VERSION}.`
      ));
    }

    validateIdentifier(definition.id, `${path}.id`, "Definition ID", issues);
    if (definitionIds.has(definition.id)) {
      issues.push(createIssue("ABILITY_SPELL_DEFINITION_ID_DUPLICATE", `${path}.id`, `Duplicate definition ID '${definition.id}'.`));
    }
    definitionIds.add(definition.id);

    if (!definition.title) {
      issues.push(createIssue("ABILITY_SPELL_DEFINITION_TITLE_REQUIRED", `${path}.title`, "Every definition requires a title."));
    }
    if (!ABILITY_SPELL_TYPES.includes(definition.type)) {
      issues.push(createIssue("ABILITY_SPELL_TYPE_INVALID", `${path}.type`, `Unsupported definition type '${definition.type}'.`));
    }
    if (definition.description.length > ABILITY_SPELL_PROFILE_LIMITS.maxDescriptionLength) {
      issues.push(createIssue("ABILITY_SPELL_DEFINITION_DESCRIPTION_TOO_LONG", `${path}.description`, "Definition description is too long."));
    }
    if (definition.narrativeDescription.length > ABILITY_SPELL_PROFILE_LIMITS.maxDescriptionLength) {
      issues.push(createIssue("ABILITY_SPELL_NARRATIVE_DESCRIPTION_TOO_LONG", `${path}.narrativeDescription`, "Narrative description is too long."));
    }

    if (definition.prerequisites.prerequisiteVersion !== ABILITY_SPELL_PREREQUISITE_VERSION) {
      issues.push(createIssue("ABILITY_SPELL_PREREQUISITE_VERSION_UNSUPPORTED", `${path}.prerequisites.prerequisiteVersion`, `Expected ${ABILITY_SPELL_PREREQUISITE_VERSION}.`));
    }
    definition.prerequisites.requiredUnlocks.forEach((requirement, index) => {
      if (!ABILITY_SPELL_UNLOCK_TYPES.includes(requirement.unlockType)) {
        issues.push(createIssue(
          "ABILITY_SPELL_REQUIRED_UNLOCK_TYPE_INVALID",
          `${path}.prerequisites.requiredUnlocks[${index}].unlockType`,
          `Unsupported unlock type '${requirement.unlockType}'.`
        ));
      }
      if (!requirement.unlockId && !requirement.referenceId) {
        issues.push(createIssue(
          "ABILITY_SPELL_REQUIRED_UNLOCK_IDENTITY_REQUIRED",
          `${path}.prerequisites.requiredUnlocks[${index}]`,
          "A required unlock needs an unlockId or referenceId."
        ));
      }
    });
    definition.prerequisites.requiredSkills.forEach((requirement, index) => {
      validateIdentifier(requirement.skillId, `${path}.prerequisites.requiredSkills[${index}].skillId`, "Required Skill ID", issues);
    });

    const costIds = new Set();
    definition.costs.forEach((cost, costIndex) => {
      const costPath = `${path}.costs[${costIndex}]`;
      if (cost.costVersion !== ABILITY_SPELL_COST_VERSION) {
        issues.push(createIssue("ABILITY_SPELL_COST_VERSION_UNSUPPORTED", `${costPath}.costVersion`, `Expected ${ABILITY_SPELL_COST_VERSION}.`));
      }
      validateIdentifier(cost.id, `${costPath}.id`, "Cost ID", issues);
      if (costIds.has(cost.id)) {
        issues.push(createIssue("ABILITY_SPELL_COST_ID_DUPLICATE", `${costPath}.id`, `Duplicate cost ID '${cost.id}'.`));
      }
      costIds.add(cost.id);
      if (!ABILITY_SPELL_COST_RESOURCE_TYPES.includes(cost.resourceType)) {
        issues.push(createIssue("ABILITY_SPELL_COST_RESOURCE_TYPE_INVALID", `${costPath}.resourceType`, `Unsupported resource type '${cost.resourceType}'.`));
      }
      if (!ABILITY_SPELL_COST_TIMINGS.includes(cost.timing)) {
        issues.push(createIssue("ABILITY_SPELL_COST_TIMING_INVALID", `${costPath}.timing`, `Unsupported cost timing '${cost.timing}'.`));
      }
      if (!cost.resourceId && cost.resourceType !== "CHARGE") {
        issues.push(createIssue(
          "ABILITY_SPELL_COST_RESOURCE_REQUIRED",
          `${costPath}.resourceId`,
          "A cost requires a resourceId unless it consumes the definition's own charges."
        ));
      }
    });

    if (definition.targetModel.targetVersion !== ABILITY_SPELL_TARGET_MODEL_VERSION) {
      issues.push(createIssue("ABILITY_SPELL_TARGET_VERSION_UNSUPPORTED", `${path}.targetModel.targetVersion`, `Expected ${ABILITY_SPELL_TARGET_MODEL_VERSION}.`));
    }
    if (!ABILITY_SPELL_TARGET_MODES.includes(definition.targetModel.mode)) {
      issues.push(createIssue("ABILITY_SPELL_TARGET_MODE_INVALID", `${path}.targetModel.mode`, `Unsupported target mode '${definition.targetModel.mode}'.`));
    }
    if (definition.targetModel.maximumTargets < definition.targetModel.minimumTargets) {
      issues.push(createIssue("ABILITY_SPELL_TARGET_RANGE_INVALID", `${path}.targetModel.maximumTargets`, "maximumTargets cannot be lower than minimumTargets."));
    }
    if (definition.targetModel.mode === "NONE" && (definition.targetModel.minimumTargets !== 0 || definition.targetModel.maximumTargets !== 0)) {
      issues.push(createIssue("ABILITY_SPELL_TARGET_NONE_COUNT_INVALID", `${path}.targetModel`, "NONE targeting must use zero minimum and maximum targets."));
    }

    if (definition.restrictions.restrictionVersion !== ABILITY_SPELL_RESTRICTIONS_VERSION) {
      issues.push(createIssue("ABILITY_SPELL_RESTRICTIONS_VERSION_UNSUPPORTED", `${path}.restrictions.restrictionVersion`, `Expected ${ABILITY_SPELL_RESTRICTIONS_VERSION}.`));
    }
    if (definition.restrictions.notes.length > ABILITY_SPELL_PROFILE_LIMITS.maxNotesLength) {
      issues.push(createIssue("ABILITY_SPELL_RESTRICTIONS_NOTES_TOO_LONG", `${path}.restrictions.notes`, "Restriction notes are too long."));
    }

    const operationIds = new Set();
    definition.operationReferences.forEach((reference, referenceIndex) => {
      const referencePath = `${path}.operationReferences[${referenceIndex}]`;
      if (!ABILITY_SPELL_OPERATION_REFERENCE_VERSIONS.includes(reference.referenceVersion)) {
        issues.push(createIssue(
          "ABILITY_SPELL_OPERATION_REFERENCE_VERSION_UNSUPPORTED",
          `${referencePath}.referenceVersion`,
          `Expected one of: ${ABILITY_SPELL_OPERATION_REFERENCE_VERSIONS.join(", ")}.`
        ));
      }
      validateIdentifier(reference.id, `${referencePath}.id`, "Operation reference ID", issues);
      if (operationIds.has(reference.id)) {
        issues.push(createIssue("ABILITY_SPELL_OPERATION_REFERENCE_ID_DUPLICATE", `${referencePath}.id`, `Duplicate operation reference ID '${reference.id}'.`));
      }
      operationIds.add(reference.id);
      if (!reference.operation) {
        issues.push(createIssue(
          "ABILITY_SPELL_OPERATION_REQUIRED",
          `${referencePath}.operation`,
          "An operation reference must name the typed operation it intends to invoke later."
        ));
      }
      if (
        reference.referenceVersion ===
        ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION
      ) {
        if (!reference.domain || reference.domain === "CUSTOM") {
          issues.push(createIssue(
            "ABILITY_SPELL_EXECUTABLE_OPERATION_DOMAIN_REQUIRED",
            `${referencePath}.domain`,
            "An executable operation reference must name a typed platform domain."
          ));
        }
        if (!reference.version) {
          issues.push(createIssue(
            "ABILITY_SPELL_EXECUTABLE_OPERATION_VERSION_REQUIRED",
            `${referencePath}.version`,
            "An executable operation reference must pin an exact executor version."
          ));
        }
        if (
          reference.targetBinding?.bindingVersion !==
          ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION
        ) {
          issues.push(createIssue(
            "ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION_UNSUPPORTED",
            `${referencePath}.targetBinding.bindingVersion`,
            `Expected ${ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION}.`
          ));
        }
        if (
          !ABILITY_SPELL_OPERATION_TARGET_BINDING_MODES.includes(
            reference.targetBinding?.mode
          )
        ) {
          issues.push(createIssue(
            "ABILITY_SPELL_OPERATION_TARGET_BINDING_MODE_UNSUPPORTED",
            `${referencePath}.targetBinding.mode`,
            `Expected one of: ${ABILITY_SPELL_OPERATION_TARGET_BINDING_MODES.join(", ")}.`
          ));
        }
      }
    });

    if (definition.cooldownPolicy.policyVersion !== ABILITY_SPELL_COOLDOWN_POLICY_VERSION) {
      issues.push(createIssue("ABILITY_SPELL_COOLDOWN_POLICY_VERSION_UNSUPPORTED", `${path}.cooldownPolicy.policyVersion`, `Expected ${ABILITY_SPELL_COOLDOWN_POLICY_VERSION}.`));
    }
    if (!ABILITY_SPELL_COOLDOWN_MODES.includes(definition.cooldownPolicy.mode)) {
      issues.push(createIssue("ABILITY_SPELL_COOLDOWN_MODE_INVALID", `${path}.cooldownPolicy.mode`, `Unsupported cooldown mode '${definition.cooldownPolicy.mode}'.`));
    }
    if (!ABILITY_SPELL_COOLDOWN_UNITS.includes(definition.cooldownPolicy.unit)) {
      issues.push(createIssue("ABILITY_SPELL_COOLDOWN_UNIT_INVALID", `${path}.cooldownPolicy.unit`, `Unsupported cooldown unit '${definition.cooldownPolicy.unit}'.`));
    }
    if (["TURN_COUNT", "WORLD_TIME", "CUSTOM"].includes(definition.cooldownPolicy.mode) && definition.cooldownPolicy.amount <= 0) {
      issues.push(createIssue("ABILITY_SPELL_COOLDOWN_AMOUNT_REQUIRED", `${path}.cooldownPolicy.amount`, "This cooldown mode requires a positive amount."));
    }

    if (definition.chargePolicy.policyVersion !== ABILITY_SPELL_CHARGE_POLICY_VERSION) {
      issues.push(createIssue("ABILITY_SPELL_CHARGE_POLICY_VERSION_UNSUPPORTED", `${path}.chargePolicy.policyVersion`, `Expected ${ABILITY_SPELL_CHARGE_POLICY_VERSION}.`));
    }
    if (!ABILITY_SPELL_CHARGE_MODES.includes(definition.chargePolicy.mode)) {
      issues.push(createIssue("ABILITY_SPELL_CHARGE_MODE_INVALID", `${path}.chargePolicy.mode`, `Unsupported charge mode '${definition.chargePolicy.mode}'.`));
    }
    if (!ABILITY_SPELL_CHARGE_RESET_POLICIES.includes(definition.chargePolicy.resetPolicy)) {
      issues.push(createIssue("ABILITY_SPELL_CHARGE_RESET_INVALID", `${path}.chargePolicy.resetPolicy`, `Unsupported reset policy '${definition.chargePolicy.resetPolicy}'.`));
    }
    if (definition.chargePolicy.mode === "FIXED" && definition.chargePolicy.maximumCharges <= 0) {
      issues.push(createIssue("ABILITY_SPELL_MAXIMUM_CHARGES_REQUIRED", `${path}.chargePolicy.maximumCharges`, "FIXED charges require maximumCharges greater than zero."));
    }

    if (definition.masteryPolicy.policyVersion !== ABILITY_SPELL_MASTERY_POLICY_VERSION) {
      issues.push(createIssue("ABILITY_SPELL_MASTERY_POLICY_VERSION_UNSUPPORTED", `${path}.masteryPolicy.policyVersion`, `Expected ${ABILITY_SPELL_MASTERY_POLICY_VERSION}.`));
    }
    if (!ABILITY_SPELL_MASTERY_MODES.includes(definition.masteryPolicy.mode)) {
      issues.push(createIssue("ABILITY_SPELL_MASTERY_MODE_INVALID", `${path}.masteryPolicy.mode`, `Unsupported mastery mode '${definition.masteryPolicy.mode}'.`));
    }
    if (["RANKED", "NUMERIC", "CUSTOM"].includes(definition.masteryPolicy.mode) && definition.masteryPolicy.maximumMastery <= 0) {
      issues.push(createIssue("ABILITY_SPELL_MAXIMUM_MASTERY_REQUIRED", `${path}.masteryPolicy.maximumMastery`, "This mastery mode requires maximumMastery greater than zero."));
    }
  });


  const actorConfiguration = normalized.actorConfiguration;
  if (actorConfiguration.version !== ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION) {
    issues.push(createIssue(
      "ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION_UNSUPPORTED",
      "actorConfiguration.version",
      `Expected ${ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION}.`
    ));
  }
  const definitionSelection = actorConfiguration.definitionSelection;
  if (definitionSelection.mode === "GROUPS") {
    if (!definitionSelection.groups.length) {
      issues.push(createIssue(
        "ABILITY_SPELL_SELECTION_GROUP_REQUIRED",
        "actorConfiguration.definitionSelection.groups",
        "Group-based starting Ability/Spell selection requires at least one authored group."
      ));
    }
    const groupIds = new Set();
    definitionSelection.groups.forEach((group, groupIndex) => {
      const groupPath = `actorConfiguration.definitionSelection.groups[${groupIndex}]`;
      validateIdentifier(group.id, `${groupPath}.id`, "Selection group ID", issues);
      if (groupIds.has(group.id)) {
        issues.push(createIssue(
          "ABILITY_SPELL_SELECTION_GROUP_ID_DUPLICATE",
          `${groupPath}.id`,
          `Duplicate selection group ID '${group.id}'.`
        ));
      }
      groupIds.add(group.id);
      for (const type of group.allowedTypes) {
        if (!ABILITY_SPELL_TYPES.includes(type)) {
          issues.push(createIssue(
            "ABILITY_SPELL_SELECTION_GROUP_TYPE_INVALID",
            `${groupPath}.allowedTypes`,
            `Unsupported Ability/Spell type '${type}'.`
          ));
        }
      }
      const eligibleDefinitions = selectionGroupEligibleDefinitions(normalized, group);
      if (eligibleDefinitions.length < group.minimumSelections) {
        issues.push(createIssue(
          "ABILITY_SPELL_SELECTION_GROUP_CAPACITY_UNAVAILABLE",
          groupPath,
          `Selection group '${group.id}' requires ${group.minimumSelections} starting definitions but only ${eligibleDefinitions.length} enabled profile definitions match its filters.`
        ));
      }
      if (group.requireSameSchool && group.minimumSelections > 1) {
        const countBySchool = new Map();
        for (const definition of eligibleDefinitions) {
          const school = normalizeUpper(definition.school) || "GENERAL";
          countBySchool.set(school, Number(countBySchool.get(school) || 0) + 1);
        }
        if (Math.max(0, ...countBySchool.values()) < group.minimumSelections) {
          issues.push(createIssue(
            "ABILITY_SPELL_SELECTION_GROUP_SAME_SCHOOL_UNAVAILABLE",
            `${groupPath}.requireSameSchool`,
            `Selection group '${group.id}' cannot satisfy its minimum selections from one authored school.`
          ));
        }
      }
    });
    if (
      definitionSelection.requireUniqueDefinitions &&
      !requiredUniqueSelectionAssignmentPossible(normalized, definitionSelection.groups)
    ) {
      issues.push(createIssue(
        "ABILITY_SPELL_SELECTION_UNIQUE_ASSIGNMENT_UNAVAILABLE",
        "actorConfiguration.definitionSelection.groups",
        "The enabled Ability/Spell roster cannot satisfy every required selection with unique definitions."
      ));
    }
  }

  const roomLocalDefinitionAuthoring = actorConfiguration.roomLocalDefinitionAuthoring;
  if (roomLocalDefinitionAuthoring.mode === "GROUPS") {
    if (!roomLocalDefinitionAuthoring.groups.length) {
      issues.push(createIssue(
        "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_GROUP_REQUIRED",
        "actorConfiguration.roomLocalDefinitionAuthoring.groups",
        "Room-local Ability/Spell authoring requires at least one creator-authored group."
      ));
    }

    const authoringGroupIds = new Set();
    roomLocalDefinitionAuthoring.groups.forEach((group, groupIndex) => {
      const groupPath = `actorConfiguration.roomLocalDefinitionAuthoring.groups[${groupIndex}]`;
      validateIdentifier(group.id, `${groupPath}.id`, "Room-local authoring group ID", issues);
      if (authoringGroupIds.has(group.id)) {
        issues.push(createIssue(
          "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_GROUP_ID_DUPLICATE",
          `${groupPath}.id`,
          `Duplicate room-local authoring group ID '${group.id}'.`
        ));
      }
      authoringGroupIds.add(group.id);

      for (const type of group.allowedTypes) {
        if (!ABILITY_SPELL_TYPES.includes(type)) {
          issues.push(createIssue(
            "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_TYPE_INVALID",
            `${groupPath}.allowedTypes`,
            `Unsupported room-local Ability/Spell type '${type}'.`
          ));
        }
      }
      for (const field of group.requiredFields) {
        if (!ABILITY_SPELL_ROOM_LOCAL_REQUIRED_FIELDS.includes(field)) {
          issues.push(createIssue(
            "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_REQUIRED_FIELD_INVALID",
            `${groupPath}.requiredFields`,
            `Unsupported required room-local definition field '${field}'.`
          ));
        }
      }
      for (const field of group.visibleFields) {
        if (!ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS.includes(field)) {
          issues.push(createIssue(
            "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_VISIBLE_FIELD_INVALID",
            `${groupPath}.visibleFields`,
            `Unsupported visible room-local definition field '${field}'.`
          ));
        }
      }
      for (const field of group.requiredFields) {
        if (!group.visibleFields.includes(field)) {
          issues.push(createIssue(
            "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_REQUIRED_FIELD_HIDDEN",
            `${groupPath}.requiredFields`,
            `Required room-local definition field '${field}' must also be visible.`
          ));
        }
      }
      if (
        group.visibleFields.includes("SCHOOL") &&
        group.schoolInputMode === "FIXED_LIST" &&
        !group.allowedSchools.length
      ) {
        issues.push(createIssue(
          "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_SCHOOL_OPTIONS_REQUIRED",
          `${groupPath}.allowedSchools`,
          "School input mode FIXED_LIST requires at least one creator-authored school option."
        ));
      }
      if (
        group.visibleFields.includes("CATEGORY") &&
        group.categoryInputMode === "FIXED_LIST" &&
        !group.allowedCategories.length
      ) {
        issues.push(createIssue(
          "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_CATEGORY_OPTIONS_REQUIRED",
          `${groupPath}.allowedCategories`,
          "Category input mode FIXED_LIST requires at least one creator-authored category option."
        ));
      }
      if (group.requireSameSchool && !group.visibleFields.includes("SCHOOL")) {
        issues.push(createIssue(
          "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_SAME_SCHOOL_HIDDEN",
          `${groupPath}.requireSameSchool`,
          "Same-school authoring requires the School field to be visible."
        ));
      }
      if (!ABILITY_SPELL_ROOM_LOCAL_DEFINITION_MECHANICS_MODES.includes(group.mechanicsMode)) {
        issues.push(createIssue(
          "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_MECHANICS_MODE_INVALID",
          `${groupPath}.mechanicsMode`,
          `Unsupported room-local definition mechanics mode '${group.mechanicsMode}'.`
        ));
      }

      const customFieldIds = new Set();
      group.customTextFields.forEach((field, fieldIndex) => {
        const fieldPath = `${groupPath}.customTextFields[${fieldIndex}]`;
        validateIdentifier(field.id, `${fieldPath}.id`, "Custom text field ID", issues);
        if (customFieldIds.has(field.id)) {
          issues.push(createIssue(
            "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_CUSTOM_FIELD_ID_DUPLICATE",
            `${fieldPath}.id`,
            `Duplicate custom field ID '${field.id}' in authoring group '${group.id}'.`
          ));
        }
        customFieldIds.add(field.id);
        if (
          ["SINGLE_SELECT", "SINGLE_SELECT_OR_CUSTOM"].includes(field.inputMode) &&
          !field.options.length
        ) {
          issues.push(createIssue(
            "ABILITY_SPELL_ROOM_LOCAL_AUTHORING_CUSTOM_FIELD_OPTIONS_REQUIRED",
            `${fieldPath}.options`,
            `Structured custom field '${field.title}' requires at least one creator-authored option.`
          ));
        }
      });
    });
  }

  if (normalized.enabled && enabledDefinitionCount === 0) {
    issues.push(createIssue(
      "ABILITY_SPELL_PROFILE_EMPTY",
      "abilityDefinitions",
      "An enabled Ability & Spell Profile has no enabled definitions.",
      "WARNING"
    ));
  }

  const errors = issues.filter((issue) => issue.severity !== "WARNING");
  const warnings = issues.filter((issue) => issue.severity === "WARNING");

  return {
    valid: errors.length === 0,
    normalized,
    issues,
    errors,
    warnings,
    metrics: {
      definitionCount: normalized.abilityDefinitions.length,
      enabledDefinitionCount,
      spellCount: normalized.abilityDefinitions.filter((entry) => entry.type === "SPELL").length,
      abilityCount: normalized.abilityDefinitions.filter((entry) => entry.type === "ABILITY").length,
      techniqueCount: normalized.abilityDefinitions.filter((entry) => entry.type === "TECHNIQUE").length,
      passiveCount: normalized.abilityDefinitions.filter((entry) => entry.type === "PASSIVE").length,
    },
  };
}

export function createEmptyAbilitySpellProfile() {
  return normalizeAbilitySpellProfileEditorValue({
    title: "New Ability & Spell Profile",
    description: "Reusable deterministic Ability, Spell, Technique, Special Attack, and Passive definitions.",
    enabled: true,
    actorConfiguration: {
      version: ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION,
      definitionSelection: {
        mode: "NONE",
        requireUniqueDefinitions: false,
        groups: [],
        metadata: {},
      },
      roomLocalDefinitionAuthoring: {
        mode: "NONE",
        requireUniqueTitles: false,
        groups: [],
        metadata: {},
      },
    },
    abilityDefinitions: [
      {
        id: "ability.example",
        title: "Example Ability",
        type: "ABILITY",
        school: "GENERAL",
        category: "GENERAL",
        description: "Replace this starter with an authored ability or spell.",
        targetModel: { mode: "SELF", minimumTargets: 1, maximumTargets: 1, rangeClass: "SELF" },
        cooldownPolicy: { mode: "NONE" },
        chargePolicy: { mode: "UNLIMITED" },
        masteryPolicy: { mode: "NONE" },
        tags: ["starter"],
      },
    ],
    tags: ["abilities", "magic"],
  });
}
