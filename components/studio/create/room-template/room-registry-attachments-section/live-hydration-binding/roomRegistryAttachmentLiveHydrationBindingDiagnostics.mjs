import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ROOM_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION,
} from "../RoomRegistryAttachmentsSection.contract.js";

import {
  ROOM_REGISTRY_ATTACHMENT_GROUPS,
  ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES,
  ROOM_REGISTRY_ATTACHMENT_LIVE_HYDRATION_BINDING_CONTRACT_VERSION,
  projectRoomRegistryAttachmentLiveHydrationBinding,
} from "./RoomRegistryAttachmentLiveHydrationBinding.contract.js";

import {
  roomRegistryAttachmentHydrationBoundLinksFixture,
  roomRegistryAttachmentHydrationBoundRegistriesFixture,
  roomRegistryAttachmentHydrationLegacyIdsOnlyFixture,
  roomRegistryAttachmentHydrationLiveCreationsFixture,
} from "./RoomRegistryAttachmentLiveHydrationBinding.fixtures.js";

assert.equal(
  ROOM_REGISTRY_ATTACHMENT_LIVE_HYDRATION_BINDING_CONTRACT_VERSION,
  "room_registry_attachment_live_hydration_binding_v1"
);

assert.deepEqual(
  ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES,
  {
    LIVE_CREATION:
      "LIVE_CREATION",
    STORED_REFERENCE:
      "STORED_REFERENCE",
  }
);

assert.deepEqual(
  ROOM_REGISTRY_ATTACHMENT_GROUPS.map(
    (group) => [
      group.id,
      group.idsField,
      group.allowedTypes[0],
    ]
  ),
  [
    [
      "eventRegistries",
      "eventRegistryIds",
      "EVENT_REGISTRY",
    ],
    [
      "questRegistries",
      "questRegistryIds",
      "QUEST_REGISTRY",
    ],
    [
      "npcRegistries",
      "npcRegistryIds",
      "NPC_REGISTRY",
    ],
    [
      "itemRegistries",
      "itemRegistryIds",
      "ITEM_REGISTRY",
    ],
    [
      "locationRegistries",
      "locationRegistryIds",
      "LOCATION_REGISTRY",
    ],
    [
      "factionRegistries",
      "factionRegistryIds",
      "FACTION_REGISTRY",
    ],
    [
      "organizationRegistries",
      "organizationRegistryIds",
      "ORGANIZATION_REGISTRY",
    ],
  ]
);

const projection =
  projectRoomRegistryAttachmentLiveHydrationBinding({
    boundRegistries:
      roomRegistryAttachmentHydrationBoundRegistriesFixture,

    boundRegistryLinks:
      roomRegistryAttachmentHydrationBoundLinksFixture,

    liveRegistryCreationsById:
      roomRegistryAttachmentHydrationLiveCreationsFixture,
  });

assert.equal(
  projection.bindingContractVersion,
  ROOM_REGISTRY_ATTACHMENT_LIVE_HYDRATION_BINDING_CONTRACT_VERSION
);

assert.equal(
  projection.attachmentsSectionViewContractVersion,
  ROOM_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION
);

assert.equal(
  projection.attachmentsSectionViewContractVersion,
  "1.1.0"
);

assert.deepEqual(
  projection.requestedCreationIds,
  [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
    "33333333-3333-4333-8333-333333333333",
  ]
);

assert.deepEqual(
  projection.summary,
  {
    attachmentCount: 3,
    liveHydratedCount: 2,
    storedFallbackCount: 1,
  }
);

const eventAttachment =
  projection.groups
    .find(
      (group) =>
        group.id ===
        "eventRegistries"
    )
    .attachments[0];

assert.equal(
  eventAttachment.title,
  "Crescent Market Events"
);

assert.equal(
  eventAttachment.typeLabel,
  "EVENT_REGISTRY"
);

assert.equal(
  eventAttachment.description,
  "Live Event Registry description."
);

assert.equal(
  eventAttachment.imageUrl,
  "https://example.test/live-event.webp"
);

assert.equal(
  eventAttachment.notes,
  "Story event notes stay on the attachment."
);

assert.deepEqual(
  eventAttachment.hydration,
  {
    source: "LIVE_CREATION",
    liveResolved: true,
    storedReferencePreserved: true,
    liveCreationId:
      "11111111-1111-4111-8111-111111111111",
    fallbackReason: "",
  }
);

const npcAttachment =
  projection.groups
    .find(
      (group) =>
        group.id ===
        "npcRegistries"
    )
    .attachments[0];

assert.equal(
  npcAttachment.title,
  "Brasswhisker People"
);

assert.equal(
  npcAttachment.typeLabel,
  "NPC_REGISTRY"
);

// Live null description falls back to the stored snapshot.
assert.equal(
  npcAttachment.description,
  "Stored NPC description."
);

assert.equal(
  npcAttachment.imageUrl,
  "https://example.test/live-npc.webp"
);

assert.equal(
  npcAttachment.notes,
  "NPC note remains local to this Story attachment."
);

const locationAttachment =
  projection.groups
    .find(
      (group) =>
        group.id ===
        "locationRegistries"
    )
    .attachments[0];

