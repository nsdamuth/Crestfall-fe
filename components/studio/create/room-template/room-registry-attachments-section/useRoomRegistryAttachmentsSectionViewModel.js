"use client";

import { useEffect, useMemo, useState } from "react";

import { createLinkedCreationLink } from "@/components/studio/registries/structuredRegistryUtils";
import { fetchOwnedCreation } from "@/lib/client/studio/creations/creationClient";

const REGISTRY_GROUPS = [
  {
    id: "eventRegistries",
    idsField: "eventRegistryIds",
    label: "Event Registries",
    pickerTitle: "Attach Event Registries",
    addLabel: "Attach Event Registry",
    emptyLabel: "No Event Registries attached.",
    allowedTypes: ["EVENT_REGISTRY"],
    body:
      "Story-specific events, gatherings, incidents, festivals, markets, background happenings, and timed scene flavor available to the narrator runtime. These override inherited Location Event Registries.",
  },
  {
    id: "questRegistries",
    idsField: "questRegistryIds",
    label: "Quest Registries",
    pickerTitle: "Attach Quest Registries",
    addLabel: "Attach Quest Registry",
    emptyLabel: "No Quest Registries attached.",
    allowedTypes: ["QUEST_REGISTRY"],
    body:
      "Story-specific side threads, investigations, hooks, branches, objectives, and optional quest spines available to the narrator runtime. These override inherited Location Quest Registries.",
  },
  {
    id: "npcRegistries",
    idsField: "npcRegistryIds",
    label: "NPC Registries",
    pickerTitle: "Attach NPC Registries",
    addLabel: "Attach NPC Registry",
    emptyLabel: "No NPC Registries attached.",
    allowedTypes: ["NPC_REGISTRY"],
    body:
      "Named NPCs, aliases, roles, relationships, knowledge boundaries, common locations, and authored character references available throughout this Story.",
  },
  {
    id: "itemRegistries",
    idsField: "itemRegistryIds",
    label: "Item Registries",
    pickerTitle: "Attach Item Registries",
    addLabel: "Attach Item Registry",
    emptyLabel: "No Item Registries attached.",
    allowedTypes: ["ITEM_REGISTRY"],
    body:
      "Authored items, aliases, ownership guidance, behavior, and reusable item definitions that may be instantiated and tracked within this Story.",
  },
  {
    id: "locationRegistries",
    idsField: "locationRegistryIds",
    label: "Location Registries",
    pickerTitle: "Attach Location Registries",
    addLabel: "Attach Location Registry",
    emptyLabel: "No Location Registries attached.",
    allowedTypes: ["LOCATION_REGISTRY"],
    body:
      "Defined locations, aliases, hierarchy, adjacency, travel routes, access rules, and navigation relationships available throughout this Story.",
  },
  {
    id: "factionRegistries",
    idsField: "factionRegistryIds",
    label: "Faction Registries",
    pickerTitle: "Attach Faction Registries",
    addLabel: "Attach Faction Registry",
    emptyLabel: "No Faction Registries attached.",
    allowedTypes: ["FACTION_REGISTRY"],
    body:
      "Faction identities, alliances, rivalries, territory, membership, influence, and strategic relationships available to this Story.",
  },
  {
    id: "organizationRegistries",
    idsField: "organizationRegistryIds",
    label: "Organization Registries",
    pickerTitle: "Attach Organization Registries",
    addLabel: "Attach Organization Registry",
    emptyLabel: "No Organization Registries attached.",
    allowedTypes: ["ORGANIZATION_REGISTRY"],
    body:
      "Organizations, internal structures, leadership, facilities, responsibilities, and institutional relationships available to this Story.",
  },
];

const EMPTY_BOUND_REGISTRIES = {
  eventRegistryIds: [],
  questRegistryIds: [],
  npcRegistryIds: [],
  itemRegistryIds: [],
  locationRegistryIds: [],
  factionRegistryIds: [],
  organizationRegistryIds: [],
};

const EMPTY_BOUND_REGISTRY_LINKS = {
  eventRegistries: [],
  questRegistries: [],
  npcRegistries: [],
  itemRegistries: [],
  locationRegistries: [],
  factionRegistries: [],
  organizationRegistries: [],
};

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBoundRegistries(value) {
  const source = normalizeObject(value);

  return {
    ...EMPTY_BOUND_REGISTRIES,
    eventRegistryIds: normalizeArray(source.eventRegistryIds),
    questRegistryIds: normalizeArray(source.questRegistryIds),
    npcRegistryIds: normalizeArray(source.npcRegistryIds),
    itemRegistryIds: normalizeArray(source.itemRegistryIds),
    locationRegistryIds: normalizeArray(source.locationRegistryIds),
    factionRegistryIds: normalizeArray(source.factionRegistryIds),
    organizationRegistryIds: normalizeArray(source.organizationRegistryIds),
  };
}

