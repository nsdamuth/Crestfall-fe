import assert from "node:assert/strict";

import {
  canonicalizeMechanicsModuleData,
  validateMechanicsModuleData,
} from "./mechanicsJsonEditor.validation.js";
import {
  buildMechanicsJsonAiAuthoringGuide,
} from "./mechanicsJsonAiAuthoringGuide.js";
import {
  COMMAND_RESOLUTION_MODES,
  COMMAND_RESOLUTION_VISUAL_MODES,
  MECHANICS_COMMAND_RESOLUTION_VERSION,
  MECHANICS_COMMAND_RESOLUTION_VERSION_V7,
  normalizeMechanicsCommandResolutionBuilder,
} from "../mechanicsCommandResolutionBuilder.js";

const comparison = {
  comparisonVersion: "mechanics_deterministic_comparison_v0",
  leftCalculationId: "attack_total",
  rightCalculationId: "guard_total",
  marginMode: "LEFT_MINUS_RIGHT",
  resultBands: [
    {
      bandVersion: "mechanics_result_band_v0",
      id: "full",
      minimumMargin: 15,
      maximumMargin: null,
      canonicalOutcome: "SUCCESS",
    },
    {
      bandVersion: "mechanics_result_band_v0",
      id: "partial",
      minimumMargin: -14,
      maximumMargin: 14,
      canonicalOutcome: "SUCCESS",
    },
    {
      bandVersion: "mechanics_result_band_v0",
      id: "failure",
      minimumMargin: null,
      maximumMargin: -15,
      canonicalOutcome: "FAILURE",
    },
  ],
};

const fixture = {
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  priority: 65,
  tags: ["mechanics"],
  contractVersion: "trackers_instance_data.v0_2",
  instanceData: {
    contractVersion: "trackers_instance_data.v0_2",
    trackers: [],
    commands: [
      {
        id: "deterministic_compare_probe",
        label: "Deterministic Compare Probe",
        commandContractVersion: "mechanics_command_contract_v1",
        invocation: {
          version: "mechanics_command_invocation_v1",
          command: "deterministic-compare-probe",
          prefixes: ["/"],
          aliases: [],
          arguments: [],
        },
        requirements: [],
        attemptEffects: [],
        effects: [],
        resolution: {
          version: MECHANICS_COMMAND_RESOLUTION_VERSION_V7,
          mode: "DETERMINISTIC_COMPARE",
          comparison,
        },
        outcomes: {},
        domainAction: {
          version: "mechanics_command_domain_action_v1",
          enabled: false,
          type: "NONE",
          applyOnOutcomes: [],
        },
        presentation: {
          mode: "MECHANICS_ACTION",
          continueNarrative: false,
          advanceTime: false,
          resultVisibility: "FULL",
        },
      },
    ],
    guards: [],
    statusBlocks: [],
    defaults: { flags: [], counters: [], stages: [] },
  },
};

assert.equal(MECHANICS_COMMAND_RESOLUTION_VERSION, "mechanics_command_resolution_v6");
assert.equal(MECHANICS_COMMAND_RESOLUTION_VERSION_V7, "mechanics_command_resolution_v7");
assert.ok(COMMAND_RESOLUTION_MODES.includes("DETERMINISTIC_COMPARE"));
assert.equal(COMMAND_RESOLUTION_VISUAL_MODES.includes("DETERMINISTIC_COMPARE"), false);

const validation = validateMechanicsModuleData(fixture);
assert.equal(validation.valid, true, JSON.stringify(validation.errors));

const canonical = canonicalizeMechanicsModuleData(fixture);
const roundTrippedResolution = canonical.instanceData.commands[0].resolution;
assert.equal(roundTrippedResolution.version, MECHANICS_COMMAND_RESOLUTION_VERSION_V7);
assert.equal(roundTrippedResolution.mode, "DETERMINISTIC_COMPARE");
assert.equal(roundTrippedResolution.comparison.leftCalculationId, "attack_total");
assert.equal(roundTrippedResolution.comparison.rightCalculationId, "guard_total");
assert.deepEqual(
  roundTrippedResolution.comparison.resultBands.map((band) => ({
    id: band.id,
    minimumMargin: band.minimumMargin,
    maximumMargin: band.maximumMargin,
    canonicalOutcome: band.canonicalOutcome,
  })),
  comparison.resultBands.map((band) => ({
    id: band.id,
    minimumMargin: band.minimumMargin,
    maximumMargin: band.maximumMargin,
    canonicalOutcome: band.canonicalOutcome,
  }))
);

