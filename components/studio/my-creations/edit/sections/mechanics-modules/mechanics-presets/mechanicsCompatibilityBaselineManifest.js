export const MECHANICS_COMPATIBILITY_BASELINE_MANIFEST_VERSION =
  "mechanics_compatibility_baseline_manifest_v1";

export const MECHANICS_COMPATIBILITY_BASELINE_PHASE = "MC8A";
export const MECHANICS_COMPATIBILITY_BASELINE_STATUS = "BASELINED";

export const MECHANICS_COMPATIBILITY_FROZEN_COUNTS = Object.freeze({
  corePresets: 20,
  extensionPresets: 2,
  livePresetLibrary: 22,
  referenceRuntimeImplementations: 5,
});

export const MECHANICS_COMPATIBILITY_CONTRACTS_BY_PHASE = Object.freeze({
  MC1: Object.freeze([
    "mechanics_command_contract_v1",
    "mechanics_command_invocation_v1",
    "mechanics_effect_target_binding_v1",
  ]),
  MC2: Object.freeze([
    "mechanics_command_outcomes_v1",
  ]),
  MC3: Object.freeze([
    "mechanics_command_requirements_v1",
    "trackers_instance_data.v0_2",
  ]),
  MC4: Object.freeze([
    "mechanics_command_domain_action_v1",
    "mechanics_command_domain_adapter_service_v1",
  ]),
  MC5: Object.freeze([
    "mechanics_command_resolution_v6",
    "mechanics_command_resolution_service_v6",
    "mechanics_authoritative_modifier_resolution_v1",
  ]),
  MC6: Object.freeze([
    "mechanics_command_composition_v1",
    "mechanics_command_composition_plan_v1",
    "mechanics_command_composition_condition_v1",
    "mechanics_command_composition_continuation_v1",
    "mechanics_command_composition_service_v5",
    "mechanics_command_composition_continuation_service_v1",
    "mechanics_command_domain_composition_v1",
    "mechanics_command_persistent_audit_v1",
  ]),
  MC7: Object.freeze([
    "mechanics_preset_catalog_v1",
    "mechanics_preset_definition_v1",
    "mechanics_preset_payload_v1",
    "mechanics_preset_application_v1",
    "mechanics_preset_live_validation_v1",
    "mechanics_reference_runtime_implementation_v1",
    "mechanics_preset_freeze_manifest_v1",
  ]),
  MC7X: Object.freeze([
    "mechanics_preset_extension_freeze_manifest_v1",
    "mechanics_character_advancement_preset_v4",
    "mechanics_effect_value_binding_v1",
    "mechanics_progression_profile_v1",
    "mechanics_progression_profile_service_v1",
    "mechanics_command_state_readout_v1",
    "mechanics_command_state_readout_service_v1",
    "mechanics_applicator_v1_2",
  ]),
});

export const MECHANICS_COMPATIBILITY_SHARED_IDENTITIES = Object.freeze({
  moduleDefinition: "core.trackers.v1",
  instanceData: "trackers_instance_data.v0_2",
  coreFreezeManifest: "mechanics_preset_freeze_manifest_v1",
  extensionFreezeManifest: "mechanics_preset_extension_freeze_manifest_v1",
  progressionPreset: "module.character_advancement_curve.v1",
  progressionReadoutPreset: "module.character_advancement_readout.v1",
  progressionLegacyAlias: "module.character_advancement_5e.v1",
  presetLibraryUiBaseline: "MC7X.2.3",
});

export const MECHANICS_COMPATIBILITY_PACKAGE_BASELINE = Object.freeze({
  root: Object.freeze({
    name: "crestfall",
    version: "0.1.0",
    diagnosticsScript: "diagnostics:mc8a",
    command:
      "node components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc8RegressionBaseline.mjs",
  }),
  servicesApi: Object.freeze({
    name: "crestfall-api",
    version: "0.1.0",
    moduleType: "module",
    diagnosticsScript: "diagnostics:mc8a",
    command:
      "node src/services/chat/mechanics/mc8ServiceContractBaselineDiagnostics.mjs",
  }),
  nodePolicy: "RECORDED_AT_EXECUTION_NOT_FROZEN",
});

export const MECHANICS_COMPATIBILITY_REQUIRED_DIAGNOSTIC_GROUPS = Object.freeze({
  FRONTEND: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7ProductionHardeningAudit.mjs",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7BuilderLiveValidationDiagnostics.mjs",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7PresetApplicationDiagnostics.mjs",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/mc7PresetLibraryLayoutDiagnostics.mjs",
  ]),
  SERVICES_API: Object.freeze([
    "services/api/src/services/chat/mechanics/mc8ServiceContractBaselineDiagnostics.mjs",
    "services/api/src/services/chat/mechanics/mc4CrossDomainRegression.mjs",
  ]),
  CROSS_TIER: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7xCharacterAdvancementDiagnostics.mjs",
  ]),
  FREEZE_GATE: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7FinalCloseoutAudit.mjs",
  ]),
});

export const MECHANICS_COMPATIBILITY_OPTIONAL_DIAGNOSTICS = Object.freeze([
  "services/api/src/services/chat/mechanics/mc4CoexistenceMatrix.mjs",
  "services/api/src/services/chat/mechanics/mc4ProductionHardeningAudit.mjs",
  "services/api/src/services/chat/mechanics/mc5ProductionHardeningAudit.mjs",
  "services/api/src/services/chat/mechanics/mc6ProductionHardeningAudit.mjs",
]);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getMechanicsCompatibilityBaselineManifest() {
  return deepClone({
    version: MECHANICS_COMPATIBILITY_BASELINE_MANIFEST_VERSION,
    phase: MECHANICS_COMPATIBILITY_BASELINE_PHASE,
    status: MECHANICS_COMPATIBILITY_BASELINE_STATUS,
    frozenCounts: MECHANICS_COMPATIBILITY_FROZEN_COUNTS,
    contractsByPhase: MECHANICS_COMPATIBILITY_CONTRACTS_BY_PHASE,
    sharedIdentities: MECHANICS_COMPATIBILITY_SHARED_IDENTITIES,
    packages: MECHANICS_COMPATIBILITY_PACKAGE_BASELINE,
    requiredDiagnosticGroups:
      MECHANICS_COMPATIBILITY_REQUIRED_DIAGNOSTIC_GROUPS,
    optionalDiagnostics: MECHANICS_COMPATIBILITY_OPTIONAL_DIAGNOSTICS,
  });
}
