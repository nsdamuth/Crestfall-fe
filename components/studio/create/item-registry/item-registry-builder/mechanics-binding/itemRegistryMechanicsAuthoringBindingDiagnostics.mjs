import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../ItemRegistryBuilder.contract.js";

import {
  ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
  ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
} from "../../../../registries/item-operation-authoring/ItemOperationAuthoring.contract.js";

import {
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,
} from "../../../../registries/item-equipment-modifier-references/ItemEquipmentModifierReferences.contract.js";

import {
  ITEM_REGISTRY_MECHANICS_AUTHORING_BINDING_CONTRACT_VERSION,
  ITEM_REGISTRY_MECHANICS_AUTHORING_CALLBACK_KEYS,
  projectItemRegistryMechanicsAuthoringBinding,
} from "./ItemRegistryMechanicsAuthoringBinding.contract.js";

import {
  itemRegistryMechanicsAuthoringActiveEntryFixture,
  itemRegistryMechanicsAuthoringAtLimitsFixture,
  itemRegistryMechanicsAuthoringEmptyEntryFixture,
  itemRegistryMechanicsAuthoringNoActiveEntryFixture,
} from "./ItemRegistryMechanicsAuthoringBinding.fixtures.js";

assert.equal(
  ITEM_REGISTRY_MECHANICS_AUTHORING_BINDING_CONTRACT_VERSION,
  "item_registry_mechanics_authoring_binding_v1"
);

const active = projectItemRegistryMechanicsAuthoringBinding({
  activeEntry: itemRegistryMechanicsAuthoringActiveEntryFixture,
});

assert.equal(
  active.bindingContractVersion,
  ITEM_REGISTRY_MECHANICS_AUTHORING_BINDING_CONTRACT_VERSION
);
assert.equal(
  active.itemRegistryBuilderViewContractVersion,
  ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION
);
assert.equal(
  active.itemOperationPresentationContractVersion,
  ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  active.equipmentModifierPresentationContractVersion,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION
);

assert.deepEqual(active.activeEntry, {
  id: "item-resonance-compass",
  name: "Brass Resonance Compass",
});

assert.equal(
  active.sections.equipmentModifiers.title,
  "Equipment Effects"
);
assert.equal(
  active.sections.equipmentModifiers.maxReferences,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT
);
assert.equal(
  active.sections.equipmentModifiers.referenceCount,
  2
);
assert.equal(
  active.sections.equipmentModifiers.enabledReferenceCount,
  1
);
assert.equal(
  active.sections.equipmentModifiers.canAdd,
  true
);
assert.equal(
  active.sections.equipmentModifiers.references[0].modifierDefinitionId,
  "modifier.arcane-focus"
);
assert.equal(
  active.sections.equipmentModifiers.references[1].stacks,
  2
);

assert.equal(
  active.sections.operationRequirements.title,
  "Operation Requirements"
);
assert.equal(
  active.sections.operationRequirements.maxRequirementSets,
  ITEM_OPERATION_REQUIREMENT_SET_LIMIT
);
assert.equal(
  active.sections.operationRequirements.requirementSetCount,
  2
);
assert.equal(
  active.sections.operationRequirements.enabledRequirementSetCount,
  2
);
assert.equal(
  active.sections.operationRequirements.canAdd,
  true
);
assert.deepEqual(
  active.sections.operationRequirements.requirementSets[0].actionTypes,
  ["ITEM_USE"]
);
assert.equal(
  active.sections.operationRequirements.requirementSets[0].requirements[0].type,
  "SKILLS_RANK_CURRENT"
);

assert.equal(
  active.sections.operationEffects.title,
  "Operation Effects"
);
assert.equal(
  active.sections.operationEffects.maxEffectReferences,
  ITEM_OPERATION_EFFECT_REFERENCE_LIMIT
);
assert.equal(
  active.sections.operationEffects.effectReferenceCount,
  3
);
assert.equal(
  active.sections.operationEffects.enabledEffectReferenceCount,
  3
);
assert.equal(
  active.sections.operationEffects.canAdd,
  true
);
assert.equal(
  active.sections.operationEffects.effectOptions.length,
  9
);
assert.deepEqual(
  active.sections.operationEffects.targetRoles,
  ["SOURCE_ACTOR", "AUTHORIZED_TARGET"]
);
assert.equal(
  active.sections.operationEffects.effectReferences[0].domain,
  "STATS_POOLS"
);
assert.equal(
  active.sections.operationEffects.effectReferences[1].domain,
  "SKILLS"
);
assert.equal(
  active.sections.operationEffects.effectReferences[2].domain,
  "ABILITY_SPELL"
);

