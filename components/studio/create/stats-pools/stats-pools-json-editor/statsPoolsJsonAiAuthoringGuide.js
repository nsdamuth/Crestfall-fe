import {
  STATS_POOLS_CAPABILITY_MODE_OPTIONS,
  STATS_POOLS_CONDITION_DEFINITION_VERSION,
  STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS,
  STATS_POOLS_DURATION_POLICY_OPTIONS,
  STATS_POOLS_EDITOR_LIMITS,
  STATS_POOLS_FORMULA_OPERATION_OPTIONS,
  STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS,
  STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS,
  STATS_POOLS_FORMULA_ROUNDING_OPTIONS,
  STATS_POOLS_FORMULA_VERSION,
  STATS_POOLS_MODIFIER_DEFINITION_VERSION,
  STATS_POOLS_MODIFIER_OPERATION_OPTIONS,
  STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS,
  STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS,
  STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
  STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS,
  STATS_POOLS_POOL_DEFINITION_VERSION,
  STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS,
  STATS_POOLS_PROFILE_CONTRACT_VERSION,
  STATS_POOLS_PROFILE_MODE_OPTIONS,
  STATS_POOLS_SCALE_MODE_OPTIONS,
  STATS_POOLS_STACK_POLICY_OPTIONS,
  STATS_POOLS_STAT_DEFINITION_VERSION,
  STATS_POOLS_VALUE_TYPE_OPTIONS,
} from "../stats-pools-editor/StatsPoolsEditor.contract.js";
import { normalizeStatsPoolsEditorValue } from "../stats-pools-editor/useStatsPoolsEditorViewModel.js";

export const STATS_POOLS_JSON_AI_AUTHORING_GUIDE_VERSION =
  "stats_pools_json_ai_authoring_guide_v1";
export const STATS_POOLS_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-stats-pools-profile-json-ai-authoring-guide.md";
export const STATS_POOLS_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

function optionLines(values = []) {
  return values
    .map((entry) =>
      entry.description
        ? `- \`${entry.value}\` — ${entry.label}: ${entry.description}`
        : `- \`${entry.value}\` — ${entry.label}`
    )
    .join("\n");
}

function formatCurrentProfile(value) {
  return JSON.stringify(normalizeStatsPoolsEditorValue(value), null, 2);
}

