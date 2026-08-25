import {
  CHAT_MESSAGE_BODY_MODES,
  CHAT_MESSAGE_CONTENT_TYPES,
  CHAT_MESSAGE_DELIVERY_STATES,
  CHAT_MESSAGE_MEDIA_SUBTYPES,
  CHAT_MESSAGE_SURFACE_TONES,
} from "./ChatMessage.contract";

const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E";

// Fixture-only demonstration palette. Never referenced outside this file:
// enableFixturePaletteDemo gates it out of every product render path (O7,
// docs/plans/FABLE-GATE-PLAN.md; docs/DESIGN-TOKENS.md "Proposed" table).
const demoPaletteRoleOverrides = {
  dialogue: "#F3F8FF",
  narration: "#5FC6FF",
  emphasis: "#D77CFF",
  strong: "#FF5FA2",
  whisper: "#93A8C7",
  speaker: "#78D7FF",
  border: "#315E8A",
};

export const chatMessagePlayerLegacyFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.PLAYER,
  speakerLabel: "You",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "Action",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody:
    "I step through the archway and **raise the lantern**.\n\n*The metal frame creaks softly in my hand.*",
  semanticSegments: [],
  statusBlocks: [],
  deliveryState: null,
};

export const chatMessagePlayerSemanticFixture = {
  ...chatMessagePlayerLegacyFixture,
  bodyMode: CHAT_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    { type: "NARRATION", emphasis: "", text: "I step through the archway. " },
    { type: "DIALOGUE", emphasis: "STRONG", text: '"Is anyone here?"' },
  ],
};

export const chatMessageCharacterLegacyFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.CHARACTER,
  speakerLabel: "Lady Verena Ashcroft",
  speakerAvatarUrl: AVATAR_DATA_URL,
  openingLabel: "",
  modeLabel: "Dialogue",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: '*She folded the note once.* "This changes nothing." *She slipped it into her coat.*',
  semanticSegments: [],
  statusBlocks: [],
  deliveryState: null,
};

export const chatMessageCharacterSemanticFixture = {
  ...chatMessageCharacterLegacyFixture,
  bodyMode: CHAT_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    { type: "DIALOGUE", emphasis: "", text: '"You should not have followed me. "' },
    { type: "DIALOGUE", emphasis: "WHISPER", text: '"Not tonight."' },
    { type: "NARRATION", emphasis: "EMPHASIS", text: " Her hand closes around the hidden key." },
  ],
};

export const chatMessageNarratorLegacyFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.NARRATOR,
  speakerLabel: "The Chronicler",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "Narration",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: "Cold rain traces silver lines down the ruined windows.",
  semanticSegments: [],
  statusBlocks: [],
  deliveryState: null,
};

export const chatMessageNarratorSemanticFixture = {
  ...chatMessageNarratorLegacyFixture,
  bodyMode: CHAT_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    { type: "NARRATION", emphasis: "", text: "Cold rain traces silver lines down the ruined windows. " },
    { type: "DIALOGUE", emphasis: "STRONG", text: '"Someone has already been here."' },
  ],
  statusBlocks: [
    { id: "location", text: "Location: The Glass Archive" },
    { id: "weather", text: "Weather: Cold rain" },
  ],
};

export const chatMessageSystemLegacyFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.SYSTEM,
  speakerLabel: "",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: "The active location changed to The Glass Archive.",
  semanticSegments: [],
  statusBlocks: [],
  deliveryState: null,
};

export const chatMessageSystemSemanticFixture = {
  ...chatMessageSystemLegacyFixture,
  bodyMode: CHAT_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    { type: "TEXT", emphasis: "", text: "The scene recap is ready." },
  ],
};

export const chatMessageOpeningLegacyFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.OPENING,
  speakerLabel: "Narrator",
  speakerAvatarUrl: null,
  openingLabel: "Opening Scene",
  modeLabel: "Scene",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody:
    "> The bells of Crestfall ring thirteen times.\n> **No one remembers building the thirteenth tower.**\n\n*The city holds its breath.*",
  semanticSegments: [],
  statusBlocks: [],
  deliveryState: null,
};

export const chatMessageOpeningSemanticFixture = {
  ...chatMessageOpeningLegacyFixture,
  bodyMode: CHAT_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    { type: "NARRATION", emphasis: "", text: "The bells of Crestfall ring thirteen times. " },
    { type: "NARRATION", emphasis: "STRONG", text: "No one remembers building the thirteenth tower." },
  ],
};

export const chatMessageCharacterEventMediaFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.MEDIA,
  contentType: CHAT_MESSAGE_CONTENT_TYPES.AUTO_EVENT_MEDIA,
  speakerLabel: "Lady Verena Ashcroft",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: "",
  semanticSegments: [],
  statusBlocks: [],
  media: {
    subtype: CHAT_MESSAGE_MEDIA_SUBTYPES.CHARACTER_EVENT_IMAGE,
    displayUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='1200' height='675' fill='%23151A26'/%3E%3Ccircle cx='600' cy='260' r='115' fill='%23315E8A'/%3E%3Cpath d='M380 650 Q600 360 820 650' fill='%23315E8A'/%3E%3Ctext x='600' y='90' text-anchor='middle' font-size='42' fill='%23F3F8FF'%3ELady Verena Ashcroft%3C/text%3E%3C/svg%3E",
    thumbnailUrl: null,
    width: 1200,
    height: 675,
    altText: "Character image for Lady Verena Ashcroft",
    caption: "",
    entityLabel: "Lady Verena Ashcroft",
    contentRating: "SFW",
  },
  deliveryState: null,
};

export const chatMessageLocationEventMediaFixture = {
  ...chatMessageCharacterEventMediaFixture,
  media: {
    subtype: CHAT_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE,
    displayUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700'%3E%3Crect width='1400' height='700' fill='%230B1018'/%3E%3Cpath d='M0 560 L260 300 L470 500 L760 180 L1040 470 L1230 270 L1400 430 L1400 700 L0 700 Z' fill='%23315E8A'/%3E%3Ccircle cx='1130' cy='145' r='58' fill='%23D6B36A'/%3E%3Ctext x='70' y='100' font-size='46' fill='%23F3F8FF'%3EThe Glass Archive%3C/text%3E%3C/svg%3E",
    thumbnailUrl: null,
    width: 1400,
    height: 700,
    altText: "Establishing image for The Glass Archive",
    caption: "The Glass Archive",
    entityLabel: "The Glass Archive",
    contentRating: "SFW",
  },
};

export const chatMessageSendingFixture = {
  ...chatMessagePlayerLegacyFixture,
  legacyBody: "Can anyone hear me?",
  deliveryState: CHAT_MESSAGE_DELIVERY_STATES.SENDING,
};

export const chatMessageFailedFixture = {
  ...chatMessagePlayerLegacyFixture,
  legacyBody: "Can anyone hear me?",
  deliveryState: CHAT_MESSAGE_DELIVERY_STATES.FAILED,
};

export const chatMessageStreamingFixture = {
  ...chatMessageCharacterSemanticFixture,
  isStreaming: true,
  generationCursorLabel: "Lady Verena Ashcroft is composing a response",
};

export const chatMessagePaletteDemoOnFixture = {
  ...chatMessageCharacterSemanticFixture,
  enableFixturePaletteDemo: true,
  paletteRoleOverrides: demoPaletteRoleOverrides,
};

export const chatMessagePaletteDemoOffFixture = {
  ...chatMessageCharacterSemanticFixture,
  enableFixturePaletteDemo: false,
  paletteRoleOverrides: demoPaletteRoleOverrides,
};

// Preview-safe no-op callbacks (CRESTFALL_LOOM_PATTERN.md section 6):
// they only prove the action row renders in the isolated View preview,
// never call an API, and are replaced by real handlers once wave C5's
// chat page shell binds a live room.
function noop() {}

export const chatMessageActionsFixture = {
  ...chatMessageCharacterSemanticFixture,
  canCopy: true,
  onCopy: noop,
  canRegenerate: true,
  onRegenerate: noop,
  canContinue: true,
  onContinue: noop,
  canReport: true,
  onReport: noop,
};

export const chatMessageActionsPendingFixture = {
  ...chatMessageActionsFixture,
  regeneratePending: true,
};

export const chatMessageActionsErrorFixture = {
  ...chatMessageActionsFixture,
  regenerateError: "The Crestfall Engine did not respond in time.",
};

export const chatMessageMinimalFixture = {
  surfaceTone: CHAT_MESSAGE_SURFACE_TONES.CHARACTER,
  speakerLabel: "",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "",
  bodyMode: CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: "",
  semanticSegments: [],
  statusBlocks: [],
  deliveryState: null,
};

export const chatMessageLongestFixture = {
  ...chatMessageNarratorSemanticFixture,
  speakerLabel:
    "The Archivist of the Unreasonably Long and Ceremonial Northern Annex of the Glass Archive",
  semanticSegments: [
    {
      type: "NARRATION",
      emphasis: "",
      text:
        "The corridor continues far beyond the reach of the lantern, lined with thousands of brass drawers, each marked with a date that has not happened yet. Dust hangs motionless in the cold air, undisturbed for what could be decades or could be hours; time does not behave here the way it behaves anywhere else in the city, and the Archivist has long since stopped trying to measure it. ",
    },
    {
      type: "DIALOGUE",
      emphasis: "STRONG",
      text:
        '"Choose carefully. Every drawer remembers the person who opened it, even when that person no longer remembers themselves, and the Archive does not give back what it has already decided to keep."',
    },
  ],
  statusBlocks: [
    { id: "location", text: "Location: The Northern Annex, deep archive wing, sub-level four" },
    { id: "weather", text: "Weather: No weather; the Archive has no windows" },
    { id: "warning", text: "Warning: Memory Boundaries are unusually thin here" },
  ],
  canCopy: true,
  onCopy: noop,
  canRegenerate: true,
  onRegenerate: noop,
  canContinue: true,
  onContinue: noop,
  canReport: true,
  onReport: noop,
};

