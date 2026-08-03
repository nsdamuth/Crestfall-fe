import {
  ACTOR_MECHANICS_PROFILE_ACTIVATION_MODE_OPTIONS,
  ACTOR_MECHANICS_PROFILE_BINDING_MODES,
  ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
  ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS,
  ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS,
  ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
  ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
  ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS,
  ACTOR_MECHANICS_PROFILE_REFERENCE_TYPE_OPTIONS,
  ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
} from "./ActorMechanicsProfileEditor.contract";

const STATE_POLICY = Object.freeze({
  isolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  namespaceStrategy: ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
  sharedDefinitionsAllowed: true,
  sharedMutableStateAllowed: false,
});

const COMMON = Object.freeze({
  enabled: true,
  titleCharacterLimit: ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxTitleLength,
  summaryCharacterLimit:
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxSummaryLength,
  presetOptions: ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS,
  ownerLocked: false,
  ownerTypes: ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
  ownerBindingModes: ACTOR_MECHANICS_PROFILE_BINDING_MODES,
  statePolicy: STATE_POLICY,
  capabilityModes: ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
  opposedResolutionPolicies:
    ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
  capabilityNotesCharacterLimit:
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxNotesLength,
  workingModeProfileCharacterLimit:
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxWorkingModeProfileLength,
  bindingLimit: ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxBindings,
  domainOptions: ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS,
  referenceTypeOptions: ACTOR_MECHANICS_PROFILE_REFERENCE_TYPE_OPTIONS,
  activationModeOptions:
    ACTOR_MECHANICS_PROFILE_ACTIVATION_MODE_OPTIONS,
  referenceLimitPerBinding:
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxReferencesPerBinding,
  globalIssues: [],
  errorCount: 0,
  warningCount: 0,
});

function binding({
  id,
  domain,
  title,
  description,
  enabled = true,
  required = false,
  activationMode = "ON_DEMAND",
  activationDomainsInput = domain,
  notes = "",
  order = 0,
  expanded = false,
  references = [],
  issues = [],
}) {
  return {
    id,
    domain,
    domainLabel:
      ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS.find(
        (option) => option.value === domain
      )?.label || domain,
    domainDescription:
      description ||
      ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS.find(
        (option) => option.value === domain
      )?.description ||
      "Actor-scoped mechanics domain.",
    title,
    enabled,
    required,
    stateIsolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
    activationMode,
    activationDomainsInput,
    notes,
    order,
    expanded,
    definitionReferenceMode:
      domain === "STATS"
        ? "STATS_POOLS_PROFILE"
        : domain === "PROGRESSION"
          ? "PROGRESSION_PROFILE"
          : "GENERIC",
    hasStatsPoolsProfileReference:
      domain === "STATS" &&
      references.some(
        (reference) => (reference.referenceType || "CREATION") === "CREATION"
      ),
    hasProgressionProfileReference:
      domain === "PROGRESSION" &&
      references.some(
        (reference) => (reference.referenceType || "CREATION") === "CREATION"
      ),
    references: references.map((reference, index) => ({
      index,
      referenceType: reference.referenceType || "CREATION",
      sourceId: reference.sourceId || "",
      version: reference.version || "",
      title: reference.title || "",
      issues: reference.issues || [],
    })),
    issues,
  };
}

export const actorMechanicsProfileEmptyFixture = Object.freeze({
  ...COMMON,
  title: "Custom",
  summary:
    "A creator-defined actor mechanics profile assembled from explicit actor-scoped bindings.",
  titleCharacterCount: 6,
  summaryCharacterCount: 88,
  presetId: "CUSTOM",
  pendingPresetId: "CUSTOM",
  ownerBindingMode: "UNBOUND_TEMPLATE",
  ownerType: "CHARACTER",
  ownerId: "",
  ownerTitle: "",
  capabilityMode: "STANDARD",
  opposedResolutionPolicy: "DETERMINISTIC",
  workingModeProfile: "",
  capabilityNotes: "",
  capabilityNotesCharacterCount: 0,
  workingModeProfileCharacterCount: 0,
  bindings: [],
  bindingCount: 0,
  enabledBindingCount: 0,
  referenceCount: 0,
  enabledDomains: [],
});

