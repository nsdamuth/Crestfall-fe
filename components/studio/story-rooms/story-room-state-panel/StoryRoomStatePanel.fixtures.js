const FUTURE_ACTIONS = [
  {
    id: "export-chat",
    iconKey: "download",
    label: "Export Chat Soon",
    disabled: true,
  },
  {
    id: "share-snapshot",
    iconKey: "share",
    label: "Share Snapshot Soon",
    disabled: true,
  },
];

function row(id, label, value) {
  return { id, label, value };
}

function section(id, iconKey, title, rows) {
  return { id, iconKey, title, rows };
}

function standardSections({
  phase = "Opening",
  objective = "Turn 2 · Day 1 · Morning",
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

export const storyRoomStateEngineFixture = {
  eyebrow: "Chronicle State",
  title: "Story Data",
  sections: standardSections(),
  actions: FUTURE_ACTIONS,
  showCloseControl: true,
  onClosePanel: null,
};

export const storyRoomStateRoomFallbackFixture = {
  ...storyRoomStateEngineFixture,
  sections: standardSections({
    phase: "",
    objective: "Turn 0 · Day 1 · Unknown",
    scenario: "Character Chat",
    location: "Unspecified Location",
    time: "Unknown",
    timeSource: "Room State",
    weather: "Unknown",
    weatherSource: "Room State",
  }),
};

export const storyRoomStateMobileFixture = {
  ...storyRoomStateEngineFixture,
  showCloseControl: false,
};

export const storyRoomStateLongContentFixture = {
  ...storyRoomStateEngineFixture,
  sections: standardSections({
    phase: "Negotiation at the threshold before the final descent",
    objective:
      "Turn 128 · Day 14 · Late Evening · Resolve the disputed passage without exposing the hidden registry participant",
    scenario:
      "The Unreasonably Long Chronicle of the Lantern Keepers Beneath the Western Observatory",
    location:
      "The sealed archival gallery below the abandoned western observatory",
    weather:
      "A sustained electrical storm with heavy rain and intermittent hail",
  }),
};

export const storyRoomStateNoActionsFixture = {
  ...storyRoomStateEngineFixture,
  actions: [],
};

export const storyRoomStateEmptySectionsFixture = {
  ...storyRoomStateEngineFixture,
  sections: [],
};