function normalizeBoundRegistryLinks(value) {
  const source = normalizeObject(value);

  return {
    ...EMPTY_BOUND_REGISTRY_LINKS,
    eventRegistries: normalizeArray(source.eventRegistries),
    questRegistries: normalizeArray(source.questRegistries),
    npcRegistries: normalizeArray(source.npcRegistries),
    itemRegistries: normalizeArray(source.itemRegistries),
    locationRegistries: normalizeArray(source.locationRegistries),
    factionRegistries: normalizeArray(source.factionRegistries),
    organizationRegistries: normalizeArray(source.organizationRegistries),
  };
}

function getGroupLinks({ group, boundRegistries, boundRegistryLinks }) {
  const mirroredLinks = normalizeArray(boundRegistryLinks[group.id]);
  const ids = normalizeArray(boundRegistries[group.idsField]);

  if (mirroredLinks.length) {
    return mirroredLinks;
  }

  return ids.map((registryId) => ({
    id: `legacy_${registryId}`,
    creationId: registryId,
    title: registryId,
    type: "REGISTRY",
    description: "",
    imageUrl: "",
    notes: "",
  }));
}

function getAttachmentId(link, index = 0) {
  return String(link?.id || link?.creationId || `attachment_${index}`);
}

function dedupeIds(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function getGroupById(groupId) {
  return REGISTRY_GROUPS.find((group) => group.id === groupId) || null;
}

function findGroupLink({
  group,
  attachmentId,
  boundRegistries,
  boundRegistryLinks,
}) {
  return (
    getGroupLinks({ group, boundRegistries, boundRegistryLinks }).find(
      (link, index) => getAttachmentId(link, index) === attachmentId
    ) || null
  );
}

function getDisplayGroups({
  boundRegistries,
  boundRegistryLinks,
  liveRegistryCreationsById = {},
}) {
  return REGISTRY_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    body: group.body,
    addLabel: group.addLabel,
    emptyLabel: group.emptyLabel,
    attachments: getGroupLinks({
      group,
      boundRegistries,
      boundRegistryLinks,
    }).map((link, index) => {
      const liveCreation =
        liveRegistryCreationsById?.[link?.creationId] || null;

      return {
        id: getAttachmentId(link, index),
        title:
          liveCreation?.title ||
          link?.title ||
          "Attached Registry",
        typeLabel:
          liveCreation?.type ||
          link?.type ||
          "Registry",
        description:
          liveCreation?.description ??
          link?.description ??
          "",
        imageUrl:
          liveCreation?.imageUrl ||
          liveCreation?.image_url ||
          link?.imageUrl ||
          "",
        notes: link?.notes || "",
        removeAriaLabel: "Remove attached registry",
      };
    }),
  }));
}

