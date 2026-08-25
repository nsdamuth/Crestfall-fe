function noop() {}

function npc({
  actionId,
  name,
  title = "NPC",
  registryTitle = "Lantern District Registry",
  avatarUrl = "",
  statusLabel = "",
  statusDetail = "",
  pendingReason = "",
  actionLabel = "Load",
  busy = false,
  disabled = false,
  actionTitle = "",
} = {}) {
  return {
    actionId,
    name,
    title,
    registryTitle,
    avatarUrl,
    fallbackInitial: String(name || "N").slice(0, 1).toUpperCase(),
    statusLabel,
    statusDetail,
    pendingReason,
    actionLabel,
    busyLabel: `${actionLabel}ing`,
    busy,
    disabled,
    actionTitle: actionTitle || actionLabel,
  };
}

function section(id, title, emptyMessage, actionIconKey, entries = []) {
  return { id, title, emptyMessage, actionIconKey, entries };
}

const COMPLETE_SECTIONS = [
  section("loaded", "Loaded", "No Registry NPCs are currently present.", "unload", [
    npc({
      actionId: "loaded:0",
      name: "Mara Venn",
      title: "Night Clerk",
      statusLabel: "Arriving",
      statusDetail: "Will enter the scene on their first turn and has no knowledge of earlier scene events.",
      actionLabel: "Unload",
    }),
  ]),
  section("pending", "Narrative Targets", "No unloaded NPCs are currently marked as needed by the story.", "target", [
    npc({
      actionId: "pending:0",
      name: "Tomas Reed",
      title: "Courier",
      pendingReason: "The current objective references the courier who carries the sealed route ledger.",
      actionLabel: "Load Now",
    }),
  ]),
  section("available", "Available", "No additional Registry NPCs are available.", "load", [
    npc({
      actionId: "available:0",
      name: "Sable Orr",
      title: "Dock Watcher",
      avatarUrl:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%234A6B4E'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='38' fill='%23F3F8FF'%3ES%3C/text%3E%3C/svg%3E",
    }),
  ]),
  section("inactive", "Previously Loaded", "No Registry NPCs have been unloaded.", "reload", [
    npc({ actionId: "inactive:0", name: "Ilyan Moss", title: "Archive Custodian", actionLabel: "Reload" }),
  ]),
];

const EMPTY_SECTIONS = COMPLETE_SECTIONS.map((item) => ({ ...item, entries: [] }));

export const chatNpcManagerClosedFixture = {
  title: "Manage Registry NPCs",
  summaryText: "0 present, 1 arriving, 1 pending",
  isOpen: false,
  loadingNotice: "",
  registryNotice: "",
  errorMessage: "",
  sections: COMPLETE_SECTIONS,
  onTogglePanel: noop,
  onActivateNpc: noop,
};

export const chatNpcManagerCompleteFixture = {
  ...chatNpcManagerClosedFixture,
  isOpen: true,
};

export const chatNpcManagerEmptyFixture = {
  ...chatNpcManagerCompleteFixture,
  summaryText: "0 present",
  sections: EMPTY_SECTIONS,
};

export const chatNpcManagerLoadingFixture = {
  ...chatNpcManagerCompleteFixture,
  summaryText: "0 present",
  loadingNotice: "Loading attached NPC Registries",
  sections: EMPTY_SECTIONS,
};

export const chatNpcManagerNoRegistryFixture = {
  ...chatNpcManagerLoadingFixture,
  loadingNotice: "",
  registryNotice: "No NPC Registry is attached to this Story or active Location.",
};

export const chatNpcManagerErrorFixture = {
  ...chatNpcManagerCompleteFixture,
  errorMessage: "NPC Registry participants could not be refreshed.",
};

export const chatNpcManagerBusyFixture = {
  ...chatNpcManagerCompleteFixture,
  sections: COMPLETE_SECTIONS.map((item) => ({
    ...item,
    entries: item.entries.map((entry, index) => ({
      ...entry,
      busy: item.id === "available" && index === 0,
      disabled: true,
    })),
  })),
};

export const chatNpcManagerLongestFixture = {
  ...chatNpcManagerCompleteFixture,
  sections: COMPLETE_SECTIONS.map((item) => ({
    ...item,
    entries: item.entries.map((entry) => ({
      ...entry,
      name: "Archivist Meridia Vell of the Western Observatory and Lower Lantern District",
      title: "Senior Custodian of Restricted Astronomical Correspondence and Uncatalogued Artifacts",
      registryTitle: "The Combined Observatory, Archive, Lantern District, and Western Transit NPC Registry",
      pendingReason: entry.pendingReason
        ? "The current objective repeatedly references this NPC through several aliases, prior locations, inherited registry bindings, and unresolved story-state evidence that should remain visible for long-content stress testing."
        : "",
    })),
  })),
};

export const chatNpcManagerFixtures = [
  { id: "closed", label: "Closed", props: chatNpcManagerClosedFixture },
  { id: "complete", label: "Open, all four sections populated", props: chatNpcManagerCompleteFixture },
  { id: "empty", label: "Open, all four sections empty", props: chatNpcManagerEmptyFixture },
  { id: "loading", label: "Loading", props: chatNpcManagerLoadingFixture },
  { id: "no-registry", label: "No registry attached", props: chatNpcManagerNoRegistryFixture },
  { id: "error", label: "Error", props: chatNpcManagerErrorFixture },
  { id: "busy", label: "Busy, one entry loading", props: chatNpcManagerBusyFixture },
  { id: "longest", label: "Longest content", props: chatNpcManagerLongestFixture },
];
