import assert from "node:assert/strict";
import fs from "node:fs";

import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../LocationRegistryBuilder.contract.js";

import {
  LOCATION_REGISTRY_PRESENCE_CALLBACK_KEYS,
  LOCATION_REGISTRY_PRESENCE_DUAL_AUTHORITY_BINDING_CONTRACT_VERSION,
  LOCATION_REGISTRY_PRESENCE_PERSON_KINDS,
  LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES,
  projectLocationRegistryPresenceDualAuthorityBinding,
} from "./LocationRegistryPresenceDualAuthorityBinding.contract.js";

import {
  locationRegistryPresenceAdHocNpcEntryFixture,
  locationRegistryPresenceDirectCharacterFixture,
  locationRegistryPresenceLegacyNpcEntryFixture,
  locationRegistryPresenceLinkedNpcEntryFixture,
  locationRegistryPresenceUnavailableCharacterFixture,
  locationRegistryPresenceUnavailableNpcEntryFixture,
  locationRegistryPresenceUnresolvedFixture,
} from "./LocationRegistryPresenceDualAuthorityBinding.fixtures.js";

assert.equal(
  LOCATION_REGISTRY_PRESENCE_DUAL_AUTHORITY_BINDING_CONTRACT_VERSION,
  "location_registry_presence_dual_authority_binding_v1"
);

assert.deepEqual(
  LOCATION_REGISTRY_PRESENCE_PERSON_KINDS,
  {
    CREATION_REF: "CREATION_REF",
    NPC_REGISTRY_ENTRY:
      "NPC_REGISTRY_ENTRY",
    LEGACY_NPC_REGISTRY_ENTRY:
      "LEGACY_NPC_REGISTRY_ENTRY",
  }
);

assert.deepEqual(
  LOCATION_REGISTRY_PRESENCE_REFERENCE_STATUSES,
  {
    RESOLVED: "RESOLVED",
    UNRESOLVED: "UNRESOLVED",
    UNAVAILABLE: "UNAVAILABLE",
    LEGACY_UNRESOLVED:
      "LEGACY_UNRESOLVED",
  }
);

const direct =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceDirectCharacterFixture
  );

assert.equal(
  direct.bindingContractVersion,
  LOCATION_REGISTRY_PRESENCE_DUAL_AUTHORITY_BINDING_CONTRACT_VERSION
);

assert.equal(
  direct.locationRegistryBuilderViewContractVersion,
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  direct.locationRegistryBuilderViewContractVersion,
  "location-registry-builder.view.v1"
);

assert.deepEqual(
  direct.selectedPerson,
  {
    visible: true,
    displayName:
      "Kessa Cindervell",
    subtitle: "Character",
    kind: "CREATION_REF",
    entryKind: "",
    creationId:
      "11111111-1111-4111-8111-111111111111",
    creationType: "CHARACTER",
    registryCreationId: "",
    registryEntryId: "",
    registryTitle: "",
    contentRating: "SFW",
    visibility: "PRIVATE",
    status: "DRAFT",
    referenceStatus: "RESOLVED",
    recovery: null,
  }
);

assert.equal(
  direct.pickerSections.character.eyebrow,
  "Character"
);

assert.equal(
  direct.pickerSections.character.description,
  "Select a full Character directly. The Location Registry stores the Character UUID and the authored presence rule."
);

assert.equal(
  direct.pickerSections.character.searchPlaceholder,
  "Search Character creations..."
);

assert.deepEqual(
  direct.pickerSections.character.selectedIds,
  [
    "11111111-1111-4111-8111-111111111111",
  ]
);

assert.deepEqual(
  direct.pickerSections.character.disabledIds,
  [
    "22222222-2222-4222-8222-222222222222",
  ]
);

assert.equal(
  direct.pickerSections.character.options.length,
  2
);

assert.equal(
  direct.pickerSections.character.options[0].type,
  "CHARACTER"
);

assert.equal(
  direct.pickerSections.npcRegistry.eyebrow,
  "NPC Registry"
);

