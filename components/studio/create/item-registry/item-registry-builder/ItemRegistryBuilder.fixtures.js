const sampleEntries = [
  {
    id: "item-brass-compass",
    name: "Brass Resonance Compass",
    aliasesText: "Marlowe's compass\nThe impossible compass",
    aliases: ["Marlowe's compass", "The impossible compass"],
    category: "Technology",
    role: "SIGNATURE_OBJECT",
    defaultPlacement: "DISPLAYED",
    description:
      "A workshop instrument that points toward unstable rooms, events, or resonance traces.",
    visualDescription:
      "Palm-sized engraved brass compass with layered glass, fine needles, and a faint blue resonance glow.",
    symbolicMeaning:
      "Represents dangerous curiosity and the workshop's unfinished mysteries.",
    ownershipNotes: "Maintained by Marlowe and inspected by Kessa.",
    locationNotes: "Normally displayed near the workshop calibration bench.",
    quantityMode: "UNIQUE",
    startingQuantity: "1",
    consumptionMode: "NONE",
    durabilityMode: "BROKEN_REPAIRABLE",
    conditionPercent: "82",
    availabilityRule: "Available only while the Story has access to the workshop.",
    doNotHallucinateAvailability: true,
    promptGuidance: "Include engraved brass rings and a visibly restless needle.",
    negativePromptNotes: "Avoid modern plastic, digital screens, or ordinary map markings.",
  },
  {
    id: "item-tuning-gear",
    name: "Missing Tuning Gear",
    aliasesText: "Resonance gear",
    aliases: ["Resonance gear"],
    category: "Key / Access",
    role: "QUEST_OBJECT",
    defaultPlacement: "HIDDEN",
    description: "A tiny calibrated gear missing from the resonance compass.",
    visualDescription: "Small etched brass gear with one blue enamel tooth.",
    symbolicMeaning: "A minor missing object that can expose a larger anomaly.",
    ownershipNotes: "Workshop property.",
    locationNotes: "Unknown at Story start.",
    quantityMode: "UNIQUE",
    startingQuantity: "1",
    consumptionMode: "NONE",
    durabilityMode: "NONE",
    conditionPercent: "100",
    availabilityRule: "Must be discovered through investigation.",
    doNotHallucinateAvailability: true,
    promptGuidance: "Show only when the quest has exposed it.",
    negativePromptNotes: "Do not place it openly on the workbench before discovery.",
  },
];

const promptGuidance = {
  summary: "Workshop objects should support continuity, investigation, and image composition.",
  usageNotes: "Surface items only when their holder, location, or Story state permits them.",
  negativePromptNotes: "Do not invent duplicate signature objects or modern substitutes.",
};

function fixture(activeTab, overrides = {}) {
  const reviewData = {
    scope: "Brasswhisker workshop inventories and quest objects",
    entries: sampleEntries,
    prompt_guidance: promptGuidance,
  };

  return {
    title: "Brasswhisker Object Ledger",
    description:
      "Tracks important workshop instruments, missing components, and signature props.",
    scope: reviewData.scope,
    activeTab,
    tabs: [
      ["overview", "Overview", "overview"],
      ["entries", "Entries", "entries"],
      ["associations", "Associations", "associations"],
      ["tracking", "Tracking", "tracking"],
      ["prompt", "Prompt Guidance", "prompt"],
      ["review", "Review", "review"],
    ].map(([id, label, iconKey]) => ({
      id,
      label,
      iconKey,
      active: id === activeTab,
    })),
    entries: sampleEntries,
    activeEntryId: sampleEntries[0].id,
    activeEntry: sampleEntries[0],
    promptGuidance,
    reviewPayloadText: JSON.stringify(reviewData, null, 2),
    saveStatus: "idle",
    saveMessage: "",
    savedCreationId: null,
    openDraftHref: "",
    categoryOptions: [
      { value: "Technology", label: "Technology" },
      { value: "Key / Access", label: "Key / Access" },
    ],
    roleOptions: [
      { value: "SIGNATURE_OBJECT", label: "Signature Object" },
      { value: "QUEST_OBJECT", label: "Quest Object" },
    ],
    placementOptions: [
      { value: "DISPLAYED", label: "Displayed" },
      { value: "HIDDEN", label: "Hidden" },
    ],
    quantityOptions: [
      { value: "UNIQUE", label: "Unique" },
      { value: "COUNTED", label: "Counted" },
    ],
    consumptionOptions: [
      { value: "NONE", label: "None" },
      { value: "CONSUMABLE", label: "Consumable" },
    ],
    durabilityOptions: [
      { value: "NONE", label: "None" },
      { value: "BROKEN_REPAIRABLE", label: "Broken Repairable" },
    ],
    ...overrides,
  };
}

export const itemRegistryBuilderOverviewFixture = fixture("overview");
export const itemRegistryBuilderEntriesFixture = fixture("entries");
export const itemRegistryBuilderAssociationsFixture = fixture("associations");
export const itemRegistryBuilderTrackingFixture = fixture("tracking");
export const itemRegistryBuilderPromptFixture = fixture("prompt");
export const itemRegistryBuilderReviewFixture = fixture("review");
export const itemRegistryBuilderSavingFixture = fixture("entries", {
  saveStatus: "saving",
});
export const itemRegistryBuilderErrorFixture = fixture("overview", {
  saveStatus: "error",
  saveMessage: "Item registry could not be saved.",
});
