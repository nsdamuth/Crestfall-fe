const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeType(value) {
  return String(value || "").trim().toUpperCase();
}

function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function getReferenceId(reference) {
  if (typeof reference === "string") {
    return reference;
  }

  if (!reference || typeof reference !== "object") {
    return "";
  }

  return (
    reference.id ||
    reference.rowId ||
    reference.row_id ||
    reference.assetId ||
    reference.asset_id ||
    reference.creationId ||
    reference.creation_id ||
    ""
  );
}

function getReferenceArray(data, fieldNames) {
  for (const fieldName of fieldNames) {
    if (Array.isArray(data[fieldName])) {
      return data[fieldName];
    }
  }

  return [];
}

function getReferenceObject(data, fieldNames) {
  for (const fieldName of fieldNames) {
    const value = data[fieldName];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function pushEdge(edges, {
  target,
  relationType,
  role,
  sortOrder = 0,
  field,
  sourceType,
  metadata = {},
}) {
  const targetCreationId = getReferenceId(target);

  if (!isUuid(targetCreationId)) return;

  edges.push({
    targetCreationId,
    relationType,
    role,
    sortOrder,
    metadata: {
      origin: "builder",
      field,
      source_type: sourceType,
      ...metadata,
    },
  });
}

function extractRoomTemplateEdges(data, sourceType) {
  const edges = [];

  getReferenceArray(data, ["selected_characters"]).forEach((character, index) => {
    pushEdge(edges, {
      target: character,
      relationType: "INCLUDES_CHARACTER",
      role: normalizeType(character?.type) || "CHARACTER",
      sortOrder: index,
      field: "selected_characters",
      sourceType,
    });
  });

  pushEdge(edges, {
    target: getReferenceObject(data, ["selected_scenario", "scenario_id"]),
    relationType: "USES_SCENARIO",
    role: "SCENARIO",
    sortOrder: 100,
    field: "selected_scenario",
    sourceType,
  });

  pushEdge(edges, {
    target: getReferenceObject(data, ["selected_narrator", "narrator_id"]),
    relationType: "USES_NARRATOR",
    role: "NARRATOR",
    sortOrder: 110,
    field: "selected_narrator",
    sourceType,
  });

  pushEdge(edges, {
    target: getReferenceObject(data, ["selected_location", "location_id"]),
    relationType: "USES_LOCATION",
    role: "LOCATION",
    sortOrder: 120,
    field: "selected_location",
    sourceType,
  });

  return edges;
}

function extractScenarioEdges(data, sourceType) {
  const edges = [];
  const boundRegistries =
    data.boundRegistries &&
    typeof data.boundRegistries === "object" &&
    !Array.isArray(data.boundRegistries)
      ? data.boundRegistries
      : data.bound_registries &&
          typeof data.bound_registries === "object" &&
          !Array.isArray(data.bound_registries)
        ? data.bound_registries
        : {};

  getReferenceArray(boundRegistries, [
    "factionRegistryIds",
    "faction_registry_ids",
  ]).forEach((registryId, index) => {
    pushEdge(edges, {
      target: registryId,
      relationType: "BINDS_REGISTRY",
      role: "FACTION_REGISTRY",
      sortOrder: index,
      field: "boundRegistries.factionRegistryIds",
      sourceType,
    });
  });

  getReferenceArray(boundRegistries, [
    "organizationRegistryIds",
    "organization_registry_ids",
  ]).forEach((registryId, index) => {
    pushEdge(edges, {
      target: registryId,
      relationType: "BINDS_REGISTRY",
      role: "ORGANIZATION_REGISTRY",
      sortOrder: 100 + index,
      field: "boundRegistries.organizationRegistryIds",
      sourceType,
    });
  });

  return edges;
}

function extractStorylineEdges(data, sourceType) {
  const edges = [];
  const nodes = getReferenceArray(data, ["nodes", "ordered_nodes"]);

  nodes.forEach((node, index) => {
    const reference =
      node && typeof node === "object" && !Array.isArray(node)
        ? node.reference || node.asset || node.creation || node
        : node;
    const referenceType = normalizeType(
      node?.referenceType || reference?.referenceType || reference?.type
    );
    const role =
      referenceType === "ROOM_TEMPLATE" || referenceType === "STORY"
        ? "STORY"
        : referenceType === "SCENARIO"
          ? "SCENARIO"
          : "STORYLINE_NODE";

    pushEdge(edges, {
      target: reference,
      relationType: "STORYLINE_INCLUDES",
      role,
      sortOrder: index,
      field: "nodes",
      sourceType,
      metadata: {
        node_id: node?.id || null,
        node_order: index,
        reference_type: role,
        transition_policy: node?.transitionPolicy || null,
        trigger_mode: node?.triggerMode || null,
        trigger_count: Array.isArray(node?.triggers) ? node.triggers.length : 0,
      },
    });
  });

  return edges;
}

function extractCharacterEdges(data, sourceType) {
  const edges = [];

  getReferenceArray(data, [
    "selected_outfits",
    "outfit_assets",
    "outfits",
    "selected_clothing",
    "clothing_assets",
  ]).forEach((outfit, index) => {
    pushEdge(edges, {
      target: outfit,
      relationType: "USES_OUTFIT",
      role: normalizeType(outfit?.type) || "OUTFIT",
      sortOrder: index,
      field: "selected_outfits",
      sourceType,
    });
  });

  getReferenceArray(data, [
    "selected_image_presets",
    "image_preset_assets",
    "image_presets",
    "rendering_presets",
  ]).forEach((preset, index) => {
    pushEdge(edges, {
      target: preset,
      relationType: "USES_IMAGE_PRESET",
      role: normalizeType(preset?.type) || "IMAGE_PRESET",
      sortOrder: 100 + index,
      field: "selected_image_presets",
      sourceType,
    });
  });

  const templateReference = getReferenceObject(data, [
    "selected_template",
    "source_template",
    "applied_template",
    "character_template",
    "template_id",
    "character_template_id",
    "source_template_id",
    "applied_template_id",
  ]);

  pushEdge(edges, {
    target: templateReference,
    relationType: "DERIVED_FROM_TEMPLATE",
    role: "CHARACTER_TEMPLATE",
    sortOrder: 200,
    field: "applied_template",
    sourceType,
  });

  return edges;
}

export function extractCreationAssetEdges({ sourceType, data }) {
  const normalizedType = normalizeType(sourceType);
  const safeData =
    data && typeof data === "object" && !Array.isArray(data) ? data : {};

  if (normalizedType === "ROOM_TEMPLATE") {
    return extractRoomTemplateEdges(safeData, normalizedType);
  }

  if (normalizedType === "SCENARIO") {
    return extractScenarioEdges(safeData, normalizedType);
  }

  if (normalizedType === "STORYLINE") {
    return extractStorylineEdges(safeData, normalizedType);
  }

  if (normalizedType === "CHARACTER" || normalizedType === "PLAYER_CHARACTER") {
    return extractCharacterEdges(safeData, normalizedType);
  }

  return [];
}