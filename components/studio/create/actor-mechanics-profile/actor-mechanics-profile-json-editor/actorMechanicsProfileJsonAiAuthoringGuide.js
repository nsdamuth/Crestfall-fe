import {
  ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES,
  ACTOR_MECHANICS_PROFILE_BINDING_MODES,
  ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
  ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
  ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_DOMAINS,
  ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS,
  ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
  ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
  ACTOR_MECHANICS_PROFILE_PRESETS,
  ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES,
  ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
} from "../actor-mechanics-profile-editor/ActorMechanicsProfileEditor.contract.js";
import { normalizeActorMechanicsProfileEditorValue } from "../actor-mechanics-profile-editor/useActorMechanicsProfileEditorViewModel.js";

export const ACTOR_MECHANICS_PROFILE_JSON_AI_AUTHORING_GUIDE_VERSION =
  "actor_mechanics_profile_json_ai_authoring_guide_v1";
export const ACTOR_MECHANICS_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-actor-mechanics-profile-json-ai-authoring-guide.md";
export const ACTOR_MECHANICS_PROFILE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

function values(valuesList) {
  return valuesList.map((value) => `\`${value}\``).join(", ");
}

export function buildActorMechanicsProfileJsonAiAuthoringGuide(profile = {}) {
  const currentJson = JSON.stringify(
    normalizeActorMechanicsProfileEditorValue(profile),
    null,
    2
  );

  return `# Crestfall Actor Mechanics Profile JSON AI Authoring Guide

**Guide contract:** \`${ACTOR_MECHANICS_PROFILE_JSON_AI_AUTHORING_GUIDE_VERSION}\`

**Profile contract:** \`${ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION}\`

**Binding contract:** \`${ACTOR_MECHANICS_PROFILE_BINDING_VERSION}\`

## Your task

Modify the complete current Actor Mechanics Profile JSON at the end of this guide according to the creator's request.

Return **one complete JSON object only**. Do not return Markdown fences, commentary, explanations, summaries, or partial fragments. The creator will paste the result into Crestfall and choose **Validate & Apply**.

## Non-negotiable rules

- Preserve all existing content outside the requested changes.
- Preserve existing binding IDs and exact reference objects unless the creator explicitly asks to remove or replace them.
- Do not invent database UUIDs, creation IDs, owner IDs, registry IDs, built-in module IDs, private identifiers, or contract versions.
- Existing \`owner.ownerId\` and every reference \`sourceId\` may be reused exactly as supplied. New external references must first be selected through Crestfall's visual picker.
- This asset composes reusable definitions, activation policy, capability policy, and references. It does **not** store mutable actor state.
- Do not add XP, current level, stat values, pool values, wallet balances, inventory contents, active conditions/modifiers, cooldowns, unlocks, state revisions, mutation logs, or provider-authored values.
- Keep \`statePolicy.isolation\` exactly \`${ACTOR_MECHANICS_PROFILE_STATE_ISOLATION}\`.
- Keep \`statePolicy.namespaceStrategy\` exactly \`${ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE}\`.
- Keep \`statePolicy.sharedDefinitionsAllowed\` true and \`sharedMutableStateAllowed\` false.
- Keep each binding \`stateIsolation\` exactly \`${ACTOR_MECHANICS_PROFILE_STATE_ISOLATION}\`.
- Return arrays as arrays and objects as objects. Do not replace structural objects with prose.

## Allowed profile values

- \`presetId\`: ${values(ACTOR_MECHANICS_PROFILE_PRESETS)}
- \`owner.bindingMode\`: ${values(ACTOR_MECHANICS_PROFILE_BINDING_MODES)}
- \`owner.ownerType\`: ${values(ACTOR_MECHANICS_PROFILE_OWNER_TYPES)}
- \`capabilityPolicy.mode\`: ${values(ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES)}
- \`capabilityPolicy.opposedResolutionPolicy\`: ${values(ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES)}

## Binding rules

- Supported domains: ${values(ACTOR_MECHANICS_PROFILE_DOMAINS)}
- Supported activation modes: ${values(ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES)}
- Supported reference types: ${values(ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES)}
- Maximum bindings: ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxBindings}
- Maximum references per binding: ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxReferencesPerBinding}
- Maximum activation domains per binding: ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxActivationDomainsPerBinding}
- Binding IDs must be lowercase stable identifiers. Activation-domain values are uppercase identifiers.
- A \`CREATION\` reference points to a reusable Crestfall creation. A \`BUILTIN_MODULE\` reference points to a deterministic first-party module. A \`REGISTRY\` reference points to a shared registry/catalog.
- Do not copy definition contents into the profile. Bindings reference definitions; mutable actor state is created and owned elsewhere.

## Capability policy

- \`STANDARD\` profiles may use \`DETERMINISTIC\` or \`NARRATIVE_ONLY\` opposed resolution.
- \`BEYOND_SCALE\` capability must not use ordinary \`DETERMINISTIC\` opposed checks for unrestricted power.
- \`WORKING_MODE_ONLY\` requires a creator-authored restricted \`workingModeProfile\` description.

## Owner binding

- \`UNBOUND_TEMPLATE\` may omit \`ownerId\` and can be reused as a template.
- \`BOUND_ACTOR\` requires an existing exact \`ownerId\`.
- If the editor is opened in an owner-locked context, do not change the owner fields.

## Validation checklist

- The result is one complete JSON object.
- Contract and binding versions are unchanged.
- Every required structural object and array remains present.
- Existing owner/reference identifiers are preserved exactly unless the creator requested removal.
- No runtime state or invented identifier was added.
- The creator must still use the page-level **Save** action after **Validate & Apply**.

## Current Actor Mechanics Profile JSON

Use this as the source of truth. Return the complete updated replacement object.

\`\`\`json
${currentJson}
\`\`\`
`;
}
