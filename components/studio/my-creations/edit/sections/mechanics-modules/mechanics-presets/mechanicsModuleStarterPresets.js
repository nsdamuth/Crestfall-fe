import {
  buildMechanicsCommandResolutionReferenceConfiguration,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
  normalizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  buildMechanicsCommandStarterPreset,
} from "./mechanicsCommandStarterPresets.js";

export const MECHANICS_MODULE_STARTER_VERSION =
  "mechanics_module_starter_presets_v1";

export const MECHANICS_MODULE_STARTER_IDS = Object.freeze([
  "RESOURCE_LOOP",
  "SOCIAL_PROBE",
  "ITEM_HANDOFF",
  "TRAVEL_NAVIGATION",
  "QUEST_PROGRESS",
]);

const MODULE_DEFINITION_ID = "core.trackers.v1";
const INSTANCE_DATA_VERSION = "trackers_instance_data.v0_2";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function deepClone(value) {
  return value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));
}

function makeTracker({
  id,
  label,
  min = 0,
  max = 100,
  initial = min,
  phases = [],
  mutationHints = [],
}) {
  return {
    id,
    kind: "meter",
    label,
    min,
    max,
    initial,
    phases,
    mutationHints,
  };
}

function makeDefault(id, label, initial) {
  return { id, label, initial };
}

function makeGuard({
  id,
  label,
  enforcement = "HARD_LOCK",
  mode = "ALL",
  conditions = [],
  onFailSummary = "",
  composerGuidance = "",
  onPassSummary = "",
  composerVisibility = "SUMMARY_ONLY",
  publicVisibility = "HIDDEN",
}) {
  return {
    id,
    label,
    enforcement,
    mode,
    conditions,
    onFail: {
      summary: onFailSummary,
      composerGuidance,
    },
    onPass: {
      summary: onPassSummary,
    },
    composerVisibility,
    publicVisibility,
  };
}

function makeStatusBlock({
  id,
  label,
  slot = "main_footer",
  placement = "response_end",
  visibility = "public",
  lines = [],
}) {
  return {
    id,
    slot,
    label,
    placement,
    required: true,
    visibility,
    lines,
  };
}

