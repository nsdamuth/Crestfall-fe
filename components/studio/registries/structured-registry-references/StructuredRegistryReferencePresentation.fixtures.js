export const structuredRegistryReferenceCreationsFixture = Object.freeze([
  {
    id: "11111111-1111-4111-8111-111111111111",
    type: "FACTION_REGISTRY",
    title: "Aethelgard Factions",
    description: "Faction Registry",
    thumbnailUrl: "/fixtures/factions.webp",
    data: {
      entries: [
        {
          id: "faction.artificers",
          name: "Artificers",
          summary: "Guild of makers and technical specialists.",
        },
        {
          id: "faction.lantern",
          name: "Iron Lantern Compact",
          publicDescription:
            "A defensive political compact.",
        },
      ],
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    type: "ORGANIZATION_REGISTRY",
    title: "Aethelgard Institutions",
    data: {
      entries: [
        {
          id: "org.watch",
          name: "Old Crescent Watch",
          summary: "District watch organization.",
        },
      ],
    },
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    type: "CHARACTER",
    title: "Kessa Cindervell",
    description: "Engineer and workshop regular.",
    imageUrl: "/fixtures/kessa.webp",
    data: {},
  },
]);

export const structuredRegistryReferenceFilledFixture = Object.freeze({
  references: [
    {
      creationId: "33333333-3333-4333-8333-333333333333",
      creationType: "CHARACTER",
      notes: "",
    },
    {
      creationId: "11111111-1111-4111-8111-111111111111",
      creationType: "FACTION_REGISTRY",
      registryCreationId:
        "11111111-1111-4111-8111-111111111111",
      registryEntryId: "faction.artificers",
      notes: "Precise structured-registry entry reference.",
    },
    {
      creationId: "11111111-1111-4111-8111-111111111111",
      creationType: "FACTION_REGISTRY",
      notes: "Legacy whole-registry reference.",
    },
    {
      creationId: "22222222-2222-4222-8222-222222222222",
      creationType: "ORGANIZATION_REGISTRY",
      registryCreationId:
        "22222222-2222-4222-8222-222222222222",
      registryEntryId: "org.missing",
      notes: "Missing entry should degrade safely.",
    },
    {
      creationId: "99999999-9999-4999-8999-999999999999",
      creationType: "QUEST_REGISTRY",
      registryCreationId:
        "99999999-9999-4999-8999-999999999999",
      registryEntryId: "quest.unknown",
      notes: "Unavailable registry creation.",
    },
  ],
  creations: structuredRegistryReferenceCreationsFixture,
  currentRegistryCreationId:
    "11111111-1111-4111-8111-111111111111",
  currentRegistryEntryId: "faction.lantern",
});

export const structuredRegistrySelfReferenceFixture = Object.freeze({
  currentRegistryCreationId:
    "11111111-1111-4111-8111-111111111111",
  currentRegistryEntryId: "faction.artificers",
  selfReference: {
    creationId: "11111111-1111-4111-8111-111111111111",
    creationType: "FACTION_REGISTRY",
    registryCreationId:
      "11111111-1111-4111-8111-111111111111",
    registryEntryId: "faction.artificers",
  },
  siblingReference: {
    creationId: "11111111-1111-4111-8111-111111111111",
    creationType: "FACTION_REGISTRY",
    registryCreationId:
      "11111111-1111-4111-8111-111111111111",
    registryEntryId: "faction.lantern",
  },
});

export const structuredRegistryAliasReferenceFixture = Object.freeze({
  creation_id: "22222222-2222-4222-8222-222222222222",
  creation_type: "ORGANIZATION_REGISTRY",
  registry_creation_id:
    "22222222-2222-4222-8222-222222222222",
  target_entry_id: "org.watch",
  notes: "Alias field compatibility.",
});
