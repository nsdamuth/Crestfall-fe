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

export function createLinkedCreationReferenceKey({
  creationId,
  registryCreationId,
  registryEntryId,
} = {}) {
  const safeCreationId = normalizeString(registryCreationId || creationId);
  const safeRegistryEntryId = normalizeString(registryEntryId);

  return [safeCreationId, safeRegistryEntryId].join("::");
}

export function isDirectStructuredRegistrySelfReference(
  link,
  {
    currentRegistryCreationId = "",
    currentRegistryEntryId = "",
  } = {}
) {
  const sourceRegistryCreationId = normalizeString(currentRegistryCreationId);
  const sourceRegistryEntryId = normalizeString(currentRegistryEntryId);

  if (!sourceRegistryCreationId || !sourceRegistryEntryId) return false;

  const target = normalizeObject(link);
  const targetRegistryCreationId = normalizeString(
    target.registryCreationId ||
      target.registry_creation_id ||
      target.creationId ||
      target.creation_id
  );
  const targetRegistryEntryId = normalizeString(
    target.registryEntryId ||
      target.registry_entry_id ||
      target.targetEntryId ||
      target.target_entry_id
  );

  return (
    targetRegistryCreationId === sourceRegistryCreationId &&
    targetRegistryEntryId === sourceRegistryEntryId
  );
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

export function createLinkedCreationLink(creation = {}, registryEntry = null) {
  const creationId = normalizeString(creation.id || creation.creationId);
  const creationType = normalizeString(
    creation.type || creation.creationType || "CREATION"
  ).toUpperCase();
  const registryEntryId = normalizeString(
    registryEntry?.id || registryEntry?.registryEntryId
  );

  return {
    id: createRegistryId("link"),
    creationId: creationId || null,
    creationType,
    ...(isStructuredRegistryType(creationType) && registryEntryId
      ? {
          registryCreationId: creationId,
          registryEntryId,
        }
      : {}),
    notes: "",
  };
}

export function normalizeLinkedCreationLink(value = {}) {
  if (typeof value === "string") {
    const legacyLabel = normalizeString(value);

    if (!legacyLabel) return null;

    return {
      id: createRegistryId("link"),
      creationId: null,
      creationType: "LEGACY_TEXT",
      notes: legacyLabel,
    };
  }

  const source = normalizeObject(value);
  const rawId = normalizeString(source.id);
  const creationId = normalizeString(
    source.creationId ||
      source.creation_id ||
      source.registryCreationId ||
      source.registry_creation_id ||
      (!rawId.startsWith("link_") ? rawId : "")
  );

  if (!creationId) return null;

  const creationType = normalizeString(
    source.creationType ||
      source.creation_type ||
      source.type ||
      "CREATION"
  ).toUpperCase();
  const registryCreationId = normalizeString(
    source.registryCreationId ||
      source.registry_creation_id ||
      (isStructuredRegistryType(creationType) ? creationId : "")
  );
  const registryEntryId = normalizeString(
    source.registryEntryId ||
      source.registry_entry_id ||
      source.targetEntryId ||
      source.target_entry_id
  );

  return {
    id: rawId.startsWith("link_") ? rawId : createRegistryId("link"),
    creationId,
    creationType,
    ...(isStructuredRegistryType(creationType) && registryEntryId
      ? {
          registryCreationId: registryCreationId || creationId,
          registryEntryId,
        }
      : {}),
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

function dedupeLinkedCreationLinks(links = []) {
  const byKey = new Map();

  links.forEach((link) => {
    if (!link) return;
    const key = [
      createLinkedCreationReferenceKey(link),
      normalizeString(link.id),
    ].join("::");

    if (!byKey.has(key)) byKey.set(key, link);
  });

  return [...byKey.values()];
}

function normalizeOrganizationFactionLinkBuckets(entry = {}) {
  const organizationLinks = normalizeLinkedCreationLinks(
    entry.linkedOrganizations
  );
  const factionLinks = normalizeLinkedCreationLinks(entry.linkedFactions);

  return {
    linkedOrganizations: dedupeLinkedCreationLinks([
      ...organizationLinks.filter(
        (link) => link.creationType !== "FACTION_REGISTRY"
      ),
      ...factionLinks.filter(
        (link) => link.creationType === "ORGANIZATION_REGISTRY"
      ),
    ]),
    linkedFactions: dedupeLinkedCreationLinks([
      ...factionLinks.filter(
        (link) => link.creationType !== "ORGANIZATION_REGISTRY"
      ),
      ...organizationLinks.filter(
        (link) => link.creationType === "FACTION_REGISTRY"
      ),
    ]),
  };
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

function removeDirectStructuredRegistrySelfReferences(
  links,
  {
    currentRegistryCreationId = "",
    currentRegistryEntryId = "",
  } = {}
) {
  return normalizeLinkedCreationLinks(links).filter(
    (link) =>
      !isDirectStructuredRegistrySelfReference(link, {
        currentRegistryCreationId,
        currentRegistryEntryId,
      })
  );
}

export function normalizeStructuredRegistryEntry(
  entry = {},
  registryType,
  { currentRegistryCreationId = "" } = {}
) {
  const base = createEmptyStructuredRegistryEntry(registryType);
  const merged = {
    ...base,
    ...entry,
  };

  const entryId = entry.id || createRegistryId("entry");

  const organizationFactionLinks =
    normalizeOrganizationFactionLinkBuckets(merged);
  const selfReferenceContext = {
    currentRegistryCreationId,
    currentRegistryEntryId: entryId,
  };

  return {
    ...merged,
    id: entryId,
    aliases: Array.isArray(merged.aliases) ? merged.aliases : [],

    linkedCharacters: removeDirectStructuredRegistrySelfReferences(
      merged.linkedCharacters,
      selfReferenceContext
    ),
    linkedLocations: removeDirectStructuredRegistrySelfReferences(
      merged.linkedLocations,
      selfReferenceContext
    ),
    linkedOrganizations: removeDirectStructuredRegistrySelfReferences(
      organizationFactionLinks.linkedOrganizations,
      selfReferenceContext
    ),
    linkedFactions: removeDirectStructuredRegistrySelfReferences(
      organizationFactionLinks.linkedFactions,
      selfReferenceContext
    ),
    linkedItems: removeDirectStructuredRegistrySelfReferences(
      merged.linkedItems,
      selfReferenceContext
    ),
    linkedEvents: removeDirectStructuredRegistrySelfReferences(
      merged.linkedEvents,
      selfReferenceContext
    ),
    linkedQuests: removeDirectStructuredRegistrySelfReferences(
      merged.linkedQuests,
      selfReferenceContext
    ),
  };
}

export function normalizeStructuredRegistryData(
  data = {},
  registryType,
  { currentRegistryCreationId = "" } = {}
) {
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
          normalizeStructuredRegistryEntry(entry, safeRegistryKind, {
            currentRegistryCreationId,
          })
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
  currentRegistryCreationId = "",
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
    data: normalizeStructuredRegistryData(data, registryType, {
      currentRegistryCreationId,
    }),
  };
}
