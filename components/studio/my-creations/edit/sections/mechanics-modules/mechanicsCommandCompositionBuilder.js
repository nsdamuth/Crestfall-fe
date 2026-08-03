import {
  normalizeMechanicsEffectValueBindingBuilder,
} from "./mechanicsEffectValueBindingBuilder.js";
import {
  createMechanicsProgressionProfileBuilder,
  normalizeMechanicsProgressionProfileBuilder,
} from "./mechanicsProgressionProfileBuilder.js";

export const MECHANICS_COMMAND_COMPOSITION_BUILDER_VERSION =
  "mechanics_command_composition_builder_v1";

export const MECHANICS_COMMAND_COMPOSITION_VERSION =
  "mechanics_command_composition_v1";

export const MECHANICS_COMMAND_COMPOSITION_PHASES = [
  "ATTEMPT",
  "OUTCOME",
];

export const MECHANICS_COMMAND_COMPOSITION_OUTCOMES = [
  "CRITICAL_SUCCESS",
  "SUCCESS",
  "FAILURE",
  "FUMBLE",
];

export const MECHANICS_COMMAND_COMPOSITION_FAILURE_POLICIES = [
  "CONTINUE",
  "STOP",
  "SKIP_DEPENDENTS",
];

export const MECHANICS_COMMAND_COMPOSITION_CONDITION_MODES = [
  "ALL",
  "ANY",
];

export const MECHANICS_COMMAND_COMPOSITION_CONDITION_BUCKETS = [
  "METER",
  "FLAG",
  "COUNTER",
  "STAGE",
];

export const MECHANICS_COMMAND_COMPOSITION_CONDITION_SCOPE_MODES = [
  "COMMAND_SOURCE",
  "ROOT",
  "EXPLICIT",
  "TARGET_ARGUMENT",
];

export const MECHANICS_COMMAND_COMPOSITION_CONDITION_OPERATORS = [
  "EQ",
  "NEQ",
  "GT",
  "GTE",
  "LT",
  "LTE",
  "TRUTHY",
  "FALSY",
  "IN",
  "NOT_IN",
];

export const MECHANICS_COMMAND_COMPOSITION_EFFECT_TYPES = [
  "METER_DELTA",
  "FLAG_SET",
  "FLAG_CLEAR",
  "COUNTER_INCREMENT",
  "COUNTER_SET",
  "STAGE_SET",
  "PROGRESSION_RECONCILE",
];

export const MECHANICS_COMMAND_COMPOSITION_DOMAIN_ACTION_TYPES = [
  "NONE",
  "ITEM_GIVE",
  "ITEM_DROP",
  "ITEM_TAKE",
  "ITEM_EQUIP",
  "ITEM_UNEQUIP",
  "ITEM_STORE",
  "ITEM_PLACE",
  "ITEM_USE",
  "ITEM_CONSUME",
  "ITEM_DAMAGE",
  "ITEM_REPAIR",
  "PARTICIPANT_CONDITION_APPLY",
  "PARTICIPANT_CONDITION_REMOVE",
  "LOCATION_TRANSITION",
  "LOCATION_TRAVEL_OPERATION",
];

export const MECHANICS_COMMAND_COMPOSITION_TRAVEL_OPERATIONS = [
  "CONTINUE",
  "STOP",
  "RESUME",
  "APPROACH",
  "ARRIVE",
];

export const MECHANICS_COMMAND_COMPOSITION_MAX_MECHANICS_STEPS = 24;
export const MECHANICS_COMMAND_COMPOSITION_MAX_DOMAIN_STEPS = 3;

const TARGET_ARGUMENT_TYPES = new Set([
  "SELF",
  "CHARACTER_PRESENT",
  "CHARACTER_KNOWN",
  "CHARACTER_BOUND",
  "PLAYER_CHARACTER",
  "ITEM_HELD",
  "ITEM_VISIBLE",
  "ITEM_KNOWN",
  "LOCATION_CURRENT",
  "LOCATION_KNOWN",
  "LOCATION_CONNECTED",
]);

