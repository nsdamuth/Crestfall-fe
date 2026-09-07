export const MECHANICS_ACTION_CREATION_TYPE = "MECHANICS_ACTION";
export const MECHANICS_ACTION_ASSET_CONTRACT_VERSION =
  "mechanics_action_asset_v0";
export const MECHANICS_ACTION_DEFINITION_VERSION =
  "mechanics_action_definition_v0";

export function createMechanicsActionStarterDefinition() {
  return {
    actionVersion: MECHANICS_ACTION_DEFINITION_VERSION,
    id: "action.my-world.example",
    enabled: true,
    title: "Example Action",
    actionValueBindings: [],
    actionCalculationSet: {
      version: "mechanics_action_calculation_set_v0",
      calculations: [],
    },
    resolution: {
      version: "mechanics_command_resolution_v7",
      mode: "NO_ROLL_DETERMINISTIC",
    },
    targetModel: {
      mode: "ACTOR_SINGLE",
      rangeClass: "UNSPECIFIED",
      requiresLineOfSight: false,
    },
    mechanicsEffectReferences: [],
    outcomeEffectRoutes: [],
  };
}

export function normalizeMechanicsActionObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function buildMechanicsActionData(action) {
  const definition = normalizeMechanicsActionObject(action);
  return {
    builder: "MECHANICS_ACTION_BUILDER",
    contractVersion: MECHANICS_ACTION_ASSET_CONTRACT_VERSION,
    actionKey: typeof definition.id === "string" ? definition.id.trim() : "",
    mechanics_action: definition,
  };
}
