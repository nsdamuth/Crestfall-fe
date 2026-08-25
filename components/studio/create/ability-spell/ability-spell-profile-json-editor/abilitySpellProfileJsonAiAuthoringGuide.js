import {
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  ABILITY_SPELL_DEFINITION_VERSION,
  ABILITY_SPELL_PREREQUISITE_VERSION,
  ABILITY_SPELL_COST_VERSION,
  ABILITY_SPELL_TARGET_MODEL_VERSION,
  ABILITY_SPELL_RESTRICTIONS_VERSION,
  ABILITY_SPELL_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
  ABILITY_SPELL_OPERATION_TARGET_BINDING_MODES,
  ABILITY_SPELL_COOLDOWN_POLICY_VERSION,
  ABILITY_SPELL_CHARGE_POLICY_VERSION,
  ABILITY_SPELL_MASTERY_POLICY_VERSION,
  ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION,
  ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES,
  ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS,
  ABILITY_SPELL_ROOM_LOCAL_CUSTOM_FIELD_INPUT_MODES,
  ABILITY_SPELL_ROOM_LOCAL_REQUIRED_FIELDS,
  ABILITY_SPELL_TYPES,
  normalizeAbilitySpellProfileEditorValue,
} from "../ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";

export const ABILITY_SPELL_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-ability-spell-profile-json-ai-authoring-guide.md";
export const ABILITY_SPELL_PROFILE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

export function buildAbilitySpellProfileJsonAiAuthoringGuide(profile) {
  const current = JSON.stringify(normalizeAbilitySpellProfileEditorValue(profile), null, 2);
  return `# Crestfall Ability & Spell Profile JSON AI Authoring Guide

Guide contract: ability_spell_profile_json_ai_authoring_guide_v0
Profile contract: ${ABILITY_SPELL_PROFILE_CONTRACT_VERSION}
Definition contract: ${ABILITY_SPELL_DEFINITION_VERSION}
Prerequisite contract: ${ABILITY_SPELL_PREREQUISITE_VERSION}
Cost contract: ${ABILITY_SPELL_COST_VERSION}
Target contract: ${ABILITY_SPELL_TARGET_MODEL_VERSION}
Restrictions contract: ${ABILITY_SPELL_RESTRICTIONS_VERSION}
Legacy operation reference contract: ${ABILITY_SPELL_OPERATION_REFERENCE_VERSION}
Executable operation reference contract: ${ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION}
Operation target-binding contract: ${ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION}
Cooldown contract: ${ABILITY_SPELL_COOLDOWN_POLICY_VERSION}
Charge contract: ${ABILITY_SPELL_CHARGE_POLICY_VERSION}
Mastery contract: ${ABILITY_SPELL_MASTERY_POLICY_VERSION}
Actor configuration contract: ${ABILITY_SPELL_ACTOR_CONFIGURATION_VERSION}

## Task
Modify the complete current Ability & Spell Profile JSON at the end of this guide. Return one complete JSON object only. Do not return Markdown fences, commentary, patches, fragments, or omitted fields.

## Non-negotiable boundaries
- Preserve valid content outside the requested changes.
- Preserve existing definition IDs unless explicitly asked to rename or remove them.
- The profile owns reusable definitions only.
- actorConfiguration.definitionSelection may require players to choose from existing reusable definitions before play.
- definitionSelection mode NONE disables starting definition selection. GROUPS uses creator-authored groups with minimumSelections, maximumSelections, optional allowedTypes/allowedSchools/allowedCategories filters, and optional requireSameSchool.
- requireUniqueDefinitions controls whether one existing definition may satisfy more than one starting group.
- Existing-definition selection does not create new player-authored Ability definitions; use roomLocalDefinitionAuthoring for that separate room-scoped capability.
- actorConfiguration.roomLocalDefinitionAuthoring may separately require players to author room-local definitions during Character Configuration.
- roomLocalDefinitionAuthoring mode NONE disables room-local authoring. GROUPS uses minimumDefinitions, maximumDefinitions, optional allowedTypes/allowedSchools/allowedCategories values, optional requireSameSchool, visibleFields, requiredFields, and customTextFields.
- visibleFields controls which reusable core fields the player sees. Supported values are: ${ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS.join(", ")}. Title and Type remain part of every authored definition.
- Supported requiredFields values are: ${ABILITY_SPELL_ROOM_LOCAL_REQUIRED_FIELDS.join(", ")}. A required field must also be visible.
- schoolInputMode and categoryInputMode are generic creator-owned presentation policies. Supported values are: ${ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES.join(", ")}. AUTO preserves legacy behavior; FREE_ENTRY accepts creator/player text; FIXED_LIST restricts to the configured list; LIST_PLUS_CUSTOM surfaces configured choices while still allowing a custom value.
- Schools and categories are creator-defined values, not Crestfall-global enums. Do not invent game-specific school/category lists unless the creator supplied them.
- customTextFields remain backward-compatible but may now use structured input. Supported inputMode values are: ${ABILITY_SPELL_ROOM_LOCAL_CUSTOM_FIELD_INPUT_MODES.join(", ")}. SINGLE_SELECT and SINGLE_SELECT_OR_CUSTOM use the creator-authored options array. Values still persist as descriptive strings in customText.
- Structured player fields do not create costs, resource spending, ranks, prerequisites, effects, or other mechanics authority. Those remain creator-authored Mechanics responsibilities.
- Room-local player-authored definitions are NARRATIVE_ONLY in this version. They cannot author prerequisites, structured costs, target models, restrictions, operation references, cooldowns, charges, or mastery policy.
- requireUniqueTitles controls whether authored room-local definitions may reuse the same visible title.
- Allowed definition types: ${ABILITY_SPELL_TYPES.join(", ")}.
- Do not add actor known/unlocked state, current mastery, cooldown remaining, current charges, current resource balances, temporary modifiers, actor state, participant IDs, owner IDs, namespaces, revisions, or mutation history.
- Costs are declarative Ability/Spell use requirements. Authoring a profile does not itself mutate runtime state.
- Legacy ${ABILITY_SPELL_OPERATION_REFERENCE_VERSION} operation references remain non-executable and preserve existing authored content.
- Executable ${ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION} references may run only after Crestfall reaches the trusted Ability/Spell authorization and committed-use boundary. Authoring or loading the profile alone never executes them.
- Every executable v1 reference must provide a typed domain, operation, exact executor version, targetBinding, and an arguments object.
- Executable target binding uses ${ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION} and one of: ${ABILITY_SPELL_OPERATION_TARGET_BINDING_MODES.join(", ")}. Unsupported domain/operation/version/target combinations fail closed at runtime.
- Do not convert an existing v0 reference to v1 merely to make it executable; use v1 only when the authored operation is intentionally configured for execution.
- Rules Codex remains interpretation-only and must not become mechanical authority.
- Do not add global natural-language spell or ability commands. Creator-authored Mechanics commands/triggers own invocation language.
- Provider prose never becomes mechanical authority. Runtime execution, cooldown ticking, charge spending, resource mutation, and downstream typed operations remain owned by their authoritative Crestfall services.
- Keep all contract/version fields intact.
- IDs use lowercase letters, numbers, dots, colons, underscores, or hyphens.
- Use Validate & Apply after pasting JSON. The normal page Save action still controls persistence.

## Current complete profile
${current}
`;
}
