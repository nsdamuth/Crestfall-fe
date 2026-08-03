import {
  STORY_ROOM_MESSAGE_BODY_MODES,
  STORY_ROOM_MESSAGE_DELIVERY_STATES,
  STORY_ROOM_MESSAGE_SURFACE_TONES,
} from "./StoryRoomMessage.contract";

const crestfallPalette = {
  dialogue: "#F5E7C7",
  narration: "#C89B5A",
  emphasis: "#E2B96F",
  strong: "#FFD99A",
  whisper: "#AFA08A",
  speaker: "#D6B36A",
  border: "#8A6A3C",
};

const winterPalette = {
  dialogue: "#F3F8FF",
  narration: "#5FC6FF",
  emphasis: "#D77CFF",
  strong: "#FF5FA2",
  whisper: "#93A8C7",
  speaker: "#78D7FF",
  border: "#315E8A",
};

export const storyRoomMessagePlayerFixture = {
  surfaceTone: STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER,
  speakerLabel: "You",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "Action",
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody:
    "I step through the archway and **raise the lantern**.\n\n*The metal frame creaks softly in my hand.*",
  semanticSegments: [],
  statusBlocks: [],
  paletteColors: null,
  deliveryState: STORY_ROOM_MESSAGE_DELIVERY_STATES.SENDING,
};

export const storyRoomMessageNarratorFixture = {
  surfaceTone: STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR,
  speakerLabel: "The Chronicler",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "Narration",
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    {
      type: "NARRATION",
      emphasis: "",
      text: "Cold rain traces silver lines down the ruined windows. ",
    },
    {
      type: "DIALOGUE",
      emphasis: "STRONG",
      text: '"Someone has already been here."',
    },
  ],
  statusBlocks: [
    {
      id: "location",
      text: "Location: The Glass Archive",
    },
    {
      id: "weather",
      text: "Weather: Cold rain",
    },
  ],
  paletteColors: crestfallPalette,
  deliveryState: null,
};

export const storyRoomMessageOpeningFixture = {
  surfaceTone: STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING,
  speakerLabel: "Narrator",
  speakerAvatarUrl: null,
  openingLabel: "Opening Scene",
  modeLabel: "Scene",
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody:
    "> The bells of Crestfall ring thirteen times.\n> **No one remembers building the thirteenth tower.**\n\n*The city holds its breath.*",
  semanticSegments: [],
  statusBlocks: [],
  paletteColors: null,
  deliveryState: null,
};

export const storyRoomMessageSystemFixture = {
  surfaceTone: STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM,
  speakerLabel: "Crestfall Engine",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "System",
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: "The active location changed to The Glass Archive.",
  semanticSegments: [],
  statusBlocks: [],
  paletteColors: null,
  deliveryState: null,
};

export const storyRoomMessageCharacterFixture = {
  surfaceTone: STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER,
  speakerLabel: "Lady Verena Ashcroft",
  speakerAvatarUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E",
  openingLabel: "",
  modeLabel: "Dialogue",
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.SEMANTIC,
  legacyBody: "",
  semanticSegments: [
    {
      type: "DIALOGUE",
      emphasis: "",
      text: '"You should not have followed me. "',
    },
    {
      type: "DIALOGUE",
      emphasis: "WHISPER",
      text: '"Not tonight."',
    },
    {
      type: "NARRATION",
      emphasis: "EMPHASIS",
      text: " Her hand closes around the hidden key.",
    },
  ],
  statusBlocks: [],
  paletteColors: winterPalette,
  deliveryState: null,
};

export const storyRoomMessageFailedFixture = {
  ...storyRoomMessagePlayerFixture,
  modeLabel: "Dialogue",
  legacyBody: "Can anyone hear me?",
  deliveryState: STORY_ROOM_MESSAGE_DELIVERY_STATES.FAILED,
};

export const storyRoomMessageLongFixture = {
  ...storyRoomMessageNarratorFixture,
  speakerLabel:
    "The Archivist of the Unreasonably Long and Ceremonial Northern Annex",
  semanticSegments: [
    {
      type: "NARRATION",
      emphasis: "",
      text:
        "The corridor continues far beyond the reach of the lantern, lined with thousands of brass drawers, each marked with a date that has not happened yet. ",
    },
    {
      type: "DIALOGUE",
      emphasis: "STRONG",
      text:
        '"Choose carefully. Every drawer remembers the person who opened it, even when that person no longer remembers themselves."',
    },
  ],
};

export const storyRoomMessageMinimalFixture = {
  surfaceTone: STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER,
  speakerLabel: "",
  speakerAvatarUrl: null,
  openingLabel: "",
  modeLabel: "",
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody: "",
  semanticSegments: [],
  statusBlocks: [],
  paletteColors: null,
  deliveryState: null,
};

export const storyRoomMessageZeroNewlineActionDialogueActionFixture = {
  ...storyRoomMessageCharacterFixture,
  semanticSegments: [
    {
      type: "NARRATION",
      emphasis: "",
      text: "She steadied the lantern between them. ",
    },
    {
      type: "DIALOGUE",
      emphasis: "",
      text: '"Stay behind me." ',
    },
    {
      type: "NARRATION",
      emphasis: "EMPHASIS",
      text: "Her hand closed around the latch.",
    },
  ],
};

export const storyRoomMessageZeroNewlineDialogueActionDialogueFixture = {
  ...storyRoomMessageCharacterFixture,
  semanticSegments: [
    {
      type: "DIALOGUE",
      emphasis: "",
      text: '"You heard it too." ',
    },
    {
      type: "NARRATION",
      emphasis: "",
      text: "He glanced toward the sealed doorway. ",
    },
    {
      type: "DIALOGUE",
      emphasis: "WHISPER",
      text: '"Then do not open it."',
    },
  ],
};

export const storyRoomMessageZeroNewlineLegacyFixture = {
  ...storyRoomMessageCharacterFixture,
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody:
    '*She folded the note once.* "This changes nothing." *She slipped it into her coat.*',
  semanticSegments: [],
};

export const storyRoomMessageExistingMultilineFixture = {
  ...storyRoomMessageCharacterFixture,
  semanticSegments: [
    {
      type: "NARRATION",
      emphasis: "",
      text: "She crossed the room.\n\n",
    },
    {
      type: "DIALOGUE",
      emphasis: "",
      text: '"Wait here."',
    },
  ],
};

export const storyRoomMessageOrdinaryZeroNewlineProseFixture = {
  ...storyRoomMessageCharacterFixture,
  bodyMode: STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody:
    "The archive remained silent while the last lamp burned down to a blue ember.",
  semanticSegments: [],
};
