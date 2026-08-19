import {
  STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
  STORY_CHARACTER_LIFECYCLE_AUTHORING_KINDS,
} from "../../room-templates/story-character-lifecycle-authoring/StoryCharacterLifecycleAuthoring.contract.js";

export const STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION =
  "story_character_lifecycle_runtime.presentation.v1";

export const STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION =
  "story_character_lifecycle_release_v0";

export const STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS = Object.freeze({
  STORY_PINNED: "STORY_PINNED",
  OPENING_TEMPORARY: "OPENING_TEMPORARY",
  TEMPORARY: "TEMPORARY",
});

export const STORY_CHARACTER_RUNTIME_RELEASE_POLICIES = Object.freeze({
  NEVER: "NEVER",
  INITIAL_PHASE_EXIT: "INITIAL_PHASE_EXIT",
  STORY_COMPLETED: "STORY_COMPLETED",
  EXPLICIT_SIGNAL: "EXPLICIT_SIGNAL",
});

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeKind(value) {
  const normalized = upper(value);

  return Object.values(
    STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS
  ).includes(normalized)
    ? normalized
    : STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.STORY_PINNED;
}

function normalizeReleasePolicy(value, lifecycleKind) {
  const normalized = upper(value);

  if (
    Object.values(
      STORY_CHARACTER_RUNTIME_RELEASE_POLICIES
    ).includes(normalized)
  ) {
    return normalized;
  }

  if (
    lifecycleKind ===
    STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.OPENING_TEMPORARY
  ) {
    return STORY_CHARACTER_RUNTIME_RELEASE_POLICIES.INITIAL_PHASE_EXIT;
  }

  if (
    lifecycleKind ===
    STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.TEMPORARY
  ) {
    return STORY_CHARACTER_RUNTIME_RELEASE_POLICIES.EXPLICIT_SIGNAL;
  }

  return STORY_CHARACTER_RUNTIME_RELEASE_POLICIES.NEVER;
}

function lifecycleLabel(kind) {
  switch (kind) {
    case STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.OPENING_TEMPORARY:
      return "Opening Only";
    case STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.TEMPORARY:
      return "Temporary Story Cast";
    default:
      return "Persistent Story Cast";
  }
}

function releasePolicyLabel(policy) {
  switch (policy) {
    case STORY_CHARACTER_RUNTIME_RELEASE_POLICIES.INITIAL_PHASE_EXIT:
      return "Releases after the opening phase";
    case STORY_CHARACTER_RUNTIME_RELEASE_POLICIES.STORY_COMPLETED:
      return "Releases when the Story completes";
    case STORY_CHARACTER_RUNTIME_RELEASE_POLICIES.EXPLICIT_SIGNAL:
      return "Releases on an explicit Story signal";
    default:
      return "Remains active until another Story/runtime system changes presence";
  }
}

function releaseReasonCopy(reason) {
  switch (upper(reason)) {
    case "INITIAL_PHASE_STILL_ACTIVE":
      return "Opening phase is still active.";
    case "INITIAL_PHASE_EXIT_APPLIED":
      return "Opening phase has exited; this character is ready to release.";
    case "STORY_STILL_ACTIVE":
      return "Story is still active.";
    case "STORY_COMPLETED":
      return "Story has completed; this character is ready to release.";
    case "RELEASE_SIGNAL_PENDING":
      return "Waiting for the configured release signal.";
    case "EXPLICIT_RELEASE_SIGNAL_MATCHED":
      return "Configured release signal matched; this character is ready to release.";
    case "RELEASE_POLICY_NEVER":
      return "This character is persistent Story cast.";
    case "PARTICIPANT_ALREADY_INACTIVE":
      return "This character is already inactive.";
    case "LIFECYCLE_ALREADY_RELEASED":
      return "This character has already been released.";
    case "RELEASE_PHASE_REQUIRED":
      return "Release phase metadata is incomplete.";
    case "RELEASE_POLICY_INVALID":
      return "Release policy metadata is invalid.";
    default:
      return "";
  }
}

