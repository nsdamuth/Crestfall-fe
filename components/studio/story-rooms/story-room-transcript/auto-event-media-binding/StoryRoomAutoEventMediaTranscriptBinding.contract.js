import {
  STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,
} from "../../story-room-message/StoryRoomMessage.contract.js";

import {
  STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,
} from "../StoryRoomTranscript.contract.js";

export const STORY_ROOM_AUTO_EVENT_MEDIA_TRANSCRIPT_BINDING_CONTRACT_VERSION =
  "story_room_auto_event_media_transcript_binding_v1";

export const STORY_ROOM_AUTO_EVENT_MEDIA_CONTENT_TYPE =
  "AUTO_EVENT_MEDIA";

export const STORY_ROOM_AUTO_EVENT_MEDIA_SURFACE_TONE =
  "MEDIA";

export const STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES = Object.freeze({
  CHARACTER_EVENT_IMAGE: "CHARACTER_EVENT_IMAGE",
  LOCATION_EVENT_IMAGE: "LOCATION_EVENT_IMAGE",
});

export const STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS = Object.freeze({
  BEFORE_TRIGGERING_MESSAGE: "BEFORE_TRIGGERING_MESSAGE",
  AFTER_TRIGGERING_MESSAGE: "AFTER_TRIGGERING_MESSAGE",
});

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mediaMetadata(message = {}) {
  return object(object(message).metadata?.autoEventMedia);
}

function isRenderableAutoEventMediaMessage(message = {}) {
  return Boolean(
    text(mediaMetadata(message).displayUrl)
  );
}

function normalizeSubtype(value) {
  const subtype = text(value).toUpperCase();

  return Object.values(
    STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES
  ).includes(subtype)
    ? subtype
    : STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.CHARACTER_EVENT_IMAGE;
}

function normalizePresentationOrder(value, subtype) {
  const requested = text(value).toUpperCase();

  if (
    requested ===
    STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS
      .BEFORE_TRIGGERING_MESSAGE
  ) {
    return requested;
  }

  if (
    requested ===
    STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS
      .AFTER_TRIGGERING_MESSAGE
  ) {
    return requested;
  }

  return subtype ===
    STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
    ? STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS
        .BEFORE_TRIGGERING_MESSAGE
    : STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS
        .AFTER_TRIGGERING_MESSAGE;
}

export function projectStoryRoomAutoEventMediaMessage(
  message = {}
) {
  const safeMessage = object(message);
  const media = mediaMetadata(safeMessage);
  const displayUrl = text(media.displayUrl);

  if (!displayUrl) {
    return null;
  }

  const subtype =
    normalizeSubtype(media.subtype);

  const entityLabel =
    text(media.canonicalName) ||
    text(safeMessage.speaker) ||
    (
      subtype ===
      STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
        ? "Location"
        : "Character"
    );

  const presentationOrder =
    normalizePresentationOrder(
      media.presentationOrder,
      subtype
    );

  return {
    messageId:
      text(safeMessage.id),

    triggeringMessageId:
      text(media.triggeringMessageId),

    contentType:
      STORY_ROOM_AUTO_EVENT_MEDIA_CONTENT_TYPE,

    surfaceTone:
      STORY_ROOM_AUTO_EVENT_MEDIA_SURFACE_TONE,

    presentationOrder,

    speakerLabel:
      text(safeMessage.speaker),

    media: {
      subtype,
      displayUrl,
      thumbnailUrl:
        text(media.thumbnailUrl) || null,
      width:
        finiteNumberOrNull(media.width),
      height:
        finiteNumberOrNull(media.height),
      altText:
        subtype ===
        STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
          ? `Establishing image for ${entityLabel}`
          : `Character image for ${entityLabel}`,
      caption:
        subtype ===
        STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
          ? entityLabel
          : "",
      entityLabel,
      contentRating:
        text(media.contentRating) || "SFW",
    },
  };
}

