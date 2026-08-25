export const STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION = "1.2.0";

export const STORY_ROOM_MESSAGE_SURFACE_TONES = Object.freeze({
  PLAYER: "PLAYER",
  OPENING: "OPENING",
  SYSTEM: "SYSTEM",
  NARRATOR: "NARRATOR",
  CHARACTER: "CHARACTER",
  MEDIA: "MEDIA",
});

export const STORY_ROOM_MESSAGE_CONTENT_TYPES = Object.freeze({
  TEXT: "TEXT",
  AUTO_EVENT_MEDIA: "AUTO_EVENT_MEDIA",
});

export const STORY_ROOM_MESSAGE_MEDIA_SUBTYPES = Object.freeze({
  CHARACTER_EVENT_IMAGE: "CHARACTER_EVENT_IMAGE",
  LOCATION_EVENT_IMAGE: "LOCATION_EVENT_IMAGE",
});

export const STORY_ROOM_MESSAGE_BODY_MODES = Object.freeze({
  LEGACY: "LEGACY",
  SEMANTIC: "SEMANTIC",
});

export const STORY_ROOM_MESSAGE_DELIVERY_STATES = Object.freeze({
  FAILED: "FAILED",
  SENDING: "SENDING",
});

export const STORY_ROOM_MESSAGE_SEGMENT_TYPES = Object.freeze({
  DIALOGUE: "DIALOGUE",
  NARRATION: "NARRATION",
  TEXT: "TEXT",
});

export const STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS = Object.freeze({
  EMPHASIS: "EMPHASIS",
  STRONG: "STRONG",
  WHISPER: "WHISPER",
});

/**
 * Portable View contract.
 *
 * @typedef {Object} StoryRoomMessageViewProps
 * @property {"PLAYER"|"OPENING"|"SYSTEM"|"NARRATOR"|"CHARACTER"|"MEDIA"} surfaceTone
 * @property {"TEXT"|"AUTO_EVENT_MEDIA"} contentType
 * @property {string} speakerLabel
 * @property {string|null} speakerAvatarUrl
 * @property {string} openingLabel
 * @property {string} modeLabel
 * @property {"LEGACY"|"SEMANTIC"} bodyMode
 * @property {string} legacyBody
 * @property {Array<{text:string,type:string,emphasis:string}>} semanticSegments
 * @property {Array<{id:string,text:string}>} statusBlocks
 * @property {{dialogue:string,narration:string,emphasis:string,strong:string,whisper:string,speaker:string,border:string}|null} paletteColors
 * @property {{subtype:string,displayUrl:string,thumbnailUrl:string|null,width:number|null,height:number|null,altText:string,caption:string,entityLabel:string,contentRating:string}|null} media
 * @property {"FAILED"|"SENDING"|null} deliveryState
 *
 * Character and narrator responses may receive display-only paragraph spacing
 * when the authored response contains no line breaks. Existing line breaks and
 * persisted message text remain unchanged.
 */
