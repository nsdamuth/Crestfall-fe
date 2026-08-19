export const structuredRegistryBuilderPrecisionConfigFixture =
  Object.freeze({
    relationshipGroups: [
      {
        id: "linkedCharacters",
        label: "Linked Characters / People",
        pickerTitle: "Link Characters / People",
        emptyLabel: "No linked characters yet.",
        addLabel: "Link Character",
        allowedTypes: [
          "CHARACTER",
          "PLAYER_CHARACTER",
        ],
      },
      {
        id: "linkedOrganizations",
        label: "Linked Organizations",
        pickerTitle: "Link Organizations",
        emptyLabel: "No linked organizations yet.",
        addLabel: "Link Organization",
        allowedTypes: [
          "ORGANIZATION_REGISTRY",
        ],
      },
      {
        id: "linkedFactions",
        label: "Linked Factions",
        pickerTitle: "Link Factions",
        emptyLabel: "No linked factions yet.",
        addLabel: "Link Faction",
        allowedTypes: [
          "FACTION_REGISTRY",
        ],
      },
      {
        id: "linkedEvents",
        label: "Related Event Registries",
        pickerTitle:
          "Link Related Event Registries",
        emptyLabel:
          "No related event registries linked yet.",
        addLabel: "Link Event Registry",
        allowedTypes: [
          "EVENT_REGISTRY",
        ],
      },
    ],
  });

export const structuredRegistryBuilderPrecisionCreationsFixture =
  Object.freeze([
    {
      id:
        "11111111-1111-4111-8111-111111111111",
      type: "FACTION_REGISTRY",
      title: "Aethelgard Factions",
      data: {
        entries: [
          {
            id: "faction.artificers",
            name: "Artificers",
            summary:
              "Guild of makers and technical specialists.",
          },
          {
            id: "faction.lantern",
            name: "Iron Lantern Compact",
            summary:
              "A defensive political compact.",
          },
        ],
      },
    },
    {
      id:
        "22222222-2222-4222-8222-222222222222",
      type: "ORGANIZATION_REGISTRY",
      title: "Aethelgard Institutions",
      data: {
        entries: [
          {
            id: "org.watch",
            name: "Old Crescent Watch",
            summary:
              "District watch organization.",
          },
        ],
      },
    },
    {
      id:
        "33333333-3333-4333-8333-333333333333",
      type: "EVENT_REGISTRY",
      title: "Crescent Events",
      data: {
        entries: [
          {
            id: "event.breach",
            name: "Tower Breach",
            summary:
              "A recent structural incident.",
          },
        ],
      },
    },
    {
      id:
        "44444444-4444-4444-8444-444444444444",
      type: "CHARACTER",
      title: "Kessa Cindervell",
      description:
        "Engineer and workshop regular.",
      data: {},
    },
  ]);

export const structuredRegistryBuilderPrecisionActiveEntryFixture =
  Object.freeze({
    id: "faction.artificers",
    name: "Artificers",

    linkedCharacters: [
      {
        creationId:
          "44444444-4444-4444-8444-444444444444",
        creationType: "CHARACTER",
        notes:
          "Kessa works closely with the Artificers.",
      },
    ],

    linkedOrganizations: [
      {
        creationId:
          "22222222-2222-4222-8222-222222222222",
        creationType:
          "ORGANIZATION_REGISTRY",
        registryCreationId:
          "22222222-2222-4222-8222-222222222222",
        registryEntryId: "org.watch",
        notes:
          "Precise organization entry.",
      },
    ],

    linkedFactions: [
      {
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "FACTION_REGISTRY",
        registryCreationId:
          "11111111-1111-4111-8111-111111111111",
        registryEntryId: "faction.lantern",
        notes:
          "Sibling faction reference.",
      },
      {
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "FACTION_REGISTRY",
        notes:
          "Legacy whole-registry reference.",
      },
    ],

    linkedEvents: [
      {
        creationId:
          "33333333-3333-4333-8333-333333333333",
        creationType: "EVENT_REGISTRY",
        registryCreationId:
          "33333333-3333-4333-8333-333333333333",
        registryEntryId: "event.missing",
        notes:
          "Missing entry recovery fixture.",
      },
    ],
  });

export const structuredRegistryBuilderPrecisionSelfReferenceFixture =
  Object.freeze({
    id: "faction.artificers",
    name: "Artificers",
    linkedFactions: [
      {
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "FACTION_REGISTRY",
        registryCreationId:
          "11111111-1111-4111-8111-111111111111",
        registryEntryId:
          "faction.artificers",
        notes:
          "Direct self-link should be excluded by reference key.",
      },
      {
        creationId:
          "11111111-1111-4111-8111-111111111111",
        creationType:
          "FACTION_REGISTRY",
        registryCreationId:
          "11111111-1111-4111-8111-111111111111",
        registryEntryId:
          "faction.lantern",
        notes:
          "Sibling link remains valid.",
      },
    ],
  });

export const structuredRegistryBuilderPrecisionUnavailableFixture =
  Object.freeze({
    id: "faction.artificers",
    name: "Artificers",
    linkedEvents: [
      {
        creationId:
          "99999999-9999-4999-8999-999999999999",
        creationType:
          "EVENT_REGISTRY",
        registryCreationId:
          "99999999-9999-4999-8999-999999999999",
        registryEntryId:
          "event.unknown",
        notes:
          "Unavailable parent registry.",
      },
    ],
  });
