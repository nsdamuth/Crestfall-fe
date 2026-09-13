const noop = () => {};
const returnNull = () => null;

const defaultInputModeOptions = [
  { value: "DIALOGUE", label: "Dialogue" },
  { value: "ACTION", label: "Action" },
  { value: "OOC", label: "OOC" },
  { value: "DIRECT", label: "Direct" },
];

const defaultSpeakerOptions = [
  { id: "AUTO", label: "Auto", iconKind: "auto" },
  { id: "narrator-1", label: "The Chronicler", iconKind: "narrator" },
  { id: "character-1", label: "Seraphine Vale", iconKind: "participant", avatarUrl: "" },
];

const defaultCallbacks = {
  onChangeInputMode: noop,
  onChangeNextSpeaker: noop,
  onChangeDraft: noop,
  onUpdateSuggestionQueries: noop,
  onMoveMentionHighlight: noop,
  onSelectHighlightedMention: returnNull,
  onSelectMention: returnNull,
  onDismissMentionSuggestions: noop,
  onAuto: noop,
  onOpenStoryList: noop,
  onOpenSettings: noop,
  onSend: noop,
};

// Contract 3.0.0 (brief 2 item 1): the send circle posts the draft only,
// so the default (empty) fixture has send disabled and Auto enabled.
function createFixture(overrides = {}) {
  return {
    inputModeOptions: defaultInputModeOptions,
    inputMode: "DIALOGUE",
    nextSpeakerOptions: defaultSpeakerOptions,
    nextSpeaker: "AUTO",
    draft: "",
    mentionSuggestions: [],
    highlightedMentionIndex: 0,
    placeholder: "Send a message",
    textareaDisabled: false,
    sendDisabled: true,
    isSending: false,
    submitLabel: "Send",
    submitPendingLabel: "Sending",
    autoDisabled: false,
    autoLabel: "Auto: the story chooses who speaks next",
    autoPendingLabel: "Choosing the next speaker",
    sceneImageState: "soon",
    sceneImageLabel: "Scene image, not available yet",
    ...defaultCallbacks,
    ...overrides,
  };
}

export const storyRoomComposerDefaultFixture = createFixture();

export const storyRoomComposerAutoContinueFixture = createFixture();

export const storyRoomComposerDraftFixture = createFixture({
  inputMode: "ACTION",
  nextSpeaker: "character-1",
  draft: "Seraphine steps between the envoy and the sealed gate.",
  sendDisabled: false,
});

export const storyRoomComposerMentionFixture = createFixture({
  draft: "I turn toward @ser",
  sendDisabled: false,
  mentionSuggestions: [
    {
      id: "character-1",
      label: "Seraphine Vale",
      avatarUrl: "",
      mentionAlias: "@seraphine",
    },
    {
      id: "character-2",
      label: "Ser Caldus",
      avatarUrl: "",
      mentionAlias: "@ser",
    },
  ],
  highlightedMentionIndex: 0,
});

export const storyRoomComposerSendingFixture = createFixture({
  draft: "The bargain is accepted.",
  textareaDisabled: true,
  sendDisabled: true,
  autoDisabled: true,
  isSending: true,
});

export const storyRoomComposerDisabledFixture = createFixture({
  draft: "This draft remains visible while the story is unavailable.",
  disabledReason: "Chat is not available for this account.",
  textareaDisabled: true,
  sendDisabled: true,
  autoDisabled: true,
});

export const storyRoomComposerMinimalOptionsFixture = createFixture({
  nextSpeakerOptions: [{ id: "AUTO", label: "Auto", iconKind: "auto" }],
});

export const storyRoomComposerLongContentFixture = createFixture({
  inputMode: "DIRECT",
  nextSpeakerOptions: [
    ...defaultSpeakerOptions,
    {
      id: "character-long",
      label: "Aurelia Vespera, Last Cartographer of the Ninth Gate",
      iconKind: "participant",
    },
    { id: "character-3", label: "Brannoc", iconKind: "participant" },
    { id: "character-4", label: "Ilse of the Weir", iconKind: "participant" },
    { id: "character-5", label: "Tamsin", iconKind: "participant" },
    { id: "character-6", label: "Oren Vale", iconKind: "participant" },
  ],
  nextSpeaker: "character-long",
  draft:
    "Slow the scene and let every present character react to the revelation before advancing the objective. Preserve the uncertainty around the sealed archive, emphasize the sound of distant machinery, and allow the player to interrupt before the narrator resolves the moment.",
  sendDisabled: false,
});
