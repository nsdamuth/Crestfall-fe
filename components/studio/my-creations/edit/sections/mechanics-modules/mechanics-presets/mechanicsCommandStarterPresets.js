import {
  buildMechanicsCommandResolutionReferenceConfiguration,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
  normalizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";

export const MECHANICS_COMMAND_STARTER_VERSION =
  "mechanics_command_starter_presets_v1";

export const MECHANICS_COMMAND_STARTER_IDS = Object.freeze([
  "RESOURCE_CHECK",
  "SOCIAL_PROBE",
  "GIVE_ITEM",
  "APPLY_CONDITION",
  "TRAVEL_CONNECTED",
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function deepClone(value) {
  return value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));
}

function fixedTargetBinding() {
  return {
    version: "mechanics_effect_target_binding_v1",
    mode: "FIXED",
    argumentName: "",
  };
}

function argumentTargetBinding(argumentName) {
  return {
    version: "mechanics_effect_target_binding_v1",
    mode: "ARGUMENT",
    argumentName,
  };
}

function makeEffect({
  id,
  type,
  targetId,
  targetBinding = fixedTargetBinding(),
  reason = "",
  ...value
}) {
  return {
    id,
    type,
    targetId,
    targetBinding,
    reason,
    ...value,
  };
}

function makeRequirement({
  id,
  type,
  targetId = "",
  argumentName = "",
  operator,
  value,
  message,
}) {
  return {
    id,
    type,
    targetId,
    argumentName,
    operator,
    value,
    message,
    enabled: true,
  };
}

function makeArgument({
  name,
  label,
  type,
  required = true,
  consumeRemaining = false,
  allowQuoted = true,
  options = [],
  min = null,
  max = null,
  description = "",
}) {
  return {
    name,
    label,
    type,
    required,
    consumeRemaining,
    allowQuoted,
    options,
    min,
    max,
    description,
  };
}

function makeInvocation({ command, aliases = [], arguments: argumentList = [] }) {
  return {
    version: "mechanics_command_invocation_v1",
    enabled: true,
    command,
    prefixes: ["/"],
    aliases,
    arguments: argumentList,
    caseSensitive: false,
  };
}

function makePresentation({
  continueNarrative = true,
  advanceTime = true,
  resultVisibility = "FULL",
} = {}) {
  return {
    mode: "MECHANICS_ACTION",
    continueNarrative,
    advanceTime,
    resultVisibility,
  };
}

function makeOutcomes({
  criticalSuccess = {},
  success = {},
  failure = {},
  fumble = {},
} = {}) {
  return {
    version: "mechanics_command_outcomes_v1",
    CRITICAL_SUCCESS: {
      outcome: "CRITICAL_SUCCESS",
      effectMode: "INHERIT",
      effects: [],
      summary: "",
      ...criticalSuccess,
    },
    SUCCESS: {
      outcome: "SUCCESS",
      effectMode: "INHERIT",
      effects: [],
      summary: "",
      ...success,
    },
    FAILURE: {
      outcome: "FAILURE",
      effectMode: "NONE",
      effects: [],
      summary: "",
      ...failure,
    },
    FUMBLE: {
      outcome: "FUMBLE",
      effectMode: "NONE",
      effects: [],
      summary: "",
      ...fumble,
    },
  };
}

function noDomainAction() {
  return {
    version: "mechanics_command_domain_action_v1",
    enabled: false,
    type: "NONE",
    applyOnOutcomes: [],
  };
}

function makeCommand({
  id,
  label,
  invocation,
  requirements = [],
  attemptEffects = [],
  resolution,
  outcomes,
  composition,
  effects = [],
  presentation = makePresentation(),
  triggers = [],
  reason = "",
}) {
  return {
    id,
    label,
    commandContractVersion: "mechanics_command_contract_v1",
    invocation,
    requirements,
    attemptEffects,
    resolution,
    outcomes,
    domainAction: noDomainAction(),
    composition,
    presentation,
    triggers,
    effects,
    reason,
  };
}

function sequentialAttemptSuccessComposition() {
  return normalizeMechanicsCommandCompositionBuilder({
    version: MECHANICS_COMMAND_COMPOSITION_VERSION,
    mechanicsSteps: [
      {
        id: "record_attempt",
        label: "Record Attempt",
        enabled: true,
        phase: "ATTEMPT",
        failurePolicy: "CONTINUE",
        dependsOnStepIds: [],
        conditionMode: "ALL",
        conditions: [],
        applyOnOutcomes: [],
        effects: [
          makeEffect({
            id: "increment_attempt_count",
            type: "COUNTER_INCREMENT",
            targetId: "attempt_count",
            amount: 1,
            reason: "Record every authorized command attempt.",
          }),
        ],
      },
      {
        id: "record_success",
        label: "Record Success",
        enabled: true,
        phase: "OUTCOME",
        failurePolicy: "CONTINUE",
        dependsOnStepIds: [],
        conditionMode: "ALL",
        conditions: [],
        applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
        effects: [
          makeEffect({
            id: "increment_success_count",
            type: "COUNTER_INCREMENT",
            targetId: "success_count",
            amount: 1,
            reason: "Record successful command outcomes.",
          }),
        ],
      },
    ],
    domainSteps: [],
  });
}

function buildResourceCheck() {
  const resolution =
    buildMechanicsCommandResolutionReferenceConfiguration("STANDARD_D20");

  return makeCommand({
    id: "resource_check",
    label: "Resource Check",
    invocation: makeInvocation({
      command: "focus",
      aliases: ["channel"],
      arguments: [],
    }),
    requirements: [
      makeRequirement({
        id: "resource_available",
        type: "METER",
        targetId: "resource",
        operator: "GTE",
        value: 5,
        message: "Resource must be at least 5.",
      }),
    ],
    attemptEffects: [
      makeEffect({
        id: "spend_resource",
        type: "METER_DELTA",
        targetId: "resource",
        delta: -5,
        amount: -5,
        reason: "Spend five resource when the check is attempted.",
      }),
    ],
    resolution,
    outcomes: makeOutcomes({
      criticalSuccess: {
        effectMode: "APPEND",
        summary: "The resource check succeeds exceptionally and refunds part of the cost.",
        effects: [
          makeEffect({
            id: "critical_resource_refund",
            type: "METER_DELTA",
            targetId: "resource",
            delta: 2,
            amount: 2,
            reason: "Refund part of the resource cost on a critical success.",
          }),
        ],
      },
      success: {
        effectMode: "INHERIT",
        summary: "The resource check succeeds.",
      },
      failure: {
        effectMode: "REPLACE",
        summary: "The resource check fails after paying its cost.",
        effects: [
          makeEffect({
            id: "record_resource_failure",
            type: "COUNTER_INCREMENT",
            targetId: "resource_failures",
            amount: 1,
            reason: "Record a failed resource check.",
          }),
        ],
      },
      fumble: {
        effectMode: "REPLACE",
        summary: "The resource check fumbles after paying its cost.",
        effects: [
          makeEffect({
            id: "record_resource_fumble",
            type: "COUNTER_INCREMENT",
            targetId: "resource_failures",
            amount: 2,
            reason: "Record two failure points for a fumbled resource check.",
          }),
        ],
      },
    }),
    composition: sequentialAttemptSuccessComposition(),
    effects: [
      makeEffect({
        id: "record_resource_success",
        type: "COUNTER_INCREMENT",
        targetId: "resource_successes",
        amount: 1,
        reason: "Record a successful resource check.",
      }),
    ],
    presentation: makePresentation({
      continueNarrative: true,
      advanceTime: true,
    }),
    triggers: ["focus", "channel power"],
    reason: "A starter command that gates a roll behind an authoritative resource cost.",
  });
}

function buildSocialProbe() {
  const resolution =
    buildMechanicsCommandResolutionReferenceConfiguration("OPPOSED_D20");

  return makeCommand({
    id: "social_probe",
    label: "Social Probe",
    invocation: makeInvocation({
      command: "probe",
      aliases: ["read"],
      arguments: [
        makeArgument({
          name: "target",
          label: "Target",
          type: "CHARACTER_PRESENT",
          description: "A Character currently present in the scene.",
        }),
      ],
    }),
    requirements: [
      makeRequirement({
        id: "target_present",
        type: "TARGET_PRESENT",
        argumentName: "target",
        operator: "TRUTHY",
        value: true,
        message: "The target must be present.",
      }),
      makeRequirement({
        id: "trust_available",
        type: "METER",
        targetId: "trust",
        operator: "GTE",
        value: 5,
        message: "Trust must be at least 5.",
      }),
    ],
    attemptEffects: [
      makeEffect({
        id: "spend_trust",
        type: "METER_DELTA",
        targetId: "trust",
        delta: -5,
        amount: -5,
        reason: "Spend trust when the social probe is attempted.",
      }),
    ],
    resolution,
    outcomes: makeOutcomes({
      criticalSuccess: {
        effectMode: "APPEND",
        summary: "The probe succeeds decisively.",
        effects: [
          makeEffect({
            id: "critical_probe_insight",
            type: "COUNTER_INCREMENT",
            targetId: "probe_insight",
            targetBinding: argumentTargetBinding("target"),
            amount: 1,
            reason: "Record additional target-scoped insight on a critical success.",
          }),
        ],
      },
      success: {
        effectMode: "INHERIT",
        summary: "The probe succeeds and records target-scoped progress.",
      },
      failure: {
        effectMode: "REPLACE",
        summary: "The probe fails and records a failed attempt.",
        effects: [
          makeEffect({
            id: "record_failed_probe",
            type: "COUNTER_INCREMENT",
            targetId: "failed_probes",
            amount: 1,
            reason: "Record a failed social probe.",
          }),
        ],
      },
      fumble: {
        effectMode: "REPLACE",
        summary: "The probe fumbles and records a severe failed attempt.",
        effects: [
          makeEffect({
            id: "record_probe_fumble",
            type: "COUNTER_INCREMENT",
            targetId: "failed_probes",
            amount: 2,
            reason: "Record two failure points for a fumbled social probe.",
          }),
        ],
      },
    }),
    composition: sequentialAttemptSuccessComposition(),
    effects: [
      makeEffect({
        id: "record_probe_hit",
        type: "COUNTER_INCREMENT",
        targetId: "probe_hits",
        targetBinding: argumentTargetBinding("target"),
        amount: 1,
        reason: "Record successful probe progress on the resolved target.",
      }),
    ],
    presentation: makePresentation({
      continueNarrative: true,
      advanceTime: true,
    }),
    triggers: ["probe", "read target"],
    reason: "A complete opposed social command with target-scoped state and attempt costs.",
  });
}

function buildGiveItem() {
  const resolution =
    buildMechanicsCommandResolutionReferenceConfiguration("AUTOMATIC_SUCCESS");

  return makeCommand({
    id: "give_item",
    label: "Give Held Item",
    invocation: makeInvocation({
      command: "give",
      arguments: [
        makeArgument({
          name: "item",
          label: "Item",
          type: "ITEM_HELD",
          description: "An Item currently held by the active actor.",
        }),
        makeArgument({
          name: "target",
          label: "Recipient",
          type: "CHARACTER_PRESENT",
          description: "A present Character who can receive the Item.",
        }),
      ],
    }),
    requirements: [
      makeRequirement({
        id: "item_held",
        type: "TARGET_HELD",
        argumentName: "item",
        operator: "TRUTHY",
        value: true,
        message: "The Item must be held by the active actor.",
      }),
      makeRequirement({
        id: "recipient_present",
        type: "TARGET_PRESENT",
        argumentName: "target",
        operator: "TRUTHY",
        value: true,
        message: "The recipient must be present.",
      }),
    ],
    resolution,
    outcomes: makeOutcomes({
      criticalSuccess: {
        effectMode: "INHERIT",
        summary: "The Item is transferred.",
      },
      success: {
        effectMode: "INHERIT",
        summary: "The Item is transferred.",
      },
    }),
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [],
      domainSteps: [
        {
          id: "give_item",
          label: "Give Item",
          enabled: true,
          failurePolicy: "STOP",
          dependsOnStepIds: [],
          action: {
            version: "mechanics_command_domain_action_v1",
            enabled: true,
            type: "ITEM_GIVE",
            itemArgumentName: "item",
            targetArgumentName: "target",
            applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
          },
        },
      ],
    }),
    effects: [
      makeEffect({
        id: "record_item_give",
        type: "COUNTER_INCREMENT",
        targetId: "items_given",
        amount: 1,
        reason: "Record successful Item transfers.",
      }),
    ],
    presentation: makePresentation({
      continueNarrative: true,
      advanceTime: false,
    }),
    triggers: ["give item"],
    reason: "A deterministic typed Item transfer routed through the authoritative Item domain.",
  });
}