// Speaker-color set, RULED 23 Aug 2026 (build-0823 pass 2, tinted
// bubble law). Three distinct anchors proving the fill/border/name-ink
// derivation; the no-color fixtures above (player-legacy,
// character-legacy, etc.) already prove the --gold-ornament fallback,
// so no separate "no-color" duplicate is needed.
export const chatMessageSpeakerColorAmberFixture = {
  ...chatMessageCharacterLegacyFixture,
  speakerColor: "#e0ab5e",
};

export const chatMessageSpeakerColorTealFixture = {
  ...chatMessageCharacterLegacyFixture,
  speakerLabel: "Thane Corvid",
  legacyBody: "*He leans against the doorframe.* \"You should not be here.\"",
  speakerColor: "#3ba6a0",
};

export const chatMessageSpeakerColorRoseFixture = {
  ...chatMessagePlayerLegacyFixture,
  speakerColor: "#c25a8f",
};

// Narration-in-bubble: the narration segment renders italic inside the
// same speaker bubble as the dialogue segment, not on a separate
// surface.
export const chatMessageNarrationInBubbleFixture = {
  ...chatMessageCharacterSemanticFixture,
  speakerColor: "#e0ab5e",
  semanticSegments: [
    { type: "NARRATION", emphasis: "", text: "She lowers her voice. " },
    { type: "DIALOGUE", emphasis: "", text: '"Not here. Not tonight."' },
  ],
};

// Player at 390: proves the max-w-[86%] cap independent of the
// max-w-[70%] desktop cap.
export const chatMessagePlayer390Fixture = {
  ...chatMessagePlayerLegacyFixture,
  legacyBody:
    "I am not leaving until someone tells me what happened to the ledger, and I mean that.",
};

export const chatMessageFixtures = [
  { id: "player-legacy", label: "Player, legacy", props: chatMessagePlayerLegacyFixture },
  { id: "player-semantic", label: "Player, semantic", props: chatMessagePlayerSemanticFixture },
  { id: "character-legacy", label: "Character, legacy", props: chatMessageCharacterLegacyFixture },
  { id: "character-semantic", label: "Character, semantic", props: chatMessageCharacterSemanticFixture },
  { id: "narrator-legacy", label: "Narrator, legacy", props: chatMessageNarratorLegacyFixture },
  { id: "narrator-semantic", label: "Narrator, semantic", props: chatMessageNarratorSemanticFixture },
  { id: "system-legacy", label: "System, legacy", props: chatMessageSystemLegacyFixture },
  { id: "system-semantic", label: "System, semantic", props: chatMessageSystemSemanticFixture },
  { id: "opening-legacy", label: "Opening, legacy", props: chatMessageOpeningLegacyFixture },
  { id: "opening-semantic", label: "Opening, semantic", props: chatMessageOpeningSemanticFixture },
  { id: "media-character", label: "Media, character event", props: chatMessageCharacterEventMediaFixture },
  { id: "media-location", label: "Media, location event", props: chatMessageLocationEventMediaFixture },
  { id: "sending", label: "Optimistic, sending", props: chatMessageSendingFixture },
  { id: "failed", label: "Optimistic, failed", props: chatMessageFailedFixture },
  { id: "streaming", label: "Streaming, generation cursor", props: chatMessageStreamingFixture },
  { id: "palette-demo-on", label: "Palette demo on (fixture-only)", props: chatMessagePaletteDemoOnFixture },
  { id: "palette-demo-off", label: "Palette demo off (product path)", props: chatMessagePaletteDemoOffFixture },
  { id: "actions", label: "Actions, rest", props: chatMessageActionsFixture },
  { id: "actions-pending", label: "Actions, regenerate pending", props: chatMessageActionsPendingFixture },
  { id: "actions-error", label: "Actions, regenerate error", props: chatMessageActionsErrorFixture },
  { id: "minimal", label: "Minimal, empty fields", props: chatMessageMinimalFixture },
  { id: "speaker-color-amber", label: "Speaker color, amber anchor", props: chatMessageSpeakerColorAmberFixture },
  { id: "speaker-color-teal", label: "Speaker color, teal anchor", props: chatMessageSpeakerColorTealFixture },
  { id: "speaker-color-rose", label: "Speaker color, rose anchor (player)", props: chatMessageSpeakerColorRoseFixture },
  { id: "narration-in-bubble", label: "Narration inside speaker bubble", props: chatMessageNarrationInBubbleFixture },
  { id: "player-390", label: "Player, 390 width cap", props: chatMessagePlayer390Fixture },
  { id: "longest", label: "Longest content", props: chatMessageLongestFixture },
];
