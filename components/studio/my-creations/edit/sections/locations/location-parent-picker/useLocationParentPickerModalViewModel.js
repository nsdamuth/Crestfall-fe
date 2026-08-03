"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
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
    firstMedia?.imageUrl ||
    firstMedia?.url ||
    firstMedia?.displayUrl ||
    creation?.imageUrl ||
    creation?.coverImageUrl ||
    data.imageUrl ||
    data.coverImageUrl ||
    "/images/placeholder-card.jpg"
  );
}

function getLocationScale(creation) {
  const data = creation?.data || {};

  return normalizeString(
    data.locationScale ||
      data.location_scale ||
      data.worldScale ||
      data.world_scale ||
      data.scaleType ||
      data.scale_type
  );
}

function getSpaceType(creation) {
  const data = creation?.data || {};

  return normalizeString(data.space_type || data.spaceType || data.space);
}

function getSubtitle(creation) {
  const data = creation?.data || {};
  const parts = [
    getLocationScale(creation),
    getSpaceType(creation),
    data.category,
    creation?.description,
  ].filter(Boolean);

  return parts.join(" · ") || "Location";
}

function normalizeLocationSelection(location) {
  return {
    parentLocationId: location.id,
    parentLocationTitle:
      location.title || location.data?.name || "Untitled Location",
    parentLocationDescription: location.description || "",
    parentLocationImageUrl: getFeaturedImageUrl(location),
    parentLocationScale: getLocationScale(location),
    parentLocationSpaceType: getSpaceType(location),
  };
}

function matchesSearchQuery(location, normalizedQuery) {
  if (!normalizedQuery) return true;

  const data = location?.data || {};
  const haystack = [
    location?.title,
    location?.description,
    data.name,
    data.category,
    data.locationScale,
    data.location_scale,
    data.worldScale,
    data.world_scale,
    data.space_type,
    data.spaceType,
    data.prompt_guidance,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function toViewItem(location, selectedLocationId) {
  const title =
    normalizeString(location?.title || location?.data?.name) ||
    "Untitled Location";
  const scaleLabel = getLocationScale(location);
  const spaceTypeLabel = getSpaceType(location);

  return {
    id: location?.id || "",
    title,
    subtitle: getSubtitle(location),
    displayImageUrl: getFeaturedImageUrl(location),
    imageAltText: `${title} location image`,
    isSelected: location?.id === selectedLocationId,
    badges: ["Location", scaleLabel, spaceTypeLabel].filter(Boolean),
    referenceText: location?.id || "",
  };
}

export function useLocationParentPickerModalViewModel({
  selectedLocationId = "",
  currentLocationId = "",
  onClose,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      setStatus("loading");
      setMessage("");

      try {
        const results = await fetchOwnedCreations({ type: "LOCATION" });

        if (cancelled) return;

        setLocations(Array.isArray(results) ? results : []);
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(error?.message || "Locations could not be loaded.");
      }
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return locations
      .filter((location) => location?.id !== currentLocationId)
      .filter((location) => matchesSearchQuery(location, normalizedQuery));
  }, [locations, query, currentLocationId]);

  const items = useMemo(
    () =>
      filteredLocations.map((location) =>
        toViewItem(location, selectedLocationId)
      ),
    [filteredLocations, selectedLocationId]
  );

  function chooseLocation(locationId) {
    const selectedLocation = locations.find(
      (location) => location?.id === locationId
    );

    if (!selectedLocation) return;

    onSelect?.(normalizeLocationSelection(selectedLocation));
  }

  return {
    eyebrow: "Location Hierarchy",
    title: "Select Parent Location",
    description:
      "Choose the broader location this place belongs under. The parent location provides inherited runtime context such as weather, time, knowledge, and travel rules.",
    searchPlaceholder: "Search locations...",
    searchQuery: query,
    items,
    isLoading: status === "loading",
    loadingMessage: "Loading locations...",
    errorMessage:
      status === "error" ? message || "Locations could not be loaded." : "",
    emptyMessage: "No parent locations found.",
    onSearchQueryChange: setQuery,
    onClose,
    onChooseLocation: chooseLocation,
  };
}
