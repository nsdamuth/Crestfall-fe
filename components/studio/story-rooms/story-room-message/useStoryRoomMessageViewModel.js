import { getCharacterColorPalette } from "@/components/studio/create/character/constants/characterColorPalettes";
import {
  STORY_ROOM_MESSAGE_BODY_MODES,
  STORY_ROOM_MESSAGE_CONTENT_TYPES,
  STORY_ROOM_MESSAGE_MEDIA_SUBTYPES,
  STORY_ROOM_MESSAGE_DELIVERY_STATES,
  STORY_ROOM_MESSAGE_SURFACE_TONES,
} from "./StoryRoomMessage.contract";

const PRESENTATION_CONTRACT_VERSION = "chat.responsePresentation.v1";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function getValidatedPresentation(message) {
  const presentation = normalizeObject(message?.metadata?.presentation);
  const segments = normalizeArray(presentation.segments)
    .filter((segment) => typeof segment?.text === "string" && segment.text)
    .map((segment) => ({
      text: segment.text,
      type: segment.type || "",
      emphasis: segment.emphasis || "",
    }));

  if (
    presentation.contractVersion !== PRESENTATION_CONTRACT_VERSION ||
    !segments.length
  ) {
    return null;
  }

  return {
    paletteId: presentation.paletteId,
    segments,
    statusBlocks: normalizeArray(presentation.statusBlocks)
      .filter(
        (block) =>
          typeof block?.renderedText === "string" && block.renderedText
      )
      .map((block, index) => ({
        id: String(block.id || `status-block-${index}`),
        text: block.renderedText,
      })),
  };
}

function getAutoEventMedia(message) {
  const media = normalizeObject(message?.metadata?.autoEventMedia);
  const displayUrl =
    typeof media.displayUrl === "string" ? media.displayUrl.trim() : "";
  const subtype = typeof media.subtype === "string" ? media.subtype.trim() : "";

  if (!displayUrl) {
    return null;
  }

  const entityLabel = String(
    media.canonicalName ||
      message?.speaker ||
      (subtype === STORY_ROOM_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
        ? "Location"
        : "Character")
  );

  return {
    subtype,
    displayUrl,
    thumbnailUrl:
      typeof media.thumbnailUrl === "string" && media.thumbnailUrl.trim()
        ? media.thumbnailUrl.trim()
        : null,
    width: Number.isFinite(Number(media.width)) ? Number(media.width) : null,
    height: Number.isFinite(Number(media.height)) ? Number(media.height) : null,
    altText:
      subtype === STORY_ROOM_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
        ? `Establishing image for ${entityLabel}`
        : `Character image for ${entityLabel}`,
    caption:
      subtype === STORY_ROOM_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
        ? entityLabel
        : "",
    entityLabel,
    contentRating: String(media.contentRating || "SFW"),
  };
}

function isCharacterOpeningMessage(message) {
  return (
    message?.kind === "OPENING_SCENE" &&
    String(message?.metadata?.resolvedSpeakerType || "").toUpperCase() ===
      "CHARACTER"
  );
}

function getSurfaceTone(message) {
  if (message?.metadata?.autoEventMedia?.displayUrl) {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.MEDIA;
  }

  if (message?.type === "player") {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER;
  }

  if (isCharacterOpeningMessage(message)) {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER;
  }

  if (message?.kind === "OPENING_SCENE") {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING;
  }

  if (message?.type === "system") {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM;
  }

  if (message?.type === "narrator") {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR;
  }

  return STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER;
}

function getDeliveryState(message) {
  if (message?.metadata?.failed) {
    return STORY_ROOM_MESSAGE_DELIVERY_STATES.FAILED;
  }

  if (message?.metadata?.optimistic) {
    return STORY_ROOM_MESSAGE_DELIVERY_STATES.SENDING;
  }

  return null;
}

export function getStoryRoomMessageViewProps(message) {
  const safeMessage = normalizeObject(message);
  const autoEventMedia = getAutoEventMedia(safeMessage);
  const presentation = autoEventMedia ? null : getValidatedPresentation(safeMessage);
  const openingCharacterPaletteId = isCharacterOpeningMessage(safeMessage)
    ? safeMessage?.metadata?.openingCharacterPaletteId || "CRESTFALL_DEFAULT"
    : null;
  const palette = presentation
    ? getCharacterColorPalette(presentation.paletteId)
    : openingCharacterPaletteId
      ? getCharacterColorPalette(openingCharacterPaletteId)
      : null;

  return {
    surfaceTone: getSurfaceTone(safeMessage),
    contentType: autoEventMedia
      ? STORY_ROOM_MESSAGE_CONTENT_TYPES.AUTO_EVENT_MEDIA
      : STORY_ROOM_MESSAGE_CONTENT_TYPES.TEXT,
    speakerLabel: String(safeMessage.speaker || ""),
    speakerAvatarUrl: safeMessage.speakerAvatarUrl || null,
    openingLabel:
      safeMessage.kind === "OPENING_SCENE" ? "Opening Scene" : "",
    modeLabel: String(safeMessage.mode || ""),
    bodyMode: presentation
      ? STORY_ROOM_MESSAGE_BODY_MODES.SEMANTIC
      : STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
    legacyBody: String(safeMessage.body || ""),
    semanticSegments: presentation?.segments || [],
    statusBlocks: presentation?.statusBlocks || [],
    paletteColors: palette?.colors ? { ...palette.colors } : null,
    speakerColor:
      typeof palette?.colors?.speaker === "string" && palette.colors.speaker.trim()
        ? palette.colors.speaker.trim()
        : null,
    media: autoEventMedia,
    deliveryState: getDeliveryState(safeMessage),
  };
}

export function useStoryRoomMessageViewModel({ message } = {}) {
  return getStoryRoomMessageViewProps(message);
}
