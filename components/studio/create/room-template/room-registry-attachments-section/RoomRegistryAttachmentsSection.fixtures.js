const EMPTY_GROUPS = [
  {
    id: "eventRegistries",
    label: "Event Registries",
    body:
      "Story-specific events and timed scene flavor available to the narrator runtime.",
    addLabel: "Attach Event Registry",
    emptyLabel: "No Event Registries attached.",
    attachments: [],
  },
  {
    id: "questRegistries",
    label: "Quest Registries",
    body:
      "Story-specific side threads, investigations, objectives, and optional quest spines.",
    addLabel: "Attach Quest Registry",
    emptyLabel: "No Quest Registries attached.",
    attachments: [],
  },
  {
    id: "npcRegistries",
    label: "NPC Registries",
    body:
      "Named NPCs, roles, relationships, knowledge boundaries, and authored character references.",
    addLabel: "Attach NPC Registry",
    emptyLabel: "No NPC Registries attached.",
    attachments: [],
  },
  {
    id: "itemRegistries",
    label: "Item Registries",
    body:
      "Authored items, aliases, ownership guidance, behavior, and reusable item definitions.",
    addLabel: "Attach Item Registry",
    emptyLabel: "No Item Registries attached.",
    attachments: [],
  },
  {
    id: "locationRegistries",
    label: "Location Registries",
    body:
      "Defined locations, hierarchy, adjacency, travel routes, and access rules.",
    addLabel: "Attach Location Registry",
    emptyLabel: "No Location Registries attached.",
    attachments: [],
  },
  {
    id: "factionRegistries",
    label: "Faction Registries",
    body:
      "Faction identities, alliances, rivalries, territory, and strategic relationships.",
    addLabel: "Attach Faction Registry",
    emptyLabel: "No Faction Registries attached.",
    attachments: [],
  },
  {
    id: "organizationRegistries",
    label: "Organization Registries",
    body:
      "Organizations, leadership, facilities, responsibilities, and institutional relationships.",
    addLabel: "Attach Organization Registry",
    emptyLabel: "No Organization Registries attached.",
    attachments: [],
  },
];

export const roomRegistryAttachmentsPopulatedFixture = {
  eyebrow: "Story Registries",
  title: "Registry Attachments",
  body:
    "Attach registries directly to this Story. Story registries take priority over inherited Location registries of the same kind.",
  groups: EMPTY_GROUPS.map((group) => {
    if (group.id === "eventRegistries") {
      return {
        ...group,
        attachments: [
          {
            id: "event_registry_1",
            title: "Moonmarket Events",
            typeLabel: "Event Registry",
            description:
              "Markets, festivals, public disturbances, and timed city events.",
            imageUrl: "/images/placeholder-card.jpg",
            notes: "Prefer evening events during the opening act.",
            removeAriaLabel: "Remove attached registry",
          },
        ],
      };
    }

    if (group.id === "npcRegistries") {
      return {
        ...group,
        attachments: [
          {
            id: "npc_registry_1",
            title: "Ashen Court NPCs",
            typeLabel: "NPC Registry",
            description:
              "Court officials, servants, rivals, witnesses, and hidden informants.",
            imageUrl: "",
            notes: "Keep the magistrate available as a narrative target.",
            removeAriaLabel: "Remove attached registry",
          },
          {
            id: "npc_registry_2",
            title: "Harbor District Locals",
            typeLabel: "NPC Registry",
            description:
              "Dockworkers, traders, watch officers, and neighborhood contacts.",
            imageUrl: "/images/placeholder-card.jpg",
            notes: "",
            removeAriaLabel: "Remove attached registry",
          },
        ],
      };
    }

    return group;
  }),
};

export const roomRegistryAttachmentsEmptyFixture = {
  ...roomRegistryAttachmentsPopulatedFixture,
  groups: EMPTY_GROUPS,
};

export const roomRegistryAttachmentsLegacyFixture = {
  ...roomRegistryAttachmentsPopulatedFixture,
  groups: EMPTY_GROUPS.map((group) =>
    group.id === "locationRegistries"
      ? {
          ...group,
          attachments: [
            {
              id: "legacy_location_registry_id",
              title: "legacy-location-registry-id",
              typeLabel: "REGISTRY",
              description: "",
              imageUrl: "",
              notes: "",
              removeAriaLabel: "Remove attached registry",
            },
          ],
        }
      : group
  ),
};

export const roomRegistryAttachmentsLongContentFixture = {
  eyebrow: "Story Registry Priority and Runtime Availability",
  title:
    "Story-Specific Registry Attachments for a Large Multi-Region Chronicle",
  body:
    "A deliberately long explanation describing how room-level Event, Quest, NPC, Item, Location, Faction, and Organization Registries override or supplement inherited Location context during a complex Story runtime.",
  groups: EMPTY_GROUPS.map((group, index) => ({
    ...group,
    label: `${group.label} with an unusually descriptive heading`,
    body: `${group.body} This additional copy exists to stress wrapping and responsive layout across narrow and wide viewports.`,
    attachments:
      index === 0
        ? [
            {
              id: "long_registry",
              title:
                "The Complete Calendar of Ceremonies, Public Incidents, Seasonal Markets, and Political Gatherings",
              typeLabel: "Event Registry",
              description:
                "A deliberately long registry description covering multiple districts, seasonal schedules, public gatherings, and contingent political incidents.",
              imageUrl: "/images/placeholder-card.jpg",
              notes:
                "Use the registry conservatively and prioritize only events that support the current Story beat.",
              removeAriaLabel: "Remove attached registry",
            },
          ]
        : [],
  })),
};

export const roomRegistryAttachmentsNoGroupsFixture = {
  ...roomRegistryAttachmentsPopulatedFixture,
  groups: [],
};

export const roomRegistryAttachmentsMissingCallbacksFixture = {
  ...roomRegistryAttachmentsPopulatedFixture,
  onOpenRegistryPicker: null,
  onRemoveRegistry: null,
  onChangeRegistryNotes: null,
};
