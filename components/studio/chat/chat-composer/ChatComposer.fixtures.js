import { CHAT_COMPOSER_MODES } from "./ChatComposer.contract";
import { CHAT_COMPOSER_COMMANDS } from "./chatComposerCommandRegistry";

const MODE_OPTIONS = [
  { value: CHAT_COMPOSER_MODES.DIALOGUE, label: "Dialogue" },
  { value: CHAT_COMPOSER_MODES.ACTION, label: "Action" },
  { value: CHAT_COMPOSER_MODES.OOC, label: "OOC / Note" },
  { value: CHAT_COMPOSER_MODES.DIRECT, label: "Direct / GM" },
];

const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E";

const SPEAKER_OPTIONS = [
  { id: "AUTO", label: "Auto", iconKind: "auto", avatarUrl: "" },
  { id: "narrator-1", label: "The Chronicler", iconKind: "narrator", avatarUrl: "" },
  { id: "char-verena", label: "Lady Verena Ashcroft", iconKind: "participant", avatarUrl: AVATAR_DATA_URL },
  { id: "char-thane", label: "Thane Corvid", iconKind: "participant", avatarUrl: "" },
  { id: "RANDOM", label: "Random", iconKind: "random", avatarUrl: "" },
];

function noop() {}

const BASE_PROPS = {
  modeOptions: MODE_OPTIONS,
  mode: CHAT_COMPOSER_MODES.DIALOGUE,
  speakerOptions: SPEAKER_OPTIONS,
  speakerId: "AUTO",
  draft: "",
  draftLength: 0,
  showLengthCounter: false,
  mentionSuggestions: [],
  highlightedMentionIndex: 0,
  commandSuggestions: [],
  highlightedCommandIndex: 0,
  highlightedCommandExact: false,
  locationSuggestions: [],
  highlightedLocationIndex: 0,
  placeholder: "Write dialogue or natural player input...",
  textareaDisabled: false,
  sendDisabled: true,
  isSending: false,
  submitIsContinuation: true,
  submitLabel: "Continue Scene",
  submitPendingLabel: "Choosing next responder",
  streamingSupported: false,
  isStreaming: false,
  onStopGenerating: null,
  sceneImageSeat: { available: true, costLabel: "40 coins", pending: false, onOpenConfirm: noop },
  sceneImageConfirmSheet: null,
  useCurrentSceneSeat: { available: true, pending: false, onUse: noop },
  onChangeMode: noop,
  onChangeSpeaker: noop,
  onChangeDraft: noop,
  onUpdateSuggestionQueries: noop,
  onMoveMentionHighlight: noop,
  onSelectHighlightedMention: noop,
  onSelectMention: noop,
  onDismissMentionSuggestions: noop,
  onMoveCommandHighlight: noop,
  onSelectHighlightedCommand: noop,
  onSelectCommand: noop,
  onDismissCommandSuggestions: noop,
  onMoveLocationHighlight: noop,
  onSelectHighlightedLocation: noop,
  onSelectLocation: noop,
  onDismissLocationSuggestions: noop,
  onSend: noop,
  onOpenCast: noop,
  onOpenState: noop,
};

function withDraft(draft) {
  return { ...BASE_PROPS, draft, draftLength: draft.length, submitIsContinuation: false, submitLabel: "Send", sendDisabled: false };
}

export const chatComposerDialogueFixture = { ...BASE_PROPS };

export const chatComposerActionFixture = {
  ...withDraft("She steps through the archway and raises the lantern."),
  mode: CHAT_COMPOSER_MODES.ACTION,
  placeholder: "Describe an action visible in the scene...",
};

export const chatComposerOocFixture = {
  ...withDraft("(OOC: taking a short break, back in ten.)"),
  mode: CHAT_COMPOSER_MODES.OOC,
  placeholder: "Write an OOC note...",
};

export const chatComposerDirectFixture = {
  ...withDraft("Move the scene toward the archive entrance."),
  mode: CHAT_COMPOSER_MODES.DIRECT,
  placeholder: "Steer pacing, scene direction, or GM-style movement...",
};

export const chatComposerCommandMenuOpenFixture = {
  ...withDraft("/"),
  sendDisabled: true,
  commandSuggestions: CHAT_COMPOSER_COMMANDS,
  highlightedCommandIndex: 0,
  highlightedCommandExact: false,
};

export const chatComposerMentionMenuOpenFixture = {
  ...withDraft("I turn to face @ver"),
  mentionSuggestions: [
    { id: "char-verena", label: "Lady Verena Ashcroft", avatarUrl: AVATAR_DATA_URL, mentionAlias: "@lady" },
    { id: "char-thane", label: "Thane Corvid", avatarUrl: "", mentionAlias: "@thane" },
  ],
  highlightedMentionIndex: 0,
};

export const chatComposerLocationMenuOpenFixture = {
  ...withDraft("We head toward #glass"),
  locationSuggestions: [
    { runtimeEntryId: "loc-1", label: "The Glass Archive", aliases: [], locationScale: "Room", registryTitle: "Crestfall Locations", isCurrent: true },
    { runtimeEntryId: "loc-2", label: "The Sunken Gate", aliases: ["gate"], locationScale: "District", registryTitle: "Crestfall Locations", isCurrent: false },
  ],
  highlightedLocationIndex: 0,
};

