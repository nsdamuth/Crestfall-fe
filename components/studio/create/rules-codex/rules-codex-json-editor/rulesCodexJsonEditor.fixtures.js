import {
  RULES_CODEX_AUTHORITY,
  RULES_CODEX_CONTRACT_VERSION,
} from "../rules-codex-editor/RulesCodexEditor.contract.js";

export const rulesCodexJsonEditorFixture = Object.freeze({
  contractVersion: RULES_CODEX_CONTRACT_VERSION,
  summary:
    "Explains verified progression, resource, and local-market results without replacing deterministic mechanics.",
  enabled: true,
  selectionPolicy: {
    maxSelectedSections: 8,
    maxContextCharacters: 12000,
  },
  sections: [
    {
      id: "progression.threshold-meaning",
      title: "Progression Threshold Meaning",
      body:
        "Describe a verified level or tier as established capability and experience. Never grant XP, levels, tiers, points, or unlocks that the Progression evaluator did not confirm.",
      authority: RULES_CODEX_AUTHORITY,
      enabled: true,
      priority: 80,
      order: 0,
      activation: {
        mode: "CONTEXTUAL",
        matchMode: "ANY",
        domains: ["PROGRESSION"],
        commandIds: ["PROGRESS"],
        trackerIds: [],
        guardIds: [],
        registryRefs: [],
        tags: ["LEVEL", "TIER"],
        actorTypes: ["PLAYER_CHARACTER", "NPC"],
        scopeTypes: ["STORY", "ACTOR_MECHANICS_PROFILE"],
      },
      metadata: {},
    },
    {
      id: "resources.authoritative-costs",
      title: "Authoritative Resource Costs",
      body:
        "When a verified action spends a pool or tracker, portray the cost as exertion, focus, fatigue, or consumed reserves. Do not change the cost, refund it, or claim success when the authoritative command was blocked.",
      authority: RULES_CODEX_AUTHORITY,
      enabled: true,
      priority: 70,
      order: 1,
      activation: {
        mode: "CONTEXTUAL",
        matchMode: "ANY",
        domains: ["POOLS", "COMBAT", "MAGIC_USE"],
        commandIds: [],
        trackerIds: ["RESOURCE"],
        guardIds: ["RESOURCE_ACCESS"],
        registryRefs: [],
        tags: ["RESOURCE_COST"],
        actorTypes: [],
        scopeTypes: ["STORY", "MECHANICS_MODULE"],
      },
      metadata: {},
    },
    {
      id: "general.prime-directive",
      title: "Prime Interpretation Directive",
      body:
        "Verified state, platform safety, Player Character agency, deterministic mechanics, guards, and registries always take precedence over this Codex.",
      authority: RULES_CODEX_AUTHORITY,
      enabled: true,
      priority: 100,
      order: 2,
      activation: {
        mode: "ALWAYS",
        matchMode: "ANY",
        domains: [],
        commandIds: [],
        trackerIds: [],
        guardIds: [],
        registryRefs: [],
        tags: [],
        actorTypes: [],
        scopeTypes: [],
      },
      metadata: {},
    },
  ],
  metadata: {
    fixture: "rules_codex_json_editor_fixture_v1",
  },
});
