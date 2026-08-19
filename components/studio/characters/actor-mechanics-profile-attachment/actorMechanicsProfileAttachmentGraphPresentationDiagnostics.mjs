import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_AUTHORITIES,
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_CALLBACK_KEYS,
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_STATES,
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_PRESENTATION_CONTRACT_VERSION,
  projectActorMechanicsProfileAttachmentGraphPresentation,
} from "./ActorMechanicsProfileAttachmentGraphPresentation.contract.js";

import {
  actorMechanicsProfileAttachmentGraphBeyondScaleFixture,
  actorMechanicsProfileAttachmentGraphCompatibilityErrorFixture,
  actorMechanicsProfileAttachmentGraphDisabledFixture,
  actorMechanicsProfileAttachmentGraphPendingPlaceholderFixture,
  actorMechanicsProfileAttachmentGraphPendingRemovalFixture,
  actorMechanicsProfileAttachmentGraphPendingSelectionFixture,
  actorMechanicsProfileAttachmentGraphSavedFixture,
} from "./ActorMechanicsProfileAttachmentGraphPresentation.fixtures.js";

assert.equal(
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_CONTRACT_VERSION,
  "actor_mechanics_profile_attachment_graph_v0"
);
assert.equal(
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_CONTRACT_VERSION,
  "actor_mechanics_profile_attachment_draft_v0"
);

assert.deepEqual(
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_AUTHORITIES,
  {
    GRAPH: "CREATION_GRAPH",
    UNSAVED_DRAFT: "UNSAVED_DRAFT",
    UNSAVED_PICKER_SELECTION:
      "UNSAVED_PICKER_SELECTION",
    NONE: "NONE",
  }
);

assert.deepEqual(
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_STATES,
  {
    NONE: "NONE",
    PENDING_LINK: "PENDING_LINK",
    PENDING_REMOVAL: "PENDING_REMOVAL",
  }
);

const saved =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphSavedFixture
  );

assert.equal(
  saved.contractVersion,
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_PRESENTATION_CONTRACT_VERSION
);
assert.deepEqual(saved.chassisContracts, {
  graph:
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_CONTRACT_VERSION,
  draft:
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_CONTRACT_VERSION,
});
assert.equal(
  saved.attachmentAuthority,
  "CREATION_GRAPH"
);
assert.equal(
  saved.attachmentAuthorityLabel,
  "Saved graph relationship"
);
assert.equal(
  saved.attachment.title,
  "Full Adventurer Profile"
);
assert.equal(
  saved.attachment.ownerLabel,
  "Player Character template"
);
assert.equal(
  saved.attachment.presetLabel,
  "Full Player Character"
);
assert.deepEqual(
  saved.attachment.enabledDomainLabels,
  [
    "Stats",
    "Progression",
    "Skills",
    "Magic",
    "Abilities",
    "Wallet",
    "Inventory",
  ]
);
assert.equal(saved.draftState, "NONE");
assert.equal(saved.draftMessage, "");
assert.equal(saved.errorMessage, "");
assert.equal(saved.warningMessage, "");
assert.deepEqual(
  saved.picker.selectedCreationIds,
  ["profile-1"]
);
assert.equal(
  saved.picker.compatibilityAuthority,
  "CHASSIS_APPLICATION_VIEWMODEL"
);
assert.match(
  saved.runtimeNote,
  /saved relationship is graph-authoritative/i
);
assert.match(
  saved.runtimeNote,
  /resolved from the linked creation instead of copied/i
);

const pending =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphPendingSelectionFixture
  );

assert.equal(
  pending.attachmentAuthority,
  "UNSAVED_PICKER_SELECTION"
);
assert.equal(
  pending.attachmentAuthorityLabel,
  "Unsaved picker selection"
);
assert.equal(pending.draftState, "PENDING_LINK");
assert.equal(
  pending.draftMessage,
  "This attachment change is not saved yet."
);
assert.deepEqual(
  pending.attachment.enabledDomainLabels,
  [
    "Stats Pools",
    "Skills",
    "Ability Spell",
  ]
);