assert.equal(
  direct.pickerSections.npcRegistry.description,
  "Select a stable NPC Registry entry. Lightweight / ad-hoc NPCs stay registry-owned and do not need to become Character creations."
);

assert.equal(
  direct.pickerSections.npcRegistry.searchPlaceholder,
  "Search NPC Registry entries..."
);

assert.equal(
  direct.pickerSections.npcRegistry.options.length,
  2
);

const linkedNpc =
  direct.pickerSections.npcRegistry.options[0];

assert.equal(
  linkedNpc.entryKind,
  "CREATION_REF"
);

assert.equal(
  linkedNpc.type,
  "CHARACTER"
);

assert.equal(
  linkedNpc.subtitle,
  "Dev NPC Registry · Linked Character"
);

const lightweight =
  direct.pickerSections.npcRegistry.options[1];

assert.equal(
  lightweight.entryKind,
  "AD_HOC"
);

assert.equal(
  lightweight.type,
  "LIGHTWEIGHT_NPC"
);

assert.equal(
  lightweight.subtitle,
  "Dev NPC Registry · Lightweight NPC"
);

assert.deepEqual(
  lightweight.aliases,
  ["Customer"]
);

const adHoc =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceAdHocNpcEntryFixture
  );

assert.equal(
  adHoc.selectedPerson.kind,
  "NPC_REGISTRY_ENTRY"
);

assert.equal(
  adHoc.selectedPerson.entryKind,
  "AD_HOC"
);

assert.equal(
  adHoc.selectedPerson.subtitle,
  "Dev NPC Registry · Lightweight NPC"
);

assert.deepEqual(
  adHoc.pickerSections.npcRegistry.selectedIds,
  [
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:person-shopper",
  ]
);

assert.equal(
  adHoc.authority.lightweightAdHocNpcRegistryEntriesSelectable,
  true
);

const linked =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceLinkedNpcEntryFixture
  );

assert.equal(
  linked.selectedPerson.entryKind,
  "CREATION_REF"
);

assert.equal(
  linked.selectedPerson.subtitle,
  "Dev NPC Registry · Linked Character Entry"
);

assert.equal(
  linked.selectedPerson.creationType,
  "CHARACTER"
);

const unavailableCharacter =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceUnavailableCharacterFixture
  );

assert.equal(
  unavailableCharacter.selectedPerson.referenceStatus,
  "UNAVAILABLE"
);

assert.equal(
  unavailableCharacter.selectedPerson.recovery.degraded,
  true
);

assert.equal(
  unavailableCharacter.selectedPerson.recovery.tone,
  "ERROR"
);

assert.equal(
  unavailableCharacter.selectedPerson.recovery.title,
  "Linked Character unavailable"
);

assert.match(
  unavailableCharacter.selectedPerson.recovery.message,
  /stored Character UUID is preserved/i
);

const unavailableNpc =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceUnavailableNpcEntryFixture
  );

assert.equal(
  unavailableNpc.selectedPerson.recovery.title,
  "NPC Registry entry unavailable"
);

assert.match(
  unavailableNpc.selectedPerson.recovery.message,
  /stored NPC Registry entry identity is preserved/i
);

const legacy =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceLegacyNpcEntryFixture
  );

assert.equal(
  legacy.selectedPerson.kind,
  "LEGACY_NPC_REGISTRY_ENTRY"
);

assert.equal(
  legacy.selectedPerson.referenceStatus,
  "LEGACY_UNRESOLVED"
);

assert.equal(
  legacy.selectedPerson.recovery.tone,
  "WARNING"
);

assert.equal(
  legacy.selectedPerson.recovery.title,
  "Legacy NPC Registry reference unavailable"
);

assert.match(
  legacy.selectedPerson.recovery.message,
  /preserved/i
);

assert.match(
  legacy.selectedPerson.recovery.message,
  /repair the binding/i
);

const unresolved =
  projectLocationRegistryPresenceDualAuthorityBinding(
    locationRegistryPresenceUnresolvedFixture
  );

assert.equal(
  unresolved.selectedPerson.referenceStatus,
  "UNRESOLVED"
);