export const actorMechanicsProfileFullPcFixture = Object.freeze({
  ...COMMON,
  title: "Full Player Character",
  summary:
    "Complete actor-scoped mechanics for a Player Character, loaded only when the current turn needs the relevant domain.",
  titleCharacterCount: 21,
  summaryCharacterCount: 116,
  presetId: "FULL_PLAYER_CHARACTER",
  pendingPresetId: "FULL_PLAYER_CHARACTER",
  ownerBindingMode: "BOUND_ACTOR",
  ownerType: "PLAYER_CHARACTER",
  ownerId: "11111111-1111-4111-8111-111111111111",
  ownerTitle: "Mira Vale",
  ownerLocked: true,
  capabilityMode: "STANDARD",
  opposedResolutionPolicy: "DETERMINISTIC",
  workingModeProfile: "",
  capabilityNotes: "",
  capabilityNotesCharacterCount: 0,
  workingModeProfileCharacterCount: 0,
  bindings: [
    binding({
      id: "core.stats",
      domain: "STATS",
      title: "Core Stats and Pools",
      required: true,
      activationDomainsInput: "STATS, POOLS, COMBAT",
      order: 0,
      expanded: true,
      references: [
        {
          referenceType: "CREATION",
          sourceId: "22222222-2222-4222-8222-222222222222",
          version: "stats_profile_v0",
          title: "Heroic Stats Profile",
        },
      ],
    }),
    binding({
      id: "core.skills",
      domain: "SKILLS",
      title: "Crownfall Skills",
      activationDomainsInput: "SKILL_USE, SKILL_ADVANCE",
      order: 1,
      references: [
        {
          referenceType: "REGISTRY",
          sourceId: "33333333-3333-4333-8333-333333333333",
          version: "skill_catalog_v0",
          title: "Crownfall Skills",
        },
      ],
    }),
    binding({
      id: "core.inventory",
      domain: "INVENTORY",
      title: "Core Inventory",
      activationDomainsInput: "INVENTORY, ECONOMY",
      order: 2,
      references: [
        {
          referenceType: "BUILTIN_MODULE",
          sourceId: "core.inventory.v1",
          version: "1",
          title: "Core Inventory",
        },
      ],
    }),
  ],
  bindingCount: 3,
  enabledBindingCount: 3,
  referenceCount: 3,
  enabledDomains: ["STATS", "SKILLS", "INVENTORY"],
});

export const actorMechanicsProfileStattedNpcFixture = Object.freeze({
  ...COMMON,
  title: "Statted NPC",
  summary:
    "Sparse deterministic state for an important NPC without forcing every background character into a complete sheet.",
  titleCharacterCount: 11,
  summaryCharacterCount: 110,
  presetId: "STATTED_NPC",
  pendingPresetId: "STATTED_NPC",
  ownerBindingMode: "BOUND_ACTOR",
  ownerType: "NPC_REGISTRY_ENTRY",
  ownerId: "npc-registry-entry:captain-veren",
  ownerTitle: "Captain Veren",
  capabilityMode: "STANDARD",
  opposedResolutionPolicy: "DETERMINISTIC",
  workingModeProfile: "",
  capabilityNotes: "",
  capabilityNotesCharacterCount: 0,
  workingModeProfileCharacterCount: 0,
  bindings: [
    binding({
      id: "stats",
      domain: "STATS",
      title: "Guard Captain Stats",
      required: true,
      activationDomainsInput: "STATS, POOLS, COMBAT",
      order: 0,
      expanded: true,
      references: [
        {
          referenceType: "CREATION",
          sourceId: "stats-profile:guard-captain",
          version: "stats_profile_v0",
          title: "Guard Captain Profile",
        },
      ],
    }),
    binding({
      id: "abilities",
      domain: "ABILITIES",
      title: "Command Abilities",
      activationDomainsInput: "ABILITY_USE, COMBAT",
      order: 1,
      references: [
        {
          referenceType: "REGISTRY",
          sourceId: "ability-registry:city-watch",
          version: "ability_registry_v0",
          title: "City Watch Abilities",
        },
      ],
    }),
  ],
  bindingCount: 2,
  enabledBindingCount: 2,
  referenceCount: 2,
  enabledDomains: ["STATS", "ABILITIES"],
});

