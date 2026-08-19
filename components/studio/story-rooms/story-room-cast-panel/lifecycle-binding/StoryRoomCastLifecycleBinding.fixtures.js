export const storyRoomCastLifecycleBaseCastFixture =
  Object.freeze([
    {
      id: "narrator",
      name: "The Chronicler",
      avatarUrl: "",
      fallbackInitial: "T",
      role: "Narrator",
      state: "Active",
      note: "Frames the scene and manages transitions.",
      isActive: true,
      selectable: true,
      selected: true,
      selectionLabel: "Next responder",
      selectionAriaLabel:
        "Choose The Chronicler as the next responder",
    },
    {
      id: "participant-pinned",
      name: "Mira Quill",
      avatarUrl: "/fixtures/mira.webp",
      fallbackInitial: "M",
      role: "Night Clerk",
      state: "Active",
      note: "Knows who handled the bronze seal.",
      isActive: true,
      selectable: true,
      selected: false,
      selectionLabel: "Select responder",
      selectionAriaLabel:
        "Choose Mira Quill as the next responder",
    },
    {
      id: "participant-opening",
      name: "Gate Courier",
      avatarUrl: "",
      fallbackInitial: "G",
      role: "Courier",
      state: "Active",
      note: "Delivered the opening message.",
      isActive: true,
      selectable: true,
      selected: false,
      selectionLabel: "Select responder",
      selectionAriaLabel:
        "Choose Gate Courier as the next responder",
    },
    {
      id: "participant-temporary",
      name: "Archive Guide",
      avatarUrl: "",
      fallbackInitial: "A",
      role: "Guide",
      state: "Active",
      note: "",
      isActive: true,
      selectable: false,
      selected: false,
      selectionLabel: "Not selectable",
      selectionAriaLabel: "",
    },
    {
      id: "participant-released",
      name: "Opening Witness",
      avatarUrl: "",
      fallbackInitial: "O",
      role: "Witness",
      state: "Inactive",
      note: "Stayed only for the opening exchange.",
      isActive: false,
      selectable: false,
      selected: false,
      selectionLabel: "Inactive",
      selectionAriaLabel: "",
    },
    {
      id: "player",
      name: "Rowan Vale",
      avatarUrl: "",
      fallbackInitial: "R",
      role: "Player Character",
      state: "Player controlled",
      note: "",
      isActive: true,
      selectable: false,
      selected: false,
      selectionLabel: "Player-controlled",
      selectionAriaLabel: "",
    },
  ]);

export const storyRoomCastLifecycleStillOpeningRuntimeFixture =
  Object.freeze({
    contractVersion:
      "story_character_lifecycle_runtime.presentation.v1",
    participants: [
      {
        participantId: "participant-pinned",
        authoringContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "STORY_PINNED",
        lifecycleLabel: "Persistent Story Cast",
        loadPolicy: "STORY_PINNED",
        requiredAtStoryBoot: true,
        releasePolicy: "NEVER",
        releasePolicyLabel:
          "Remains active until another Story/runtime system changes presence",
        lifecycleStatus: "ACTIVE",
        isActive: true,
        isReleased: false,
        releaseReady: false,
        stateLabel: "Active",
        stateTone: "ACTIVE",
        releaseReason:
          "RELEASE_POLICY_NEVER",
        releaseReasonMessage:
          "This character is persistent Story cast.",
        releasedAtTurn: null,
        releaseVersion: null,
        releaseEvidence: {},
      },
      {
        participantId: "participant-opening",
        authoringContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "OPENING_TEMPORARY",
        lifecycleLabel: "Opening Only",
        loadPolicy: "STORY_OPENING_TEMPORARY",
        requiredAtStoryBoot: true,
        releasePolicy: "INITIAL_PHASE_EXIT",
        releasePolicyLabel:
          "Releases after the opening phase",
        lifecycleStatus: "ACTIVE",
        isActive: true,
        isReleased: false,
        releaseReady: false,
        stateLabel: "Active",
        stateTone: "ACTIVE",
        releaseReason:
          "INITIAL_PHASE_STILL_ACTIVE",
        releaseReasonMessage:
          "Opening phase is still active.",
        releasedAtTurn: null,
        releaseVersion: null,
        releaseEvidence: {},
      },
      {
        participantId: "participant-temporary",
        authoringContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "TEMPORARY",
        lifecycleLabel: "Temporary Story Cast",
        loadPolicy: "STORY_TEMPORARY",
        requiredAtStoryBoot: false,
        releasePolicy: "EXPLICIT_SIGNAL",
        releasePolicyLabel:
          "Releases on an explicit Story signal",
        lifecycleStatus: "ACTIVE",
        isActive: true,
        isReleased: false,
        releaseReady: false,
        stateLabel: "Active",
        stateTone: "ACTIVE",
        releaseReason:
          "RELEASE_SIGNAL_PENDING",
        releaseReasonMessage:
          "Waiting for the configured release signal.",
        releasedAtTurn: null,
        releaseVersion: null,
        releaseEvidence: {},
      },
      {
        participantId: "participant-released",
        authoringContractVersion:
          "story_character_lifecycle_v0",
        lifecycleKind: "OPENING_TEMPORARY",
        lifecycleLabel: "Opening Only",
        loadPolicy: "STORY_OPENING_TEMPORARY",
        requiredAtStoryBoot: true,
        releasePolicy: "INITIAL_PHASE_EXIT",
        releasePolicyLabel:
          "Releases after the opening phase",
        lifecycleStatus: "RELEASED",
        isActive: false,
        isReleased: true,
        releaseReady: false,
        stateLabel: "Released",
        stateTone: "QUIET",
        releaseReason:
          "INITIAL_PHASE_EXIT_APPLIED",
        releaseReasonMessage:
          "Opening phase has exited; this character is ready to release.",
        releasedAtTurn: 8,
        releaseVersion:
          "story_character_lifecycle_release_v0",
        releaseEvidence: {
          transitionObserved: true,
        },
      },
    ],
  });

export const storyRoomCastLifecycleReleaseReadyRuntimeFixture =
  Object.freeze({
    ...storyRoomCastLifecycleStillOpeningRuntimeFixture,
    participants:
      storyRoomCastLifecycleStillOpeningRuntimeFixture.participants.map(
        (participant) =>
          participant.participantId ===
          "participant-opening"
            ? {
                ...participant,
                releaseReady: true,
                stateLabel: "Release ready",
                stateTone: "CAUTION",
                releaseReason:
                  "INITIAL_PHASE_EXIT_APPLIED",
                releaseReasonMessage:
                  "Opening phase has exited; this character is ready to release.",
              }
            : participant
      ),
  });