const DOMAIN_ACTION_LANE_BY_TYPE = Object.freeze({
  ITEM_GIVE: "ITEM_RUNTIME",
  ITEM_DROP: "ITEM_RUNTIME",
  ITEM_TAKE: "ITEM_RUNTIME",
  ITEM_EQUIP: "ITEM_RUNTIME",
  ITEM_UNEQUIP: "ITEM_RUNTIME",
  ITEM_STORE: "ITEM_RUNTIME",
  ITEM_PLACE: "ITEM_RUNTIME",
  ITEM_USE: "ITEM_RUNTIME",
  ITEM_CONSUME: "ITEM_RUNTIME",
  ITEM_DAMAGE: "ITEM_RUNTIME",
  ITEM_REPAIR: "ITEM_RUNTIME",
  PARTICIPANT_CONDITION_APPLY: "SENSORY_RUNTIME",
  PARTICIPANT_CONDITION_REMOVE: "SENSORY_RUNTIME",
  LOCATION_TRANSITION: "LOCATION_RUNTIME",
  LOCATION_TRAVEL_OPERATION: "LOCATION_RUNTIME",
});

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

function normalizeIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function normalizeUniqueIdentifiers(value = [], selfId = "", max = 16) {
  return [...new Set(
    normalizeArray(value)
      .map((entry) => normalizeIdentifier(entry))
      .filter((entry) => entry && entry !== selfId)
  )].slice(0, max);
}

function normalizeOutcomeList(value = []) {
  return [...new Set(
    normalizeArray(value)
      .map((outcome) => normalizeString(outcome).toUpperCase())
      .filter((outcome) =>
        MECHANICS_COMMAND_COMPOSITION_OUTCOMES.includes(outcome)
      )
  )];
}

function normalizeFailurePolicy(value, fallback = "CONTINUE") {
  const requested = normalizeString(value).toUpperCase();
  const aliases = {
    KEEP_GOING: "CONTINUE",
    CONTINUE_REMAINING: "CONTINUE",
    HALT: "STOP",
    ABORT: "STOP",
    STOP_COMPOSITION: "STOP",
    SKIP_DEPENDENT_STEPS: "SKIP_DEPENDENTS",
    DEPENDENTS: "SKIP_DEPENDENTS",
  };
  const policy = aliases[requested] || requested;

  return MECHANICS_COMMAND_COMPOSITION_FAILURE_POLICIES.includes(policy)
    ? policy
    : fallback;
}

export function getMechanicsCommandCompositionDomainLane(type) {
  return DOMAIN_ACTION_LANE_BY_TYPE[
    normalizeString(type).toUpperCase()
  ] || "";
}

export function normalizeMechanicsCommandCompositionArgumentOptions(
  value = []
) {
  return normalizeArray(value)
    .map((argument, index) => {
      const source = normalizeObject(argument);
      const id = normalizeIdentifier(
        source.id || source.name,
        `argument_${index + 1}`
      );
      const type = normalizeString(source.type).toUpperCase();

      return {
        id,
        name: id,
        label:
          normalizeString(source.label || source.title) ||
          id.replace(/[_-]+/g, " "),
        type,
        targetCapable: TARGET_ARGUMENT_TYPES.has(type),
      };
    })
    .filter((argument) => argument.id);
}