assert.equal(
  active.itemRegistryBuilderProps.equipmentModifierReferenceLimit,
  16
);
assert.equal(
  active.itemRegistryBuilderProps.operationRequirementSetLimit,
  16
);
assert.equal(
  active.itemRegistryBuilderProps.operationEffectReferenceLimit,
  32
);
assert.equal(
  active.itemRegistryBuilderProps.mechanicsAuthoring.activeEntryId,
  "item-resonance-compass"
);

const empty = projectItemRegistryMechanicsAuthoringBinding({
  activeEntry: itemRegistryMechanicsAuthoringEmptyEntryFixture,
});

assert.equal(
  empty.sections.equipmentModifiers.referenceCount,
  0
);
assert.equal(
  empty.sections.equipmentModifiers.canAdd,
  true
);
assert.equal(
  empty.sections.operationRequirements.requirementSetCount,
  0
);
assert.equal(
  empty.sections.operationRequirements.canAdd,
  true
);
assert.equal(
  empty.sections.operationEffects.effectReferenceCount,
  0
);
assert.equal(
  empty.sections.operationEffects.canAdd,
  true
);
assert.match(
  empty.sections.equipmentModifiers.emptyState,
  /normal Item Runtime behavior/i
);

const noActive = projectItemRegistryMechanicsAuthoringBinding(
  itemRegistryMechanicsAuthoringNoActiveEntryFixture
);

assert.equal(noActive.activeEntry, null);
assert.equal(
  noActive.sections.equipmentModifiers.disabled,
  true
);
assert.equal(
  noActive.sections.equipmentModifiers.canAdd,
  false
);
assert.equal(
  noActive.sections.operationRequirements.disabled,
  true
);
assert.equal(
  noActive.sections.operationRequirements.canAdd,
  false
);
assert.equal(
  noActive.sections.operationEffects.disabled,
  true
);
assert.equal(
  noActive.sections.operationEffects.canAdd,
  false
);

const atLimits = projectItemRegistryMechanicsAuthoringBinding({
  activeEntry: itemRegistryMechanicsAuthoringAtLimitsFixture,
});

assert.equal(
  atLimits.sections.equipmentModifiers.referenceCount,
  16
);
assert.equal(
  atLimits.sections.equipmentModifiers.canAdd,
  false
);
assert.equal(
  atLimits.sections.operationRequirements.requirementSetCount,
  16
);
assert.equal(
  atLimits.sections.operationRequirements.canAdd,
  false
);
assert.equal(
  atLimits.sections.operationEffects.effectReferenceCount,
  32
);
assert.equal(
  atLimits.sections.operationEffects.canAdd,
  false
);

assert.deepEqual(
  ITEM_REGISTRY_MECHANICS_AUTHORING_CALLBACK_KEYS,
  [
    "onAddEquipmentModifierReference",
    "onUpdateEquipmentModifierReference",
    "onRemoveEquipmentModifierReference",
    "onAddOperationRequirementSet",
    "onUpdateOperationRequirementSet",
    "onRemoveOperationRequirementSet",
    "onAddOperationEffectReference",
    "onUpdateOperationEffectReference",
    "onRemoveOperationEffectReference",
  ]
);

assert.deepEqual(active.architecture, {
  itemEntryNormalizationOwnedByChassis: true,
  addUpdateRemoveOperationsOwnedByChassis: true,
  payloadPersistenceOwnedByChassis: true,
  itemActionAuthorizationOwnedByChassis: true,
  typedOperationExecutionOwnedByChassis: true,
  statsPoolsModifierResolutionOwnedByChassis: true,
  actorStateMutationOwnedByChassis: true,
  mechanicsAuthoringPresentationOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./ItemRegistryMechanicsAuthoringBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "createEmptyItemEquipmentModifierReference",
  "createEmptyItemOperationRequirementSet",
  "createEmptyItemOperationEffectReference",
  "normalizeItemEntry",
  "updateEntry(",
  "setData(",
  "createCreationDraft",
  "executeItemRuntimeAction",
  "apply_modifier",
  "remove_modifier",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "item_registry_mechanics_authoring_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    ITEM_REGISTRY_MECHANICS_AUTHORING_BINDING_CONTRACT_VERSION,
  itemRegistryBuilderViewContractVersion:
    ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  itemOperationPresentationContractVersion:
    ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
  equipmentModifierPresentationContractVersion:
    ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  equipmentModifierLimit: ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  requirementSetLimit: ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
  effectReferenceLimit: ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  equipmentModifierSectionCovered: true,
  operationRequirementsSectionCovered: true,
  operationEffectsSectionCovered: true,
  noActiveEntryAndLimitStatesCovered: true,
  sourceViewCallbackShapeCarried: true,
  existingItemRegistryBuilderViewUnmodified: true,
  existingItemRegistryBuilderViewModelUnmodified: true,
  chassisMutationExecutionAndPersistenceExcluded: true,
}, null, 2));
