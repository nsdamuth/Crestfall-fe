export const ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION =
  "actor_mechanics_profile_contract_v0";
export const ACTOR_MECHANICS_PROFILE_BINDING_VERSION =
  "actor_mechanics_profile_binding_v0";
export const ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION = "1.2.0";
export const ACTOR_MECHANICS_PROFILE_STATE_ISOLATION = "OWNER_SCOPED";
export const ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE = "OWNER_AND_BINDING";
export const ACTOR_MECHANICS_PROFILE_STATS_POOLS_CREATION_TYPE =
  "STATS_POOLS_PROFILE";
export const ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION =
  "stats_pools_profile_contract_v0";
export const ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE =
  "PROGRESSION_PROFILE";
export const ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION =
  "progression_profile_contract_v0";

export const ACTOR_MECHANICS_PROFILE_PRESETS = Object.freeze([
  "NARRATIVE_ONLY",
  "BASIC_NPC",
  "STATTED_NPC",
  "FULL_PLAYER_CHARACTER",
  "BOSS",
  "BEYOND_SCALE",
  "CUSTOM",
]);

export const ACTOR_MECHANICS_PROFILE_OWNER_TYPES = Object.freeze([
  "PLAYER_CHARACTER",
  "CHARACTER",
  "NPC_REGISTRY_ENTRY",
]);

export const ACTOR_MECHANICS_PROFILE_BINDING_MODES = Object.freeze([
  "UNBOUND_TEMPLATE",
  "BOUND_ACTOR",
]);

export const ACTOR_MECHANICS_PROFILE_DOMAINS = Object.freeze([
  "STATS",
  "PROGRESSION",
  "SKILLS",
  "MAGIC",
  "ABILITIES",
  "WALLET",
  "INVENTORY",
]);

export const ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES = Object.freeze([
  "CREATION",
  "BUILTIN_MODULE",
  "REGISTRY",
]);

export const ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES = Object.freeze([
  "ON_DEMAND",
  "ALWAYS",
  "EXPLICIT_ONLY",
]);

export const ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES = Object.freeze([
  "STANDARD",
  "BEYOND_SCALE",
]);

export const ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES =
  Object.freeze([
    "DETERMINISTIC",
    "WORKING_MODE_ONLY",
    "NARRATIVE_ONLY",
  ]);

export const ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS = Object.freeze({
  maxBindings: 32,
  maxReferencesPerBinding: 16,
  maxActivationDomainsPerBinding: 24,
  maxIdentifierLength: 96,
  maxTitleLength: 160,
  maxSummaryLength: 2400,
  maxNotesLength: 4000,
  maxSourceIdLength: 256,
  maxVersionLength: 96,
  maxWorkingModeProfileLength: 160,
});

export const ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS = Object.freeze([
  {
    value: "STATS",
    label: "Stats & Pools",
    description: "Core attributes, HP, Stamina, Mana, and derived values.",
  },
  {
    value: "PROGRESSION",
    label: "Progression",
    description: "Level, experience, advancement, and tier gates.",
  },
  {
    value: "SKILLS",
    label: "Skills",
    description: "Actor proficiency and training state backed by shared catalogs.",
  },
  {
    value: "MAGIC",
    label: "Magic",
    description: "Magic schools, spell knowledge, mastery, costs, and cooldowns.",
  },
  {
    value: "ABILITIES",
    label: "Abilities",
    description: "Unique abilities, techniques, passives, and unlock state.",
  },
  {
    value: "WALLET",
    label: "Wallet",
    description: "Actor or party balances, debts, credit, and reserved funds.",
  },
  {
    value: "INVENTORY",
    label: "Inventory",
    description: "Actor-owned items and inventory operations.",
  },
]);