export function normalizeMechanicsCommandCompositionEffect(
  value = {},
  index = 0
) {
  const source = normalizeObject(value);
  const requestedType = normalizeString(source.type).toUpperCase();
  const type = MECHANICS_COMMAND_COMPOSITION_EFFECT_TYPES.includes(
    requestedType
  )
    ? requestedType
    : "FLAG_SET";
  const id = normalizeIdentifier(
    source.id || source.key,
    `effect_${index + 1}`
  );
  const bindingSource = normalizeObject(
    source.targetBinding || {
      mode: source.targetBindingMode || source.target_binding_mode,
      argumentName:
        source.targetArgumentName || source.target_argument_name,
    }
  );
  const bindingMode =
    normalizeString(bindingSource.mode).toUpperCase() === "ARGUMENT"
      ? "ARGUMENT"
      : "FIXED";
  const base = {
    ...source,
    id,
    type,
    targetId: normalizeIdentifier(
      source.targetId ||
        source.target_id ||
        source.mechanicsId ||
        source.mechanics_id ||
        source.trackerId ||
        source.tracker_id,
      ""
    ),
    targetBinding: {
      version:
        normalizeString(bindingSource.version) ||
        "mechanics_effect_target_binding_v1",
      mode: bindingMode,
      argumentName:
        bindingMode === "ARGUMENT"
          ? normalizeIdentifier(
              bindingSource.argumentName ||
                bindingSource.argument_name ||
                bindingSource.targetArgumentName ||
                bindingSource.target_argument_name,
              ""
            )
          : "",
    },
    valueBinding: normalizeMechanicsEffectValueBindingBuilder(
      source.valueBinding || {
        mode: source.valueBindingMode || source.value_binding_mode,
        argumentName:
          source.valueArgumentName || source.value_argument_name,
        multiplier: source.valueMultiplier,
        divisor: source.valueDivisor,
        offset: source.valueOffset,
        rounding: source.valueRounding,
        minValue: source.valueMin,
        maxValue: source.valueMax,
        missingPolicy: source.valueMissingPolicy,
      },
      type
    ),
    progressionProfile:
      type === "PROGRESSION_RECONCILE"
        ? normalizeMechanicsProgressionProfileBuilder(
            source.progressionProfile ||
              source.progression_profile ||
              source.profile ||
              {
                ...createMechanicsProgressionProfileBuilder(),
                rankValueId:
                  source.targetId ||
                  source.target_id ||
                  source.mechanicsId ||
                  source.mechanics_id ||
                  "character_level",
              }
          )
        : null,
    reason: normalizeString(
      source.reason || source.summary || source.description
    ),
  };

  if (type === "METER_DELTA") {
    const delta = normalizeNumber(source.delta ?? source.amount, 1);
    return { ...base, delta, amount: delta };
  }

  if (type === "FLAG_SET") {
    return { ...base, value: source.value === false ? false : true };
  }

  if (type === "FLAG_CLEAR") return base;

  if (type === "COUNTER_INCREMENT") {
    return {
      ...base,
      amount: normalizeNumber(source.amount ?? source.delta, 1),
    };
  }

  if (type === "COUNTER_SET") {
    return { ...base, value: normalizeNumber(source.value, 0) };
  }

  if (type === "PROGRESSION_RECONCILE") {
    const progressionProfile = normalizeMechanicsProgressionProfileBuilder({
      ...base.progressionProfile,
      rankValueId:
        base.progressionProfile?.rankValueId ||
        base.targetId ||
        "character_level",
    });

    return {
      ...base,
      targetId: progressionProfile.rankValueId,
      progressionProfile,
      valueBinding: normalizeMechanicsEffectValueBindingBuilder(
        { mode: "FIXED" },
        type
      ),
    };
  }

  return { ...base, value: String(source.value ?? "") };
}

export function createMechanicsCommandCompositionEffect(index = 0) {
  return normalizeMechanicsCommandCompositionEffect(
    {
      id: `effect_${index + 1}`,
      type: "COUNTER_INCREMENT",
      targetId: "",
      targetBinding: {
        mode: "FIXED",
        argumentName: "",
      },
      amount: 1,
      reason: "",
    },
    index
  );
}

export function normalizeMechanicsCommandCompositionCondition(
  value = {},
  index = 0
) {
  const source = normalizeObject(value);
  const requestedBucket = normalizeString(
    source.bucket ||
      source.type ||
      source.mechanicsBucket ||
      source.mechanics_bucket
  ).toUpperCase();
  const bucket = MECHANICS_COMMAND_COMPOSITION_CONDITION_BUCKETS.includes(
    requestedBucket
  )
    ? requestedBucket
    : "METER";
  const requestedScope = normalizeString(
    source.scopeMode || source.scope_mode || source.scope || "COMMAND_SOURCE"
  ).toUpperCase();
  const scopeMode =
    MECHANICS_COMMAND_COMPOSITION_CONDITION_SCOPE_MODES.includes(
      requestedScope
    )
      ? requestedScope
      : "COMMAND_SOURCE";
  const requestedOperator = normalizeString(
    source.operator || source.comparison || source.op || "EQ"
  ).toUpperCase();
  const operator =
    MECHANICS_COMMAND_COMPOSITION_CONDITION_OPERATORS.includes(
      requestedOperator
    )
      ? requestedOperator
      : "EQ";

  return {
    ...source,
    id: normalizeIdentifier(
      source.id || source.key,
      `condition_${index + 1}`
    ),
    enabled: normalizeBoolean(source.enabled, true),
    bucket,
    mechanicsId: normalizeIdentifier(
      source.mechanicsId ||
        source.mechanics_id ||
        source.targetId ||
        source.target_id ||
        source.trackerId ||
        source.tracker_id,
      ""
    ),
    scopeMode,
    scopeKey:
      scopeMode === "EXPLICIT"
        ? normalizeString(source.scopeKey || source.scope_key)
        : "",
    argumentName:
      scopeMode === "TARGET_ARGUMENT"
        ? normalizeIdentifier(
            source.argumentName ||
              source.argument_name ||
              source.targetArgumentName ||
              source.target_argument_name,
            "target"
          )
        : "",
    field: normalizeString(source.field || source.property) || "value",
    operator,
    value:
      source.value ??
      source.expectedValue ??
      source.expected_value ??
      (bucket === "FLAG" ? true : 1),
    values: normalizeArray(
      source.values || source.allowedValues || source.allowed_values
    ).slice(0, 100),
    message: normalizeString(
      source.message || source.summary || source.description
    ),
  };
}

