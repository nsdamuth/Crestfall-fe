export const CHAT_PARTY_ROSTER_CONTRACT_VERSION = "1.0.0";

export const CHAT_PARTY_ROSTER_FILTER_KEYS = Object.freeze({
  ALL: "all",
  CHARACTERS: "characters",
  NPCS: "npcs",
  LIKED: "liked",
});

export const CHAT_PARTY_ROSTER_MAX_PARTY_SIZE = 5;

/**
 * Portable View contract, new package, build-0823 pass 2 (RULED 23
 * Aug 2026, the Party roster ruling). The selection surface opened by
 * chat-cast-panel's onOpenPartyRoster: search, filter chips (All,
 * Characters, NPCs, Liked), a Recent sort, and 44px rows each showing
 * an add control or an "In party" label. Desktop renders as a
 * KitModalFrame variant="modal" panel (its ruled responsive behavior:
 * centered at 700px and up, bottom-anchored under 700px), matching
 * the ruled 560px desktop width; the frame's circle-x close is the
 * ruled close control at every width. The View does not receive raw
 * Character/NPC records or call an API; search, filter, and sort are
 * caller-owned (fixture-driven at this wave, per CR-042 client-side
 * scope), reported through semantic callbacks.
 *
 * @typedef {Object} ChatPartyRosterRow
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} avatarUrl
 * @property {string} fallbackInitial
 * @property {string} color CSS color, the row's --chat-speaker anchor for its avatar tile.
 * @property {"characters"|"npcs"} kind
 * @property {boolean} liked
 * @property {boolean} inParty
 *
 * @typedef {Object} ChatPartyRosterFilterChip
 * @property {"all"|"characters"|"npcs"|"liked"} value
 * @property {string} label
 *
 * @typedef {Object} ChatPartyRosterViewProps
 * @property {string} title
 * @property {string} slotCountLabel e.g. "3 of 5 slots filled".
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {ChatPartyRosterFilterChip[]} filterChips
 * @property {string} activeFilter
 * @property {string} sortLabel
 * @property {ChatPartyRosterRow[]} rows
 * @property {boolean} atCap Party already has CHAT_PARTY_ROSTER_MAX_PARTY_SIZE members; every add control disables with the word "Party full" beside it.
 * @property {boolean} loading
 * @property {string} errorMessage
 * @property {(() => void)|null} onClose
 * @property {((value: string) => void)|null} onChangeSearch
 * @property {((value: string) => void)|null} onSelectFilter
 * @property {((memberId: string) => void)|null} onAddMember
 * @property {((memberId: string) => void)|null} onRemoveMember
 */
