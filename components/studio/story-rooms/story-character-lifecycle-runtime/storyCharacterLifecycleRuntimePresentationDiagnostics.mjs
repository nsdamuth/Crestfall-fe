import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS,
} from "../../room-templates/story-character-lifecycle-authoring/StoryCharacterLifecycleAuthoring.contract.js";

import {
  STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION,
  STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,
  STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS,
  STORY_CHARACTER_RUNTIME_RELEASE_POLICIES,
  projectStoryCharacterLifecycleRuntimeParticipant,
  projectStoryCharacterLifecycleRuntimePresentation,
} from "./StoryCharacterLifecycleRuntimePresentation.contract.js";

import {
  storyCharacterLifecycleRuntimeExplicitSignalEvaluationsFixture,
  storyCharacterLifecycleRuntimeInvalidMetadataFixture,
  storyCharacterLifecycleRuntimeOpeningExitedEvaluationsFixture,
  storyCharacterLifecycleRuntimeParticipantsFixture,
  storyCharacterLifecycleRuntimeStillOpeningEvaluationsFixture,
} from "./StoryCharacterLifecycleRuntimePresentation.fixtures.js";

assert.equal(
  STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION,
  "story_character_lifecycle_release_v0"
);

assert.deepEqual(
  STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS,
  {
    STORY_PINNED: "STORY_PINNED",
    OPENING_TEMPORARY: "OPENING_TEMPORARY",
    TEMPORARY: "TEMPORARY",
  }
);

assert.deepEqual(
  STORY_CHARACTER_RUNTIME_RELEASE_POLICIES,
  {
    NEVER: "NEVER",
    INITIAL_PHASE_EXIT: "INITIAL_PHASE_EXIT",
    STORY_COMPLETED: "STORY_COMPLETED",
    EXPLICIT_SIGNAL: "EXPLICIT_SIGNAL",
  }
);

assert.equal(
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.STORY_PINNED,
  STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.STORY_PINNED
);
assert.equal(
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS.OPENING_TEMPORARY,
  STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.OPENING_TEMPORARY
);

const stillOpening =
  projectStoryCharacterLifecycleRuntimePresentation({
    participants:
      storyCharacterLifecycleRuntimeParticipantsFixture,
    releaseEvaluationsByParticipantId:
      storyCharacterLifecycleRuntimeStillOpeningEvaluationsFixture,
  });

assert.equal(
  stillOpening.contractVersion,
  STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  stillOpening.authoringContractVersion,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION
);
assert.equal(
  stillOpening.releaseContractVersion,
  STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION
);

assert.equal(
  stillOpening.participants.length,
  4
);
assert.equal(
  stillOpening.summary.storyCharacterCount,
  4
);
assert.equal(stillOpening.summary.activeCount, 3);
assert.equal(stillOpening.summary.persistentCount, 1);
assert.equal(stillOpening.summary.openingOnlyCount, 2);
assert.equal(stillOpening.summary.temporaryCount, 1);
assert.equal(stillOpening.summary.releaseReadyCount, 0);
assert.equal(stillOpening.summary.releasedCount, 1);

const pinned = stillOpening.participants.find(
  (participant) =>
    participant.participantId === "participant-pinned"
);

assert.equal(
  pinned.lifecycleLabel,
  "Persistent Story Cast"
);
assert.equal(pinned.releasePolicy, "NEVER");
assert.equal(
  pinned.releasePolicyLabel,
  "Remains active until another Story/runtime system changes presence"
);
assert.equal(pinned.stateLabel, "Active");
assert.equal(pinned.stateTone, "ACTIVE");
assert.equal(
  pinned.releaseReasonMessage,
  "This character is persistent Story cast."
);
assert.equal(pinned.requiredAtStoryBoot, true);

const opening = stillOpening.participants.find(
  (participant) =>
    participant.participantId === "participant-opening"
);

assert.equal(opening.lifecycleLabel, "Opening Only");
assert.equal(
  opening.loadPolicy,
  "STORY_OPENING_TEMPORARY"
);
assert.equal(
  opening.releasePolicy,
  "INITIAL_PHASE_EXIT"
);
assert.equal(
  opening.releasePolicyLabel,
  "Releases after the opening phase"
);
assert.equal(
  opening.releasePhaseDefinitionId,
  "you"
);
assert.equal(opening.releaseReady, false);
assert.equal(
  opening.releaseReasonMessage,
  "Opening phase is still active."
);

const temporary = stillOpening.participants.find(
  (participant) =>
    participant.participantId === "participant-temporary"
);

assert.equal(
  temporary.lifecycleLabel,
  "Temporary Story Cast"
);
assert.equal(
  temporary.loadPolicy,
  "STORY_TEMPORARY"
);
assert.equal(
  temporary.releasePolicy,
  "EXPLICIT_SIGNAL"
);
assert.equal(
  temporary.releaseSignalKey,
  "guide.complete"
);
assert.equal(
  temporary.requiredAtStoryBoot,
  false
);
assert.equal(
  temporary.releaseReasonMessage,
  "Waiting for the configured release signal."
);

const released = stillOpening.participants.find(
  (participant) =>
    participant.participantId === "participant-released"
);

