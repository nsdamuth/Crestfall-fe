import assert from "node:assert/strict";

import {
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
  createEmptyAbilitySpellProfile,
} from "../ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";
import {
  formatAbilitySpellProfileJsonData,
  parseAndValidateAbilitySpellProfileJson,
} from "./abilitySpellProfileJsonEditor.validation.js";
import { buildAbilitySpellProfileJsonAiAuthoringGuide } from "./abilitySpellProfileJsonAiAuthoringGuide.js";

const profile = createEmptyAbilitySpellProfile();
const parsed = parseAndValidateAbilitySpellProfileJson(formatAbilitySpellProfileJsonData(profile));
assert.equal(parsed.valid, true);

const forbidden = parseAndValidateAbilitySpellProfileJson(JSON.stringify({
  ...profile,
  abilityDefinitions: [{ ...profile.abilityDefinitions[0], currentCharges: 2 }],
}));
assert.equal(forbidden.valid, false);
assert.ok(forbidden.errors.some((issue) => issue.code === "ABILITY_SPELL_PROFILE_ACTOR_STATE_FORBIDDEN"));

const executable = parseAndValidateAbilitySpellProfileJson(JSON.stringify({
  ...profile,
  abilityDefinitions: [{
    ...profile.abilityDefinitions[0],
    operationReferences: [{
      referenceVersion: ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
      id: "operation.restore_probe",
      domain: "STATS_POOLS",
      operation: "MUTATE_POOL",
      version: "actor_mechanics_profile.stats_pools.mutate_pool.v0",
      targetBinding: {
        bindingVersion: ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
        mode: "SOURCE_ACTOR",
      },
      arguments: {
        mutationType: "RESTORE",
        poolQuery: "pool.stamina",
        amount: 2,
      },
      metadata: {},
    }],
  }],
}));
assert.equal(executable.valid, true);
assert.equal(
  executable.normalized.abilityDefinitions[0].operationReferences[0].referenceVersion,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION
);
assert.equal(
  executable.normalized.abilityDefinitions[0].operationReferences[0].arguments.amount,
  2
);

const guide = buildAbilitySpellProfileJsonAiAuthoringGuide(profile);
assert.match(guide, /ability_spell_profile_contract_v0/);
assert.match(guide, /ability_spell_operation_reference_v1/);
assert.match(guide, /ability_spell_operation_target_binding_v0/);
assert.match(guide, /trusted Ability\/Spell authorization and committed-use boundary/);
assert.match(guide, /Validate & Apply/);

console.log(JSON.stringify({
  diagnostic: "ability_spell_profile_json_editor_v0",
  status: "PASSED",
  actorStateRejected: true,
  completeReplacementGuide: true,
  executableOperationReferenceAccepted: true,
  executableOperationAuthoringGuidance: true,
}, null, 2));
