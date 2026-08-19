export const npcRegistryLinkedCharacterCanonicalFixture =
  Object.freeze({
    title: "Dev NPC Registry",
    scope:
      "Private Room / Story Spine",
    description:
      "A reusable NPC relationship, alias, and knowledge registry.",

    entries: [
      {
        id: "person-mira",
        kind: "CREATION_REF",
        notes:
          "Registry-local note: Mira usually covers the night counter.",
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "CHARACTER",
      },

      {
        id: "person-kessa",
        kind: "CREATION_REF",
        notes: "",
        creationId:
          "22222222-2222-4222-8222-222222222222",
        creationType:
          "CHARACTER",
      },

      {
        id: "person-shopper",
        kind: "AD_HOC",
        creationId: "",
        creationType: "",
        name:
          "Workshop Customer",
        notes:
          "A lightweight recurring customer.",
        actorMechanicsProfileAttachmentContractVersion:
          "npc_registry_entry_actor_mechanics_profile_attachment_v1",
        actorMechanicsProfileId:
          "33333333-3333-4333-8333-333333333333",
        actorMechanicsProfileLink: {
          creationId:
            "33333333-3333-4333-8333-333333333333",
          title:
            "Lightweight Civilian",
          presetId:
            "preset.civilian",
          ownerType:
            "NPC_REGISTRY_ENTRY",
          enabledDomains: [
            "STATS",
            "SKILLS",
          ],
        },
      },
    ],

    relationships: [],
    knowledgeRules: [],
    aliases: [],
  });

export const npcRegistryLinkedCharacterHydratedFixture =
  Object.freeze({
    title: "Dev NPC Registry",
    scope:
      "Private Room / Story Spine",
    description:
      "A reusable NPC relationship, alias, and knowledge registry.",

    entries: [
      {
        id: "person-mira",
        kind: "CREATION_REF",
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "CHARACTER",
        name:
          "Mira Quill — Current Title",
        notes:
          "Registry-local note: Mira usually covers the night counter.",
        referenceStatus:
          "RESOLVED",
        hydratedCharacter: {
          id:
            "11111111-1111-4111-8111-111111111111",
          title:
            "Mira Quill — Current Title",
          subtitle:
            "Shopkeeper",
          description:
            "Current Character description from the Character Creation.",
          imageUrl:
            "https://example.test/mira-current.webp",
          contentRating: "SFW",
          visibility: "PUBLIC",
          status: "APPROVED",
        },
      },

      {
        id: "person-kessa",
        kind: "CREATION_REF",
        creationId:
          "22222222-2222-4222-8222-222222222222",
        creationType:
          "CHARACTER",
        name:
          "Linked Character unavailable",
        notes: "",
        referenceStatus:
          "UNAVAILABLE",
        hydratedCharacter: null,
      },

      {
        id: "person-shopper",
        kind: "AD_HOC",
        name:
          "Workshop Customer",
        notes:
          "A lightweight recurring customer.",
        actorMechanicsProfileId:
          "33333333-3333-4333-8333-333333333333",
        actorMechanicsProfileLink: {
          creationId:
            "33333333-3333-4333-8333-333333333333",
          title:
            "Lightweight Civilian",
          presetId:
            "preset.civilian",
          ownerType:
            "NPC_REGISTRY_ENTRY",
          enabledDomains: [
            "STATS",
            "SKILLS",
          ],
        },
      },
    ],

    relationships: [],
    knowledgeRules: [],
    aliases: [],
  });

export const npcRegistryLinkedCharacterLegacyCopiedDescriptionFixture =
  Object.freeze({
    canonicalRegistry: {
      title:
        "Legacy NPC Registry",
      entries: [
        {
          id:
            "person-legacy",
          kind:
            "CREATION_REF",
          creationId:
            "44444444-4444-4444-8444-444444444444",
          creationType:
            "CHARACTER",
          name:
            "Old Copied Name",
          notes:
            "Copied Character description.",
          hydratedCharacter: {
            title:
              "Old Copied Name",
            description:
              "Copied Character description.",
          },
          actorMechanicsProfileId:
            "55555555-5555-4555-8555-555555555555",
        },
      ],
    },

    hydratedRegistry: {
      title:
        "Legacy NPC Registry",
      entries: [
        {
          id:
            "person-legacy",
          kind:
            "CREATION_REF",
          creationId:
            "44444444-4444-4444-8444-444444444444",
          creationType:
            "CHARACTER",
          name:
            "Current Character Name",
          notes:
            "Copied Character description.",
          referenceStatus:
            "RESOLVED",
          hydratedCharacter: {
            id:
              "44444444-4444-4444-8444-444444444444",
            title:
              "Current Character Name",
            description:
              "Copied Character description.",
            imageUrl:
              "https://example.test/current.webp",
          },
        },
      ],
    },
  });
