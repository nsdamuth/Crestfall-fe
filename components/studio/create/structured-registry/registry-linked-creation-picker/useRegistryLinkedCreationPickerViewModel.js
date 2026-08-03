"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";
import { getDefaultCreationImageForType } from "@/lib/shared/creations/creationMedia";

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

function matchesSearchQuery(creation, normalizedQuery) {
  if (!normalizedQuery) return true;

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
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function toViewCreation(creation, selectedSet) {
  const title = getCreationTitle(creation);

  return {
    id: creation?.id || "",
    title,
    subtitle: getCreationSubtitle(creation),
    typeLabel: creation?.type || "Creation",
    displayImageUrl: getFeaturedImageUrl(creation),
    imageAltText: `${title} creation image`,
    isSelected: selectedSet.has(creation?.id),
  };
}

export function useRegistryLinkedCreationPickerViewModel({
  title = "Link Creation",
  body = "Choose a creation to link to this registry entry.",
  allowedTypes = [],
  selectedCreationIds = [],
  onClose,
  onSelect,
}) {
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

        setItems(results);
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
  }, [allowedTypes]);

  const selectedSet = useMemo(
    () => new Set(normalizeArray(selectedCreationIds)),
    [selectedCreationIds]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => matchesSearchQuery(item, normalizedQuery));
  }, [items, query]);

  const creations = useMemo(
    () => filteredItems.map((item) => toViewCreation(item, selectedSet)),
    [filteredItems, selectedSet]
  );

  function chooseCreation(creationId) {
    const selectedCreation = items.find((item) => item?.id === creationId);

    if (!selectedCreation) return;

    onSelect?.(selectedCreation);
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
