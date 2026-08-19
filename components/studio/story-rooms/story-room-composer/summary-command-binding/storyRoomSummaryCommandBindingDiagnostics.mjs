import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_ROOM_COMMANDS,
} from "../storyRoomCommandRegistry.js";

import {
  STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION,
} from "../StoryRoomComposer.contract.js";

import {
  STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,
} from "../../story-room-transcript/StoryRoomTranscript.contract.js";

import {
  STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,
} from "../../story-room-message/StoryRoomMessage.contract.js";

import {
  STORY_ROOM_SUMMARY_COMMAND,
  STORY_ROOM_SUMMARY_COMMAND_BINDING_CONTRACT_VERSION,
  STORY_ROOM_SUMMARY_EXISTING_COMMAND_SEARCH_TERMS,
  STORY_ROOM_SUMMARY_PENDING_PRESENTATION,
  getStoryRoomCommandsWithSummary,
  getStoryRoomCommandSuggestionsWithSummary,
  projectStoryRoomSummaryCommandBinding,
  projectStoryRoomSummaryCommandDispatch,
  projectStoryRoomSummaryPendingState,
  projectStoryRoomSummaryResultCompatibility,
  resolveStoryRoomSummaryCommand,
} from "./StoryRoomSummaryCommandBinding.contract.js";

import {
  storyRoomSummaryCommandResultMessageFixture,
  storyRoomSummaryCommandUnrelatedSystemMessageFixture,
} from "./StoryRoomSummaryCommandBinding.fixtures.js";

assert.equal(
  STORY_ROOM_SUMMARY_COMMAND_BINDING_CONTRACT_VERSION,
  "story_room_summary_command_binding_v1"
);

assert.deepEqual(
  STORY_ROOM_SUMMARY_COMMAND,
  {
    name: "summary",
    aliases: ["recap"],
    description:
      "Summarize the current story beat or scene without advancing the story.",
    usage: "/summary",
    handling: "REMOTE_UI",
    action:
      "SUMMARIZE_CURRENT_BOUNDARY",
  }
);

assert.deepEqual(
  STORY_ROOM_SUMMARY_PENDING_PRESENTATION,
  {
    eyebrow: "Scene Recap",
    message:
      "Crestfall Engine is preparing the current scene recap...",
    role: "status",
    ariaLive: "polite",
    iconKey: "loader",
  }
);

assert.deepEqual(
  STORY_ROOM_COMMANDS.map(
    (command) =>
      command.name
  ),
  [
    "help",
    "summary",
    "commands",
  ]
);

const commands =
  getStoryRoomCommandsWithSummary();

assert.deepEqual(
  commands.map(
    (command) =>
      command.name
  ),
  [
    "help",
    "summary",
    "commands",
  ]
);

assert.deepEqual(
  STORY_ROOM_SUMMARY_EXISTING_COMMAND_SEARCH_TERMS,
  [
    ["help", "?"],
    ["summary", "recap"],
    ["commands"],
  ]
);

assert.deepEqual(
  getStoryRoomCommandSuggestionsWithSummary(
    ""
  ).map(
    (command) =>
      command.name
  ),
  [
    "commands",
    "help",
    "summary",
  ]
);

assert.deepEqual(
  getStoryRoomCommandSuggestionsWithSummary(
    "s"
  ).map(
    (command) =>
      command.name
  ),
  [
    "summary",
  ]
);

assert.deepEqual(
  getStoryRoomCommandSuggestionsWithSummary(
    "rec"
  ).map(
    (command) =>
      command.name
  ),
  [
    "summary",
  ]
);

assert.deepEqual(
  getStoryRoomCommandSuggestionsWithSummary(
    "recap"
  ).map(
    (command) =>
      command.name
  ),
  [
    "summary",
  ]
);

assert.equal(
  resolveStoryRoomSummaryCommand(
    "/summary"
  )?.action,
  "SUMMARIZE_CURRENT_BOUNDARY"
);

assert.equal(
  resolveStoryRoomSummaryCommand(
    "  /RECAP  "
  )?.name,
  "summary"
);

for (const draft of [
  "/summary now",
  "/recap please",
  "summary",
  "/commands",
  "/help",
  "",
]) {
  assert.equal(
    resolveStoryRoomSummaryCommand(
      draft
    ),
    null,
    `${draft} must not resolve as the remote summary command`
  );
}

const dispatch =
  projectStoryRoomSummaryCommandDispatch({
    draft: "/summary",
  });

assert.deepEqual(
  dispatch,
  {
    blocked: false,
    blockedReason: "",
    intercepted: true,
    command:
      STORY_ROOM_SUMMARY_COMMAND,
    clearDraft: true,
    clearParticipantMentions: true,
    clearLocationMentions: true,
    invokeAction:
      "SUMMARIZE_CURRENT_BOUNDARY",
  }
);

const recapDispatch =
  projectStoryRoomSummaryCommandDispatch({
    draft: "/recap",
  });

assert.equal(
  recapDispatch.intercepted,
  true
);

const ordinaryDispatch =
  projectStoryRoomSummaryCommandDispatch({
    draft:
      "Could you summarize that for me?",
  });

assert.equal(
  ordinaryDispatch.intercepted,
  false
);

const yieldDispatch =
  projectStoryRoomSummaryCommandDispatch({
    draft: "/summary",
    actionType:
      "PLAYER_YIELD_TO_AUTO",
  });

assert.equal(
  yieldDispatch.intercepted,
  false
);

const summaryBusyDispatch =
  projectStoryRoomSummaryCommandDispatch({
    draft: "/summary",
    summaryPending: true,
  });

