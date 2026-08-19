export const roomRegistryAttachmentHydrationBoundRegistriesFixture =
  Object.freeze({
    eventRegistryIds: [
      "11111111-1111-4111-8111-111111111111",
    ],
    questRegistryIds: [],
    npcRegistryIds: [
      "22222222-2222-4222-8222-222222222222",
    ],
    itemRegistryIds: [],
    locationRegistryIds: [
      "33333333-3333-4333-8333-333333333333",
    ],
    factionRegistryIds: [],
    organizationRegistryIds: [],
  });

export const roomRegistryAttachmentHydrationBoundLinksFixture =
  Object.freeze({
    eventRegistries: [
      {
        id: "link-event",
        creationId:
          "11111111-1111-4111-8111-111111111111",
        title:
          "Stored Event Registry Title",
        type:
          "EVENT_REGISTRY",
        description:
          "Stored event description.",
        imageUrl:
          "https://example.test/stored-event.webp",
        notes:
          "Story event notes stay on the attachment.",
      },
    ],

    questRegistries: [],

    npcRegistries: [
      {
        id: "link-npc",
        creationId:
          "22222222-2222-4222-8222-222222222222",
        title:
          "Stored NPC Registry Title",
        type:
          "NPC_REGISTRY",
        description:
          "Stored NPC description.",
        imageUrl: "",
        notes:
          "NPC note remains local to this Story attachment.",
      },
    ],

    itemRegistries: [],

    locationRegistries: [
      {
        id: "link-location",
        creationId:
          "33333333-3333-4333-8333-333333333333",
        title:
          "Stored Location Registry Title",
        type:
          "LOCATION_REGISTRY",
        description:
          "Stored location fallback.",
        imageUrl:
          "https://example.test/stored-location.webp",
        notes: "",
      },
    ],

    factionRegistries: [],
    organizationRegistries: [],
  });

export const roomRegistryAttachmentHydrationLiveCreationsFixture =
  Object.freeze({
    "11111111-1111-4111-8111-111111111111":
      {
        id:
          "11111111-1111-4111-8111-111111111111",
        type:
          "EVENT_REGISTRY",
        title:
          "Crescent Market Events",
        description:
          "Live Event Registry description.",
        imageUrl:
          "https://example.test/live-event.webp",
      },

    "22222222-2222-4222-8222-222222222222":
      {
        id:
          "22222222-2222-4222-8222-222222222222",
        type:
          "NPC_REGISTRY",
        title:
          "Brasswhisker People",
        description: null,
        image_url:
          "https://example.test/live-npc.webp",
      },

    // Intentionally omit the Location Registry so the stored snapshot
    // remains visible as the fallback.
  });

export const roomRegistryAttachmentHydrationLegacyIdsOnlyFixture =
  Object.freeze({
    boundRegistries: {
      eventRegistryIds: [],
      questRegistryIds: [
        "44444444-4444-4444-8444-444444444444",
      ],
      npcRegistryIds: [],
      itemRegistryIds: [],
      locationRegistryIds: [],
      factionRegistryIds: [],
      organizationRegistryIds: [],
    },
    boundRegistryLinks: {
      eventRegistries: [],
      questRegistries: [],
      npcRegistries: [],
      itemRegistries: [],
      locationRegistries: [],
      factionRegistries: [],
      organizationRegistries: [],
    },
    liveRegistryCreationsById: {
      "44444444-4444-4444-8444-444444444444":
        {
          id:
            "44444444-4444-4444-8444-444444444444",
          type:
            "QUEST_REGISTRY",
          title:
            "Brasswhisker Quests",
          description:
            "Live hydrated Quest Registry.",
          imageUrl:
            "https://example.test/quests.webp",
        },
    },
  });
