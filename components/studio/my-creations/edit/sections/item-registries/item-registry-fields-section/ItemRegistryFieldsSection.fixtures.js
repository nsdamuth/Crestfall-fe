const noop = null;

const sampleEntry = {
  id: "entry-framed-pistol",
  isActive: true,
  nameValue: "Framed Djuna pistol",
  nameDisplay: "Framed Djuna pistol",
  categoryValue: "Weapon",
  categoryDisplay: "Weapon",
  roleValue: "SIGNATURE_OBJECT",
  roleDisplay: "Signature Object",
  defaultPlacementValue: "DISPLAYED",
  aliasesText: "Djuna's gift\nThe framed pistol",
  descriptionValue:
    "A preserved pistol displayed as a reminder of an old alliance.",
  visualDescriptionValue:
    "Dark metal in a walnut frame with a small engraved brass plate.",
  symbolicMeaningValue: "Trust, debt, and a promise that remains unsettled.",
  ownershipNotesValue: "Held by Charlotte after Djuna transferred it.",
  locationNotesValue: "Displayed in Charlotte's private office.",
  quantityModeValue: "UNIQUE",
  startingQuantityValue: "1",
  consumptionModeValue: "NONE",
  durabilityModeValue: "CONDITION_PERCENT",
  conditionPercentValue: "92",
  availabilityRuleValue: "Available only in Charlotte's office.",
  doNotHallucinateAvailabilityChecked: true,
  promptGuidanceValue:
    "Show the framed pistol only when the office display or Djuna is relevant.",
  negativePromptNotesValue: "Do not place it in Charlotte's hands by default.",
  onSelect: noop,
  onChangeName: noop,
  onChangeCategory: noop,
  onChangeRole: noop,
  onChangeDefaultPlacement: noop,
  onChangeAliasesText: noop,
  onChangeDescription: noop,
  onChangeVisualDescription: noop,
  onChangeSymbolicMeaning: noop,
  onChangeOwnershipNotes: noop,
  onChangeLocationNotes: noop,
  onChangeQuantityMode: noop,
  onChangeStartingQuantity: noop,
  onChangeConsumptionMode: noop,
  onChangeDurabilityMode: noop,
  onChangeConditionPercent: noop,
  onChangeAvailabilityRule: noop,
  onChangeDoNotHallucinateAvailability: noop,
  onChangePromptGuidance: noop,
  onChangeNegativePromptNotes: noop,
  onDelete: noop,
};

const baseFixture = {
  sectionEyebrow: "Object Continuity",
  sectionTitle: "Inventory & Signature Objects",
  sectionDescription: "",
  registryTitleValue: "Charlotte's Signature Objects",
  registryScopeValue: "Character inventory and office props",
  registryDescriptionValue:
    "Tracks objects that should remain consistent across Charlotte scenes.",
  entries: [sampleEntry],
  activeEntry: sampleEntry,
  categoryOptions: [
    { value: "General", label: "General" },
    { value: "Weapon", label: "Weapon" },
  ],
  roleOptions: [
    { value: "SIGNATURE_OBJECT", label: "Signature Object" },
    { value: "QUEST_OBJECT", label: "Quest Object" },
  ],
  placementOptions: [
    { value: "DISPLAYED", label: "Displayed" },
    { value: "CARRIED", label: "Carried" },
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
    { value: "CONDITION_PERCENT", label: "Condition Percent" },
  ],
  startingAssignmentContentByEntryId: {
    "entry-framed-pistol": "Starting assignment editor preview slot",
  },
  promptSummaryValue:
    "Use signature objects as continuity anchors, not automatic props.",
  promptUsageNotesValue:
    "Surface an item only when ownership, location, and current Story state allow it.",
  promptNegativeNotesValue:
    "Do not invent duplicates or assume an item follows its owner everywhere.",
  reviewEntryCountValue: "1",
  reviewScopeValue: "Character inventory and office props",
  reviewPayloadText: JSON.stringify(
    {
      scope: "Character inventory and office props",
      entries: [{ id: "entry-framed-pistol", name: "Framed Djuna pistol" }],
    },
    null,
    2
  ),
  onChangeRegistryTitle: noop,
  onChangeRegistryScope: noop,
  onChangeRegistryDescription: noop,
  onAddEntry: noop,
  onChangePromptSummary: noop,
  onChangePromptUsageNotes: noop,
  onChangePromptNegativeNotes: noop,
};

export const itemRegistryFieldsOverviewFixture = {
  ...baseFixture,
  activeSection: "overview",
  sectionEyebrow: "Object Continuity",
  sectionTitle: "Inventory & Signature Objects",
  sectionDescription:
    "Describe what this registry tracks and how runtime systems should use it.",
};

export const itemRegistryFieldsEntriesFixture = {
  ...baseFixture,
  activeSection: "entries",
  sectionEyebrow: "Entries",
  sectionTitle: "Objects",
  sectionDescription:
    "Add important objects, equipment, consumables, wardrobes, caches, quest objects, or memory props.",
};

export const itemRegistryFieldsAssociationsFixture = {
  ...baseFixture,
  activeSection: "associations",
  sectionEyebrow: "Associations",
  sectionTitle: "Starting Ownership and Location",
  sectionDescription:
    "Assign each item to its starting holder and authored placement.",
};

export const itemRegistryFieldsTrackingFixture = {
  ...baseFixture,
  activeSection: "tracking",
  sectionEyebrow: "Tracking",
  sectionTitle: "Runtime Tracking Rules",
  sectionDescription:
    "Prepare quantity, consumption, durability, condition, and availability rules.",
};

export const itemRegistryFieldsPromptFixture = {
  ...baseFixture,
  activeSection: "prompt",
  sectionEyebrow: "Prompt Guidance",
  sectionTitle: "Image and Runtime Guidance",
  sectionDescription:
    "Describe how this registry should feed image generation and runtime packets.",
};

export const itemRegistryFieldsReviewFixture = {
  ...baseFixture,
  activeSection: "review",
  sectionEyebrow: "Review",
  sectionTitle: "Structured Payload Preview",
  sectionDescription:
    "Review the normalized registry payload before the parent Creation Edit save.",
};

export const itemRegistryFieldsEmptyFixture = {
  ...itemRegistryFieldsEntriesFixture,
  entries: [],
  activeEntry: null,
  reviewEntryCountValue: "0",
};
