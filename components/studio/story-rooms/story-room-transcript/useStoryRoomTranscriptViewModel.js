import { getStoryRoomMessageViewProps } from "../story-room-message/useStoryRoomMessageViewModel";

function normalizeErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error ? String(error) : "";
}

export function useStoryRoomTranscriptViewModel({
  messages,
  loading = false,
  sending = false,
  error = null,
} = {}) {
  const safeMessages = Array.isArray(messages) ? messages : [];

  return {
    messageItems: safeMessages.map((message, index) => ({
      id: String(message?.id ?? `story-room-message-${index}`),
      message: getStoryRoomMessageViewProps(message),
    })),
    loading: Boolean(loading),
    sending: Boolean(sending),
    errorMessage: normalizeErrorMessage(error),
  };
}
