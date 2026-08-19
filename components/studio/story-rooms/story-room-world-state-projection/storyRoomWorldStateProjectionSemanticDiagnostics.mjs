import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_ROOM_TIME_MODULE_ID,
  STORY_ROOM_WEATHER_MODULE_ID,
  STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
  getCompletedStoryRoomEngineModuleOperation,
  getLatestStoryRoomEngineModuleOperations,
  projectStoryRoomWorldStatePresentation,
  resolveStoryRoomTimePresentation,
  resolveStoryRoomWeatherPresentation,
  resolveStoryRoomWorldLocationPresentationTitle,
} from "./StoryRoomWorldStateProjection.contract.js";

import {
  storyRoomWorldStateAttachedOnlyFixture,
  storyRoomWorldStateEngineFixture,
  storyRoomWorldStateIncompleteEngineFixture,
  storyRoomWorldStateRoomFallbackFixture,
  storyRoomWorldStateRuntimeTitleAliasFixture,
  storyRoomWorldStateUnspecifiedFixture,
} from "./StoryRoomWorldStateProjection.fixtures.js";

assert.equal(
  STORY_ROOM_TIME_MODULE_ID,
  "core.timeDay.v1"
);
assert.equal(
  STORY_ROOM_WEATHER_MODULE_ID,
  "core.inWorldWeather.v1"
);

const engine =
  projectStoryRoomWorldStatePresentation(
    storyRoomWorldStateEngineFixture
  );

assert.equal(
  engine.contractVersion,
  STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION
);
assert.equal(engine.location, "Brass Gate");
assert.equal(engine.timeLabel, "Evening");
assert.equal(engine.weather, "Electrical storm");
assert.equal(engine.worldDay, 3);
assert.equal(engine.worldTimeMinutes, 1110);
assert.equal(engine.turnCount, 8);
assert.equal(
  engine.objective,
  "Turn 8 · Day 3 · Evening"
);
assert.equal(
  engine.engineModuleState.operationCount,
  2
);
assert.equal(
  engine.engineModuleState.timeSource,
  "Engine Module"
);
assert.equal(
  engine.engineModuleState.weatherSource,
  "Engine Module"
);
assert.equal(
  engine.engineModuleState.timeModuleId,
  STORY_ROOM_TIME_MODULE_ID
);
assert.equal(
  engine.engineModuleState.weatherModuleId,
  STORY_ROOM_WEATHER_MODULE_ID
);
assert.deepEqual(
  engine.worldStateSection.rows.map(
    (row) => [row.label, row.value]
  ),
  [
    ["Location", "Brass Gate"],
    ["Time", "Evening"],
    ["Time Source", "Engine Module"],
    ["Weather", "Electrical storm"],
    ["Weather Source", "Engine Module"],
  ]
);

const fallback =
  projectStoryRoomWorldStatePresentation(
    storyRoomWorldStateRoomFallbackFixture
  );

assert.equal(
  fallback.location,
  "The Brasswhisker's Workshop"
);
assert.equal(fallback.timeLabel, "09:05");
assert.equal(fallback.worldDay, 1);
assert.equal(fallback.worldTimeMinutes, 545);
assert.equal(fallback.weather, "Overcast");
assert.equal(
  fallback.engineModuleState.timeSource,
  "Room State"
);
assert.equal(
  fallback.engineModuleState.weatherSource,
  "Room State"
);
assert.equal(
  fallback.objective,
  "Turn 2 · Day 1 · 09:05"
);

const runtimeAlias =
  projectStoryRoomWorldStatePresentation(
    storyRoomWorldStateRuntimeTitleAliasFixture
  );
assert.equal(runtimeAlias.location, "Jewelers' Row");

const attachedOnly =
  projectStoryRoomWorldStatePresentation(
    storyRoomWorldStateAttachedOnlyFixture
  );
assert.equal(
  attachedOnly.location,
  "Location Attached"
);
assert.equal(attachedOnly.timeLabel, "Unknown");
assert.equal(attachedOnly.weather, "Unknown");
assert.equal(attachedOnly.worldDay, 1);

const unspecified =
  projectStoryRoomWorldStatePresentation(
    storyRoomWorldStateUnspecifiedFixture
  );
assert.equal(
  unspecified.location,
  "Unspecified Location"
);

const incomplete =
  projectStoryRoomWorldStatePresentation(
    storyRoomWorldStateIncompleteEngineFixture
  );
assert.equal(incomplete.location, "Sunreach");
assert.equal(
  incomplete.timeLabel,
  "Late Afternoon"
);
assert.equal(incomplete.worldDay, 7);
assert.equal(incomplete.weather, "Dry wind");
assert.equal(
  incomplete.engineModuleState.timeSource,
  "Room State"
);
assert.equal(
  incomplete.engineModuleState.weatherSource,
  "Room State"
);
assert.equal(
  incomplete.engineModuleState.timeModuleId,
  null
);
assert.equal(
  incomplete.engineModuleState.weatherModuleId,
  null
);

const messages =
  storyRoomWorldStateEngineFixture.snapshot.messages;
const latestOperations =
  getLatestStoryRoomEngineModuleOperations(messages);

assert.equal(latestOperations.operationCount, 2);

const completedTime =
  getCompletedStoryRoomEngineModuleOperation(
    latestOperations,
    STORY_ROOM_TIME_MODULE_ID
  );
assert.equal(completedTime.status, "completed");

assert.equal(
  getCompletedStoryRoomEngineModuleOperation(
    {
      operations: [
        {
          status: "pending",
          moduleId: STORY_ROOM_TIME_MODULE_ID,
        },
      ],
    },
    STORY_ROOM_TIME_MODULE_ID
  ),
  null
);

const timeFallback =
  resolveStoryRoomTimePresentation(
    {},
    {
      worldDay: 5,
      worldTimeMinutes: 61,
    }
  );

assert.equal(timeFallback.day, 5);
assert.equal(timeFallback.timeLabel, "01:01");
assert.equal(timeFallback.source, "Room State");

const weatherFallback =
  resolveStoryRoomWeatherPresentation(
    {},
    {
      weather: {
        current: "Clear",
      },
    }
  );

assert.equal(weatherFallback.weather, "Clear");
assert.equal(
  weatherFallback.source,
  "Room State"
);

assert.equal(
  resolveStoryRoomWorldLocationPresentationTitle({
    stateData: {
      locationRuntime: {
        current: {
          name: "Archive Gallery",
        },
      },
      location: {
        title: "Starting Hall",
      },
    },
    room: {
      locationId: "starting-hall",
    },
  }),
  "Archive Gallery"
);

const source = fs.readFileSync(
  new URL(
    "./StoryRoomWorldStateProjection.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "useStoryRoomChat",
  "npcMobility",
  "sceneFocus",
  "setSnapshot",
  "createChatTurn",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "story_room_world_state_projection_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
  runtimeLocationPrecedenceCovered: true,
  authoredLocationFallbackCovered: true,
  npcMobilityExcludedFromRoomWorldState: true,
  latestCompletedEngineTimeCovered: true,
  latestCompletedEngineWeatherCovered: true,
  failedOrPendingEngineFallbackCovered: true,
  roomTimeWeatherFallbackCovered: true,
  worldStateSectionProjectionCovered: true,
  roomMutationExcluded: true,
  chatOrchestrationExcluded: true,
}, null, 2));
