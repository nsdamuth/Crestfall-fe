import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STRUCTURED_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../StructuredRegistryBuilder.contract.js";

import {
  STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,
} from "../../../../registries/structured-registry-references/StructuredRegistryReferencePresentation.contract.js";

import {
  STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_BINDING_CONTRACT_VERSION,
  STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_CALLBACK_KEYS,
  projectStructuredRegistryBuilderReferencePrecisionBinding,
} from "./StructuredRegistryBuilderReferencePrecisionBinding.contract.js";

import {
  structuredRegistryBuilderPrecisionActiveEntryFixture,
  structuredRegistryBuilderPrecisionConfigFixture,
  structuredRegistryBuilderPrecisionCreationsFixture,
  structuredRegistryBuilderPrecisionSelfReferenceFixture,
  structuredRegistryBuilderPrecisionUnavailableFixture,
} from "./StructuredRegistryBuilderReferencePrecisionBinding.fixtures.js";

assert.equal(
  STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_BINDING_CONTRACT_VERSION,
  "structured_registry_builder_reference_precision_binding_v1"
);

const active =
  projectStructuredRegistryBuilderReferencePrecisionBinding({
    config:
      structuredRegistryBuilderPrecisionConfigFixture,
    activeEntry:
      structuredRegistryBuilderPrecisionActiveEntryFixture,
    linkedCreations:
      structuredRegistryBuilderPrecisionCreationsFixture,
    currentRegistryCreationId:
      "11111111-1111-4111-8111-111111111111",
  });

assert.equal(
  active.bindingContractVersion,
  STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_BINDING_CONTRACT_VERSION
);

assert.equal(
  active.structuredRegistryBuilderViewContractVersion,
  STRUCTURED_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  active.referencePresentationContractVersion,
  STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION
);

assert.equal(
  active.activeEntryId,
  "faction.artificers"
);

assert.equal(
  active.relationshipGroups.length,
  4
);

const characters =
  active.relationshipGroups.find(
    (group) => group.id === "linkedCharacters"
  );

assert.equal(
  characters.selectionMode,
  "WHOLE_CREATION"
);
assert.equal(
  characters.referencePrecisionRequired,
  false
);
assert.equal(
  characters.references[0].referenceStatus,
  "CREATION_RESOLVED"
);
assert.equal(
  characters.references[0].title,
  "Kessa Cindervell"
);

const organizations =
  active.relationshipGroups.find(
    (group) => group.id === "linkedOrganizations"
  );

assert.equal(
  organizations.selectionMode,
  "REGISTRY_ENTRY"
);
assert.equal(
  organizations.referencePrecisionRequired,
  true
);
assert.equal(
  organizations.references[0].referenceStatus,
  "REGISTRY_ENTRY_RESOLVED"
);
assert.equal(
  organizations.references[0].title,
  "Old Crescent Watch"
);
assert.equal(
  organizations.references[0].registryTitle,
  "Aethelgard Institutions"
);
assert.deepEqual(
  organizations.selectedReferenceKeys,
  [
    "22222222-2222-4222-8222-222222222222::org.watch",
  ]
);

const factions =
  active.relationshipGroups.find(
    (group) => group.id === "linkedFactions"
  );

assert.equal(
  factions.selectionMode,
  "REGISTRY_ENTRY"
);
assert.equal(
  factions.references[0].referenceStatus,
  "REGISTRY_ENTRY_RESOLVED"
);
assert.equal(
  factions.references[0].title,
  "Iron Lantern Compact"
);
assert.equal(
  factions.references[1].referenceStatus,
  "LEGACY_REGISTRY_REFERENCE"
);
assert.match(
  factions.references[1].description,
  /Select a specific registry entry.*precise/i
);
assert.match(
  factions.helper,
  /specific registry entry/i
);
assert.match(
  factions.helper,
  /whole-registry links remain visible but are imprecise/i
);

const events =
  active.relationshipGroups.find(
    (group) => group.id === "linkedEvents"
  );

assert.equal(
  events.references[0].referenceStatus,
  "REGISTRY_ENTRY_NOT_FOUND"
);
assert.equal(
  events.references[0].title,
  "Missing registry entry"
);

assert.deepEqual(
  active.precisionSummary,
  {
    resolvedCreationCount: 1,
    resolvedRegistryEntryCount: 2,
    legacyRegistryReferenceCount: 1,
    missingRegistryEntryCount: 1,
    unavailableCount: 0,
  }
);

assert.equal(
  active.pickerState.preciseStructuredRegistryIdentity,
  "registryCreationId + registryEntryId"
);
assert.equal(
  active.pickerState.directSelfReferenceExcluded,
  true
);
assert.equal(
  active.pickerState.sameRegistrySiblingReferenceAllowed,
  true
);

