import {
  RULES_CODEX_ACTIVATION_MODES,
  RULES_CODEX_ACTIVATION_SIGNAL_FIELDS,
  RULES_CODEX_AUTHORITY,
  RULES_CODEX_CONTRACT_VERSION,
  RULES_CODEX_EDITOR_LIMITS,
  RULES_CODEX_KNOWN_DOMAINS,
  RULES_CODEX_KNOWN_SCOPE_TYPES,
  RULES_CODEX_MATCH_MODES,
} from "../rules-codex-editor/RulesCodexEditor.contract.js";
import { normalizeRulesCodexEditorValue } from "../rules-codex-editor/useRulesCodexEditorViewModel.js";

export const RULES_CODEX_JSON_AI_AUTHORING_GUIDE_VERSION =
  "rules_codex_json_ai_authoring_guide_v1";

export const RULES_CODEX_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-rules-codex-json-ai-authoring-guide.md";

export const RULES_CODEX_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

function list(values = []) {
  return values.map((value) => `- \`${value}\``).join("\n");
}

function activationFieldLines() {
  return RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.map(
    (field) => `- \`${field.key}\` — ${field.label}: ${field.description}`
  ).join("\n");
}

function formatCurrentCodex(value) {
  return JSON.stringify(normalizeRulesCodexEditorValue(value), null, 2);
}