function buildApplyCondition() {
  const resolution =
    buildMechanicsCommandResolutionReferenceConfiguration("STANDARD_D20");

  return makeCommand({
    id: "apply_condition",
    label: "Apply Character Condition",
    invocation: makeInvocation({
      command: "afflict",
      aliases: ["condition"],
      arguments: [
        makeArgument({
          name: "target",
          label: "Target",
          type: "CHARACTER_PRESENT",
          description: "A Character currently present in the scene.",
        }),
        makeArgument({
          name: "condition",
          label: "Condition",
          type: "TEXT",
          consumeRemaining: true,
          description: "The condition label to apply.",
        }),
      ],
    }),
    requirements: [
      makeRequirement({
        id: "target_present",
        type: "TARGET_PRESENT",
        argumentName: "target",
        operator: "TRUTHY",
        value: true,
        message: "The target must be present.",
      }),
      makeRequirement({
        id: "focus_available",
        type: "METER",
        targetId: "focus",
        operator: "GTE",
        value: 1,
        message: "Focus must be at least 1.",
      }),
    ],
    attemptEffects: [
      makeEffect({
        id: "spend_focus",
        type: "METER_DELTA",
        targetId: "focus",
        delta: -1,
        amount: -1,
        reason: "Spend focus when attempting to apply a condition.",
      }),
    ],
    resolution,
    outcomes: makeOutcomes({
      criticalSuccess: {
        effectMode: "INHERIT",
        summary: "The condition is applied decisively.",
      },
      success: {
        effectMode: "INHERIT",
        summary: "The condition is applied.",
      },
      failure: {
        effectMode: "REPLACE",
        summary: "The condition attempt fails.",
        effects: [
          makeEffect({
            id: "record_condition_failure",
            type: "COUNTER_INCREMENT",
            targetId: "condition_failures",
            amount: 1,
            reason: "Record a failed condition attempt.",
          }),
        ],
      },
      fumble: {
        effectMode: "REPLACE",
        summary: "The condition attempt fumbles.",
        effects: [
          makeEffect({
            id: "record_condition_fumble",
            type: "COUNTER_INCREMENT",
            targetId: "condition_failures",
            amount: 2,
            reason: "Record two failure points for a fumbled condition attempt.",
          }),
        ],
      },
    }),
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [
        {
          id: "record_condition_attempt",
          label: "Record Condition Attempt",
          enabled: true,
          phase: "ATTEMPT",
          failurePolicy: "CONTINUE",
          dependsOnStepIds: [],
          conditionMode: "ALL",
          conditions: [],
          effects: [
            makeEffect({
              id: "increment_condition_attempts",
              type: "COUNTER_INCREMENT",
              targetId: "condition_attempts",
              amount: 1,
              reason: "Record each authorized condition attempt.",
            }),
          ],
        },
      ],
      domainSteps: [
        {
          id: "apply_condition",
          label: "Apply Condition",
          enabled: true,
          failurePolicy: "STOP",
          dependsOnStepIds: ["record_condition_attempt"],
          action: {
            version: "mechanics_command_domain_action_v1",
            enabled: true,
            type: "PARTICIPANT_CONDITION_APPLY",
            targetArgumentName: "target",
            conditionArgumentName: "condition",
            applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
          },
        },
      ],
    }),
    effects: [
      makeEffect({
        id: "record_condition_success",
        type: "COUNTER_INCREMENT",
        targetId: "conditions_applied",
        amount: 1,
        reason: "Record successful condition applications.",
      }),
    ],
    presentation: makePresentation({
      continueNarrative: true,
      advanceTime: true,
    }),
    triggers: ["apply condition", "afflict"],
    reason: "A threshold command that applies authoritative participant condition state on success.",
  });
}

