import { getStructuredRegistryConfig } from "../../../registries/structuredRegistryConfigs.js";
import { STRUCTURED_REGISTRY_VERSION } from "../../../registries/structuredRegistryUtils.js";

export const STRUCTURED_REGISTRY_JSON_AI_GUIDE_MIME_TYPE = "text/markdown;charset=utf-8";

function registryNoun(registryType) {
  return String(registryType || "").toUpperCase() === "EVENT_REGISTRY"
    ? "Event"
    : "Quest";
}

export function getStructuredRegistryJsonAiGuideFilename(registryType) {
  return String(registryType || "").toUpperCase() === "EVENT_REGISTRY"
    ? "crestfall-event-registry-ai-authoring-guide.md"
    : "crestfall-quest-registry-ai-authoring-guide.md";
}

export function buildStructuredRegistryJsonAiAuthoringGuide({
  registryType,
  currentData = {},
} = {}) {
  const expectedType = String(registryType || "").toUpperCase();
  const config = getStructuredRegistryConfig(expectedType);
  const noun = registryNoun(expectedType);
  const categories = (config.categoryOptions || []).map((item) => `- ${item}`).join("\n");
  const relationshipGroups = (config.relationshipGroups || [])
    .map((group) => `- \`${group.id}\`: ${group.label}`)
    .join("\n");
  const questRewardGuide = expectedType === "QUEST_REGISTRY"
    ? `
## Optional Quest reward fields

Rewards are optional. A Quest can be entirely narrative and leave every reward field empty. Use these fields only when the creator wants authored compensation or other promised terms.

- \`rewardSummary\`: concise player-visible description of the promised reward terms.
- \`monetaryRewards\`: array of objects shaped exactly as \`{ "amount": "", "currency": "", "condition": "" }\`. Amount stays text so worlds can use unusual currencies, ranges, percentages, shares, or units.
- \`itemRewards\`: array of objects shaped exactly as \`{ "name": "", "quantity": "", "condition": "" }\`. These are authored descriptive reward terms, not inventory mutations.
- \`otherRewards\`: array of objects shaped exactly as \`{ "description": "", "condition": "" }\` for favors, reputation, titles, access, training, services, salvage rights, recognition, or similar non-currency rewards.
- \`hiddenRewardNotes\`: creator-only reward notes. Do not copy these into public reward fields unless the creator explicitly asks.

**Reward authority boundary:** these fields describe what the Quest promises/offers. They do not themselves grant currency, items, XP, reputation, access, or other mechanics state. Automatic fulfillment requires the appropriate Crestfall Mechanics/Gameflow authority.

**Item boundary:** do not put \`creationId\`, UUIDs, registry entry IDs, or other asset identifiers inside \`itemRewards\`. If a reward corresponds to a first-class Crestfall Item Registry asset, preserve an already-linked \`linkedItems\` relationship or leave it unlinked and let the creator use Crestfall's visual picker.
`
    : "";

  return `# Crestfall ${noun} Registry JSON AI Authoring Guide

## Purpose

You are editing one complete Crestfall ${noun} Registry data object. This guide is for bulk authoring and careful transformation of the creator's existing registry. Return one complete JSON object only when asked to produce the finished data.

The visual builder, Sample Library, and JSON editor all edit the same registry object. **Validate & Apply changes only the open builder. The creator's normal page Save action controls persistence.**

## Required contract

- \`registry_kind\` must remain exactly \`${expectedType}\`.
- \`registry_version\` must remain exactly \`${STRUCTURED_REGISTRY_VERSION}\`.
- \`entries\` must be an array.
- Preserve existing top-level fields unless the creator explicitly asks to change them.
- Preserve existing entry IDs exactly.
- For a brand-new entry, **omit \`id\`**. Crestfall will assign a fresh registry-local ID during validation/application.
- Registry-local entry IDs are not database Creation IDs.

## ${config.categoryLabel}

Use only these supported values:

${categories}

## Standard entry fields

The shared visual builder understands these fields. Existing advanced fields not listed here should be preserved unchanged unless the creator explicitly asks you to edit them and provides their contract.

- \`name\`: primary authored name.
- \`aliases\`: array of alternate names.
- \`category\`: one supported ${config.categoryLabel.toLowerCase()} value.
- \`summary\`: concise identity/purpose.
- \`publicDescription\`: information safe to surface as public or ordinary knowledge when context permits.
- \`hiddenNotes\`: creator-only authored context. Do not copy this into publicDescription.
- \`visualIdentity\`: optional visual/scene identity notes.
- \`relationshipNotes\`: freeform relationship/lead context.
- \`rulesNotes\`: authored rules or continuity constraints.
- \`accessRules\`: availability/access conditions.
- \`knowledgeRules\`: epistemic/knowledge boundaries.
- \`consequences\`: authored outcomes or persistent consequences.
- \`promptGuidance\`: low-authority presentation guidance; it does not establish new facts.
- \`negativePromptNotes\`: optional negative guidance where the builder uses it.
- \`middlewareHints\`: optional authored hints; preserve existing structure unless specifically instructed.
${questRewardGuide}
## Linked Creation fields

${relationshipGroups || "This registry currently exposes no visual relationship groups."}

Important rules:

1. **Never invent a Creation UUID or Creation ID.**
2. You may preserve a \`creationId\` that already exists in the CURRENT REGISTRY JSON below.
3. If the creator wants a new Character, Location, Item, Organization, Faction, Event, or Quest relationship and no valid ID is already present, leave that relationship unlinked. The creator should use Crestfall's visual link picker afterward.
4. Do not copy another creator's private data into a registry entry.

## Authority rules

- Registry authoring can define authored facts for this registry's domain; it does not grant the AI runtime mutation authority.
- Prompt guidance is guidance, not factual authority beyond the authored fields.
- Public and hidden information must remain separate.
- Do not turn speculation into fact.
- Do not invent current Quest-board availability, Event occurrence, Character presence, Location state, rewards, mechanics values, or outcomes unless the creator explicitly authored them.
- Preserve unknown/advanced existing fields rather than deleting them.

## Bulk-authoring guidance

When adding many entries:

- Prefer concise, distinct names and summaries.
- Avoid duplicate aliases and near-duplicate entries.
- Keep hidden answers in \`hiddenNotes\`, not public fields.
- Use relationships as notes when IDs are unavailable; do not fabricate IDs.
- New entries may omit \`id\`.
- Preserve all existing entries unless the creator explicitly asks to remove them.

## Output checklist

Before returning JSON, verify:

- One JSON object only; no Markdown fence in the final JSON response.
- \`registry_kind === "${expectedType}"\`.
- \`registry_version === "${STRUCTURED_REGISTRY_VERSION}"\`.
- Every category uses the supported vocabulary above.
- Existing entry IDs are preserved.
- New entries omit IDs unless Crestfall already assigned them.
- No new/fabricated \`creationId\` values were introduced.
- Existing advanced fields were preserved unless explicitly changed.

## Current Registry JSON

The following is the creator's current complete normalized registry data. Modify this object rather than reconstructing it from memory.

\`\`\`json
${JSON.stringify(currentData, null, 2)}
\`\`\`
`;
}
