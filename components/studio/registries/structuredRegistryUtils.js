import {
  getStructuredRegistryConfig,
  isStructuredRegistryType,
} from "@/components/studio/registries/structuredRegistryConfigs";

export const STRUCTURED_REGISTRY_VERSION = "1.0";

export const LINKED_CREATION_FIELDS = [
  "linkedCharacters",
  "linkedLocations",
  "linkedOrganizations",
  "linkedFactions",
  "linkedItems",
  "linkedEvents",
  "linkedQuests",
];

export function createRegistryId(prefix = "entry") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeRewardList(value, fields) {
  if (!Array.isArray(value)) return [];

  return value
    .map((raw) => {
      const source = normalizeObject(raw);
      const normalized = Object.fromEntries(
        fields.map((field) => [field, normalizeString(source[field])])
      );
      return Object.values(normalized).some(Boolean) ? normalized : null;
    })
    .filter(Boolean);
}

export function normalizeQuestRewardFields(entry = {}) {
  const source = normalizeObject(entry);
  return {
    rewardSummary: normalizeString(
      source.rewardSummary || source.reward_summary
    ),
    monetaryRewards: normalizeRewardList(
      source.monetaryRewards || source.monetary_rewards,
      ["amount", "currency", "condition"]
    ),
    itemRewards: normalizeRewardList(
      source.itemRewards || source.item_rewards,
      ["name", "quantity", "condition"]
    ),
    otherRewards: normalizeRewardList(
      source.otherRewards || source.other_rewards,
      ["description", "condition"]
    ),
    hiddenRewardNotes: normalizeString(
      source.hiddenRewardNotes || source.hidden_reward_notes
    ),
  };
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

function getFeaturedImageUrl(creation) {
  const data = normalizeObject(creation?.data);
  const featuredMedia =
    creation?.featuredMedia ||
    creation?.featured_media ||
    data.featuredMedia ||
    data.featured_media ||
    [];

  const firstMedia = Array.isArray(featuredMedia) ? featuredMedia[0] : null;

  return (
    firstMedia?.thumbnailUrl ||
    firstMedia?.thumbnail_url ||
    firstMedia?.imageUrl ||
    firstMedia?.image_url ||
    firstMedia?.url ||
    firstMedia?.displayUrl ||
    firstMedia?.display_url ||
    creation?.thumbnailUrl ||
    creation?.thumbnail_url ||
    creation?.imageUrl ||
    creation?.image_url ||
    creation?.coverImageUrl ||
    creation?.cover_image_url ||
    data.thumbnailUrl ||
    data.thumbnail_url ||
    data.imageUrl ||
    data.image_url ||
    data.coverImageUrl ||
    data.cover_image_url ||
    data.avatarUrl ||
    data.avatar_url ||
    ""
  );
}

export function createLinkedCreationLink(creation = {}) {
  return {
    id: createRegistryId("link"),
    creationId: creation.id || creation.creationId || null,
    title:
      creation.title ||
      creation.name ||
      creation.data?.name ||
      "Untitled Creation",
    type: String(creation.type || creation.creationType || "CREATION").toUpperCase(),
    description: creation.description || "",
    imageUrl: getFeaturedImageUrl(creation),
    notes: "",
  };
}

export function normalizeLinkedCreationLink(value = {}) {
  if (typeof value === "string") {
    const title = normalizeString(value);

    if (!title) return null;

    return {
      id: createRegistryId("link"),
      creationId: null,
      title,
      type: "LEGACY_TEXT",
      description: "",
      imageUrl: "",
      notes: "",
    };
  }

  const source = normalizeObject(value);
  const rawId = normalizeString(source.id);
  const creationId = normalizeString(
    source.creationId ||
      source.creation_id ||
      (!rawId.startsWith("link_") ? rawId : "")
  );

  const title = normalizeString(
    source.title ||
      source.name ||
      source.label ||
      source.displayName ||
      source.display_name
  );

  if (!creationId && !title) return null;

  return {
    id: rawId.startsWith("link_") ? rawId : createRegistryId("link"),
    creationId: creationId || null,
    title: title || "Untitled Creation",
    type: normalizeString(source.type || source.creationType || source.creation_type || "CREATION").toUpperCase(),
    description: normalizeString(source.description),
    imageUrl:
    normalizeString(
      source.imageUrl ||
        source.image_url ||
        source.thumbnailUrl ||
        source.thumbnail_url ||
        source.avatarUrl ||
        source.avatar_url ||
        source.coverImageUrl ||
        source.cover_image_url
    ) || "",
    notes: normalizeString(source.notes),
  };
}

export function normalizeLinkedCreationLinks(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeLinkedCreationLink).filter(Boolean);
  }

  if (typeof value === "string") {
    return normalizeListText(value).map((item) =>
      normalizeLinkedCreationLink(item)
    ).filter(Boolean);
  }

  return [];
}

