import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION,
} from "../StoryRoomCastPanel.contract.js";

import {
  STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,
} from "../../story-character-lifecycle-runtime/StoryCharacterLifecycleRuntimePresentation.contract.js";

import {
  STORY_ROOM_CAST_LIFECYCLE_BINDING_CONTRACT_VERSION,
  projectStoryRoomCastLifecycleBinding,
  projectStoryRoomCastLifecycleMember,
} from "./StoryRoomCastLifecycleBinding.contract.js";

import {
  storyRoomCastLifecycleBaseCastFixture,
  storyRoomCastLifecycleReleaseReadyRuntimeFixture,
  storyRoomCastLifecycleStillOpeningRuntimeFixture,
} from "./StoryRoomCastLifecycleBinding.fixtures.js";

assert.equal(
  STORY_ROOM_CAST_LIFECYCLE_BINDING_CONTRACT_VERSION,
  "story_room_cast_lifecycle_binding_v1"
);

const stillOpening =
  projectStoryRoomCastLifecycleBinding({
    castMembers:
      storyRoomCastLifecycleBaseCastFixture,
    lifecycleRuntimePresentation:
      storyRoomCastLifecycleStillOpeningRuntimeFixture,
  });

assert.equal(
  stillOpening.bindingContractVersion,
  STORY_ROOM_CAST_LIFECYCLE_BINDING_CONTRACT_VERSION
);
assert.equal(
  stillOpening.castPanelViewContractVersion,
  STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION
);
assert.equal(
  stillOpening.lifecycleRuntimePresentationContractVersion,
  STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION
);

assert.equal(stillOpening.castMembers.length, 6);
assert.equal(
  stillOpening.summary.castMemberCount,
  6
);
assert.equal(
  stillOpening.summary.lifecycleMemberCount,
  4
);
assert.equal(
  stillOpening.summary.persistentCount,
  1
);
assert.equal(
  stillOpening.summary.openingOnlyCount,
  2
);
assert.equal(
  stillOpening.summary.temporaryCount,
  1
);
assert.equal(
  stillOpening.summary.releaseReadyCount,
  0
);
assert.equal(
  stillOpening.summary.releasedCount,
  1
);

const narrator =
  stillOpening.castMembers.find(
    (member) => member.id === "narrator"
  );

assert.equal(narrator.lifecycle, null);
assert.equal(narrator.state, "Active");
assert.equal(
  narrator.selectionLabel,
  "Next responder"
);
assert.equal(narrator.selectable, true);
assert.equal(narrator.selected, true);

const pinned =
  stillOpening.castMembers.find(
    (member) =>
      member.id === "participant-pinned"
  );

assert.equal(
  pinned.state,
  "Active · Persistent Story Cast · Active"
);
assert.match(
  pinned.note,
  /Knows who handled the bronze seal/
);
assert.match(
  pinned.note,
  /Remains active until another Story\/runtime system changes presence/
);
assert.match(
  pinned.note,
  /This character is persistent Story cast/
);
assert.equal(
  pinned.lifecycle.lifecycleKind,
  "STORY_PINNED"
);
assert.equal(
  pinned.lifecycle.stateTone,
  "ACTIVE"
);
assert.equal(pinned.selectable, true);
assert.equal(
  pinned.selectionLabel,
  "Select responder"
);

const opening =
  stillOpening.castMembers.find(
    (member) =>
      member.id === "participant-opening"
  );

assert.equal(
  opening.state,
  "Active · Opening Only · Active"
);
assert.match(
  opening.note,
  /Delivered the opening message/
);
assert.match(
  opening.note,
  /Releases after the opening phase/
);
assert.match(
  opening.note,
  /Opening phase is still active/
);
assert.equal(
  opening.lifecycle.releaseReady,
  false
);
assert.equal(opening.selectable, true);

const temporary =
  stillOpening.castMembers.find(
    (member) =>
      member.id === "participant-temporary"
  );

assert.equal(
  temporary.state,
  "Active · Temporary Story Cast · Active"
);
assert.match(
  temporary.note,
  /Releases on an explicit Story signal/
);
assert.match(
  temporary.note,
  /Waiting for the configured release signal/
);
assert.equal(temporary.selectable, false);
assert.equal(
  temporary.selectionLabel,
  "Not selectable"
);

const released =
  stillOpening.castMembers.find(
    (member) =>
      member.id === "participant-released"
  );

