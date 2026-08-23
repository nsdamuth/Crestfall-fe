function noop() {}

const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23315E8A'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3EV%3C/text%3E%3C/svg%3E";

const FILTER_CHIPS = [
  { value: "all", label: "All" },
  { value: "characters", label: "Characters" },
  { value: "npcs", label: "NPCs" },
  { value: "liked", label: "Liked" },
];

function rosterRow({ id, name, role, avatarUrl = "", color = "", kind = "characters", liked = false, inParty = false }) {
  return {
    id,
    name,
    role,
    avatarUrl,
    fallbackInitial: name.slice(0, 1).toUpperCase(),
    color,
    kind,
    liked,
    inParty,
  };
}

const BASE_ROWS = [
  rosterRow({ id: "verena", name: "Lady Verena Ashcroft", role: "Character", avatarUrl: AVATAR_DATA_URL, color: "#e0ab5e", liked: true, inParty: true }),
  rosterRow({ id: "thane", name: "Thane Corvid", role: "Character", color: "#3ba6a0", liked: true }),
  rosterRow({ id: "mara", name: "Mara Venn", role: "NPC", kind: "npcs", color: "#c25a8f", inParty: true }),
  rosterRow({ id: "sable", name: "Sable Orr", role: "NPC", kind: "npcs" }),
  rosterRow({ id: "ilyan", name: "Ilyan Moss", role: "Character", liked: true }),
];

const BASE_FIXTURE = {
  title: "Party",
  slotCountLabel: "2 of 5 slots filled",
  searchValue: "",
  searchPlaceholder: "Search characters and NPCs",
  filterChips: FILTER_CHIPS,
  activeFilter: "all",
  sortLabel: "Recent",
  rows: BASE_ROWS,
  atCap: false,
  loading: false,
  errorMessage: "",
  onClose: noop,
  onChangeSearch: noop,
  onSelectFilter: noop,
  onAddMember: noop,
  onRemoveMember: noop,
};

export const chatPartyRosterDefaultFixture = BASE_FIXTURE;

export const chatPartyRosterEmptyResultsFixture = {
  ...BASE_FIXTURE,
  searchValue: "zzz",
  rows: [],
};

export const chatPartyRosterFullPartyFixture = {
  ...BASE_FIXTURE,
  slotCountLabel: "5 of 5 slots filled",
  atCap: true,
  rows: BASE_ROWS.map((row, index) => ({ ...row, inParty: index < 5 })),
};

export const chatPartyRosterLoadingFixture = {
  ...BASE_FIXTURE,
  loading: true,
  rows: [],
};

export const chatPartyRosterErrorFixture = {
  ...BASE_FIXTURE,
  errorMessage: "The roster could not be loaded.",
  rows: [],
};

export const chatPartyRosterLongestFixture = {
  ...BASE_FIXTURE,
  rows: BASE_ROWS.map((row) => ({
    ...row,
    name: `${row.name} of the Lower Lantern District and Western Archive`,
    role: "Senior Participant in the Observatory Ledger Investigation",
  })),
};

export const chatPartyRosterMobileFixture = BASE_FIXTURE;

export const chatPartyRosterFixtures = [
  { id: "default", label: "Default, open slots remain", props: chatPartyRosterDefaultFixture },
  { id: "empty", label: "Empty results", props: chatPartyRosterEmptyResultsFixture },
  { id: "full-party", label: "Full party, adds disabled", props: chatPartyRosterFullPartyFixture },
  { id: "loading", label: "Loading", props: chatPartyRosterLoadingFixture },
  { id: "error", label: "Error", props: chatPartyRosterErrorFixture },
  { id: "longest", label: "Longest content", props: chatPartyRosterLongestFixture },
  { id: "mobile", label: "Mobile (modal variant, bottom-anchored under 700px)", props: chatPartyRosterMobileFixture },
];
