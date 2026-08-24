"use client";

import { useMemo, useState } from "react";

import { CHAT_PARTY_ROSTER_FILTER_KEYS, CHAT_PARTY_ROSTER_MAX_PARTY_SIZE } from "./ChatPartyRoster.contract";

const FILTER_CHIPS = [
  { value: CHAT_PARTY_ROSTER_FILTER_KEYS.ALL, label: "All" },
  { value: CHAT_PARTY_ROSTER_FILTER_KEYS.CHARACTERS, label: "Characters" },
  { value: CHAT_PARTY_ROSTER_FILTER_KEYS.NPCS, label: "NPCs" },
  { value: CHAT_PARTY_ROSTER_FILTER_KEYS.LIKED, label: "Liked" },
];

function normalizeSearch(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesFilter(candidate, filter) {
  if (filter === CHAT_PARTY_ROSTER_FILTER_KEYS.ALL) return true;
  if (filter === CHAT_PARTY_ROSTER_FILTER_KEYS.CHARACTERS) return candidate.kind === "characters";
  if (filter === CHAT_PARTY_ROSTER_FILTER_KEYS.NPCS) return candidate.kind === "npcs";
  if (filter === CHAT_PARTY_ROSTER_FILTER_KEYS.LIKED) return Boolean(candidate.liked);
  return true;
}

/**
 * ViewModel for the portable chat-party-roster View, new package,
 * build-0823 pass 2 (RULED 23 Aug 2026). Owns client-side search,
 * filter, and Recent sort over the caller-supplied candidate list
 * (fixture-driven at this wave, CR-042 client-side scope). Does not
 * call an API or own party persistence; onAddMember/onRemoveMember are
 * caller-provided (the page ViewModel applies them to mock state).
 */
export function useChatPartyRosterViewModel({
  title = "Party",
  candidates = [],
  partySize = 0,
  loading = false,
  errorMessage = "",
  onClose,
  onAddMember,
  onRemoveMember,
} = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState(CHAT_PARTY_ROSTER_FILTER_KEYS.ALL);

  const atCap = partySize >= CHAT_PARTY_ROSTER_MAX_PARTY_SIZE;

  const rows = useMemo(() => {
    const query = normalizeSearch(searchValue);
    const safeCandidates = Array.isArray(candidates) ? candidates : [];

    return safeCandidates
      .filter((candidate) => matchesFilter(candidate, activeFilter))
      .filter((candidate) => !query || normalizeSearch(candidate.name).includes(query))
      .map((candidate) => ({ ...candidate }));
  }, [candidates, activeFilter, searchValue]);

  return {
    title,
    slotCountLabel: `${partySize} of ${CHAT_PARTY_ROSTER_MAX_PARTY_SIZE} slots filled`,
    searchValue,
    searchPlaceholder: "Search characters and NPCs",
    filterChips: FILTER_CHIPS,
    activeFilter,
    sortLabel: "Recent",
    rows,
    atCap,
    loading: Boolean(loading),
    errorMessage: String(errorMessage || ""),
    onClose: () => onClose?.(),
    onChangeSearch: (value) => setSearchValue(value),
    onSelectFilter: (value) => setActiveFilter(value),
    onAddMember: (memberId) => onAddMember?.(memberId),
    onRemoveMember: (memberId) => onRemoveMember?.(memberId),
  };
}