export const actorMechanicsProfileBeyondScaleFixture = Object.freeze({
  ...COMMON,
  title: "The Unbound Sovereign",
  summary:
    "Unrestricted capability remains narrative-only; a deliberately limited manifestation may use ordinary mechanics.",
  titleCharacterCount: 21,
  summaryCharacterCount: 106,
  presetId: "BEYOND_SCALE",
  pendingPresetId: "BEYOND_SCALE",
  ownerBindingMode: "BOUND_ACTOR",
  ownerType: "CHARACTER",
  ownerId: "44444444-4444-4444-8444-444444444444",
  ownerTitle: "The Unbound Sovereign",
  capabilityMode: "BEYOND_SCALE",
  opposedResolutionPolicy: "WORKING_MODE_ONLY",
  workingModeProfile: "LEVEL_100_EQUIVALENT",
  workingModeProfileCharacterCount: 20,
  capabilityNotes:
    "Only the restricted manifestation is eligible for ordinary deterministic resolution.",
  capabilityNotesCharacterCount: 82,
  bindings: [
    binding({
      id: "working_mode.stats",
      domain: "STATS",
      title: "Restricted Manifestation Stats",
      enabled: true,
      activationMode: "EXPLICIT_ONLY",
      activationDomainsInput: "STATS, COMBAT",
      order: 0,
      expanded: true,
      references: [
        {
          referenceType: "CREATION",
          sourceId: "55555555-5555-4555-8555-555555555555",
          version: "working_mode_stats_v0",
          title: "Restricted Manifestation",
        },
      ],
    }),
  ],
  bindingCount: 1,
  enabledBindingCount: 1,
  referenceCount: 1,
  enabledDomains: ["STATS"],
});

export const actorMechanicsProfileValidationFixture = Object.freeze({
  ...COMMON,
  title: "Invalid Shared-State Profile",
  summary:
    "A fixture showing owner, capability, binding, and reusable-reference validation states.",
  titleCharacterCount: 28,
  summaryCharacterCount: 87,
  presetId: "FULL_PLAYER_CHARACTER",
  pendingPresetId: "FULL_PLAYER_CHARACTER",
  ownerBindingMode: "BOUND_ACTOR",
  ownerType: "CHARACTER",
  ownerId: "",
  ownerTitle: "",
  capabilityMode: "BEYOND_SCALE",
  opposedResolutionPolicy: "DETERMINISTIC",
  workingModeProfile: "",
  workingModeProfileCharacterCount: 0,
  capabilityNotes: "",
  capabilityNotesCharacterCount: 0,
  globalIssues: [
    {
      code: "ACTOR_MECHANICS_PROFILE_BOUND_OWNER_ID_REQUIRED",
      path: "owner.ownerId",
      message: "A bound actor profile requires an owner reference.",
      severity: "ERROR",
    },
    {
      code: "ACTOR_MECHANICS_PROFILE_BEYOND_SCALE_DETERMINISTIC_FORBIDDEN",
      path: "capabilityPolicy.opposedResolutionPolicy",
      message:
        "Unrestricted Beyond Scale capability cannot use ordinary deterministic opposed checks.",
      severity: "ERROR",
    },
    {
      code: "ACTOR_MECHANICS_PROFILE_FULL_PC_OWNER_INVALID",
      path: "owner.ownerType",
      message: "Full Player Character profiles must target a Player Character.",
      severity: "ERROR",
    },
  ],
  bindings: [
    binding({
      id: "duplicate.binding",
      domain: "STATS",
      title: "Invalid Stats Binding",
      activationDomainsInput: "stats, combat",
      order: 0,
      expanded: true,
      issues: [
        {
          code: "ACTOR_MECHANICS_PROFILE_BINDING_ID_DUPLICATE",
          message: "Binding ID duplicate.binding is duplicated.",
          severity: "ERROR",
        },
      ],
      references: [
        {
          referenceType: "CREATION",
          sourceId: "",
          title: "Missing source",
          issues: [
            {
              code: "ACTOR_MECHANICS_PROFILE_REFERENCE_SOURCE_REQUIRED",
              message: "A reusable definition reference requires a source ID.",
              severity: "ERROR",
            },
          ],
        },
      ],
    }),
    binding({
      id: "duplicate.binding",
      domain: "SKILLS",
      title: "Duplicate Binding",
      order: 1,
      issues: [
        {
          code: "ACTOR_MECHANICS_PROFILE_BINDING_ID_DUPLICATE",
          message: "Binding ID duplicate.binding is duplicated.",
          severity: "ERROR",
        },
      ],
    }),
  ],
  bindingCount: 2,
  enabledBindingCount: 2,
  referenceCount: 1,
  enabledDomains: ["STATS", "SKILLS"],
  errorCount: 6,
  warningCount: 0,
});

export const actorMechanicsProfileDisabledFixture = Object.freeze({
  ...actorMechanicsProfileStattedNpcFixture,
  enabled: false,
});
