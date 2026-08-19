"use client";

import {
  projectStoryRoomWorldStatePresentation,
} from "../story-room-world-state-projection/StoryRoomWorldStateProjection.contract.js";
import {
  projectStoryRoomStatePanelWorldStateBinding,
} from "./world-state-binding/StoryRoomStatePanelWorldStateBinding.contract.js";

function displayValue(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function createRow(id, label, value, fallback = "") {
  return {
    id,
    label,
    value: displayValue(value, fallback),
  };
}

function buildSections(room = {}) {
  const engineModuleState =
    room?.engineModuleState && typeof room.engineModuleState === "object"
      ? room.engineModuleState
      : {};

  return [
    {
      id: "scenario-phase",
      iconKey: "scenario",
      title: "Scenario Phase",
      rows: [
        createRow("current", "Current", room?.phase),
        createRow("objective", "Objective", room?.objective),
        createRow("scenario", "Scenario", room?.scenario),
      ],
    },
    {
      id: "world-state",
      iconKey: "world",
      title: "World State",
      rows: [
        createRow("location", "Location", room?.location),
        createRow("time", "Time", room?.timeLabel, "Unknown"),
        createRow(
          "time-source",
          "Time Source",
          engineModuleState.timeSource,
          "Room State"
        ),
        createRow("weather", "Weather", room?.weather, "Unknown"),
        createRow(
          "weather-source",
          "Weather Source",
          engineModuleState.weatherSource,
          "Room State"
        ),
      ],
    },
    {
      id: "knowledge-boundaries",
      iconKey: "knowledge",
      title: "Knowledge Boundaries",
      rows: [
        createRow("mode", "Mode", "Strict"),
        createRow("hidden-rewards", "Hidden rewards", "Protected"),
        createRow("npc-over-knowledge", "NPC over-knowledge", "Blocked later"),
      ],
    },
    {
      id: "memory",
      iconKey: "memory",
      title: "Memory",
      rows: [
        createRow("summary", "Summary", "No long-term summary yet"),
        createRow("recent-events", "Recent events", "Opening scene active"),
        createRow("rollover", "Rollover", "Not needed"),
      ],
    },
  ];
}

function buildActions() {
  return [
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
}

export function useStoryRoomStatePanelViewModel({
  room,
  snapshot = null,
  onClose,
} = {}) {
  const basePanel = {
    eyebrow: "Chronicle State",
    title: "Story Data",
    sections: buildSections(room),
    actions: buildActions(),
    showCloseControl: typeof onClose === "function",
    onClosePanel: typeof onClose === "function" ? onClose : null,
  };

  const hasAuthoritativeSnapshot = Boolean(
    snapshot &&
      typeof snapshot === "object" &&
      (
        snapshot.room ||
        snapshot.state ||
        Array.isArray(snapshot.messages)
      )
  );

  const worldStatePresentation =
    hasAuthoritativeSnapshot
      ? projectStoryRoomWorldStatePresentation({
          snapshot,
        })
      : null;

  return projectStoryRoomStatePanelWorldStateBinding({
    basePanel,
    worldStatePresentation,
  }).storyRoomStatePanelProps;
}
