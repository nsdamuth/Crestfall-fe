import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ITEM_OPERATION_ACTION_TYPES,
  ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
  ITEM_OPERATION_EFFECT_AUTHORING_CATALOG_VERSION,
  ITEM_OPERATION_EFFECT_REFERENCE_VERSION,
  ITEM_OPERATION_EFFECT_TARGET_ROLES,
  ITEM_OPERATION_REQUIREMENT_SET_VERSION,
  ITEM_OPERATION_REQUIREMENTS_VERSION,
  listItemOperationEffectAuthoringOptions,
  normalizeItemOperationActionTypes,
  projectItemOperationAuthoringPresentation,
  resolveItemOperationEffectAuthoringOption,
} from "./ItemOperationAuthoring.contract.js";
import {
  itemOperationAuthoringEmptyFixture,
  itemOperationAuthoringFilledFixture,
} from "./ItemOperationAuthoring.fixtures.js";

assert.equal(ITEM_OPERATION_ACTION_TYPES.length, 11);
assert.deepEqual(ITEM_OPERATION_EFFECT_TARGET_ROLES, [
  "SOURCE_ACTOR",
  "AUTHORIZED_TARGET",
]);

const catalog = listItemOperationEffectAuthoringOptions();
assert.equal(
  ITEM_OPERATION_EFFECT_AUTHORING_CATALOG_VERSION,
  "item_operation_effect_authoring_catalog_v0"
);
assert.equal(catalog.length, 9);
assert.deepEqual(
  catalog.map((entry) => `${entry.domain}/${entry.operation}`),
  [
    "STATS_POOLS/MUTATE_POOL",
    "STATS_POOLS/APPLY_CONDITION",
    "STATS_POOLS/REMOVE_CONDITION",
    "STATS_POOLS/APPLY_MODIFIER",
    "STATS_POOLS/REMOVE_MODIFIER",
    "PROGRESSION/MUTATE_EXPERIENCE",
    "SKILLS/ADVANCE_RANK",
    "WALLET/MUTATE_BALANCE",
    "ABILITY_SPELL/SET_KNOWLEDGE",
  ]
);

for (const entry of catalog) {
  assert.deepEqual(entry.targetRoles, [
    "SOURCE_ACTOR",
    "AUTHORIZED_TARGET",
  ]);
}

assert.equal(
  resolveItemOperationEffectAuthoringOption({
    domain: "wallet",
    operation: "mutate_balance",
  })?.version,
  "actor_mechanics_profile.wallet.mutate_balance.v0"
);

assert.deepEqual(
  normalizeItemOperationActionTypes([
    "USE",
    "ITEM_CONSUME",
    "use",
    "not_real",
  ]),
  ["ITEM_USE", "ITEM_CONSUME"]
);

const empty = projectItemOperationAuthoringPresentation(
  itemOperationAuthoringEmptyFixture
);
assert.equal(
  empty.contractVersion,
  ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION
);
assert.equal(empty.summary.requirementSetCount, 0);
assert.equal(empty.summary.effectReferenceCount, 0);

const filled = projectItemOperationAuthoringPresentation(
  itemOperationAuthoringFilledFixture
);

assert.equal(filled.summary.requirementSetCount, 2);
assert.equal(filled.summary.enabledRequirementSetCount, 2);
assert.equal(filled.summary.effectReferenceCount, 5);
assert.equal(filled.summary.enabledEffectReferenceCount, 5);

const equipRequirement = filled.requirementSets[0];
assert.equal(
  equipRequirement.contractVersion,
  ITEM_OPERATION_REQUIREMENT_SET_VERSION
);
assert.equal(
  equipRequirement.requirementsVersion,
  ITEM_OPERATION_REQUIREMENTS_VERSION
);
assert.deepEqual(equipRequirement.actionTypes, ["ITEM_EQUIP"]);
assert.equal(equipRequirement.requirementMode, "ALL");
assert.equal(equipRequirement.requirements.length, 2);
assert.equal(
  equipRequirement.requirements[0].type,
  "STATS_POOLS_STAT_CURRENT"
);
assert.equal(
  equipRequirement.requirements[1].type,
  "SKILLS_RANK_CURRENT"
);

const healingTonic = filled.effectReferences.find(
  (entry) => entry.id === "healing-tonic"
);
assert.ok(healingTonic);
assert.equal(
  healingTonic.referenceVersion,
  ITEM_OPERATION_EFFECT_REFERENCE_VERSION
);
assert.deepEqual(healingTonic.actionTypes, [
  "ITEM_USE",
  "ITEM_CONSUME",
]);
assert.equal(healingTonic.domain, "STATS_POOLS");
assert.equal(healingTonic.operation, "MUTATE_POOL");
assert.equal(
  healingTonic.version,
  "actor_mechanics_profile.stats_pools.mutate_pool.v0"
);
assert.equal(healingTonic.targetRole, "AUTHORIZED_TARGET");
assert.equal(healingTonic.arguments.poolQuery, "pool.health");

const wallet = filled.effectReferences.find(
  (entry) => entry.id === "guild-purse"
);
assert.ok(wallet);
assert.equal(wallet.domain, "WALLET");
assert.equal(wallet.operation, "MUTATE_BALANCE");
assert.equal(wallet.arguments.currencyQuery, "currency.crowns");

const skill = filled.effectReferences.find(
  (entry) => entry.id === "training-manual"
);
assert.ok(skill);
assert.equal(skill.domain, "SKILLS");
assert.equal(skill.operation, "ADVANCE_RANK");
assert.equal(skill.arguments.skillQuery, "skill.arcana");

const ability = filled.effectReferences.find(
  (entry) => entry.id === "spell-manual"
);
assert.ok(ability);
assert.equal(ability.domain, "ABILITY_SPELL");
assert.equal(ability.operation, "SET_KNOWLEDGE");
assert.equal(ability.arguments.abilityQuery, "spell.arc_flare");

const source = fs.readFileSync(
  new URL("./ItemOperationAuthoring.contract.js", import.meta.url),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "providerInvocationAllowed",
  "provider-authored",
  "Crownfall",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic: "item_operation_authoring_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
  actionTypeCount: ITEM_OPERATION_ACTION_TYPES.length,
  registeredTypedOperationCount: catalog.length,
  requirementLanguageVersion:
    ITEM_OPERATION_REQUIREMENTS_VERSION,
  actorMechanicsRequirementShapeCarried: true,
  typedOperationCatalogCarried: true,
  runtimeMutationAuthorityExcluded: true,
  providerInvocationExcluded: true,
  crownfallSpecificRulesExcluded: true,
}, null, 2));
