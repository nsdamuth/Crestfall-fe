export const storyCharacterLifecycleRuntimeParticipantsFixture =
  Object.freeze([
    {
      id: "participant-pinned",
      creationId: "creation-mira",
      participantType: "CHARACTER",
      name: "Mira Quill",
      isActive: true,
      metadata: {
        storyCharacterLifecycleContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "STORY_PINNED",
        lifecycleStatus: "ACTIVE",
        loadPolicy: "STORY_PINNED",
        requiredAtStoryBoot: true,
        releasePolicy: "NEVER",
        releasePhaseDefinitionId: null,
        releaseSignalKey: null,
      },
    },
    {
      id: "participant-opening",
      creationId: "creation-courier",
      participantType: "CHARACTER",
      name: "Gate Courier",
      isActive: true,
      metadata: {
        storyCharacterLifecycleContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "OPENING_TEMPORARY",
        lifecycleStatus: "ACTIVE",
        loadPolicy: "STORY_OPENING_TEMPORARY",
        requiredAtStoryBoot: true,
        releasePolicy: "INITIAL_PHASE_EXIT",
        releasePhaseDefinitionId: "you",
        releaseSignalKey: null,
      },
    },
    {
      id: "participant-temporary",
      creationId: "creation-guide",
      participantType: "CHARACTER",
      name: "Archive Guide",
      isActive: true,
      metadata: {
        storyCharacterLifecycleContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "TEMPORARY",
        lifecycleStatus: "ACTIVE",
        loadPolicy: "STORY_TEMPORARY",
        requiredAtStoryBoot: false,
        releasePolicy: "EXPLICIT_SIGNAL",
        releasePhaseDefinitionId: null,
        releaseSignalKey: "guide.complete",
      },
    },
    {
      id: "participant-released",
      creationId: "creation-witness",
      participantType: "CHARACTER",
      name: "Opening Witness",
      isActive: false,
      isDefault: false,
      metadata: {
        storyCharacterLifecycleContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "OPENING_TEMPORARY",
        lifecycleStatus: "RELEASED",
        loadPolicy: "STORY_OPENING_TEMPORARY",
        requiredAtStoryBoot: true,
        releasePolicy: "INITIAL_PHASE_EXIT",
        releasePhaseDefinitionId: "you",
        lifecycleReleaseVersion:
          "story_character_lifecycle_release_v0",
        lifecycleReleaseReason:
          "INITIAL_PHASE_EXIT_APPLIED",
        lifecycleReleasedAtTurn: 8,
        lifecycleReleaseEvidence: {
          releasePhaseDefinitionId: "you",
          releasePhaseStatus: "COMPLETED",
          activePhaseDefinitionId: "need",
          terminalPhaseObserved: true,
          transitionObserved: true,
        },
      },
    },
    {
      id: "participant-player",
      creationId: "pc-rowan",
      participantType: "PLAYER_CHARACTER",
      name: "Rowan",
      isActive: true,
      metadata: {},
    },
    {
      id: "participant-registry-npc",
      creationId: "npc-lightweight",
      participantType: "CHARACTER",
      name: "Lightweight NPC",
      isActive: true,
      metadata: {
        registryNpcParticipantLifecycleVersion:
          "registry_npc_participant_lifecycle_v2",
        loadPolicy: "REGISTRY_SCENE_MANAGED",
      },
    },
  ]);

export const storyCharacterLifecycleRuntimeStillOpeningEvaluationsFixture =
  Object.freeze({
    "participant-pinned": {
      version: "story_character_lifecycle_release_v0",
      eligible: true,
      shouldRelease: false,
      reason: "RELEASE_POLICY_NEVER",
      evidence: null,
    },
    "participant-opening": {
      version: "story_character_lifecycle_release_v0",
      eligible: true,
      shouldRelease: false,
      reason: "INITIAL_PHASE_STILL_ACTIVE",
      evidence: {
        releasePhaseDefinitionId: "you",
        releasePhaseStatus: "ACTIVE",
        activePhaseDefinitionId: "you",
        terminalPhaseObserved: false,
        transitionObserved: false,
      },
    },
    "participant-temporary": {
      version: "story_character_lifecycle_release_v0",
      eligible: true,
      shouldRelease: false,
      reason: "RELEASE_SIGNAL_PENDING",
      evidence: {
        releaseSignalKey: "guide.complete",
        matchedSignalKey: null,
      },
    },
  });

export const storyCharacterLifecycleRuntimeOpeningExitedEvaluationsFixture =
  Object.freeze({
    ...storyCharacterLifecycleRuntimeStillOpeningEvaluationsFixture,
    "participant-opening": {
      version: "story_character_lifecycle_release_v0",
      eligible: true,
      shouldRelease: true,
      reason: "INITIAL_PHASE_EXIT_APPLIED",
      evidence: {
        releasePhaseDefinitionId: "you",
        releasePhaseStatus: "COMPLETED",
        activePhaseDefinitionId: "need",
        terminalPhaseObserved: true,
        transitionObserved: true,
      },
    },
  });

export const storyCharacterLifecycleRuntimeExplicitSignalEvaluationsFixture =
  Object.freeze({
    ...storyCharacterLifecycleRuntimeStillOpeningEvaluationsFixture,
    "participant-temporary": {
      version: "story_character_lifecycle_release_v0",
      eligible: true,
      shouldRelease: true,
      reason: "EXPLICIT_RELEASE_SIGNAL_MATCHED",
      evidence: {
        releaseSignalKey: "guide.complete",
        matchedSignalKey: "guide.complete",
      },
    },
  });

export const storyCharacterLifecycleRuntimeInvalidMetadataFixture =
  Object.freeze({
    participants: [
      {
        id: "participant-invalid",
        creationId: "creation-invalid",
        participantType: "CHARACTER",
        name: "Invalid Lifecycle",
        isActive: true,
        metadata: {
          storyCharacterLifecycleContractVersion:
            "story_character_lifecycle_v0",
          lifecycleKind: "OPENING_TEMPORARY",
          lifecycleStatus: "ACTIVE",
          releasePolicy: "NOT_REAL",
        },
      },
    ],
    releaseEvaluationsByParticipantId: {
      "participant-invalid": {
        version:
          "story_character_lifecycle_release_v0",
        eligible: true,
        shouldRelease: false,
        reason: "RELEASE_POLICY_INVALID",
        evidence: null,
      },
    },
  });