const placeholder =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphPendingPlaceholderFixture
  );

assert.equal(
  placeholder.attachmentAuthority,
  "UNSAVED_DRAFT"
);
assert.equal(
  placeholder.attachment.title,
  "Pending Actor Mechanics Profile"
);
assert.equal(
  placeholder.attachment.notes,
  "Preserve these relationship notes."
);

const removal =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphPendingRemovalFixture
  );

assert.equal(removal.attachment, null);
assert.equal(
  removal.attachmentAuthority,
  "NONE"
);
assert.equal(
  removal.draftState,
  "PENDING_REMOVAL"
);
assert.equal(
  removal.draftMessage,
  "This attachment will be removed when the actor is saved."
);
assert.deepEqual(
  removal.picker.selectedCreationIds,
  []
);

const beyond =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphBeyondScaleFixture
  );

assert.equal(
  beyond.attachment.ownerLabel,
  "Bound Character"
);
assert.equal(
  beyond.attachment.presetLabel,
  "Beyond Scale"
);
assert.equal(
  beyond.warningMessage,
  "Beyond Scale profiles only permit ordinary opposed resolution through an explicit working mode."
);

const incompatible =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphCompatibilityErrorFixture
  );

assert.equal(
  incompatible.errorMessage,
  "That profile targets a Player Character and cannot be attached to this Character."
);
assert.equal(
  incompatible.picker.compatibilityRulesSummary.length,
  3
);
assert.match(
  incompatible.picker.compatibilityRulesSummary[0],
  /saved Actor Mechanics Profile contract/i
);
assert.match(
  incompatible.picker.compatibilityRulesSummary[1],
  /must match Character/i
);
assert.match(
  incompatible.picker.compatibilityRulesSummary[2],
  /already bound to this actor/i
);

const disabled =
  projectActorMechanicsProfileAttachmentGraphPresentation(
    actorMechanicsProfileAttachmentGraphDisabledFixture
  );
assert.equal(disabled.disabled, true);

assert.deepEqual(
  saved.architecture,
  {
    graphAuthorityOwnedByChassis: true,
    draftPersistenceOwnedByChassis: true,
    profileResolutionOwnedByChassis: true,
    compatibilityEnforcementOwnedByChassis: true,
    mutableActorStateExcludedFromAttachment: true,
    lightweightNpcEntryUsesSeparateEmbeddedContract: true,
  }
);

assert.deepEqual(
  ACTOR_MECHANICS_PROFILE_ATTACHMENT_CALLBACK_KEYS,
  [
    "onOpenPicker",
    "onRemoveAttachment",
    "onChangeAttachmentNotes",
  ]
);

const source = fs.readFileSync(
  new URL(
    "./ActorMechanicsProfileAttachmentGraphPresentation.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "updateDataField",
  "getGraphProjection",
  "getDraft(",
  "getCompatibilityError",
  "buildDraft(",
  "useActorMechanicsProfileAttachmentSectionViewModel",
  "actorMechanicsProfileAttachmentGraph",
  "actorMechanicsProfileAttachmentDraft",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "actor_mechanics_profile_attachment_graph_fe_presentation_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_PRESENTATION_CONTRACT_VERSION,
  graphContractVersion:
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_GRAPH_CONTRACT_VERSION,
  draftContractVersion:
    ACTOR_MECHANICS_PROFILE_ATTACHMENT_DRAFT_CONTRACT_VERSION,
  savedGraphAuthorityCovered: true,
  unsavedPickerSelectionCovered: true,
  pendingDraftPlaceholderCovered: true,
  pendingRemovalCovered: true,
  beyondScaleWarningCovered: true,
  compatibilityErrorPresentationCovered: true,
  chassisGraphResolutionExcluded: true,
  chassisDraftPersistenceExcluded: true,
  chassisCompatibilityEnforcementExcluded: true,
}, null, 2));
