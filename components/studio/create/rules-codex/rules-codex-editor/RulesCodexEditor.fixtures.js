import {
  RULES_CODEX_ACTIVATION_SIGNAL_FIELDS,
  RULES_CODEX_AUTHORITY,
  RULES_CODEX_EDITOR_LIMITS,
  RULES_CODEX_KNOWN_DOMAINS,
  RULES_CODEX_KNOWN_SCOPE_TYPES,
} from "./RulesCodexEditor.contract";

const noop = () => {};

function makeSection({
  id,
  title,
  body,
  enabled = true,
  priority = 50,
  activationMode = "CONTEXTUAL",
  matchMode = "ANY",
  activationInputs = {},
  expanded = false,
  issues = [],
  order = 0,
}) {
  return {
    id,
    title,
    body,
    enabled,
    priority,
    order,
    authorityLabel: RULES_CODEX_AUTHORITY,
    activationMode,
    matchMode,
    activationInputs: Object.fromEntries(
      RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.map((field) => [
        field.key,
        activationInputs[field.key] || "",
      ])
    ),
    bodyCharacterCount: body.length,
    bodyCharacterLimit: RULES_CODEX_EDITOR_LIMITS.maxSectionBodyLength,
    expanded,
    issues,
  };
}

function makeFixture({
  enabled = true,
  summary = "",
  sections = [],
  globalIssues = [],
  maxSelectedSections = RULES_CODEX_EDITOR_LIMITS.defaultMaxSelectedSections,
  maxContextCharacters = RULES_CODEX_EDITOR_LIMITS.defaultMaxContextCharacters,
} = {}) {
  return {
    enabled,
    summary,
    summaryCharacterCount: summary.length,
    summaryCharacterLimit: RULES_CODEX_EDITOR_LIMITS.maxSummaryLength,
    maxSelectedSections,
    maxContextCharacters,
    maxSelectedSectionsLimit: RULES_CODEX_EDITOR_LIMITS.maxSelectedSections,
    maxContextCharactersLimit: RULES_CODEX_EDITOR_LIMITS.maxContextCharacters,
    sections,
    totalBodyCharacters: sections.reduce(
      (total, section) => total + section.bodyCharacterCount,
      0
    ),
    totalBodyCharacterLimit: RULES_CODEX_EDITOR_LIMITS.maxTotalBodyCharacters,
    sectionCount: sections.length,
    sectionLimit: RULES_CODEX_EDITOR_LIMITS.maxSections,
    globalIssues,
    knownDomains: RULES_CODEX_KNOWN_DOMAINS,
    knownScopeTypes: RULES_CODEX_KNOWN_SCOPE_TYPES,
    activationSignalFields: RULES_CODEX_ACTIVATION_SIGNAL_FIELDS,
    onSetEnabled: noop,
    onUpdateSummary: noop,
    onUpdateSelectionPolicy: noop,
    onAddSection: noop,
    onRemoveSection: noop,
    onMoveSection: noop,
    onToggleSection: noop,
    onUpdateSection: noop,
    onUpdateActivationInput: noop,
    onClearSection: noop,
  };
}

export const rulesCodexEmptyFixture = makeFixture({
  summary: "",
  sections: [
    makeSection({
      id: "new-section",
      title: "",
      body: "",
      expanded: true,
      issues: [
        {
          code: "RULES_CODEX_SECTION_TITLE_REQUIRED",
          message: "Section title is required.",
          severity: "ERROR",
        },
        {
          code: "RULES_CODEX_SECTION_BODY_REQUIRED",
          message: "Section guidance is required.",
          severity: "ERROR",
        },
      ],
    }),
  ],
});

export const rulesCodexStatInterpretationFixture = makeFixture({
  summary:
    "Interprets the shared 1–100 character scale without replacing deterministic checks.",
  sections: [
    makeSection({
      id: "stats.threshold-anchors",
      title: "Stat Threshold Anchors",
      body:
        "Treat values near 50 as capable professional performance. Values above 80 represent exceptional mastery. Describe verified differences comparatively, but do not invent new bonuses or override a resolved check.",
      activationMode: "CONTEXTUAL",
      activationInputs: {
        domains: "STATS, COMBAT, SKILL_USE",
        tags: "THRESHOLD_INTERPRETATION",
        actorTypes: "PLAYER_CHARACTER, NPC",
      },
      expanded: true,
    }),
  ],
});