assert.equal(
  released.state,
  "Inactive · Opening Only · Released"
);
assert.match(
  released.note,
  /Stayed only for the opening exchange/
);
assert.match(
  released.note,
  /Released on turn 8/
);
assert.equal(
  released.lifecycle.isReleased,
  true
);
assert.equal(
  released.lifecycle.releaseVersion,
  "story_character_lifecycle_release_v0"
);
assert.equal(
  released.lifecycle.releaseEvidence
    .transitionObserved,
  true
);
assert.equal(released.isActive, false);
assert.equal(released.selectable, false);

const player =
  stillOpening.castMembers.find(
    (member) => member.id === "player"
  );

assert.equal(player.lifecycle, null);
assert.equal(
  player.state,
  "Player controlled"
);
assert.equal(
  player.selectionLabel,
  "Player-controlled"
);

const releaseReady =
  projectStoryRoomCastLifecycleBinding({
    castMembers:
      storyRoomCastLifecycleBaseCastFixture,
    lifecycleRuntimePresentation:
      storyRoomCastLifecycleReleaseReadyRuntimeFixture,
  });

const releaseReadyOpening =
  releaseReady.castMembers.find(
    (member) =>
      member.id === "participant-opening"
  );

assert.equal(
  releaseReadyOpening.state,
  "Active · Opening Only · Release ready"
);
assert.equal(
  releaseReadyOpening.lifecycle.stateTone,
  "CAUTION"
);
assert.equal(
  releaseReadyOpening.lifecycle.releaseReady,
  true
);
assert.match(
  releaseReadyOpening.note,
  /Opening phase has exited; this character is ready to release/
);

// FE must not invent responder eligibility from lifecycle state.
// Until Chassis rebuilds the cast after reconciliation, selection
// authority remains exactly what Chassis supplied.
assert.equal(
  releaseReadyOpening.selectable,
  true
);
assert.equal(
  releaseReadyOpening.selectionLabel,
  "Select responder"
);

const directNoLifecycle =
  projectStoryRoomCastLifecycleMember({
    castMember: {
      id: "ordinary",
      name: "Ordinary Cast Member",
      state: "Active",
      note: "Existing note",
      isActive: true,
      selectable: false,
      selected: false,
      selectionLabel: "Not selectable",
      selectionAriaLabel: "",
    },
    lifecycleParticipant: null,
  });

assert.equal(directNoLifecycle.lifecycle, null);
assert.equal(
  directNoLifecycle.state,
  "Active"
);
assert.equal(
  directNoLifecycle.note,
  "Existing note"
);

assert.deepEqual(
  stillOpening.functionalWiringStatus,
  {
    authoritativeParticipantSnapshotBridge:
      "WIRED",
    lifecycleRuntimeProjection:
      "WIRED",
    castPanelLifecycleBinding:
      "WIRED",
    clientReleaseEligibilityInference:
      "NOT_PERMITTED",
  }
);

assert.deepEqual(stillOpening.architecture, {
  responderEligibilityOwnedByChassis: true,
  selectedResponderOwnedByChassis: true,
  participantActiveStateOwnedByChassis: true,
  lifecycleReleaseEvaluationOwnedByChassis: true,
  lifecycleParticipantMutationOwnedByChassis: true,
  lifecyclePresentationOwnedByFe: true,
  castPanelVisualCompositionOwnedByFe: true,
  registryNpcLifecycleRemainsSeparate: true,
});

const source = fs.readFileSync(
  new URL(
    "./StoryRoomCastLifecycleBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "evaluateStoryCharacterLifecycleRelease",
  "reconcileStoryCharacterLifecycleProjection",
  "onSelectResponder",
  "isSelectableResponder",
  "selectedResponderId",
  "setSelectedResponder",
  "updateParticipant",
  "phaseInstances",
  "transitions",
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
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "story_room_cast_lifecycle_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STORY_ROOM_CAST_LIFECYCLE_BINDING_CONTRACT_VERSION,
  castPanelViewContractVersion:
    STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION,
  lifecycleRuntimePresentationContractVersion:
    STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,
  persistentOpeningTemporaryAndReleasedProjectionCovered: true,
  releaseReadyProjectionCovered: true,
  existingCastStateAndNoteCompositionCovered: true,
  narratorAndPlayerUnaffectedCovered: true,
  responderEligibilityPreservedFromChassis: true,
  authoritativeParticipantSnapshotBridgeWired: true,
  lifecycleRuntimeProjectionWired: true,
  castPanelLifecycleBindingWired: true,
  existingCastPanelViewUnmodified: true,
  castPanelViewModelWiredToAcceptedLifecycleContracts: true,
  clientReleaseEligibilityInferenceExcluded: true,
  chassisReleaseEvaluationAndMutationExcluded: true,
}, null, 2));
