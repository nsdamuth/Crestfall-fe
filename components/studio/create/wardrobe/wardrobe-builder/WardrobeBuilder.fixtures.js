import { buildWardrobeBuilderTabs } from "./WardrobeBuilder.contract";

const roleOptions = [
  { value: "DEFAULT", label: "Default" },
  { value: "WORK", label: "Work" },
  { value: "FORMAL", label: "Formal" },
  { value: "COMBAT", label: "Combat" },
];

const fallbackModeOptions = [
  { value: "DEFAULT_THEN_FIRST", label: "Default Then First" },
  { value: "FIRST_ENABLED", label: "First Enabled" },
  { value: "RANDOM_ENABLED", label: "Random Enabled" },
];

const entries = [
  {
    id: "wardrobe_entry_workshop",
    outfitCreationId: "outfit-kessa-workshop",
    outfitTitle: "Kessa's Artificer Outfit",
    outfitDescription: "Tool-heavy workshop clothing built for movement.",
    outfitImageUrl: "",
    label: "Workshop Outfit",
    role: "WORK",
    contextTagsText: "workshop\ncity\nappraisal",
    priority: 80,
    enabled: true,
    notes: "Use for repairs, appraisal work, and market errands.",
  },
  {
    id: "wardrobe_entry_formal",
    outfitCreationId: "",
    outfitTitle: "",
    outfitDescription: "",
    outfitImageUrl: "",
    label: "Formal Market Outfit",
    role: "FORMAL",
    contextTagsText: "formal\nauction",
    priority: 45,
    enabled: false,
    notes: "Reserved for major trade events.",
  },
];

const baseFixture = {
  title: "Kessa's Wardrobe",
  description:
    "Reusable workshop, travel, and market outfits for Kessa Cindervell.",
  scope: "Kessa's workshop, travel, and public outfits",
  tabs: buildWardrobeBuilderTabs("overview"),
  activeTab: "overview",
  entries,
  activeEntryId: entries[0].id,
  activeEntry: entries[0],
  selectionRules: {
    fallbackMode: "DEFAULT_THEN_FIRST",
    allowRandom: false,
  },
  promptGuidance: {
    summary: "Choose practical outfits that fit the scene and preserve continuity.",
    usageNotes: "Prefer the workshop outfit during artificer work.",
  },
  imagePrompt: "Fantasy artificer wardrobe catalogue, brass and leather craftwear.",
  negativePrompt: "modern logos, sneakers",
  imagePromptMaxLength: 2000,
  negativePromptMaxLength: 2000,
  entryRoleOptions: roleOptions,
  fallbackModeOptions,
  saveStatus: "idle",
  saveMessage: "",
  savedCreationId: null,
};

export const wardrobeBuilderOverviewFixture = {
  ...baseFixture,
};

export const wardrobeBuilderEntriesFixture = {
  ...baseFixture,
  tabs: buildWardrobeBuilderTabs("entries"),
  activeTab: "entries",
};

export const wardrobeBuilderRulesFixture = {
  ...baseFixture,
  tabs: buildWardrobeBuilderTabs("rules"),
  activeTab: "rules",
};

export const wardrobeBuilderEmptyFixture = {
  ...baseFixture,
  tabs: buildWardrobeBuilderTabs("entries"),
  activeTab: "entries",
  entries: [],
  activeEntryId: null,
  activeEntry: null,
};

export const wardrobeBuilderSavingFixture = {
  ...baseFixture,
  saveStatus: "saving",
  saveMessage: "Saving wardrobe draft...",
};

export const wardrobeBuilderErrorFixture = {
  ...baseFixture,
  saveStatus: "error",
  saveMessage: "Wardrobe could not be saved.",
};
