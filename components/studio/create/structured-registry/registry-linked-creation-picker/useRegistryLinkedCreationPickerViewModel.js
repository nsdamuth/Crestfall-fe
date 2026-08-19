"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import { getDefaultCreationImageForType } from "@/lib/shared/creations/creationMedia";
import { createLinkedCreationReferenceKey } from "@/components/studio/registries/structuredRegistryUtils";
import { isStructuredRegistryType } from "@/components/studio/registries/structuredRegistryConfigs";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getFeaturedImageUrl(creation) {
  const data = creation?.data || {};
  const defaultImageUrl = getDefaultCreationImageForType(
    creation?.type || data.type
  );
  const featuredMedia =
    creation?.featuredMedia ||
    creation?.featured_media ||
    data.featuredMedia ||
    data.featured_media ||
    [];

  const firstMedia = Array.isArray(featuredMedia) ? featuredMedia[0] : null;

  if (firstMedia?.isPlaceholder) {
    return defaultImageUrl;
  }

  return (
    firstMedia?.thumbnailUrl ||
    firstMedia?.thumbnail_url ||
    firstMedia?.imageUrl ||
    firstMedia?.image_url ||
    firstMedia?.url ||
    firstMedia?.displayUrl ||
    firstMedia?.display_url ||
    firstMedia?.assetUrl ||
    firstMedia?.asset_url ||
    creation?.thumbnailUrl ||
    creation?.thumbnail_url ||
    creation?.imageUrl ||
    creation?.image_url ||
    creation?.coverImageUrl ||
    creation?.cover_image_url ||
    data.thumbnailUrl ||
    data.thumbnail_url ||
    data.imageUrl ||
    data.image_url ||
    data.coverImageUrl ||
    data.cover_image_url ||
    data.avatarUrl ||
    data.avatar_url ||
    defaultImageUrl
  );
}

function getCreationTitle(creation) {
  return creation?.title || creation?.data?.name || "Untitled Creation";
}

function getCreationSubtitle(creation) {
  const data = creation?.data || {};
  const parts = [
    creation?.type,
    data.name,
    data.category,
    data.locationScale,
    data.location_scale,
    data.space_type,
    data.spaceType,
    creation?.description,
  ]
    .map(normalizeString)
    .filter(Boolean);

  return parts.join(" · ") || "Creation";
}

async function fetchCreationsForTypes(allowedTypes = []) {
  const safeTypes = normalizeArray(allowedTypes)
    .map((type) => String(type || "").toUpperCase())
    .filter(Boolean);

  if (!safeTypes.length) return [];

  const results = await Promise.all(
    safeTypes.map((type) => fetchOwnedCreations({ type }))
  );

  const byId = new Map();

  results.flat().forEach((creation) => {
    if (creation?.id) {
      byId.set(creation.id, creation);
    }
  });

  return [...byId.values()];
}

function getRegistryEntries(creation) {
  return normalizeArray(creation?.data?.entries).filter((entry) =>
    normalizeString(entry?.id || entry?.key || entry?.slug)
  );
}

function createPickerSelections(creations = [], selectionMode = "WHOLE_CREATION") {
  return normalizeArray(creations).flatMap((creation) => {
    const creationType = normalizeString(creation?.type).toUpperCase();

    if (
      selectionMode !== "REGISTRY_ENTRY" ||
      !isStructuredRegistryType(creationType)
    ) {
      return [
        {
          selectionId: createLinkedCreationReferenceKey({
            creationId: creation?.id,
          }),
          creation,
          registryEntry: null,
        },
      ];
    }

    return getRegistryEntries(creation).map((registryEntry) => ({
      selectionId: createLinkedCreationReferenceKey({
        registryCreationId: creation?.id,
        registryEntryId: registryEntry?.id || registryEntry?.key || registryEntry?.slug,
      }),
      creation,
      registryEntry,
    }));
  });
}