export function createMechanicsCommandCompositionCondition(index = 0) {
  return normalizeMechanicsCommandCompositionCondition(
    {
      id: `condition_${index + 1}`,
      bucket: "COUNTER",
      mechanicsId: "",
      scopeMode: "COMMAND_SOURCE",
      field: "value",
      operator: "GTE",
      value: 1,
      values: [],
      message: "",
      enabled: true,
    },
    index
  );
}

export function normalizeMechanicsCommandCompositionStep(
  value = {},
  index = 0
) {
  const source = normalizeObject(value);
  const requestedPhase = normalizeString(
    source.phase ||
      source.applicationPhase ||
      source.application_phase ||
      source.timing ||
      "OUTCOME"
  ).toUpperCase();
  const phase = MECHANICS_COMMAND_COMPOSITION_PHASES.includes(requestedPhase)
    ? requestedPhase
    : "OUTCOME";
  const id = normalizeIdentifier(
    source.id || source.key || source.name,
    `mechanics_step_${index + 1}`
  );
  const requestedConditionMode = normalizeString(
    source.conditionMode ||
      source.condition_mode ||
      source.conditionsMode ||
      source.conditions_mode ||
      "ALL"
  ).toUpperCase();
  const conditionMode =
    MECHANICS_COMMAND_COMPOSITION_CONDITION_MODES.includes(
      requestedConditionMode
    )
      ? requestedConditionMode
      : "ALL";

  return {
    ...source,
    id,
    label:
      normalizeString(source.label || source.title || source.name) ||
      id.replace(/[_-]+/g, " "),
    enabled: normalizeBoolean(source.enabled, true),
    phase,
    conditionMode,
    conditions: normalizeArray(
      source.conditions ||
        source.when ||
        source.requirements ||
        source.stepConditions ||
        source.step_conditions
    )
      .map(normalizeMechanicsCommandCompositionCondition)
      .slice(0, 20),
    applyOnOutcomes:
      phase === "OUTCOME"
        ? normalizeOutcomeList(
            source.applyOnOutcomes ||
              source.apply_on_outcomes ||
              source.outcomes ||
              source.outcomeFilter ||
              source.outcome_filter
          )
        : [],
    failurePolicy: normalizeFailurePolicy(
      source.failurePolicy ||
        source.failure_policy ||
        source.onFailure ||
        source.on_failure,
      "CONTINUE"
    ),
    dependsOnStepIds: normalizeUniqueIdentifiers(
      source.dependsOnStepIds ||
        source.depends_on_step_ids ||
        source.dependencies ||
        source.dependsOn ||
        source.depends_on ||
        source.requiresSteps ||
        source.requires_steps,
      id
    ),
    effects: normalizeArray(
      source.effects ||
        source.items ||
        source.mechanicsEffects ||
        source.mechanics_effects
    )
      .map(normalizeMechanicsCommandCompositionEffect)
      .slice(0, 40),
  };
}

