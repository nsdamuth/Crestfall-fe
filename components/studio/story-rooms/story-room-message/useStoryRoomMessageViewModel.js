import { getCharacterColorPalette } from "@/components/studio/create/character/constants/characterColorPalettes";
import {
  STORY_ROOM_MESSAGE_BODY_MODES,
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

function getSurfaceTone(message) {
  if (message?.type === "player") {
    return STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER;
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
  const presentation = getValidatedPresentation(safeMessage);
  const palette = presentation
    ? getCharacterColorPalette(presentation.paletteId)
    : null;

  return {
    surfaceTone: getSurfaceTone(safeMessage),
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
    deliveryState: getDeliveryState(safeMessage),
  };
}

export function useStoryRoomMessageViewModel({ message } = {}) {
  return getStoryRoomMessageViewProps(message);
}
