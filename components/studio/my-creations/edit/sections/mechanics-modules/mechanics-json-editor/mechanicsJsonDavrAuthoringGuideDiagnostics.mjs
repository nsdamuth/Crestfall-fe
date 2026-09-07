import assert from "node:assert/strict";

import {
  buildMechanicsJsonAiAuthoringGuide,
} from "./mechanicsJsonAiAuthoringGuide.js";
import {
  validateMechanicsModuleData,
} from "./mechanicsJsonEditor.validation.js";

const guide = buildMechanicsJsonAiAuthoringGuide();

for (const token of [
  "Deterministic Action Value Resolution (DAVR)",
  "mechanics_action_definition_v0",
  "mechanics_action_value_binding_v0",
  "mechanics_action_calculation_set_v0",
  "mechanics_action_calculation_v0",
  "mechanics_command_resolution_v7",
  'mode: "DETERMINISTIC_COMPARE"',
  "mechanics_deterministic_comparison_v0",
  "mechanics_result_band_v0",
  "mechanics_effect_reference_v0",
  "mechanics_calculated_argument_binding_v0",
  "ABILITY_SPELL_COST_AMOUNT",
  "ABILITY_SPELL_CURRENT_MASTERY",
  "ABILITY_SPELL_MAXIMUM_MASTERY",
]) {
  assert.ok(guide.includes(token), `AI authoring guide missing ${token}`);
}

for (const phrase of [
  "must never calculate authoritative runtime damage/check results in prose",
  "invent current actor/target values",
  "claim that prose mutated a pool",
  "Do **not** invent a new container",
  "logical DAVR runtime and player/chat invocation flow are separate concerns",
  "Do not assume that adding the mode alone creates authoritative action-value hydration.",
  "Do not duplicate Stats & Pools or Skills into Mechanics trackers",
  "Do not use JavaScript",
  "not accepted by generic DAVR v0",
  "Death/game-end is not DAVR",
]) {
  assert.ok(guide.includes(phrase), `AI authoring guide missing safety/authority statement: ${phrase}`);
}

const deterministicCompareFixture = {
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
        id: "compare_probe",
        label: "Compare Probe",
        commandContractVersion: "mechanics_command_contract_v1",
        invocation: {
          version: "mechanics_command_invocation_v1",
          enabled: true,
          command: "compare-probe",
          prefixes: ["/"],
          aliases: [],
          arguments: [],
        },
        requirements: [],
        attemptEffects: [],
        effects: [],
        resolution: {
          version: "mechanics_command_resolution_v7",
          mode: "DETERMINISTIC_COMPARE",
          comparison: {
            comparisonVersion: "mechanics_deterministic_comparison_v0",
            leftCalculationId: "left_total",
            rightCalculationId: "right_total",
            marginMode: "LEFT_MINUS_RIGHT",
            resultBands: [
              {
                bandVersion: "mechanics_result_band_v0",
                id: "success",
                minimumMargin: 0,
                maximumMargin: null,
                canonicalOutcome: "SUCCESS",
              },
              {
                bandVersion: "mechanics_result_band_v0",
                id: "failure",
                minimumMargin: null,
                maximumMargin: -1,
                canonicalOutcome: "FAILURE",
              },
            ],
          },
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

const validation = validateMechanicsModuleData(deterministicCompareFixture);
assert.equal(validation.valid, true, JSON.stringify(validation.errors));
assert.ok(
  validation.warnings.some((entry) =>
    entry.message.includes(
      "requires DAVR named calculation results from a trusted Action Resolution context"
    )
  ),
  "Plain Mechanics deterministic-compare authoring should carry the DAVR execution-context warning."
);

assert.equal(guide.includes("Weapon Base by class"), false);
assert.equal(guide.includes("Grandmaster ×2"), false);
assert.equal(guide.length <= 65536, true);

console.log(
  JSON.stringify(
    {
      status: "DETERMINISTIC_ACTION_VALUE_CREATOR_DOCUMENTATION_ACCEPTED",
      externalAiGuideDavrContractPresent: true,
      authoritativeRuntimeArithmeticAssignedToCrestfall: true,
      providerArithmeticAuthorityGranted: false,
      providerMutationAuthorityGranted: false,
      trustedActionPlacementBoundaryDocumented: true,
      plainMechanicsCompareContextWarningPresent: true,
      abilitySpellContextDeferralDocumented: true,
      deathGameEndSemanticsAdded: false,
      crownfallRulesPromotedToCrestfallDefaults: false,
    },
    null,
    2
  )
);