export function createMechanicsCommandCompositionStep(
  phase = "OUTCOME",
  index = 0
) {
  const safePhase = MECHANICS_COMMAND_COMPOSITION_PHASES.includes(
    normalizeString(phase).toUpperCase()
  )
    ? normalizeString(phase).toUpperCase()
    : "OUTCOME";

  return normalizeMechanicsCommandCompositionStep(
    {
      id: `${safePhase.toLowerCase()}_step_${index + 1}`,
      label:
        safePhase === "ATTEMPT"
          ? `Attempt Step ${index + 1}`
          : `Outcome Step ${index + 1}`,
      enabled: true,
      phase: safePhase,
      conditionMode: "ALL",
      conditions: [],
      applyOnOutcomes:
        safePhase === "OUTCOME"
          ? ["CRITICAL_SUCCESS", "SUCCESS"]
          : [],
      failurePolicy: "CONTINUE",
      dependsOnStepIds: [],
      effects: [],
    },
    index
  );
}

export function normalizeMechanicsCommandCompositionDomainAction(
  value = {}
) {
  const source = normalizeObject(value);
  const requestedType = normalizeString(
    source.type ||
      source.actionType ||
      source.action_type ||
      source.adapterType ||
      source.adapter_type ||
      "NONE"
  ).toUpperCase();
  const type = MECHANICS_COMMAND_COMPOSITION_DOMAIN_ACTION_TYPES.includes(
    requestedType
  )
    ? requestedType
    : "NONE";
  const enabled = type !== "NONE" && normalizeBoolean(source.enabled, true);

  return {
    ...source,
    version:
      normalizeString(source.version) ||
      "mechanics_command_domain_action_v1",
    enabled,
    type: enabled ? type : "NONE",
    itemArgumentName:
      enabled && type.startsWith("ITEM_")
        ? normalizeIdentifier(
            source.itemArgumentName ||
              source.item_argument_name ||
              source.itemArgument ||
              source.item_argument,
            "item"
          )
        : "",
    destinationArgumentName:
      enabled && type === "LOCATION_TRANSITION"
        ? normalizeIdentifier(
            source.destinationArgumentName ||
              source.destination_argument_name ||
              source.locationArgumentName ||
              source.location_argument_name ||
              source.destinationArgument ||
              source.destination_argument,
            "destination"
          )
        : "",
    travelOperation:
      enabled && type === "LOCATION_TRAVEL_OPERATION"
        ? MECHANICS_COMMAND_COMPOSITION_TRAVEL_OPERATIONS.includes(
            normalizeString(
              source.travelOperation ||
                source.travel_operation ||
                source.operation ||
                source.operationType ||
                source.operation_type
            ).toUpperCase()
          )
          ? normalizeString(
              source.travelOperation ||
                source.travel_operation ||
                source.operation ||
                source.operationType ||
                source.operation_type
            ).toUpperCase()
          : "CONTINUE"
        : "",
    targetArgumentName:
      enabled &&
      [
        "ITEM_GIVE",
        "PARTICIPANT_CONDITION_APPLY",
        "PARTICIPANT_CONDITION_REMOVE",
      ].includes(type)
        ? normalizeIdentifier(
            source.targetArgumentName ||
              source.target_argument_name ||
              source.recipientArgumentName ||
              source.recipient_argument_name ||
              source.characterArgumentName ||
              source.character_argument_name ||
              source.targetArgument ||
              source.target_argument,
            "target"
          )
        : "",
    conditionArgumentName:
      enabled &&
      [
        "PARTICIPANT_CONDITION_APPLY",
        "PARTICIPANT_CONDITION_REMOVE",
      ].includes(type)
        ? normalizeIdentifier(
            source.conditionArgumentName ||
              source.condition_argument_name ||
              source.statusArgumentName ||
              source.status_argument_name ||
              source.conditionArgument ||
              source.condition_argument,
            "condition"
          )
        : "",
    placementArgumentName:
      enabled && ["ITEM_STORE", "ITEM_PLACE"].includes(type)
        ? normalizeIdentifier(
            source.placementArgumentName ||
              source.placement_argument_name ||
              source.destinationArgumentName ||
              source.destination_argument_name ||
              source.placementArgument ||
              source.placement_argument,
            "placement"
          )
        : "",
    quantityArgumentName:
      enabled && type === "ITEM_CONSUME"
        ? normalizeIdentifier(
            source.quantityArgumentName ||
              source.quantity_argument_name ||
              source.quantityArgument ||
              source.quantity_argument,
            ""
          )
        : "",
    amountArgumentName:
      enabled && ["ITEM_DAMAGE", "ITEM_REPAIR"].includes(type)
        ? normalizeIdentifier(
            source.amountArgumentName ||
              source.amount_argument_name ||
              source.conditionAmountArgumentName ||
              source.condition_amount_argument_name ||
              source.amountArgument ||
              source.amount_argument,
            "amount"
          )
        : "",
    applyOnOutcomes: enabled
      ? normalizeOutcomeList(
          source.applyOnOutcomes ||
            source.apply_on_outcomes ||
            source.outcomes
        ).length
        ? normalizeOutcomeList(
            source.applyOnOutcomes ||
              source.apply_on_outcomes ||
              source.outcomes
          )
        : ["CRITICAL_SUCCESS", "SUCCESS"]
      : [],
  };
}

