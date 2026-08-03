const entries = [
  {
    id: "person-kessa",
    kind: "CREATION_REF",
    creationId: "character-kessa",
    creationType: "CHARACTER",
    name: "Kessa Cindervell",
    notes: "Artificer, appraiser, and commercially trusted troublemaker.",
  },
  {
    id: "person-marlowe",
    kind: "AD_HOC",
    creationId: "",
    creationType: "",
    name: "Marlowe",
    notes: "Workshop assistant with a talent for resonance instruments.",
  },
];

const registry = {
  title: "Brasswhisker Continuity Spine",
  scope: "Aethelgard workshop and Old Crescent stories",
  description:
    "Tracks the people, relationships, aliases, and knowledge rules surrounding Kessa's workshop.",
  entries,
  relationships: [
    {
      id: "relationship-kessa-marlowe",
      fromEntryId: "person-kessa",
      toEntryId: "person-marlowe",
      type: "Workshop Partners",
      direction: "MUTUAL",
      strength: "HIGH",
      description: "They trust one another with tools, repairs, and dangerous devices.",
    },
  ],
  knowledgeRules: [
    {
      id: "knowledge-missing-gear",
      subject: "The missing tuning gear",
      defaultKnowledge: "UNKNOWN",
      knownByEntryIds: ["person-marlowe"],
      suspectedByEntryIds: ["person-kessa"],
      falseBeliefNotes: "",
      notes: "Marlowe knows the gear is missing; Kessa suspects a device moved it.",
    },
  ],
  aliases: [
    {
      id: "alias-brasswhisker",
      trueEntryId: "person-kessa",
      publicIdentity: "The Brasswhisker",
      rule: "Treat the workshop title and Kessa as one canonical person.",
    },
  ],
};

function fixture(activeTab, overrides = {}) {
  return {
    activeTab,
    registry,
    saveStatus: "idle",
    saveMessage: "",
    characterLoadError: "",
    ...overrides,
  };
}

export const npcRegistryBuilderOverviewFixture = fixture("overview");
export const npcRegistryBuilderEntriesFixture = fixture("entries");
export const npcRegistryBuilderRelationshipsFixture = fixture("relationships");
export const npcRegistryBuilderKnowledgeFixture = fixture("knowledge");
export const npcRegistryBuilderAliasesFixture = fixture("aliases");
export const npcRegistryBuilderSavingFixture = fixture("entries", {
  saveStatus: "saving",
});
export const npcRegistryBuilderErrorFixture = fixture("overview", {
  saveStatus: "error",
  saveMessage: "NPC registry could not be saved.",
  characterLoadError: "Character options could not be loaded.",
});
