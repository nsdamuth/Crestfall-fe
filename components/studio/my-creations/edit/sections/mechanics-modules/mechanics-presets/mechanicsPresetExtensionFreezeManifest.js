export const MECHANICS_PRESET_EXTENSION_FREEZE_MANIFEST_VERSION =
  "mechanics_preset_extension_freeze_manifest_v1";

export const MECHANICS_PRESET_EXTENSION_FREEZE_PHASE =
  "MC7G_FINAL_CLOSEOUT";

export const MECHANICS_PRESET_EXTENSION_FREEZE_STATUS = "FROZEN";

export const MECHANICS_PRESET_EXTENSION_CORE_BASELINE = Object.freeze({
  manifestVersion: "mechanics_preset_freeze_manifest_v1",
  presetCount: 20,
});

export const MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS = Object.freeze({
  core: 20,
  extension: 2,
  liveLibrary: 22,
});

export const MECHANICS_PRESET_EXTENSION_FROZEN_IDS = Object.freeze([
  "module.character_advancement_curve.v1",
  "module.character_advancement_readout.v1",
]);

export const MECHANICS_PRESET_EXTENSION_LEGACY_IDS = Object.freeze([
  "module.character_advancement_5e.v1",
]);

export const MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS = Object.freeze({
  characterAdvancementPreset: "mechanics_character_advancement_preset_v4",
  progressionProfile: "mechanics_progression_profile_v1",
  progressionProfileService: "mechanics_progression_profile_service_v1",
  effectValueBinding: "mechanics_effect_value_binding_v1",
  commandStateReadout: "mechanics_command_state_readout_v1",
  mechanicsApplicator: "mechanics_applicator_v1_2",
  coreCatalog: "mechanics_preset_catalog_v1",
  coreFreezeManifest: "mechanics_preset_freeze_manifest_v1",
  moduleDefinition: "core.trackers.v1",
  instanceData: "trackers_instance_data.v0_2",
});

export const MECHANICS_PRESET_EXTENSION_FROZEN_UI_BASELINES = Object.freeze({
  presetLibrary: "MC7X.2.3",
  layoutDiagnostic: "mc7_preset_library_layout_diagnostics_v4",
});

export const MECHANICS_PRESET_EXTENSION_REQUIRED_DIAGNOSTICS = Object.freeze([
  "mc7ProductionHardeningAudit.mjs",
  "mc7BuilderLiveValidationDiagnostics.mjs",
  "mc7PresetApplicationDiagnostics.mjs",
  "mc7xCharacterAdvancementDiagnostics.mjs",
  "mechanics-preset-application/mc7PresetLibraryLayoutDiagnostics.mjs",
]);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getMechanicsPresetExtensionFreezeManifest() {
  return deepClone({
    version: MECHANICS_PRESET_EXTENSION_FREEZE_MANIFEST_VERSION,
    phase: MECHANICS_PRESET_EXTENSION_FREEZE_PHASE,
    status: MECHANICS_PRESET_EXTENSION_FREEZE_STATUS,
    coreBaseline: MECHANICS_PRESET_EXTENSION_CORE_BASELINE,
    counts: MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS,
    presetIds: MECHANICS_PRESET_EXTENSION_FROZEN_IDS,
    legacyIds: MECHANICS_PRESET_EXTENSION_LEGACY_IDS,
    contracts: MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS,
    uiBaselines: MECHANICS_PRESET_EXTENSION_FROZEN_UI_BASELINES,
    diagnostics: MECHANICS_PRESET_EXTENSION_REQUIRED_DIAGNOSTICS,
  });
}
