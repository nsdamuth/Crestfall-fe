import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
  normalizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  MECHANICS_EFFECT_VALUE_BINDING_VERSION,
  normalizeMechanicsEffectValueBindingBuilder,
} from "../mechanicsEffectValueBindingBuilder.js";
import {
  MECHANICS_PROGRESSION_PROFILE_VERSION,
  generateMechanicsProgressionTable,
  normalizeMechanicsProgressionProfileBuilder,
} from "../mechanicsProgressionProfileBuilder.js";
import {
  buildMechanicsCommandResolutionReferenceConfiguration,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_STATE_READOUT_VERSION,
  normalizeMechanicsCommandStateReadoutBuilder,
} from "../mechanicsCommandStateReadoutBuilder.js";

export const MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION =
  "mechanics_character_advancement_preset_v4";

export const MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID =
  "module.character_advancement_curve.v1";

export const MECHANICS_CHARACTER_ADVANCEMENT_REFERENCE_ID =
  "CHARACTER_ADVANCEMENT_CURVE";

export const MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID =
  "module.character_advancement_readout.v1";

export const MECHANICS_CHARACTER_ADVANCEMENT_READOUT_REFERENCE_ID =
  "CHARACTER_ADVANCEMENT_READOUT";

export const MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS = Object.freeze([
  "module.character_advancement_5e.v1",
]);

function deepClone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function fixedTargetBinding() {
  return {
    version: "mechanics_effect_target_binding_v1",
    mode: "FIXED",
    argumentName: "",
  };
}

function fixedValueBinding(effectType) {
  return normalizeMechanicsEffectValueBindingBuilder(
    { mode: "FIXED" },
    effectType
  );
}

export function buildCharacterAdvancementProgressionProfile() {
  return normalizeMechanicsProgressionProfileBuilder({
    version: MECHANICS_PROGRESSION_PROFILE_VERSION,
    id: "character_advancement",
    label: "Character Advancement",
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
    derivedValues: [
      {
        id: "proficiency_bonus",
        label: "Proficiency Bonus",
        bucket: "COUNTER",
        method: "RANK_INTERVAL",
        startingValue: 2,
        increaseEveryRanks: 4,
        increaseAmount: 1,
        multiplierPerRank: 1,
        offset: 0,
        rounding: "NONE",
        minValue: 2,
        maxValue: 6,
        rows: [],
        enabled: true,
      },
    ],
  });
}

export function buildCharacterProgressionStateReadout() {
  return normalizeMechanicsCommandStateReadoutBuilder({
    version: MECHANICS_COMMAND_STATE_READOUT_VERSION,
    enabled: true,
    title: "Current Progression",
    fields: [
      {
        id: "character_level",
        label: "Level",
        bucket: "COUNTER",
        targetId: "character_level",
        format: "NUMBER",
        fallbackValue: 1,
      },
      {
        id: "experience_points",
        label: "Experience Points",
        bucket: "COUNTER",
        targetId: "experience_points",
        format: "NUMBER",
        fallbackValue: 0,
      },
      {
        id: "proficiency_bonus",
        label: "Proficiency Bonus",
        bucket: "COUNTER",
        targetId: "proficiency_bonus",
        format: "SIGNED_NUMBER",
        fallbackValue: 2,
      },
      {
        id: "level_ups",
        label: "Level-Ups Recorded",
        bucket: "COUNTER",
        targetId: "level_ups",
        format: "NUMBER",
        fallbackValue: 0,
      },
      {
        id: "advancement_enabled",
        label: "Advancement Enabled",
        bucket: "FLAG",
        targetId: "advancement_enabled",
        format: "BOOLEAN",
        fallbackValue: true,
      },
    ],
  });
}

