export const STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION =
  "structured_registry_reference.presentation.v1";

export const STRUCTURED_REGISTRY_REFERENCE_KEY_VERSION =
  "structured_registry_reference_key_v0";

export const STRUCTURED_REGISTRY_TYPES = Object.freeze([
  "ORGANIZATION_REGISTRY",
  "FACTION_REGISTRY",
  "EVENT_REGISTRY",
  "QUEST_REGISTRY",
]);

export const STRUCTURED_REGISTRY_REFERENCE_STATUSES = Object.freeze([
  "CREATION_RESOLVED",
  "REGISTRY_ENTRY_RESOLVED",
  "LEGACY_REGISTRY_REFERENCE",
  "REGISTRY_ENTRY_NOT_FOUND",
  "UNAVAILABLE",
]);

export const STRUCTURED_REGISTRY_REFERENCE_CALLBACK_KEYS = Object.freeze([
  "onOpenPicker",
  "onSelectReference",
  "onRemoveReference",
]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeType(value) {
  return (text(value) || "CREATION").toUpperCase();
}

export function isStructuredRegistryType(value) {
  return STRUCTURED_REGISTRY_TYPES.includes(normalizeType(value));
}

export function createStructuredRegistryReferenceKey({
  creationId,
  registryCreationId,
  registryEntryId,
} = {}) {
  const safeCreationId = text(registryCreationId || creationId);
  const safeRegistryEntryId = text(registryEntryId);

  return [safeCreationId, safeRegistryEntryId].join("::");
}

export function isDirectStructuredRegistrySelfReference(
  link,
  {
    currentRegistryCreationId = "",
    currentRegistryEntryId = "",
  } = {}
) {
  const sourceRegistryCreationId = text(currentRegistryCreationId);
  const sourceRegistryEntryId = text(currentRegistryEntryId);

  if (!sourceRegistryCreationId || !sourceRegistryEntryId) {
    return false;
  }

  const target = object(link);
  const targetRegistryCreationId = text(
    target.registryCreationId ||
      target.registry_creation_id ||
      target.creationId ||
      target.creation_id
  );
  const targetRegistryEntryId = text(
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

export function normalizeStructuredRegistryReference(value = {}) {
  if (typeof value === "string") {
    const legacyLabel = text(value);

    if (!legacyLabel) return null;

    return {
      creationId: null,
      creationType: "LEGACY_TEXT",
      registryCreationId: null,
      registryEntryId: null,
      notes: legacyLabel,
    };
  }

  const source = object(value);
  const creationId = text(
    source.creationId ||
      source.creation_id ||
      source.registryCreationId ||
      source.registry_creation_id
  );

  if (!creationId) return null;

  const creationType = normalizeType(
    source.creationType ||
      source.creation_type ||
      source.type
  );
  const registryCreationId = text(
    source.registryCreationId ||
      source.registry_creation_id ||
      (isStructuredRegistryType(creationType) ? creationId : "")
  );
  const registryEntryId = text(
    source.registryEntryId ||
      source.registry_entry_id ||
      source.targetEntryId ||
      source.target_entry_id
  );

  return {
    creationId,
    creationType,
    ...(isStructuredRegistryType(creationType) && registryEntryId
      ? {
          registryCreationId: registryCreationId || creationId,
          registryEntryId,
        }
      : {}),
    notes: text(source.notes),
  };
}

export function createStructuredRegistryReference(
  creation = {},
  registryEntry = null
) {
  const sourceCreation = object(creation);
  const sourceEntry = object(registryEntry);
  const creationId = text(
    sourceCreation.id || sourceCreation.creationId
  );
  const creationType = normalizeType(
    sourceCreation.type || sourceCreation.creationType
  );
  const registryEntryId = text(
    sourceEntry.id || sourceEntry.registryEntryId
  );

  if (!creationId) return null;

  return {
    creationId,
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

function findRegistryEntry(creation, registryEntryId) {
  if (!registryEntryId) return null;

  return (
    array(creation?.data?.entries).find(
      (entry) =>
        text(
          entry?.id ||
            entry?.key ||
            entry?.slug
        ) === registryEntryId
    ) || null
  );
}

function getCreationTitle(creation = {}) {
  return (
    text(creation.title) ||
    text(creation?.data?.name) ||
    "Untitled Creation"
  );
}

function getCreationDescription(creation = {}) {
  return (
    text(creation.description) ||
    text(creation?.data?.summary)
  );
}

function getCreationImageUrl(creation = {}) {
  const data = object(creation.data);

  return (
    text(creation.featuredImageUrl) ||
    text(creation.featured_image_url) ||
    text(creation.thumbnailUrl) ||
    text(creation.thumbnail_url) ||
    text(creation.imageUrl) ||
    text(creation.image_url) ||
    text(data.thumbnailUrl) ||
    text(data.thumbnail_url) ||
    text(data.imageUrl) ||
    text(data.image_url) ||
    ""
  );
}

export function resolveStructuredRegistryReferencePresentation(
  link,
  creations = []
) {
  const reference = normalizeStructuredRegistryReference(link);

  if (!reference) {
    return {
      referenceKey: "::",
      title: "Unavailable linked creation",
      type: "CREATION",
      description: "",
      imageUrl: "",
      registryTitle: "",
      referenceStatus: "UNAVAILABLE",
      registryCreationId: null,
      registryEntryId: null,
    };
  }

  if (reference.creationType === "LEGACY_TEXT") {
    return {
      ...reference,
      referenceKey: createStructuredRegistryReferenceKey(reference),
      title: reference.notes || "Legacy linked reference",
      type: "LEGACY_TEXT",
      description:
        "Legacy text-only reference. Relink this entry to a current Crestfall asset when possible.",
      imageUrl: "",
      registryTitle: "",
      referenceStatus: "UNAVAILABLE",
    };
  }

  const creationById = new Map(
    array(creations)
      .filter((creation) => text(creation?.id))
      .map((creation) => [text(creation.id), creation])
  );

  const creation = creationById.get(reference.creationId);

  if (!creation) {
    return {
      ...reference,
      referenceKey: createStructuredRegistryReferenceKey(reference),
      title: "Unavailable linked creation",
      type: reference.creationType || "CREATION",
      description: "",
      imageUrl: "",
      registryTitle: "",
      referenceStatus: "UNAVAILABLE",
    };
  }

  const creationType = normalizeType(
    creation.type || reference.creationType
  );

  if (isStructuredRegistryType(creationType)) {
    const registryEntryId = text(reference.registryEntryId);
    const registryTitle = getCreationTitle(creation);
    const imageUrl = getCreationImageUrl(creation);

    if (!registryEntryId) {
      return {
        ...reference,
        referenceKey: createStructuredRegistryReferenceKey(reference),
        title: registryTitle || "Legacy registry link",
        type: creationType,
        description:
          "Legacy whole-registry link. Select a specific registry entry to make this graph edge precise.",
        imageUrl,
        registryTitle,
        referenceStatus: "LEGACY_REGISTRY_REFERENCE",
      };
    }

    const registryEntry = findRegistryEntry(
      creation,
      registryEntryId
    );

    if (!registryEntry) {
      return {
        ...reference,
        referenceKey: createStructuredRegistryReferenceKey(reference),
        title: "Missing registry entry",
        type: creationType,
        description:
          `The referenced entry ${registryEntryId} no longer exists in ${registryTitle || creationType}.`,
        imageUrl,
        registryTitle,
        referenceStatus: "REGISTRY_ENTRY_NOT_FOUND",
      };
    }

    return {
      ...reference,
      referenceKey: createStructuredRegistryReferenceKey(reference),
      title:
        text(
          registryEntry.name ||
            registryEntry.title ||
            registryEntry.label
        ) || "Untitled Registry Entry",
      type: creationType,
      description:
        text(
          registryEntry.summary ||
            registryEntry.publicDescription ||
            registryEntry.public_description
        ),
      imageUrl,
      registryTitle,
      referenceStatus: "REGISTRY_ENTRY_RESOLVED",
    };
  }

  return {
    ...reference,
    referenceKey: createStructuredRegistryReferenceKey(reference),
    title: getCreationTitle(creation),
    type: creationType,
    description: getCreationDescription(creation),
    imageUrl: getCreationImageUrl(creation),
    registryTitle: "",
    referenceStatus: "CREATION_RESOLVED",
  };
}

export function projectStructuredRegistryReferenceSelection({
  references = [],
  creations = [],
  currentRegistryCreationId = "",
  currentRegistryEntryId = "",
} = {}) {
  const resolved = array(references)
    .map((reference) =>
      resolveStructuredRegistryReferencePresentation(
        reference,
        creations
      )
    )
    .filter(Boolean);

  const selectedReferenceKeys = [
    ...new Set(
      resolved
        .map((reference) => reference.referenceKey)
        .filter((key) => key && key !== "::")
    ),
  ];

  const excludedReferenceKeys = resolved
    .filter((reference) =>
      isDirectStructuredRegistrySelfReference(reference, {
        currentRegistryCreationId,
        currentRegistryEntryId,
      })
    )
    .map((reference) => reference.referenceKey);

  return {
    contractVersion:
      STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,
    referenceKeyVersion:
      STRUCTURED_REGISTRY_REFERENCE_KEY_VERSION,
    selectedReferenceKeys,
    excludedReferenceKeys,
    references: resolved,
    summary: {
      referenceCount: resolved.length,
      resolvedCreationCount: resolved.filter(
        (reference) =>
          reference.referenceStatus === "CREATION_RESOLVED"
      ).length,
      resolvedRegistryEntryCount: resolved.filter(
        (reference) =>
          reference.referenceStatus === "REGISTRY_ENTRY_RESOLVED"
      ).length,
      legacyRegistryReferenceCount: resolved.filter(
        (reference) =>
          reference.referenceStatus === "LEGACY_REGISTRY_REFERENCE"
      ).length,
      missingRegistryEntryCount: resolved.filter(
        (reference) =>
          reference.referenceStatus === "REGISTRY_ENTRY_NOT_FOUND"
      ).length,
      unavailableCount: resolved.filter(
        (reference) =>
          reference.referenceStatus === "UNAVAILABLE"
      ).length,
    },
  };
}