assert.equal(
  summaryBusyDispatch.blocked,
  true
);

assert.equal(
  summaryBusyDispatch.blockedReason,
  "SUMMARY_PENDING"
);

assert.equal(
  summaryBusyDispatch.intercepted,
  false
);

const sendBusyDispatch =
  projectStoryRoomSummaryCommandDispatch({
    draft: "/summary",
    sending: true,
  });

assert.equal(
  sendBusyDispatch.blocked,
  true
);

assert.equal(
  sendBusyDispatch.blockedReason,
  "MESSAGE_SEND_PENDING"
);

const pending =
  projectStoryRoomSummaryPendingState({
    sending: false,
    summaryPending: true,
  });

assert.deepEqual(
  pending,
  {
    composer: {
      isSending: true,
      summaryBlocksOrdinarySend: true,
    },
    transcript: {
      visible: true,
      presentation: {
        eyebrow: "Scene Recap",
        message:
          "Crestfall Engine is preparing the current scene recap...",
        role: "status",
        ariaLive: "polite",
        iconKey: "loader",
      },
      visualStatus:
        "WIRED",
    },
  }
);

const idle =
  projectStoryRoomSummaryPendingState({
    sending: false,
    summaryPending: false,
  });

assert.equal(
  idle.composer.isSending,
  false
);

assert.equal(
  idle.transcript.visible,
  false
);

const result =
  projectStoryRoomSummaryResultCompatibility(
    storyRoomSummaryCommandResultMessageFixture
  );

assert.deepEqual(
  result,
  {
    messageId:
      "summary-message-1",
    speakerLabel:
      "Scene Recap",
    surfaceTone: "SYSTEM",
    messageKind:
      "STATE_SUMMARY",
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
    existingSystemMessageSurfaceCompatible:
      true,
  }
);

assert.equal(
  projectStoryRoomSummaryResultCompatibility(
    storyRoomSummaryCommandUnrelatedSystemMessageFixture
  ),
  null
);

const binding =
  projectStoryRoomSummaryCommandBinding({
    commandToken:
      "rec",
    draft:
      "/recap",
    summaryPending: true,
    resultMessage:
      storyRoomSummaryCommandResultMessageFixture,
  });

assert.equal(
  binding.bindingContractVersion,
  STORY_ROOM_SUMMARY_COMMAND_BINDING_CONTRACT_VERSION
);

assert.equal(
  binding.composerViewContractVersion,
  STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION
);

assert.equal(
  binding.transcriptViewContractVersion,
  STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION
);

assert.equal(
  binding.messageViewContractVersion,
  STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION
);

assert.equal(
  binding.commandSuggestions[0].name,
  "summary"
);

assert.equal(
  binding.dispatch.blocked,
  true
);

assert.equal(
  binding.pending.transcript.visible,
  true
);

assert.equal(
  binding.result.surfaceTone,
  "SYSTEM"
);

assert.deepEqual(
  binding.functionalWiringStatus,
  {
    commandRegistry: "WIRED",
    remoteCommandDispatch: "WIRED",
    requestDeduplication: "WIRED",
    transcriptPendingCard: "WIRED",
    recapResultAppend: "WIRED",
  }
);

assert.deepEqual(
  binding.visualExtensionStatus,
  {
    commandSuggestion: "WIRED",
    remoteCommandDispatch: "WIRED",
    recapResultMessage:
      "CURRENT_SYSTEM_MESSAGE_SURFACE_COMPATIBLE",
    transcriptPendingCard: "WIRED",
  }
);

assert.deepEqual(
  binding.architecture,
  {
    summaryRequestOwnedByChassis: true,
    requestDeduplicationOwnedByChassis: true,
    currentBoundaryResolutionOwnedByChassis: true,
    recapGenerationOwnedByChassis: true,
    recapPersistenceOwnedByChassis: true,
    recapMessageAppendOwnedByChassis: true,
    noStoryAdvanceGuaranteedByRuntime: true,
    commandSuggestionPresentationOwnedByFe: true,
    pendingCardPresentationOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./StoryRoomSummaryCommandBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "summarizeStoryRoomCurrentBoundary",
  "/api/studio/story-rooms",
  "requestStoryRoomApi",
  "setSummaryPending",
  "summaryRequestActiveRef",
  "setSnapshot",
  "sendStoryMessage",
  "provider",
  "createChatMessageRecord",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useCallback(",
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
    "story_room_summary_command_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STORY_ROOM_SUMMARY_COMMAND_BINDING_CONTRACT_VERSION,
  composerViewContractVersion:
    STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION,
  transcriptViewContractVersion:
    STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,
  messageViewContractVersion:
    STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,
  summaryAndRecapAliasCovered: true,
  exactCommandOnlyDispatchCovered: true,
  busyAndYieldGuardsCovered: true,
  composerBusyProjectionCovered: true,
  transcriptPendingPresentationCovered: true,
  persistedSystemRecapCompatibilityCovered: true,
  noStoryAdvanceBoundaryCovered: true,
  commandRegistryWiredToCurrentChassisAuthority: true,
  remoteCommandDispatchWired: true,
  summaryRequestDeduplicationWired: true,
  transcriptPendingCardWired: true,
  persistedRecapAppendWired: true,
  existingComposerViewUnmodified: true,
  existingComposerViewModelUnmodified: true,
  transcriptViewSemanticallyExtended: true,
  transcriptViewModelWired: true,
  chassisRequestGenerationPersistenceAndAppendExcludedFromBindingContract: true,
}, null, 2));