function makeModule({
  priority = 65,
  tags = [],
  trackers = [],
  commands = [],
  guards = [],
  statusBlocks = [],
  defaults = {},
}) {
  return {
    moduleDefinitionId: MODULE_DEFINITION_ID,
    moduleId: MODULE_DEFINITION_ID,
    priority,
    tags,
    contractVersion: INSTANCE_DATA_VERSION,
    instanceData: {
      contractVersion: INSTANCE_DATA_VERSION,
      trackers,
      commands,
      guards,
      statusBlocks,
      defaults: {
        flags: Array.isArray(defaults.flags) ? defaults.flags : [],
        counters: Array.isArray(defaults.counters) ? defaults.counters : [],
        stages: Array.isArray(defaults.stages) ? defaults.stages : [],
      },
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

function fixedBinding() {
  return {
    version: "mechanics_effect_target_binding_v1",
    mode: "FIXED",
    argumentName: "",
  };
}

function makeEffect({ id, type, targetId, reason = "", ...value }) {
  return {
    id,
    type,
    targetId,
    targetBinding: fixedBinding(),
    reason,
    ...value,
  };
}

function makeQuestOutcomes() {
  return {
    version: "mechanics_command_outcomes_v1",
    CRITICAL_SUCCESS: {
      outcome: "CRITICAL_SUCCESS",
      effectMode: "NONE",
      effects: [],
      summary: "Quest progress advances decisively.",
    },
    SUCCESS: {
      outcome: "SUCCESS",
      effectMode: "NONE",
      effects: [],
      summary: "Quest progress advances.",
    },
    FAILURE: {
      outcome: "FAILURE",
      effectMode: "REPLACE",
      effects: [
        makeEffect({
          id: "record_quest_failure",
          type: "COUNTER_INCREMENT",
          targetId: "quest_failures",
          amount: 1,
          reason: "Record a failed quest-progress attempt.",
        }),
      ],
      summary: "Quest progress does not advance.",
    },
    FUMBLE: {
      outcome: "FUMBLE",
      effectMode: "REPLACE",
      effects: [
        makeEffect({
          id: "record_quest_fumble",
          type: "COUNTER_INCREMENT",
          targetId: "quest_failures",
          amount: 2,
          reason: "Record two failure points for a fumbled quest attempt.",
        }),
      ],
      summary: "The quest attempt produces a serious setback.",
    },
  };
}

function buildQuestProgressCommand() {
  const resolution =
    buildMechanicsCommandResolutionReferenceConfiguration("STANDARD_D20");

  return {
    id: "quest_progress",
    label: "Advance Quest Progress",
    commandContractVersion: "mechanics_command_contract_v1",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command: "quest_step",
      prefixes: ["/"],
      aliases: ["advance_quest"],
      arguments: [],
      caseSensitive: false,
    },
    requirements: [
      {
        id: "quest_is_active",
        type: "FLAG",
        targetId: "quest_active",
        argumentName: "",
        operator: "EQ",
        value: true,
        message: "The quest must be active.",
        enabled: true,
      },
    ],
    attemptEffects: [],
    resolution,
    outcomes: makeQuestOutcomes(),
    domainAction: noDomainAction(),
    composition: normalizeMechanicsCommandCompositionBuilder({
      version: MECHANICS_COMMAND_COMPOSITION_VERSION,
      mechanicsSteps: [
        {
          id: "record_quest_attempt",
          label: "Record Quest Attempt",
          enabled: true,
          phase: "ATTEMPT",
          failurePolicy: "CONTINUE",
          dependsOnStepIds: [],
          conditionMode: "ALL",
          conditions: [],
          applyOnOutcomes: [],
          effects: [
            makeEffect({
              id: "increment_quest_attempts",
              type: "COUNTER_INCREMENT",
              targetId: "quest_attempts",
              amount: 1,
              reason: "Record each authorized quest-progress attempt.",
            }),
          ],
        },
        {
          id: "advance_quest_progress",
          label: "Advance Quest Progress",
          enabled: true,
          phase: "OUTCOME",
          failurePolicy: "STOP",
          dependsOnStepIds: [],
          conditionMode: "ALL",
          conditions: [],
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
          effects: [
            makeEffect({
              id: "increment_quest_progress",
              type: "COUNTER_INCREMENT",
              targetId: "quest_progress",
              amount: 1,
              reason: "Advance the quest progress counter on success.",
            }),
            makeEffect({
              id: "increase_quest_momentum",
              type: "METER_DELTA",
              targetId: "quest_momentum",
              delta: 1,
              amount: 1,
              reason: "Increase visible quest momentum on success.",
            }),
          ],
        },
        {
          id: "complete_quest",
          label: "Complete Quest",
          enabled: true,
          phase: "OUTCOME",
          failurePolicy: "CONTINUE",
          dependsOnStepIds: ["advance_quest_progress"],
          conditionMode: "ALL",
          conditions: [
            {
              id: "quest_progress_complete",
              bucket: "COUNTER",
              mechanicsId: "quest_progress",
              scopeMode: "COMMAND_SOURCE",
              scopeKey: "",
              argumentName: "",
              field: "value",
              operator: "GTE",
              value: 3,
              enabled: true,
            },
          ],
          applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
          effects: [
            makeEffect({
              id: "set_quest_complete_stage",
              type: "STAGE_SET",
              targetId: "quest_stage",
              value: "complete",
              reason: "Mark the quest stage complete after three successes.",
            }),
            makeEffect({
              id: "clear_quest_active",
              type: "FLAG_CLEAR",
              targetId: "quest_active",
              reason: "Deactivate the quest after completion.",
            }),
          ],
        },
      ],
      domainSteps: [],
    }),
    presentation: {
      mode: "MECHANICS_ACTION",
      continueNarrative: true,
      advanceTime: true,
      resultVisibility: "FULL",
    },
    triggers: ["advance quest", "quest step"],
    effects: [],
    reason:
      "A staged progression command demonstrating pending-state conditions and ordered outcome steps.",
  };
}

function requiredStarter(id) {
  const command = buildMechanicsCommandStarterPreset(id);
  if (!command) {
    throw new Error(`Missing MC7B command starter ${id}.`);
  }
  return command;
}

function buildResourceLoopModule() {
  return makeModule({
    priority: 65,
    tags: ["resource", "meter", "threshold", "starter"],
    trackers: [
      makeTracker({
        id: "resource",
        label: "Resource",
        min: 0,
        max: 100,
        initial: 40,
        phases: [
          { id: "depleted", label: "Depleted", min: 0, max: 4 },
          { id: "low", label: "Low", min: 5, max: 24 },
          { id: "ready", label: "Ready", min: 25, max: 74 },
          { id: "charged", label: "Charged", min: 75, max: 100 },
        ],
        mutationHints: [],
      }),
    ],
    commands: [requiredStarter("RESOURCE_CHECK")],
    guards: [
      makeGuard({
        id: "resource_access",
        label: "Resource Access",
        enforcement: "HARD_LOCK",
        conditions: [
          {
            conditionType: "METER",
            id: "resource",
            field: "value",
            operator: "gte",
            value: 5,
          },
        ],
        onFailSummary: "Resource is below the minimum action cost.",
        composerGuidance:
          "Do not describe the resource-powered action as completed until resource is restored.",
        onPassSummary: "Resource is sufficient for the action.",
      }),
    ],
    statusBlocks: [
      makeStatusBlock({
        id: "resource_footer",
        label: "Resource Footer",
        lines: [
          "[Resource: {{trackers.resource.value}}/100 · {{trackers.resource.phaseLabel}}]",
          "[Successes: {{counters.resource_successes.value}} · Failures: {{counters.resource_failures.value}}]",
        ],
      }),
    ],
    defaults: {
      flags: [makeDefault("resource_enabled", "Resource Enabled", true)],
      counters: [
        makeDefault("attempt_count", "Attempt Count", 0),
        makeDefault("success_count", "Success Count", 0),
        makeDefault("resource_successes", "Resource Successes", 0),
        makeDefault("resource_failures", "Resource Failures", 0),
      ],
      stages: [makeDefault("resource_mode", "Resource Mode", "ready")],
    },
  });
}

function buildSocialProbeModule() {
  return makeModule({
    priority: 66,
    tags: ["social", "trust", "opposed", "target-scoped", "starter"],
    trackers: [
      makeTracker({
        id: "trust",
        label: "Trust",
        min: 0,
        max: 100,
        initial: 40,
        phases: [
          { id: "closed", label: "Closed", min: 0, max: 19 },
          { id: "guarded", label: "Guarded", min: 20, max: 49 },
          { id: "open", label: "Open", min: 50, max: 79 },
          { id: "trusted", label: "Trusted", min: 80, max: 100 },
        ],
        mutationHints: [],
      }),
    ],
    commands: [requiredStarter("SOCIAL_PROBE")],
    guards: [
      makeGuard({
        id: "trust_access",
        label: "Trust Access",
        enforcement: "HARD_LOCK",
        conditions: [
          {
            conditionType: "METER",
            id: "trust",
            field: "value",
            operator: "gte",
            value: 5,
          },
        ],
        onFailSummary: "Trust is too low to attempt another probe.",
        composerGuidance:
          "Keep the target guarded and do not imply a successful read while the trust lock is active.",
        onPassSummary: "Trust permits a social probe.",
      }),
    ],
    statusBlocks: [
      makeStatusBlock({
        id: "trust_footer",
        label: "Trust Footer",
        lines: [
          "[Trust: {{trackers.trust.value}}/100 · {{trackers.trust.phaseLabel}}]",
          "[Probe Attempts: {{counters.attempt_count.value}} · Successes: {{counters.success_count.value}} · Failures: {{counters.failed_probes.value}}]",
        ],
      }),
    ],
    defaults: {
      flags: [makeDefault("social_probe_enabled", "Social Probe Enabled", true)],
      counters: [
        makeDefault("attempt_count", "Probe Attempts", 0),
        makeDefault("success_count", "Probe Successes", 0),
        makeDefault("failed_probes", "Failed Probes", 0),
      ],
      stages: [makeDefault("social_mode", "Social Mode", "guarded")],
    },
  });
}

function buildItemHandoffModule() {
  return makeModule({
    priority: 64,
    tags: ["item", "handoff", "custody", "domain", "starter"],
    trackers: [],
    commands: [requiredStarter("GIVE_ITEM")],
    guards: [
      makeGuard({
        id: "item_handoff_enabled",
        label: "Item Handoff Enabled",
        enforcement: "HARD_LOCK",
        conditions: [
          {
            conditionType: "FLAG",
            id: "handoff_enabled",
            field: "value",
            operator: "eq",
            value: true,
          },
        ],
        onFailSummary: "Item handoffs are disabled.",
        composerGuidance:
          "Do not narrate a completed Item transfer while the handoff lock is active.",
        onPassSummary: "Item handoffs are enabled.",
      }),
    ],
    statusBlocks: [
      makeStatusBlock({
        id: "item_handoff_footer",
        label: "Item Handoff Footer",
        visibility: "private",
        lines: [
          "[Items Given: {{counters.items_given.value}} · Handoff Stage: {{stages.handoff_stage.value}}]",
        ],
      }),
    ],
    defaults: {
      flags: [makeDefault("handoff_enabled", "Handoff Enabled", true)],
      counters: [makeDefault("items_given", "Items Given", 0)],
      stages: [makeDefault("handoff_stage", "Handoff Stage", "ready")],
    },
  });
}

function buildTravelNavigationModule() {
  return makeModule({
    priority: 63,
    tags: ["travel", "navigation", "location", "domain", "starter"],
    trackers: [],
    commands: [requiredStarter("TRAVEL_CONNECTED")],
    guards: [
      makeGuard({
        id: "travel_enabled",
        label: "Travel Enabled",
        enforcement: "HARD_LOCK",
        conditions: [
          {
            conditionType: "FLAG",
            id: "travel_allowed",
            field: "value",
            operator: "eq",
            value: true,
          },
        ],
        onFailSummary: "Travel actions are currently disabled.",
        composerGuidance:
          "Keep the party at the current Location until travel is re-enabled.",
        onPassSummary: "Travel actions are enabled.",
      }),
    ],
    statusBlocks: [
      makeStatusBlock({
        id: "travel_footer",
        label: "Travel Footer",
        visibility: "private",
        lines: [
          "[Travel Commands: {{counters.travel_commands.value}} · Travel Mode: {{stages.travel_mode.value}}]",
        ],
      }),
    ],
    defaults: {
      flags: [makeDefault("travel_allowed", "Travel Allowed", true)],
      counters: [makeDefault("travel_commands", "Travel Commands", 0)],
      stages: [makeDefault("travel_mode", "Travel Mode", "idle")],
    },
  });
}

function buildQuestProgressModule() {
  return makeModule({
    priority: 67,
    tags: ["quest", "progression", "condition", "dependency", "starter"],
    trackers: [
      makeTracker({
        id: "quest_momentum",
        label: "Quest Momentum",
        min: 0,
        max: 3,
        initial: 0,
        phases: [
          { id: "starting", label: "Starting", min: 0, max: 0 },
          { id: "moving", label: "Moving", min: 1, max: 2 },
          { id: "complete", label: "Complete", min: 3, max: 3 },
        ],
        mutationHints: [],
      }),
    ],
    commands: [buildQuestProgressCommand()],
    guards: [
      makeGuard({
        id: "quest_active_guidance",
        label: "Quest Active Guidance",
        enforcement: "SOFT_LOCK",
        conditions: [
          {
            conditionType: "FLAG",
            id: "quest_active",
            field: "value",
            operator: "eq",
            value: true,
          },
        ],
        onFailSummary: "The quest is no longer active.",
        composerGuidance:
          "Treat the quest as complete or inactive and avoid granting further progress.",
        onPassSummary: "The quest is active.",
      }),
    ],
    statusBlocks: [
      makeStatusBlock({
        id: "quest_footer",
        label: "Quest Footer",
        lines: [
          "[Quest: {{stages.quest_stage.value}} · Progress: {{counters.quest_progress.value}}/3 · Momentum: {{trackers.quest_momentum.value}}/3]",
          "[Attempts: {{counters.quest_attempts.value}} · Failures: {{counters.quest_failures.value}}]",
        ],
      }),
    ],
    defaults: {
      flags: [makeDefault("quest_active", "Quest Active", true)],
      counters: [
        makeDefault("quest_attempts", "Quest Attempts", 0),
        makeDefault("quest_progress", "Quest Progress", 0),
        makeDefault("quest_failures", "Quest Failures", 0),
      ],
      stages: [makeDefault("quest_stage", "Quest Stage", "active")],
    },
  });
}

const DEFINITIONS = Object.freeze([
  {
    id: "RESOURCE_LOOP",
    presetId: "module.resource_loop.v1",
    label: "Resource Loop",
    description:
      "A complete meter-powered action module with costs, threshold resolution, guards, defaults, and deterministic status output.",
    tags: ["resource", "meter", "cost", "guard", "status"],
    commandCount: 1,
    domainLanes: [],
    build: buildResourceLoopModule,
  },
  {
    id: "SOCIAL_PROBE",
    presetId: "module.social_probe.v1",
    label: "Social Probe Module",
    description:
      "A complete trust-driven opposed social module with target-scoped progress, lock behavior, defaults, and status output.",
    tags: ["social", "trust", "opposed", "target-scoped", "guard"],
    commandCount: 1,
    domainLanes: [],
    build: buildSocialProbeModule,
  },
  {
    id: "ITEM_HANDOFF",
    presetId: "module.item_handoff.v1",
    label: "Item Handoff",
    description:
      "A complete authoritative Item-transfer module with custody requirements, an enablement guard, defaults, and private audit status.",
    tags: ["item", "handoff", "custody", "domain", "guard"],
    commandCount: 1,
    domainLanes: ["ITEM_RUNTIME"],
    build: buildItemHandoffModule,
  },
  {
    id: "TRAVEL_NAVIGATION",
    presetId: "module.travel_navigation.v1",
    label: "Travel Navigation",
    description:
      "A complete Location-transition module with typed navigation, a travel gate, defaults, and private status output.",
    tags: ["travel", "navigation", "location", "domain", "guard"],
    commandCount: 1,
    domainLanes: ["LOCATION_RUNTIME"],
    build: buildTravelNavigationModule,
  },
  {
    id: "QUEST_PROGRESS",
    presetId: "module.quest_progress.v1",
    label: "Quest Progress",
    description:
      "A complete staged progression module using ordered steps, pending-state conditions, dependencies, guards, defaults, and status output.",
    tags: ["quest", "progression", "condition", "dependency", "status"],
    commandCount: 1,
    domainLanes: [],
    build: buildQuestProgressModule,
  },
]);

export function listMechanicsModuleStarterPresets() {
  return DEFINITIONS.map((definition) => ({
    id: definition.id,
    presetId: definition.presetId,
    label: definition.label,
    description: definition.description,
    tags: [...definition.tags],
    commandCount: definition.commandCount,
    domainLanes: [...definition.domainLanes],
  }));
}

export function getMechanicsModuleStarterPresetDefinition(id) {
  const requested = normalizeString(id).toUpperCase();
  const definition = DEFINITIONS.find(
    (entry) =>
      entry.id === requested ||
      entry.presetId.toUpperCase() === requested
  );

  return definition
    ? {
        id: definition.id,
        presetId: definition.presetId,
        label: definition.label,
        description: definition.description,
        tags: [...definition.tags],
        commandCount: definition.commandCount,
        domainLanes: [...definition.domainLanes],
      }
    : null;
}

export function buildMechanicsModuleStarterPreset(id) {
  const requested = normalizeString(id).toUpperCase();
  const definition = DEFINITIONS.find(
    (entry) =>
      entry.id === requested ||
      entry.presetId.toUpperCase() === requested
  );

  return definition ? deepClone(definition.build()) : null;
}

export function summarizeMechanicsModuleStarterPreset(moduleData = {}) {
  const instanceData = moduleData?.instanceData || {};
  const defaults = instanceData.defaults || {};

  return {
    moduleDefinitionId:
      moduleData.moduleDefinitionId ||
      moduleData.moduleId ||
      "",
    priority: Number(moduleData.priority) || 0,
    trackerCount: Array.isArray(instanceData.trackers)
      ? instanceData.trackers.length
      : 0,
    commandCount: Array.isArray(instanceData.commands)
      ? instanceData.commands.length
      : 0,
    guardCount: Array.isArray(instanceData.guards)
      ? instanceData.guards.length
      : 0,
    statusBlockCount: Array.isArray(instanceData.statusBlocks)
      ? instanceData.statusBlocks.length
      : 0,
    defaultCount:
      (Array.isArray(defaults.flags) ? defaults.flags.length : 0) +
      (Array.isArray(defaults.counters) ? defaults.counters.length : 0) +
      (Array.isArray(defaults.stages) ? defaults.stages.length : 0),
  };
}
