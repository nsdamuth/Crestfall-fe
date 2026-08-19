export const storyRoomStatePanelBaseFixture =
  Object.freeze({
    eyebrow: "Chronicle State",
    title: "Story Data",
    sections: [
      {
        id: "scenario-phase",
        iconKey: "scenario",
        title: "Scenario Phase",
        rows: [
          {
            id: "current",
            label: "Current",
            value: "Opening",
          },
          {
            id: "objective",
            label: "Objective",
            value: "Legacy objective",
          },
          {
            id: "scenario",
            label: "Scenario",
            value: "The Bronze Seal",
          },
        ],
      },
      {
        id: "world-state",
        iconKey: "world",
        title: "World State",
        rows: [
          {
            id: "location",
            label: "Location",
            value: "Legacy Location",
          },
          {
            id: "time",
            label: "Time",
            value: "Legacy Time",
          },
          {
            id: "time-source",
            label: "Time Source",
            value: "Legacy Source",
          },
          {
            id: "weather",
            label: "Weather",
            value: "Legacy Weather",
          },
          {
            id: "weather-source",
            label: "Weather Source",
            value: "Legacy Source",
          },
        ],
      },
      {
        id: "knowledge-boundaries",
        iconKey: "knowledge",
        title: "Knowledge Boundaries",
        rows: [
          {
            id: "mode",
            label: "Mode",
            value: "Strict",
          },
          {
            id: "hidden-rewards",
            label: "Hidden rewards",
            value: "Protected",
          },
        ],
      },
      {
        id: "memory",
        iconKey: "memory",
        title: "Memory",
        rows: [
          {
            id: "summary",
            label: "Summary",
            value: "No long-term summary yet",
          },
        ],
      },
    ],
    actions: [
      {
        id: "export-chat",
        iconKey: "download",
        label: "Export Chat",
        disabled: false,
      },
      {
        id: "share-snapshot",
        iconKey: "share",
        label: "Share Snapshot",
        disabled: false,
      },
    ],
    showCloseControl: true,
    onClosePanel: null,
  });

export const storyRoomStatePanelWorldStateEngineFixture =
  Object.freeze({
    contractVersion:
      "story_room_world_state.presentation.v1",
    location: "Brass Gate",
    timeLabel: "Evening",
    weather: "Electrical storm",
    worldDay: 3,
    worldTimeMinutes: 1110,
    turnCount: 8,
    objective:
      "Turn 8 · Day 3 · Evening",
    engineModuleState: {
      operationCount: 2,
      timeSource: "Engine Module",
      weatherSource: "Engine Module",
      timeModuleId: "core.timeDay.v1",
      weatherModuleId:
        "core.inWorldWeather.v1",
    },
    worldStateSection: {
      id: "world-state",
      iconKey: "world",
      title: "World State",
      rows: [
        {
          id: "location",
          label: "Location",
          value: "Brass Gate",
        },
        {
          id: "time",
          label: "Time",
          value: "Evening",
        },
        {
          id: "time-source",
          label: "Time Source",
          value: "Engine Module",
        },
        {
          id: "weather",
          label: "Weather",
          value: "Electrical storm",
        },
        {
          id: "weather-source",
          label: "Weather Source",
          value: "Engine Module",
        },
      ],
    },
  });

export const storyRoomStatePanelWorldStateFallbackFixture =
  Object.freeze({
    contractVersion:
      "story_room_world_state.presentation.v1",
    location:
      "The Brasswhisker's Workshop",
    timeLabel: "09:05",
    weather: "Overcast",
    worldDay: 1,
    worldTimeMinutes: 545,
    turnCount: 2,
    objective:
      "Turn 2 · Day 1 · 09:05",
    engineModuleState: {
      operationCount: 0,
      timeSource: "Room State",
      weatherSource: "Room State",
      timeModuleId: null,
      weatherModuleId: null,
    },
    worldStateSection: {
      id: "world-state",
      iconKey: "world",
      title: "World State",
      rows: [
        {
          id: "location",
          label: "Location",
          value:
            "The Brasswhisker's Workshop",
        },
        {
          id: "time",
          label: "Time",
          value: "09:05",
        },
        {
          id: "time-source",
          label: "Time Source",
          value: "Room State",
        },
        {
          id: "weather",
          label: "Weather",
          value: "Overcast",
        },
        {
          id: "weather-source",
          label: "Weather Source",
          value: "Room State",
        },
      ],
    },
  });

export const storyRoomStatePanelNoWorldSectionBaseFixture =
  Object.freeze({
    ...storyRoomStatePanelBaseFixture,
    sections:
      storyRoomStatePanelBaseFixture.sections.filter(
        (section) =>
          section.id !== "world-state"
      ),
  });

export const storyRoomStatePanelNoObjectiveBaseFixture =
  Object.freeze({
    ...storyRoomStatePanelBaseFixture,
    sections:
      storyRoomStatePanelBaseFixture.sections.map(
        (section) =>
          section.id === "scenario-phase"
            ? {
                ...section,
                rows: section.rows.filter(
                  (row) =>
                    row.id !== "objective"
                ),
              }
            : section
      ),
  });

export const storyRoomStatePanelMissingProjectionFixture =
  Object.freeze({
    basePanel:
      storyRoomStatePanelBaseFixture,
    worldStatePresentation: null,
  });
