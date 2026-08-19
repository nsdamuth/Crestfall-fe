import {
  STORY_ROOM_COMMANDS,
  getStoryRoomCommandSearchTerms,
} from "../storyRoomCommandRegistry.js";

import {
  STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION,
} from "../StoryRoomComposer.contract.js";

import {
  STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,
} from "../../story-room-transcript/StoryRoomTranscript.contract.js";

import {
  STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,
  STORY_ROOM_MESSAGE_SURFACE_TONES,
} from "../../story-room-message/StoryRoomMessage.contract.js";

export const STORY_ROOM_SUMMARY_COMMAND_BINDING_CONTRACT_VERSION =
  "story_room_summary_command_binding_v1";

export const STORY_ROOM_SUMMARY_COMMAND = Object.freeze({
  name: "summary",
  aliases: Object.freeze(["recap"]),
  description:
    "Summarize the current story beat or scene without advancing the story.",
  usage: "/summary",
  handling: "REMOTE_UI",
  action: "SUMMARIZE_CURRENT_BOUNDARY",
});

export const STORY_ROOM_SUMMARY_PENDING_PRESENTATION = Object.freeze({
  eyebrow: "Scene Recap",
  message:
    "Crestfall Engine is preparing the current scene recap...",
  role: "status",
  ariaLive: "polite",
  iconKey: "loader",
});

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCommandToken(value) {
  return text(value).toLowerCase();
}

function commandSearchTerms(command) {
  return [
    command?.name,
    ...(array(command?.aliases)),
  ]
    .map(normalizeCommandToken)
    .filter(Boolean);
}

function isSummaryCommandDefinition(command) {
  return (
    normalizeCommandToken(command?.name) ===
      STORY_ROOM_SUMMARY_COMMAND.name ||
    commandSearchTerms(command).includes("recap")
  );
}

export function getStoryRoomCommandsWithSummary(
  baseCommands = STORY_ROOM_COMMANDS
) {
  const base = array(baseCommands)
    .filter(
      (command) =>
        !isSummaryCommandDefinition(command)
    );

  const helpIndex = base.findIndex(
    (command) =>
      normalizeCommandToken(command?.name) === "help"
  );

  if (helpIndex < 0) {
    return [
      STORY_ROOM_SUMMARY_COMMAND,
      ...base,
    ];
  }

  return [
    ...base.slice(0, helpIndex + 1),
    STORY_ROOM_SUMMARY_COMMAND,
    ...base.slice(helpIndex + 1),
  ];
}

export function getStoryRoomCommandSuggestionsWithSummary(
  commandToken = "",
  baseCommands = STORY_ROOM_COMMANDS
) {
  const normalizedToken =
    normalizeCommandToken(commandToken);

  return getStoryRoomCommandsWithSummary(baseCommands)
    .filter((command) => {
      if (!normalizedToken) return true;

      return commandSearchTerms(command).some(
        (term) =>
          term.startsWith(normalizedToken)
      );
    })
    .sort((left, right) => {
      const leftTerms =
        commandSearchTerms(left);
      const rightTerms =
        commandSearchTerms(right);

      const leftExact =
        leftTerms.includes(normalizedToken)
          ? 1
          : 0;

      const rightExact =
        rightTerms.includes(normalizedToken)
          ? 1
          : 0;

      if (leftExact !== rightExact) {
        return rightExact - leftExact;
      }

      return text(left?.name).localeCompare(
        text(right?.name)
      );
    });
}

export function resolveStoryRoomSummaryCommand(
  draft
) {
  const match =
    /^\/([^\s]+)\s*$/u.exec(
      text(draft)
    );

  if (!match) return null;

  const token =
    normalizeCommandToken(match[1]);

  return commandSearchTerms(
    STORY_ROOM_SUMMARY_COMMAND
  ).includes(token)
    ? STORY_ROOM_SUMMARY_COMMAND
    : null;
}

export function projectStoryRoomSummaryCommandDispatch({
  draft = "",
  actionType = "MESSAGE",
  sending = false,
  summaryPending = false,
} = {}) {
  const isYieldTurn = [
    "PLAYER_YIELD_TO_CHARACTER",
    "PLAYER_YIELD_TO_AUTO",
  ].includes(text(actionType));

  if (sending || summaryPending) {
    return {
      blocked: true,
      blockedReason:
        summaryPending
          ? "SUMMARY_PENDING"
          : "MESSAGE_SEND_PENDING",
      intercepted: false,
      command: null,
      clearDraft: false,
      clearParticipantMentions: false,
      clearLocationMentions: false,
      invokeAction: null,
    };
  }

  if (isYieldTurn) {
    return {
      blocked: false,
      blockedReason: "",
      intercepted: false,
      command: null,
      clearDraft: false,
      clearParticipantMentions: false,
      clearLocationMentions: false,
      invokeAction: null,
    };
  }

  const command =
    resolveStoryRoomSummaryCommand(draft);

  if (!command) {
    return {
      blocked: false,
      blockedReason: "",
      intercepted: false,
      command: null,
      clearDraft: false,
      clearParticipantMentions: false,
      clearLocationMentions: false,
      invokeAction: null,
    };
  }

  return {
    blocked: false,
    blockedReason: "",
    intercepted: true,
    command,
    clearDraft: true,
    clearParticipantMentions: true,
    clearLocationMentions: true,
    invokeAction:
      "SUMMARIZE_CURRENT_BOUNDARY",
  };
}