function buildTravelConnected() {
  const resolution =
    buildMechanicsCommandResolutionReferenceConfiguration("AUTOMATIC_SUCCESS");

  return makeCommand({
    id: "travel_connected",
    label: "Travel to Connected Location",
    invocation: makeInvocation({
      command: "go",
      aliases: ["travel"],
      arguments: [
        makeArgument({
          name: "destination",
          label: "Destination",
          type: "LOCATION_CONNECTED",
          description: "A Location connected to the current Location.",
        }),
      ],
    }),
    requirements: [],
    resolution,
    outcomes: makeOutcomes({
      criticalSuccess: {
        effectMode: "INHERIT",
        summary: "Travel begins or resolves through the connected route.",
      },
      success: {
        effectMode: "INHERIT",
        summary: "Travel begins or resolves through the connected route.",
      },
    }),
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [],
      domainSteps: [
        {
          id: "move_location",
          label: "Move to Location",
          enabled: true,
          failurePolicy: "STOP",
          dependsOnStepIds: [],
          action: {
            version: "mechanics_command_domain_action_v1",
            enabled: true,
            type: "LOCATION_TRANSITION",
            destinationArgumentName: "destination",
            applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
          },
        },
      ],
    }),
    effects: [
      makeEffect({
        id: "record_travel_command",
        type: "COUNTER_INCREMENT",
        targetId: "travel_commands",
        amount: 1,
        reason: "Record accepted connected-Location travel commands.",
      }),
    ],
    presentation: makePresentation({
      continueNarrative: true,
      advanceTime: true,
    }),
    triggers: ["go to", "travel to"],
    reason: "A typed connected-Location command with the Location action in the final domain lane.",
  });
}

