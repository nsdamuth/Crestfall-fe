export const MECHANICS_LEGACY_FIXTURE_INVENTORY_VERSION =
  "mechanics_legacy_fixture_inventory_v1";

export const MECHANICS_LEGACY_FIXTURE_STATUS = "INVENTORIED_NOT_MIGRATED";

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export const MECHANICS_LEGACY_FIXTURES = deepFreeze([
  {
    id: "legacy.command.trigger_only.pre_mc1.v1",
    confidence: "CONFIRMED_COMPATIBILITY_SHAPE",
    kind: "COMMAND_PARTIAL",
    originBoundary: "PRE_MC1",
    completeness: "PARTIAL_SHAPE_FIXTURE",
    sample: {
      id: "legacy_settled",
      label: "Legacy Settled",
      triggers: ["/settled"],
      effects: [
        {
          id: "set_player_settled",
          type: "FLAG_SET",
          targetId: "player_settled",
          value: true,
        },
      ],
    },
    expectedMC8Treatment:
      "Preserve legacy trigger compatibility while canonical structured invocation is synthesized or normalized.",
  },
  {
    id: "legacy.command.pre_composition.mc5.v1",
    confidence: "CONFIRMED_COMPATIBILITY_SHAPE",
    kind: "COMMAND_PARTIAL",
    originBoundary: "PRE_MC6",
    completeness: "PARTIAL_SHAPE_FIXTURE",
    sample: {
      commandContractVersion: "mechanics_command_contract_v1",
      invocation: {
        version: "mechanics_command_invocation_v1",
        enabled: true,
        command: "probe",
        prefixes: ["/"],
        aliases: [],
        arguments: [],
        caseSensitive: false,
      },
      attemptEffects: [],
      outcomes: {
        version: "mechanics_command_outcomes_v1",
      },
      domainAction: {
        version: "mechanics_command_domain_action_v1",
        enabled: false,
        type: "NONE",
        applyOnOutcomes: [],
      },
    },
    expectedMC8Treatment:
      "Normalize missing composition to the legacy-compatible empty composition without changing execution semantics.",
  },
  {
    id: "legacy.resolution.v1_saved_command.v1",
    confidence: "CONFIRMED_HISTORICAL_SHAPE",
    kind: "RESOLUTION_PARTIAL",
    originBoundary: "MC2_TO_MC5",
    completeness: "PARTIAL_SHAPE_FIXTURE",
    sample: {
      version: "mechanics_command_resolution_v1",
      mode: "NO_ROLL_DETERMINISTIC",
      die: { count: 1, sides: 20 },
      targetNumber: null,
      criticalOnNaturalMax: true,
      fumbleOnNaturalMin: true,
    },
    expectedMC8Treatment:
      "Inventory compatibility normalization into the frozen v6 resolution contract; no migration is implemented in MC8A.",
  },
  {
    id: "legacy.preset.core_only_library.mc7.v1",
    confidence: "CONFIRMED_FROZEN_BASELINE",
    kind: "CATALOG_MANIFEST",
    originBoundary: "MC7G_CORE",
    completeness: "COMPLETE_METADATA_FIXTURE",
    sample: {
      manifestVersion: "mechanics_preset_freeze_manifest_v1",
      presetCount: 20,
      extensionPresetCount: 0,
    },
    expectedMC8Treatment:
      "Preserve the twenty-preset core freeze while resolving additive extension presets through the extension library.",
  },
  {
    id: "legacy.preset.extension_library_21.mc7x.v1",
    confidence: "CONFIRMED_HISTORICAL_BASELINE",
    kind: "CATALOG_MANIFEST",
    originBoundary: "MC7X_PRE_OBSERVABILITY",
    completeness: "COMPLETE_METADATA_FIXTURE",
    sample: {
      corePresetCount: 20,
      extensionPresetCount: 1,
      liveLibraryPresetCount: 21,
      extensionPresetIds: ["module.character_advancement_curve.v1"],
    },
    expectedMC8Treatment:
      "Recognize the pre-readout extension snapshot and preserve the authored advancement module without silently adding commands.",
  },
  {
    id: "legacy.character_advancement.alias_lookup.v1",
    confidence: "CONFIRMED_COMPATIBILITY_SHAPE",
    kind: "PRESET_LOOKUP",
    originBoundary: "MC7X",
    completeness: "COMPLETE_METADATA_FIXTURE",
    sample: {
      requestedPresetId: "module.character_advancement_5e.v1",
      canonicalPresetId: "module.character_advancement_curve.v1",
    },
    expectedMC8Treatment:
      "Resolve the legacy preset identity to the canonical generated-curve preset without duplicating catalog entries.",
  },
  {
    id: "legacy.character_advancement.pre_readout_snapshot.v1",
    confidence: "CONFIRMED_PRODUCT_BEHAVIOR",
    kind: "MECHANICS_MODULE_PARTIAL",
    originBoundary: "MC7X1",
    completeness: "PARTIAL_SHAPE_FIXTURE",
    sample: {
      moduleDefinitionId: "core.trackers.v1",
      moduleId: "core.trackers.v1",
      contractVersion: "trackers_instance_data.v0_2",
      instanceData: {
        contractVersion: "trackers_instance_data.v0_2",
        commands: [
          { id: "award_experience", invocation: { command: "award_xp" } },
          {
            id: "enable_character_advancement",
            invocation: { command: "advancement_on" },
          },
          {
            id: "disable_character_advancement",
            invocation: { command: "advancement_off" },
          },
        ],
        defaults: {
          flags: [{ id: "advancement_enabled", initial: true }],
          counters: [
            { id: "experience_points", initial: 0 },
            { id: "character_level", initial: 1 },
            { id: "proficiency_bonus", initial: 2 },
            { id: "level_ups", initial: 0 },
          ],
          stages: [],
        },
      },
    },
    expectedMC8Treatment:
      "Do not silently mutate saved snapshots. The readout add-on remains an explicit MERGE_MODULE operation.",
  },
  {
    id: "legacy.module.missing_optional_collections.synthetic.v1",
    confidence: "SYNTHETIC_COMPATIBILITY_FIXTURE",
    kind: "MECHANICS_MODULE_PARTIAL",
    originBoundary: "NORMALIZATION_EDGE",
    completeness: "PARTIAL_SHAPE_FIXTURE",
    sample: {
      moduleDefinitionId: "core.trackers.v1",
      contractVersion: "trackers_instance_data.v0_2",
      instanceData: {
        trackers: [],
        commands: [],
        defaults: { flags: [], counters: [] },
      },
    },
    expectedMC8Treatment:
      "Normalize absent optional collections to empty arrays without inventing authored content.",
  },
]);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function listMechanicsLegacyFixtures() {
  return deepClone(MECHANICS_LEGACY_FIXTURES);
}
