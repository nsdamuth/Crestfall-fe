export const RULES_CODEX_CONTRACT_VERSION = "rules_codex_contract_v0";
export const RULES_CODEX_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";
export const RULES_CODEX_AUTHORITY = "INTERPRETATION_ONLY";

export const RULES_CODEX_ACTIVATION_MODES = Object.freeze([
  "ALWAYS",
  "CONTEXTUAL",
  "EXPLICIT_ONLY",
]);

export const RULES_CODEX_MATCH_MODES = Object.freeze(["ANY", "ALL"]);

export const RULES_CODEX_KNOWN_DOMAINS = Object.freeze([
  "GENERAL",
  "STATS",
  "POOLS",
  "PROGRESSION",
  "SKILL_USE",
  "SKILL_ADVANCE",
  "MAGIC_USE",
  "MAGIC_ADVANCE",
  "ABILITY_USE",
  "COMBAT",
  "ECONOMY",
  "INVENTORY",
  "LOCATION",
  "TRAVEL",
  "SOCIAL",
  "QUEST",
  "FACTION",
  "ORGANIZATION",
  "TIME",
  "WEATHER",
]);

export const RULES_CODEX_KNOWN_SCOPE_TYPES = Object.freeze([
  "STORY",
  "SCENARIO",
  "ROOM",
  "LOCATION",
  "ORGANIZATION",
  "FACTION",
  "CHARACTER",
  "PLAYER_CHARACTER",
  "NPC",
  "ACTOR_MECHANICS_PROFILE",
  "MECHANICS_MODULE",
]);

export const RULES_CODEX_EDITOR_LIMITS = Object.freeze({
  maxSections: 128,
  maxSectionIdLength: 96,
  maxSectionTitleLength: 160,
  maxSectionBodyLength: 8000,
  maxSummaryLength: 2000,
  maxActivationValuesPerField: 64,
  maxTotalBodyCharacters: 96000,
  defaultMaxSelectedSections: 8,
  maxSelectedSections: 24,
  defaultMaxContextCharacters: 12000,
  maxContextCharacters: 32000,
});

export const RULES_CODEX_ACTIVATION_SIGNAL_FIELDS = Object.freeze([
  {
    key: "domains",
    label: "Domains",
    placeholder: "ECONOMY, INVENTORY, LOCATION",
    description: "Broad runtime domains that make this section relevant.",
  },
  {
    key: "commandIds",
    label: "Command IDs",
    placeholder: "BUY_ITEM, SELL_ITEM",
    description: "Mechanics or chat commands that can activate this section.",
  },
  {
    key: "trackerIds",
    label: "Tracker IDs",
    placeholder: "wallet.gold, stats.strength",
    description: "Specific tracker identifiers referenced by the rule.",
  },
  {
    key: "guardIds",
    label: "Guard IDs",
    placeholder: "skill.master.level-gate",
    description: "Guard identifiers whose evaluation needs this interpretation.",
  },
  {
    key: "registryRefs",
    label: "Registry References",
    placeholder: "SPELL:FIREBALL, ITEM:IRON_SWORD",
    description: "Registry definitions that can request this section.",
  },
  {
    key: "tags",
    label: "Tags",
    placeholder: "PRICING, TIER_GATES, DIVINE",
    description: "Additional routing tags used by the context planner.",
  },
  {
    key: "actorTypes",
    label: "Actor Types",
    placeholder: "PLAYER_CHARACTER, NPC",
    description: "Actor categories for which the rule is relevant.",
  },
  {
    key: "scopeTypes",
    label: "Attachment Scope Types",
    placeholder: "STORY, LOCATION, ORGANIZATION",
    description: "Attachment scopes that may activate the section.",
  },
]);

export const EMPTY_RULES_CODEX_ACTIVATION = Object.freeze({
  mode: "CONTEXTUAL",
  matchMode: "ANY",
  domains: [],
  commandIds: [],
  trackerIds: [],
  guardIds: [],
  registryRefs: [],
  tags: [],
  actorTypes: [],
  scopeTypes: [],
});

/**
 * Display-ready Rules Codex section supplied to the portable View.
 *
 * @typedef {Object} RulesCodexSectionViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {boolean} enabled
 * @property {number} priority
 * @property {number} order
 * @property {string} authorityLabel
 * @property {string} activationMode
 * @property {string} matchMode
 * @property {Record<string, string>} activationInputs
 * @property {number} bodyCharacterCount
 * @property {number} bodyCharacterLimit
 * @property {boolean} expanded
 * @property {Array<{code:string,message:string,severity:string}>} issues
 */

/**
 * Stable UI boundary for the portable Rules Codex Editor View.
 *
 * The View receives display-ready fields and semantic callbacks. It does not
 * know creation rows, JSONB columns, API routes, persistence payloads,
 * PostGraphile, Supabase, Story attachments, or runtime selection results.
 *
 * @typedef {Object} RulesCodexEditorViewProps
 * @property {boolean} enabled
 * @property {string} summary
 * @property {number} summaryCharacterCount
 * @property {number} summaryCharacterLimit
 * @property {number} maxSelectedSections
 * @property {number} maxContextCharacters
 * @property {number} maxSelectedSectionsLimit
 * @property {number} maxContextCharactersLimit
 * @property {RulesCodexSectionViewItem[]} sections
 * @property {number} totalBodyCharacters
 * @property {number} totalBodyCharacterLimit
 * @property {number} sectionCount
 * @property {number} sectionLimit
 * @property {Array<{code:string,path:string,message:string,severity:string}>} globalIssues
 * @property {typeof RULES_CODEX_KNOWN_DOMAINS} knownDomains
 * @property {typeof RULES_CODEX_KNOWN_SCOPE_TYPES} knownScopeTypes
 * @property {typeof RULES_CODEX_ACTIVATION_SIGNAL_FIELDS} activationSignalFields
 * @property {((enabled:boolean)=>void)|null} onSetEnabled
 * @property {((summary:string)=>void)|null} onUpdateSummary
 * @property {((field:"maxSelectedSections"|"maxContextCharacters",value:number|string)=>void)|null} onUpdateSelectionPolicy
 * @property {(()=>void)|null} onAddSection
 * @property {((sectionId:string)=>void)|null} onRemoveSection
 * @property {((sectionId:string,direction:"UP"|"DOWN")=>void)|null} onMoveSection
 * @property {((sectionId:string)=>void)|null} onToggleSection
 * @property {((sectionId:string,field:string,value:unknown)=>void)|null} onUpdateSection
 * @property {((sectionId:string,field:string,value:string)=>void)|null} onUpdateActivationInput
 * @property {((sectionId:string)=>void)|null} onClearSection
 */
