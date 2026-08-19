"use client";

import { useEffect, useMemo, useState } from "react";

import { useStructuredRegistryBuilder } from "@/components/studio/registries/hooks/useStructuredRegistryBuilder";
import {
  createLinkedCreationLink,
  createLinkedCreationReferenceKey,
  isDirectStructuredRegistrySelfReference,
  listToText,
  normalizeListText,
} from "@/components/studio/registries/structuredRegistryUtils";
import { isStructuredRegistryType } from "@/components/studio/registries/structuredRegistryConfigs";
import { buildStructuredRegistryBuilderTabs } from "./StructuredRegistryBuilder.contract";
import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

function toSelectOptions(options = []) {
  return options.map((option) =>
    typeof option === "string"
      ? {
          value: option,
          label: option,
        }
      : option
  );
}

function getFeaturedImageUrl(creation) {
  const data = creation?.data || {};
  const featuredMedia =
    creation?.featuredMedia ||
    creation?.featured_media ||
    data.featuredMedia ||
    data.featured_media ||
    [];
  const firstMedia = Array.isArray(featuredMedia) ? featuredMedia[0] : null;

  return (
    firstMedia?.thumbnailUrl ||
    firstMedia?.thumbnail_url ||
    firstMedia?.imageUrl ||
    firstMedia?.image_url ||
    firstMedia?.url ||
    creation?.thumbnailUrl ||
    creation?.thumbnail_url ||
    creation?.imageUrl ||
    creation?.image_url ||
    data.thumbnailUrl ||
    data.thumbnail_url ||
    data.imageUrl ||
    data.image_url ||
    ""
  );
}

function findStructuredRegistryEntry(creation, registryEntryId) {
  if (!registryEntryId) return null;

  return (Array.isArray(creation?.data?.entries) ? creation.data.entries : []).find(
    (entry) => String(entry?.id || entry?.key || entry?.slug || "") === registryEntryId
  ) || null;
}

function hydrateLinkedCreation(link, creationById = new Map()) {
  const creation = creationById.get(link?.creationId);

  if (!creation) {
    return {
      ...link,
      title: "Unavailable linked creation",
      type: link?.creationType || "CREATION",
      description: "",
      imageUrl: "",
      referenceStatus: "UNAVAILABLE",
    };
  }

  const creationType = String(creation.type || link?.creationType || "CREATION").toUpperCase();
  const registryEntryId = String(link?.registryEntryId || "").trim();

  if (isStructuredRegistryType(creationType)) {
    const registryEntry = findStructuredRegistryEntry(creation, registryEntryId);

    if (!registryEntryId) {
      return {
        ...link,
        title: creation.title || "Legacy registry link",
        type: creationType,
        description: "Legacy whole-registry link. Select a specific registry entry to make this graph edge precise.",
        imageUrl: getFeaturedImageUrl(creation),
        registryTitle: creation.title || creationType,
        referenceStatus: "LEGACY_REGISTRY_REFERENCE",
      };
    }

    if (!registryEntry) {
      return {
        ...link,
        title: "Missing registry entry",
        type: creationType,
        description: `The referenced entry ${registryEntryId} no longer exists in ${creation.title || creationType}.`,
        imageUrl: getFeaturedImageUrl(creation),
        registryTitle: creation.title || creationType,
        referenceStatus: "REGISTRY_ENTRY_NOT_FOUND",
      };
    }

    return {
      ...link,
      title: registryEntry.name || registryEntry.title || registryEntry.label || "Untitled Registry Entry",
      type: creationType,
      description:
        registryEntry.summary ||
        registryEntry.publicDescription ||
        registryEntry.public_description ||
        "",
      imageUrl: getFeaturedImageUrl(creation),
      registryTitle: creation.title || creationType,
      referenceStatus: "REGISTRY_ENTRY_RESOLVED",
    };
  }

  return {
    ...link,
    title: creation.title || creation.data?.name || "Untitled Creation",
    type: creationType,
    description: creation.description || creation.data?.summary || "",
    imageUrl: getFeaturedImageUrl(creation),
    referenceStatus: "CREATION_RESOLVED",
  };
}

