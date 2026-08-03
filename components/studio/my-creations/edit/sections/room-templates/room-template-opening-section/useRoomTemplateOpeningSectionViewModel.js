const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Editor",
  sectionTitle: "Opening Context and Messages",
  sectionDescription:
    "Opening messages define how the room begins. These can come from the narrator, a selected character, or a player-facing prompt.",
  publicOpeningContextLabel: "Public Opening Context",
  publicOpeningContextPlaceholder:
    "Visible setup shown at the start of the room.",
  speakerLabel: "Speaker",
  messageLabel: "Message",
  messagePlaceholder: "Opening message or prompt.",
  removeMessageLabel: "Remove",
  addMessageLabel: "Add Opening Message",
});

export const DEFAULT_ROOM_TEMPLATE_OPENING_MESSAGE = Object.freeze({
  id: "message-1",
  speaker: "Narrator",
  body: "",
});

export function getRoomTemplateOpeningMessages(value) {
  if (Array.isArray(value) && value.length) return value;

  return [{ ...DEFAULT_ROOM_TEMPLATE_OPENING_MESSAGE }];
}

export function getRoomTemplateOpeningSpeakerOptions(data = {}) {
  const selectedCharacters = Array.isArray(data.selected_characters)
    ? data.selected_characters
    : [];

  return [
    { value: "Narrator", label: "Narrator" },
    ...selectedCharacters.map((character) => ({
      value: character.title,
      label: character.title,
    })),
    { value: "Player Prompt", label: "Player Prompt" },
  ];
}

function toDisplayOpeningMessage(message, index) {
  return {
    id: message.id,
    messageLabel: `Opening Message ${index + 1}`,
    speakerValue: message.speaker,
    bodyValue: message.body,
    canRemove: index !== 0,
  };
}

export function getRoomTemplateOpeningSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const openingMessages = getRoomTemplateOpeningMessages(data.opening_messages);

  function updateOpeningMessages(nextMessages) {
    updateDataField?.("opening_messages", nextMessages);
  }

  function updateOpeningMessage(id, field, value) {
    updateOpeningMessages(
      openingMessages.map((message) =>
        message.id === id
          ? {
              ...message,
              [field]: value,
            }
          : message
      )
    );
  }

  return {
    ...DEFAULT_COPY,
    publicOpeningContextValue: data.public_opening_context || "",
    speakerOptions: getRoomTemplateOpeningSpeakerOptions(data),
    openingMessages: openingMessages.map(toDisplayOpeningMessage),
    onChangePublicOpeningContext: (value) =>
      updateDataField?.("public_opening_context", value),
    onChangeOpeningMessageSpeaker: (id, value) =>
      updateOpeningMessage(id, "speaker", value),
    onChangeOpeningMessageBody: (id, value) =>
      updateOpeningMessage(id, "body", value),
    onAddOpeningMessage: () =>
      updateOpeningMessages([
        ...openingMessages,
        {
          id: `message-${openingMessages.length + 1}`,
          speaker: "Narrator",
          body: "",
        },
      ]),
    onRemoveOpeningMessage: (id) => {
      if (openingMessages.length === 1) return;

      updateOpeningMessages(
        openingMessages.filter((message) => message.id !== id)
      );
    },
  };
}

export function useRoomTemplateOpeningSectionViewModel(props = {}) {
  return getRoomTemplateOpeningSectionViewProps(props);
}
