import assert from "node:assert/strict";

import {
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  validateAbilitySpellProfileEditorValue,
} from "./AbilitySpellProfileEditor.contract.js";
import {
  abilitySpellProfileEditorFilledFixture,
  abilitySpellProfileEditorFixture,
} from "./AbilitySpellProfileEditor.fixtures.js";

for (const fixture of [
  abilitySpellProfileEditorFixture,
  abilitySpellProfileEditorFilledFixture,
]) {
  const result = validateAbilitySpellProfileEditorValue(fixture.value);
  assert.equal(result.valid, true);
  assert.equal(
    result.normalized.contractVersion,
    ABILITY_SPELL_PROFILE_CONTRACT_VERSION
  );
}

const filled =
  validateAbilitySpellProfileEditorValue(
    abilitySpellProfileEditorFilledFixture.value
  ).normalized;

assert.equal(filled.abilityDefinitions.length, 3);
assert.deepEqual(
  filled.abilityDefinitions.map((definition) => definition.type),
  ["SPELL", "TECHNIQUE", "PASSIVE"]
);

const spell = filled.abilityDefinitions[0];
assert.equal(spell.costs[0].resourceId, "pool.mana");
assert.equal(spell.targetModel.mode, "ACTOR_SINGLE");
assert.equal(spell.targetModel.requiresLineOfSight, true);
assert.equal(
  spell.operationReferences[0].referenceVersion,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION
);
assert.deepEqual(spell.operationReferences[0].targetBinding, {
  bindingVersion: ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
  mode: "AUTHORIZED_ABILITY_TARGET",
});

const technique = filled.abilityDefinitions[1];
assert.equal(technique.chargePolicy.mode, "FIXED");
assert.equal(technique.chargePolicy.maximumCharges, 2);
assert.equal(technique.chargePolicy.resetPolicy, "SCENE");

const passive = filled.abilityDefinitions[2];
assert.equal(passive.targetModel.mode, "NONE");
assert.equal(passive.targetModel.minimumTargets, 0);
assert.equal(passive.targetModel.maximumTargets, 0);

for (const definition of filled.abilityDefinitions) {
  assert.equal(Object.hasOwn(definition, "currentMastery"), false);
  assert.equal(Object.hasOwn(definition, "cooldownRemaining"), false);
  assert.equal(Object.hasOwn(definition, "currentCharges"), false);
}

console.log(JSON.stringify({
  diagnostic: "ability_spell_profile_fe_semantic_contract_v1",
  status: "PASSED",
  profileContractVersion: ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  filledDefinitionCount: filled.abilityDefinitions.length,
  includesExecutableOperation: true,
  runtimeStateExcluded: true,
}, null, 2));