assert.equal(
  unresolved.selectedPerson.recovery.degraded,
  false
);

assert.equal(
  unresolved.selectedPerson.recovery.title,
  "Character selection required"
);

assert.match(
  unresolved.selectedPerson.recovery.message,
  /either a full Character or a stable NPC Registry entry/i
);

assert.deepEqual(
  direct.authority,
  {
    directCharacterKind:
      "CREATION_REF",
    registryEntryKind:
      "NPC_REGISTRY_ENTRY",
    lightweightAdHocNpcRegistryEntriesSelectable:
      true,
    linkedCharacterNpcRegistryEntriesSelectable:
      true,
    playerCharacterNpcRegistryEntriesExpectedFromChassis:
      false,
    candidateLoadingOwnedByChassis:
      true,
    hydrationOwnedByChassis:
      true,
    identityDuplicateGuardOwnedByChassis:
      true,
    persistenceOwnedByChassis:
      true,
  }
);

assert.deepEqual(
  LOCATION_REGISTRY_PRESENCE_CALLBACK_KEYS,
  [
    "onApplyCharacter",
    "onApplyNpcEntry",
  ]
);

assert.deepEqual(
  direct.applicationWiringStatus,
  {
    sharedLocationRegistryFoundation: "WIRED",
    characterCandidateLoading: "WIRED",
    npcRegistryEntryCandidateLoading: "WIRED",
    presenceHydration: "WIRED",
    identityDuplicateGuard: "WIRED",
    persistenceMutation: "WIRED",
  }
);

assert.deepEqual(
  direct.visualExtensionStatus,
  {
    dualCharacterAndNpcRegistryPicker: "WIRED",
    selectedPersonCard: "WIRED",
    degradedReferenceRecovery: "WIRED",
  }
);

assert.equal(
  unavailableCharacter.visualExtensionStatus.degradedReferenceRecovery,
  "WIRED"
);
assert.equal(
  unavailableNpc.visualExtensionStatus.degradedReferenceRecovery,
  "WIRED"
);
assert.equal(
  legacy.visualExtensionStatus.degradedReferenceRecovery,
  "WIRED"
);

const source = fs.readFileSync(
  new URL(
    "./LocationRegistryPresenceDualAuthorityBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "fetchLocationRegistryCharacterOptions",
  "fetchOwnedCreations",
  "normalizeLocationRegistryCharacterOptions",
  "normalizeLocationRegistryNpcEntryOptions",
  "hydrateLocationRegistryPresenceBindings",
  "getPresencePersonIdentityKey",
  "applyCharacterToPresenceBindingDraft",
  "applyNpcEntryToPresenceBindingDraft",
  "savePresenceBindingDraft",
  "setPresenceBindingDraft",
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
    "location_registry_presence_dual_authority_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    LOCATION_REGISTRY_PRESENCE_DUAL_AUTHORITY_BINDING_CONTRACT_VERSION,
  locationRegistryBuilderViewContractVersion:
    LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  directCharacterCreationRefCovered: true,
  npcRegistryLinkedCharacterEntryCovered: true,
  npcRegistryLightweightAdHocEntryCovered: true,
  unavailableCharacterRecoveryCovered: true,
  unavailableNpcRegistryEntryRecoveryCovered: true,
  legacyNpcRegistryRecoveryCovered: true,
  dualPickerSourceCopyCovered: true,
  disabledIdentityProjectionCovered: true,
  playerCharacterCandidateExclusionRemainsChassisOwned: true,
  sharedLocationRegistryApplicationFoundationWired: true,
  characterAndNpcCandidateLoadingWired: true,
  presenceHydrationAndDuplicateGuardWired: true,
  dualCharacterAndNpcRegistryPickerWired: true,
  selectedPersonCardWired: true,
  degradedReferenceRecoveryWired: true,
  locationRegistryBuilderViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  locationRegistryBuilderViewModelWiredToChassisAuthority: true,
  chassisLoadingHydrationDuplicateGuardAndPersistenceExcludedFromBindingContract: true,
}, null, 2));