export function normalizeMechanicsCommandCompositionDomainStep(
  value = {},
  index = 0
) {
  const source = normalizeObject(value);
  const id = normalizeIdentifier(
    source.id || source.key || source.name,
    `domain_step_${index + 1}`
  );

  return {
    ...source,
    id,
    label:
      normalizeString(source.label || source.title || source.name) ||
      id.replace(/[_-]+/g, " "),
    enabled: normalizeBoolean(source.enabled, true),
    failurePolicy: normalizeFailurePolicy(
      source.failurePolicy ||
        source.failure_policy ||
        source.onFailure ||
        source.on_failure,
      "STOP"
    ),
    dependsOnStepIds: normalizeUniqueIdentifiers(
      source.dependsOnStepIds ||
        source.depends_on_step_ids ||
        source.dependencies ||
        source.dependsOn ||
        source.depends_on ||
        source.requiresSteps ||
        source.requires_steps,
      id
    ),
    action: normalizeMechanicsCommandCompositionDomainAction(
      source.action ||
        source.domainAction ||
        source.domain_action ||
        source.adapter ||
        source
    ),
  };
}

export function createMechanicsCommandCompositionDomainStep(index = 0) {
  return normalizeMechanicsCommandCompositionDomainStep(
    {
      id: `domain_step_${index + 1}`,
      label: `Domain Step ${index + 1}`,
      enabled: true,
      failurePolicy: "STOP",
      dependsOnStepIds: [],
      action: {
        enabled: false,
        type: "NONE",
        applyOnOutcomes: [],
      },
    },
    index
  );
}

export function normalizeMechanicsCommandCompositionBuilder(value = {}) {
  const source = normalizeObject(value);
  const usedMechanicsIds = new Map();
  const mechanicsSteps = normalizeArray(
    source.mechanicsSteps ||
      source.mechanics_steps ||
      source.steps ||
      source.effectSteps ||
      source.effect_steps
  )
    .map(normalizeMechanicsCommandCompositionStep)
    .slice(0, MECHANICS_COMMAND_COMPOSITION_MAX_MECHANICS_STEPS)
    .map((step) => {
      const occurrence = usedMechanicsIds.get(step.id) || 0;
      usedMechanicsIds.set(step.id, occurrence + 1);
      return occurrence === 0
        ? step
        : { ...step, id: `${step.id}_${occurrence + 1}` };
    });
  const usedDomainIds = new Map();
  const domainSteps = normalizeArray(
    source.domainSteps ||
      source.domain_steps ||
      source.domainActions ||
      source.domain_actions ||
      source.actionSteps ||
      source.action_steps
  )
    .map(normalizeMechanicsCommandCompositionDomainStep)
    .slice(0, MECHANICS_COMMAND_COMPOSITION_MAX_DOMAIN_STEPS)
    .map((step) => {
      const occurrence = usedDomainIds.get(step.id) || 0;
      usedDomainIds.set(step.id, occurrence + 1);
      return occurrence === 0
        ? step
        : { ...step, id: `${step.id}_${occurrence + 1}` };
    });

  return {
    ...source,
    version:
      normalizeString(source.version) ||
      MECHANICS_COMMAND_COMPOSITION_VERSION,
    mechanicsSteps,
    domainSteps,
  };
}