export function useRoomRegistryAttachmentsSectionViewModel({
  data = {},
  updateDataField = null,
  eyebrow = "Story Registries",
  title = "Registry Attachments",
  body =
    "Attach registries directly to this Story. Story registries take priority over inherited Location registries of the same kind.",
} = {}) {
  const [activePickerId, setActivePickerId] = useState(null);
  const [liveRegistryCreationsById, setLiveRegistryCreationsById] =
    useState({});
  const safeData = normalizeObject(data);
  const boundRegistries = normalizeBoundRegistries(safeData.boundRegistries);
  const boundRegistryLinks = normalizeBoundRegistryLinks(
    safeData.boundRegistryLinks
  );
  const activePicker = getGroupById(activePickerId);
  const attachedRegistryCreationIds = dedupeIds(
    REGISTRY_GROUPS.flatMap((group) =>
      getGroupLinks({
        group,
        boundRegistries,
        boundRegistryLinks,
      })
        .map((link) => link?.creationId)
        .filter(Boolean)
    )
  );
  const attachedRegistryCreationIdsKey =
    [...attachedRegistryCreationIds].sort().join("|");

  useEffect(() => {
    let cancelled = false;
    const creationIds = attachedRegistryCreationIdsKey
      ? attachedRegistryCreationIdsKey.split("|")
      : [];

    if (!creationIds.length) {
      setLiveRegistryCreationsById({});
      return () => {
        cancelled = true;
      };
    }

    async function hydrateAttachedRegistries() {
      const results = await Promise.allSettled(
        creationIds.map((creationId) =>
          fetchOwnedCreation(
            creationId,
            "Attached registry could not be loaded."
          )
        )
      );

      if (cancelled) return;

      const next = {};
      results.forEach((result, index) => {
        if (
          result.status === "fulfilled" &&
          result.value?.id
        ) {
          next[creationIds[index]] = result.value;
        }
      });
      setLiveRegistryCreationsById(next);
    }

    hydrateAttachedRegistries();

    return () => {
      cancelled = true;
    };
  }, [attachedRegistryCreationIdsKey]);

  const pickerLinks = useMemo(() => {
    if (!activePicker) return [];

    return getGroupLinks({
      group: activePicker,
      boundRegistries,
      boundRegistryLinks,
    });
  }, [activePicker, boundRegistries, boundRegistryLinks]);

  const selectedCreationIds = useMemo(
    () => pickerLinks.map((link) => link?.creationId).filter(Boolean),
    [pickerLinks]
  );

  function updateRegistryData(nextBoundRegistries, nextBoundRegistryLinks) {
    updateDataField?.("boundRegistries", nextBoundRegistries);
    updateDataField?.("boundRegistryLinks", nextBoundRegistryLinks);
  }

  function handleSelectRegistry(creation) {
    if (!activePicker || !creation?.id) return;

    const existingLinks = getGroupLinks({
      group: activePicker,
      boundRegistries,
      boundRegistryLinks,
    });

    if (existingLinks.some((link) => link?.creationId === creation.id)) {
      setActivePickerId(null);
      return;
    }

    const nextLink = createLinkedCreationLink(creation);

    setLiveRegistryCreationsById((current) => ({
      ...current,
      [creation.id]: creation,
    }));

    const nextBoundRegistries = {
      ...boundRegistries,
      [activePicker.idsField]: dedupeIds([
        ...normalizeArray(boundRegistries[activePicker.idsField]),
        creation.id,
      ]),
    };
    const nextBoundRegistryLinks = {
      ...boundRegistryLinks,
      [activePicker.id]: [...existingLinks, nextLink],
    };

    updateRegistryData(nextBoundRegistries, nextBoundRegistryLinks);
    setActivePickerId(null);
  }

  function removeRegistry(groupId, attachmentId) {
    const group = getGroupById(groupId);
    if (!group) return;

    const targetLink = findGroupLink({
      group,
      attachmentId,
      boundRegistries,
      boundRegistryLinks,
    });
    if (!targetLink) return;

    const existingLinks = getGroupLinks({
      group,
      boundRegistries,
      boundRegistryLinks,
    });
    const nextLinks = existingLinks.filter(
      (item) =>
        item?.id !== targetLink.id &&
        item?.creationId !== targetLink.creationId
    );
    const nextBoundRegistries = {
      ...boundRegistries,
      [group.idsField]: normalizeArray(boundRegistries[group.idsField]).filter(
        (id) => id !== targetLink.creationId
      ),
    };
    const nextBoundRegistryLinks = {
      ...boundRegistryLinks,
      [group.id]: nextLinks,
    };

    updateRegistryData(nextBoundRegistries, nextBoundRegistryLinks);
  }

  function changeRegistryNotes(groupId, attachmentId, notes) {
    const group = getGroupById(groupId);
    if (!group) return;

    const targetLink = findGroupLink({
      group,
      attachmentId,
      boundRegistries,
      boundRegistryLinks,
    });
    if (!targetLink) return;

    const existingLinks = getGroupLinks({
      group,
      boundRegistries,
      boundRegistryLinks,
    });
    const nextBoundRegistryLinks = {
      ...boundRegistryLinks,
      [group.id]: existingLinks.map((item) =>
        item?.id === targetLink.id ||
        item?.creationId === targetLink.creationId
          ? {
              ...item,
              notes,
            }
          : item
      ),
    };

    updateRegistryData(boundRegistries, nextBoundRegistryLinks);
  }

  const pickerProps = activePicker
    ? {
        title: activePicker.pickerTitle,
        body: "Choose a registry to attach directly to this Story.",
        allowedTypes: activePicker.allowedTypes,
        selectedCreationIds,
        onClose: () => setActivePickerId(null),
        onSelect: handleSelectRegistry,
      }
    : null;

  return {
    viewProps: {
      eyebrow,
      title,
      body,
      groups: getDisplayGroups({
        boundRegistries,
        boundRegistryLinks,
        liveRegistryCreationsById,
      }),
      onOpenRegistryPicker: (groupId) => setActivePickerId(groupId),
      onRemoveRegistry: removeRegistry,
      onChangeRegistryNotes: changeRegistryNotes,
    },
    hydrationBindingInput: {
      boundRegistries,
      boundRegistryLinks,
      liveRegistryCreationsById,
    },
    pickerProps,
  };
}
