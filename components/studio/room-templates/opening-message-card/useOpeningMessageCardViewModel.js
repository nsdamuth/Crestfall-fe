function normalizeSpeakerOption(character) {
  const title = String(character?.title || "");

  return {
    value: title,
    label: title,
  };
}

export function useOpeningMessageCardViewModel({
  message = {},
  index = 0,
  selectedCharacters = [],
  onChange,
  onRemove,
} = {}) {
  const messageId = message?.id;
  const normalizedIndex = Number.isInteger(index) && index >= 0 ? index : 0;
  const characterOptions = Array.isArray(selectedCharacters)
    ? selectedCharacters.map(normalizeSpeakerOption)
    : [];

  return {
    messageLabel: `Opening Message ${normalizedIndex + 1}`,
    speakerValue: String(message?.speaker || ""),
    speakerOptions: [
      { value: "Narrator", label: "Narrator" },
      ...characterOptions,
      { value: "Player Prompt", label: "Player Prompt" },
    ],
    bodyValue: String(message?.body || ""),
    canRemove: normalizedIndex > 0,
    onChangeSpeaker: (value) => {
      if (!messageId) {
        return;
      }

      onChange?.(messageId, "speaker", value);
    },
    onChangeBody: (value) => {
      if (!messageId) {
        return;
      }

      onChange?.(messageId, "body", value);
    },
    onRemoveMessage: () => {
      if (!messageId || normalizedIndex === 0) {
        return;
      }

      onRemove?.(messageId);
    },
  };
}
