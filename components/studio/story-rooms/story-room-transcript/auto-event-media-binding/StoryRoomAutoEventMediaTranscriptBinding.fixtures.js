export const storyRoomAutoEventMediaTranscriptMessagesFixture =
  Object.freeze([
    {
      id: "response-1",
      kind: "CHAT",
      type: "narrator",
      speaker: "Runtime Lab Narrator",
      body:
        "The workshop door opens toward the rain-dark street.",
      metadata: {},
    },

    {
      id: "location-media-1",
      kind: "CHAT",
      type: "system",
      speaker: "",
      body: "",
      metadata: {
        autoEventMedia: {
          triggeringMessageId:
            "response-1",
          presentationOrder:
            "BEFORE_TRIGGERING_MESSAGE",
          subtype:
            "LOCATION_EVENT_IMAGE",
          displayUrl:
            "https://example.test/brasswhisker-workshop.webp",
          thumbnailUrl:
            "https://example.test/brasswhisker-workshop-thumb.webp",
          width: 1400,
          height: 700,
          canonicalName:
            "Brasswhisker Workshop",
          contentRating: "SFW",
        },
      },
    },

    {
      id: "character-media-1",
      kind: "CHAT",
      type: "system",
      speaker: "Mira Quill",
      body: "",
      metadata: {
        autoEventMedia: {
          triggeringMessageId:
            "response-1",
          presentationOrder:
            "AFTER_TRIGGERING_MESSAGE",
          subtype:
            "CHARACTER_EVENT_IMAGE",
          displayUrl:
            "https://example.test/mira-quill.webp",
          thumbnailUrl: "",
          width: 1200,
          height: 675,
          canonicalName:
            "Mira Quill",
          contentRating: "SFW",
        },
      },
    },

    {
      id: "response-2",
      kind: "CHAT",
      type: "character",
      speaker: "Mira Quill",
      body:
        "Rain's getting heavier.",
      metadata: {},
    },

    {
      id: "location-media-default-order",
      kind: "CHAT",
      type: "system",
      speaker: "",
      body: "",
      metadata: {
        autoEventMedia: {
          triggeringMessageId:
            "response-2",
          subtype:
            "LOCATION_EVENT_IMAGE",
          displayUrl:
            "https://example.test/old-crescent.webp",
          width: "1600",
          height: "900",
          canonicalName:
            "Old Crescent",
        },
      },
    },

    {
      id: "character-media-default-order",
      kind: "CHAT",
      type: "system",
      speaker:
        "Kessa Cindervell",
      body: "",
      metadata: {
        autoEventMedia: {
          triggeringMessageId:
            "response-2",
          subtype:
            "CHARACTER_EVENT_IMAGE",
          displayUrl:
            "https://example.test/kessa.webp",
          width: null,
          height: null,
          canonicalName:
            "Kessa Cindervell",
        },
      },
    },

    {
      id: "unbound-media-1",
      kind: "CHAT",
      type: "system",
      speaker: "Unknown Visitor",
      body: "",
      metadata: {
        autoEventMedia: {
          triggeringMessageId: "",
          subtype:
            "CHARACTER_EVENT_IMAGE",
          displayUrl:
            "https://example.test/unbound.webp",
          canonicalName:
            "Unknown Visitor",
        },
      },
    },

    {
      id: "media-missing-trigger-target",
      kind: "CHAT",
      type: "system",
      speaker: "Late Arrival",
      body: "",
      metadata: {
        autoEventMedia: {
          triggeringMessageId:
            "missing-response",
          presentationOrder:
            "AFTER_TRIGGERING_MESSAGE",
          subtype:
            "CHARACTER_EVENT_IMAGE",
          displayUrl:
            "https://example.test/late-arrival.webp",
          canonicalName:
            "Late Arrival",
        },
      },
    },
  ]);

export const storyRoomOpeningHeroImageFixture =
  Object.freeze({
    displayUrl:
      "https://example.test/the-bronze-seal-opening.webp",
    width: 1536,
    height: 864,
    sourceTitle:
      "The Bronze Seal",
  });

export const storyRoomOpeningHeroImageFallbackAltFixture =
  Object.freeze({
    displayUrl:
      "https://example.test/story-opening.webp",
    width: "1280",
    height: "720",
    sourceTitle: "",
  });

export const storyRoomOpeningHeroImageMissingFixture =
  Object.freeze({
    displayUrl: "",
    width: null,
    height: null,
    sourceTitle:
      "Missing image",
  });
