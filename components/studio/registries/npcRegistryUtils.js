import {
  buildFeaturedMedia,
  getDefaultCreationImageForType,
  getFirstCreationImageUrl,
} from "@/lib/shared/creations/creationMedia";

export function createRegistryId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || Date.now()}`;
}

export function getNpcRegistryEntryActorId(entryId) {
  const normalizedEntryId = String(entryId || "").trim();
  return normalizedEntryId
    ? `npc-registry-entry:${normalizedEntryId}`
    : "";
}

export function getNpcRegistryEntryActorMechanicsProfileAttachment(entry = {}) {
  const source =
    entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
  const link =
    source.actorMechanicsProfileLink ||
    source.actor_mechanics_profile_link ||
    null;
  const creationId = String(
    source.actorMechanicsProfileId ||
      source.actor_mechanics_profile_id ||
      link?.creationId ||
      link?.creation_id ||
      ""
  ).trim();

  if (!creationId) return null;

  return {
    creationId,
    title: String(link?.title || creationId).trim(),
    presetId: String(link?.presetId || link?.preset_id || "").trim(),
    ownerType: String(link?.ownerType || link?.owner_type || "").trim(),
    enabledDomains: Array.isArray(
      link?.enabledDomains || link?.enabled_domains
    )
      ? [...(link.enabledDomains || link.enabled_domains)]
      : [],
  };
}

export function clearNpcRegistryEntryActorMechanicsProfileAttachment(entry = {}) {
  const next = {
    ...(entry && typeof entry === "object" && !Array.isArray(entry)
      ? entry
      : {}),
  };

  delete next.actorMechanicsProfileAttachmentContractVersion;
  delete next.actorMechanicsProfileId;
  delete next.actorMechanicsProfileLink;
  delete next.actor_mechanics_profile_attachment_contract_version;
  delete next.actor_mechanics_profile_id;
  delete next.actor_mechanics_profile_link;

  return next;
}

export function createStarterNpcRegistry() {
  return {
    title: "",
    scope: "Private Room / Story Spine",
    description:
      "A reusable NPC relationship, alias, and knowledge registry.",
    entries: [],
    relationships: [],
    knowledgeRules: [],
    aliases: [],
  };
}

export function createEmptyNpcEntry() {
  return {
    id: createRegistryId("person"),
    kind: "AD_HOC",
    creationId: "",
    creationType: "",
    name: "",
    notes: "",
  };
}

export function createEmptyRelationship(entries = []) {
  return {
    id: createRegistryId("relationship"),
    fromEntryId: entries[0]?.id || "",
    toEntryId: entries[1]?.id || entries[0]?.id || "",
    type: "",
    direction: "MUTUAL",
    strength: "MEDIUM",
    description: "",
  };
}

export function createEmptyKnowledgeRule(entries = []) {
  return {
    id: createRegistryId("knowledge"),
    subject: "",
    defaultKnowledge: "UNKNOWN",
    knownByEntryIds: [],
    suspectedByEntryIds: [],
    falseBeliefNotes: "",
    notes: "",
  };
}

export function createEmptyAliasRule(entries = []) {
  return {
    id: createRegistryId("alias"),
    trueEntryId: entries[0]?.id || "",
    publicIdentity: "",
    rule: "",
  };
}

export function normalizeNpcRegistryCharacterOptions(creations = []) {
  return creations
    .filter((creation) => creation?.id)
    .map((creation) => {
      const featuredMedia = buildFeaturedMedia({
        row: creation,
        data: creation.data,
        title: creation.title,
        max: 1,
      });

      const fallbackImage = getDefaultCreationImageForType(creation.type);

      return {
        id: creation.id,
        type: creation.type || "CHARACTER",
        title:
          creation.title ||
          creation.data?.name ||
          creation.name ||
          "Untitled Character",
        subtitle:
          creation.description ||
          creation.data?.short_concept ||
          creation.data?.title ||
          "",
        description:
          creation.description ||
          creation.data?.short_concept ||
          creation.data?.title ||
          "",
        imageUrl: getFirstCreationImageUrl(featuredMedia, fallbackImage),
        contentRating: creation.contentRating || creation.content_rating || "SFW",
        visibility: creation.visibility || "PRIVATE",
        status: creation.status || "DRAFT",
      };
    });
}

export function buildNpcRegistryExportPreview(registry) {
  return {
    type: "NPC_REGISTRY",
    title: registry.title,
    scope: registry.scope,
    description: registry.description,
    entries: registry.entries,
    relationships: registry.relationships,
    knowledgeRules: registry.knowledgeRules,
    aliases: registry.aliases,
  };
}

export function buildNpcRegistryCreationPayload(registry) {
  const title = registry.title?.trim() || "Untitled NPC Registry";
  const description =
    registry.description?.trim() ||
    "A reusable NPC relationship, alias, and knowledge registry.";

  return {
    type: "NPC_REGISTRY",
    title,
    description,
    visibility: "PRIVATE",
    status: "DRAFT",
    content_rating: "SFW",
    canon_status: "NONE",
    data: {
      registry_kind: "NPC_REGISTRY",
      scope: registry.scope?.trim() || "",
      entries: registry.entries || [],
      relationships: registry.relationships || [],
      knowledge_rules: registry.knowledgeRules || [],
      aliases: registry.aliases || [],
      builder: "NPC_REGISTRY_BUILDER",
      builder_version: "1.0",
    },
  };
}

export function extractNpcRegistryFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export function getEntryName(entries, entryId) {
  return entries.find((entry) => entry.id === entryId)?.name || "Unknown NPC";
}

export function upsertById(items, nextItem) {
  const exists = items.some((item) => item.id === nextItem.id);

  if (!exists) {
    return [...items, nextItem];
  }

  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

export function removeEntryReferences(registry, entryId) {
  return {
    ...registry,
    entries: registry.entries.filter((entry) => entry.id !== entryId),
    relationships: registry.relationships.filter(
      (relationship) =>
        relationship.fromEntryId !== entryId &&
        relationship.toEntryId !== entryId
    ),
    knowledgeRules: registry.knowledgeRules.map((rule) => ({
      ...rule,
      knownByEntryIds: (rule.knownByEntryIds || []).filter(
        (id) => id !== entryId
      ),
      suspectedByEntryIds: (rule.suspectedByEntryIds || []).filter(
        (id) => id !== entryId
      ),
    })),
    aliases: registry.aliases.filter((alias) => alias.trueEntryId !== entryId),
  };
}