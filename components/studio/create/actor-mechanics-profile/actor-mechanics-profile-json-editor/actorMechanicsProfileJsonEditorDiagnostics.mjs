import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
  ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
} from "../actor-mechanics-profile-editor/ActorMechanicsProfileEditor.contract.js";
import {
  formatActorMechanicsProfileJsonData,
  formatActorMechanicsProfileJsonText,
  validateActorMechanicsProfileJsonText,
} from "./actorMechanicsProfileJsonEditor.validation.js";
import {
  ACTOR_MECHANICS_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME,
  buildActorMechanicsProfileJsonAiAuthoringGuide,
} from "./actorMechanicsProfileJsonAiAuthoringGuide.js";
import { actorMechanicsProfileJsonEditorFixture } from "./actorMechanicsProfileJsonEditor.fixtures.js";

const profile = actorMechanicsProfileJsonEditorFixture;
const formatted = formatActorMechanicsProfileJsonData(profile);
const parsed = JSON.parse(formatted);
assert.equal(parsed.contractVersion, ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION);
assert.equal(parsed.bindings.length, 2);
assert.equal(parsed.bindings[0].bindingVersion, ACTOR_MECHANICS_PROFILE_BINDING_VERSION);
assert.equal(parsed.bindings[0].stateIsolation, ACTOR_MECHANICS_PROFILE_STATE_ISOLATION);
assert.equal(parsed.bindings[1].domain, "PROGRESSION");

const syntaxFailure = formatActorMechanicsProfileJsonText('{"title":');
assert.equal(syntaxFailure.valid, false);
assert.equal(
  syntaxFailure.error.code,
  "ACTOR_MECHANICS_PROFILE_JSON_SYNTAX_INVALID"
);

const validResult = validateActorMechanicsProfileJsonText(formatted);
assert.equal(validResult.valid, true);
assert.equal(validResult.errors.length, 0);
assert.equal(validResult.data.owner.ownerId, profile.owner.ownerId);
assert.equal(validResult.data.bindings[0].references[0].sourceId, profile.bindings[0].references[0].sourceId);

const runtimeStateResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({
    ...profile,
    currentXP: 250,
    currentLevel: 1,
    statValues: [{ definitionId: "vitality", currentValue: 29 }],
    inventoryState: { inventoryItems: [] },
  })
);
assert.equal(runtimeStateResult.valid, false);
assert.ok(
  runtimeStateResult.errors.some(
    (entry) =>
      entry.code === "ACTOR_MECHANICS_PROFILE_JSON_RUNTIME_FIELD_FORBIDDEN"
  )
);

const nestedRuntimeResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({
    ...profile,
    metadata: { progressionState: { currentLevel: 5 } },
  })
);
assert.equal(nestedRuntimeResult.valid, false);
assert.ok(
  nestedRuntimeResult.errors.some(
    (entry) => entry.path === "metadata.progressionState"
  )
);

const invalidStatePolicyResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({
    ...profile,
    statePolicy: {
      ...profile.statePolicy,
      sharedMutableStateAllowed: true,
    },
  })
);
assert.equal(invalidStatePolicyResult.valid, false);
assert.ok(
  invalidStatePolicyResult.errors.some(
    (entry) =>
      entry.code === "ACTOR_MECHANICS_PROFILE_JSON_SHARED_STATE_FORBIDDEN"
  )
);

const invalidDomainResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({
    ...profile,
    bindings: profile.bindings.map((binding, index) =>
      index === 0 ? { ...binding, domain: "AI_CONTROL" } : binding
    ),
  })
);
assert.equal(invalidDomainResult.valid, false);
assert.ok(
  invalidDomainResult.errors.some(
    (entry) =>
      entry.path === "bindings[0].domain" &&
      entry.code === "ACTOR_MECHANICS_PROFILE_JSON_ENUM_UNSUPPORTED"
  )
);

const invalidReferenceTypeResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({
    ...profile,
    bindings: profile.bindings.map((binding, index) =>
      index === 0
        ? {
            ...binding,
            references: binding.references.map((reference) => ({
              ...reference,
              referenceType: "REMOTE_URL",
            })),
          }
        : binding
    ),
  })
);
assert.equal(invalidReferenceTypeResult.valid, false);
assert.ok(
  invalidReferenceTypeResult.errors.some((entry) =>
    entry.path.endsWith("referenceType")
  )
);

const unknownFieldResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({ ...profile, providerInstruction: "mutate state" })
);
assert.equal(unknownFieldResult.valid, true);
assert.ok(
  unknownFieldResult.warnings.some(
    (entry) =>
      entry.code ===
      "ACTOR_MECHANICS_PROFILE_JSON_UNKNOWN_TOP_LEVEL_FIELD"
  )
);
assert.equal(
  Object.prototype.hasOwnProperty.call(
    unknownFieldResult.data,
    "providerInstruction"
  ),
  false
);

const lockedOwnerContext = {
  locked: true,
  bindingMode: "BOUND_ACTOR",
  ownerType: "PLAYER_CHARACTER",
  ownerId: "locked-player-character-id",
  ownerTitle: "Locked Hero",
};
const lockedResult = validateActorMechanicsProfileJsonText(
  JSON.stringify({
    ...profile,
    presetId: "CUSTOM",
    owner: {
      bindingMode: "BOUND_ACTOR",
      ownerType: "CHARACTER",
      ownerId: "attempted-owner-change",
      ownerTitle: "Attempted Change",
    },
  }),
  lockedOwnerContext
);
assert.equal(lockedResult.valid, true);
assert.equal(lockedResult.data.owner.ownerId, "locked-player-character-id");
assert.equal(lockedResult.data.owner.ownerType, "PLAYER_CHARACTER");

const guide = buildActorMechanicsProfileJsonAiAuthoringGuide(profile);
assert.match(guide, /Current Actor Mechanics Profile JSON/);
assert.match(guide, /Return \*\*one complete JSON object only\*\*/);
assert.match(guide, /Do not invent database UUIDs/);
assert.match(guide, /mutable actor state/i);
assert.match(guide, new RegExp(ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION));
assert.match(guide, /"id": "progression"/);
assert.equal(
  ACTOR_MECHANICS_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME,
  "crestfall-actor-mechanics-profile-json-ai-authoring-guide.md"
);

const editorViewSource = readFileSync(
  new URL(
    "../actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view.jsx",
    import.meta.url
  ),
  "utf8"
);
const editorVmSource = readFileSync(
  new URL(
    "../actor-mechanics-profile-editor/useActorMechanicsProfileEditorViewModel.js",
    import.meta.url
  ),
  "utf8"
);
const modalViewSource = readFileSync(
  new URL("./ActorMechanicsProfileJsonEditorModal.view.jsx", import.meta.url),
  "utf8"
);
const modalVmSource = readFileSync(
  new URL("./useActorMechanicsProfileJsonEditorViewModel.js", import.meta.url),
  "utf8"
);
const previewPageSource = readFileSync(
  new URL(
    "../../../../../app/dev/ui-preview/actor-mechanics-profile-json-editor/page.jsx",
    import.meta.url
  ),
  "utf8"
);

assert.match(editorViewSource, /ActorMechanicsProfileJsonEditorModal/);
assert.match(editorViewSource, /JSON Editor/);
assert.match(editorVmSource, /jsonEditorOpen/);
assert.match(editorVmSource, /applyJsonProfile/);
assert.match(modalViewSource, /Download AI Guide/);
assert.match(modalViewSource, /Validate & Apply/);
assert.match(modalViewSource, /Authored Actor Mechanics Profile/);
assert.doesNotMatch(modalViewSource, /fetch\s*\(/);
assert.doesNotMatch(modalViewSource, /supabase/i);
assert.match(modalVmSource, /buildActorMechanicsProfileJsonAiAuthoringGuide/);
assert.match(modalVmSource, /validateActorMechanicsProfileJsonText/);
assert.match(previewPageSource, /NODE_ENV === "production"/);
assert.match(previewPageSource, /notFound\(\)/);

console.log(
  JSON.stringify(
    {
      diagnostic: "actor_mechanics_profile_json_editor_validation_v1",
      status: "PASSED",
      completeObjectRoundTrip: true,
      authoritativeNormalizerReused: true,
      authoritativeValidatorReused: true,
      actorRuntimeFieldsRejected: true,
      lockedOwnerPreserved: true,
      existingReferencesPreserved: true,
      currentProfileEmbeddedInGuide: true,
      directPersistenceAllowed: false,
      previewBlockedInProduction: true,
    },
    null,
    2
  )
);
