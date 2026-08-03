export const MECHANICS_PRESET_FREEZE_MANIFEST_VERSION =
  "mechanics_preset_freeze_manifest_v1";

export const MECHANICS_PRESET_FREEZE_PHASE = "MC7G";
export const MECHANICS_PRESET_FREEZE_STATUS = "FROZEN";

export const MECHANICS_PRESET_FROZEN_CONTRACTS = Object.freeze({
  catalog: "mechanics_preset_catalog_v1",
  definition: "mechanics_preset_definition_v1",
  payload: "mechanics_preset_payload_v1",
  application: "mechanics_preset_application_v1",
  liveValidation: "mechanics_preset_live_validation_v1",
  referenceRuntime: "mechanics_reference_runtime_implementation_v1",
  resolution: "mechanics_command_resolution_v6",
  composition: "mechanics_command_composition_v1",
  moduleDefinition: "core.trackers.v1",
  instanceData: "trackers_instance_data.v0_2",
});

export const MECHANICS_PRESET_FROZEN_COUNTS = Object.freeze({
  total: 20,
  resolution: 6,
  composition: 4,
  command: 5,
  module: 5,
  referenceRuntime: 5,
});

export const MECHANICS_PRESET_FROZEN_APPLY_MODES = Object.freeze([
  "REPLACE_BLOCK",
  "REPLACE_COMMAND",
  "MERGE_COMMAND",
  "REPLACE_MODULE",
  "MERGE_MODULE",
]);

export const MECHANICS_PRESET_FROZEN_IDS = Object.freeze([
  "resolution.automatic_success.v1",
  "resolution.standard_d20.v1",
  "resolution.advantage_d20.v1",
  "resolution.disadvantage_d20.v1",
  "resolution.opposed_d20.v1",
  "resolution.degree_d20.v1",
  "composition.sequential_attempt_success.v1",
  "composition.conditional_milestone.v1",
  "composition.item_and_condition.v1",
  "composition.item_condition_location.v1",
  "command.resource_check.v1",
  "command.social_probe.v1",
  "command.give_item.v1",
  "command.apply_condition.v1",
  "command.travel_connected.v1",
  "module.resource_loop.v1",
  "module.social_probe.v1",
  "module.item_handoff.v1",
  "module.travel_navigation.v1",
  "module.quest_progress.v1",
]);

export const MECHANICS_PRESET_FROZEN_RUNTIME_IDS = Object.freeze([
  "runtime.resource_loop.v1",
  "runtime.social_probe.v1",
  "runtime.item_handoff.v1",
  "runtime.travel_navigation.v1",
  "runtime.quest_progress.v1",
]);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getMechanicsPresetFreezeManifest() {
  return deepClone({
    version: MECHANICS_PRESET_FREEZE_MANIFEST_VERSION,
    phase: MECHANICS_PRESET_FREEZE_PHASE,
    status: MECHANICS_PRESET_FREEZE_STATUS,
    contracts: MECHANICS_PRESET_FROZEN_CONTRACTS,
    counts: MECHANICS_PRESET_FROZEN_COUNTS,
    applyModes: MECHANICS_PRESET_FROZEN_APPLY_MODES,
    presetIds: MECHANICS_PRESET_FROZEN_IDS,
    runtimeIds: MECHANICS_PRESET_FROZEN_RUNTIME_IDS,
  });
}