function makeStateSettingCommand({ id, label, command, aliases, enabled }) {
  return {
    id,
    label,
    commandContractVersion: "mechanics_command_contract_v1",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command,
      prefixes: ["/"],
      aliases,
      arguments: [],
      caseSensitive: false,
    },
    requirements: [],
    attemptEffects: [],
    resolution:
      buildMechanicsCommandResolutionReferenceConfiguration(
        "AUTOMATIC_SUCCESS"
      ),
    outcomes: {
      version: "mechanics_command_outcomes_v1",
      CRITICAL_SUCCESS: {
        outcome: "CRITICAL_SUCCESS",
        effectMode: "INHERIT",
        effects: [],
        summary: "Character advancement setting updated.",
      },
      SUCCESS: {
        outcome: "SUCCESS",
        effectMode: "INHERIT",
        effects: [],
        summary: "Character advancement setting updated.",
      },
      FAILURE: {
        outcome: "FAILURE",
        effectMode: "NONE",
        effects: [],
        summary: "Character advancement setting was not updated.",
      },
      FUMBLE: {
        outcome: "FUMBLE",
        effectMode: "NONE",
        effects: [],
        summary: "Character advancement setting was not updated.",
      },
    },
    effects: [
      {
        id: enabled ? "enable_advancement" : "disable_advancement",
        type: enabled ? "FLAG_SET" : "FLAG_CLEAR",
        targetId: "advancement_enabled",
        targetBinding: fixedTargetBinding(),
        valueBinding: fixedValueBinding(enabled ? "FLAG_SET" : "FLAG_CLEAR"),
        ...(enabled ? { value: true } : {}),
        reason: enabled
          ? "Enable character advancement for this Mechanics scope."
          : "Disable character advancement for this Mechanics scope.",
      },
    ],
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [],
      domainSteps: [],
    }),
    domainAction: {
      version: "mechanics_command_domain_action_v1",
      enabled: false,
      type: "NONE",
      applyOnOutcomes: [],
    },
    presentation: {
      mode: "STATE_SETTING",
      continueNarrative: false,
      advanceTime: false,
      resultVisibility: "FULL",
    },
    triggers: [],
    reason: `${label} for this Mechanics scope.`,
  };
}