assert.equal(
  locationAttachment.title,
  "Stored Location Registry Title"
);

assert.equal(
  locationAttachment.typeLabel,
  "LOCATION_REGISTRY"
);

assert.equal(
  locationAttachment.description,
  "Stored location fallback."
);

assert.equal(
  locationAttachment.imageUrl,
  "https://example.test/stored-location.webp"
);

assert.equal(
  locationAttachment.hydration.source,
  "STORED_REFERENCE"
);

assert.equal(
  locationAttachment.hydration.liveResolved,
  false
);

assert.equal(
  locationAttachment.hydration.storedReferencePreserved,
  true
);

assert.match(
  locationAttachment.hydration.fallbackReason,
  /live Registry Creation was not returned by the Chassis hydration pass/i
);

assert.equal(
  projection.currentPortableViewProps.groups.length,
  7
);

assert.deepEqual(
  projection.currentPortableViewProps.groups
    .find(
      (group) =>
        group.id ===
        "eventRegistries"
    )
    .attachments[0],
  {
    id: "link-event",
    title:
      "Crescent Market Events",
    typeLabel:
      "EVENT_REGISTRY",
    description:
      "Live Event Registry description.",
    imageUrl:
      "https://example.test/live-event.webp",
    notes:
      "Story event notes stay on the attachment.",
    hydrationSource:
      "LIVE_CREATION",
    hydrationSourceLabel:
      "Live Registry",
    hydrationSourceTone:
      "LIVE",
    hydrationMessage:
      "Showing current Registry title, type, description, and image from the live Creation.",
    removeAriaLabel:
      "Remove attached registry",
  }
);

assert.deepEqual(
  projection.functionalWiringStatus,
  {
    liveHydrationBehavior:
      "WIRED",
    currentPortableViewCompatibility:
      "WIRED",
    storedReferenceFallbackBehavior:
      "WIRED",
    hydrationSourcePresentation:
      "WIRED",
    degradedFallbackPresentation:
      "WIRED",
  }
);

assert.deepEqual(
  projection.visualExtensionStatus,
  {
    liveHydrationSourceIndicator:
      "WIRED",
    storedFallbackIndicator:
      "WIRED",
  }
);

assert.deepEqual(
  projection.architecture,
  {
    attachedCreationIdCollectionOwnedByChassis: true,
    liveRegistryFetchOwnedByChassis: true,
    parallelFetchSettlingOwnedByChassis: true,
    liveCreationMapOwnedByChassis: true,
    registryMutationOwnedByChassis: true,
    storyPersistenceOwnedByChassis: true,
    hydratedDisplayProjectionOwnedByFe: true,
    storedReferenceFallbackOwnedByFe: true,
  }
);

const legacy =
  projectRoomRegistryAttachmentLiveHydrationBinding(
    roomRegistryAttachmentHydrationLegacyIdsOnlyFixture
  );

assert.deepEqual(
  legacy.requestedCreationIds,
  [
    "44444444-4444-4444-8444-444444444444",
  ]
);

const legacyQuest =
  legacy.groups
    .find(
      (group) =>
        group.id ===
        "questRegistries"
    )
    .attachments[0];

assert.equal(
  legacyQuest.id,
  "legacy_44444444-4444-4444-8444-444444444444"
);

assert.equal(
  legacyQuest.creationId,
  "44444444-4444-4444-8444-444444444444"
);

assert.equal(
  legacyQuest.title,
  "Brasswhisker Quests"
);

assert.equal(
  legacyQuest.typeLabel,
  "QUEST_REGISTRY"
);

assert.equal(
  legacyQuest.hydration.source,
  "LIVE_CREATION"
);

const source = fs.readFileSync(
  new URL(
    "./RoomRegistryAttachmentLiveHydrationBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "fetchOwnedCreation",
  "Promise.allSettled",
  "setLiveRegistryCreationsById",
  "useEffect(",
  "useMemo(",
  "useState(",
  "handleSelectRegistry",
  "removeRegistry(",
  "changeRegistryNotes(",
  "updateDataField",
  "createLinkedCreationLink",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "room_registry_attachment_live_hydration_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    ROOM_REGISTRY_ATTACHMENT_LIVE_HYDRATION_BINDING_CONTRACT_VERSION,
  attachmentsSectionViewContractVersion:
    ROOM_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION,
  sevenRegistryGroupsCovered: true,
  attachedCreationIdCollectionProjectionCovered: true,
  liveTitleTypeDescriptionImageOverrideCovered: true,
  storedNotesPreservedCovered: true,
  storedFallbackOnMissingLiveCreationCovered: true,
  legacyIdOnlyAttachmentHydrationCovered: true,
  currentPortableViewCompatibilityCovered: true,
  liveHydrationFunctionalWiringStatus: "WIRED",
  hydrationSourcePresentationWired: true,
  degradedFallbackPresentationWired: true,
  attachmentsViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  attachmentsViewModelWiredToChassisAuthority: true,
  chassisFetchSettlingMutationAndPersistenceExcludedFromBindingContract: true,
}, null, 2));
