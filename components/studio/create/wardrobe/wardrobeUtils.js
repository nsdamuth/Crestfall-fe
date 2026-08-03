export const WARDROBE_KIND = "WARDROBE";
export const WARDROBE_VERSION = "1.0";

export const WARDROBE_IMAGE_PROMPT_MAX_LENGTH = 2000;
export const WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH = 2000;

export function limitWardrobePromptValue(value, maxLength = 2000) {
  return String(value || "").slice(0, maxLength);
}


export const WARDROBE_ENTRY_ROLE_OPTIONS = [
  "DEFAULT",
  "CASUAL",
  "FORMAL",
  "WORK",
  "TRAVEL",
  "COMBAT",
  "SLEEPWEAR",
  "CEREMONIAL",
  "DISGUISE",
  "SEASONAL",
  "SPECIAL",
];

export const WARDROBE_FALLBACK_MODE_OPTIONS = [
  "DEFAULT_THEN_FIRST",
  "FIRST_ENABLED",
  "RANDOM_ENABLED",
];

export function createWardrobeId(prefix = "wardrobe_entry") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeListText(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

export function createEmptyWardrobeEntry() {
  return {
    id: createWardrobeId(),
    outfitCreationId: "",
    outfitTitle: "",
    outfitDescription: "",
    outfitImageUrl: "",
    outfitContentRating: "SFW",
    label: "",
    role: "DEFAULT",
    contextTags: [],
    priority: 50,
    enabled: true,
    notes: "",
  };
}

export function createEmptyWardrobeData() {
  return {
    wardrobe_kind: WARDROBE_KIND,
    wardrobe_version: WARDROBE_VERSION,
    scope: "",
    entries: [],
    selectionRules: {
      fallbackMode: "DEFAULT_THEN_FIRST",
      allowRandom: false,
    },
    promptGuidance: {
      summary: "",
      usageNotes: "",
    },
    middleware_hints: {
      intendedUse: [
        "character_default_clothing",
        "chat_outfit_continuity",
        "image_generation_clothing",
      ],
      strictness: "guided",
      allowRuntimeMutation: true,
    },
    builder: "WARDROBE_BUILDER",
    builder_version: "1.0",
  };
}

export function normalizeWardrobeEntry(entry = {}) {
  const priority = Number.parseInt(entry.priority, 10);

  return {
    ...createEmptyWardrobeEntry(),
    ...entry,
    id: entry.id || createWardrobeId(),
    contextTags: Array.isArray(entry.contextTags) ? entry.contextTags : [],
    priority: Number.isFinite(priority) ? priority : 50,
    enabled: entry.enabled !== false,
  };
}

export function normalizeWardrobeData(data = {}) {
  const base = createEmptyWardrobeData();

  return {
    ...base,
    ...data,
    wardrobe_kind: WARDROBE_KIND,
    wardrobe_version: data.wardrobe_version || WARDROBE_VERSION,
    image_prompt: limitWardrobePromptValue(
      data.image_prompt,
      WARDROBE_IMAGE_PROMPT_MAX_LENGTH
    ),
    negative_prompt: limitWardrobePromptValue(
      data.negative_prompt,
      WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH
    ),
    entries: Array.isArray(data.entries)
      ? data.entries.map(normalizeWardrobeEntry)
      : [],
    selectionRules: {
      ...base.selectionRules,
      ...(data.selectionRules || {}),
    },
    promptGuidance: {
      ...base.promptGuidance,
      ...(data.promptGuidance || {}),
    },
    middleware_hints: {
      ...base.middleware_hints,
      ...(data.middleware_hints || {}),
    },
  };
}

export function buildWardrobeCreationPayload({ title, description, data }) {
  return {
    type: WARDROBE_KIND,
    title: String(title || "Untitled Wardrobe").trim(),
    description: String(description || "").trim(),
    visibility: "PRIVATE",
    status: "DRAFT",
    contentRating: "SFW",
    canonStatus: "NONE",
    data: normalizeWardrobeData(data),
  };
}