export function buildStatsPoolsJsonAiAuthoringGuide(statsPoolsProfile = {}) {
  const currentJson = formatCurrentProfile(statsPoolsProfile);

  return `# Crestfall Stats & Pools Profile JSON AI Authoring Guide

**Guide contract:** \`${STATS_POOLS_JSON_AI_AUTHORING_GUIDE_VERSION}\`

**Stats & Pools Profile contract:** \`${STATS_POOLS_PROFILE_CONTRACT_VERSION}\`

**Stat definition contract:** \`${STATS_POOLS_STAT_DEFINITION_VERSION}\`

**Pool definition contract:** \`${STATS_POOLS_POOL_DEFINITION_VERSION}\`

**Formula contract:** \`${STATS_POOLS_FORMULA_VERSION}\`

**Modifier definition contract:** \`${STATS_POOLS_MODIFIER_DEFINITION_VERSION}\`

**Condition definition contract:** \`${STATS_POOLS_CONDITION_DEFINITION_VERSION}\`

## Your task

Modify the complete current Stats & Pools Profile JSON at the end of this guide according to the creator's request.

Return **one complete JSON object only**. Do not return Markdown fences, commentary, explanations, summaries, patches, or partial fragments. The creator will paste the object into Crestfall and choose **Validate & Apply**.

## Non-negotiable boundaries

- Preserve all existing profile content outside the requested changes.
- Preserve existing definition IDs unless the creator explicitly asks to remove or rename those definitions.
- New IDs must be readable lowercase identifiers using letters, numbers, dots, colons, underscores, or hyphens.
- Keep every contract and definition version exactly as shown in this guide.
- This asset owns reusable Stat, Pool, Formula, Modifier, and Condition definitions only.
- Do not add actor-owned Stat values, Pool values, current HP, active modifiers, active conditions, stacks, durations, owner IDs, binding IDs, namespaces, state revisions, or mutation history.
- Do not invent database UUIDs, Creation IDs, Character IDs, NPC IDs, owner IDs, or private identifiers.
- Do not add provider instructions, system prompts, executable code, database queries, or persistence commands.
- Do not remove fields merely because they are outside the creator's requested change.

## Complete top-level shape

\`\`\`json
{
  "contractVersion": "${STATS_POOLS_PROFILE_CONTRACT_VERSION}",
  "title": "Profile title",
  "description": "Definition purpose",
  "enabled": true,
  "profileMode": "SPARSE",
  "capabilityPolicy": {
    "mode": "STANDARD",
    "numericResolutionPolicy": "DETERMINISTIC",
    "workingModeProfile": "",
    "notes": ""
  },
  "statDefinitions": [],
  "poolDefinitions": [],
  "modifierDefinitions": [],
  "conditionDefinitions": [],
  "metadata": {}
}
\`\`\`

## Limits

- Maximum Stats: ${STATS_POOLS_EDITOR_LIMITS.maxStats}
- Maximum Pools: ${STATS_POOLS_EDITOR_LIMITS.maxPools}
- Maximum Modifier definitions: ${STATS_POOLS_EDITOR_LIMITS.maxModifierDefinitions}
- Maximum Condition definitions: ${STATS_POOLS_EDITOR_LIMITS.maxConditionDefinitions}
- Maximum formula operands: ${STATS_POOLS_EDITOR_LIMITS.maxFormulaOperands}
- Maximum tags per collection: ${STATS_POOLS_EDITOR_LIMITS.maxTags}
- Maximum identifier length: ${STATS_POOLS_EDITOR_LIMITS.maxIdentifierLength}
- Maximum title length: ${STATS_POOLS_EDITOR_LIMITS.maxTitleLength}
- Maximum description length: ${STATS_POOLS_EDITOR_LIMITS.maxDescriptionLength}
- Maximum notes length: ${STATS_POOLS_EDITOR_LIMITS.maxNotesLength}

## Profile modes

${optionLines(STATS_POOLS_PROFILE_MODE_OPTIONS)}

## Capability policy

${optionLines(STATS_POOLS_CAPABILITY_MODE_OPTIONS)}

${optionLines(STATS_POOLS_NUMERIC_RESOLUTION_OPTIONS)}

- \`STANDARD\` profiles normalize to \`DETERMINISTIC\` numeric resolution.
- \`BEYOND_SCALE\` profiles must use \`WORKING_MODE_ONLY\` or \`NARRATIVE_ONLY\`.
- A working-mode profile describes the intentionally restricted manifestation that can use ordinary numbers.

## Stat definitions

\`\`\`json
{
  "definitionVersion": "${STATS_POOLS_STAT_DEFINITION_VERSION}",
  "id": "vitality",
  "title": "Vitality",
  "description": "Physical resilience.",
  "enabled": true,
  "category": "CORE",
  "valueType": "INTEGER",
  "scale": {
    "mode": "BOUNDED",
    "minimum": 0,
    "maximum": 100,
    "defaultValue": 50
  },
  "derived": {
    "enabled": false,
    "formula": null
  },
  "playerReadout": {
    "visibility": "PRIMARY"
  },
  "tags": ["physical"],
  "order": 0,
  "metadata": {}
}
\`\`\`

Value types:

${optionLines(STATS_POOLS_VALUE_TYPE_OPTIONS)}

Player readout visibility:

${optionLines(STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS)}

- Existing non-derived Stats default to \`PRIMARY\`.
- Existing derived Stats default to \`DETAIL\`.
- \`HIDDEN\` Stats still participate in mechanics formulas but are not exposed through player-facing readouts.

Scale modes:

${optionLines(STATS_POOLS_SCALE_MODE_OPTIONS)}

- Bounded maximum must be greater than minimum.
- Bounded defaultValue must remain inside the range.
- \`BEYOND_SCALE\` uses null minimum, maximum, and defaultValue.
- Derived Stats require a valid Formula and still remain reusable definitions, not actor values.

## Pool definitions

\`\`\`json
{
  "definitionVersion": "${STATS_POOLS_POOL_DEFINITION_VERSION}",
  "id": "health",
  "title": "Health",
  "description": "Current physical endurance.",
  "enabled": true,
  "category": "RESOURCE",
  "valueType": "INTEGER",
  "minimum": 0,
  "maximum": {
    "mode": "FIXED",
    "value": 100,
    "formula": null
  },
  "defaultCurrent": {
    "mode": "MAXIMUM",
    "value": null
  },
  "allowOverfill": false,
  "playerReadout": {
    "visibility": "PRIMARY"
  },
  "tags": ["health"],
  "order": 0,
  "metadata": {}
}
\`\`\`

Maximum modes:

${optionLines(STATS_POOLS_POOL_MAXIMUM_MODE_OPTIONS)}

Default-current modes:

${optionLines(STATS_POOLS_POOL_DEFAULT_CURRENT_OPTIONS)}

Player readout visibility:

${optionLines(STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS)}

- Existing Pools default to \`PRIMARY\`.
- \`DETAIL\` Pools remain available under the HUD More control.
- \`HIDDEN\` Pools still participate in mechanics formulas but are not exposed through player-facing readouts.
- Pool definitions may define a reusable starting policy, but never an actor's current Pool value.
- Fixed maximum must be greater than minimum.
- A fixed default current value must remain in bounds unless overfill is allowed.

## Formula definitions

\`\`\`json
{
  "formulaVersion": "${STATS_POOLS_FORMULA_VERSION}",
  "root": {
    "nodeType": "OPERATION",
    "operation": "ADD",
    "operands": [
      {
        "nodeType": "REFERENCE",
        "referenceType": "STAT",
        "referenceId": "vitality",
        "field": "CURRENT"
      },
      {
        "nodeType": "CONSTANT",
        "value": 10
      }
    ]
  },
  "rounding": "ROUND",
  "notes": ""
}
\`\`\`

Operations:

${optionLines(STATS_POOLS_FORMULA_OPERATION_OPTIONS)}

Rounding:

${optionLines(STATS_POOLS_FORMULA_ROUNDING_OPTIONS)}

Reference types:

${optionLines(STATS_POOLS_FORMULA_REFERENCE_TYPE_OPTIONS)}

Reference fields:

${optionLines(STATS_POOLS_FORMULA_REFERENCE_FIELD_OPTIONS)}

- The visual editor requires one OPERATION root with at least two operands.
- Each operand is either \`CONSTANT\` or \`REFERENCE\`.
- Reference IDs must point to a Stat or Pool in this same profile.
- Do not create circular derived dependencies.

## Modifier definitions

\`\`\`json
{
  "definitionVersion": "${STATS_POOLS_MODIFIER_DEFINITION_VERSION}",
  "id": "wounded-defense-penalty",
  "title": "Wounded Defense Penalty",
  "description": "Reduces Defense while wounded.",
  "enabled": true,
  "target": {
    "targetType": "STAT_CURRENT",
    "definitionId": "defense"
  },
  "operation": "ADD",
  "value": -10,
  "stackPolicy": "UNIQUE",
  "durationPolicy": "PERSISTENT",
  "defaultDurationTurns": 0,
  "priority": 10,
  "notes": "",
  "metadata": {}
}
\`\`\`

Targets:

${optionLines(STATS_POOLS_MODIFIER_TARGET_TYPE_OPTIONS)}

Operations:

${optionLines(STATS_POOLS_MODIFIER_OPERATION_OPTIONS)}

Stack policies:

${optionLines(STATS_POOLS_STACK_POLICY_OPTIONS)}

Duration policies:

${optionLines(STATS_POOLS_DURATION_POLICY_OPTIONS)}

- The target definitionId must exist in this profile.
- TURN_COUNT requires at least one default duration turn.
- These are reusable definitions; do not add active modifier instances, source IDs, stacks, or remaining duration state.

## Condition definitions

\`\`\`json
{
  "definitionVersion": "${STATS_POOLS_CONDITION_DEFINITION_VERSION}",
  "id": "wounded",
  "title": "Wounded",
  "description": "The actor is significantly injured.",
  "enabled": true,
  "stackPolicy": "UNIQUE",
  "maximumStacks": 1,
  "modifierDefinitionIds": ["wounded-defense-penalty"],
  "tags": ["injury"],
  "order": 0,
  "metadata": {}
}
\`\`\`

Condition stack policies:

${optionLines(STATS_POOLS_CONDITION_STACK_POLICY_OPTIONS)}

- Every modifierDefinitionId must refer to a Modifier definition in this profile.
- maximumStacks must be at least 1.
- These are reusable definitions; do not add active Condition instances, current stacks, sources, or expiration state.

## Metadata and tags

- Metadata fields must remain JSON objects.
- Tags should be lowercase strings and stay within limits.
- Metadata is descriptive extension data. Do not use it to smuggle actor state, executable instructions, database identifiers, or mutation requests into the asset.

## Final checklist

- The response is one complete JSON object and nothing else.
- Contract and definition versions are unchanged.
- The profile remains definition-only.
- No actor-owned values, active effects, private IDs, or namespace state were added.
- Formula references resolve to definitions in this profile and do not form cycles.
- Modifier targets and Condition modifier references resolve correctly.
- Existing content outside the requested changes is preserved.
- The creator can paste the object into Crestfall and choose **Validate & Apply**.
- The creator must still use the normal page-level **Save** action to persist the asset.

## Current Stats & Pools Profile JSON

Use this normalized object as the source of truth. Return the complete updated replacement object.

\`\`\`json
${currentJson}
\`\`\`
`;
}
