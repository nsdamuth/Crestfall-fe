"use client";

import { useMemo, useState } from "react";

import { getStudioCharacterCardViewProps } from "@/components/studio/studio-character-card/useStudioCharacterCardViewModel";

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

export function getOfficialCharacterSearchText(character = {}) {
  return [
    character?.title,
    character?.eyebrow,
    character?.subtitle,
    character?.cardText,
    character?.realm,
    character?.race,
    character?.gender,
    ...(Array.isArray(character?.tags) ? character.tags : []),
    ...(Array.isArray(character?.themes) ? character.themes : []),
    ...(Array.isArray(character?.factions) ? character.factions : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function characterMatchesOfficialSearch(character, query) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) return true;

  return getOfficialCharacterSearchText(character).includes(normalizedQuery);
}

function getCharacterItemId(character, index) {
  return (
    String(character?.slug || character?.id || character?.title || "").trim() ||
    `official-character-${index}`
  );
}

export function getOfficialCharactersGridViewProps({
  characters = [],
  query = "",
  onChangeQuery,
} = {}) {
  const safeCharacters = Array.isArray(characters) ? characters : [];
  const filteredCharacters = safeCharacters.filter((character) =>
    characterMatchesOfficialSearch(character, query)
  );

  return {
    query: String(query || ""),
    resultCount: filteredCharacters.length,
    totalCount: safeCharacters.length,
    cards: filteredCharacters.map((character, index) => ({
      id: getCharacterItemId(character, index),
      ...getStudioCharacterCardViewProps({ character }),
    })),
    searchEyebrow: "Character Search",
    searchPlaceholder: "Search name, faction, tag, realm...",
    emptyTitle: "No characters found",
    emptyMessage:
      "Try searching by character name, faction, realm, tag, or theme.",
    onChangeQuery,
  };
}

export function useOfficialCharactersGridViewModel({ characters = [] } = {}) {
  const [query, setQuery] = useState("");

  return useMemo(
    () =>
      getOfficialCharactersGridViewProps({
        characters,
        query,
        onChangeQuery: setQuery,
      }),
    [characters, query]
  );
}
