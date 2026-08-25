"use client";

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
  return [
    {
      id: "world-state",
      iconKey: "world",
      title: "World State",
      rows: [
        createRow("location", "Location", room?.location, "Unknown"),
        createRow("time", "Time", room?.timeLabel, "Unknown"),
        createRow("weather", "Weather", room?.weather, "Unknown"),
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

export function useStoryRoomStatePanelViewModel({ room, onClose } = {}) {
  return {
    eyebrow: "Chronicle State",
    title: "Story Data",
    sections: buildSections(room),
    actions: buildActions(),
    showCloseControl: typeof onClose === "function",
    onClosePanel: typeof onClose === "function" ? onClose : null,
  };
}