function matchesSearchQuery(selection, normalizedQuery) {
  if (!normalizedQuery) return true;

  const creation = selection?.creation || {};
  const registryEntry = selection?.registryEntry || {};
  const data = creation?.data || {};
  const haystack = [
    creation?.title,
    creation?.description,
    creation?.type,
    data.name,
    data.category,
    data.summary,
    data.scope,
    data.locationScale,
    data.location_scale,
    data.space_type,
    data.spaceType,
    registryEntry?.name,
    registryEntry?.title,
    registryEntry?.label,
    registryEntry?.category,
    registryEntry?.summary,
    registryEntry?.publicDescription,
    ...normalizeArray(registryEntry?.aliases),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function toViewCreation(selection, selectedSet) {
  const creation = selection?.creation || {};
  const registryEntry = selection?.registryEntry || null;
  const registryEntryTitle = normalizeString(
    registryEntry?.name || registryEntry?.title || registryEntry?.label
  );
  const title = registryEntryTitle || getCreationTitle(creation);
  const registrySummary = normalizeString(
    registryEntry?.summary ||
      registryEntry?.publicDescription ||
      registryEntry?.public_description
  );
  const subtitle = registryEntry
    ? [creation?.title, creation?.type, registryEntry?.category, registrySummary]
        .map(normalizeString)
        .filter(Boolean)
        .join(" · ")
    : getCreationSubtitle(creation);

  return {
    id: selection?.selectionId || "",
    title,
    subtitle: subtitle || "Registry entry",
    typeLabel: registryEntry ? `${creation?.type || "REGISTRY"} ENTRY` : creation?.type || "Creation",
    displayImageUrl: getFeaturedImageUrl(creation),
    imageAltText: `${title} creation image`,
    isSelected: selectedSet.has(selection?.selectionId),
  };
}

export function useRegistryLinkedCreationPickerViewModel({
  title = "Link Creation",
  body = "Choose a creation to link to this registry entry.",
  allowedTypes = [],
  excludedReferenceKeys = [],
  selectedReferenceKeys,
  selectedCreationIds = [],
  selectionMode = "",
  onClose,
  onSelect,
}) {
  const resolvedSelectionMode =
    selectionMode === "REGISTRY_ENTRY" || selectionMode === "WHOLE_CREATION"
      ? selectionMode
      : Array.isArray(selectedReferenceKeys)
        ? "REGISTRY_ENTRY"
        : "WHOLE_CREATION";

  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCreations() {
      setStatus("loading");
      setMessage("");

      try {
        const results = await fetchCreationsForTypes(allowedTypes);

        if (cancelled) return;

        setItems(createPickerSelections(results, resolvedSelectionMode));
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(error?.message || "Creations could not be loaded.");
      }
    }

    loadCreations();

    return () => {
      cancelled = true;
    };
  }, [allowedTypes, resolvedSelectionMode]);

  const selectedSet = useMemo(
    () =>
      new Set([
        ...normalizeArray(selectedReferenceKeys),
        ...normalizeArray(selectedCreationIds).map((creationId) =>
          createLinkedCreationReferenceKey({ creationId })
        ),
      ]),
    [selectedCreationIds, selectedReferenceKeys]
  );

  const excludedSet = useMemo(
    () => new Set(normalizeArray(excludedReferenceKeys)),
    [excludedReferenceKeys]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter(
      (item) =>
        !excludedSet.has(item?.selectionId) &&
        matchesSearchQuery(item, normalizedQuery)
    );
  }, [excludedSet, items, query]);

  const creations = useMemo(
    () => filteredItems.map((item) => toViewCreation(item, selectedSet)),
    [filteredItems, selectedSet]
  );

  function chooseCreation(selectionId) {
    const selected = items.find((item) => item?.selectionId === selectionId);

    if (!selected) return;

    if (resolvedSelectionMode === "REGISTRY_ENTRY") {
      onSelect?.({
        creation: selected.creation,
        registryEntry: selected.registryEntry,
      });
      return;
    }

    onSelect?.(selected.creation);
  }

  return {
    title,
    body,
    searchQuery: query,
    creations,
    isLoading: status === "loading",
    errorMessage:
      status === "error" ? message || "Creations could not be loaded." : "",
    onSearchQueryChange: setQuery,
    onClose,
    onChooseCreation: chooseCreation,
  };
}