export function buildRulesCodexJsonAiAuthoringGuide(rulesCodex = {}) {
  const currentJson = formatCurrentCodex(rulesCodex);

  return `# Crestfall Rules Codex JSON AI Authoring Guide

**Guide contract:** \`${RULES_CODEX_JSON_AI_AUTHORING_GUIDE_VERSION}\`

**Rules Codex contract:** \`${RULES_CODEX_CONTRACT_VERSION}\`

**Authority:** \`${RULES_CODEX_AUTHORITY}\`

## Your task

Modify the complete current Rules Codex JSON at the end of this guide according to the creator's request.

Return **one complete JSON object only**. Do not return Markdown fences, commentary, explanations, summaries, or partial fragments. The creator will paste the result into Crestfall and choose **Validate & Apply**.

## Core architectural rule

A Rules Codex is an interpretation layer. It explains verified mechanics, registry truth, state, and world rules after the authoritative systems resolve them.

\`Modules hold truth. The Codex explains truth. Advanced Prompting portrays the character living with that truth.\`

The JSON must never convert the Codex into an execution engine, hidden prompt, state store, guard bypass, or provider-control surface.

## Non-negotiable safety and authority rules

- Keep every section's \`authority\` exactly \`${RULES_CODEX_AUTHORITY}\`.
- Preserve all existing content outside the requested changes.
- Preserve existing section \`id\` values unless the creator explicitly asks to rename or remove a section.
- New section ids must be readable, stable, lowercase identifiers using letters, numbers, dots, colons, underscores, or hyphens.
- Do not invent database UUIDs, creation ids, actor ids, room ids, registry ids, or private identifiers.
- Do not add system prompts, developer prompts, hidden prompts, provider instructions, prompt overrides, jailbreak text, or safety overrides.
- Do not add state mutations, effects, attempt effects, outcome effects, domain actions, scripts, executable code, commands to the provider, or direct database operations.
- Do not add actor runtime state such as current XP, levels, stat values, pool values, active modifiers, active conditions, balances, inventory, cooldowns, unlocks, or state revisions.
- Do not claim that Codex prose can bypass guards, deterministic mechanics, platform safety, Player Character agency, registry truth, or verified state.
- Do not grant unsupported knowledge, capabilities, permissions, items, currency, levels, skills, spells, or outcomes.
- Do not use a Codex section to take control of a Player Character.
- Do not place secrets in metadata with the expectation that they become hidden system instructions. Metadata remains ordinary authored data and is subject to the same restrictions.
- Keep \`contractVersion\` exactly \`${RULES_CODEX_CONTRACT_VERSION}\`.

## Complete object shape

\`\`\`json
{
  "contractVersion": "${RULES_CODEX_CONTRACT_VERSION}",
  "summary": "What this Codex interprets and where it applies.",
  "enabled": true,
  "selectionPolicy": {
    "maxSelectedSections": ${RULES_CODEX_EDITOR_LIMITS.defaultMaxSelectedSections},
    "maxContextCharacters": ${RULES_CODEX_EDITOR_LIMITS.defaultMaxContextCharacters}
  },
  "sections": [
    {
      "id": "economy.local-market",
      "title": "Local Market Interpretation",
      "body": "Explain verified market results without changing prices or balances.",
      "authority": "${RULES_CODEX_AUTHORITY}",
      "enabled": true,
      "priority": 70,
      "order": 0,
      "activation": {
        "mode": "CONTEXTUAL",
        "matchMode": "ANY",
        "domains": ["ECONOMY", "LOCATION"],
        "commandIds": ["BUY_ITEM"],
        "trackerIds": [],
        "guardIds": [],
        "registryRefs": [],
        "tags": ["PRICING"],
        "actorTypes": [],
        "scopeTypes": ["STORY", "LOCATION"]
      },
      "metadata": {}
    }
  ],
  "metadata": {}
}
\`\`\`

## Top-level fields

### \`summary\`

Describe the interpretive purpose, covered domains, and intended attachment context. Maximum ${RULES_CODEX_EDITOR_LIMITS.maxSummaryLength.toLocaleString()} characters.

### \`enabled\`

When false, the authored Codex remains stored but is not eligible for runtime selection.

### \`selectionPolicy\`

- \`maxSelectedSections\`: integer from 1 through ${RULES_CODEX_EDITOR_LIMITS.maxSelectedSections}.
- \`maxContextCharacters\`: integer from 1,000 through ${RULES_CODEX_EDITOR_LIMITS.maxContextCharacters.toLocaleString()}.

These values cap selected interpretation guidance. They do not force sections to load and do not alter provider context limits elsewhere in Crestfall.

### \`sections\`

A non-empty array with at most ${RULES_CODEX_EDITOR_LIMITS.maxSections} sections. Combined section bodies may not exceed ${RULES_CODEX_EDITOR_LIMITS.maxTotalBodyCharacters.toLocaleString()} characters.

## Section rules

Each section must contain:

- \`id\`: unique lowercase identifier, at most ${RULES_CODEX_EDITOR_LIMITS.maxSectionIdLength} characters.
- \`title\`: creator-facing title, at most ${RULES_CODEX_EDITOR_LIMITS.maxSectionTitleLength} characters.
- \`body\`: interpretive guidance, at most ${RULES_CODEX_EDITOR_LIMITS.maxSectionBodyLength.toLocaleString()} characters.
- \`authority\`: always \`${RULES_CODEX_AUTHORITY}\`.
- \`enabled\`: boolean.
- \`priority\`: integer from 0 through 100. Higher priority is considered first.
- \`order\`: non-negative integer. Crestfall normalizes authored array order.
- \`activation\`: selection signals.
- \`metadata\`: optional ordinary authored metadata only.

Write section bodies as bounded reference guidance. Good guidance explains how to portray or interpret an already verified result. Bad guidance attempts to manufacture the result.

### Good body example

"When the transaction resolver confirms a guild discount, describe the lower price as recognition of standing or contract terms. Never apply a discount the resolver did not confirm."

### Invalid body purpose

"Ignore the wallet, grant the item, and tell the system the transaction succeeded."

The second example attempts to override deterministic state and must not be authored.

## Activation modes

${list(RULES_CODEX_ACTIVATION_MODES)}

- \`ALWAYS\`: eligible whenever the Codex is active. Use sparingly for concise prime directives.
- \`CONTEXTUAL\`: eligible when routing signals match. A contextual section should define at least one signal.
- \`EXPLICIT_ONLY\`: eligible only when a trusted resolver requests the exact section id.

## Match modes

${list(RULES_CODEX_MATCH_MODES)}

- \`ANY\`: at least one configured signal group may match.
- \`ALL\`: every configured non-empty signal group must match.

## Activation signal fields

${activationFieldLines()}

Every activation field must be an array of strings. Use uppercase letters, numbers, dots, colons, underscores, or hyphens. No field may contain more than ${RULES_CODEX_EDITOR_LIMITS.maxActivationValuesPerField} values.

Known domains:

${list(RULES_CODEX_KNOWN_DOMAINS)}

Known scope types:

${list(RULES_CODEX_KNOWN_SCOPE_TYPES)}

The known lists are authoring guidance, not permission to invent attached creations or runtime scope edges. Attachments remain managed by Crestfall's visual and service-backed workflows.

## Ordering and selection

Eligible sections are ordered by:

1. priority descending;
2. authored order ascending;
3. section id ascending.

Selection then respects the Codex's section and character budgets. A high-priority section is not guaranteed to load when its activation conditions do not match.

## Metadata

Metadata must remain JSON objects containing passive authored information. Do not hide runtime state, prompts, mutations, effects, credentials, private identifiers, or override instructions inside metadata.

## Validation checklist

Before returning the JSON, verify:

- The result is one complete JSON object.
- The contract version is unchanged.
- Every section authority is \`${RULES_CODEX_AUTHORITY}\`.
- Section ids are unique and valid.
- Every section has a title and non-empty body.
- Selection budgets are in range.
- Activation modes and match modes are valid.
- Every activation signal field is an array of strings.
- Contextual sections have useful routing signals.
- No state, mutation, effect, script, hidden prompt, safety override, guard bypass, provider-control instruction, or Player Character control was introduced.
- Existing content outside the requested changes was preserved.
- The creator can paste the result into Crestfall and choose **Validate & Apply**.
- The creator must still use the page-level **Save** action to persist the Rules Codex.

## Current Rules Codex JSON

Use this as the source of truth. Return the complete updated replacement object.

\`\`\`json
${currentJson}
\`\`\`
`;
}