const DEFINITIONS = Object.freeze([
  {
    id: "RESOURCE_CHECK",
    presetId: "command.resource_check.v1",
    label: "Resource Check",
    description:
      "Spend an authoritative meter cost, roll a standard d20 check, and route success or failure effects.",
    tags: ["resource", "meter", "requirement", "attempt-cost", "threshold"],
    argumentTypes: [],
    domainLanes: [],
    build: buildResourceCheck,
  },
  {
    id: "SOCIAL_PROBE",
    presetId: "command.social_probe.v1",
    label: "Social Probe",
    description:
      "Resolve a present Character target with an opposed d20 roll, target-scoped success state, and attempt costs.",
    tags: ["social", "opposed", "target-scoped", "relationship", "attempt-cost"],
    argumentTypes: ["CHARACTER_PRESENT"],
    domainLanes: [],
    build: buildSocialProbe,
  },
  {
    id: "GIVE_ITEM",
    presetId: "command.give_item.v1",
    label: "Give Held Item",
    description:
      "Resolve held Item and present Character arguments, then transfer custody through the Item runtime lane.",
    tags: ["item", "give", "custody", "domain", "automatic"],
    argumentTypes: ["ITEM_HELD", "CHARACTER_PRESENT"],
    domainLanes: ["ITEM_RUNTIME"],
    build: buildGiveItem,
  },
  {
    id: "APPLY_CONDITION",
    presetId: "command.apply_condition.v1",
    label: "Apply Character Condition",
    description:
      "Spend focus, roll a threshold check, and apply a text-named condition to a present Character on success.",
    tags: ["condition", "participant", "sensory", "threshold", "attempt-cost"],
    argumentTypes: ["CHARACTER_PRESENT", "TEXT"],
    domainLanes: ["SENSORY_RUNTIME"],
    build: buildApplyCondition,
  },
  {
    id: "TRAVEL_CONNECTED",
    presetId: "command.travel_connected.v1",
    label: "Travel to Connected Location",
    description:
      "Resolve a connected Location argument and execute the Location transition as the final domain action.",
    tags: ["location", "travel", "connected", "domain", "automatic"],
    argumentTypes: ["LOCATION_CONNECTED"],
    domainLanes: ["LOCATION_RUNTIME"],
    build: buildTravelConnected,
  },
]);

