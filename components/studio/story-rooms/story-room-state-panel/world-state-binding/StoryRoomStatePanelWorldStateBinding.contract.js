import {
  STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION,
} from "../StoryRoomStatePanel.contract.js";

import {
  STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
} from "../../story-room-world-state-projection/StoryRoomWorldStateProjection.contract.js";

export const STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION =
  "story_room_state_panel_world_state_binding_v1";

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

function cloneRow(row = {}) {
  return {
    id: text(row.id),
    label: text(row.label),
    value:
      row.value === null || row.value === undefined
        ? ""
        : String(row.value),
  };
}

function cloneSection(section = {}) {
  return {
    id: text(section.id),
    iconKey: text(section.iconKey),
    title: text(section.title),
    rows: array(section.rows).map(cloneRow),
  };
}

function replaceScenarioObjective(section, objective) {
  if (section.id !== "scenario-phase") {
    return section;
  }

  const rows = section.rows.map((row) =>
    row.id === "objective"
      ? {
          ...row,
          value: text(objective),
        }
      : row
  );

  const hasObjective = rows.some(
    (row) => row.id === "objective"
  );

  return {
    ...section,
    rows: hasObjective
      ? rows
      : [
          ...rows,
          {
            id: "objective",
            label: "Objective",
            value: text(objective),
          },
        ],
  };
}

function normalizeWorldStateSection(
  worldStatePresentation = {}
) {
  const source = object(worldStatePresentation);
  const section = object(source.worldStateSection);

  if (
    text(section.id) &&
    array(section.rows).length > 0
  ) {
    return cloneSection(section);
  }

  return {
    id: "world-state",
    iconKey: "world",
    title: "World State",
    rows: [
      {
        id: "location",
        label: "Location",
        value:
          text(source.location) ||
          "Unspecified Location",
      },
      {
        id: "time",
        label: "Time",
        value:
          text(source.timeLabel) ||
          "Unknown",
      },
      {
        id: "time-source",
        label: "Time Source",
        value:
          text(
            source?.engineModuleState?.timeSource
          ) || "Room State",
      },
      {
        id: "weather",
        label: "Weather",
        value:
          text(source.weather) ||
          "Unknown",
      },
      {
        id: "weather-source",
        label: "Weather Source",
        value:
          text(
            source?.engineModuleState?.weatherSource
          ) || "Room State",
      },
    ],
  };
}

export function projectStoryRoomStatePanelWorldStateBinding({
  basePanel = {},
  worldStatePresentation = null,
} = {}) {
  const base = object(basePanel);
  const worldState = object(
    worldStatePresentation
  );

  const worldStateAvailable =
    text(worldState.contractVersion) ===
    STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION;

  const baseSections = array(base.sections).map(cloneSection);

  if (!worldStateAvailable) {
    return {
      bindingContractVersion:
        STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION,
      statePanelViewContractVersion:
        STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION,
      worldStatePresentationContractVersion:
        STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
      worldStateBound: false,
      storyRoomStatePanelProps: {
        ...base,
        sections: baseSections,
      },
      architecture: {
        roomSnapshotLoadingOwnedByChassis: true,
        engineModuleInvocationOwnedByChassis: true,
        locationRuntimeMutationOwnedByChassis: true,
        worldStateProjectionOwnedByFeSemanticPackage: true,
        statePanelVisualCompositionOwnedByFe: true,
        nonWorldSectionsPreserved: true,
      },
    };
  }

  const authoritativeWorldSection =
    normalizeWorldStateSection(worldState);

  let worldSectionInserted = false;

  const sections = baseSections.map((section) => {
    if (section.id === "world-state") {
      worldSectionInserted = true;
      return authoritativeWorldSection;
    }

    return replaceScenarioObjective(
      section,
      worldState.objective
    );
  });

  const boundSections = worldSectionInserted
    ? sections
    : [
        ...sections,
        authoritativeWorldSection,
      ];

  return {
    bindingContractVersion:
      STORY_ROOM_STATE_PANEL_WORLD_STATE_BINDING_CONTRACT_VERSION,
    statePanelViewContractVersion:
      STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION,
    worldStatePresentationContractVersion:
      STORY_ROOM_WORLD_STATE_PRESENTATION_CONTRACT_VERSION,
    worldStateBound: true,

    storyRoomStatePanelProps: {
      ...base,
      sections: boundSections,
    },

    functionalWiringStatus: {
      authoritativeSnapshotBridge:
        "WIRED",
      worldStateProjection:
        "WIRED",
      chronicleStatePanelBinding:
        "WIRED",
      roomLocationAuthority:
        "WIRED",
    },

    boundWorldState: {
      location:
        text(worldState.location) ||
        "Unspecified Location",
      timeLabel:
        text(worldState.timeLabel) ||
        "Unknown",
      weather:
        text(worldState.weather) ||
        "Unknown",
      objective:
        text(worldState.objective),
      turnCount:
        Number.isFinite(Number(worldState.turnCount))
          ? Number(worldState.turnCount)
          : 0,
      worldDay:
        Number.isFinite(Number(worldState.worldDay))
          ? Number(worldState.worldDay)
          : 1,
      worldTimeMinutes:
        Number.isFinite(
          Number(worldState.worldTimeMinutes)
        )
          ? Number(worldState.worldTimeMinutes)
          : null,
      timeSource:
        text(
          worldState?.engineModuleState?.timeSource
        ) || "Room State",
      weatherSource:
        text(
          worldState?.engineModuleState?.weatherSource
        ) || "Room State",
    },

    architecture: {
      roomSnapshotLoadingOwnedByChassis: true,
      engineModuleInvocationOwnedByChassis: true,
      locationRuntimeMutationOwnedByChassis: true,
      worldStateProjectionOwnedByFeSemanticPackage: true,
      statePanelVisualCompositionOwnedByFe: true,
      nonWorldSectionsPreserved: true,
    },
  };
}