export const rulesCodexEconomyFixture = makeFixture({
  summary:
    "Explains local prices, scarcity, and discounts after the economy systems resolve the transaction.",
  sections: [
    makeSection({
      id: "economy.local-market",
      title: "Local Market Interpretation",
      body:
        "Use the active Location market profile as the local authority for availability, scarcity, taxes, and merchant tone. The wallet and transaction operation remain authoritative for balances and final cost.",
      priority: 70,
      activationMode: "CONTEXTUAL",
      matchMode: "ANY",
      activationInputs: {
        domains: "ECONOMY, INVENTORY, LOCATION",
        commandIds: "BUY_ITEM, SELL_ITEM, PAY_SERVICE",
        scopeTypes: "STORY, LOCATION, ORGANIZATION",
        tags: "PRICING, MARKET",
      },
      expanded: true,
    }),
    makeSection({
      id: "economy.guild-discounts",
      title: "Guild Discounts",
      body:
        "When a verified organization benefit applies, describe the reduced price as recognition of standing or contract terms. Never apply a discount that the transaction resolver did not confirm.",
      priority: 60,
      activationMode: "CONTEXTUAL",
      activationInputs: {
        domains: "ECONOMY, ORGANIZATION",
        guardIds: "GUILD_DISCOUNT_ELIGIBLE",
        scopeTypes: "ORGANIZATION",
      },
    }),
  ],
});

export const rulesCodexExplicitOnlyFixture = makeFixture({
  summary:
    "Contains exceptional interpretation that should load only when directly requested.",
  sections: [
    makeSection({
      id: "capability.beyond-scale",
      title: "Beyond Scale Capability",
      body:
        "An unrestricted Beyond Scale entity is not resolved through ordinary 1–100 opposed checks. Use the configured working manifestation for mechanics; otherwise treat the outcome as narrative-only within established canon and player-agency limits.",
      priority: 95,
      activationMode: "EXPLICIT_ONLY",
      activationInputs: {
        tags: "BEYOND_SCALE, NARRATIVE_ONLY",
      },
      expanded: true,
    }),
  ],
});

export const rulesCodexValidationFixture = makeFixture({
  summary: "A fixture showing authoring errors and warnings.",
  sections: [
    makeSection({
      id: "Invalid Section ID",
      title: "",
      body: "",
      expanded: true,
      issues: [
        {
          code: "RULES_CODEX_SECTION_ID_INVALID",
          message:
            "Use lowercase letters, numbers, dots, colons, underscores, or hyphens.",
          severity: "ERROR",
        },
        {
          code: "RULES_CODEX_SECTION_TITLE_REQUIRED",
          message: "Section title is required.",
          severity: "ERROR",
        },
        {
          code: "RULES_CODEX_CONTEXTUAL_SIGNALS_REQUIRED",
          message: "Contextual sections need at least one activation signal.",
          severity: "WARNING",
        },
      ],
    }),
  ],
});

const nearLimitBody = "Rule guidance remains concise and scoped. ".repeat(190);

export const rulesCodexNearLimitFixture = makeFixture({
  summary:
    "A near-limit fixture for verifying character counters and long-form layout.",
  maxSelectedSections: 24,
  maxContextCharacters: 32000,
  sections: [
    makeSection({
      id: "limits.near-section-limit",
      title: "Near Section Body Limit",
      body: nearLimitBody.slice(
        0,
        RULES_CODEX_EDITOR_LIMITS.maxSectionBodyLength - 80
      ),
      activationMode: "ALWAYS",
      expanded: true,
    }),
  ],
});

export const rulesCodexDisabledFixture = makeFixture({
  enabled: false,
  summary:
    "This Codex is retained as authored content but is not available for runtime selection.",
  sections: [
    makeSection({
      id: "general.prime-directives",
      title: "Prime Directives",
      body:
        "Verified state, player agency, platform safety, and deterministic mechanics always take precedence over interpretive guidance.",
      activationMode: "ALWAYS",
    }),
  ],
});