function buildAwardExperienceCommand() {
  const experienceBinding = normalizeMechanicsEffectValueBindingBuilder(
    {
      version: MECHANICS_EFFECT_VALUE_BINDING_VERSION,
      mode: "ARGUMENT",
      argumentName: "amount",
      multiplier: 1,
      divisor: 1,
      offset: 0,
      rounding: "TRUNCATE",
      minValue: 1,
      maxValue: 1000000000,
      missingPolicy: "REJECT",
    },
    "COUNTER_INCREMENT"
  );
  const progressionProfile = buildCharacterAdvancementProgressionProfile();

  return {
    id: "award_experience",
    label: "Award Experience Points",
    commandContractVersion: "mechanics_command_contract_v1",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command: "award_xp",
      prefixes: ["/"],
      aliases: ["grant_xp", "add_xp"],
      arguments: [
        {
          name: "amount",
          label: "Experience Amount",
          type: "NUMBER",
          required: true,
          consumeRemaining: false,
          allowQuoted: true,
          options: [],
          min: 1,
          max: 1000000000,
          description: "Positive whole-number experience award.",
        },
      ],
      caseSensitive: false,
    },
    requirements: [
      {
        id: "advancement_enabled",
        type: "FLAG",
        targetId: "advancement_enabled",
        argumentName: "",
        operator: "EQ",
        value: true,
        message:
          "Character advancement is disabled. Run /advancement_on to enable it for this scope.",
        enabled: true,
      },
    ],
    attemptEffects: [],
    resolution:
      buildMechanicsCommandResolutionReferenceConfiguration(
        "AUTOMATIC_SUCCESS"
      ),
    outcomes: {
      version: "mechanics_command_outcomes_v1",
      CRITICAL_SUCCESS: {
        outcome: "CRITICAL_SUCCESS",
        effectMode: "NONE",
        effects: [],
        summary: "Experience was awarded and progression was reconciled.",
      },
      SUCCESS: {
        outcome: "SUCCESS",
        effectMode: "NONE",
        effects: [],
        summary: "Experience was awarded and progression was reconciled.",
      },
      FAILURE: {
        outcome: "FAILURE",
        effectMode: "NONE",
        effects: [],
        summary: "Experience was not awarded.",
      },
      FUMBLE: {
        outcome: "FUMBLE",
        effectMode: "NONE",
        effects: [],
        summary: "Experience was not awarded.",
      },
    },
    effects: [],
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [
        {
          id: "apply_experience_award",
          label: "Apply Experience Award",
          enabled: true,
          phase: "ATTEMPT",
          failurePolicy: "STOP",
          dependsOnStepIds: [],
          conditionMode: "ALL",
          conditions: [],
          applyOnOutcomes: [],
          effects: [
            {
              id: "increment_experience_points",
              type: "COUNTER_INCREMENT",
              targetId: "experience_points",
              targetBinding: fixedTargetBinding(),
              valueBinding: experienceBinding,
              amount: 0,
              reason:
                "Apply the parsed NUMBER argument as the experience award.",
            },
          ],
        },
        {
          id: "reconcile_character_advancement",
          label: "Reconcile Character Advancement",
          enabled: true,
          phase: "OUTCOME",
          failurePolicy: "STOP",
          dependsOnStepIds: ["apply_experience_award"],
          conditionMode: "ALL",
          conditions: [],
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
          effects: [
            {
              id: "reconcile_character_advancement",
              type: "PROGRESSION_RECONCILE",
              targetId: progressionProfile.rankValueId,
              targetBinding: fixedTargetBinding(),
              valueBinding: fixedValueBinding("PROGRESSION_RECONCILE"),
              progressionProfile,
              reason:
                "Generate the configured progression curve and reconcile rank, proficiency, and advancement count.",
            },
          ],
        },
      ],
      domainSteps: [],
    }),
    domainAction: {
      version: "mechanics_command_domain_action_v1",
      enabled: false,
      type: "NONE",
      applyOnOutcomes: [],
    },
    presentation: {
      mode: "MECHANICS_ACTION",
      continueNarrative: false,
      advanceTime: false,
      resultVisibility: "FULL",
      stateReadout: buildCharacterProgressionStateReadout(),
    },
    triggers: [],
    reason:
      "Reference authoring command for awarding experience and reconciling a generated progression curve.",
  };
}

export function buildProgressStatusCommand() {
  return {
    id: "show_character_progression",
    label: "Character Progression",
    commandContractVersion: "mechanics_command_contract_v1",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command: "progress",
      prefixes: ["/"],
      aliases: ["level", "xp_status", "advancement_status"],
      arguments: [],
      caseSensitive: false,
    },
    requirements: [],
    attemptEffects: [],
    resolution:
      buildMechanicsCommandResolutionReferenceConfiguration(
        "AUTOMATIC_SUCCESS"
      ),
    outcomes: {
      version: "mechanics_command_outcomes_v1",
      CRITICAL_SUCCESS: {
        outcome: "CRITICAL_SUCCESS",
        effectMode: "NONE",
        effects: [],
        summary: "Current character progression state.",
      },
      SUCCESS: {
        outcome: "SUCCESS",
        effectMode: "NONE",
        effects: [],
        summary: "Current character progression state.",
      },
      FAILURE: {
        outcome: "FAILURE",
        effectMode: "NONE",
        effects: [],
        summary: "Character progression state could not be read.",
      },
      FUMBLE: {
        outcome: "FUMBLE",
        effectMode: "NONE",
        effects: [],
        summary: "Character progression state could not be read.",
      },
    },
    effects: [],
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [],
      domainSteps: [],
    }),
    domainAction: {
      version: "mechanics_command_domain_action_v1",
      enabled: false,
      type: "NONE",
      applyOnOutcomes: [],
    },
    presentation: {
      mode: "QUERY",
      continueNarrative: false,
      advanceTime: false,
      resultVisibility: "FULL",
      stateReadout: buildCharacterProgressionStateReadout(),
    },
    triggers: [],
    reason:
      "Read the current character progression state without mutating Mechanics values.",
  };
}

