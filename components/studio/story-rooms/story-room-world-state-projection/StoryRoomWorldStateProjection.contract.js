export const STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION =
  "story_room_world_state.presentation.v1";

export const STORY_ROOM_TIME_MODULE_ID = "core.timeDay.v1";
export const STORY_ROOM_WEATHER_MODULE_ID = "core.inWorldWeather.v1";

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveStoryRoomWorldLocationPresentationTitle({
  stateData = {},
  room = {},
} = {}) {
  const safeStateData = object(stateData);
  const safeRoom = object(room);
  const locationRuntime = object(safeStateData.locationRuntime);
  const currentLocation = object(locationRuntime.current);
  const authoredLocation = object(safeStateData.location);

  return (
    text(
      currentLocation.canonicalName ||
        currentLocation.title ||
        currentLocation.name
    ) ||
    text(authoredLocation.title) ||
    (text(safeRoom.locationId)
      ? "Location Attached"
      : "Unspecified Location")
  );
}

export function getLatestStoryRoomEngineModuleOperations(
  messages = []
) {
  const latestMessageWithOperations = array(messages)
    .slice()
    .reverse()
    .find((message) => {
      const metadata = object(message?.metadata);
      const engineModuleOperations = object(
        metadata.engineModuleOperations
      );

      return Array.isArray(
        engineModuleOperations.operations
      );
    });

  return object(
    latestMessageWithOperations?.metadata
      ?.engineModuleOperations
  );
}

export function getCompletedStoryRoomEngineModuleOperation(
  engineModuleOperations,
  moduleId
) {
  return (
    array(engineModuleOperations?.operations).find(
      (operation) =>
        operation?.status === "completed" &&
        operation?.moduleId === moduleId
    ) || null
  );
}

export function resolveStoryRoomTimePresentation(
  engineModuleOperations,
  state = {}
) {
  const safeState = object(state);
  const operation =
    getCompletedStoryRoomEngineModuleOperation(
      engineModuleOperations,
      STORY_ROOM_TIME_MODULE_ID
    );
  const result = object(operation?.result);
  const stateContext = object(result.stateContext);
  const storyTime = object(result.storyTime);

  const engineDay = finiteNumber(
    stateContext.day ?? storyTime.day
  );
  const engineMinutes = finiteNumber(
    stateContext.minutes ?? storyTime.minutes
  );
  const engineTimeLabel = text(
    stateContext.timeLabel || storyTime.timeLabel
  );

  const roomWorldDay =
    finiteNumber(safeState.worldDay) ?? 1;
  const roomWorldMinutes = finiteNumber(
    safeState.worldTimeMinutes
  );
  const roomWorldTimeLabel = text(
    safeState.worldTimeLabel
  );

  const hour =
    roomWorldMinutes === null
      ? null
      : Math.floor(roomWorldMinutes / 60);
  const minute =
    roomWorldMinutes === null
      ? null
      : roomWorldMinutes % 60;

  const clockTimeLabel =
    hour === null
      ? roomWorldTimeLabel || "Unknown"
      : `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;

  return {
    source: operation ? "Engine Module" : "Room State",
    moduleId: operation?.moduleId || null,
    operation,
    day: engineDay ?? roomWorldDay,
    minutes:
      engineMinutes ?? roomWorldMinutes,
    timeLabel:
      engineTimeLabel ||
      roomWorldTimeLabel ||
      clockTimeLabel,
  };
}

export function resolveStoryRoomWeatherPresentation(
  engineModuleOperations,
  stateData = {}
) {
  const safeStateData = object(stateData);
  const operation =
    getCompletedStoryRoomEngineModuleOperation(
      engineModuleOperations,
      STORY_ROOM_WEATHER_MODULE_ID
    );
  const result = object(operation?.result);
  const stateContext = object(result.stateContext);

  const engineWeather = text(
    stateContext.weather || result.weather
  );
  const legacyWeather = text(
    safeStateData.weather?.condition ||
      safeStateData.weather?.label ||
      safeStateData.weather?.current ||
      safeStateData.currentWeather
  );

  return {
    source: operation ? "Engine Module" : "Room State",
    moduleId: operation?.moduleId || null,
    operation,
    weather:
      engineWeather ||
      legacyWeather ||
      "Unknown",
  };
}

export function projectStoryRoomWorldStatePresentation({
  snapshot = {},
} = {}) {
  const safeSnapshot = object(snapshot);
  const room = object(safeSnapshot.room);
  const state = object(safeSnapshot.state);
  const stateData = object(state.state);
  const messages = array(safeSnapshot.messages);
  const engineModuleOperations =
    getLatestStoryRoomEngineModuleOperations(messages);

  const location =
    resolveStoryRoomWorldLocationPresentationTitle({
      stateData,
      room,
    });

  const time = resolveStoryRoomTimePresentation(
    engineModuleOperations,
    state
  );

  const weather =
    resolveStoryRoomWeatherPresentation(
      engineModuleOperations,
      stateData
    );

  const turnCount =
    finiteNumber(state.turnCount) ?? 0;

  const objective = `Turn ${turnCount} · Day ${time.day} · ${time.timeLabel}`;

  return {
    contractVersion:
      STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
    location,
    timeLabel: time.timeLabel,
    weather: weather.weather,
    worldDay: time.day,
    worldTimeMinutes: time.minutes,
    turnCount,
    objective,
    engineModuleState: {
      operationCount:
        finiteNumber(
          engineModuleOperations.operationCount
        ) ?? 0,
      timeSource: time.source,
      weatherSource: weather.source,
      timeModuleId: time.moduleId,
      weatherModuleId: weather.moduleId,
    },
    worldStateSection: {
      id: "world-state",
      iconKey: "world",
      title: "World State",
      rows: [
        {
          id: "location",
          label: "Location",
          value: location,
        },
        {
          id: "time",
          label: "Time",
          value: time.timeLabel || "Unknown",
        },
        {
          id: "time-source",
          label: "Time Source",
          value: time.source,
        },
        {
          id: "weather",
          label: "Weather",
          value: weather.weather || "Unknown",
        },
        {
          id: "weather-source",
          label: "Weather Source",
          value: weather.source,
        },
      ],
    },
  };
}
