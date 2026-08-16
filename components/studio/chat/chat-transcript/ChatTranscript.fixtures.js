import {
  chatMessageCharacterEventMediaFixture,
  chatMessageCharacterLegacyFixture,
  chatMessageCharacterSemanticFixture,
  chatMessageLocationEventMediaFixture,
  chatMessageLongestFixture,
  chatMessageNarratorSemanticFixture,
  chatMessageOpeningLegacyFixture,
  chatMessagePlayerLegacyFixture,
  chatMessagePlayerSemanticFixture,
} from "../chat-message/ChatMessage.fixtures";

const HERO_IMAGE = {
  displayUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700'%3E%3Crect width='1400' height='700' fill='%23151A26'/%3E%3Cpath d='M0 560 L260 300 L470 500 L760 180 L1040 470 L1230 270 L1400 430 L1400 700 L0 700 Z' fill='%23315E8A'/%3E%3Ctext x='70' y='100' font-size='46' fill='%23F3F8FF'%3ECrestfall%3C/text%3E%3C/svg%3E",
  width: 1400,
  height: 700,
  altText: "Establishing image for the opening scene",
};

function messageItem(id, message) {
  return { id, message };
}

// Media re-slotting: the caller (chat page shell, once C5 lands) is
// responsible for ordering media messages before or after the message
// that triggered them; this package renders messageItems in the order it
// receives them, same boundary as the crestfall-main baseline.
const reslottedConversation = [
  messageItem("m1", chatMessageOpeningLegacyFixture),
  messageItem("m2", chatMessagePlayerLegacyFixture),
  messageItem("m3", chatMessageCharacterSemanticFixture),
  messageItem("m4", chatMessageCharacterEventMediaFixture),
  messageItem("m5", chatMessagePlayerSemanticFixture),
  messageItem("m6", chatMessageNarratorSemanticFixture),
  messageItem("m7", chatMessageLocationEventMediaFixture),
  messageItem("m8", chatMessageCharacterLegacyFixture),
];

export const chatTranscriptDefaultFixture = {
  openingHeroImage: HERO_IMAGE,
  messageItems: reslottedConversation,
  loading: false,
  sending: false,
  summaryPending: false,
  errorMessage: "",
  composerHeightPx: 96,
};

const windowedConversation = Array.from({ length: 18 }, (_, index) => {
  const source = index % 2 === 0 ? chatMessageCharacterSemanticFixture : chatMessagePlayerLegacyFixture;

  return messageItem(`windowed-${index}`, {
    ...source,
    speakerLabel: index % 2 === 0 ? "Lady Verena Ashcroft" : "You",
    legacyBody: source.legacyBody ? `${source.legacyBody} (turn ${index + 1})` : source.legacyBody,
  });
});

export const chatTranscriptWindowedFixture = {
  openingHeroImage: HERO_IMAGE,
  messageItems: windowedConversation,
  loading: false,
  sending: false,
  summaryPending: false,
  errorMessage: "",
  composerHeightPx: 96,
};

export const chatTranscriptEmptyFixture = {
  openingHeroImage: null,
  messageItems: [],
  loading: false,
  sending: false,
  summaryPending: false,
  errorMessage: "",
  composerHeightPx: 96,
};

export const chatTranscriptLoadingFixture = {
  openingHeroImage: null,
  messageItems: [],
  loading: true,
  sending: false,
  summaryPending: false,
  errorMessage: "",
  composerHeightPx: 96,
};

export const chatTranscriptSendingFixture = {
  ...chatTranscriptDefaultFixture,
  sending: true,
};

export const chatTranscriptSummaryPendingFixture = {
  ...chatTranscriptDefaultFixture,
  summaryPending: true,
};

export const chatTranscriptErrorFixture = {
  ...chatTranscriptDefaultFixture,
  errorMessage: "The Story could not be reached. Check your connection and try again.",
};

export const chatTranscriptLongestFixture = {
  openingHeroImage: HERO_IMAGE,
  messageItems: [
    ...reslottedConversation,
    messageItem("m-longest", chatMessageLongestFixture),
  ],
  loading: false,
  sending: false,
  summaryPending: false,
  errorMessage: "",
  composerHeightPx: 160,
};

export const chatTranscriptFixtures = [
  { id: "default", label: "Default, hero + re-slotted media", props: chatTranscriptDefaultFixture },
  { id: "windowed", label: "Windowed, Load Earlier (18 messages)", props: chatTranscriptWindowedFixture },
  { id: "empty", label: "Empty", props: chatTranscriptEmptyFixture },
  { id: "loading", label: "Loading", props: chatTranscriptLoadingFixture },
  { id: "sending", label: "Sending", props: chatTranscriptSendingFixture },
  { id: "summary-pending", label: "Summary pending", props: chatTranscriptSummaryPendingFixture },
  { id: "error", label: "Error", props: chatTranscriptErrorFixture },
  { id: "longest", label: "Longest content", props: chatTranscriptLongestFixture },
];