assert.equal(released.isReleased, true);
assert.equal(released.isActive, false);
assert.equal(released.stateLabel, "Released");
assert.equal(released.stateTone, "QUIET");
assert.equal(
  released.releaseVersion,
  STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION
);
assert.equal(released.releasedAtTurn, 8);
assert.equal(
  released.releaseReason,
  "INITIAL_PHASE_EXIT_APPLIED"
);
assert.equal(
  released.releaseEvidence.transitionObserved,
  true
);

assert.equal(
  stillOpening.participants.some(
    (participant) =>
      participant.participantId === "participant-player"
  ),
  false
);
assert.equal(
  stillOpening.participants.some(
    (participant) =>
      participant.participantId === "participant-registry-npc"
  ),
  false
);

const openingExited =
  projectStoryCharacterLifecycleRuntimePresentation({
    participants:
      storyCharacterLifecycleRuntimeParticipantsFixture,
    releaseEvaluationsByParticipantId:
      storyCharacterLifecycleRuntimeOpeningExitedEvaluationsFixture,
  });

const releaseReadyOpening =
  openingExited.participants.find(
    (participant) =>
      participant.participantId === "participant-opening"
  );

assert.equal(releaseReadyOpening.releaseReady, true);
assert.equal(
  releaseReadyOpening.stateLabel,
  "Release ready"
);
assert.equal(
  releaseReadyOpening.stateTone,
  "CAUTION"
);
assert.equal(
  releaseReadyOpening.releaseReasonMessage,
  "Opening phase has exited; this character is ready to release."
);
assert.equal(
  openingExited.summary.releaseReadyCount,
  1
);

const explicitSignal =
  projectStoryCharacterLifecycleRuntimePresentation({
    participants:
      storyCharacterLifecycleRuntimeParticipantsFixture,
    releaseEvaluationsByParticipantId:
      storyCharacterLifecycleRuntimeExplicitSignalEvaluationsFixture,
  });

const releaseReadyTemporary =
  explicitSignal.participants.find(
    (participant) =>
      participant.participantId === "participant-temporary"
  );

assert.equal(releaseReadyTemporary.releaseReady, true);
assert.equal(
  releaseReadyTemporary.releaseReasonMessage,
  "Configured release signal matched; this character is ready to release."
);

const invalid =
  projectStoryCharacterLifecycleRuntimePresentation(
    storyCharacterLifecycleRuntimeInvalidMetadataFixture
  );

assert.equal(invalid.participants.length, 1);
assert.equal(
  invalid.participants[0].releasePolicy,
  "INITIAL_PHASE_EXIT"
);
assert.equal(
  invalid.participants[0].releaseReason,
  "RELEASE_POLICY_INVALID"
);
assert.equal(
  invalid.participants[0].releaseReasonMessage,
  "Release policy metadata is invalid."
);

const direct = projectStoryCharacterLifecycleRuntimeParticipant({
  participant: {
    id: "participant-story-complete",
    creationId: "creation-story-complete",
    participantType: "CHARACTER",
    name: "Story Epilogue Guide",
    isActive: true,
    metadata: {
      storyCharacterLifecycleContractVersion:
        "story_character_lifecycle_v0",
      lifecycleKind: "TEMPORARY",
      lifecycleStatus: "ACTIVE",
      loadPolicy: "STORY_TEMPORARY",
      releasePolicy: "STORY_COMPLETED",
    },
  },
  releaseEvaluation: {
    version:
      "story_character_lifecycle_release_v0",
    eligible: true,
    shouldRelease: true,
    reason: "STORY_COMPLETED",
    evidence: {
      storyStatus: "COMPLETED",
      storyInstanceId: "story:1",
    },
  },
});

assert.equal(
  direct.releasePolicyLabel,
  "Releases when the Story completes"
);
assert.equal(direct.releaseReady, true);
assert.equal(
  direct.releaseReasonMessage,
  "Story has completed; this character is ready to release."
);

assert.deepEqual(stillOpening.architecture, {
  lifecycleNormalizationOwnedByChassis: true,
  releaseEvaluationOwnedByChassis: true,
  participantMutationOwnedByChassis: true,
  phaseTransitionAuthorityOwnedByChassis: true,
  explicitReleaseSignalAuthorityOwnedByChassis: true,
  castLifecyclePresentationOwnedByFe: true,
  lightweightNpcLifecycleExcluded: true,
});

const source = fs.readFileSync(
  new URL(
    "./StoryCharacterLifecycleRuntimePresentation.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "evaluateStoryCharacterLifecycleRelease",
  "buildStoryCharacterLifecycleReleasePatch",
  "reconcileStoryCharacterLifecycleProjection",
  "updateParticipant",
  "phaseInstances",
  "transitions",
  "explicitSignalKeys.includes",
  "services/api",
  "PostGraphile",
  "supabase",
  "@/lib/client",
  "fetch(",
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
    "story_character_lifecycle_runtime_fe_presentation_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,
  authoringContractVersion:
    STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
  releaseContractVersion:
    STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION,
  persistentRuntimeStateCovered: true,
  openingTemporaryRuntimeStateCovered: true,
  genericTemporaryRuntimeStateCovered: true,
  releaseReadyProjectionCovered: true,
  releasedStateAndEvidenceCovered: true,
  storyCompletedAndExplicitSignalPoliciesCovered: true,
  lightweightRegistryNpcLifecycleExcluded: true,
  chassisReleaseEvaluationExcluded: true,
  chassisParticipantMutationExcluded: true,
}, null, 2));
