import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_ROOM_NPC_PARTICIPANT_MANAGER_VIEW_CONTRACT_VERSION,
} from "../StoryRoomNpcParticipantManager.contract.js";

import {
  STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND,
  STORY_ROOM_NPC_PARTICIPANT_MANAGER_GRAPH_AUTHORITY_BINDING_CONTRACT_VERSION,
  STORY_ROOM_NPC_PARTICIPANT_SECTION_STATUSES,
  projectStoryRoomNpcParticipantManagerGraphAuthorityBinding,
} from "./StoryRoomNpcParticipantManagerGraphAuthorityBinding.contract.js";

import {
  storyRoomNpcParticipantManagerGraphAuthorityFixture,
  storyRoomNpcParticipantManagerNoRegistryFixture,
  storyRoomNpcParticipantManagerOnlyAdHocFixture,
} from "./StoryRoomNpcParticipantManagerGraphAuthorityBinding.fixtures.js";

assert.equal(
  STORY_ROOM_NPC_PARTICIPANT_MANAGER_GRAPH_AUTHORITY_BINDING_CONTRACT_VERSION,
  "story_room_npc_participant_manager_graph_authority_binding_v1"
);

assert.equal(
  STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND,
  "CREATION_REF"
);

assert.deepEqual(
  STORY_ROOM_NPC_PARTICIPANT_SECTION_STATUSES,
  [
    "LOADED",
    "PENDING",
    "AVAILABLE",
    "INACTIVE",
    "UNAVAILABLE",
  ]
);

const projection =
  projectStoryRoomNpcParticipantManagerGraphAuthorityBinding(
    storyRoomNpcParticipantManagerGraphAuthorityFixture
  );

assert.equal(
  projection.bindingContractVersion,
  STORY_ROOM_NPC_PARTICIPANT_MANAGER_GRAPH_AUTHORITY_BINDING_CONTRACT_VERSION
);

assert.equal(
  projection.participantManagerViewContractVersion,
  STORY_ROOM_NPC_PARTICIPANT_MANAGER_VIEW_CONTRACT_VERSION
);

assert.equal(
  projection.participantManagerViewContractVersion,
  "1.2.0"
);

assert.equal(
  projection.authority.includedKind,
  "CREATION_REF"
);

assert.equal(
  projection.authority.lightweightAdHocExcluded,
  true
);

assert.equal(
  projection.authority.excludedEntryCount,
  1
);

assert.deepEqual(
  projection.authority.excludedEntries,
  [
    {
      kind: "AD_HOC",
      name: "dev guy",
      entryId: "person-dev-guy",
    },
  ]
);

assert.equal(
  projection.authoritativeSections.length,
  5
);

const loaded = projection.authoritativeSections.find(
  (section) => section.id === "loaded"
);

assert.equal(loaded.entries.length, 2);
assert.equal(loaded.entries[0].name, "Mira Quill");
assert.equal(loaded.entries[0].hasAction, true);
assert.equal(loaded.entries[0].actionLabel, "Unload");
assert.equal(loaded.entries[1].name, "Kessa Cindervell");
assert.equal(loaded.entries[1].statusLabel, "Arriving");
assert.match(
  loaded.entries[1].statusDetail,
  /no knowledge of earlier scene events/i
);

const pending = projection.authoritativeSections.find(
  (section) => section.id === "pending"
);

assert.equal(pending.entries.length, 1);
assert.equal(pending.entries[0].name, "Lilith of Nod");
assert.match(
  pending.entries[0].pendingReason,
  /narrator marked Lilith as needed/i
);
assert.equal(pending.entries[0].actionLabel, "Load Now");

const available = projection.authoritativeSections.find(
  (section) => section.id === "available"
);

assert.equal(available.entries.length, 1);
assert.equal(available.entries[0].name, "Sable Marr");
assert.equal(available.entries[0].hasAction, true);

const inactive = projection.authoritativeSections.find(
  (section) => section.id === "inactive"
);

assert.equal(inactive.entries.length, 1);
assert.equal(inactive.entries[0].name, "Oren Vale");
assert.equal(inactive.entries[0].busy, true);
assert.equal(inactive.entries[0].busyLabel, "Reloading...");

const unavailable = projection.authoritativeSections.find(
  (section) => section.id === "unavailable"
);

