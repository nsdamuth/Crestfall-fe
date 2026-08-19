import {
  ROOM_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION,
} from "../RoomRegistryAttachmentsSection.contract.js";

export const ROOM_REGISTRY_ATTACHMENT_LIVE_HYDRATION_BINDING_CONTRACT_VERSION =
  "room_registry_attachment_live_hydration_binding_v1";

export const ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES = Object.freeze({
  LIVE_CREATION: "LIVE_CREATION",
  STORED_REFERENCE: "STORED_REFERENCE",
});

export const ROOM_REGISTRY_ATTACHMENT_GROUPS = Object.freeze([
  Object.freeze({
    id: "eventRegistries",
    idsField: "eventRegistryIds",
    label: "Event Registries",
    addLabel: "Attach Event Registry",
    emptyLabel: "No Event Registries attached.",
    allowedTypes: Object.freeze(["EVENT_REGISTRY"]),
    body:
      "Story-specific events, gatherings, incidents, festivals, markets, background happenings, and timed scene flavor available to the narrator runtime. These override inherited Location Event Registries.",
  }),
  Object.freeze({
    id: "questRegistries",
    idsField: "questRegistryIds",
    label: "Quest Registries",
    addLabel: "Attach Quest Registry",
    emptyLabel: "No Quest Registries attached.",
    allowedTypes: Object.freeze(["QUEST_REGISTRY"]),
    body:
      "Story-specific side threads, investigations, hooks, branches, objectives, and optional quest spines available to the narrator runtime. These override inherited Location Quest Registries.",
  }),
  Object.freeze({
    id: "npcRegistries",
    idsField: "npcRegistryIds",
    label: "NPC Registries",
    addLabel: "Attach NPC Registry",
    emptyLabel: "No NPC Registries attached.",
    allowedTypes: Object.freeze(["NPC_REGISTRY"]),
    body:
      "Named NPCs, aliases, roles, relationships, knowledge boundaries, common locations, and authored character references available throughout this Story.",
  }),
  Object.freeze({
    id: "itemRegistries",
    idsField: "itemRegistryIds",
    label: "Item Registries",
    addLabel: "Attach Item Registry",
    emptyLabel: "No Item Registries attached.",
    allowedTypes: Object.freeze(["ITEM_REGISTRY"]),
    body:
      "Authored items, aliases, ownership guidance, behavior, and reusable item definitions that may be instantiated and tracked within this Story.",
  }),
  Object.freeze({
    id: "locationRegistries",
    idsField: "locationRegistryIds",
    label: "Location Registries",
    addLabel: "Attach Location Registry",
    emptyLabel: "No Location Registries attached.",
    allowedTypes: Object.freeze(["LOCATION_REGISTRY"]),
    body:
      "Defined locations, aliases, hierarchy, adjacency, travel routes, access rules, and navigation relationships available throughout this Story.",
  }),
  Object.freeze({
    id: "factionRegistries",
    idsField: "factionRegistryIds",
    label: "Faction Registries",
    addLabel: "Attach Faction Registry",
    emptyLabel: "No Faction Registries attached.",
    allowedTypes: Object.freeze(["FACTION_REGISTRY"]),
    body:
      "Faction identities, alliances, rivalries, territory, membership, influence, and strategic relationships available to this Story.",
  }),
  Object.freeze({
    id: "organizationRegistries",
    idsField: "organizationRegistryIds",
    label: "Organization Registries",
    addLabel: "Attach Organization Registry",
    emptyLabel: "No Organization Registries attached.",
    allowedTypes: Object.freeze(["ORGANIZATION_REGISTRY"]),
    body:
      "Organizations, internal structures, leadership, facilities, responsibilities, and institutional relationships available to this Story.",
  }),
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeImageUrl(value) {
  return text(
    value?.imageUrl ??
    value?.image_url
  );
}

function attachmentId(link = {}, index = 0) {
  return text(link.id) ||
    text(link.creationId) ||
    `attachment_${index}`;
}

function normalizeStoredAttachment(link = {}) {
  const source = object(link);

  return {
    id: text(source.id),
    creationId: text(source.creationId),
    title: text(source.title),
    type: text(source.type),
    description: text(source.description),
    imageUrl: normalizeImageUrl(source),
    notes: text(source.notes),
  };
}

function projectAttachment({
  link,
  index,
  liveRegistryCreationsById,
} = {}) {
  const stored = normalizeStoredAttachment(link);
  const liveCreation = object(
    liveRegistryCreationsById?.[
      stored.creationId
    ]
  );

  const liveResolved =
    Boolean(
      stored.creationId &&
      text(liveCreation.id)
    );

  return {
    id:
      attachmentId(stored, index),

    creationId:
      stored.creationId,

    title:
      text(liveCreation.title) ||
      stored.title ||
      "Attached Registry",

    typeLabel:
      text(liveCreation.type) ||
      stored.type ||
      "Registry",

    description:
      liveResolved
        ? (
            liveCreation.description === null ||
            liveCreation.description === undefined
              ? stored.description
              : String(liveCreation.description)
          )
        : stored.description,

    imageUrl:
      normalizeImageUrl(liveCreation) ||
      stored.imageUrl,

    notes:
      stored.notes,

    removeAriaLabel:
      "Remove attached registry",

    hydration: {
      source:
        liveResolved
          ? ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES.LIVE_CREATION
          : ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES.STORED_REFERENCE,

      liveResolved,

      storedReferencePreserved:
        true,

      liveCreationId:
        liveResolved
          ? text(liveCreation.id)
          : "",

      fallbackReason:
        liveResolved
          ? ""
          : (
              stored.creationId
                ? "The live Registry Creation was not returned by the Chassis hydration pass, so the stored attachment snapshot remains visible."
                : "This attachment has no Registry Creation ID, so only the stored attachment snapshot can be displayed."
            ),
    },
  };
}

function normalizeGroupLinks({
  group,
  boundRegistries,
  boundRegistryLinks,
} = {}) {
  const mirroredLinks =
    array(
      object(boundRegistryLinks)[
        group.id
      ]
    );

  if (mirroredLinks.length > 0) {
    return mirroredLinks;
  }

  return array(
    object(boundRegistries)[
      group.idsField
    ]
  )
    .map(text)
    .filter(Boolean)
    .map((creationId) => ({
      id:
        `legacy_${creationId}`,
      creationId,
      title: creationId,
      type: "REGISTRY",
      description: "",
      imageUrl: "",
      notes: "",
    }));
}

function dedupe(values) {
  return [
    ...new Set(
      array(values)
        .map(text)
        .filter(Boolean)
    ),
  ];
}

export function projectRoomRegistryAttachmentLiveHydrationBinding({
  boundRegistries = {},
  boundRegistryLinks = {},
  liveRegistryCreationsById = {},
  onOpenRegistryPicker = null,
  onRemoveRegistry = null,
  onChangeRegistryNotes = null,
  eyebrow = "Story Registries",
  title = "Registry Attachments",
  body =
    "Attach registries directly to this Story. Story registries take priority over inherited Location registries of the same kind.",
} = {}) {
  const groups =
    ROOM_REGISTRY_ATTACHMENT_GROUPS.map(
      (group) => ({
        id: group.id,
        label: group.label,
        body: group.body,
        addLabel: group.addLabel,
        emptyLabel: group.emptyLabel,
        allowedTypes:
          [...group.allowedTypes],

        attachments:
          normalizeGroupLinks({
            group,
            boundRegistries,
            boundRegistryLinks,
          }).map((link, index) =>
            projectAttachment({
              link,
              index,
              liveRegistryCreationsById,
            })
          ),
      })
    );

  const attachments =
    groups.flatMap(
      (group) =>
        group.attachments
    );

  const requestedCreationIds =
    dedupe(
      attachments.map(
        (attachment) =>
          attachment.creationId
      )
    );

  const liveHydratedCount =
    attachments.filter(
      (attachment) =>
        attachment.hydration.source ===
        ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES.LIVE_CREATION
    ).length;

  const storedFallbackCount =
    attachments.length -
    liveHydratedCount;

  const currentPortableViewGroups =
    groups.map((group) => ({
      id: group.id,
      label: group.label,
      body: group.body,
      addLabel: group.addLabel,
      emptyLabel: group.emptyLabel,
      attachments:
        group.attachments.map(
          (attachment) => ({
            id: attachment.id,
            title: attachment.title,
            typeLabel:
              attachment.typeLabel,
            description:
              attachment.description,
            imageUrl:
              attachment.imageUrl,
            notes:
              attachment.notes,
            hydrationSource:
              attachment.hydration.source,
            hydrationSourceLabel:
              attachment.hydration.source ===
              ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES.LIVE_CREATION
                ? "Live Registry"
                : "Stored Snapshot",
            hydrationSourceTone:
              attachment.hydration.source ===
              ROOM_REGISTRY_ATTACHMENT_HYDRATION_SOURCES.LIVE_CREATION
                ? "LIVE"
                : "FALLBACK",
            hydrationMessage:
              attachment.hydration.liveResolved
                ? "Showing current Registry title, type, description, and image from the live Creation."
                : attachment.hydration.fallbackReason,
            removeAriaLabel:
              attachment.removeAriaLabel,
          })
        ),
    }));

  return {
    bindingContractVersion:
      ROOM_REGISTRY_ATTACHMENT_LIVE_HYDRATION_BINDING_CONTRACT_VERSION,

    attachmentsSectionViewContractVersion:
      ROOM_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION,

    requestedCreationIds,

    groups,

    summary: {
      attachmentCount:
        attachments.length,
      liveHydratedCount,
      storedFallbackCount,
    },

    currentPortableViewProps: {
      eyebrow,
      title,
      body,
      groups:
        currentPortableViewGroups,
      onOpenRegistryPicker:
        onOpenRegistryPicker || null,
      onRemoveRegistry:
        onRemoveRegistry || null,
      onChangeRegistryNotes:
        onChangeRegistryNotes || null,
    },

    functionalWiringStatus: {
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
    },

    visualExtensionStatus: {
      liveHydrationSourceIndicator:
        "WIRED",
      storedFallbackIndicator:
        "WIRED",
    },

    architecture: {
      attachedCreationIdCollectionOwnedByChassis: true,
      liveRegistryFetchOwnedByChassis: true,
      parallelFetchSettlingOwnedByChassis: true,
      liveCreationMapOwnedByChassis: true,
      registryMutationOwnedByChassis: true,
      storyPersistenceOwnedByChassis: true,
      hydratedDisplayProjectionOwnedByFe: true,
      storedReferenceFallbackOwnedByFe: true,
    },
  };
}
