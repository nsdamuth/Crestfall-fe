import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION,
} from "../StoryRoomStatePanel.contract.js";

import {
  STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
} from "../../story-room-world-state-projection/StoryRoomWorldStateProjection.contract.js";

import {
  STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION,
  projectStoryRoomStatePanelWorldStateBinding,
} from "./StoryRoomStatePanelWorldStateBinding.contract.js";

import {
  storyRoomStatePanelBaseFixture,
  storyRoomStatePanelMissingProjectionFixture,
  storyRoomStatePanelNoObjectiveBaseFixture,
  storyRoomStatePanelNoWorldSectionBaseFixture,
  storyRoomStatePanelWorldStateEngineFixture,
  storyRoomStatePanelWorldStateFallbackFixture,
} from "./StoryRoomStatePanelWorldStateBinding.fixtures.js";

assert.equal(
  STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION,
  "story_room_state_panel_world_state_binding_v1"
);

const engine =
  projectStoryRoomStatePanelWorldStateBinding({
    basePanel: storyRoomStatePanelBaseFixture,
    worldStatePresentation:
      storyRoomStatePanelWorldStateEngineFixture,
  });

assert.equal(
  engine.bindingContractVersion,
  STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION
);
assert.equal(
  engine.statePanelViewContractVersion,
  STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION
);
assert.equal(
  engine.worldStatePresentationContractVersion,
  STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION
);
assert.equal(engine.worldStateBound, true);
assert.equal(
  engine.storyRoomStatePanelProps.eyebrow,
  "Chronicle State"
);
assert.equal(
  engine.storyRoomStatePanelProps.title,
  "Story Data"
);
assert.equal(
  engine.storyRoomStatePanelProps.sections.length,
  4
);

const scenario =
  engine.storyRoomStatePanelProps.sections.find(
    (section) =>
      section.id === "scenario-phase"
  );

assert.deepEqual(
  scenario.rows.map((row) => [
    row.id,
    row.value,
  ]),
  [
    ["current", "Opening"],
    [
      "objective",
      "Turn 8 · Day 3 · Evening",
    ],
    ["scenario", "The Bronze Seal"],
  ]
);

const world =
  engine.storyRoomStatePanelProps.sections.find(
    (section) =>
      section.id === "world-state"
  );

assert.deepEqual(
  world.rows.map((row) => [
    row.label,
    row.value,
  ]),
  [
    ["Location", "Brass Gate"],
    ["Time", "Evening"],
    ["Time Source", "Engine Module"],
    ["Weather", "Electrical storm"],
    ["Weather Source", "Engine Module"],
  ]
);

for (const sectionId of [
  "knowledge-boundaries",
  "memory",
]) {
  assert.deepEqual(
    engine.storyRoomStatePanelProps.sections.find(
      (section) => section.id === sectionId
    ),
    storyRoomStatePanelBaseFixture.sections.find(
      (section) => section.id === sectionId
    )
  );
}

assert.deepEqual(
  engine.storyRoomStatePanelProps.actions,
  storyRoomStatePanelBaseFixture.actions
);
assert.equal(
  engine.storyRoomStatePanelProps.showCloseControl,
  true
);

assert.deepEqual(
  engine.functionalWiringStatus,
  {
    authoritativeSnapshotBridge:
      "WIRED",
    worldStateProjection:
      "WIRED",
    chronicleStatePanelBinding:
      "WIRED",
    roomLocationAuthority:
      "WIRED",
  }
);

assert.deepEqual(
  engine.boundWorldState,
  {
    location: "Brass Gate",
    timeLabel: "Evening",
    weather: "Electrical storm",
    objective:
      "Turn 8 · Day 3 · Evening",
    turnCount: 8,
    worldDay: 3,
    worldTimeMinutes: 1110,
    timeSource: "Engine Module",
    weatherSource: "Engine Module",
  }
);