export function buildMechanicsCharacterAdvancementPreset() {
  return deepClone({
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: [
      "character-advancement",
      "experience",
      "level",
      "proficiency",
      "progression",
      "generated-curve",
    ],
    contractVersion: "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion: "trackers_instance_data.v0_2",
      trackers: [],
      commands: [
        buildAwardExperienceCommand(),
        buildProgressStatusCommand(),
        makeStateSettingCommand({
          id: "enable_character_advancement",
          label: "Enable Character Advancement",
          command: "advancement_on",
          aliases: ["enable_advancement"],
          enabled: true,
        }),
        makeStateSettingCommand({
          id: "disable_character_advancement",
          label: "Disable Character Advancement",
          command: "advancement_off",
          aliases: ["disable_advancement"],
          enabled: false,
        }),
      ],
      guards: [],
      statusBlocks: [
        {
          id: "character_advancement_status",
          slot: "character_advancement_footer",
          label: "Character Advancement",
          placement: "response_end",
          required: true,
          visibility: "public",
          lines: [
            "[Advancement: Level {{counters.character_level.value}} · XP {{counters.experience_points.value}} · Proficiency +{{counters.proficiency_bonus.value}}]",
            "[Level-Ups Recorded: {{counters.level_ups.value}}]",
          ],
        },
      ],
      defaults: {
        flags: [
          {
            id: "advancement_enabled",
            label: "Advancement Enabled",
            initial: true,
          },
        ],
        counters: [
          {
            id: "experience_points",
            label: "Experience Points",
            initial: 0,
          },
          {
            id: "character_level",
            label: "Character Level",
            initial: 1,
          },
          {
            id: "proficiency_bonus",
            label: "Proficiency Bonus",
            initial: 2,
          },
          {
            id: "level_ups",
            label: "Level-Ups Recorded",
            initial: 0,
          },
        ],
        stages: [],
      },
    },
  });
}

export function buildMechanicsCharacterAdvancementReadoutPreset() {
  return deepClone({
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: [
      "character-advancement",
      "progression",
      "readout",
      "query",
    ],
    contractVersion: "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion: "trackers_instance_data.v0_2",
      trackers: [],
      commands: [buildProgressStatusCommand()],
      guards: [],
      statusBlocks: [],
      defaults: {
        flags: [],
        counters: [],
        stages: [],
      },
    },
  });
}

export function listMechanicsCharacterAdvancementPresets() {
  const profile = buildCharacterAdvancementProgressionProfile();
  const table = generateMechanicsProgressionTable(profile);

  return [
    {
      id: MECHANICS_CHARACTER_ADVANCEMENT_REFERENCE_ID,
      presetId: MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID,
      label: "Character Advancement (Generated Curve)",
      description:
        "Compact experience progression with adjustable linear, geometric, power, or hybrid curve settings, derived proficiency, and a read-only progress query.",
      tags: [
        "progression",
        "experience",
        "level",
        "proficiency",
        "generated-curve",
      ],
      command: "/award_xp <amount> · /progress",
      maximumThreshold: table.at(-1)?.totalRequirement ?? 0,
      authorizationNote:
        "The included award command is a reference authoring tool. Production XP awards should be gated by a GM, quest/event service, or another server-authoritative workflow.",
    },
    {
      id: MECHANICS_CHARACTER_ADVANCEMENT_READOUT_REFERENCE_ID,
      presetId: MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
      label: "Character Progress Readout Add-on",
      description:
        "Merge-safe read-only /progress command for an existing Character Advancement module without replacing its authored curve or commands.",
      tags: [
        "progression",
        "readout",
        "query",
        "merge-add-on",
      ],
      command: "/progress",
      maximumThreshold: 0,
      authorizationNote:
        "This query reads existing Mechanics state and never awards experience or changes advancement values.",
    },
  ];
}
