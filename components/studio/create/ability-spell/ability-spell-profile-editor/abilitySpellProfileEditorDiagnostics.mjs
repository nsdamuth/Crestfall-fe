import assert from "node:assert/strict";

import {
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  ABILITY_SPELL_DEFINITION_VERSION,
  ABILITY_SPELL_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
  ABILITY_SPELL_OPERATION_REFERENCE_VERSIONS,
  ABILITY_SPELL_TYPES,
  createEmptyAbilitySpellProfile,
  validateAbilitySpellProfileEditorValue,
} from "./AbilitySpellProfileEditor.contract.js";

const profile = createEmptyAbilitySpellProfile();
const result = validateAbilitySpellProfileEditorValue(profile);
assert.equal(result.valid, true);
assert.equal(profile.contractVersion, ABILITY_SPELL_PROFILE_CONTRACT_VERSION);
assert.equal(profile.abilityDefinitions[0].definitionVersion, ABILITY_SPELL_DEFINITION_VERSION);
assert.deepEqual(ABILITY_SPELL_TYPES, ["SPELL", "ABILITY", "TECHNIQUE", "SPECIAL_ATTACK", "PASSIVE"]);
assert.equal(Object.hasOwn(profile.abilityDefinitions[0], "currentMastery"), false);
assert.equal(Object.hasOwn(profile.abilityDefinitions[0], "cooldownRemaining"), false);
assert.equal(Object.hasOwn(profile.abilityDefinitions[0], "currentCharges"), false);

const legacyOperationProfile = {
  ...profile,
  abilityDefinitions: [{
    ...profile.abilityDefinitions[0],
    operationReferences: [{
      referenceVersion: ABILITY_SPELL_OPERATION_REFERENCE_VERSION,
      id: "operation.legacy_probe",
      domain: "STATS_POOLS",
      operation: "MUTATE_POOL",
      version: "actor_mechanics_profile.stats_pools.mutate_pool.v0",
      targetBinding: {
        bindingVersion: ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
        mode: "SOURCE_ACTOR",
      },
      arguments: { mutationType: "RESTORE", poolQuery: "pool.health", amount: 10 },
      metadata: {},
    }],
  }],
};
const legacyOperationResult = validateAbilitySpellProfileEditorValue(legacyOperationProfile);
assert.equal(legacyOperationResult.valid, true);
assert.equal(
  legacyOperationResult.normalized.abilityDefinitions[0].operationReferences[0].referenceVersion,
  ABILITY_SPELL_OPERATION_REFERENCE_VERSION
);
assert.equal(
  Object.hasOwn(legacyOperationResult.normalized.abilityDefinitions[0].operationReferences[0], "arguments"),
  false
);

const executableOperationProfile = {
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
      arguments: { mutationType: "RESTORE", poolQuery: "pool.health", amount: 10 },
      metadata: {},
    }],
  }],
};
const executableOperationResult = validateAbilitySpellProfileEditorValue(executableOperationProfile);
assert.equal(executableOperationResult.valid, true);
assert.deepEqual(ABILITY_SPELL_OPERATION_REFERENCE_VERSIONS, [
  ABILITY_SPELL_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
]);
assert.deepEqual(
  executableOperationResult.normalized.abilityDefinitions[0].operationReferences[0].targetBinding,
  {
    bindingVersion: ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
    mode: "SOURCE_ACTOR",
  }
);
assert.deepEqual(
  executableOperationResult.normalized.abilityDefinitions[0].operationReferences[0].arguments,
  { mutationType: "RESTORE", poolQuery: "pool.health", amount: 10 }
);

const missingExecutableTarget = validateAbilitySpellProfileEditorValue({
  ...executableOperationProfile,
  abilityDefinitions: [{
    ...executableOperationProfile.abilityDefinitions[0],
    operationReferences: [{
      ...executableOperationProfile.abilityDefinitions[0].operationReferences[0],
      targetBinding: null,
    }],
  }],
});
assert.equal(missingExecutableTarget.valid, false);
assert.ok(missingExecutableTarget.errors.some(
  (issue) => issue.code === "ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION_UNSUPPORTED"
));


const invalid = validateAbilitySpellProfileEditorValue({
  ...profile,
  abilityDefinitions: [{
    ...profile.abilityDefinitions[0],
    id: "Not Valid",
    type: "UNKNOWN",
    targetModel: { ...profile.abilityDefinitions[0].targetModel, mode: "UNKNOWN" },
  }],
});
assert.equal(invalid.valid, false);
assert.ok(invalid.errors.some((issue) => issue.code === "ABILITY_SPELL_IDENTIFIER_INVALID"));
assert.ok(invalid.errors.some((issue) => issue.code === "ABILITY_SPELL_TYPE_INVALID"));
assert.ok(invalid.errors.some((issue) => issue.code === "ABILITY_SPELL_TARGET_MODE_INVALID"));

console.log(JSON.stringify({
  diagnostic: "ability_spell_profile_loom_editor_v0",
  status: "PASSED",
  profileContractVersion: ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  definitionOnly: true,
  legacyOperationReferencePreserved: true,
  executableOperationReferenceAccepted: true,
  executableTargetBindingValidated: true,
}, null, 2));
