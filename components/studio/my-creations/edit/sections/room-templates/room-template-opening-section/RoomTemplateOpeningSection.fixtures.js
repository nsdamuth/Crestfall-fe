const speakerOptions = [
  { value: "Narrator", label: "Narrator" },
  { value: "Captain Vale", label: "Captain Vale" },
  { value: "Mira Ashfall", label: "Mira Ashfall" },
  { value: "Player Prompt", label: "Player Prompt" },
];

const baseFixture = {
  sectionEyebrow: "Story Editor",
  sectionTitle: "Opening Context and Messages",
  sectionDescription:
    "Opening messages define how the room begins. These can come from the narrator, a selected character, or a player-facing prompt.",
  publicOpeningContextLabel: "Public Opening Context",
  publicOpeningContextValue:
    "The party arrives at the observatory as the final bell begins to ring.",
  publicOpeningContextPlaceholder:
    "Visible setup shown at the start of the room.",
  openingImageLabel: "Opening Image",
  openingImageDescription:
    "Choose one eligible image from an attached character or location. New Story rooms display it once above the opening messages.",
  chooseOpeningImageLabel: "Choose Image",
  replaceOpeningImageLabel: "Replace Image",
  removeOpeningImageLabel: "Remove",
  closePickerLabel: "Close",
  openingImageSources: [
    { id: "character-1", type: "CHARACTER", title: "Captain Vale" },
    { id: "location-1", type: "LOCATION", title: "Old Observatory" },
  ],
  selectedOpeningImage: null,
  pickerOpen: false,
  activeSourceId: "",
  pickerImages: [],
  pickerLoading: false,
  pickerError: "",
  speakerLabel: "Speaker",
  speakerOptions,
  messageLabel: "Message",
  messagePlaceholder: "Opening message or prompt.",
  openingMessages: [
    {
      id: "message-1",
      messageLabel: "Opening Message 1",
      speakerValue: "Narrator",
      bodyValue:
        "Rain needles across the brass dome while something enormous moves behind the clouds.",
      canRemove: false,
    },
  ],
  removeMessageLabel: "Remove",
  addMessageLabel: "Add Opening Message",
  onChangePublicOpeningContext: null,
  onOpenOpeningImagePicker: null,
  onCloseOpeningImagePicker: null,
  onSelectOpeningImageSource: null,
  onSelectOpeningImage: null,
  onRemoveOpeningImage: null,
  onChangeOpeningMessageSpeaker: null,
  onChangeOpeningMessageBody: null,
  onAddOpeningMessage: null,
  onRemoveOpeningMessage: null,
};

export const roomTemplateOpeningSectionDefaultFixture = {
  ...baseFixture,
};

export const roomTemplateOpeningSectionSeveralMessagesFixture = {
  ...baseFixture,
  openingMessages: [
    ...baseFixture.openingMessages,
    {
      id: "message-2",
      messageLabel: "Opening Message 2",
      speakerValue: "Captain Vale",
      bodyValue: "No one touches the telescope until I say so.",
      canRemove: true,
    },
    {
      id: "message-3",
      messageLabel: "Opening Message 3",
      speakerValue: "Player Prompt",
      bodyValue: "What brought your character to the observatory tonight?",
      canRemove: true,
    },
  ],
};

export const roomTemplateOpeningSectionFallbackFixture = {
  ...baseFixture,
  publicOpeningContextValue: "",
  openingMessages: [
    {
      id: "message-1",
      messageLabel: "Opening Message 1",
      speakerValue: "Narrator",
      bodyValue: "",
      canRemove: false,
    },
  ],
};

export const roomTemplateOpeningSectionNoCharacterSpeakersFixture = {
  ...baseFixture,
  speakerOptions: [
    { value: "Narrator", label: "Narrator" },
    { value: "Player Prompt", label: "Player Prompt" },
  ],
};

export const roomTemplateOpeningSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Opening Context and Messages for a Long-Running Ensemble Chronicle",
  sectionDescription:
    "Opening messages define how a reusable Story begins across narrator-led sessions, invited group rooms, optional player-character participation, and longer collaborative scenes where several speakers may establish the initial situation.",
  publicOpeningContextValue:
    "At the edge of the old capital, beneath a sky filled with ash and the reflected glow of distant signal fires, envoys from rival houses gather inside a sealed observatory that has not opened its doors in three generations.",
  openingMessages: [
    {
      id: "message-1",
      messageLabel: "Opening Message 1",
      speakerValue: "Narrator",
      bodyValue:
        "The final lock turns with a sound like distant thunder. Dust rolls from the carved ceiling, the ancient telescope begins to move on its own, and every candle in the observatory leans toward the eastern window.",
      canRemove: false,
    },
    {
      id: "message-2",
      messageLabel: "Opening Message 2",
      speakerValue: "Mira Ashfall",
      bodyValue:
        "We have less than an hour before the city gates close. Whatever this place was built to show us, we need to see it now.",
      canRemove: true,
    },
  ],
};

export const roomTemplateOpeningSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Story Package",
  sectionTitle: "Session Opening",
  sectionDescription:
    "Preview alternate presentation copy without changing the application contract.",
  publicOpeningContextLabel: "Visible Setup",
  speakerLabel: "Opening Voice",
  messageLabel: "Opening Text",
  removeMessageLabel: "Delete Message",
  addMessageLabel: "Add Another Opening",
};

export const roomTemplateOpeningSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangePublicOpeningContext: null,
  onChangeOpeningMessageSpeaker: null,
  onChangeOpeningMessageBody: null,
  onAddOpeningMessage: null,
  onRemoveOpeningMessage: null,
};


export const roomTemplateOpeningSectionSelectedImageFixture = {
  ...baseFixture,
  selectedOpeningImage: {
    id: "entry-1",
    sourceEntityType: "LOCATION",
    sourceCreationId: "location-1",
    sourceTitle: "Old Observatory",
    libraryEntryId: "entry-1",
    imageOutputId: "output-1",
    displayUrl: "https://example.invalid/opening.webp",
    thumbnailUrl: "https://example.invalid/opening-thumb.webp",
    width: 1600,
    height: 900,
    contentRating: "SFW",
  },
};

export const roomTemplateOpeningSectionPickerFixture = {
  ...baseFixture,
  pickerOpen: true,
  activeSourceId: "location-1",
  pickerImages: [
    {
      id: "entry-1",
      imageOutputId: "output-1",
      displayUrl: "https://example.invalid/opening.webp",
      thumbnailUrl: "https://example.invalid/opening-thumb.webp",
      width: 1600,
      height: 900,
      source: { id: "location-1", type: "LOCATION", title: "Old Observatory" },
    },
  ],
};
