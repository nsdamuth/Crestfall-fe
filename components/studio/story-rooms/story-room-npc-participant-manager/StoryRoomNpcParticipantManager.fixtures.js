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
    busyLabel: `${actionLabel}ing...`,
    busy,
    disabled,
    actionTitle: actionTitle || actionLabel,
  };
}

function section(id, title, emptyMessage, actionIconKey, entries = []) {
  return { id, title, emptyMessage, actionIconKey, entries };
}

const COMPLETE_SECTIONS = [
  section(
    "loaded",
    "Loaded",
    "No Registry NPCs are currently present.",
    "unload",
    [
      npc({
        actionId: "loaded:0",
        name: "Mara Venn",
        title: "Night Clerk",
        statusLabel: "Arriving",
        statusDetail:
          "Will enter the scene on their first turn and has no knowledge of earlier scene events.",
        actionLabel: "Unload",
      }),
    ]
  ),
  section(
    "pending",
    "Narrative Targets",
    "No unloaded NPCs are currently marked as needed by the story.",
    "target",
    [
      npc({
        actionId: "pending:0",
        name: "Tomas Reed",
        title: "Courier",
        pendingReason:
          "The current objective references the courier who carries the sealed route ledger.",
        actionLabel: "Load Now",
      }),
    ]
  ),
  section(
    "available",
    "Available",
    "No additional Registry NPCs are available.",
    "load",
    [
      npc({
        actionId: "available:0",
        name: "Sable Orr",
        title: "Dock Watcher",
        avatarUrl: "/assets/covers/profile.png",
      }),
    ]
  ),
  section(
    "inactive",
    "Previously Loaded",
    "No Registry NPCs have been unloaded.",
    "reload",
    [
      npc({
        actionId: "inactive:0",
        name: "Ilyan Moss",
        title: "Archive Custodian",
        actionLabel: "Reload",
      }),
    ]
  ),
];

export const storyRoomNpcParticipantClosedFixture = {
  title: "Manage Registry NPCs",
  summaryText: "0 present · 1 arriving · 1 pending",
  isOpen: false,
  loadingNotice: "",
  registryNotice: "",
  errorMessage: "",
  sections: COMPLETE_SECTIONS,
  onTogglePanel: null,
  onActivateNpc: null,
};

export const storyRoomNpcParticipantCompleteFixture = {
  ...storyRoomNpcParticipantClosedFixture,
  isOpen: true,
};

export const storyRoomNpcParticipantLoadingFixture = {
  ...storyRoomNpcParticipantCompleteFixture,
  summaryText: "0 present",
  loadingNotice: "Loading attached NPC Registries...",
  sections: COMPLETE_SECTIONS.map((item) => ({ ...item, entries: [] })),
};

export const storyRoomNpcParticipantNoRegistryFixture = {
  ...storyRoomNpcParticipantLoadingFixture,
  loadingNotice: "",
  registryNotice:
    "No NPC Registry is attached to this Story or active Location.",
};

export const storyRoomNpcParticipantEmptyRegistryFixture = {
  ...storyRoomNpcParticipantLoadingFixture,
  loadingNotice: "",
  registryNotice:
    "The attached NPC Registries do not contain any usable entries.",
};

export const storyRoomNpcParticipantErrorFixture = {
  ...storyRoomNpcParticipantCompleteFixture,
  errorMessage: "NPC Registry participants could not be refreshed.",
};

export const storyRoomNpcParticipantBusyFixture = {
  ...storyRoomNpcParticipantCompleteFixture,
  sections: COMPLETE_SECTIONS.map((item) => ({
    ...item,
    entries: item.entries.map((entry, index) => ({
      ...entry,
      busy: item.id === "available" && index === 0,
      disabled: true,
    })),
  })),
};

export const storyRoomNpcParticipantUnavailableFixture = {
  ...storyRoomNpcParticipantCompleteFixture,
  summaryText: "0 present · 1 pending",
  sections: COMPLETE_SECTIONS.map((item) => ({
    ...item,
    entries:
      item.id === "pending"
        ? [
            npc({
              actionId: "pending:0",
              name: "Former Registry Target",
              title: "Unavailable Source",
              pendingReason:
                "This character is still referenced by the story, but the source NPC Registry is no longer attached.",
              actionLabel: "Load Now",
              disabled: true,
              actionTitle:
                "The source NPC Registry is no longer available in this Story.",
            }),
          ]
        : [],
  })),
};

export const storyRoomNpcParticipantLongContentFixture = {
  ...storyRoomNpcParticipantCompleteFixture,
  sections: COMPLETE_SECTIONS.map((item) => ({
    ...item,
    entries: item.entries.map((entry) => ({
      ...entry,
      name:
        "Archivist Meridia Vell of the Western Observatory and Lower Lantern District",
      title:
        "Senior Custodian of Restricted Astronomical Correspondence and Uncatalogued Artifacts",
      registryTitle:
        "The Combined Observatory, Archive, Lantern District, and Western Transit NPC Registry",
      pendingReason: entry.pendingReason
        ? "The current objective repeatedly references this NPC through several aliases, prior locations, inherited registry bindings, and unresolved story-state evidence that should remain visible for long-content stress testing."
        : "",
    })),
  })),
};
