const noop = () => {};
const returnNull = () => null;

const defaultInputModeOptions = [
  { value: "DIALOGUE", label: "Dialogue" },
  { value: "ACTION", label: "Action" },
  { value: "OOC", label: "OOC / Note" },
  { value: "DIRECT", label: "Direct / GM" },
];

const defaultSpeakerOptions = [
  { id: "AUTO", label: "Auto", iconKind: "auto" },
  { id: "narrator-1", label: "The Chronicler", iconKind: "narrator" },
  { id: "character-1", label: "Seraphine Vale", iconKind: "participant" },
  { id: "RANDOM", label: "Random", iconKind: "random" },
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
  onSend: noop,
  onOpenCast: noop,
  onOpenState: noop,
};

function createFixture(overrides = {}) {
  return {
    inputModeOptions: defaultInputModeOptions,
    inputMode: "DIALOGUE",
    nextSpeakerOptions: defaultSpeakerOptions,
    nextSpeaker: "AUTO",
    draft: "",
    mentionSuggestions: [],
    highlightedMentionIndex: 0,
    placeholder: "Write dialogue or natural player input...",
    textareaDisabled: false,
    sendDisabled: false,
    isSending: false,
    submitIsContinuation: true,
    submitLabel: "Continue Scene",
    submitPendingLabel: "Choosing next responder...",
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
  placeholder: "Describe an action visible in the scene...",
  sendDisabled: false,
  submitIsContinuation: false,
  submitLabel: "Send",
  submitPendingLabel: "Sending...",
});

export const storyRoomComposerMentionFixture = createFixture({
  draft: "I turn toward @ser",
  sendDisabled: false,
  submitIsContinuation: false,
  submitLabel: "Send",
  submitPendingLabel: "Sending...",
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
  isSending: true,
  submitIsContinuation: false,
  submitLabel: "Send",
  submitPendingLabel: "Sending...",
});

export const storyRoomComposerDisabledFixture = createFixture({
  draft: "This draft remains visible while the room is unavailable.",
  textareaDisabled: true,
  sendDisabled: true,
  submitIsContinuation: false,
  submitLabel: "Send",
  submitPendingLabel: "Sending...",
});

export const storyRoomComposerMinimalOptionsFixture = createFixture({
  nextSpeakerOptions: [
    { id: "AUTO", label: "Auto", iconKind: "auto" },
    { id: "RANDOM", label: "Random", iconKind: "random" },
  ],
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
  ],
  nextSpeaker: "character-long",
  draft:
    "Slow the scene and let every present character react to the revelation before advancing the objective. Preserve the uncertainty around the sealed archive, emphasize the sound of distant machinery, and allow the player to interrupt before the narrator resolves the moment.",
  placeholder: "Steer pacing, scene direction, or GM-style movement...",
  sendDisabled: false,
  submitIsContinuation: false,
  submitLabel: "Send",
  submitPendingLabel: "Sending...",
});
