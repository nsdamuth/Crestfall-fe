"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

const PLACEHOLDER_IMAGE_URL = "/images/placeholder-card.jpg";

function getCreationImageUrl(creation) {
  const data = creation?.data || {};
  const media =
    creation?.featuredMedia ||
    creation?.featured_media ||
    data.featuredMedia ||
    data.featured_media ||
    [];

  const first = Array.isArray(media) ? media[0] : null;

  return (
    first?.imageUrl ||
    first?.url ||
    data.default_outfit_image_url ||
    data.imageUrl ||
    data.image_url ||
    PLACEHOLDER_IMAGE_URL
  );
}

function getPlayerCharacterTitle(creation) {
  return creation?.title || creation?.data?.name || "Untitled PC";
}

function getPlayerCharacterDescription(creation) {
  return (
    creation?.description || creation?.data?.personality_summary || ""
  );
}

function toSelectionPayload(creation) {
  return {
    id: creation?.id,
    title: getPlayerCharacterTitle(creation),
    description: getPlayerCharacterDescription(creation),
    visibility: creation?.visibility || "PRIVATE",
    status: creation?.status || "DRAFT",
    content_rating:
      creation?.contentRating || creation?.content_rating || "SFW",
    imageUrl: getCreationImageUrl(creation),
  };
}

function toViewPlayerCharacter(creation, selectedId) {
  const title = getPlayerCharacterTitle(creation);

  return {
    id: creation?.id || "",
    title,
    description: getPlayerCharacterDescription(creation) || "No description.",
    displayImageUrl: getCreationImageUrl(creation),
    imageAltText: `${title} player character portrait`,
    isSelected: creation?.id === selectedId,
  };
}

function matchesSearchQuery(creation, normalizedQuery) {
  if (!normalizedQuery) return true;

  const data = creation?.data || {};
  const haystack = [
    creation?.title,
    creation?.description,
    data.name,
    data.alias,
    data.short_concept,
    data.role_archetype,
    data.personality_summary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export function useDefaultPlayerCharacterPickerViewModel({
  selectedId = "",
  onClose,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPlayerCharacters() {
      setStatus("loading");
      setMessage("");

      try {
        const results = await fetchOwnedCreations({
          type: "PLAYER_CHARACTER",
        });

        if (cancelled) return;

        setItems(Array.isArray(results) ? results : []);
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(error?.message || "Player characters could not be loaded.");
      }
    }

    loadPlayerCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => matchesSearchQuery(item, normalizedQuery));
  }, [items, query]);

  const playerCharacters = useMemo(
    () =>
      filteredItems.map((item) =>
        toViewPlayerCharacter(item, selectedId)
      ),
    [filteredItems, selectedId]
  );

  function choosePlayerCharacter(playerCharacterId) {
    const selectedPlayerCharacter = items.find(
      (item) => item?.id === playerCharacterId
    );

    if (!selectedPlayerCharacter) return;

    onSelect?.(toSelectionPayload(selectedPlayerCharacter));
  }

  return {
    searchQuery: query,
    playerCharacters,
    isLoading: status === "loading",
    errorMessage:
      status === "error"
        ? message || "Player characters could not be loaded."
        : "",
    onSearchQueryChange: setQuery,
    onClose,
    onChoosePlayerCharacter: choosePlayerCharacter,
  };
}