const normalized = normalizeMechanicsCommandResolutionBuilder({
  version: MECHANICS_COMMAND_RESOLUTION_VERSION_V7,
  mode: "DETERMINISTIC_COMPARE",
  comparison,
  customFutureMetadata: { preserve: true },
});
assert.equal(normalized.version, MECHANICS_COMMAND_RESOLUTION_VERSION_V7);
assert.equal(normalized.mode, "DETERMINISTIC_COMPARE");
assert.deepEqual(normalized.customFutureMetadata, { preserve: true });
assert.equal(normalized.comparison.resultBands.length, 3);

const wrongVersion = structuredClone(fixture);
wrongVersion.instanceData.commands[0].resolution.version =
  MECHANICS_COMMAND_RESOLUTION_VERSION;
const wrongVersionValidation = validateMechanicsModuleData(wrongVersion);
assert.equal(wrongVersionValidation.valid, false);
assert.ok(
  wrongVersionValidation.errors.some((entry) =>
    entry.message.includes("DETERMINISTIC_COMPARE requires mechanics_command_resolution_v7")
  )
);

const overlap = structuredClone(fixture);
overlap.instanceData.commands[0].resolution.comparison.resultBands = [
  { id: "one", minimumMargin: 0, canonicalOutcome: "SUCCESS" },
  { id: "two", maximumMargin: 10, canonicalOutcome: "FAILURE" },
];
const overlapValidation = validateMechanicsModuleData(overlap);
assert.equal(overlapValidation.valid, false);
assert.ok(overlapValidation.errors.some((entry) => entry.message.includes("overlap")));

const missingId = structuredClone(fixture);
delete missingId.instanceData.commands[0].resolution.comparison.resultBands[0].id;
const missingIdValidation = validateMechanicsModuleData(missingId);
assert.equal(missingIdValidation.valid, false);
assert.ok(
  missingIdValidation.errors.some((entry) =>
    entry.message.includes("Result band requires a stable ID")
  )
);

const invalidNumber = structuredClone(fixture);
invalidNumber.instanceData.commands[0].resolution.comparison.resultBands[0].minimumMargin =
  "not-a-number";
const invalidNumberValidation = validateMechanicsModuleData(invalidNumber);
assert.equal(invalidNumberValidation.valid, false);
assert.ok(
  invalidNumberValidation.errors.some((entry) =>
    entry.message.includes("minimumMargin must be a finite number or null")
  )
);

const legacy = structuredClone(fixture);
legacy.instanceData.commands[0].resolution = {
  version: MECHANICS_COMMAND_RESOLUTION_VERSION,
  mode: "NO_ROLL_DETERMINISTIC",
};
const legacyValidation = validateMechanicsModuleData(legacy);
assert.equal(legacyValidation.valid, true, JSON.stringify(legacyValidation.errors));
const legacyCanonical = canonicalizeMechanicsModuleData(legacy);
assert.equal(
  legacyCanonical.instanceData.commands[0].resolution.version,
  MECHANICS_COMMAND_RESOLUTION_VERSION
);
assert.equal(
  legacyCanonical.instanceData.commands[0].resolution.mode,
  "NO_ROLL_DETERMINISTIC"
);

const guide = buildMechanicsJsonAiAuthoringGuide();
assert.ok(guide.includes("mechanics_command_resolution_v7"));
assert.ok(guide.includes('mode: "DETERMINISTIC_COMPARE"'));
assert.ok(guide.includes("does **not** calculate or invent the runtime actor values"));
assert.ok(guide.includes("Result bands must not overlap"));
assert.ok(guide.includes("Provider prose is not mechanical authority"));

console.log(
  JSON.stringify(
    {
      status: "MECHANICS_JSON_DETERMINISTIC_COMPARE_V0_ACCEPTED",
      legacyV6Preserved: true,
      deterministicCompareV7Accepted: true,
      comparisonRoundTripPreserved: true,
      resultBandsRoundTripPreserved: true,
      unknownMetadataPreserved: true,
      wrongVersionRejected: true,
      overlapRejected: true,
      missingBandIdRejected: true,
      invalidBandNumberRejected: true,
      deterministicCompareNotForcedIntoDiceUi: true,
      externalAiGuideUpdated: true,
      providerArithmeticAuthorityGranted: false,
    },
    null,
    2
  )
);
