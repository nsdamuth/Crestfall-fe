export const locationRegistryPresenceCharacterOptionsFixture =
  Object.freeze([
    {
      id:
        "11111111-1111-4111-8111-111111111111",
      type: "CHARACTER",
      title: "Kessa Cindervell",
      subtitle: "Engineer",
      description:
        "A precise engineer with ties to the Artificers.",
      imageUrl:
        "https://example.test/kessa.webp",
      contentRating: "SFW",
      visibility: "PRIVATE",
      status: "DRAFT",
    },
    {
      id:
        "22222222-2222-4222-8222-222222222222",
      type: "CHARACTER",
      title: "Mira Quill",
      subtitle: "Shopkeeper",
      description:
        "Night clerk and proprietor of the workshop counter.",
      imageUrl:
        "https://example.test/mira.webp",
      contentRating: "SFW",
      visibility: "PUBLIC",
      status: "APPROVED",
    },
  ]);

export const locationRegistryPresenceNpcEntryOptionsFixture =
  Object.freeze([
    {
      id:
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:person-mira",
      type: "CHARACTER",
      title: "Mira Quill",
      subtitle:
        "Dev NPC Registry · Linked Character",
      description:
        "Stable NPC Registry entry linked to a Character.",
      imageUrl:
        "https://example.test/mira.webp",
      contentRating: "SFW",
      registryCreationId:
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      registryEntryId:
        "person-mira",
      registryTitle:
        "Dev NPC Registry",
      entryKind:
        "CREATION_REF",
      creationId:
        "22222222-2222-4222-8222-222222222222",
      creationType:
        "CHARACTER",
      displayName:
        "Mira Quill",
      aliases: [
        "Mira",
      ],
    },
    {
      id:
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:person-shopper",
      type:
        "LIGHTWEIGHT_NPC",
      title:
        "Workshop Customer",
      subtitle:
        "Dev NPC Registry · Lightweight NPC",
      description:
        "A stable lightweight NPC that remains Registry-owned.",
      imageUrl: "",
      contentRating: "SFW",
      registryCreationId:
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      registryEntryId:
        "person-shopper",
      registryTitle:
        "Dev NPC Registry",
      entryKind:
        "AD_HOC",
      creationId: "",
      creationType: "",
      displayName:
        "Workshop Customer",
      aliases: [
        "Customer",
      ],
    },
  ]);

export const locationRegistryPresenceDirectCharacterFixture =
  Object.freeze({
    presenceBindingDraft: {
      id: "presence-kessa",
      locationEntryId:
        "location-workshop",
      person: {
        kind: "CREATION_REF",
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "CHARACTER",
        displayName:
          "Kessa Cindervell",
        description:
          "A precise engineer with ties to the Artificers.",
        imageUrl:
          "https://example.test/kessa.webp",
        contentRating: "SFW",
        visibility: "PRIVATE",
        status: "DRAFT",
        referenceStatus:
          "RESOLVED",
        legacyReference: null,
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
    disabledCharacterIds: [
      "22222222-2222-4222-8222-222222222222",
    ],
    disabledNpcEntryIds: [],
  });

export const locationRegistryPresenceAdHocNpcEntryFixture =
  Object.freeze({
    presenceBindingDraft: {
      id:
        "presence-shopper",
      locationEntryId:
        "location-workshop",
      person: {
        kind:
          "NPC_REGISTRY_ENTRY",
        registryCreationId:
          "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        registryEntryId:
          "person-shopper",
        registryTitle:
          "Dev NPC Registry",
        entryKind: "AD_HOC",
        creationId: "",
        creationType: "",
        displayName:
          "Workshop Customer",
        description:
          "A stable lightweight NPC that remains Registry-owned.",
        imageUrl: "",
        contentRating: "SFW",
        visibility: "",
        status: "",
        aliases: [
          "Customer",
        ],
        referenceStatus:
          "RESOLVED",
        legacyReference: null,
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
    disabledCharacterIds: [],
    disabledNpcEntryIds: [
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:person-mira",
    ],
  });

export const locationRegistryPresenceLinkedNpcEntryFixture =
  Object.freeze({
    presenceBindingDraft: {
      id:
        "presence-mira",
      locationEntryId:
        "location-workshop",
      person: {
        kind:
          "NPC_REGISTRY_ENTRY",
        registryCreationId:
          "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        registryEntryId:
          "person-mira",
        registryTitle:
          "Dev NPC Registry",
        entryKind:
          "CREATION_REF",
        creationId:
          "22222222-2222-4222-8222-222222222222",
        creationType:
          "CHARACTER",
        displayName:
          "Mira Quill",
        description:
          "Stable NPC Registry entry linked to a Character.",
        imageUrl:
          "https://example.test/mira.webp",
        contentRating: "SFW",
        aliases: [
          "Mira",
        ],
        referenceStatus:
          "RESOLVED",
        legacyReference: null,
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
    disabledCharacterIds: [],
    disabledNpcEntryIds: [],
  });

export const locationRegistryPresenceUnavailableCharacterFixture =
  Object.freeze({
    presenceBindingDraft: {
      id:
        "presence-missing-character",
      locationEntryId:
        "location-workshop",
      person: {
        kind:
          "CREATION_REF",
        creationId:
          "99999999-9999-4999-8999-999999999999",
        creationType:
          "CHARACTER",
        displayName:
          "Linked Character unavailable",
        referenceStatus:
          "UNAVAILABLE",
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
  });

export const locationRegistryPresenceUnavailableNpcEntryFixture =
  Object.freeze({
    presenceBindingDraft: {
      id:
        "presence-missing-npc-entry",
      locationEntryId:
        "location-workshop",
      person: {
        kind:
          "NPC_REGISTRY_ENTRY",
        registryCreationId:
          "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        registryEntryId:
          "person-missing",
        registryTitle:
          "Dev NPC Registry",
        displayName:
          "NPC Registry entry unavailable",
        referenceStatus:
          "UNAVAILABLE",
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
  });

export const locationRegistryPresenceLegacyNpcEntryFixture =
  Object.freeze({
    presenceBindingDraft: {
      id:
        "presence-legacy",
      locationEntryId:
        "location-workshop",
      person: {
        kind:
          "LEGACY_NPC_REGISTRY_ENTRY",
        registryCreationId:
          "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        registryEntryId:
          "legacy-person",
        registryTitle:
          "Old NPC Registry",
        displayName:
          "Legacy NPC Registry reference unavailable",
        referenceStatus:
          "LEGACY_UNRESOLVED",
        legacyReference: {
          registryCreationId:
            "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          registryEntryId:
            "legacy-person",
        },
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
  });

export const locationRegistryPresenceUnresolvedFixture =
  Object.freeze({
    presenceBindingDraft: {
      id:
        "presence-new",
      locationEntryId:
        "location-workshop",
      person: {
        kind:
          "CREATION_REF",
        creationId: "",
        creationType:
          "CHARACTER",
        displayName:
          "Character selection required",
        referenceStatus:
          "UNRESOLVED",
      },
    },
    characterOptions:
      locationRegistryPresenceCharacterOptionsFixture,
    npcEntryOptions:
      locationRegistryPresenceNpcEntryOptionsFixture,
  });
