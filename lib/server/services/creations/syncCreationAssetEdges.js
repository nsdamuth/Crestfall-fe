import { extractCreationAssetEdges } from "@/lib/shared/creations/extractCreationAssetEdges";

const BUILDER_EDGE_SYNC_TYPES = new Set([
  "ROOM_TEMPLATE",
  "CHARACTER",
  "PLAYER_CHARACTER",
  "LOCATION",
  "SCENARIO",
  "NARRATOR",
  "STORYLINE",
]);

const MECHANICS_MODULE_CREATION_TYPE = "MECHANICS_MODULE";
const MECHANICS_MODULE_ROLE = "MECHANICS_MODULE";
const RUNTIME_MODULE_RELATION_TYPE = "RUNTIME_MODULE";

function normalizeType(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getMechanicsModuleCreationId(binding = {}) {
  return normalizeString(
    binding.mechanicsModuleCreationId ||
      binding.mechanics_module_creation_id ||
      binding.moduleInstanceId ||
      binding.module_instance_id ||
      binding.targetCreationId ||
      binding.target_creation_id
  );
}

function isMechanicsModuleBinding(binding = {}) {
  const role = normalizeType(binding.role);
  const sourceType = normalizeType(binding.moduleSourceType);

  return (
    role === MECHANICS_MODULE_ROLE ||
    sourceType === MECHANICS_MODULE_CREATION_TYPE ||
    Boolean(getMechanicsModuleCreationId(binding))
  );
}

function extractRuntimeModuleAssetEdges({ data }) {
  const normalizedData = normalizeObject(data);

  return normalizeArray(normalizedData.engine_module_bindings)
    .map((binding, index) => {
      const normalizedBinding = normalizeObject(binding);

      if (!isMechanicsModuleBinding(normalizedBinding)) {
        return null;
      }

      const targetCreationId = getMechanicsModuleCreationId(normalizedBinding);

      if (!targetCreationId) {
        return null;
      }

      return {
        targetCreationId,
        relationType: RUNTIME_MODULE_RELATION_TYPE,
        role: MECHANICS_MODULE_ROLE,
        sortOrder: index,
        metadata: {
          ...normalizedBinding,
          enabled: normalizedBinding.enabled !== false,
          origin: "engine_module_binding",
        },
      };
    })
    .filter(Boolean);
}

function dedupeEdges(edges = []) {
  const seen = new Set();

  return edges.filter((edge) => {
    const key = [
      edge.targetCreationId,
      edge.relationType,
      edge.role,
    ]
      .filter(Boolean)
      .join(":");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function syncCreationAssetEdges({
  creationRepository,
  sourceCreationId,
  sourceType,
  data,
}) {
  if (!creationRepository || !sourceCreationId) {
    return {
      data: null,
      error: new Error("Missing creation repository or source creation ID."),
    };
  }

  const normalizedSourceType = normalizeType(sourceType);

  if (!BUILDER_EDGE_SYNC_TYPES.has(normalizedSourceType)) {
    return {
      data: [],
      error: null,
    };
  }

  const builderEdges = extractCreationAssetEdges({
    sourceType: normalizedSourceType,
    data,
  });

  const runtimeModuleEdges = extractRuntimeModuleAssetEdges({
    data,
  });

  const edges = dedupeEdges([
    ...builderEdges,
    ...runtimeModuleEdges,
  ]);

  const rpcEdges = edges.map((edge) => ({
    target_creation_id: edge.targetCreationId,
    relation_type: edge.relationType,
    role: edge.role,
    sort_order: edge.sortOrder || 0,
    metadata: {
      ...(edge.metadata || {}),
      origin: edge.metadata?.origin || "builder",
    },
  }));

  const { data: replacedEdges, error } =
    await creationRepository.replaceBuilderAssetEdges({
      sourceCreationId,
      edges: rpcEdges,
    });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data: replacedEdges || [],
    error: null,
  };
}