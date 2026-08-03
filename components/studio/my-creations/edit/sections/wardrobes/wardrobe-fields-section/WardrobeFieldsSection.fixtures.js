const noop = null;

const sampleEntry = {
  id: "entry-workshop-outfit",
  isActive: true,
  labelValue: "Workshop Outfit",
  labelDisplay: "Workshop Outfit",
  roleValue: "WORK",
  roleDisplay: "Work",
  enabledChecked: true,
  enabledDisplay: "Enabled",
  priorityValue: "80",
  contextTagsText: "workshop\nmerchant district\nartificer",
  notesValue: "Use while Kessa is working, appraising, or repairing objects.",
  outfitCreationId: "9335d31d-efa5-42f4-8c6a-0664ce2b16f5",
  outfitTitle: "Kessa's Artificer Outfit",
  outfitDescription:
    "Fitted artificer workwear with tools, brass fittings, and mobile layers.",
  outfitImageUrl: "",
  onSelect: noop,
  onChangeLabel: noop,
  onChangeRole: noop,
  onChangePriority: noop,
  onChangeContextTagsText: noop,
  onChangeNotes: noop,
  onChangeEnabled: noop,
  onChooseOutfit: noop,
  onDelete: noop,
};

const baseFixture = {
  sectionEyebrow: "Wardrobe",
  sectionTitle: "Wardrobe Identity",
  sectionDescription: "",
  wardrobeTitleValue: "Kessa's Wardrobe",
  wardrobeScopeValue: "Workshop, travel, public, and casual outfits",
  wardrobeDescriptionValue:
    "A reusable wardrobe for Kessa's work, travel, market, and private scenes.",
  entries: [sampleEntry],
  activeEntry: sampleEntry,
  entryRoleOptions: [
    { value: "DEFAULT", label: "Default" },
    { value: "WORK", label: "Work" },
    { value: "TRAVEL", label: "Travel" },
  ],
  fallbackModeOptions: [
    { value: "DEFAULT_THEN_FIRST", label: "Default Then First" },
    { value: "FIRST_ENABLED", label: "First Enabled" },
    { value: "RANDOM_ENABLED", label: "Random Enabled" },
  ],
  fallbackModeValue: "DEFAULT_THEN_FIRST",
  allowRandomChecked: false,
  promptSummaryValue:
    "Favor the outfit that best matches the current scene and activity.",
  promptUsageNotesValue:
    "Use the work outfit for appraisal and workshop scenes; preserve the selected outfit until a scene boundary.",
  imagePromptValue:
    "A curated fantasy artificer wardrobe displayed as a catalogue lineup.",
  negativePromptValue: "modern logos, sneakers, transparent fabric",
  imagePromptMaxLength: 2000,
  negativePromptMaxLength: 2000,
  onChangeWardrobeTitle: noop,
  onChangeWardrobeScope: noop,
  onChangeWardrobeDescription: noop,
  onAddEntry: noop,
  onChangeFallbackMode: noop,
  onChangeAllowRandom: noop,
  onChangePromptSummary: noop,
  onChangePromptUsageNotes: noop,
  onChangeImagePrompt: noop,
  onChangeNegativePrompt: noop,
};

export const wardrobeFieldsOverviewFixture = {
  ...baseFixture,
  activeSection: "overview",
  sectionEyebrow: "Wardrobe",
  sectionTitle: "Wardrobe Identity",
  sectionDescription:
    "Describe this wardrobe and which character, setting, or continuity use it supports.",
};

export const wardrobeFieldsEntriesFixture = {
  ...baseFixture,
  activeSection: "entries",
  sectionEyebrow: "Entries",
  sectionTitle: "Outfit Entries",
  sectionDescription:
    "Each entry points to an Outfit creation selected from your saved outfits.",
};

export const wardrobeFieldsRulesFixture = {
  ...baseFixture,
  activeSection: "rules",
  sectionEyebrow: "Selection Rules",
  sectionTitle: "Default Selection Behavior",
  sectionDescription:
    "These rules prepare the future resolver for chat and image generation.",
};

export const wardrobeFieldsEmptyFixture = {
  ...wardrobeFieldsEntriesFixture,
  entries: [],
  activeEntry: null,
};
