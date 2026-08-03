import {
  PROGRESSION_CURVE_DEFINITION_VERSION,
  PROGRESSION_CURVE_MODE_OPTIONS,
  PROGRESSION_CURVE_TYPE_OPTIONS,
  PROGRESSION_MAXIMUM_EXPERIENCE_OPTIONS,
  PROGRESSION_PROFILE_CONTRACT_VERSION,
  PROGRESSION_PROFILE_EDITOR_LIMITS,
  PROGRESSION_REQUIREMENT_MODE_OPTIONS,
  PROGRESSION_ROUNDING_OPTIONS,
  PROGRESSION_TIER_DEFINITION_VERSION,
  normalizeProgressionProfileEditorValue,
} from "../progression-profile-editor/ProgressionProfileEditor.contract.js";

export const PROGRESSION_JSON_AI_AUTHORING_GUIDE_VERSION =
  "progression_json_ai_authoring_guide_v1";
export const PROGRESSION_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-progression-profile-json-ai-authoring-guide.md";
export const PROGRESSION_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
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
  return JSON.stringify(normalizeProgressionProfileEditorValue(value), null, 2);
}

export function buildProgressionJsonAiAuthoringGuide(
  progressionProfile = {}
) {
  const currentJson = formatCurrentProfile(progressionProfile);

  return `# Crestfall Progression Profile JSON AI Authoring Guide

**Guide contract:** \`${PROGRESSION_JSON_AI_AUTHORING_GUIDE_VERSION}\`

**Progression Profile contract:** \`${PROGRESSION_PROFILE_CONTRACT_VERSION}\`

**Curve definition contract:** \`${PROGRESSION_CURVE_DEFINITION_VERSION}\`

**Tier definition contract:** \`${PROGRESSION_TIER_DEFINITION_VERSION}\`

## Your task

Modify the complete current Progression Profile JSON at the end of this guide according to the creator's request.

Return **one complete JSON object only**. Do not return Markdown fences, commentary, explanations, summaries, patches, or partial fragments. The creator will paste the object into Crestfall and choose **Validate & Apply**.

## Non-negotiable boundaries

- Preserve all existing profile content outside the requested changes.
- Preserve existing tier and override \`id\` values unless the creator explicitly asks to remove or rename those objects.
- New authored IDs must be readable lowercase identifiers using letters, numbers, dots, colons, underscores, or hyphens.
- Keep \`contractVersion\` exactly \`${PROGRESSION_PROFILE_CONTRACT_VERSION}\`.
- Keep curve \`definitionVersion\` exactly \`${PROGRESSION_CURVE_DEFINITION_VERSION}\`.
- Keep every tier \`definitionVersion\` exactly \`${PROGRESSION_TIER_DEFINITION_VERSION}\`.
- This asset owns reusable Progression definitions only.
- Do not add current XP, current level, unspent points, actor state, state revision, owner IDs, binding IDs, namespaces, reward history, or mutation instructions.
- Do not invent database UUIDs, Creation IDs, Character IDs, NPC IDs, owner IDs, or private identifiers.
- Do not add provider instructions, system prompts, executable code, database queries, or persistence commands.
- Do not remove fields merely because they are not part of the creator's requested change.

## Complete top-level shape

\`\`\`json
{
  "contractVersion": "${PROGRESSION_PROFILE_CONTRACT_VERSION}",
  "title": "Profile title",
  "description": "Definition purpose",
  "enabled": true,
  "curve": {},
  "tierDefinitions": [],
  "tags": [],
  "metadata": {}
}
\`\`\`

## Limits

- Maximum levels for generated curves: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxLevels.toLocaleString()}
- Maximum levels for explicit tables: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxExplicitLevels.toLocaleString()}
- Maximum overrides: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxOverrides.toLocaleString()}
- Maximum tiers: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxTiers}
- Maximum tags per tag collection: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxTags}
- Maximum identifier length: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxIdentifierLength}
- Maximum title length: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxTitleLength}
- Maximum description length: ${PROGRESSION_PROFILE_EDITOR_LIMITS.maxDescriptionLength}

## Curve modes

${optionLines(PROGRESSION_CURVE_MODE_OPTIONS)}

### Mode-specific storage

- \`GENERATED_CURVE\`: keep \`thresholds\` and \`overrides\` empty. The generation settings produce the complete deterministic table.
- \`GENERATED_CURVE_WITH_OVERRIDES\`: keep \`thresholds\` empty. Store only selected override rows in \`overrides\`.
- \`EXPLICIT_TABLE\`: store one threshold row for every configured level in \`thresholds\`. Keep \`overrides\` empty.

## Curve types

${optionLines(PROGRESSION_CURVE_TYPE_OPTIONS)}

## Requirement modes

${optionLines(PROGRESSION_REQUIREMENT_MODE_OPTIONS)}

- \`PER_LEVEL_COST\` means the generator calculates each level's cost and accumulates it.
- \`CUMULATIVE_THRESHOLD\` means the generated value is treated as the cumulative threshold for that level.

## Maximum-experience policies

${optionLines(PROGRESSION_MAXIMUM_EXPERIENCE_OPTIONS)}

The curve's \`capPolicy\` remains \`CLAMP_TO_MAXIMUM\`.

## Rounding policies

${optionLines(PROGRESSION_ROUNDING_OPTIONS)}

## Curve object

\`\`\`json
{
  "definitionVersion": "${PROGRESSION_CURVE_DEFINITION_VERSION}",
  "mode": "GENERATED_CURVE",
  "minimumLevel": 1,
  "maximumLevel": 20,
  "capPolicy": "CLAMP_TO_MAXIMUM",
  "maximumExperiencePolicy": "CONTINUE_ACCUMULATING",
  "generation": {
    "curveType": "HYBRID",
    "requirementMode": "PER_LEVEL_COST",
    "startingRequirement": 300,
    "linearIncrease": 250,
    "multiplier": 1.12,
    "exponent": 1.2,
    "minimumIncrease": 50,
    "roundTo": 50,
    "rounding": "ROUND"
  },
  "overrides": [],
  "thresholds": [],
  "metadata": {}
}
\`\`\`

## Explicit threshold rules

For \`EXPLICIT_TABLE\`:

- Include exactly one row for every integer level from \`minimumLevel\` through \`maximumLevel\`.
- Rows must remain sorted by ascending \`level\`.
- The minimum-level row must use \`cumulativeExperience: 0\`.
- Every later cumulative threshold must be strictly greater than the previous threshold.
- Use safe non-negative integers.

Example row:

\`\`\`json
{
  "level": 2,
  "cumulativeExperience": 300,
  "metadata": {}
}
\`\`\`

## Generated-curve override rules

Overrides are active only in \`GENERATED_CURVE_WITH_OVERRIDES\`.

\`\`\`json
{
  "id": "override.level_5",
  "level": 5,
  "experienceCost": 1200,
  "cumulativeExperience": null,
  "metadata": {}
}
\`\`\`

- An override level must be above \`minimumLevel\` and at or below \`maximumLevel\`.
- Each override ID and level must be unique.
- Supply either \`experienceCost\` or \`cumulativeExperience\`.
- Do not populate both unless the creator explicitly needs the existing contract behavior preserved.

## Tier definitions

\`\`\`json
{
  "definitionVersion": "${PROGRESSION_TIER_DEFINITION_VERSION}",
  "id": "tier.novice",
  "title": "Novice",
  "description": "Entry progression tier.",
  "enabled": true,
  "minimumLevel": 1,
  "maximumLevel": 4,
  "tags": ["entry"],
  "order": 0,
  "metadata": {}
}
\`\`\`

- Tier IDs must be unique valid lowercase identifiers.
- Tier titles are required.
- Enabled tier ranges must remain inside the curve's level range.
- Enabled tier ranges must not overlap.
- \`minimumLevel\` must not exceed \`maximumLevel\`.
- Keep \`order\` deterministic and zero-based when reordering tiers.
- Tiers label evaluated levels; they do not grant XP, mutate levels, award points, or unlock features by themselves.

## Metadata and tags

- \`metadata\` fields must remain JSON objects.
- Tags should be lowercase strings and should not exceed the listed limits.
- Metadata is descriptive extension data. Do not use it to smuggle actor state, executable instructions, database identifiers, or mutation requests into the asset.

## Final checklist

- The response is one complete JSON object and nothing else.
- Contract and definition versions are unchanged.
- The profile remains definition-only.
- No actor-owned state or private IDs were added.
- The selected curve mode and its stored arrays agree.
- Explicit thresholds are complete and strictly increasing when used.
- Overrides are unique and valid when used.
- Enabled tiers are valid, in range, and non-overlapping.
- Existing content outside the requested changes is preserved.
- The creator can paste the object into Crestfall and choose **Validate & Apply**.
- The creator must still use the normal page-level **Save** action to persist the asset.

## Current Progression Profile JSON

Use this normalized object as the source of truth. Return the complete updated replacement object.

\`\`\`json
${currentJson}
\`\`\`
`;
}