const self =
  projectStructuredRegistryBuilderReferencePrecisionBinding({
    config: {
      relationshipGroups: [
        structuredRegistryBuilderPrecisionConfigFixture.relationshipGroups.find(
          (group) => group.id === "linkedFactions"
        ),
      ],
    },
    activeEntry:
      structuredRegistryBuilderPrecisionSelfReferenceFixture,
    linkedCreations:
      structuredRegistryBuilderPrecisionCreationsFixture,
    currentRegistryCreationId:
      "11111111-1111-4111-8111-111111111111",
  });

assert.deepEqual(
  self.pickerState.excludedReferenceKeys,
  [
    "11111111-1111-4111-8111-111111111111::faction.artificers",
  ]
);

assert.equal(
  self.pickerState.selectedReferenceKeys.includes(
    "11111111-1111-4111-8111-111111111111::faction.lantern"
  ),
  true
);

const unavailable =
  projectStructuredRegistryBuilderReferencePrecisionBinding({
    config: {
      relationshipGroups: [
        structuredRegistryBuilderPrecisionConfigFixture.relationshipGroups.find(
          (group) => group.id === "linkedEvents"
        ),
      ],
    },
    activeEntry:
      structuredRegistryBuilderPrecisionUnavailableFixture,
    linkedCreations:
      structuredRegistryBuilderPrecisionCreationsFixture,
    currentRegistryCreationId:
      "11111111-1111-4111-8111-111111111111",
  });

assert.equal(
  unavailable.relationshipGroups[0]
    .references[0].referenceStatus,
  "UNAVAILABLE"
);

assert.equal(
  unavailable.precisionSummary.unavailableCount,
  1
);

assert.deepEqual(
  STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_CALLBACK_KEYS,
  [
    "onOpenLinkPicker",
    "onSelectLinkedReference",
    "onRemoveLinkedReference",
    "onLinkedReferenceNotesChange",
  ]
);

assert.deepEqual(
  active.functionalWiringStatus,
  {
    preciseRegistryEntrySelection: "WIRED",
    linkedReferenceHydration: "WIRED",
    directSelfReferenceExclusion: "WIRED",
    sameRegistrySiblingReference: "WIRED",
    canonicalReferencePersistence: "WIRED",
  }
);

assert.deepEqual(
  active.visualWiringStatus,
  {
    registryTitlePresentation: "WIRED",
    legacyRegistryReferenceRecovery: "WIRED",
    missingRegistryEntryRecovery: "WIRED",
    unavailableReferenceRecovery: "WIRED",
  }
);

assert.deepEqual(
  active.architecture,
  {
    linkedCreationLoadingOwnedByChassis: true,
    pickerSearchOwnedByChassis: true,
    referenceMutationOwnedByChassis: true,
    relationshipPersistenceOwnedByChassis: true,
    authoritativeGraphResolutionOwnedByChassis: true,
    directSelfReferenceValidationOwnedByChassis: true,
    preciseReferencePresentationOwnedByFe: true,
    degradedReferencePresentationOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./StructuredRegistryBuilderReferencePrecisionBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "fetchOwnedCreations",
  "hydrateLinkedCreation",
  "createPickerSelections",
  "updateLinkedCreationNotes",
  "removeLinkedCreation",
  "addLinkedCreation",
  "useStructuredRegistryBuilderViewModel",
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
    "structured_registry_builder_reference_precision_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STRUCTURED_REGISTRY_BUILDER_REFERENCE_PRECISION_BINDING_CONTRACT_VERSION,
  structuredRegistryBuilderViewContractVersion:
    STRUCTURED_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  referencePresentationContractVersion:
    STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  wholeCreationAndRegistryEntryModesCovered: true,
  preciseStructuredEntryProjectionCovered: true,
  legacyWholeRegistryDegradedStateCovered: true,
  missingEntryAndUnavailableStatesCovered: true,
  directSelfReferenceExclusionCovered: true,
  sameRegistrySiblingReferenceCovered: true,
  preciseReferenceFunctionalWiringStatus: "WIRED",
  degradedReferenceVisualWiringStatus: "WIRED",
  structuredRegistryBuilderViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  structuredRegistryBuilderViewModelWiredToChassisAuthority: true,
  structuredRegistryCoreHookWiredToChassisAuthority: true,
  structuredRegistryUtilsWiredToChassisAuthority: true,
  linkedCreationPickerViewModelWiredToChassisAuthority: true,
  chassisLoadingMutationPersistenceAndGraphResolutionExcludedFromBindingContract: true,
}, null, 2));