export function listMechanicsCommandStarterPresets() {
  return DEFINITIONS.map((definition) => ({
    id: definition.id,
    presetId: definition.presetId,
    label: definition.label,
    description: definition.description,
    tags: [...definition.tags],
    argumentTypes: [...definition.argumentTypes],
    domainLanes: [...definition.domainLanes],
  }));
}

export function getMechanicsCommandStarterPresetDefinition(id) {
  const requested = normalizeString(id).toUpperCase();
  const definition = DEFINITIONS.find(
    (entry) => entry.id === requested || entry.presetId.toUpperCase() === requested
  );

  return definition
    ? {
        id: definition.id,
        presetId: definition.presetId,
        label: definition.label,
        description: definition.description,
        tags: [...definition.tags],
        argumentTypes: [...definition.argumentTypes],
        domainLanes: [...definition.domainLanes],
      }
    : null;
}

export function buildMechanicsCommandStarterPreset(id) {
  const requested = normalizeString(id).toUpperCase();
  const definition = DEFINITIONS.find(
    (entry) => entry.id === requested || entry.presetId.toUpperCase() === requested
  );

  return definition ? deepClone(definition.build()) : null;
}

export function summarizeMechanicsCommandStarterPreset(command = {}) {
  const invocation = command?.invocation || {};
  const argumentsList = Array.isArray(invocation.arguments)
    ? invocation.arguments
    : [];
  const mechanicsSteps = Array.isArray(command?.composition?.mechanicsSteps)
    ? command.composition.mechanicsSteps
    : [];
  const domainSteps = Array.isArray(command?.composition?.domainSteps)
    ? command.composition.domainSteps
    : [];
  const commandLabel = invocation.command
    ? `${invocation.prefixes?.[0] || "/"}${invocation.command}`
    : command.id || "Command";

  return {
    version: MECHANICS_COMMAND_STARTER_VERSION,
    commandId: command.id || "",
    commandLabel,
    argumentCount: argumentsList.length,
    argumentTypes: argumentsList.map((argument) => argument.type).filter(Boolean),
    requirementCount: Array.isArray(command.requirements)
      ? command.requirements.length
      : 0,
    attemptEffectCount: Array.isArray(command.attemptEffects)
      ? command.attemptEffects.length
      : 0,
    baseEffectCount: Array.isArray(command.effects)
      ? command.effects.length
      : 0,
    mechanicsStepCount: mechanicsSteps.length,
    domainStepCount: domainSteps.length,
    domainActionTypes: domainSteps
      .map((step) => step?.action?.type)
      .filter((type) => type && type !== "NONE"),
    resolutionMode: command?.resolution?.mode || "",
  };
}
