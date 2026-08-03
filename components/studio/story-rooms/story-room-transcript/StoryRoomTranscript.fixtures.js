import {
  storyRoomMessageCharacterFixture,
  storyRoomMessageFailedFixture,
  storyRoomMessageLongFixture,
  storyRoomMessageNarratorFixture,
  storyRoomMessageOpeningFixture,
  storyRoomMessagePlayerFixture,
  storyRoomMessageSystemFixture,
} from "../story-room-message/StoryRoomMessage.fixtures";

function messageItem(id, message) {
  return { id, message };
}

const conversationItems = [
  messageItem("opening", storyRoomMessageOpeningFixture),
  messageItem("player", {
    ...storyRoomMessagePlayerFixture,
    deliveryState: null,
  }),
  messageItem("narrator", storyRoomMessageNarratorFixture),
  messageItem("character", storyRoomMessageCharacterFixture),
  messageItem("system", storyRoomMessageSystemFixture),
];

const historyItems = Array.from({ length: 18 }, (_, index) => {
  const baseMessage = index % 2
    ? storyRoomMessageNarratorFixture
    : storyRoomMessagePlayerFixture;

  return messageItem(`history-${index + 1}`, {
    ...baseMessage,
    speakerLabel: index % 2 ? "The Chronicler" : "You",
    legacyBody:
      baseMessage.legacyBody ||
      `The archive answers with fragment ${index + 1} of the recovered scene.`,
    deliveryState: null,
  });
});

export const storyRoomTranscriptConversationFixture = {
  messageItems: conversationItems,
  loading: false,
  sending: false,
  errorMessage: "",
};

export const storyRoomTranscriptHistoryFixture = {
  messageItems: historyItems,
  loading: false,
  sending: false,
  errorMessage: "",
};

export const storyRoomTranscriptLoadingFixture = {
  messageItems: [],
  loading: true,
  sending: false,
  errorMessage: "",
};

export const storyRoomTranscriptEmptyFixture = {
  messageItems: [],
  loading: false,
  sending: false,
  errorMessage: "",
};

export const storyRoomTranscriptSendingFixture = {
  messageItems: [
    ...conversationItems,
    messageItem("optimistic-player", storyRoomMessagePlayerFixture),
  ],
  loading: false,
  sending: true,
  errorMessage: "",
};

export const storyRoomTranscriptErrorFixture = {
  messageItems: [
    messageItem("failed-player", storyRoomMessageFailedFixture),
  ],
  loading: false,
  sending: false,
  errorMessage: "The Crestfall Engine could not complete this turn.",
};

export const storyRoomTranscriptLongFixture = {
  messageItems: [
    messageItem("long-message", storyRoomMessageLongFixture),
    ...conversationItems,
  ],
  loading: false,
  sending: true,
  errorMessage: "",
};
