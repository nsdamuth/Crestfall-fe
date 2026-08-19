import assert from "node:assert/strict";
import fs from "node:fs";

import {
  NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../NpcRegistryBuilder.contract.js";

import {
  NPC_REGISTRY_CREATION_REF_CANONICAL_FIELDS,
  NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS,
  NPC_REGISTRY_ENTRY_KINDS,
  NPC_REGISTRY_LINKED_CHARACTER_AUTHORITY_BINDING_CONTRACT_VERSION,
  NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES,
  projectNpcRegistryLinkedCharacterAuthorityBinding,
} from "./NpcRegistryLinkedCharacterAuthorityBinding.contract.js";

import {
  npcRegistryLinkedCharacterCanonicalFixture,
  npcRegistryLinkedCharacterHydratedFixture,
  npcRegistryLinkedCharacterLegacyCopiedDescriptionFixture,
} from "./NpcRegistryLinkedCharacterAuthorityBinding.fixtures.js";

assert.equal(
  NPC_REGISTRY_LINKED_CHARACTER_AUTHORITY_BINDING_CONTRACT_VERSION,
  "npc_registry_linked_character_authority_binding_v1"
);

assert.deepEqual(
  NPC_REGISTRY_ENTRY_KINDS,
  {
    AD_HOC: "AD_HOC",
    CREATION_REF: "CREATION_REF",
  }
);

assert.deepEqual(
  NPC_REGISTRY_LINKED_CHARACTER_REFERENCE_STATUSES,
  {
    RESOLVED: "RESOLVED",
    UNAVAILABLE: "UNAVAILABLE",
  }
);

assert.deepEqual(
  NPC_REGISTRY_CREATION_REF_CANONICAL_FIELDS,
  [
    "id",
    "kind",
    "notes",
    "creationId",
    "creationType",
  ]
);

assert.equal(
  NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS.includes(
    "name"
  ),
  true
);

assert.equal(
  NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS.includes(
    "hydratedCharacter"
  ),
  true
);

assert.equal(
  NPC_REGISTRY_CREATION_REF_FORBIDDEN_PERSISTED_FIELDS.includes(
    "actorMechanicsProfileId"
  ),
  true
);

const projection =
  projectNpcRegistryLinkedCharacterAuthorityBinding({
    canonicalRegistry:
      npcRegistryLinkedCharacterCanonicalFixture,
    hydratedRegistry:
      npcRegistryLinkedCharacterHydratedFixture,
  });

assert.equal(
  projection.bindingContractVersion,
  NPC_REGISTRY_LINKED_CHARACTER_AUTHORITY_BINDING_CONTRACT_VERSION
);

assert.equal(
  projection.npcRegistryBuilderViewContractVersion,
  NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  projection.npcRegistryBuilderViewContractVersion,
  "npc-registry-builder.view.v1"
);

assert.deepEqual(
  projection.summary,
  {
    entryCount: 3,
    linkedCharacterCount: 2,
    adHocCount: 1,
    unavailableLinkedCharacterCount: 1,
    canonicalViolationCount: 0,
    copiedDescriptionObservationCount: 0,
  }
);

const mira =
  projection.displayRegistry.entries.find(
    (entry) =>
      entry.id === "person-mira"
  );

assert.equal(
  mira.kind,
  "CREATION_REF"
);

assert.equal(
  mira.creationId,
  "11111111-1111-4111-8111-111111111111"
);

assert.equal(
  mira.name,
  "Mira Quill — Current Title"
);

assert.equal(
  mira.notes,
  "Registry-local note: Mira usually covers the night counter."
);

assert.equal(
  mira.referenceStatus,
  "RESOLVED"
);

assert.deepEqual(
  mira.hydratedCharacter,
  {
    id:
      "11111111-1111-4111-8111-111111111111",
    title:
      "Mira Quill — Current Title",
    subtitle:
      "Shopkeeper",
    description:
      "Current Character description from the Character Creation.",
    imageUrl:
      "https://example.test/mira-current.webp",
    contentRating: "SFW",
    visibility: "PUBLIC",
    status: "APPROVED",
  }
);

assert.deepEqual(
  mira.mechanicsPresentation,
  {
    source:
      "LINKED_CHARACTER_CREATION",
    editableOnRegistryEntry:
      false,
    label:
      "Mechanics follow the linked Character creation.",
  }
);

assert.equal(
  mira.canonicalAudit.canonical,
  true
);

const kessa =
  projection.displayRegistry.entries.find(
    (entry) =>
      entry.id === "person-kessa"
  );

assert.equal(
  kessa.name,
  "Linked Character unavailable"
);

assert.equal(
  kessa.referenceStatus,
  "UNAVAILABLE"
);

assert.equal(
  kessa.creationId,
  "22222222-2222-4222-8222-222222222222"
);

assert.equal(
  kessa.hydratedCharacter,
  null
);

assert.equal(
  kessa.recovery.degraded,
  true
);

assert.equal(
  kessa.recovery.tone,
  "ERROR"
);

assert.equal(
  kessa.recovery.title,
  "Linked Character unavailable"
);

assert.match(
  kessa.recovery.message,
  /preserves the linked Character Creation ID/i
);

assert.match(
  kessa.recovery.message,
  /rather than replacing it with stale copied Character data/i
);

const shopper =
  projection.displayRegistry.entries.find(
    (entry) =>
      entry.id === "person-shopper"
  );

assert.equal(
  shopper.kind,
  "AD_HOC"
);

assert.equal(
  shopper.name,
  "Workshop Customer"
);

assert.equal(
  shopper.creationId,
  ""
);

assert.equal(
  shopper.actorMechanicsProfileAttachment.creationId,
  "33333333-3333-4333-8333-333333333333"
);

assert.equal(
  shopper.actorMechanicsProfileAttachment.title,
  "Lightweight Civilian"
);

assert.deepEqual(
  shopper.actorMechanicsProfileAttachment.enabledDomains,
  [
    "STATS",
    "SKILLS",
  ]
);

assert.equal(
  shopper.mechanicsPresentation.source,
  "REGISTRY_ENTRY_ATTACHMENT"
);

assert.equal(
  shopper.mechanicsPresentation.editableOnRegistryEntry,
  true
);

assert.equal(
  projection.persistenceContract.authority,
  "CHASSIS"
);

assert.match(
  projection.persistenceContract.creationRefRule,
  /persists stable Character identity and Registry-local notes only/i
);

assert.match(
  projection.persistenceContract.adHocRule,
  /lightweight AD_HOC NPC remains Registry-owned/i
);

assert.deepEqual(
  projection.persistenceContract.canonicalViolations,
  []
);

assert.deepEqual(
  projection.functionalWiringStatus,
  {
    canonicalSerialization:
      "WIRED",
    linkedCharacterHydration:
      "WIRED",
    linkedCharacterMechanicsAuthority:
      "WIRED",
    adHocRegistryOwnership:
      "WIRED",
  }
);

assert.deepEqual(
  projection.visualExtensionStatus,
  {
    linkedCharacterHydratedDisplay:
      "WIRED",
    unavailableReferenceRecovery:
      "WIRED",
    canonicalPersistenceAudit:
      "CANONICAL",
  }
);

assert.deepEqual(
  projection.architecture,
  {
    canonicalEntrySerializationOwnedByChassis: true,
    characterCandidateLoadingOwnedByChassis: true,
    linkedCharacterHydrationOwnedByChassis: true,
    characterReferenceMutationOwnedByChassis: true,
    registryPersistenceOwnedByChassis: true,
    linkedCharacterDisplayProjectionOwnedByFe: true,
    unavailableReferencePresentationOwnedByFe: true,
    adHocNpcPresentationOwnedByFe: true,
  }
);

const legacy =
  projectNpcRegistryLinkedCharacterAuthorityBinding(
    npcRegistryLinkedCharacterLegacyCopiedDescriptionFixture
  );

assert.equal(
  legacy.summary.canonicalViolationCount,
  1
);

assert.equal(
  legacy.summary.copiedDescriptionObservationCount,
  1
);

assert.deepEqual(
  legacy.persistenceContract.canonicalViolations,
  [
    {
      entryId:
        "person-legacy",
      forbiddenFieldsPresent: [
        "name",
        "hydratedCharacter",
        "actorMechanicsProfileId",
      ],
      missingRequiredFields: [],
    },
  ]
);

assert.equal(
  legacy.persistenceContract
    .copiedDescriptionObservations[0]
    .entryId,
  "person-legacy"
);

assert.match(
  legacy.persistenceContract
    .copiedDescriptionObservations[0]
    .message,
  /duplicate the hydrated Character description/i
);

const legacyDisplay =
  legacy.displayRegistry.entries[0];

assert.equal(
  legacyDisplay.name,
  "Current Character Name"
);

assert.equal(
  legacyDisplay.notes,
  "Copied Character description."
);

assert.equal(
  legacyDisplay.canonicalAudit.canonical,
  false
);

assert.equal(
  legacy.visualExtensionStatus.canonicalPersistenceAudit,
  "CHASSIS_CORRECTION_REQUIRED"
);

const source = fs.readFileSync(
  new URL(
    "./NpcRegistryLinkedCharacterAuthorityBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "serializeNpcRegistryEntry",
  "serializeNpcRegistryEntries",
  "hydrateNpcRegistryEntries",
  "fetchOwnedCreations",
  "setRegistry",
  "setEntryDraft",
  "saveEntryDraft",
  "buildNpcRegistryCreationPayload",
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
    "npc_registry_linked_character_authority_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    NPC_REGISTRY_LINKED_CHARACTER_AUTHORITY_BINDING_CONTRACT_VERSION,
  npcRegistryBuilderViewContractVersion:
    NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  canonicalCreationRefPersistenceShapeCovered: true,
  hydratedCurrentCharacterDisplayCovered: true,
  unavailableLinkedCharacterRecoveryCovered: true,
  linkedCharacterMechanicsAuthorityCovered: true,
  adHocRegistryOwnershipAndMechanicsAttachmentCovered: true,
  legacyCopiedCharacterDataDetectionCovered: true,
  currentBuilderViewCompatibilityCovered: true,
  linkedCharacterHydratedDisplayWired: true,
  unavailableLinkedCharacterRecoveryWired: true,
  npcRegistryBuilderViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  npcRegistryBuilderViewModelWiredToChassisAuthority: true,
  npcRegistryUtilsWiredToChassisAuthority: true,
  chassisSerializationHydrationMutationAndPersistenceExcludedFromBindingContract: true,
}, null, 2));