export const ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS = Object.freeze([
  {
    presetId: "NARRATIVE_ONLY",
    title: "Narrative Only",
    summary:
      "No deterministic actor mechanics are enabled. The actor remains portrayal-only.",
    ownerType: "CHARACTER",
    capabilityPolicy: {
      mode: "STANDARD",
      opposedResolutionPolicy: "NARRATIVE_ONLY",
      workingModeProfile: "",
      notes: "",
    },
    bindings: [],
  },
  {
    presetId: "BASIC_NPC",
    title: "Basic NPC",
    summary:
      "A lightweight important-NPC profile with optional stats, abilities, wallet, and inventory.",
    ownerType: "NPC_REGISTRY_ENTRY",
    capabilityPolicy: {
      mode: "STANDARD",
      opposedResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    bindings: [
      { domain: "STATS", enabled: false, required: false },
      { domain: "ABILITIES", enabled: false, required: false },
      { domain: "WALLET", enabled: false, required: false },
      { domain: "INVENTORY", enabled: false, required: false },
    ],
  },
  {
    presetId: "STATTED_NPC",
    title: "Statted NPC",
    summary:
      "An important NPC with actor-scoped stats, progression, skills, abilities, wallet, and inventory.",
    ownerType: "NPC_REGISTRY_ENTRY",
    capabilityPolicy: {
      mode: "STANDARD",
      opposedResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    bindings: [
      { domain: "STATS", enabled: true, required: true },
      { domain: "PROGRESSION", enabled: true, required: false },
      { domain: "SKILLS", enabled: true, required: false },
      { domain: "ABILITIES", enabled: true, required: false },
      { domain: "WALLET", enabled: false, required: false },
      { domain: "INVENTORY", enabled: true, required: false },
    ],
  },
  {
    presetId: "FULL_PLAYER_CHARACTER",
    title: "Full Player Character",
    summary:
      "A complete Player Character mechanics profile with isolated state across every supported domain.",
    ownerType: "PLAYER_CHARACTER",
    capabilityPolicy: {
      mode: "STANDARD",
      opposedResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    bindings: ACTOR_MECHANICS_PROFILE_DOMAINS.map((domain) => ({
      domain,
      enabled: true,
      required: domain === "STATS",
    })),
  },
  {
    presetId: "BOSS",
    title: "Boss",
    summary:
      "A major mechanically resolved actor with stats, progression, skills, magic, abilities, and inventory.",
    ownerType: "CHARACTER",
    capabilityPolicy: {
      mode: "STANDARD",
      opposedResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    bindings: [
      { domain: "STATS", enabled: true, required: true },
      { domain: "PROGRESSION", enabled: true, required: false },
      { domain: "SKILLS", enabled: true, required: false },
      { domain: "MAGIC", enabled: true, required: false },
      { domain: "ABILITIES", enabled: true, required: false },
      { domain: "INVENTORY", enabled: true, required: false },
    ],
  },
  {
    presetId: "BEYOND_SCALE",
    title: "Beyond Scale",
    summary:
      "An actor whose unrestricted capability is not resolved through ordinary opposed mechanics.",
    ownerType: "CHARACTER",
    capabilityPolicy: {
      mode: "BEYOND_SCALE",
      opposedResolutionPolicy: "WORKING_MODE_ONLY",
      workingModeProfile: "",
      notes:
        "Only an explicitly restricted manifestation may use ordinary deterministic resolution.",
    },
    bindings: [
      { domain: "STATS", enabled: false, required: false },
      { domain: "ABILITIES", enabled: true, required: false },
      { domain: "INVENTORY", enabled: false, required: false },
    ],
  },
  {
    presetId: "CUSTOM",
    title: "Custom",
    summary:
      "A creator-defined actor mechanics profile assembled from explicit actor-scoped bindings.",
    ownerType: "CHARACTER",
    capabilityPolicy: {
      mode: "STANDARD",
      opposedResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    bindings: [],
  },
]);

export const ACTOR_MECHANICS_PROFILE_REFERENCE_TYPE_OPTIONS = Object.freeze([
  {
    value: "CREATION",
    label: "Creation",
    description: "A reusable Crestfall creation such as a future Stats profile.",
  },
  {
    value: "BUILTIN_MODULE",
    label: "Built-in Module",
    description: "A deterministic first-party module identifier.",
  },
  {
    value: "REGISTRY",
    label: "Registry",
    description: "A shared catalog or registry definition source.",
  },
]);

export const ACTOR_MECHANICS_PROFILE_ACTIVATION_MODE_OPTIONS = Object.freeze([
  {
    value: "ON_DEMAND",
    label: "On demand",
    description: "Load only when the router detects a relevant domain.",
  },
  {
    value: "ALWAYS",
    label: "Always",
    description: "Keep available for every eligible turn involving this actor.",
  },
  {
    value: "EXPLICIT_ONLY",
    label: "Explicit only",
    description: "Load only when explicitly requested by a command or operation.",
  },
]);

export const EMPTY_ACTOR_MECHANICS_PROFILE_STATE_POLICY = Object.freeze({
  isolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  namespaceStrategy: ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
  sharedDefinitionsAllowed: true,
  sharedMutableStateAllowed: false,
});

/**
 * Display-ready reusable definition reference supplied to the portable View.
 *
 * @typedef {Object} ActorMechanicsProfileReferenceViewItem
 * @property {number} index
 * @property {string} referenceType
 * @property {string} sourceId
 * @property {string} version
 * @property {string} title
 * @property {Array<{code:string,message:string,severity:string}>} issues
 */

/**
 * Display-ready mechanics-domain binding supplied to the portable View.
 *
 * @typedef {Object} ActorMechanicsProfileBindingViewItem
 * @property {string} id
 * @property {string} domain
 * @property {string} domainLabel
 * @property {string} domainDescription
 * @property {string} title
 * @property {boolean} enabled
 * @property {boolean} required
 * @property {string} stateIsolation
 * @property {string} activationMode
 * @property {string} activationDomainsInput
 * @property {string} notes
 * @property {number} order
 * @property {boolean} expanded
 * @property {ActorMechanicsProfileReferenceViewItem[]} references
 * @property {Array<{code:string,message:string,severity:string}>} issues
 */

/**
 * Stable UI boundary for the portable Actor Mechanics Profile Editor View.
 *
 * The View receives display-ready fields and semantic callbacks. It does not
 * know creation rows, JSONB columns, API routes, persistence, PostGraphile,
 * Supabase, Advanced Mechanics execution, runtime activation, or provider
 * context assembly.
 *
 * @typedef {Object} ActorMechanicsProfileEditorViewProps
 * @property {boolean} enabled
 * @property {string} title
 * @property {string} summary
 * @property {number} titleCharacterCount
 * @property {number} titleCharacterLimit
 * @property {number} summaryCharacterCount
 * @property {number} summaryCharacterLimit
 * @property {string} presetId
 * @property {string} pendingPresetId
 * @property {Array<object>} presetOptions
 * @property {string} ownerBindingMode
 * @property {string} ownerType
 * @property {string} ownerId
 * @property {string} ownerTitle
 * @property {boolean} ownerLocked
 * @property {Array<string>} ownerTypes
 * @property {Array<string>} ownerBindingModes
 * @property {object} statePolicy
 * @property {string} capabilityMode
 * @property {string} opposedResolutionPolicy
 * @property {string} workingModeProfile
 * @property {string} capabilityNotes
 * @property {Array<string>} capabilityModes
 * @property {Array<string>} opposedResolutionPolicies
 * @property {ActorMechanicsProfileBindingViewItem[]} bindings
 * @property {number} bindingCount
 * @property {number} bindingLimit
 * @property {number} enabledBindingCount
 * @property {number} referenceCount
 * @property {string[]} enabledDomains
 * @property {Array<object>} domainOptions
 * @property {Array<object>} referenceTypeOptions
 * @property {Array<object>} activationModeOptions
 * @property {Array<{code:string,path:string,message:string,severity:string}>} globalIssues
 * @property {((enabled:boolean)=>void)|null} onSetEnabled
 * @property {((field:"title"|"summary",value:string)=>void)|null} onUpdateIdentity
 * @property {((presetId:string)=>void)|null} onSelectPreset
 * @property {(()=>void)|null} onApplyPreset
 * @property {((field:string,value:string)=>void)|null} onUpdateOwner
 * @property {((field:string,value:string)=>void)|null} onUpdateCapabilityPolicy
 * @property {(()=>void)|null} onAddBinding
 * @property {((bindingId:string)=>void)|null} onRemoveBinding
 * @property {((bindingId:string,direction:"UP"|"DOWN")=>void)|null} onMoveBinding
 * @property {((bindingId:string)=>void)|null} onToggleBinding
 * @property {((bindingId:string,field:string,value:unknown)=>void)|null} onUpdateBinding
 * @property {((bindingId:string)=>void)|null} onAddReference
 * @property {((bindingId:string,referenceIndex:number)=>void)|null} onRemoveReference
 * @property {((bindingId:string,referenceIndex:number,field:string,value:string)=>void)|null} onUpdateReference
 */