export function createEmptyStructuredRegistryEntry(registryType) {
  const config = getStructuredRegistryConfig(registryType);

  return {
    id: createRegistryId("entry"),
    name: "",
    aliases: [],
    category: config.categoryOptions?.[0] || "General",
    summary: "",
    publicDescription: "",
    hiddenNotes: "",
    visualIdentity: "",
    relationshipNotes: "",

    linkedCharacters: [],
    linkedLocations: [],
    linkedOrganizations: [],
    linkedFactions: [],
    linkedItems: [],
    linkedEvents: [],
    linkedQuests: [],

    rulesNotes: "",
    accessRules: "",
    knowledgeRules: "",
    consequences: "",
    ...(String(registryType || "").toUpperCase() === "QUEST_REGISTRY"
      ? {
          rewardSummary: "",
          monetaryRewards: [],
          itemRewards: [],
          otherRewards: [],
          hiddenRewardNotes: "",
        }
      : {}),
    promptGuidance: "",
    negativePromptNotes: "",
    middlewareHints: "",
  };
}

export function createEmptyStructuredRegistryData(registryType) {
  const safeRegistryType = isStructuredRegistryType(registryType)
    ? registryType
    : "ORGANIZATION_REGISTRY";

  return {
    registry_kind: safeRegistryType,
    registry_version: STRUCTURED_REGISTRY_VERSION,
    scope: "",
    entries: [],
    relationships: [],
    prompt_guidance: {
      summary: "",
      usageNotes: "",
      negativePromptNotes: "",
    },
    middleware_hints: {
      intendedUse: [],
      strictness: "guided",
      allowRuntimeMutation: true,
    },
    builder: "STRUCTURED_REGISTRY_BUILDER",
    builder_version: "1.0",
  };
}

export function normalizeStructuredRegistryEntry(entry = {}, registryType) {
  const base = createEmptyStructuredRegistryEntry(registryType);
  const merged = {
    ...base,
    ...entry,
  };

  return {
    ...merged,
    id: entry.id || createRegistryId("entry"),
    aliases: Array.isArray(merged.aliases) ? merged.aliases : [],

    linkedCharacters: normalizeLinkedCreationLinks(merged.linkedCharacters),
    linkedLocations: normalizeLinkedCreationLinks(merged.linkedLocations),
    linkedOrganizations: normalizeLinkedCreationLinks(merged.linkedOrganizations),
    linkedFactions: normalizeLinkedCreationLinks(merged.linkedFactions),
    linkedItems: normalizeLinkedCreationLinks(merged.linkedItems),
    linkedEvents: normalizeLinkedCreationLinks(merged.linkedEvents),
    linkedQuests: normalizeLinkedCreationLinks(merged.linkedQuests),

    ...(String(registryType || "").toUpperCase() === "QUEST_REGISTRY"
      ? normalizeQuestRewardFields(merged)
      : {}),
  };
}

export function normalizeStructuredRegistryData(data = {}, registryType) {
  const base = createEmptyStructuredRegistryData(registryType);
  const safeRegistryKind =
    data.registry_kind && isStructuredRegistryType(data.registry_kind)
      ? data.registry_kind
      : registryType;

  return {
    ...base,
    ...data,
    registry_kind: safeRegistryKind,
    registry_version: data.registry_version || STRUCTURED_REGISTRY_VERSION,
    entries: Array.isArray(data.entries)
      ? data.entries.map((entry) =>
          normalizeStructuredRegistryEntry(entry, safeRegistryKind)
        )
      : [],
    relationships: Array.isArray(data.relationships)
      ? data.relationships
      : [],
    prompt_guidance: {
      ...base.prompt_guidance,
      ...(data.prompt_guidance || {}),
    },
    middleware_hints: {
      ...base.middleware_hints,
      ...(data.middleware_hints || {}),
    },
  };
}

export function buildStructuredRegistryCreationPayload({
  registryType,
  title,
  description,
  data,
}) {
  const config = getStructuredRegistryConfig(registryType);

  return {
    type: registryType,
    title: String(title || `Untitled ${config.label}`).trim(),
    description: String(description || "").trim(),
    visibility: "PRIVATE",
    status: "DRAFT",
    contentRating: "SFW",
    canonStatus: "NONE",
    data: normalizeStructuredRegistryData(data, registryType),
  };
}