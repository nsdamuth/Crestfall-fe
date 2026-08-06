const noop = () => {};

const standardSpeakerOptions = Object.freeze([
  { value: "Narrator", label: "Narrator" },
  { value: "Mara Voss", label: "Mara Voss" },
  { value: "Captain Elian Rook", label: "Captain Elian Rook" },
  { value: "Player Prompt", label: "Player Prompt" },
]);

const baseFixture = Object.freeze({
  messageLabel: "Opening Message 1",
  speakerValue: "Narrator",
  speakerOptions: standardSpeakerOptions,
  bodyValue: "",
  canRemove: false,
  onChangeSpeaker: noop,
  onChangeBody: noop,
  onRemoveMessage: noop,
});

export const openingMessageFirstFixture = Object.freeze({
  ...baseFixture,
  bodyValue:
    "Rain presses against the observatory windows as the final warning bell fades over the city.",
});

export const openingMessageCharacterSpeakerFixture = Object.freeze({
  ...baseFixture,
  messageLabel: "Opening Message 2",
  speakerValue: "Mara Voss",
  bodyValue:
    "We have ten minutes before the archive seals itself. Decide what you are willing to leave behind.",
  canRemove: true,
});

export const openingMessagePlayerPromptFixture = Object.freeze({
  ...baseFixture,
  messageLabel: "Opening Message 3",
  speakerValue: "Player Prompt",
  bodyValue:
    "Describe where your character was when the western sky split open.",
  canRemove: true,
});

export const openingMessageEmptyFixture = Object.freeze({
  ...baseFixture,
  messageLabel: "Opening Message 2",
  bodyValue: "",
  canRemove: true,
});

export const openingMessageLongContentFixture = Object.freeze({
  ...baseFixture,
  messageLabel: "Opening Message 4",
  speakerValue: "Captain Elian Rook",
  bodyValue:
    "The causeway has moved again. What was a straight road at dusk now bends through a district omitted from every civic map, and the patrol sent to investigate has returned carrying records written in their own handwriting from dates that have not happened yet. No one leaves the gatehouse until we understand who—or what—has been rewriting the route.",
  canRemove: true,
});

export const openingMessageManySpeakersFixture = Object.freeze({
  ...baseFixture,
  messageLabel: "Opening Message 5",
  speakerValue: "Archivist Sen",
  speakerOptions: Object.freeze([
    { value: "Narrator", label: "Narrator" },
    { value: "Mara Voss", label: "Mara Voss" },
    { value: "Captain Elian Rook", label: "Captain Elian Rook" },
    { value: "Archivist Sen", label: "Archivist Sen" },
    { value: "The Glass Courier", label: "The Glass Courier" },
    { value: "Warden Ilyra Vale", label: "Warden Ilyra Vale" },
    { value: "Player Prompt", label: "Player Prompt" },
  ]),
  bodyValue:
    "The restricted catalogue is open, but only until the lamps burn out.",
  canRemove: true,
});
