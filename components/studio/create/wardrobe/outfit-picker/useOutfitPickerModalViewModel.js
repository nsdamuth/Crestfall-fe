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

function getSubtitle(creation) {
  const data = creation?.data || {};

  return (
    data.category ||
    data.style ||
    data.prompt_guidance ||
    creation?.description ||
    "Outfit"
  );
}

function normalizeOutfitSelection(outfit) {
  return {
    outfitCreationId: outfit.id,
    outfitTitle: outfit.title || "Untitled Outfit",
    outfitDescription: outfit.description || "",
    outfitImageUrl: getFeaturedImageUrl(outfit),
    outfitContentRating:
      outfit.contentRating || outfit.content_rating || "SFW",
  };
}

function matchesSearchQuery(outfit, normalizedQuery) {
  if (!normalizedQuery) return true;

  const haystack = [
    outfit?.title,
    outfit?.description,
    outfit?.contentRating,
    outfit?.content_rating,
    outfit?.data?.category,
    outfit?.data?.style,
    outfit?.data?.prompt_guidance,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function toViewItem(outfit, selectedId, typeLabel) {
  const title = normalizeString(outfit?.title) || "Untitled Outfit";

  return {
    id: outfit?.id || "",
    title,
    subtitle: normalizeString(getSubtitle(outfit)) || "Outfit",
    typeLabel,
    ratingLabel:
      normalizeString(outfit?.contentRating || outfit?.content_rating) || "SFW",
    displayImageUrl: getFeaturedImageUrl(outfit),
    imageAltText: `${title} ${typeLabel.toLowerCase()} image`,
    isSelected: outfit?.id === selectedId,
  };
}

export function useOutfitPickerModalViewModel({
  title = "Select Outfit",
  modalEyebrow = "Wardrobe",
  modalDescription = "Choose an existing Outfit creation.",
  searchPlaceholder = "Search outfits...",
  creationType = "OUTFIT",
  typeLabel = "Outfit",
  selectedCreationId = "",
  selectedOutfitId = "",
  normalizeSelection = null,
  onClose,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOutfits() {
      setStatus("loading");
      setMessage("");

      try {
        const results = await fetchOwnedCreations({ type: creationType });

        if (cancelled) return;

        setOutfits(Array.isArray(results) ? results : []);
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(error?.message || "Outfits could not be loaded.");
      }
    }

    loadOutfits();

    return () => {
      cancelled = true;
    };
  }, [creationType]);

  const selectedId = selectedCreationId || selectedOutfitId;

  const filteredOutfits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return outfits.filter((outfit) =>
      matchesSearchQuery(outfit, normalizedQuery)
    );
  }, [outfits, query]);

  const items = useMemo(
    () =>
      filteredOutfits.map((outfit) =>
        toViewItem(outfit, selectedId, typeLabel)
      ),
    [filteredOutfits, selectedId, typeLabel]
  );

  function chooseItem(itemId) {
    const selectedOutfit = outfits.find((outfit) => outfit?.id === itemId);

    if (!selectedOutfit) return;

    onSelect?.(
      normalizeSelection
        ? normalizeSelection(selectedOutfit)
        : normalizeOutfitSelection(selectedOutfit)
    );
  }

  const pluralTypeLabel = `${typeLabel.toLowerCase()}s`;

  return {
    title,
    eyebrow: modalEyebrow,
    description: modalDescription,
    searchPlaceholder,
    searchQuery: query,
    items,
    isLoading: status === "loading",
    loadingMessage: `Loading ${pluralTypeLabel}...`,
    errorMessage:
      status === "error" ? message || "Outfits could not be loaded." : "",
    emptyMessage: `No ${pluralTypeLabel} found.`,
    onSearchQueryChange: setQuery,
    onClose,
    onChooseItem: chooseItem,
  };
}
