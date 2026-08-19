import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STRUCTURED_REGISTRY_REFERENCE_CALLBACK_KEYS,
  STRUCTURED_REGISTRY_REFERENCE_KEY_VERSION,
  STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  STRUCTURED_REGISTRY_TYPES,
  createStructuredRegistryReference,
  createStructuredRegistryReferenceKey,
  isDirectStructuredRegistrySelfReference,
  isStructuredRegistryType,
  normalizeStructuredRegistryReference,
  projectStructuredRegistryReferenceSelection,
  resolveStructuredRegistryReferencePresentation,
} from "./StructuredRegistryReferencePresentation.contract.js";

import {
  structuredRegistryAliasReferenceFixture,
  structuredRegistryReferenceCreationsFixture,
  structuredRegistryReferenceFilledFixture,
  structuredRegistrySelfReferenceFixture,
} from "./StructuredRegistryReferencePresentation.fixtures.js";

assert.deepEqual(STRUCTURED_REGISTRY_TYPES, [
  "ORGANIZATION_REGISTRY",
  "FACTION_REGISTRY",
  "EVENT_REGISTRY",
  "QUEST_REGISTRY",
]);

assert.equal(isStructuredRegistryType("faction_registry"), true);
assert.equal(isStructuredRegistryType("NPC_REGISTRY"), false);

assert.equal(
  createStructuredRegistryReferenceKey({
    creationId: "registry-a",
    registryEntryId: "entry-a",
  }),
  "registry-a::entry-a"
);
assert.equal(
  createStructuredRegistryReferenceKey({
    creationId: "creation-a",
  }),
  "creation-a::"
);

const aliasNormalized =
  normalizeStructuredRegistryReference(
    structuredRegistryAliasReferenceFixture
  );
assert.equal(
  aliasNormalized.creationId,
  "22222222-2222-4222-8222-222222222222"
);
assert.equal(
  aliasNormalized.registryCreationId,
  "22222222-2222-4222-8222-222222222222"
);
assert.equal(
  aliasNormalized.registryEntryId,
  "org.watch"
);

const preciseCreated = createStructuredRegistryReference(
  structuredRegistryReferenceCreationsFixture[0],
  {
    id: "faction.artificers",
  }
);
assert.equal(
  preciseCreated.registryCreationId,
  "11111111-1111-4111-8111-111111111111"
);
assert.equal(
  preciseCreated.registryEntryId,
  "faction.artificers"
);

const ordinaryCreated = createStructuredRegistryReference(
  structuredRegistryReferenceCreationsFixture[2]
);
assert.equal(
  Object.hasOwn(ordinaryCreated, "registryCreationId"),
  false
);
assert.equal(
  Object.hasOwn(ordinaryCreated, "registryEntryId"),
  false
);

const preciseResolved =
  resolveStructuredRegistryReferencePresentation(
    preciseCreated,
    structuredRegistryReferenceCreationsFixture
  );
assert.equal(
  preciseResolved.referenceStatus,
  "REGISTRY_ENTRY_RESOLVED"
);
assert.equal(preciseResolved.title, "Artificers");
assert.equal(
  preciseResolved.registryTitle,
  "Aethelgard Factions"
);

const legacyResolved =
  resolveStructuredRegistryReferencePresentation(
    {
      creationId:
        "11111111-1111-4111-8111-111111111111",
      creationType: "FACTION_REGISTRY",
    },
    structuredRegistryReferenceCreationsFixture
  );
assert.equal(
  legacyResolved.referenceStatus,
  "LEGACY_REGISTRY_REFERENCE"
);
assert.match(
  legacyResolved.description,
  /Select a specific registry entry.*precise/i
);

const missingResolved =
  resolveStructuredRegistryReferencePresentation(
    {
      creationId:
        "22222222-2222-4222-8222-222222222222",
      creationType: "ORGANIZATION_REGISTRY",
      registryCreationId:
        "22222222-2222-4222-8222-222222222222",
      registryEntryId: "org.missing",
    },
    structuredRegistryReferenceCreationsFixture
  );
