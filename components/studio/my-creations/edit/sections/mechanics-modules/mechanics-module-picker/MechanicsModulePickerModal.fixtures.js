const personalModules = [
  {
    id: "fixture-survival",
    sourceLabel: "My Module",
    title: "Survival Trackers",
    description:
      "Reusable hunger, thirst, fatigue, and exposure trackers for grounded travel scenes.",
    moduleId: "creator.survival.trackers.v1",
    trackerCount: 4,
    guardCount: 3,
    commandCount: 5,
    status: "DRAFT",
    visibility: "PRIVATE",
    tags: ["survival", "travel", "trackers"],
    searchTerms: ["crestfallen_fixture_builder"],
  },
  {
    id: "fixture-reputation",
    sourceLabel: "My Module",
    title: "Faction Reputation",
    description:
      "Tracks standing with local factions and gates relationship-dependent events.",
    moduleId: "creator.faction.reputation.v1",
    trackerCount: 3,
    guardCount: 6,
    commandCount: 2,
    status: "APPROVED",
    visibility: "INTERNAL",
    tags: ["factions", "reputation", "guards"],
    searchTerms: ["crestfallen_fixture_builder"],
  },
];

const publicModules = [
  {
    id: "fixture-public-romance",
    sourceLabel: "Public Module",
    title: "Slow-Burn Relationship Meter",
    description:
      "An approved community module for gradual trust, attraction, and relationship progression.",
    moduleId: "community.relationship.slowburn.v2",
    trackerCount: 3,
    guardCount: 4,
    commandCount: 4,
    status: "APPROVED",
    visibility: "PUBLIC",
    tags: ["relationship", "romance", "community"],
    searchTerms: ["crestfallen_community_author"],
  },
];

const populatedSources = [
  {
    id: "mine",
    label: "My Mechanics",
    emptyMessage: "No available mechanics modules found for this tab.",
    items: personalModules,
  },
  {
    id: "public",
    label: "Public Mechanics",
    emptyMessage: "No available mechanics modules found for this tab.",
    items: publicModules,
  },
];

const baseFixture = {
  eyebrow: "Mechanics Modules",
  title: "Attach Runtime Mechanics",
  description:
    "Choose a reusable Mechanics Module to attach to this location. Public modules are approved modules published by other creators.",
  sources: populatedSources,
  initialSourceId: "mine",
  loadStatus: "loaded",
  loadMessage: "",
  searchPlaceholder: "Search mechanics modules...",
  onClose: null,
  onChooseModule: null,
};

export const mechanicsModulePickerMineFixture = {
  ...baseFixture,
};

export const mechanicsModulePickerPublicFixture = {
  ...baseFixture,
  initialSourceId: "public",
};

export const mechanicsModulePickerLoadingFixture = {
  ...baseFixture,
  sources: [
    { ...populatedSources[0], items: [] },
    { ...populatedSources[1], items: [] },
  ],
  loadStatus: "loading",
};

export const mechanicsModulePickerErrorFixture = {
  ...baseFixture,
  sources: [
    { ...populatedSources[0], items: [] },
    { ...populatedSources[1], items: [] },
  ],
  loadStatus: "error",
  loadMessage: "Mechanics modules could not be loaded from the fixture service.",
};

export const mechanicsModulePickerEmptyFixture = {
  ...baseFixture,
  sources: [
    { ...populatedSources[0], items: [] },
    { ...populatedSources[1], items: [] },
  ],
};

export const mechanicsModulePickerLongContentFixture = {
  ...baseFixture,
  sources: [
    {
      ...populatedSources[0],
      items: [
        {
          ...personalModules[0],
          id: "fixture-long-content",
          title:
            "Interlocking Political Influence, Social Leverage, and Multi-Faction Consequence Framework",
          description:
            "A deliberately long fixture description used to verify that unusually verbose module names and explanatory copy remain readable without changing the modal's visual hierarchy or overflowing its cards.",
          moduleId:
            "creator.extremely.long.namespace.interlocking.political.influence.v1",
          tags: [
            "politics",
            "social leverage",
            "consequences",
            "multi-faction",
            "campaign",
            "long label",
            "stress test",
          ],
        },
      ],
    },
    populatedSources[1],
  ],
};
