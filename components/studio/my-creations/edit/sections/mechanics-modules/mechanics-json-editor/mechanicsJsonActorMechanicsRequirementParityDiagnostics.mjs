import assert from "node:assert/strict";

import {
  canonicalizeMechanicsModuleData,
  validateMechanicsModuleData,
} from "./mechanicsJsonEditor.validation.js";
import {
  buildMechanicsJsonAiAuthoringGuide,
} from "./mechanicsJsonAiAuthoringGuide.js";

const requirementTypes = [
  "STATS_POOLS_STAT_CURRENT",
  "STATS_POOLS_POOL_CURRENT",
  "STATS_POOLS_POOL_MAXIMUM",
  "STATS_POOLS_CONDITION_ACTIVE",
  "STATS_POOLS_CONDITION_INACTIVE",
  "STATS_POOLS_MODIFIER_ACTIVE",
  "STATS_POOLS_MODIFIER_INACTIVE",
  "SKILLS_RANK",
];

const requirements = requirementTypes.map((type, index) => ({
  id: `actor_requirement_${index + 1}`,
  type,
  bindingId: type === "SKILLS_RANK" ? "skills" : "stats",
  targetId:
    type === "SKILLS_RANK"
      ? "blades"
      : type.includes("POOL")
        ? "stamina"
        : type.includes("CONDITION")
          ? "blinded"
          : type.includes("MODIFIER")
            ? "high_ground"
            : "strength",
  operator: type.includes("ACTIVE") || type.includes("INACTIVE") ? "EQ" : "GTE",
  value: type.includes("ACTIVE") || type.includes("INACTIVE") ? true : 2,
  message: `Gate ${type}`,
}));

const fixture = {
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  priority: 65,
  tags: ["mechanics"],
  contractVersion: "trackers_instance_data.v0_2",
  instanceData: {
    contractVersion: "trackers_instance_data.v0_2",
    trackers: [],
    commands: [{
      id: "actor_requirement_probe",
      label: "Actor Requirement Probe",
      commandContractVersion: "mechanics_command_contract_v1",
      invocation: {
        version: "mechanics_command_invocation_v1",
        command: "actor-requirement-probe",
        prefixes: ["/"],
        aliases: [],
        arguments: [],
      },
      requirements,
      attemptEffects: [],
      effects: [],
      resolution: {
        version: "mechanics_command_resolution_v6",
        mode: "NO_ROLL_DETERMINISTIC",
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
    }],
    guards: [],
    statusBlocks: [],
    defaults: { flags: [], counters: [], stages: [] },
  },
};

const validation = validateMechanicsModuleData(fixture);
assert.equal(validation.valid, true, JSON.stringify(validation.errors));

const canonical = canonicalizeMechanicsModuleData(fixture);
const roundTripped = canonical.instanceData.commands[0].requirements;
assert.equal(roundTripped.length, requirements.length);
assert.deepEqual(
  roundTripped.map((entry) => ({
    type: entry.type,
    bindingId: entry.bindingId,
    targetId: entry.targetId,
    operator: entry.operator,
    value: entry.value,
  })),
  requirements.map((entry) => ({
    type: entry.type,
    bindingId: entry.bindingId,
    targetId: entry.targetId,
    operator: entry.operator,
    value: entry.value,
  }))
);

const invalidNumeric = structuredClone(fixture);
invalidNumeric.instanceData.commands[0].requirements[0].value = "not-a-number";
const invalidNumericValidation = validateMechanicsModuleData(invalidNumeric);
assert.equal(invalidNumericValidation.valid, false);
assert.ok(
  invalidNumericValidation.errors.some((entry) =>
    entry.message.includes("finite number")
  )
);

const missingTarget = structuredClone(fixture);
delete missingTarget.instanceData.commands[0].requirements[0].targetId;
const missingTargetValidation = validateMechanicsModuleData(missingTarget);
assert.equal(missingTargetValidation.valid, false);
assert.ok(
  missingTargetValidation.errors.some((entry) =>
    entry.message.includes("authoritative Stat/Pool/Condition/Modifier/Skill target ID")
  )
);

const guide = buildMechanicsJsonAiAuthoringGuide();
for (const type of requirementTypes) {
  assert.ok(guide.includes(`\`${type}\``), `Guide omitted ${type}.`);
}
assert.ok(guide.includes(
  "Do not duplicate authoritative Stats & Pools or Skills values into Mechanics trackers"
));
assert.ok(guide.includes(
  "do not ask an AI provider to invent or calculate the runtime value"
));

console.log(JSON.stringify({
  status: "MECHANICS_JSON_ACTOR_MECHANICS_REQUIREMENT_PARITY_ACCEPTED",
  backendRequirementTypeCountRepresented: requirementTypes.length,
  statsPoolsRequirementsAccepted: true,
  skillsRankRequirementAccepted: true,
  bindingIdPreserved: true,
  targetIdPreserved: true,
  valuesRoundTripWithoutLoss: true,
  invalidNumericRejected: true,
  missingTargetRejected: true,
  externalAiGuideUpdated: true,
  providerRuntimeValueAuthorityGranted: false,
}, null, 2));
