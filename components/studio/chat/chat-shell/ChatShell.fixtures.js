import {
  chatTranscriptDefaultFixture,
  chatTranscriptEmptyFixture,
  chatTranscriptErrorFixture,
  chatTranscriptLoadingFixture,
  chatTranscriptLongestFixture,
} from "../chat-transcript/ChatTranscript.fixtures";
import { chatMessageStreamingFixture } from "../chat-message/ChatMessage.fixtures";
import {
  chatComposerDialogueFixture,
  chatComposerLongestDraftFixture,
  chatComposerSceneImageErrorFixture,
  chatComposerStreamingFixture,
} from "../chat-composer/ChatComposer.fixtures";
import {
  chatCastPanelCompleteFixture,
  chatCastPanelLongestFixture,
} from "../chat-cast-panel/ChatCastPanel.fixtures";
import {
  chatStatePanelCompleteFixture,
  chatStatePanelLongestFixture,
} from "../chat-state-panel/ChatStatePanel.fixtures";
import {
  chatDeleteConfirmRestFixture,
  chatExportRestFixture,
  chatReportRestFixture,
  chatSessionDialogsNoneOpenFixture,
  chatShareTemporaryFormFixture,
} from "../chat-session-dialogs/ChatSessionDialogs.fixtures";

function noop() {}

const BASE_SHELL = {
  backHref: "/studio/v2/stories",
  backLabel: "Stories",
  eyebrow: "Story",
  title: "The Lantern District Ledger",
  scenarioLabel: "The Lantern Below",
  modeLabel: "Roleplay",
  statusPills: [
    { id: "rating", label: "Mature", tone: "neutral" },
    { id: "visibility", label: "Private", tone: "gold" },
  ],
  coinChip: {
    balanceLabel: "1,240",
    buyInfoOpen: false,
    notificationsInfoOpen: false,
    onOpenBuyInfo: noop,
    onCloseBuyInfo: noop,
    onOpenNotificationsInfo: noop,
    onCloseNotificationsInfo: noop,
  },
  loading: false,
  errorMessage: "",
  leftRailCollapsed: false,
  rightRailCollapsed: false,
  onToggleLeftRail: noop,
  onToggleRightRail: noop,
  transcript: chatTranscriptDefaultFixture,
  composer: chatComposerDialogueFixture,
  castPanel: chatCastPanelCompleteFixture,
  statePanel: chatStatePanelCompleteFixture,
  sessionDialogs: chatSessionDialogsNoneOpenFixture,
  libraryPassUpsell: null,
};

export const chatShellColdOpenFixture = {
  ...BASE_SHELL,
  transcript: {
    ...chatTranscriptEmptyFixture,
    openingHeroImage: chatTranscriptDefaultFixture.openingHeroImage,
  },
  composer: { ...chatComposerDialogueFixture, sendDisabled: true },
};

export const chatShellActiveSessionFixture = { ...BASE_SHELL };

export const chatShellStreamingFixture = {
  ...BASE_SHELL,
  transcript: {
    ...chatTranscriptDefaultFixture,
    messageItems: [
      ...chatTranscriptDefaultFixture.messageItems,
      { id: "m-streaming", message: chatMessageStreamingFixture },
    ],
  },
  composer: chatComposerStreamingFixture,
};

export const chatShellRailsCollapsedFixture = {
  ...BASE_SHELL,
  leftRailCollapsed: true,
  rightRailCollapsed: true,
};

export const chatShellMobileHeaderFixture = {
  ...BASE_SHELL,
  title: "The Lantern District Ledger and the Unresolved Tariff Dispute",
  scenarioLabel: "The Lantern Below",
  modeLabel: "Roleplay",
  statusPills: [
    { id: "rating", label: "Mature", tone: "neutral" },
    { id: "visibility", label: "Private", tone: "gold" },
    { id: "phase", label: "Turn 12", tone: "neutral" },
  ],
};

export const chatShellReportDialogFixture = {
  ...BASE_SHELL,
  sessionDialogs: chatReportRestFixture,
};

export const chatShellExportDialogFixture = {
  ...BASE_SHELL,
  sessionDialogs: chatExportRestFixture,
};

export const chatShellShareDialogFixture = {
  ...BASE_SHELL,
  sessionDialogs: chatShareTemporaryFormFixture,
};

export const chatShellDeleteConfirmDialogFixture = {
  ...BASE_SHELL,
  sessionDialogs: chatDeleteConfirmRestFixture,
};

export const chatShellInsufficientCoinsFixture = {
  ...BASE_SHELL,
  coinChip: { ...BASE_SHELL.coinChip, balanceLabel: "5" },
  composer: chatComposerSceneImageErrorFixture,
  libraryPassUpsell: {
    open: true,
    title: "This scene needs a Library Pass",
    message:
      "Auto-event media for this scene draws from a pool gated by a Library Pass. You have 5 coins, short of the cost below.",
    passLabel: "Lantern District Pack",
    coinCostLabel: "Needs 40 coins or an active Library Pass",
    onOpenLibrary: noop,
    onDismiss: noop,
  },
};

export const chatShellLoadingFixture = {
  ...BASE_SHELL,
  loading: true,
};

export const chatShellErrorFixture = {
  ...BASE_SHELL,
  errorMessage: "The Story could not be reached. Check your connection and try again.",
};

export const chatShellLongestFixture = {
  ...BASE_SHELL,
  title:
    "The Unreasonably Long Chronicle of the Lantern Keepers Beneath the Western Observatory and Every Dispute That Followed",
  scenarioLabel: "The Lantern Below, Extended Cut",
  modeLabel: "Roleplay, Advanced Prompting Active",
  statusPills: [
    { id: "rating", label: "Mature", tone: "neutral" },
    { id: "visibility", label: "Private", tone: "gold" },
    { id: "phase", label: "Turn 128", tone: "neutral" },
    { id: "flag", label: "Flagged for review", tone: "danger" },
  ],
  transcript: chatTranscriptLongestFixture,
  composer: chatComposerLongestDraftFixture,
  castPanel: chatCastPanelLongestFixture,
  statePanel: chatStatePanelLongestFixture,
};

export const chatShellFixtures = [
  { id: "cold-open", label: "Cold open", props: chatShellColdOpenFixture },
  { id: "active-session", label: "Active session", props: chatShellActiveSessionFixture },
  { id: "streaming", label: "Streaming", props: chatShellStreamingFixture },
  { id: "rails-collapsed", label: "Rails collapsed", props: chatShellRailsCollapsedFixture },
  { id: "mobile-header", label: "Mobile context header", props: chatShellMobileHeaderFixture },
  { id: "report-dialog", label: "Report dialog open", props: chatShellReportDialogFixture },
  { id: "export-dialog", label: "Export dialog open", props: chatShellExportDialogFixture },
  { id: "share-dialog", label: "Share dialog open", props: chatShellShareDialogFixture },
  { id: "delete-confirm-dialog", label: "Delete confirm dialog open", props: chatShellDeleteConfirmDialogFixture },
  { id: "insufficient-coins", label: "Insufficient coins, upsell sheet", props: chatShellInsufficientCoinsFixture },
  { id: "loading", label: "Loading", props: chatShellLoadingFixture },
  { id: "error", label: "Error", props: chatShellErrorFixture },
  { id: "longest", label: "Longest content", props: chatShellLongestFixture },
];
