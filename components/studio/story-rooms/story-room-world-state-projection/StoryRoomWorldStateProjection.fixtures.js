export const storyRoomWorldStateEngineFixture =
  Object.freeze({
    snapshot: {
      room: {
        id: "room-engine-fixture",
        locationId: "story-start-workshop",
      },
      state: {
        turnCount: 8,
        worldDay: 2,
        worldTimeMinutes: 615,
        worldTimeLabel: "Morning",
        state: {
          location: {
            title: "The Brasswhisker's Workshop",
          },
          locationRuntime: {
            current: {
              kind: "LOCATION_RUNTIME",
              registryCreationId:
                "trade-registry",
              registryEntryId: "brass-gate",
              canonicalName: "Brass Gate",
            },
          },
          weather: {
            condition: "Light rain",
          },
          npcMobility: {
            sceneFocus: {
              title:
                "The Brasswhisker's Workshop",
            },
          },
        },
      },
      messages: [
        {
          id: "message-old",
          metadata: {
            engineModuleOperations: {
              operationCount: 1,
              operations: [
                {
                  status: "completed",
                  moduleId: "core.timeDay.v1",
                  result: {
                    stateContext: {
                      day: 2,
                      minutes: 600,
                      timeLabel: "Morning",
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "message-latest",
          metadata: {
            engineModuleOperations: {
              operationCount: 2,
              operations: [
                {
                  status: "completed",
                  moduleId: "core.timeDay.v1",
                  result: {
                    stateContext: {
                      day: 3,
                      minutes: 1110,
                      timeLabel: "Evening",
                    },
                  },
                },
                {
                  status: "completed",
                  moduleId: "core.inWorldWeather.v1",
                  result: {
                    stateContext: {
                      weather:
                        "Electrical storm",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });

export const storyRoomWorldStateRoomFallbackFixture =
  Object.freeze({
    snapshot: {
      room: {
        id: "room-fallback-fixture",
        locationId: "story-start-workshop",
      },
      state: {
        turnCount: 2,
        worldDay: 1,
        worldTimeMinutes: 545,
        worldTimeLabel: "",
        state: {
          location: {
            title: "The Brasswhisker's Workshop",
          },
          weather: {
            label: "Overcast",
          },
        },
      },
      messages: [],
    },
  });

export const storyRoomWorldStateRuntimeTitleAliasFixture =
  Object.freeze({
    snapshot: {
      room: {
        id: "room-runtime-title-alias",
        locationId: "story-start-workshop",
      },
      state: {
        turnCount: 0,
        state: {
          location: {
            title: "Authored Starting Location",
          },
          locationRuntime: {
            current: {
              title: "Jewelers' Row",
            },
          },
        },
      },
      messages: [],
    },
  });

export const storyRoomWorldStateAttachedOnlyFixture =
  Object.freeze({
    snapshot: {
      room: {
        id: "room-attached-only",
        locationId: "attached-location-id",
      },
      state: {
        turnCount: 0,
        state: {},
      },
      messages: [],
    },
  });

export const storyRoomWorldStateUnspecifiedFixture =
  Object.freeze({
    snapshot: {
      room: {
        id: "room-unspecified",
      },
      state: {
        turnCount: 0,
        state: {},
      },
      messages: [],
    },
  });

export const storyRoomWorldStateIncompleteEngineFixture =
  Object.freeze({
    snapshot: {
      room: {
        id: "room-incomplete-engine",
        locationId: "story-start-workshop",
      },
      state: {
        turnCount: 4,
        worldDay: 7,
        worldTimeLabel: "Late Afternoon",
        state: {
          location: {
            title: "Sunreach",
          },
          currentWeather: "Dry wind",
        },
      },
      messages: [
        {
          id: "message-incomplete",
          metadata: {
            engineModuleOperations: {
              operationCount: 2,
              operations: [
                {
                  status: "failed",
                  moduleId: "core.timeDay.v1",
                  result: {
                    stateContext: {
                      day: 99,
                      timeLabel: "Wrong",
                    },
                  },
                },
                {
                  status: "pending",
                  moduleId: "core.inWorldWeather.v1",
                  result: {
                    weather: "Wrong weather",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });
