function noop() {}

const ENTRY_ACTIONS = [
  { id: "export-chat", iconKey: "download", label: "Export Chat", disabled: false, onPress: noop },
  { id: "share-snapshot", iconKey: "share", label: "Share Snapshot", disabled: false, onPress: noop },
];

function row(id, label, value) {
  return { id, label, value };
}

function section(id, iconKey, title, rows) {
  return { id, iconKey, title, rows };
}

function standardSections({
  phase = "Opening",
  objective = "Turn 2, Day 1, Morning",
  scenario = "The Lantern Below",
  location = "The Brass Finch",
  time = "Morning",
  timeSource = "Engine Module",
  weather = "Light rain",
  weatherSource = "Engine Module",
} = {}) {
  return [
    section("scenario-phase", "scenario", "Scenario Phase", [
      row("current", "Current", phase),
      row("objective", "Objective", objective),
      row("scenario", "Scenario", scenario),
    ]),
    section("world-state", "world", "World State", [
      row("location", "Location", location),
      row("time", "Time", time),
      row("time-source", "Time Source", timeSource),
      row("weather", "Weather", weather),
      row("weather-source", "Weather Source", weatherSource),
    ]),
    section("knowledge-boundaries", "knowledge", "Knowledge Boundaries", [
      row("mode", "Mode", "Strict"),
      row("hidden-rewards", "Hidden rewards", "Protected"),
      row("npc-over-knowledge", "NPC over-knowledge", "Blocked later"),
    ]),
    section("memory", "memory", "Memory", [
      row("summary", "Summary", "No long-term summary yet"),
      row("recent-events", "Recent events", "Opening scene active"),
      row("rollover", "Rollover", "Not needed"),
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
  onClosePanel: noop,
};

export const chatStatePanelRoomFallbackFixture = {
  ...chatStatePanelCompleteFixture,
  sections: standardSections({
    phase: "",
    objective: "Turn 0, Day 1, Unknown",
    scenario: "Character Chat",
    location: "Unspecified Location",
    time: "Unknown",
    timeSource: "Room State",
    weather: "Unknown",
    weatherSource: "Room State",
  }),
};

export const chatStatePanelEmptySectionsFixture = {
  ...chatStatePanelCompleteFixture,
  sections: [],
};

export const chatStatePanelLoadingFixture = {
  ...chatStatePanelCompleteFixture,
  sections: standardSections({
    phase: "Loading",
    objective: "Loading",
    scenario: "Loading",
    location: "Loading",
    time: "Loading",
    timeSource: "",
    weather: "Loading",
    weatherSource: "",
  }),
  actions: ENTRY_ACTIONS.map((action) => ({ ...action, disabled: true })),
};

export const chatStatePanelErrorFixture = {
  ...chatStatePanelCompleteFixture,
  sections: [
    section("scenario-phase", "scenario", "Scenario Phase", [
      row("current", "Current", "Unavailable"),
    ]),
  ],
};

export const chatStatePanelNoActionsFixture = {
  ...chatStatePanelCompleteFixture,
  actions: [],
};

export const chatStatePanelMobileOpenFixture = {
  ...chatStatePanelCompleteFixture,
  initialMobileOpen: true,
};

export const chatStatePanelLongestFixture = {
  ...chatStatePanelCompleteFixture,
  sections: standardSections({
    phase: "Negotiation at the threshold before the final descent",
    objective:
      "Turn 128, Day 14, Late Evening. Resolve the disputed passage without exposing the hidden registry participant",
    scenario: "The Unreasonably Long Chronicle of the Lantern Keepers Beneath the Western Observatory",
    location: "The sealed archival gallery below the abandoned western observatory",
    weather: "A sustained electrical storm with heavy rain and intermittent hail",
  }),
};

export const chatStatePanelFixtures = [
  { id: "complete", label: "Complete, engine-sourced", props: chatStatePanelCompleteFixture },
  { id: "room-fallback", label: "Room-state fallback", props: chatStatePanelRoomFallbackFixture },
  { id: "empty", label: "Empty sections", props: chatStatePanelEmptySectionsFixture },
  { id: "loading", label: "Loading", props: chatStatePanelLoadingFixture },
  { id: "error", label: "Error, partial data", props: chatStatePanelErrorFixture },
  { id: "no-actions", label: "No entry-point actions", props: chatStatePanelNoActionsFixture },
  { id: "mobile-open", label: "Mobile sheet open", props: chatStatePanelMobileOpenFixture },
  { id: "longest", label: "Longest content", props: chatStatePanelLongestFixture },
];
