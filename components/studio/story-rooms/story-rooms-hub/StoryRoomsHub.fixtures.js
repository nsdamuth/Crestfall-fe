const FIXTURE_NOW = "2026-08-01T20:00:00.000Z";

export const storyRoomsHubRoomsFixture = Object.freeze([
  {
    id: "room-aethelgard-arrival",
    title: "Ashes Over Aethelgard",
    subtitle: "Market Arrival",
    type: "Active Room",
    status: "ACTIVE",
    visibility: "PUBLIC",
    contentRating: "SFW",
    scenario: "The Brass Market Arrival",
    narrator: "Keeper of Embers",
    location: "Aethelgard Brass Market",
    roomMode: "Private Character Chat",
    cast: ["Mara Vey", "Toren Ashfall"],
    lastMessage: "The bells over the eastern gate began to answer one another.",
    lastActive: "2026-08-01T19:42:00.000Z",
    messages: 84,
  },
  {
    id: "room-workshop-template",
    title: "Clockwork Workshop",
    subtitle: "Reusable Story Setup",
    type: "Story Template",
    status: "TEMPLATE",
    visibility: "PRIVATE",
    contentRating: "SFW",
    scenario: "The Silent Workshop",
    narrator: "Crestfall Engine",
    location: "Old Crescent Workshop",
    roomMode: "Template",
    cast: ["Ilyra Voss"],
    lastMessage: "A reusable opening waits for its cast.",
    lastActive: "2026-07-31T18:00:00.000Z",
    messages: 0,
  },
  {
    id: "room-private-investigation",
    title: "Lanterns Below the Archive",
    subtitle: "Private Investigation",
    type: "Active Room",
    status: "ACTIVE",
    visibility: "PRIVATE",
    contentRating: "SFW",
    scenario: "The Missing Ledger",
    narrator: "Archivist Sel",
    location: "Civic Archive Lower Stacks",
    roomMode: "Private Character Chat",
    cast: ["You", "Archivist Sel"],
    lastMessage: "The dust had been disturbed around only one locked drawer.",
    lastActive: "2026-07-30T20:00:00.000Z",
    messages: 36,
  },
  {
    id: "room-archived-crossing",
    title: "Crossing at Redwater",
    subtitle: "Completed Session",
    type: "Archived Room",
    status: "ARCHIVED",
    visibility: "PRIVATE",
    contentRating: "SFW",
    scenario: "The Flooded Causeway",
    narrator: "Roadwarden Hale",
    location: "Redwater Crossing",
    roomMode: "Private Character Chat",
    cast: ["Hale", "Nera"],
    lastMessage: "By dawn, the last wagon had reached the northern bank.",
    lastActive: "2026-07-18T14:00:00.000Z",
    messages: 129,
  },
]);

export const storyRoomsHubPopulatedFixture = Object.freeze({
  rooms: storyRoomsHubRoomsFixture,
  loading: false,
  loadError: "",
  deleteError: "",
  deletingRooms: false,
  mobileToolsOpen: false,
  activeFilter: "ACTIVE",
  query: "",
  viewMode: "grid",
  manageMode: false,
  selectedRoomIds: [],
  now: Date.parse(FIXTURE_NOW),
});

export const storyRoomsHubLoadingFixture = Object.freeze({
  ...storyRoomsHubPopulatedFixture,
  rooms: [],
  loading: true,
});

export const storyRoomsHubEmptyFixture = Object.freeze({
  ...storyRoomsHubPopulatedFixture,
  rooms: [],
});

export const storyRoomsHubLoadErrorFixture = Object.freeze({
  ...storyRoomsHubEmptyFixture,
  loadError: "Stories could not be loaded.",
});

export const storyRoomsHubDeleteErrorFixture = Object.freeze({
  ...storyRoomsHubPopulatedFixture,
  manageMode: true,
  selectedRoomIds: ["room-aethelgard-arrival"],
  deleteError: "Storys could not be deleted.",
});