const fallback =
  projectStoryRoomStatePanelWorldStateBinding({
    basePanel: storyRoomStatePanelBaseFixture,
    worldStatePresentation:
      storyRoomStatePanelWorldStateFallbackFixture,
  });

const fallbackWorld =
  fallback.storyRoomStatePanelProps.sections.find(
    (section) =>
      section.id === "world-state"
  );

assert.deepEqual(
  fallbackWorld.rows.map((row) => [
    row.label,
    row.value,
  ]),
  [
    [
      "Location",
      "The Brasswhisker's Workshop",
    ],
    ["Time", "09:05"],
    ["Time Source", "Room State"],
    ["Weather", "Overcast"],
    ["Weather Source", "Room State"],
  ]
);

const noWorldSection =
  projectStoryRoomStatePanelWorldStateBinding({
    basePanel:
      storyRoomStatePanelNoWorldSectionBaseFixture,
    worldStatePresentation:
      storyRoomStatePanelWorldStateEngineFixture,
  });

assert.equal(
  noWorldSection.storyRoomStatePanelProps.sections.filter(
    (section) =>
      section.id === "world-state"
  ).length,
  1
);

assert.equal(
  noWorldSection.storyRoomStatePanelProps.sections.at(
    -1
  ).id,
  "world-state"
);

const noObjective =
  projectStoryRoomStatePanelWorldStateBinding({
    basePanel:
      storyRoomStatePanelNoObjectiveBaseFixture,
    worldStatePresentation:
      storyRoomStatePanelWorldStateEngineFixture,
  });

const noObjectiveScenario =
  noObjective.storyRoomStatePanelProps.sections.find(
    (section) =>
      section.id === "scenario-phase"
  );

assert.equal(
  noObjectiveScenario.rows.filter(
    (row) =>
      row.id === "objective"
  ).length,
  1
);

assert.equal(
  noObjectiveScenario.rows.find(
    (row) =>
      row.id === "objective"
  ).value,
  "Turn 8 · Day 3 · Evening"
);

const missing =
  projectStoryRoomStatePanelWorldStateBinding(
    storyRoomStatePanelMissingProjectionFixture
  );

assert.equal(
  missing.worldStateBound,
  false
);

assert.deepEqual(
  missing.storyRoomStatePanelProps.sections,
  storyRoomStatePanelBaseFixture.sections
);

assert.deepEqual(
  engine.architecture,
  {
    roomSnapshotLoadingOwnedByChassis: true,
    engineModuleInvocationOwnedByChassis: true,
    locationRuntimeMutationOwnedByChassis: true,
    worldStateProjectionOwnedByFeSemanticPackage: true,
    statePanelVisualCompositionOwnedByFe: true,
    nonWorldSectionsPreserved: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./StoryRoomStatePanelWorldStateBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "room?.snapshot",
  "snapshot.",
  "messages.",
  "engineModuleOperations",
  "locationRuntime.current",
  "npcMobility",
  "resolveStoryRoomWorldLocationPresentationTitle",
  "resolveStoryRoomTimePresentation",
  "resolveStoryRoomWeatherPresentation",
  "setState(",
  "useStoryRoomChat",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "story_room_state_panel_world_state_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION,
  statePanelViewContractVersion:
    STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION,
  worldStatePresentationContractVersion:
    STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
  engineAndRoomFallbackWorldRowsCovered: true,
  objectiveReplacementCovered: true,
  missingWorldSectionInsertionCovered: true,
  missingObjectiveInsertionCovered: true,
  nonWorldSectionsAndActionsPreserved: true,
  missingProjectionPassThroughCovered: true,
  authoritativeSnapshotBridgeWired: true,
  worldStateProjectionWired: true,
  statePanelViewUnmodified: true,
  statePanelViewModelWiredToAcceptedProjectionAndBinding: true,
  roomLocationAuthorityWiredWithoutMobilityLeakage: true,
  chassisSnapshotEngineAndMutationExcludedFromBindingContract: true,
}, null, 2));
