export const SCENARIO_REGISTRY_BINDINGS = Object.freeze({
  faction: Object.freeze({
    idField: "factionRegistryIds",
    linkField: "factionRegistries",
    expectedType: "FACTION_REGISTRY",
  }),
  organization: Object.freeze({
    idField: "organizationRegistryIds",
    linkField: "organizationRegistries",
    expectedType: "ORGANIZATION_REGISTRY",
  }),
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getRegistryLinkCreationId(link) {
  return normalizeString(
    link?.creationId ||
      link?.creation_id ||
      link?.targetCreationId ||
      link?.target_creation_id ||
      link?.id
  );
}

export function normalizeScenarioRegistryReference(reference) {
  if (!reference || typeof reference !== "object") return null;

  const id = normalizeString(
    reference.id ||
      reference.creationId ||
      reference.creation_id
  );

  if (!id) return null;

  return {
    id,
    type: normalizeString(reference.type),
    title: normalizeString(reference.title) || "Untitled Registry",
    subtitle: normalizeString(
      reference.subtitle || reference.description
    ),
    contentRating:
      normalizeString(
        reference.contentRating || reference.content_rating
      ) || "SFW",
    imageUrl:
      normalizeString(
        reference.imageUrl ||
          reference.image_url ||
          reference.url
      ) || null,
  };
}

export function normalizeScenarioRegistryReferenceArray(value) {
  if (!Array.isArray(value)) return [];

  return [
    ...new Map(
      value
        .map(normalizeScenarioRegistryReference)
        .filter(Boolean)
        .map((reference) => [reference.id, reference])
    ).values(),
  ];
}

export function buildScenarioRegistryBindingLink(reference, binding) {
  const normalized = normalizeScenarioRegistryReference(reference);

  if (!normalized?.id) return null;

  return {
    id: `scenario_attachment_${normalized.id}`,
    creationId: normalized.id,
    title: normalized.title,
    type: binding.expectedType,
    description: normalized.subtitle,
    imageUrl: normalized.imageUrl || "",
    notes: "",
    source: "SCENARIO_ATTACHMENT",
  };
}

export function getScenarioRegistrySelection(data, binding) {
  const source = normalizeObject(data);
  const boundRegistries = normalizeObject(source.boundRegistries);
  const boundRegistryLinks = normalizeObject(source.boundRegistryLinks);
  const links = Array.isArray(boundRegistryLinks[binding.linkField])
    ? boundRegistryLinks[binding.linkField].filter(Boolean)
    : [];
  const linksByCreationId = new Map(
    links
      .map((link) => [getRegistryLinkCreationId(link), link])
      .filter(([creationId]) => creationId)
  );
  const ids = [
    ...new Set([
      ...(Array.isArray(boundRegistries[binding.idField])
        ? boundRegistries[binding.idField]
        : []),
      ...links.map(getRegistryLinkCreationId),
    ].map(normalizeString).filter(Boolean)),
  ];

  return ids.map((creationId) => {
    const link = linksByCreationId.get(creationId) || {};

    return {
      id: creationId,
      type: normalizeString(link.type) || binding.expectedType,
      title: normalizeString(link.title) || "Untitled Registry",
      subtitle: normalizeString(
        link.subtitle || link.description
      ),
      contentRating:
        normalizeString(
          link.contentRating || link.content_rating
        ) || "SFW",
      imageUrl:
        normalizeString(
          link.imageUrl || link.image_url
        ) || null,
    };
  });
}

export function buildScenarioRegistryBindingState(data, binding, value) {
  const source = normalizeObject(data);
  const references = normalizeScenarioRegistryReferenceArray(value);
  const links = references
    .map((reference) =>
      buildScenarioRegistryBindingLink(reference, binding)
    )
    .filter(Boolean);

  return {
    boundRegistries: {
      ...normalizeObject(source.boundRegistries),
      [binding.idField]: links.map((link) => link.creationId),
    },
    boundRegistryLinks: {
      ...normalizeObject(source.boundRegistryLinks),
      [binding.linkField]: links,
    },
  };
}

export function normalizeScenarioRegistryBindings(data) {
  return Object.values(SCENARIO_REGISTRY_BINDINGS).reduce(
    (current, binding) => {
      const selection = getScenarioRegistrySelection(current, binding);
      const next = buildScenarioRegistryBindingState(
        current,
        binding,
        selection
      );

      return {
        ...current,
        ...next,
      };
    },
    {
      ...normalizeObject(data),
      boundRegistries: {
        ...normalizeObject(data?.boundRegistries),
      },
      boundRegistryLinks: {
        ...normalizeObject(data?.boundRegistryLinks),
      },
    }
  );
}