function firstArgumentName(argumentOptions, type) {
  return normalizeMechanicsCommandCompositionArgumentOptions(argumentOptions)
    .find((argument) => argument.type === type)?.id || "";
}

function buildSequentialReference() {
  return normalizeMechanicsCommandCompositionBuilder({
    mechanicsSteps: [
      {
        id: "record_attempt",
        label: "Record Attempt",
        phase: "ATTEMPT",
        failurePolicy: "CONTINUE",
        effects: [
          {
            id: "increment_attempt_count",
            type: "COUNTER_INCREMENT",
            targetId: "attempt_count",
            amount: 1,
            reason: "Record every authorized command attempt.",
          },
        ],
      },
      {
        id: "record_success",
        label: "Record Success",
        phase: "OUTCOME",
        applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        failurePolicy: "CONTINUE",
        effects: [
          {
            id: "increment_success_count",
            type: "COUNTER_INCREMENT",
            targetId: "success_count",
            amount: 1,
            reason: "Record a successful resolved command.",
          },
        ],
      },
    ],
    domainSteps: [],
  });
}

function buildConditionalReference() {
  return normalizeMechanicsCommandCompositionBuilder({
    mechanicsSteps: [
      {
        id: "advance_chain",
        label: "Advance Chain",
        phase: "OUTCOME",
        applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        failurePolicy: "SKIP_DEPENDENTS",
        effects: [
          {
            id: "increment_chain",
            type: "COUNTER_INCREMENT",
            targetId: "chain",
            amount: 1,
            reason: "Advance the successful-action chain.",
          },
        ],
      },
      {
        id: "record_milestone",
        label: "Record Milestone",
        phase: "OUTCOME",
        applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        failurePolicy: "CONTINUE",
        dependsOnStepIds: ["advance_chain"],
        conditionMode: "ALL",
        conditions: [
          {
            id: "chain_ready",
            bucket: "COUNTER",
            mechanicsId: "chain",
            scopeMode: "COMMAND_SOURCE",
            field: "value",
            operator: "GTE",
            value: 3,
            message: "The chain must reach three.",
          },
        ],
        effects: [
          {
            id: "set_chain_milestone",
            type: "FLAG_SET",
            targetId: "chain_milestone",
            value: true,
            reason: "Mark the chain milestone after the threshold is reached.",
          },
        ],
      },
    ],
    domainSteps: [],
  });
}

function buildItemConditionReference(argumentOptions) {
  const item = firstArgumentName(argumentOptions, "ITEM_HELD");
  const target = firstArgumentName(argumentOptions, "CHARACTER_PRESENT");
  const condition = firstArgumentName(argumentOptions, "TEXT");

  if (!item || !target || !condition) return null;

  return normalizeMechanicsCommandCompositionBuilder({
    mechanicsSteps: [],
    domainSteps: [
      {
        id: "give_item",
        label: "Give Item",
        failurePolicy: "STOP",
        action: {
          enabled: true,
          type: "ITEM_GIVE",
          itemArgumentName: item,
          targetArgumentName: target,
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        },
      },
      {
        id: "apply_condition",
        label: "Apply Condition",
        failurePolicy: "CONTINUE",
        dependsOnStepIds: ["give_item"],
        action: {
          enabled: true,
          type: "PARTICIPANT_CONDITION_APPLY",
          targetArgumentName: target,
          conditionArgumentName: condition,
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        },
      },
    ],
  });
}

function buildItemConditionLocationReference(argumentOptions) {
  const item = firstArgumentName(argumentOptions, "ITEM_HELD");
  const target = firstArgumentName(argumentOptions, "CHARACTER_PRESENT");
  const condition = firstArgumentName(argumentOptions, "TEXT");
  const destination = firstArgumentName(
    argumentOptions,
    "LOCATION_CONNECTED"
  );

  if (!item || !target || !condition || !destination) return null;

  return normalizeMechanicsCommandCompositionBuilder({
    mechanicsSteps: [],
    domainSteps: [
      {
        id: "give_item",
        label: "Give Item",
        failurePolicy: "STOP",
        action: {
          enabled: true,
          type: "ITEM_GIVE",
          itemArgumentName: item,
          targetArgumentName: target,
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        },
      },
      {
        id: "apply_condition",
        label: "Apply Condition",
        failurePolicy: "SKIP_DEPENDENTS",
        dependsOnStepIds: ["give_item"],
        action: {
          enabled: true,
          type: "PARTICIPANT_CONDITION_APPLY",
          targetArgumentName: target,
          conditionArgumentName: condition,
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        },
      },
      {
        id: "move_location",
        label: "Move to Location",
        failurePolicy: "STOP",
        dependsOnStepIds: ["apply_condition"],
        action: {
          enabled: true,
          type: "LOCATION_TRANSITION",
          destinationArgumentName: destination,
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        },
      },
    ],
  });
}