export function orderStoryRoomMessagesForMediaPresentation(
  messages = []
) {
  const safeMessages = array(messages);

  const mediaByTriggeringMessageId =
    new Map();

  const unboundMedia = [];

  for (const message of safeMessages) {
    const projection =
      projectStoryRoomAutoEventMediaMessage(
        message
      );

    if (!projection) {
      continue;
    }

    if (!projection.triggeringMessageId) {
      unboundMedia.push(message);
      continue;
    }

    const bucket =
      mediaByTriggeringMessageId.get(
        projection.triggeringMessageId
      ) || {
        before: [],
        after: [],
      };

    if (
      projection.presentationOrder ===
      STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS
        .BEFORE_TRIGGERING_MESSAGE
    ) {
      bucket.before.push(message);
    } else {
      bucket.after.push(message);
    }

    mediaByTriggeringMessageId.set(
      projection.triggeringMessageId,
      bucket
    );
  }

  const ordered = [];
  const consumedMediaIds =
    new Set();

  for (const message of safeMessages) {
    if (
      isRenderableAutoEventMediaMessage(
        message
      )
    ) {
      continue;
    }

    const messageId =
      text(message?.id);

    const bucket =
      mediaByTriggeringMessageId.get(
        messageId
      );

    for (const mediaMessage of
      bucket?.before || []) {
      ordered.push(mediaMessage);
      consumedMediaIds.add(
        text(mediaMessage?.id)
      );
    }

    ordered.push(message);

    for (const mediaMessage of
      bucket?.after || []) {
      ordered.push(mediaMessage);
      consumedMediaIds.add(
        text(mediaMessage?.id)
      );
    }
  }

  for (const message of safeMessages) {
    if (
      isRenderableAutoEventMediaMessage(
        message
      ) &&
      !consumedMediaIds.has(
        text(message?.id)
      ) &&
      !unboundMedia.includes(message)
    ) {
      ordered.push(message);
    }
  }

  return [
    ...ordered,
    ...unboundMedia,
  ];
}

export function projectStoryRoomOpeningHeroImage(
  openingHeroImage = null
) {
  const source =
    object(openingHeroImage);

  const displayUrl =
    text(source.displayUrl);

  if (!displayUrl) {
    return null;
  }

  return {
    displayUrl,
    width:
      finiteNumberOrNull(source.width),
    height:
      finiteNumberOrNull(source.height),
    altText:
      text(source.sourceTitle)
        ? `${text(source.sourceTitle)} opening image`
        : "Story opening image",
  };
}

export function projectStoryRoomAutoEventMediaTranscriptBinding({
  openingHeroImage = null,
  messages = [],
} = {}) {
  const orderedMessages =
    orderStoryRoomMessagesForMediaPresentation(
      messages
    );

  const messageItems =
    orderedMessages.map(
      (message, index) => {
        const media =
          projectStoryRoomAutoEventMediaMessage(
            message
          );

        return {
          id:
            text(message?.id) ||
            `story-room-message-${index}`,

          kind:
            media
              ? "AUTO_EVENT_MEDIA"
              : "MESSAGE",

          rawMessage:
            message,

          media,
        };
      }
    );

  const mediaItems =
    messageItems.filter(
      (item) =>
        item.kind ===
        "AUTO_EVENT_MEDIA"
    );

  return {
    bindingContractVersion:
      STORY_ROOM_AUTO_EVENT_MEDIA_TRANSCRIPT_BINDING_CONTRACT_VERSION,

    storyRoomMessageViewContractVersion:
      STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,

    storyRoomTranscriptViewContractVersion:
      STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,

    openingHeroImage:
      projectStoryRoomOpeningHeroImage(
        openingHeroImage
      ),

    messageItems,

    summary: {
      inputMessageCount:
        array(messages).length,
      orderedMessageCount:
        messageItems.length,
      autoEventMediaCount:
        mediaItems.length,
      locationEventImageCount:
        mediaItems.filter(
          (item) =>
            item.media?.media?.subtype ===
            STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE
        ).length,
      characterEventImageCount:
        mediaItems.filter(
          (item) =>
            item.media?.media?.subtype ===
            STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES.CHARACTER_EVENT_IMAGE
        ).length,
    },

    functionalWiringStatus: {
      authoritativeMessageProjection:
        "WIRED",
      autoEventMediaMessageProjection:
        "WIRED",
      transcriptOrdering:
        "WIRED",
      openingHeroProjection:
        "WIRED",
    },

    visualExtensionStatus: {
      storyRoomMessageAutoEventMedia:
        "WIRED",
      storyRoomTranscriptOpeningHeroImage:
        "WIRED",
      storyRoomTranscriptMediaOrdering:
        "WIRED",
    },

    architecture: {
      roomAndMessageLoadingOwnedByChassis: true,
      autoEventMediaGenerationOwnedByChassis: true,
      mediaVisibilityAndDisplayUrlOwnedByServices: true,
      triggeringMessageIdentityOwnedByChassis: true,
      transcriptOrderingProjectionOwnedByFe: true,
      mediaMessagePresentationOwnedByFe: true,
      openingHeroPresentationOwnedByFe: true,
      chatPackageUnmodified: true,
    },
  };
}
