export const CHAT_MESSAGE_VIEW_CONTRACT_VERSION = "1.3.0";

export const CHAT_MESSAGE_SURFACE_TONES = Object.freeze({
  PLAYER: "PLAYER",
  CHARACTER: "CHARACTER",
  NARRATOR: "NARRATOR",
  SYSTEM: "SYSTEM",
  MEDIA: "MEDIA",
  OPENING: "OPENING",
});

export const CHAT_MESSAGE_CONTENT_TYPES = Object.freeze({
  TEXT: "TEXT",
  AUTO_EVENT_MEDIA: "AUTO_EVENT_MEDIA",
});

export const CHAT_MESSAGE_MEDIA_SUBTYPES = Object.freeze({
  CHARACTER_EVENT_IMAGE: "CHARACTER_EVENT_IMAGE",
  LOCATION_EVENT_IMAGE: "LOCATION_EVENT_IMAGE",
});

export const CHAT_MESSAGE_BODY_MODES = Object.freeze({
  LEGACY: "LEGACY",
  SEMANTIC: "SEMANTIC",
});

export const CHAT_MESSAGE_DELIVERY_STATES = Object.freeze({
  FAILED: "FAILED",
  SENDING: "SENDING",
});

export const CHAT_MESSAGE_COPY_STATES = Object.freeze({
  COPIED: "COPIED",
  FAILED: "FAILED",
});

export const CHAT_MESSAGE_SEGMENT_TYPES = Object.freeze({
  DIALOGUE: "DIALOGUE",
  NARRATION: "NARRATION",
  TEXT: "TEXT",
  THOUGHT: "THOUGHT",
  MESSAGE: "MESSAGE",
  TELEPATHY: "TELEPATHY",
});

export const CHAT_MESSAGE_SEGMENT_EMPHASIS = Object.freeze({
  EMPHASIS: "EMPHASIS",
  STRONG: "STRONG",
  WHISPER: "WHISPER",
});

/**
 * Portable View contract, wave C1 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline
 * (story-room-message 1.4.0): adds isStreaming/generationCursorLabel
 * (O9, streaming-ready contracts, transport lands later without a
 * contract change) and paletteRoleOverrides gated by
 * enableFixturePaletteDemo (O7 option A; the neutral token path is the
 * only path a product caller may enable until the chat-scoped palette
 * family proposed in docs/DESIGN-TOKENS.md is ratified).
 *
 * @typedef {Object} ChatMessageSegment
 * @property {string} text
 * @property {"DIALOGUE"|"NARRATION"|"TEXT"|"THOUGHT"|"MESSAGE"|"TELEPATHY"} type
 * @property {""|"EMPHASIS"|"STRONG"|"WHISPER"} emphasis
 *
 * @typedef {Object} ChatMessageStatusBlock
 * @property {string} id
 * @property {string} text
 *
 * @typedef {Object} ChatMessageMedia
 * @property {"CHARACTER_EVENT_IMAGE"|"LOCATION_EVENT_IMAGE"} subtype
 * @property {string} displayUrl
 * @property {string|null} thumbnailUrl
 * @property {number|null} width
 * @property {number|null} height
 * @property {string} altText
 * @property {string} caption
 * @property {string} entityLabel
 * @property {string} contentRating
 *
 * @typedef {Object} ChatMessagePaletteRoleOverrides
 * @property {string} dialogue
 * @property {string} narration
 * @property {string} emphasis
 * @property {string} strong
 * @property {string} whisper
 * @property {string} speaker
 * @property {string} border
 *
 * @typedef {Object} ChatMessageViewProps
 * @property {"PLAYER"|"CHARACTER"|"NARRATOR"|"SYSTEM"|"MEDIA"|"OPENING"} surfaceTone
 * @property {"TEXT"|"AUTO_EVENT_MEDIA"} contentType
 * @property {string} speakerLabel
 * @property {string|null} speakerAvatarUrl
 * @property {string|null} speakerColor added 1.1.0, 23 Aug 2026
 *   (build-0823 pass 2, the tinted bubble law). A CSS color the View
 *   sets as the inline --chat-speaker custom property for this
 *   message; the bubble fill, border, avatar tile, and the gap-6
 *   clamped speaker-name ink all derive from it. Null or omitted
 *   falls back to --gold-ornament, the pre-1.1.0 rendering.
 * @property {string} openingLabel
 * @property {string} modeLabel
 * @property {"LEGACY"|"SEMANTIC"} bodyMode
 * @property {string} legacyBody
 * @property {ChatMessageSegment[]} semanticSegments
 * @property {ChatMessageStatusBlock[]} statusBlocks
 * @property {boolean} isStreaming Generation-cursor state (O9); a trailing cursor glyph renders at the end of the body while true.
 * @property {string} generationCursorLabel Screen-reader label for the live-generating region, only read while isStreaming is true.
 * @property {boolean} enableFixturePaletteDemo Fixture-only. Never true in a Shell, ViewModel, or any product page. Gates paletteRoleOverrides until the proposed chat-scoped token family is ratified.
 * @property {ChatMessagePaletteRoleOverrides|null} paletteRoleOverrides
 * @property {ChatMessageMedia|null} media
 * @property {"FAILED"|"SENDING"|null} deliveryState
 * @property {boolean} canCopy
 * @property {"COPIED"|"FAILED"|null} copyState
 * @property {(() => void)|null} onCopy
 * @property {boolean} canRegenerate
 * @property {boolean} regeneratePending
 * @property {string} regenerateError
 * @property {(() => void)|null} onRegenerate
 * @property {boolean} canContinue
 * @property {boolean} continuePending
 * @property {string} continueError
 * @property {(() => void)|null} onContinue
 * @property {boolean} canReport
 * @property {boolean} reportPending
 * @property {boolean} reportSubmitted
 * @property {string} reportError
 * @property {(() => void)|null} onReport
 *
 * Character and narrator responses may receive display-only paragraph
 * spacing when the authored response contains no line breaks. Existing
 * line breaks and persisted message text remain unchanged.
 */