export function projectStoryCharacterLifecycleRuntimeParticipant({
  participant = {},
  releaseEvaluation = null,
} = {}) {
  const source = object(participant);
  const metadata = object(source.metadata);
  const evaluation = object(releaseEvaluation);

  const lifecycleKind = normalizeKind(
    metadata.lifecycleKind ||
      metadata.lifecycle_kind ||
      metadata.loadPolicy ||
      metadata.load_policy
  );

  const releasePolicy = normalizeReleasePolicy(
    metadata.releasePolicy ||
      metadata.release_policy,
    lifecycleKind
  );

  const lifecycleStatus =
    upper(metadata.lifecycleStatus) || "ACTIVE";
  const isReleased =
    lifecycleStatus === "RELEASED" ||
    source.isActive === false;

  const shouldRelease =
    evaluation.shouldRelease === true &&
    !isReleased;

  const releaseReady = shouldRelease;
  const releaseReason =
    text(evaluation.reason) ||
    text(metadata.lifecycleReleaseReason);

  const stateLabel = isReleased
    ? "Released"
    : releaseReady
      ? "Release ready"
      : "Active";

  const stateTone = isReleased
    ? "QUIET"
    : releaseReady
      ? "CAUTION"
      : "ACTIVE";

  return {
    participantId: text(source.id),
    creationId: text(source.creationId),
    participantType:
      upper(source.participantType) || "CHARACTER",
    name:
      text(source.name) ||
      text(source.title) ||
      "Unnamed Character",

    authoringContractVersion:
      text(
        metadata.storyCharacterLifecycleContractVersion
      ) ||
      STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,

    lifecycleKind,
    lifecycleLabel:
      lifecycleLabel(lifecycleKind),

    loadPolicy:
      upper(metadata.loadPolicy) ||
      (
        lifecycleKind ===
        STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.OPENING_TEMPORARY
          ? "STORY_OPENING_TEMPORARY"
          : lifecycleKind ===
              STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.TEMPORARY
            ? "STORY_TEMPORARY"
            : "STORY_PINNED"
      ),

    requiredAtStoryBoot:
      metadata.requiredAtStoryBoot !== false &&
      lifecycleKind !==
        STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.TEMPORARY,

    releasePolicy,
    releasePolicyLabel:
      releasePolicyLabel(releasePolicy),
    releasePhaseDefinitionId:
      text(metadata.releasePhaseDefinitionId) || null,
    releaseSignalKey:
      text(metadata.releaseSignalKey) || null,

    lifecycleStatus,
    isActive: source.isActive === true && !isReleased,
    isReleased,
    releaseReady,

    stateLabel,
    stateTone,

    releaseReason:
      releaseReason || null,
    releaseReasonMessage:
      releaseReasonCopy(releaseReason),

    releasedAtTurn:
      numberOrNull(
        metadata.lifecycleReleasedAtTurn
      ),
    releaseVersion:
      text(metadata.lifecycleReleaseVersion) || null,
    releaseEvidence:
      object(metadata.lifecycleReleaseEvidence),

    evaluation: releaseEvaluation
      ? {
          version:
            text(evaluation.version) ||
            STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION,
          eligible:
            evaluation.eligible === true,
          shouldRelease:
            evaluation.shouldRelease === true,
          reason:
            text(evaluation.reason) || null,
          evidence:
            object(evaluation.evidence),
        }
      : null,
  };
}

export function projectStoryCharacterLifecycleRuntimePresentation({
  participants = [],
  releaseEvaluationsByParticipantId = {},
} = {}) {
  const evaluations = object(
    releaseEvaluationsByParticipantId
  );

  const storyCharacters = (
    Array.isArray(participants)
      ? participants
      : []
  )
    .filter(
      (participant) =>
        upper(participant?.participantType) === "CHARACTER" &&
        text(
          participant?.metadata
            ?.storyCharacterLifecycleContractVersion
        )
    )
    .map((participant) =>
      projectStoryCharacterLifecycleRuntimeParticipant({
        participant,
        releaseEvaluation:
          evaluations[String(participant.id)] || null,
      })
    );

  return {
    contractVersion:
      STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,
    authoringContractVersion:
      STORY_CHARACTER_LIFECYCLE_AUTHORING_CONTRACT_VERSION,
    releaseContractVersion:
      STORY_CHARACTER_LIFECYCLE_RELEASE_VERSION,

    participants: storyCharacters,

    summary: {
      storyCharacterCount:
        storyCharacters.length,
      activeCount:
        storyCharacters.filter(
          (character) => character.isActive
        ).length,
      persistentCount:
        storyCharacters.filter(
          (character) =>
            character.lifecycleKind ===
            STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.STORY_PINNED
        ).length,
      openingOnlyCount:
        storyCharacters.filter(
          (character) =>
            character.lifecycleKind ===
            STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.OPENING_TEMPORARY
        ).length,
      temporaryCount:
        storyCharacters.filter(
          (character) =>
            character.lifecycleKind ===
            STORY_CHARACTER_RUNTIME_LIFECYCLE_KINDS.TEMPORARY
        ).length,
      releaseReadyCount:
        storyCharacters.filter(
          (character) => character.releaseReady
        ).length,
      releasedCount:
        storyCharacters.filter(
          (character) => character.isReleased
        ).length,
    },

    architecture: {
      lifecycleNormalizationOwnedByChassis: true,
      releaseEvaluationOwnedByChassis: true,
      participantMutationOwnedByChassis: true,
      phaseTransitionAuthorityOwnedByChassis: true,
      explicitReleaseSignalAuthorityOwnedByChassis: true,
      castLifecyclePresentationOwnedByFe: true,
      lightweightNpcLifecycleExcluded: true,
    },
  };
}
