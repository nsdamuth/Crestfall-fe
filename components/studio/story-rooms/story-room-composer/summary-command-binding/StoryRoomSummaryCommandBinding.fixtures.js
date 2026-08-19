export const storyRoomSummaryCommandResultMessageFixture =
  Object.freeze({
    id:
      "summary-message-1",
    messageKind:
      "STATE_SUMMARY",
    speaker:
      "Scene Recap",
    type: "system",
    body:
      "Mira and Kessa have identified the bronze seal as the immediate source of the strange ticking in the workshop. The player has agreed to help investigate it without yet knowing why it arrived in the unordered crate.\n\nThe main unresolved questions are who sent the crate, what the seal is responding to, and whether the worsening weather outside is connected.",
    metadata: {
      publicDisplay: {
        speaker:
          "Scene Recap",
        type: "system",
      },
      turnAction: {
        type:
          "SUMMARIZE_CURRENT_BOUNDARY",
        playerActed: false,
        transcriptVisibility:
          "VISIBLE",
      },
      sceneRecap: {
        version:
          "chat_scene_recap_v1",
        boundary: {
          type: "SCENE",
          id: "scene-opening",
          label: "Opening",
          startTurn: 1,
          endTurn: 8,
          startMessageId:
            "message-1",
          endMessageId:
            "message-8",
        },
        generatedAt:
          "2026-08-17T20:00:00.000Z",
      },
      memoryVisibility: {
        version:
          "chat_memory_visibility_v1",
        speakerType:
          "SYSTEM_RECAP",
        privacy:
          "PRIVATE_SYSTEM_RECAP",
        memoryEligible: false,
      },
    },
  });

export const storyRoomSummaryCommandUnrelatedSystemMessageFixture =
  Object.freeze({
    id:
      "system-message-1",
    messageKind:
      "SYSTEM",
    speaker:
      "System",
    type: "system",
    body:
      "A participant joined the room.",
    metadata: {
      publicDisplay: {
        speaker: "System",
        type: "system",
      },
    },
  });
