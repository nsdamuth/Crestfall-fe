import { CHAT_STATE_PANEL_DELETE_CONFIRMATION } from "./ChatStatePanel.contract";

function noop() {}

const ENTRY_ACTIONS = [
  { id: "share-snapshot", iconKey: "share", label: "Share", disabled: false, onPress: noop },
  { id: "export-chat", iconKey: "download", label: "Export", disabled: false, onPress: noop },
  { id: "delete-story", iconKey: "delete", label: "Delete", disabled: false, onPress: noop },
];

function row(id, label, value) {
  return { id, label, value };
}

function section(id, iconKey, title, rows) {
  return { id, iconKey, title, rows };
}

function standardSections({
  location = "The Brass Finch",
  time = "Morning",
  weather = "Light rain",
  mode = "Strict",
  hiddenRewards = "Protected",
  overKnowledge = "Blocked later",
  mechanicsMode = "Freeform",
  activeRules = "None active",
} = {}) {
  return [
    section("world", "world", "World", [
      row("location", "Location", location),
      row("time", "Time", time),
      row("weather", "Weather", weather),
    ]),
    section("knowledge", "knowledge", "Knowledge", [
      row("mode", "Mode", mode),
      row("hidden-rewards", "Hidden rewards", hiddenRewards),
      row("npc-over-knowledge", "NPC over-knowledge", overKnowledge),
    ]),
    section("mechanics", "mechanics", "Mechanics", [
      row("mechanics-mode", "Mode", mechanicsMode),
      row("active-rules", "Active rules", activeRules),
    ]),
  ];
}

export const chatStatePanelCompleteFixture = {
  eyebrow: "Chronicle State",
  title: "Story Data",
  sections: standardSections(),
  actions: ENTRY_ACTIONS,
  showCloseControl: true,
  initialMobileOpen: false,
  deletePending: false,
  onClosePanel: noop,
  onDeleteRoom: noop,
};

export const chatStatePanelRoomFallbackFixture = {
  ...chatStatePanelCompleteFixture,
  sections: standardSections({
    location: "Unspecified Location",
    time: "Unknown",
    weather: "Unknown",
  }),
};

export const chatStatePanelEmptySectionsFixture = {
  ...chatStatePanelCompleteFixture,
  sections: [],
};

export const chatStatePanelLoadingFixture = {
  ...chatStatePanelCompleteFixture,
  sections: standardSections({
    location: "Loading",
    time: "Loading",
    weather: "Loading",
    mechanicsMode: "Loading",
    activeRules: "Loading",
  }),
  actions: ENTRY_ACTIONS.map((action) => ({ ...action, disabled: true })),
};

export const chatStatePanelErrorFixture = {
  ...chatStatePanelCompleteFixture,
  sections: [section("world", "world", "World", [row("location", "Location", "Unavailable")])],
};

export const chatStatePanelNoActionsFixture = {
  ...chatStatePanelCompleteFixture,
  actions: [],
};

export const chatStatePanelMobileOpenFixture = {
  ...chatStatePanelCompleteFixture,
  initialMobileOpen: true,
};

export const chatStatePanelDeleteConfirmFixture = {
  ...chatStatePanelCompleteFixture,
  deleteConfirm: {
    open: true,
    message: CHAT_STATE_PANEL_DELETE_CONFIRMATION,
    pending: false,
    error: "",
    onConfirm: noop,
    onCancel: noop,
  },
};

export const chatStatePanelLongestFixture = {
  ...chatStatePanelCompleteFixture,
  sections: standardSections({
    location: "The sealed archival gallery below the abandoned western observatory",
    weather: "A sustained electrical storm with heavy rain and intermittent hail",
    activeRules: "Wound tracking, encumbrance, and the Lantern District curfew clock",
  }),
};

export const chatStatePanelFixtures = [
  { id: "complete", label: "Complete", props: chatStatePanelCompleteFixture },
  { id: "room-fallback", label: "Room-state fallback", props: chatStatePanelRoomFallbackFixture },
  { id: "empty", label: "Empty sections", props: chatStatePanelEmptySectionsFixture },
  { id: "loading", label: "Loading", props: chatStatePanelLoadingFixture },
  { id: "error", label: "Error, partial data", props: chatStatePanelErrorFixture },
  { id: "no-actions", label: "No entry-point actions", props: chatStatePanelNoActionsFixture },
  { id: "delete-confirm", label: "Delete confirm sheet", props: chatStatePanelDeleteConfirmFixture },
  { id: "mobile-open", label: "Mobile sheet open", props: chatStatePanelMobileOpenFixture },
  { id: "longest", label: "Longest content", props: chatStatePanelLongestFixture },
];

export { CHAT_STATE_PANEL_DELETE_CONFIRMATION };
