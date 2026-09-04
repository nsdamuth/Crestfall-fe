"use client";

import { useState } from "react";

import { createLinkedCreationLink } from "@/components/studio/registries/structuredRegistryUtils";
import { useOwnedCreationSummaryIndex } from "@/components/studio/creations/hooks/useOwnedCreationSummaryIndex";
import { hydrateCreationReference } from "@/lib/shared/creations/creationReferenceHydration";

export const LOCATION_REGISTRY_GROUPS = Object.freeze([
  Object.freeze({
    id: "eventRegistries",
    idsField: "eventRegistryIds",
    label: "Event Registries",
    pickerTitle: "Attach Event Registries",
    addLabel: "Attach Event Registry",
    emptyLabel: "No Event Registries attached.",
    allowedTypes: Object.freeze(["EVENT_REGISTRY"]),
    body:
      "Local happenings, gatherings, incidents, festivals, markets, environmental activity, and recurring scene events associated with this location.",
  }),
  Object.freeze({
    id: "questRegistries",
    idsField: "questRegistryIds",
    label: "Quest Registries",
    pickerTitle: "Attach Quest Registries",
    addLabel: "Attach Quest Registry",
    emptyLabel: "No Quest Registries attached.",
    allowedTypes: Object.freeze(["QUEST_REGISTRY"]),
    body:
      "Optional side threads, hooks, investigations, errands, unresolved objectives, and quest opportunities associated with this location.",
  }),
  Object.freeze({
    id: "npcRegistries",
    idsField: "npcRegistryIds",
    label: "NPC Registries",
    pickerTitle: "Attach NPC Registries",
    addLabel: "Attach NPC Registry",
    emptyLabel: "No NPC Registries attached.",
    allowedTypes: Object.freeze(["NPC_REGISTRY"]),
    body:
      "Residents, employees, visitors, guards, proprietors, and other NPCs commonly associated with this location or its inherited area.",
  }),
  Object.freeze({
    id: "itemRegistries",
    idsField: "itemRegistryIds",
    label: "Item Registries",
    pickerTitle: "Attach Item Registries",
    addLabel: "Attach Item Registry",
    emptyLabel: "No Item Registries attached.",
    allowedTypes: Object.freeze(["ITEM_REGISTRY"]),
    body:
      "Items, merchandise, equipment, resources, fixtures, and portable objects commonly available or tracked at this location.",
  }),
  Object.freeze({
    id: "locationRegistries",
    idsField: "locationRegistryIds",
    label: "Location Registries",
    pickerTitle: "Attach Location Registries",
    addLabel: "Attach Location Registry",
    emptyLabel: "No Location Registries attached.",
    allowedTypes: Object.freeze(["LOCATION_REGISTRY"]),
    body:
      "Nearby, contained, connected, or otherwise relevant locations used for navigation, adjacency, travel, and local scene continuity.",
  }),
  Object.freeze({
    id: "factionRegistries",
    idsField: "factionRegistryIds",
    label: "Faction Registries",
    pickerTitle: "Attach Faction Registries",
    addLabel: "Attach Faction Registry",
    emptyLabel: "No Faction Registries attached.",
    allowedTypes: Object.freeze(["FACTION_REGISTRY"]),
    body:
      "Factions controlling, contesting, visiting, protecting, or otherwise influencing this location and its surrounding area.",
  }),
  Object.freeze({
    id: "organizationRegistries",
    idsField: "organizationRegistryIds",
    label: "Organization Registries",
    pickerTitle: "Attach Organization Registries",
    addLabel: "Attach Organization Registry",
    emptyLabel: "No Organization Registries attached.",
    allowedTypes: Object.freeze(["ORGANIZATION_REGISTRY"]),
    body:
      "Businesses, institutions, agencies, guilds, departments, and other organizations operating from or interacting with this location.",
  }),
]);

