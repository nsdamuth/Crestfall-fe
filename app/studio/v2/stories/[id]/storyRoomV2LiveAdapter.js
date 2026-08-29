import { getCharacterColorPalette } from "@/components/studio/create/character/constants/characterColorPalettes";
import { buildPlayerChatMessagePresentation } from "@/components/studio/chat/player-message-semantics/playerMessageSemantics";

const RESPONSE_PRESENTATION_VERSION = "chat.responsePresentation.v1";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getResponsePresentation(message) {
  const presentation = normalizeObject(message?.metadata?.presentation);
  if (presentation.contractVersion !== RESPONSE_PRESENTATION_VERSION) return null;

  const semanticSegments = normalizeArray(presentation.segments)
    .filter((segment) => normalizeText(segment?.text))
    .map((segment) => ({
      text: String(segment.text),
      type: normalizeText(segment.type) || "TEXT",
      emphasis: normalizeText(segment.emphasis),
    }));

  if (!semanticSegments.length) return null;

  return {
    paletteId: normalizeText(presentation.paletteId),
    semanticSegments,
    statusBlocks: normalizeArray(presentation.statusBlocks)
      .filter((block) => normalizeText(block?.renderedText))
      .map((block, index) => ({
        id: normalizeText(block.id) || `status-${index}`,
        text: String(block.renderedText),
      })),
  };
}

function getAutoEventMedia(message) {
  const media = normalizeObject(message?.metadata?.autoEventMedia);
  const displayUrl = normalizeText(media.displayUrl);
  if (!displayUrl) return null;

  const subtype = normalizeText(media.subtype);
  const entityLabel = normalizeText(
    media.canonicalName ||
      message?.speaker ||
      (subtype === "LOCATION_EVENT_IMAGE" ? "Location" : "Character")
  );

  return {
    subtype,
    displayUrl,
    thumbnailUrl: normalizeText(media.thumbnailUrl) || null,
    width: Number.isFinite(Number(media.width)) ? Number(media.width) : null,
    height: Number.isFinite(Number(media.height)) ? Number(media.height) : null,
    altText:
      subtype === "LOCATION_EVENT_IMAGE"
        ? `Establishing image for ${entityLabel}`
        : `Character image for ${entityLabel}`,
    caption: subtype === "LOCATION_EVENT_IMAGE" ? entityLabel : "",
    entityLabel,
    contentRating: normalizeText(media.contentRating) || "SFW",
  };
}

function isCharacterOpeningMessage(message) {
  return (
    message?.kind === "OPENING_SCENE" &&
    normalizeText(message?.metadata?.resolvedSpeakerType).toUpperCase() === "CHARACTER"
  );
}

function getSurfaceTone(message, media) {
  if (media) return "MEDIA";
  if (message?.type === "player") return "PLAYER";
  if (isCharacterOpeningMessage(message)) return "CHARACTER";
  if (message?.kind === "OPENING_SCENE") return "OPENING";
  if (message?.type === "system") return "SYSTEM";
  if (message?.type === "narrator") return "NARRATOR";
  return "CHARACTER";
}

function getDeliveryState(message) {
  if (message?.metadata?.failed) return "FAILED";
  if (message?.metadata?.optimistic) return "SENDING";
  return null;
}

function getPalette(message, presentation) {
  const openingPaletteId = isCharacterOpeningMessage(message)
    ? normalizeText(message?.metadata?.openingCharacterPaletteId) || "CRESTFALL_DEFAULT"
    : "";
  const paletteId = normalizeText(presentation?.paletteId) || openingPaletteId;
  return paletteId ? getCharacterColorPalette(paletteId) : null;
}

function getPlayerModeLabel(mode) {
  const normalized = normalizeText(mode).toUpperCase();
  if (normalized === "THOUGHT") return "Private Thought";
  if (normalized === "MESSAGE") return "Written / Digital";
  if (normalized === "TELEPATHY") return "Telepathy";
  return normalized;
}

export function projectStoryRoomMessageToV2(message) {
  const safeMessage = normalizeObject(message);
  const media = getAutoEventMedia(safeMessage);

  if (safeMessage.type === "player" && !media) {
    const playerPresentation = buildPlayerChatMessagePresentation({
      text: safeMessage.body,
      inputMode: safeMessage.mode,
      metadata: safeMessage.metadata,
    });

    return {
      surfaceTone: "PLAYER",
      contentType: "TEXT",
      speakerLabel: normalizeText(safeMessage.speaker) || "You",
      speakerAvatarUrl: safeMessage.speakerAvatarUrl || null,
      speakerColor: null,
      openingLabel: "",
      modeLabel: getPlayerModeLabel(safeMessage.mode),
      bodyMode: playerPresentation.bodyMode,
      legacyBody: playerPresentation.legacyBody,
      semanticSegments: playerPresentation.semanticSegments,
      statusBlocks: [],
      media: null,
      deliveryState: getDeliveryState(safeMessage),
    };
  }

  const presentation = media ? null : getResponsePresentation(safeMessage);
  const palette = getPalette(safeMessage, presentation);

  return {
    surfaceTone: getSurfaceTone(safeMessage, media),
    contentType: media ? "AUTO_EVENT_MEDIA" : "TEXT",
    speakerLabel: normalizeText(safeMessage.speaker),
    speakerAvatarUrl: safeMessage.speakerAvatarUrl || null,
    speakerColor: normalizeText(palette?.colors?.speaker) || null,
    openingLabel: safeMessage.kind === "OPENING_SCENE" ? "Opening Scene" : "",
    modeLabel: normalizeText(safeMessage.mode),
    bodyMode: presentation ? "SEMANTIC" : "LEGACY",
    legacyBody: String(safeMessage.body || ""),
    semanticSegments: presentation?.semanticSegments || [],
    statusBlocks: presentation?.statusBlocks || [],
    media,
    deliveryState: getDeliveryState(safeMessage),
  };
}

