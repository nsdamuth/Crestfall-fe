import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_CALLBACK_KEYS,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION,
  normalizeItemEquipmentModifierReference,
  projectItemEquipmentModifierReferencesPresentation,
} from "./ItemEquipmentModifierReferences.contract.js";
import {
  itemEquipmentModifierReferencesEmptyFixture,
  itemEquipmentModifierReferencesFilledFixture,
  itemEquipmentModifierReferencesLimitFixture,
} from "./ItemEquipmentModifierReferences.fixtures.js";

assert.equal(ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT, 16);
assert.equal(
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION,
  "item_equipment_modifier_reference_v0"
);

const empty = projectItemEquipmentModifierReferencesPresentation(
  itemEquipmentModifierReferencesEmptyFixture
);
assert.equal(
  empty.contractVersion,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION
);
assert.equal(empty.summary.referenceCount, 0);
assert.equal(empty.summary.canAdd, true);
assert.equal(empty.summary.isEmpty, true);
assert.match(empty.emptyState, /normal Item Runtime behavior/i);

const filled = projectItemEquipmentModifierReferencesPresentation(
  itemEquipmentModifierReferencesFilledFixture
);
assert.equal(filled.summary.referenceCount, 3);
assert.equal(filled.summary.enabledReferenceCount, 2);
assert.equal(filled.summary.canAdd, true);
assert.equal(filled.references[0].statsPoolsBindingId, "stats");
assert.equal(
  filled.references[0].modifierDefinitionId,
  "modifier.shield-strength"
);
assert.equal(filled.references[1].stacks, 2);
assert.equal(filled.references[2].enabled, false);
assert.equal(filled.references[2].statsPoolsBindingId, "stats-alt");
assert.equal(
  filled.references[2].modifierDefinitionId,
  "modifier.arcane-ward"
);
assert.equal(filled.references[2].stacks, 1);

const clamped = projectItemEquipmentModifierReferencesPresentation(
  itemEquipmentModifierReferencesLimitFixture
);
assert.equal(clamped.references.length, 16);
assert.equal(clamped.summary.referenceCount, 16);
assert.equal(clamped.summary.canAdd, false);
assert.equal(
  clamped.references.every((reference) => reference.stacks === 1000),
  true
);

const fallback = normalizeItemEquipmentModifierReference({}, 4);
assert.equal(fallback.id, "equipment_modifier_5");
assert.equal(fallback.statsPoolsBindingId, "stats");
assert.equal(fallback.modifierDefinitionId, "");
assert.equal(fallback.stacks, 1);
assert.equal(
  fallback.referenceVersion,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION
);

assert.deepEqual(ITEM_EQUIPMENT_MODIFIER_REFERENCE_CALLBACK_KEYS, [
  "onAddReference",
  "onUpdateReference",
  "onRemoveReference",
]);

const source = fs.readFileSync(
  new URL("./ItemEquipmentModifierReferences.contract.js", import.meta.url),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "apply_modifier",
  "remove_modifier",
  "mechanicsApplicator",
  "services/api",
  "PostGraphile",
  "supabase",
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
  diagnostic: "item_equipment_modifier_references_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  referenceContractVersion:
    ITEM_EQUIPMENT_MODIFIER_REFERENCE_VERSION,
  maxReferenceCount:
    ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  filledReferenceCount: filled.summary.referenceCount,
  aliasNormalizationCovered: true,
  stackBoundsCovered: true,
  statsPoolsOwnershipPreserved: true,
  runtimeModifierMutationExcluded: true,
}, null, 2));