const EMPTY_BOUND_REGISTRIES = Object.freeze({
  eventRegistryIds: Object.freeze([]),
  questRegistryIds: Object.freeze([]),
  npcRegistryIds: Object.freeze([]),
  itemRegistryIds: Object.freeze([]),
  locationRegistryIds: Object.freeze([]),
  factionRegistryIds: Object.freeze([]),
  organizationRegistryIds: Object.freeze([]),
});

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Location Runtime Context",
  sectionTitle: "Registry Attachments",
  sectionDescription:
    "Attach registries to this location. A Story may override an inherited registry kind, but when it does not, the active Location and its parent ancestry provide the relevant registry context.",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeLocationBoundRegistries(value) {
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

export function normalizeLocationBoundRegistryLinks(value) {
  const source = normalizeObject(value);

  return {
    eventRegistries: normalizeArray(source.eventRegistries),
    questRegistries: normalizeArray(source.questRegistries),
    npcRegistries: normalizeArray(source.npcRegistries),
    itemRegistries: normalizeArray(source.itemRegistries),
    locationRegistries: normalizeArray(source.locationRegistries),
    factionRegistries: normalizeArray(source.factionRegistries),
    organizationRegistries: normalizeArray(source.organizationRegistries),
  };
}

export function getLocationRegistryGroupLinks({
  group,
  boundRegistries,
  boundRegistryLinks,
}) {
  const mirroredLinks = normalizeArray(boundRegistryLinks?.[group.id]);
  const ids = normalizeArray(boundRegistries?.[group.idsField]);

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

function dedupeIds(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function findRegistryGroup(groupId) {
  return LOCATION_REGISTRY_GROUPS.find((group) => group.id === groupId) || null;
}

export function useLocationRegistryAttachmentsSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const [pickerGroupId, setPickerGroupId] = useState("");
  const data = normalizeObject(form?.data);
  const boundRegistries = normalizeLocationBoundRegistries(
    data.boundRegistries
  );
  const boundRegistryLinks = normalizeLocationBoundRegistryLinks(
    data.boundRegistryLinks
  );
  const activePicker = findRegistryGroup(pickerGroupId);

  const { summariesById } = useOwnedCreationSummaryIndex();

  const groups = LOCATION_REGISTRY_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    addLabel: group.addLabel,
    emptyLabel: group.emptyLabel,
    body: group.body,
    links: getLocationRegistryGroupLinks({
      group,
      boundRegistries,
      boundRegistryLinks,
    }).map((link) =>
      hydrateCreationReference(link, summariesById, {
        fallbackType: group.allowedTypes[0],
      })
    ),
  }));

  function updateRegistryData(nextBoundRegistries, nextBoundRegistryLinks) {
    updateDataField?.("boundRegistries", nextBoundRegistries);
    updateDataField?.("boundRegistryLinks", nextBoundRegistryLinks);
  }

  function handleSelectRegistry(creation) {
    if (!activePicker || !creation?.id) return;

    const existingLinks = getLocationRegistryGroupLinks({
      group: activePicker,
      boundRegistries,
      boundRegistryLinks,
    });

    if (existingLinks.some((link) => link.creationId === creation.id)) {
      setPickerGroupId("");
      return;
    }

    const nextLink = createLinkedCreationLink(creation);
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
    setPickerGroupId("");
  }

  function removeRegistry(groupId, link) {
    const group = findRegistryGroup(groupId);
    if (!group || !link) return;

    const existingLinks = getLocationRegistryGroupLinks({
      group,
      boundRegistries,
      boundRegistryLinks,
    });
    const nextLinks = existingLinks.filter(
      (item) =>
        item.id !== link.id && item.creationId !== link.creationId
    );
    const nextBoundRegistries = {
      ...boundRegistries,
      [group.idsField]: normalizeArray(boundRegistries[group.idsField]).filter(
        (id) => id !== link.creationId
      ),
    };
    const nextBoundRegistryLinks = {
      ...boundRegistryLinks,
      [group.id]: nextLinks,
    };

    updateRegistryData(nextBoundRegistries, nextBoundRegistryLinks);
  }

  function changeRegistryNotes(groupId, link, notes) {
    const group = findRegistryGroup(groupId);
    if (!group || !link) return;

    const existingLinks = getLocationRegistryGroupLinks({
      group,
      boundRegistries,
      boundRegistryLinks,
    });
    const nextBoundRegistryLinks = {
      ...boundRegistryLinks,
      [group.id]: existingLinks.map((item) =>
        item.id === link.id || item.creationId === link.creationId
          ? { ...item, notes }
          : item
      ),
    };

    updateRegistryData(boundRegistries, nextBoundRegistryLinks);
  }

  const activePickerLinks = activePicker
    ? getLocationRegistryGroupLinks({
        group: activePicker,
        boundRegistries,
        boundRegistryLinks,
      })
    : [];

  return {
    ...DEFAULT_COPY,
    groups,
    onOpenPicker: (groupId) => {
      if (findRegistryGroup(groupId)) {
        setPickerGroupId(groupId);
      }
    },
    onRemoveRegistry: removeRegistry,
    onChangeRegistryNotes: changeRegistryNotes,
    pickerModalProps: activePicker
      ? {
          title: activePicker.pickerTitle,
          body: "Choose a registry to attach to this location.",
          allowedTypes: [...activePicker.allowedTypes],
          selectedCreationIds: activePickerLinks
            .map((link) => link.creationId)
            .filter(Boolean),
          onClose: () => setPickerGroupId(""),
          onSelect: handleSelectRegistry,
        }
      : null,
  };
}