assert.equal(
  missingResolved.referenceStatus,
  "REGISTRY_ENTRY_NOT_FOUND"
);
assert.equal(
  missingResolved.title,
  "Missing registry entry"
);
assert.match(
  missingResolved.description,
  /org\.missing.*no longer exists/i
);

const unavailableResolved =
  resolveStructuredRegistryReferencePresentation(
    {
      creationId:
        "99999999-9999-4999-8999-999999999999",
      creationType: "QUEST_REGISTRY",
      registryCreationId:
        "99999999-9999-4999-8999-999999999999",
      registryEntryId: "quest.unknown",
    },
    structuredRegistryReferenceCreationsFixture
  );
assert.equal(
  unavailableResolved.referenceStatus,
  "UNAVAILABLE"
);

assert.equal(
  isDirectStructuredRegistrySelfReference(
    structuredRegistrySelfReferenceFixture.selfReference,
    structuredRegistrySelfReferenceFixture
  ),
  true
);
assert.equal(
  isDirectStructuredRegistrySelfReference(
    structuredRegistrySelfReferenceFixture.siblingReference,
    structuredRegistrySelfReferenceFixture
  ),
  false
);

const projected =
  projectStructuredRegistryReferenceSelection(
    structuredRegistryReferenceFilledFixture
  );

assert.equal(
  projected.contractVersion,
  STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  projected.referenceKeyVersion,
  STRUCTURED_REGISTRY_REFERENCE_KEY_VERSION
);
assert.equal(projected.summary.referenceCount, 5);
assert.equal(projected.summary.resolvedCreationCount, 1);
assert.equal(projected.summary.resolvedRegistryEntryCount, 1);
assert.equal(projected.summary.legacyRegistryReferenceCount, 1);
assert.equal(projected.summary.missingRegistryEntryCount, 1);
assert.equal(projected.summary.unavailableCount, 1);

assert.deepEqual(
  projected.selectedReferenceKeys,
  [
    "33333333-3333-4333-8333-333333333333::",
    "11111111-1111-4111-8111-111111111111::faction.artificers",
    "11111111-1111-4111-8111-111111111111::",
    "22222222-2222-4222-8222-222222222222::org.missing",
    "99999999-9999-4999-8999-999999999999::quest.unknown",
  ]
);

const selfProjection =
  projectStructuredRegistryReferenceSelection({
    references: [
      structuredRegistrySelfReferenceFixture.selfReference,
      structuredRegistrySelfReferenceFixture.siblingReference,
    ],
    creations: structuredRegistryReferenceCreationsFixture,
    currentRegistryCreationId:
      structuredRegistrySelfReferenceFixture.currentRegistryCreationId,
    currentRegistryEntryId:
      structuredRegistrySelfReferenceFixture.currentRegistryEntryId,
  });

assert.deepEqual(selfProjection.excludedReferenceKeys, [
  "11111111-1111-4111-8111-111111111111::faction.artificers",
]);
assert.equal(
  selfProjection.selectedReferenceKeys.includes(
    "11111111-1111-4111-8111-111111111111::faction.lantern"
  ),
  true
);

assert.deepEqual(
  STRUCTURED_REGISTRY_REFERENCE_CALLBACK_KEYS,
  [
    "onOpenPicker",
    "onSelectReference",
    "onRemoveReference",
  ]
);

const source = fs.readFileSync(
  new URL(
    "./StructuredRegistryReferencePresentation.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "targetEntryName",
  "authoritativeRegistryGraphResolver",
  "structuredRegistryEntryReferenceResolver",
  "registryGraphDeepRetrieval",
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
  diagnostic:
    "structured_registry_reference_precision_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    STRUCTURED_REGISTRY_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  referenceKeyVersion:
    STRUCTURED_REGISTRY_REFERENCE_KEY_VERSION,
  structuredRegistryTypeCount:
    STRUCTURED_REGISTRY_TYPES.length,
  preciseEntryReferenceCovered: true,
  legacyRegistryReferenceCovered: true,
  missingEntryDegradedStateCovered: true,
  unavailableCreationDegradedStateCovered: true,
  directSelfReferenceGuardCovered: true,
  sameRegistrySiblingReferenceAllowed: true,
  runtimeGraphResolverExcluded: true,
}, null, 2));