export function projectStoryRoomSummaryPendingState({
  sending = false,
  summaryPending = false,
} = {}) {
  const pending =
    summaryPending === true;

  return {
    composer: {
      isSending:
        sending === true || pending,
      summaryBlocksOrdinarySend:
        pending,
    },

    transcript: {
      visible: pending,
      presentation:
        pending
          ? {
              ...STORY_ROOM_SUMMARY_PENDING_PRESENTATION,
            }
          : null,
      visualStatus:
        pending
          ? "WIRED"
          : "IDLE",
    },
  };
}

export function projectStoryRoomSummaryResultCompatibility(
  message = null
) {
  if (
    !message ||
    typeof message !== "object"
  ) {
    return null;
  }

  const publicDisplay =
    message?.metadata?.publicDisplay || {};

  const turnAction =
    message?.metadata?.turnAction || {};

  const sceneRecap =
    message?.metadata?.sceneRecap || {};

  const isSummaryResult =
    text(turnAction.type) ===
      "SUMMARIZE_CURRENT_BOUNDARY" ||
    text(sceneRecap.version) ===
      "chat_scene_recap_v1";

  if (!isSummaryResult) {
    return null;
  }

  return {
    messageId:
      text(message.id),

    speakerLabel:
      text(publicDisplay.speaker) ||
      text(message.speaker) ||
      "Scene Recap",

    surfaceTone:
      STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM,

    messageKind:
      text(message.messageKind) ||
      "STATE_SUMMARY",

    turnAction: {
      type:
        text(turnAction.type) ||
        "SUMMARIZE_CURRENT_BOUNDARY",
      playerActed:
        turnAction.playerActed === true,
      transcriptVisibility:
        text(
          turnAction.transcriptVisibility
        ) || "VISIBLE",
    },

    sceneRecap: {
      version:
        text(sceneRecap.version) ||
        "chat_scene_recap_v1",
      boundary:
        sceneRecap.boundary || null,
      generatedAt:
        text(sceneRecap.generatedAt),
    },

    existingSystemMessageSurfaceCompatible:
      true,
  };
}

export function projectStoryRoomSummaryCommandBinding({
  commandToken = "",
  draft = "",
  actionType = "MESSAGE",
  sending = false,
  summaryPending = false,
  resultMessage = null,
} = {}) {
  return {
    bindingContractVersion:
      STORY_ROOM_SUMMARY_COMMAND_BINDING_CONTRACT_VERSION,

    composerViewContractVersion:
      STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION,

    transcriptViewContractVersion:
      STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,

    messageViewContractVersion:
      STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,

    commands:
      getStoryRoomCommandsWithSummary(),

    commandSuggestions:
      getStoryRoomCommandSuggestionsWithSummary(
        commandToken
      ),

    dispatch:
      projectStoryRoomSummaryCommandDispatch({
        draft,
        actionType,
        sending,
        summaryPending,
      }),

    pending:
      projectStoryRoomSummaryPendingState({
        sending,
        summaryPending,
      }),

    result:
      projectStoryRoomSummaryResultCompatibility(
        resultMessage
      ),

    functionalWiringStatus: {
      commandRegistry: "WIRED",
      remoteCommandDispatch: "WIRED",
      requestDeduplication: "WIRED",
      transcriptPendingCard: "WIRED",
      recapResultAppend: "WIRED",
    },

    visualExtensionStatus: {
      commandSuggestion: "WIRED",
      remoteCommandDispatch: "WIRED",
      recapResultMessage:
        "CURRENT_SYSTEM_MESSAGE_SURFACE_COMPATIBLE",
      transcriptPendingCard: "WIRED",
    },

    architecture: {
      summaryRequestOwnedByChassis: true,
      requestDeduplicationOwnedByChassis: true,
      currentBoundaryResolutionOwnedByChassis: true,
      recapGenerationOwnedByChassis: true,
      recapPersistenceOwnedByChassis: true,
      recapMessageAppendOwnedByChassis: true,
      noStoryAdvanceGuaranteedByRuntime: true,
      commandSuggestionPresentationOwnedByFe: true,
      pendingCardPresentationOwnedByFe: true,
    },
  };
}

// Preserve current command-search terminology as an explicit dependency.
// This is also a diagnostic guard that the binding is extending the
// existing command registry rather than replacing its local command model.
export const STORY_ROOM_SUMMARY_EXISTING_COMMAND_SEARCH_TERMS =
  Object.freeze(
    STORY_ROOM_COMMANDS.map(
      (command) =>
        Object.freeze(
          getStoryRoomCommandSearchTerms(
            command
          )
        )
    )
  );
