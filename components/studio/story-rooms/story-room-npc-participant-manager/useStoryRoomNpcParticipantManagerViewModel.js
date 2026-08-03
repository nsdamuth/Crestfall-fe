"use client";

import { useCallback, useMemo, useState } from "react";

const SECTION_DEFINITIONS = [
  {
    id: "loaded",
    status: "LOADED",
    title: "Loaded",
    emptyMessage: "No Registry NPCs are currently present.",
    actionIconKey: "unload",
    actionLabel: "Unload",
    actionKind: "UNLOAD",
  },
  {
    id: "pending",
    status: "PENDING",
    title: "Narrative Targets",
    emptyMessage:
      "No unloaded NPCs are currently marked as needed by the story.",
    actionIconKey: "target",
    actionLabel: "Load Now",
    actionKind: "LOAD",
    requiresRegistry: true,
  },
  {
    id: "available",
    status: "AVAILABLE",
    title: "Available",
    emptyMessage: "No additional Registry NPCs are available.",
    actionIconKey: "load",
    actionLabel: "Load",
    actionKind: "LOAD",
  },
  {
    id: "inactive",
    status: "INACTIVE",
    title: "Previously Loaded",
    emptyMessage: "No Registry NPCs have been unloaded.",
    actionIconKey: "reload",
    actionLabel: "Reload",
    actionKind: "LOAD",
    requiresRegistry: true,
  },
];

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function displayText(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function formatKind(value) {
  return displayText(value, "NPC").replaceAll("_", " ");
}

function getActionKey(entry, actionKind) {
  if (actionKind === "UNLOAD") {
    return `unload:${entry?.participantId || ""}`;
  }

  return `load:${entry?.registryId || ""}:${entry?.entryId || ""}`;
}

function buildParticipantManagerState({ registryNpcs, loading, actionKey, error }) {
  const entries = normalizeArray(registryNpcs?.entries);
  const normalizedActionKey = displayText(actionKey);
  const actionRecords = new Map();

  const sections = SECTION_DEFINITIONS.map((definition) => {
    const sectionEntries = entries
      .filter((entry) => entry?.status === definition.status)
      .map((entry, index) => {
        const actionId = `${definition.id}:${index}`;
        const expectedActionKey = getActionKey(entry, definition.actionKind);
        const registryUnavailable =
          Boolean(definition.requiresRegistry) && !entry?.registryAvailable;
        const arrivalPending =
          displayText(entry?.arrivalStatus).toUpperCase() ===
          "PENDING_ARRIVAL";
        const disabled = Boolean(normalizedActionKey) || registryUnavailable;

        actionRecords.set(actionId, {
          actionKind: definition.actionKind,
          registryId: entry?.registryId,
          entryId: entry?.entryId,
          participantId: entry?.participantId,
          disabled: registryUnavailable,
        });

        return {
          actionId,
          name: displayText(entry?.name, "Unnamed NPC"),
          title: displayText(entry?.title, formatKind(entry?.kind)),
          registryTitle: displayText(entry?.registryTitle),
          avatarUrl: displayText(entry?.avatarUrl),
          fallbackInitial: displayText(entry?.name, "N")
            .slice(0, 1)
            .toUpperCase(),
          statusLabel: arrivalPending ? "Arriving" : "",
          statusDetail: arrivalPending
            ? "Will enter the scene on their first turn and has no knowledge of earlier scene events."
            : "",
          pendingReason:
            definition.status === "PENDING"
              ? displayText(entry?.automaticLifecycle?.pendingDriver?.reason)
              : "",
          actionLabel: definition.actionLabel,
          busyLabel: `${definition.actionLabel}ing...`,
          busy: normalizedActionKey === expectedActionKey,
          disabled,
          actionTitle: registryUnavailable
            ? "The source NPC Registry is no longer available in this Story."
            : definition.actionLabel,
        };
      });

    return {
      id: definition.id,
      title: definition.title,
      emptyMessage: definition.emptyMessage,
      actionIconKey: definition.actionIconKey,
      entries: sectionEntries,
    };
  });

  const loadedEntries =
    sections.find((section) => section.id === "loaded")?.entries || [];
  const arrivingCount = loadedEntries.filter(
    (entry) => entry.statusLabel === "Arriving"
  ).length;
  const presentCount = Math.max(0, loadedEntries.length - arrivingCount);
  const pendingCount = sections.find((section) => section.id === "pending")
    ?.entries.length || 0;
  const registryCount = Number(registryNpcs?.registryCount || 0);

  let registryNotice = "";

  if (!loading && registryCount === 0) {
    registryNotice =
      "No NPC Registry is attached to this Story or active Location.";
  } else if (!loading && registryCount > 0 && entries.length === 0) {
    registryNotice =
      "The attached NPC Registries do not contain any usable entries.";
  }

  return {
    title: "Manage Registry NPCs",
    summaryText: `${presentCount} present${
      arrivingCount ? ` · ${arrivingCount} arriving` : ""
    }${pendingCount ? ` · ${pendingCount} pending` : ""}`,
    loadingNotice: loading ? "Loading attached NPC Registries..." : "",
    registryNotice,
    errorMessage: displayText(error),
    sections,
    actionRecords,
  };
}

export function useStoryRoomNpcParticipantManagerViewModel({
  registryNpcs,
  loading = false,
  actionKey = "",
  error = "",
  onLoad,
  onUnload,
} = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const state = useMemo(
    () =>
      buildParticipantManagerState({
        registryNpcs,
        loading,
        actionKey,
        error,
      }),
    [registryNpcs, loading, actionKey, error]
  );

  const onTogglePanel = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const onActivateNpc = useCallback(
    (actionId) => {
      const action = state.actionRecords.get(actionId);

      if (!action || action.disabled) {
        return;
      }

      if (action.actionKind === "UNLOAD") {
        onUnload?.(action.participantId);
        return;
      }

      onLoad?.({
        registryId: action.registryId,
        entryId: action.entryId,
      });
    },
    [onLoad, onUnload, state.actionRecords]
  );

  return {
    title: state.title,
    summaryText: state.summaryText,
    isOpen,
    loadingNotice: state.loadingNotice,
    registryNotice: state.registryNotice,
    errorMessage: state.errorMessage,
    sections: state.sections,
    onTogglePanel,
    onActivateNpc,
  };
}
