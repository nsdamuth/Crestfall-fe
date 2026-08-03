const sectionCopy = {
  sectionEyebrow: "Location Runtime Context",
  sectionTitle: "Registry Attachments",
  sectionDescription:
    "Attach registries to this location. A Story may override an inherited registry kind, but when it does not, the active Location and its parent ancestry provide the relevant registry context.",
};

const groupCopy = [
  {
    id: "eventRegistries",
    label: "Event Registries",
    addLabel: "Attach Event Registry",
    emptyLabel: "No Event Registries attached.",
    body:
      "Local happenings, gatherings, incidents, festivals, markets, environmental activity, and recurring scene events associated with this location.",
  },
  {
    id: "questRegistries",
    label: "Quest Registries",
    addLabel: "Attach Quest Registry",
    emptyLabel: "No Quest Registries attached.",
    body:
      "Optional side threads, hooks, investigations, errands, unresolved objectives, and quest opportunities associated with this location.",
  },
  {
    id: "npcRegistries",
    label: "NPC Registries",
    addLabel: "Attach NPC Registry",
    emptyLabel: "No NPC Registries attached.",
    body:
      "Residents, employees, visitors, guards, proprietors, and other NPCs commonly associated with this location or its inherited area.",
  },
  {
    id: "itemRegistries",
    label: "Item Registries",
    addLabel: "Attach Item Registry",
    emptyLabel: "No Item Registries attached.",
    body:
      "Items, merchandise, equipment, resources, fixtures, and portable objects commonly available or tracked at this location.",
  },
  {
    id: "locationRegistries",
    label: "Location Registries",
    addLabel: "Attach Location Registry",
    emptyLabel: "No Location Registries attached.",
    body:
      "Nearby, contained, connected, or otherwise relevant locations used for navigation, adjacency, travel, and local scene continuity.",
  },
  {
    id: "factionRegistries",
    label: "Faction Registries",
    addLabel: "Attach Faction Registry",
    emptyLabel: "No Faction Registries attached.",
    body:
      "Factions controlling, contesting, visiting, protecting, or otherwise influencing this location and its surrounding area.",
  },
  {
    id: "organizationRegistries",
    label: "Organization Registries",
    addLabel: "Attach Organization Registry",
    emptyLabel: "No Organization Registries attached.",
    body:
      "Businesses, institutions, agencies, guilds, departments, and other organizations operating from or interacting with this location.",
  },
];

function withLinks(linkMap = {}) {
  return groupCopy.map((group) => ({
    ...group,
    links: linkMap[group.id] || [],
  }));
}

export const locationRegistryAttachmentsCompleteFixture = {
  ...sectionCopy,
  groups: withLinks({
    eventRegistries: [
      {
        id: "link_event_market_queue",
        creationId: "event-registry-market-queue",
        title: "Old Crescent Market Events",
        type: "EVENT_REGISTRY",
        description:
          "Recurring market incidents, festivals, merchant disputes, and environmental activity.",
        imageUrl: "/assets/covers/crestfall-compass-cover.png",
        notes: "Use for daytime street and workshop interruptions.",
      },
    ],
    questRegistries: [
      {
        id: "link_quest_side_threads",
        creationId: "quest-registry-side-threads",
        title: "Old Crescent Side Threads",
        type: "QUEST_REGISTRY",
        description:
          "Optional investigations, errands, favors, and unresolved local objectives.",
        imageUrl: "",
        notes: "Keep these hooks optional and low-pressure.",
      },
    ],
    npcRegistries: [
      {
        id: "link_npc_residents",
        creationId: "npc-registry-residents",
        title: "Old Crescent Residents",
        type: "NPC_REGISTRY",
        description: "Merchants, couriers, guards, and regular customers.",
        imageUrl: "",
        notes: "",
      },
    ],
  }),
};

export const locationRegistryAttachmentsLegacyFixture = {
  ...sectionCopy,
  groups: withLinks({
    itemRegistries: [
      {
        id: "legacy_8219b6d6-e768-472b-9255-c6572bc9522b",
        creationId: "8219b6d6-e768-472b-9255-c6572bc9522b",
        title: "8219b6d6-e768-472b-9255-c6572bc9522b",
        type: "REGISTRY",
        description: "",
        imageUrl: "",
        notes: "",
      },
    ],
  }),
};

export const locationRegistryAttachmentsMixedFixture = {
  ...sectionCopy,
  groups: withLinks({
    locationRegistries: [
      {
        id: "link_connected_places",
        creationId: "location-registry-connected-places",
        title: "Connected Trade District Places",
        type: "LOCATION_REGISTRY",
        description:
          "Nearby streets, shops, alleys, markets, and travel relationships.",
        imageUrl: "/assets/covers/crestfall-sundial-cover.png",
        notes: "Use as the local navigation layer.",
      },
    ],
    factionRegistries: [
      {
        id: "link_trade_factions",
        creationId: "faction-registry-trade-factions",
        title: "Trade District Interests",
        type: "FACTION_REGISTRY",
        description: "Guilds and groups competing for influence nearby.",
        imageUrl: "",
        notes: "",
      },
    ],
    organizationRegistries: [
      {
        id: "link_trade_orgs",
        creationId: "organization-registry-trade-orgs",
        title: "Old Crescent Institutions",
        type: "ORGANIZATION_REGISTRY",
        description: "Shops, offices, guilds, and civic institutions.",
        imageUrl: "",
        notes: "",
      },
    ],
  }),
};

export const locationRegistryAttachmentsEmptyFixture = {
  ...sectionCopy,
  groups: withLinks(),
};