const REFERENCE_DEFINITIONS = [
  {
    id: "SEQUENTIAL_ATTEMPT_SUCCESS",
    label: "Attempt + Success Counters",
    description:
      "Record every attempt, then record only successful outcomes.",
    requiredArgumentTypes: [],
    build: () => buildSequentialReference(),
  },
  {
    id: "CONDITIONAL_MILESTONE",
    label: "Conditional Success Chain",
    description:
      "Advance a counter, then apply a dependent milestone when the counter reaches three.",
    requiredArgumentTypes: [],
    build: () => buildConditionalReference(),
  },
  {
    id: "ITEM_AND_CONDITION",
    label: "Give Item + Apply Condition",
    description:
      "Give a held Item to a present Character, then apply a text-named condition.",
    requiredArgumentTypes: ["ITEM_HELD", "CHARACTER_PRESENT", "TEXT"],
    build: buildItemConditionReference,
  },
  {
    id: "ITEM_CONDITION_LOCATION",
    label: "Item + Condition + Location",
    description:
      "Compose one Item action, one participant condition, and a final Location transition.",
    requiredArgumentTypes: [
      "ITEM_HELD",
      "CHARACTER_PRESENT",
      "TEXT",
      "LOCATION_CONNECTED",
    ],
    build: buildItemConditionLocationReference,
  },
];

export function listMechanicsCommandCompositionReferences(
  argumentOptions = []
) {
  const availableTypes = new Set(
    normalizeMechanicsCommandCompositionArgumentOptions(argumentOptions)
      .map((argument) => argument.type)
  );

  return REFERENCE_DEFINITIONS.map((definition) => {
    const missingArgumentTypes = definition.requiredArgumentTypes.filter(
      (type) => !availableTypes.has(type)
    );

    return {
      id: definition.id,
      label: definition.label,
      description: definition.description,
      available: missingArgumentTypes.length === 0,
      missingArgumentTypes,
      unavailableReason: missingArgumentTypes.length
        ? `Requires ${missingArgumentTypes.join(", ")} command arguments.`
        : "",
    };
  });
}

export function buildMechanicsCommandCompositionReference(
  id,
  argumentOptions = []
) {
  const requested = normalizeString(id).toUpperCase();
  const definition = REFERENCE_DEFINITIONS.find(
    (entry) => entry.id === requested
  );

  return definition ? definition.build(argumentOptions) : null;
}

export function summarizeMechanicsCommandCompositionBuilder(value = {}) {
  const composition = normalizeMechanicsCommandCompositionBuilder(value);
  const enabledMechanics = composition.mechanicsSteps.filter(
    (step) => step.enabled !== false
  );
  const enabledDomains = composition.domainSteps.filter(
    (step) => step.enabled !== false && step.action.enabled !== false
  );

  return {
    version: composition.version,
    mechanicsStepCount: composition.mechanicsSteps.length,
    enabledMechanicsStepCount: enabledMechanics.length,
    attemptStepCount: enabledMechanics.filter(
      (step) => step.phase === "ATTEMPT"
    ).length,
    outcomeStepCount: enabledMechanics.filter(
      (step) => step.phase === "OUTCOME"
    ).length,
    conditionCount: enabledMechanics.reduce(
      (count, step) => count + step.conditions.length,
      0
    ),
    effectCount: enabledMechanics.reduce(
      (count, step) => count + step.effects.length,
      0
    ),
    domainStepCount: composition.domainSteps.length,
    enabledDomainStepCount: enabledDomains.length,
    domainLanes: [
      ...new Set(
        enabledDomains
          .map((step) =>
            getMechanicsCommandCompositionDomainLane(step.action.type)
          )
          .filter(Boolean)
      ),
    ],
  };
}