assert.equal(unavailable.title, "Unavailable References");
assert.equal(unavailable.entries.length, 1);
assert.equal(
  unavailable.entries[0].name,
  "Linked Character unavailable"
);
assert.equal(unavailable.entries[0].statusLabel, "Unavailable");
assert.equal(unavailable.entries[0].hasAction, false);
assert.equal(unavailable.entries[0].disabled, true);
assert.equal(unavailable.entries[0].actionLabel, "");
assert.match(
  unavailable.entries[0].statusDetail,
  /authoritative creation graph/i
);

assert.equal(
  projection.summaryText,
  "1 present · 1 arriving · 1 pending · 1 unavailable"
);

assert.equal(
  projection.currentPortableViewProps.sections.length,
  5
);

assert.equal(
  projection.currentPortableViewProps.sections.some(
    (section) => section.id === "unavailable"
  ),
  true
);

const portableUnavailable =
  projection.currentPortableViewProps.sections.find(
    (section) => section.id === "unavailable"
  );

assert.equal(
  portableUnavailable.entries[0].hasAction,
  false
);

assert.equal(
  projection.currentPortableViewProps.sections.some((section) =>
    section.entries.some((entry) => entry.name === "dev guy")
  ),
  false
);

assert.equal(
  projection.unavailableReferences.count,
  1
);

assert.equal(
  projection.unavailableReferences.visualStatus,
  "WIRED"
);

assert.equal(
  projection.unavailableReferences.currentPortableViewLimitation,
  ""
);

assert.deepEqual(
  projection.functionalWiringStatus,
  {
    authoritativeCreationRefFiltering:
      "WIRED",
    unavailableReferenceSection:
      "WIRED",
    noActionUnavailableState:
      "WIRED",
    loadUnloadActionRouting:
      "WIRED",
  }
);

assert.deepEqual(
  projection.visualExtensionStatus,
  {
    authoritativeCreationRefFiltering:
      "WIRED",
    unavailableReferenceSection:
      "WIRED",
  }
);

const onlyAdHoc =
  projectStoryRoomNpcParticipantManagerGraphAuthorityBinding(
    storyRoomNpcParticipantManagerOnlyAdHocFixture
  );

assert.equal(
  onlyAdHoc.authority.excludedEntryCount,
  1
);
assert.equal(
  onlyAdHoc.authoritativeSections.every(
    (section) => section.entries.length === 0
  ),
  true
);
assert.equal(
  onlyAdHoc.registryNotice,
  "The attached NPC Registries do not contain any authoritative linked Character entries."
);

const noRegistry =
  projectStoryRoomNpcParticipantManagerGraphAuthorityBinding(
    storyRoomNpcParticipantManagerNoRegistryFixture
  );

assert.equal(
  noRegistry.registryNotice,
  "No NPC Registry is attached to this Story or active Location."
);

assert.deepEqual(
  projection.architecture,
  {
    registryGraphResolutionOwnedByChassis: true,
    linkedCharacterAvailabilityOwnedByChassis: true,
    loadUnloadMutationOwnedByChassis: true,
    opaqueActionIdentityOwnedByChassis: true,
    lightweightNpcLifecycleSeparateFromParticipantManager: true,
    authoritativeKindFilteringOwnedByFePresentationBinding: true,
    unavailableReferencePresentationOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./StoryRoomNpcParticipantManagerGraphAuthorityBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "loadNpc",
  "unloadNpc",
  "fetchNpc",
  "registryGraphResolver",
  "resolveCreationGraph",
  "setIsOpen",
  "setRegistryNpcs",
  "useStoryRoomChat",
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
    "story_room_npc_participant_manager_graph_authority_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STORY_ROOM_NPC_PARTICIPANT_MANAGER_GRAPH_AUTHORITY_BINDING_CONTRACT_VERSION,
  participantManagerViewContractVersion:
    STORY_ROOM_NPC_PARTICIPANT_MANAGER_VIEW_CONTRACT_VERSION,
  creationRefOnlyAuthorityCovered: true,
  lightweightAdHocExclusionCovered: true,
  loadedPendingAvailableInactiveSectionsCovered: true,
  unavailableReferenceRecoveryStateCovered: true,
  noActionUnavailableStateCovered: true,
  arrivalAndPendingReasonPresentationCovered: true,
  currentPortableViewCompatibilityCovered: true,
  authoritativeCreationRefFilteringWired: true,
  unavailableReferenceSectionWired: true,
  noActionUnavailableStateWired: true,
  participantManagerViewContractVersion12Wired: true,
  participantManagerViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  participantManagerViewModelWiredToChassisAuthority: true,
  chassisGraphResolutionAndLoadUnloadMutationExcludedFromBindingContract: true,
}, null, 2));
