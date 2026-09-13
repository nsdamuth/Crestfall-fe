export const STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION = "2.1.0";

// 2.1.0, fe/chat-studio brief 4 item 9 (13 Sep 2026). Presentation
// only, no prop changed: character, narrator, and player bubbles widen
// from 70 to 85 percent of the transcript column at the shipped 700px
// breakpoint and up (the player's from the right edge, the others from
// the left); below it the 86 percent width stays as shipped.

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

export const STORY_ROOM_MESSAGE_COPY_STATES = Object.freeze({
  COPIED: "COPIED",
  FAILED: "FAILED",
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
 * 2.0.0, fe/chat-studio item 4 (12 Sep 2026). BREAKING: `paletteColors`
 * (the seven-role hex object) is removed; the View no longer writes any
 * palette hex. ADDITIVE: `speakerColor` (the character palette's anchor,
 * already emitted since 1.4.0) now drives the speaker name through the
 * locked --chat-speaker-name token, and `bubbleColor` (the chat color:
 * the creator default from the character palette, or the user's
 * Preferences override) tints the player's bubble through
 * --chat-bubble-fill. Bubbles: player right-aligned, every other speaker
 * left-aligned, no borders, --radius-bubble, body at the ui step,
 * narration italic, whisper paragraphs as a quiet inset, body ink always
 * --ink.
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
 * @property {string|null} speakerColor The character palette anchor for the speaker name (contract data, applied as the --chat-speaker custom property).
 * @property {string|null} bubbleColor The chat color for the player's bubble; null on every other tone.
 * @property {{subtype:string,displayUrl:string,thumbnailUrl:string|null,width:number|null,height:number|null,altText:string,caption:string,entityLabel:string,contentRating:string}|null} media
 * @property {"FAILED"|"SENDING"|null} deliveryState
 * @property {boolean} canCopy
 * @property {"COPIED"|"FAILED"|null} copyState
 * @property {(() => void)|null} onCopy
 * @property {boolean} canRegenerate
 * @property {boolean} regenerateDisabled
 * @property {string} regenerateDisabledReason
 * @property {boolean} regeneratePending
 * @property {string} regenerateError
 * @property {(() => void)|null} onRegenerate
 * @property {boolean} canContinue
 * @property {boolean} continueDisabled
 * @property {string} continueDisabledReason
 * @property {boolean} continuePending
 * @property {string} continueError
 * @property {(() => void)|null} onContinue
 * @property {boolean} canReport
 * @property {boolean} reportPending
 * @property {boolean} reportSubmitted
 * @property {string} reportError
 * @property {(() => void)|null} onReport
 *
 * Character and narrator responses may receive display-only paragraph spacing
 * when the authored response contains no line breaks. Existing line breaks and
 * persisted message text remain unchanged.
 */
