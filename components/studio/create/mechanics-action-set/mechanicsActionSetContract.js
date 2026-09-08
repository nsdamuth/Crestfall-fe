export const MECHANICS_ACTION_SET_CREATION_TYPE = "MECHANICS_ACTION_SET";
export const MECHANICS_ACTION_SET_ASSET_CONTRACT_VERSION =
  "mechanics_action_set_asset_v0";
export const MECHANICS_ACTION_SET_DEFINITION_VERSION =
  "mechanics_action_set_v0";
export const MECHANICS_ACTION_REFERENCE_VERSION =
  "mechanics_action_reference_v0";
export const MECHANICS_ACTION_SET_MAX_ACTIONS = 256;

export function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}
export function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildActionReference(creation = {}) {
  const data = normalizeObject(creation.data);
  const action = normalizeObject(data.mechanics_action || data.mechanicsAction || data.action);
  const actionKey = normalizeString(data.actionKey || data.action_key || action.id);
  return {
    referenceVersion: MECHANICS_ACTION_REFERENCE_VERSION,
    actionCreationId: normalizeString(creation.id),
    actionKey,
    title: normalizeString(creation.title) || normalizeString(action.title) || actionKey,
    enabled: true,
    metadata: {},
  };
}

export function createMechanicsActionSetStarterDefinition() {
  return {
    setVersion: MECHANICS_ACTION_SET_DEFINITION_VERSION,
    id: "action-set.my-world.core",
    enabled: true,
    title: "Core Actions",
    description: "",
    actionReferences: [],
    metadata: {},
  };
}

export function buildMechanicsActionSetData(definition) {
  const source = normalizeObject(definition);
  return {
    builder: "MECHANICS_ACTION_SET_BUILDER",
    contractVersion: MECHANICS_ACTION_SET_ASSET_CONTRACT_VERSION,
    actionSetKey: normalizeString(source.id),
    mechanics_action_set: {
      setVersion: MECHANICS_ACTION_SET_DEFINITION_VERSION,
      id: normalizeString(source.id),
      enabled: source.enabled !== false,
      title: normalizeString(source.title),
      description: normalizeString(source.description),
      actionReferences: normalizeArray(source.actionReferences).slice(0, MECHANICS_ACTION_SET_MAX_ACTIONS),
      metadata: normalizeObject(source.metadata),
    },
  };
}