function withPresentationFields(entry, creationById = new Map()) {
  const hydrated = { ...entry };

  for (const field of [
    "linkedCharacters",
    "linkedLocations",
    "linkedOrganizations",
    "linkedFactions",
    "linkedItems",
    "linkedEvents",
    "linkedQuests",
  ]) {
    hydrated[field] = Array.isArray(entry?.[field])
      ? entry[field].map((link) => hydrateLinkedCreation(link, creationById))
      : [];
  }

  return {
    ...hydrated,
    aliasesText: listToText(entry?.aliases),
  };
}

export function useStructuredRegistryBuilderViewModel({
  registryType,
  mode = "create",
  currentRegistryCreationId = "",
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  onChange,
  activeTab: controlledActiveTab = null,
  hideTabs = false,
} = {}) {
  const registry = useStructuredRegistryBuilder({
    registryType,
    mode,
    currentRegistryCreationId,
    initialTitle,
    initialDescription,
    initialData,
    onChange,
  });
  const [linkPicker, setLinkPicker] = useState(null);
  const [linkedCreations, setLinkedCreations] = useState([]);


  useEffect(() => {
    let cancelled = false;

    async function hydrateLinkedCreations() {
      const allowedTypes = [
        ...new Set(
          (registry.config.relationshipGroups || [])
            .flatMap((group) => group.allowedTypes || [])
            .map((type) => String(type || "").toUpperCase())
            .filter(Boolean)
        ),
      ];

      if (!allowedTypes.length) {
        setLinkedCreations([]);
        return;
      }

      try {
        const results = await Promise.all(
          allowedTypes.map((type) => fetchOwnedCreations({ type }))
        );

        if (!cancelled) {
          const byId = new Map();
          results.flat().forEach((creation) => {
            if (creation?.id) byId.set(creation.id, creation);
          });
          setLinkedCreations([...byId.values()]);
        }
      } catch {
        if (!cancelled) setLinkedCreations([]);
      }
    }

    hydrateLinkedCreations();

    return () => {
      cancelled = true;
    };
  }, [registry.config.relationshipGroups, registryType]);

  const linkedCreationById = useMemo(
    () => new Map(linkedCreations.map((creation) => [creation.id, creation])),
    [linkedCreations]
  );

  const activeTab = controlledActiveTab || registry.activeTab;
  const tabs = useMemo(
    () => buildStructuredRegistryBuilderTabs(activeTab),
    [activeTab]
  );
  const entries = useMemo(
    () =>
      registry.data.entries.map((entry) =>
        withPresentationFields(entry, linkedCreationById)
      ),
    [linkedCreationById, registry.data.entries]
  );
  const activeEntry = useMemo(
    () =>
      registry.activeEntry
        ? withPresentationFields(registry.activeEntry, linkedCreationById)
        : null,
    [linkedCreationById, registry.activeEntry]
  );
  const categoryOptions = useMemo(
    () => toSelectOptions(registry.config.categoryOptions || ["Other"]),
    [registry.config.categoryOptions]
  );

  const pickerEntry = useMemo(
    () =>
      linkPicker?.entryId
        ? registry.data.entries.find(
            (entry) => entry.id === linkPicker.entryId
          ) || null
        : null,
    [linkPicker?.entryId, registry.data.entries]
  );

  const selectedReferenceKeys = useMemo(() => {
    if (!pickerEntry || !linkPicker?.group?.id) return [];

    const links = Array.isArray(pickerEntry[linkPicker.group.id])
      ? pickerEntry[linkPicker.group.id]
      : [];

    return links
      .map((link) => createLinkedCreationReferenceKey(link))
      .filter(Boolean);
  }, [pickerEntry, linkPicker]);

  function openLinkPicker(entryId, groupId) {
    const group = (registry.config.relationshipGroups || []).find(
      (candidate) => candidate.id === groupId
    );

    if (!group) return;

    setLinkPicker({ entryId, group });
  }

  function selectLinkedCreation(selection) {
    if (!pickerEntry || !linkPicker?.group?.id) return;

    const creation = selection?.creation || selection;
    const registryEntry = selection?.registryEntry || null;
    const creationType = String(
      creation?.type || creation?.creationType || ""
    ).toUpperCase();
    const allowedTypes = new Set(
      (linkPicker.group.allowedTypes || []).map((type) =>
        String(type || "").toUpperCase()
      )
    );

    if (!creationType || !allowedTypes.has(creationType)) return;

    const field = linkPicker.group.id;
    const currentLinks = Array.isArray(pickerEntry[field])
      ? pickerEntry[field]
      : [];
    const nextLink = createLinkedCreationLink(creation, registryEntry);
    const nextKey = createLinkedCreationReferenceKey(nextLink);

    if (
      isDirectStructuredRegistrySelfReference(nextLink, {
        currentRegistryCreationId,
        currentRegistryEntryId: pickerEntry.id,
      })
    ) {
      return;
    }

    if (
      nextLink.creationId &&
      !currentLinks.some(
        (link) => createLinkedCreationReferenceKey(link) === nextKey
      )
    ) {
      registry.updateEntry(pickerEntry.id, {
        [field]: [...currentLinks, nextLink],
      });
    }

    setLinkPicker(null);
  }

  function removeLinkedCreation(entryId, groupId, linkId) {
    const entry = registry.data.entries.find((candidate) => candidate.id === entryId);
    const links = Array.isArray(entry?.[groupId]) ? entry[groupId] : [];

    registry.updateEntry(entryId, {
      [groupId]: links.filter((link) => link.id !== linkId),
    });
  }

  function updateLinkedCreationNotes(entryId, groupId, linkId, notes) {
    const entry = registry.data.entries.find((candidate) => candidate.id === entryId);
    const links = Array.isArray(entry?.[groupId]) ? entry[groupId] : [];

    registry.updateEntry(entryId, {
      [groupId]: links.map((link) =>
        link.id === linkId
          ? {
              ...link,
              notes,
            }
          : link
      ),
    });
  }

  return {
    viewProps: {
      contractVersion: "structured-registry-builder.view.v1",
      config: registry.config,
      title: registry.title,
      description: registry.description,
      scope: registry.data.scope || "",
      entries,
      activeEntryId: registry.activeEntryId,
      activeEntry,
      promptGuidance: registry.data.prompt_guidance || {},
      reviewPayloadText: JSON.stringify(registry.data, null, 2),
      tabs,
      activeTab,
      hideTabs,
      isEditMode: registry.isEditMode,
      saveStatus: registry.saveStatus,
      saveMessage: registry.saveMessage,
      categoryOptions,
      onTitleChange: registry.setTitle,
      onDescriptionChange: registry.setDescription,
      onScopeChange: (value) => registry.updateDataField("scope", value),
      onSelectTab: registry.setActiveTab,
      onSelectEntry: registry.setActiveEntryId,
      onAddEntry: registry.addEntry,
      onUpdateEntry: registry.updateEntry,
      onEntryAliasesTextChange: (entryId, value) =>
        registry.updateEntry(entryId, {
          aliases: normalizeListText(value),
        }),
      onDeleteEntry: registry.deleteEntry,
      onOpenLinkPicker: openLinkPicker,
      onRemoveLinkedCreation: removeLinkedCreation,
      onLinkedCreationNotesChange: updateLinkedCreationNotes,
      onPromptGuidanceChange: registry.updatePromptGuidance,
      onSave: registry.handleSave,
    },
    linkedCreationPickerProps: linkPicker
      ? {
          title: linkPicker.group?.pickerTitle || "Link Creation",
          body: "Choose an asset or a specific entry inside a registry to link to this registry entry.",
          allowedTypes: linkPicker.group?.allowedTypes || [],
          selectedReferenceKeys,
          excludedReferenceKeys:
            currentRegistryCreationId && pickerEntry?.id
              ? [
                  createLinkedCreationReferenceKey({
                    registryCreationId: currentRegistryCreationId,
                    registryEntryId: pickerEntry.id,
                  }),
                ]
              : [],
          onClose: () => setLinkPicker(null),
          onSelect: selectLinkedCreation,
        }
      : null,
  };
}