export const chatComposerYieldToCharacterFixture = {
  ...BASE_PROPS,
  speakerId: "char-verena",
  submitIsContinuation: false,
  submitLabel: "Send",
};

export const chatComposerRandomLikedFixture = {
  ...BASE_PROPS,
  speakerId: "RANDOM",
};

export const chatComposerPendingFixture = {
  ...withDraft("Waiting on the Crestfall Engine..."),
  isSending: true,
  textareaDisabled: true,
  sendDisabled: true,
};

export const chatComposerDisabledFixture = {
  ...BASE_PROPS,
  textareaDisabled: true,
  sendDisabled: true,
  placeholder: "This Story is read-only right now.",
};

export const chatComposerStreamingFixture = {
  ...BASE_PROPS,
  streamingSupported: true,
  isStreaming: true,
  onStopGenerating: noop,
  sendDisabled: true,
};

export const chatComposerLengthCounterFixture = {
  ...withDraft(
    "The corridor continues far beyond the reach of the lantern, lined with thousands of brass drawers, each marked with a date that has not happened yet. ".repeat(15)
  ),
  showLengthCounter: true,
};

export const chatComposerSceneImageConfirmFixture = {
  ...BASE_PROPS,
  sceneImageConfirmSheet: {
    open: true,
    costLabel: "40 coins",
    pending: false,
    error: "",
    onConfirm: noop,
    onCancel: noop,
  },
};

export const chatComposerSceneImagePendingFixture = {
  ...BASE_PROPS,
  sceneImageConfirmSheet: {
    open: true,
    costLabel: "40 coins",
    pending: true,
    error: "",
    onConfirm: noop,
    onCancel: noop,
  },
};

export const chatComposerSceneImageErrorFixture = {
  ...BASE_PROPS,
  sceneImageConfirmSheet: {
    open: true,
    costLabel: "40 coins",
    pending: false,
    error: "Generation failed. Your coins were not charged.",
    onConfirm: noop,
    onCancel: noop,
  },
};

export const chatComposerSceneToolsUnavailableFixture = {
  ...BASE_PROPS,
  sceneImageSeat: { available: false, costLabel: "", pending: false, onOpenConfirm: null },
  useCurrentSceneSeat: { available: false, pending: false, onUse: null },
};

export const chatComposerMobileToolsOpenFixture = {
  ...BASE_PROPS,
  initialToolsOpen: true,
};

export const chatComposerLongestDraftFixture = {
  ...withDraft(
    "She folded the note once, then unfolded it again, reading the same line for what must have been the twentieth time. \"This changes nothing,\" she said, though her voice betrayed exactly how much it changed. *She slipped it into her coat, feeling the paper crease sharp against her ribs, and looked up at the archway, at the lantern light flickering across the brass drawers stretching further than any hallway had a right to stretch.* \"We should not be here.\" **\"We are already here.\"** The corridor answered with silence, the kind that has weight, the kind that remembers."
  ),
  showLengthCounter: false,
};

export const chatComposerFixtures = [
  { id: "dialogue", label: "Dialogue mode", props: chatComposerDialogueFixture },
  { id: "action", label: "Action mode", props: chatComposerActionFixture },
  { id: "ooc", label: "OOC mode", props: chatComposerOocFixture },
  { id: "direct", label: "Direct mode", props: chatComposerDirectFixture },
  { id: "command-menu", label: "Command menu open", props: chatComposerCommandMenuOpenFixture },
  { id: "mention-menu", label: "Mention menu open", props: chatComposerMentionMenuOpenFixture },
  { id: "location-menu", label: "Location menu open", props: chatComposerLocationMenuOpenFixture },
  { id: "yield-character", label: "Yield to character speaker", props: chatComposerYieldToCharacterFixture },
  { id: "yield-random", label: "Yield to random speaker", props: chatComposerRandomLikedFixture },
  { id: "pending", label: "Sending, pending", props: chatComposerPendingFixture },
  { id: "disabled", label: "Disabled", props: chatComposerDisabledFixture },
  { id: "streaming", label: "Streaming, stop generation seat", props: chatComposerStreamingFixture },
  { id: "length-counter", label: "Length counter, past soft threshold", props: chatComposerLengthCounterFixture },
  { id: "scene-image-confirm", label: "Scene Image, confirm sheet", props: chatComposerSceneImageConfirmFixture },
  { id: "scene-image-pending", label: "Scene Image, generating", props: chatComposerSceneImagePendingFixture },
  { id: "scene-image-error", label: "Scene Image, error", props: chatComposerSceneImageErrorFixture },
  { id: "scene-tools-unavailable", label: "Scene tool seats unavailable", props: chatComposerSceneToolsUnavailableFixture },
  { id: "mobile-tools-open", label: "Mobile tools sheet open", props: chatComposerMobileToolsOpenFixture },
  { id: "longest-draft", label: "Longest draft", props: chatComposerLongestDraftFixture },
];