export function projectStoryRoomMessagesToV2(messages = []) {
  return normalizeArray(messages).map((message, index) => ({
    id: normalizeText(message?.id) || `story-message-${index}`,
    message: projectStoryRoomMessageToV2(message),
  }));
}

export function projectStoryRoomOpeningHero(room) {
  const roomData = normalizeObject(room?.rawRoom?.data || room?.data);
  const candidates = [
    roomData.openingHeroImage,
    roomData.opening_hero_image,
    roomData.heroImage,
    roomData.hero_image,
  ]
    .map(normalizeObject)
    .filter((entry) => Object.keys(entry).length);

  for (const entry of candidates) {
    const displayUrl = normalizeText(
      entry.displayUrl ||
        entry.display_url ||
        entry.thumbnailUrl ||
        entry.thumbnail_url ||
        entry.imageUrl ||
        entry.image_url ||
        entry.url
    );
    if (!displayUrl) continue;

    return {
      displayUrl,
      width: Number.isFinite(Number(entry.width)) ? Number(entry.width) : null,
      height: Number.isFinite(Number(entry.height)) ? Number(entry.height) : null,
      altText: normalizeText(entry.altText || entry.alt_text) || `${room?.title || "Story"} opening image`,
    };
  }

  return null;
}

export function projectStoryRoomCastToV2(cast = []) {
  return normalizeArray(cast)
    .filter((member) => member?.isActive !== false)
    .slice(0, 5)
    .map((member) => {
      const participant = normalizeObject(member?.participant);
      const metadata = normalizeObject(participant.metadata);
      const palette = getCharacterColorPalette(
        normalizeText(metadata.colorPaletteId || metadata.color_palette_id) || "CRESTFALL_DEFAULT"
      );
      const name = normalizeText(member?.name) || "Participant";

      return {
        id: normalizeText(member?.id) || name,
        name,
        avatarUrl: normalizeText(member?.avatarUrl),
        fallbackInitial: name.slice(0, 1).toUpperCase(),
        role: normalizeText(member?.role),
        color: normalizeText(palette?.colors?.speaker),
      };
    });
}

export function projectStoryRoomMentionOptionsToV2(cast = []) {
  return normalizeArray(cast)
    .filter((member) => member?.isActive !== false)
    .filter((member) => !["USER", "PLAYER_CHARACTER"].includes(String(member?.participantType || "").toUpperCase()))
    .map((member) => ({
      id: normalizeText(member?.id),
      label: normalizeText(member?.name),
      avatarUrl: normalizeText(member?.avatarUrl),
    }))
    .filter((member) => member.id && member.label);
}

export function projectStoryRoomStateSectionsToV2(room = {}) {
  const sections = [
    {
      id: "world-state",
      iconKey: "world",
      title: "World",
      rows: [
        { id: "location", label: "Location", value: normalizeText(room.location) || "Unknown" },
        { id: "time", label: "Time", value: normalizeText(room.timeLabel) || "Unknown" },
        { id: "weather", label: "Weather", value: normalizeText(room.weather) || "Unknown" },
      ],
    },
    {
      id: "story-state",
      iconKey: "scenario",
      title: "Story",
      rows: [
        { id: "scenario", label: "Scenario", value: normalizeText(room.scenario) || "Character Story" },
        { id: "mode", label: "Mode", value: normalizeText(room.roomMode) || "Story" },
        { id: "turn", label: "Turn", value: String(Number(room.turnCount || 0)) },
      ],
    },
  ];

  if (Number(room?.engineModuleState?.operationCount || 0) > 0) {
    sections.push({
      id: "mechanics-state",
      iconKey: "mechanics",
      title: "Mechanics",
      rows: [
        {
          id: "engine-operations",
          label: "Runtime operations",
          value: String(Number(room.engineModuleState.operationCount || 0)),
        },
      ],
    });
  }

  return sections;
}

export function projectStoryRoomFeaturedMediaToV2(room = {}) {
  return {
    imageUrl: normalizeText(room.featuredSpeakerImageUrl),
    imageAltText: room.featuredSpeakerName
      ? `${room.featuredSpeakerName} scene image`
      : "Story scene image",
    speakerName: normalizeText(room.featuredSpeakerName) || normalizeText(room.title) || "Story",
    imageEyebrow: room.featuredSpeakerName ? "Last Speaker Media" : "Story Media",
  };
}
