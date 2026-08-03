"use client";

import { useCallback, useMemo, useState } from "react";

import {
  deleteStoryRoomEngineModuleBinding,
  upsertStoryRoomEngineModuleBinding,
} from "@/lib/client/studio/story-rooms/storyRoomClient";

export const TRACKERS_MODULE_ID = "core.trackers.v1";
export const MECHANICS_MODULE_CREATION_TYPE = "MECHANICS_MODULE";
export const MECHANICS_MODULE_ROLE = "MECHANICS_MODULE";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeScopeMode(value, fallback = "STORY_ROOM") {
  const normalized = normalizeString(value).toUpperCase();

  if (["STORY_ROOM", "BINDING_OWNER"].includes(normalized)) {
    return normalized;
  }

  return fallback;
}

function getRoomData(room) {
  return normalizeObject(room?.rawRoom?.data || room?.data);
}

export function getRoomEngineModuleBindings(room) {
  const data = getRoomData(room);

  return [
    ...normalizeArray(data.engine_module_bindings),
    ...normalizeArray(data.engineModuleBindings),
  ];
}

export function getMechanicsModuleId(binding) {
  const source = normalizeObject(binding);

  return (
    source.mechanicsModuleCreationId ||
    source.mechanics_module_creation_id ||
    source.moduleInstanceId ||
    source.module_instance_id ||
    source.targetCreationId ||
    source.target_creation_id ||
    ""
  );
}

export function isMechanicsModuleBinding(binding = {}) {
  const role = normalizeString(binding.role).toUpperCase();
  const sourceType = normalizeString(binding.moduleSourceType).toUpperCase();

  return (
    binding?.moduleId === TRACKERS_MODULE_ID ||
    role === MECHANICS_MODULE_ROLE ||
    sourceType === MECHANICS_MODULE_CREATION_TYPE ||
    Boolean(getMechanicsModuleId(binding))
  );
}

export function getMechanicsModuleBindings(room) {
  return getRoomEngineModuleBindings(room).filter(isMechanicsModuleBinding);
}

function getMechanicsModulePriority(moduleCreation) {
  const data = normalizeObject(moduleCreation?.data);
  const priority = Number(data.priority);

  return Number.isFinite(priority) ? priority : 100;
}

export function buildStoryRoomMechanicsBinding({
  room,
  roomId,
  moduleCreation,
}) {
  const data = normalizeObject(moduleCreation?.data);
  const instanceData = normalizeObject(data.instanceData);

  return {
    moduleId: data.moduleDefinitionId || data.moduleId || TRACKERS_MODULE_ID,
    moduleSourceType: MECHANICS_MODULE_CREATION_TYPE,
    mechanicsModuleCreationId: moduleCreation.id,
    moduleInstanceId: moduleCreation.id,
    moduleInstanceTitle: moduleCreation.title || "Untitled Mechanics Module",
    role: MECHANICS_MODULE_ROLE,
    enabled: true,
    inheritanceMode: "LOCAL_ONLY",
    mechanicsScopeMode: "STORY_ROOM",
    ownerType: "STORY_ROOM",
    ownerId: roomId,
    ownerTitle: room?.title || "Story",
    ownerSource: "story_room_binding",
    source: "story_room_binding",
    priority: getMechanicsModulePriority(moduleCreation),
    operationTriggers: {
      chatTurnDefault: "get_tracker_context",
      ...(data.operationTriggers || {}),
    },
    data: {
      moduleDefinitionId: data.moduleDefinitionId || TRACKERS_MODULE_ID,
      contractVersion:
        data.contractVersion || instanceData.contractVersion || "",
      tags: normalizeArray(data.tags),
    },
  };
}

export function buildStoryRoomRuntimeMechanicsPanelState({
  currentBinding,
  saving = false,
  statusMessage = "",
  errorMessage = "",
} = {}) {
  const hasBinding = Boolean(currentBinding);
  const scopeMode = normalizeScopeMode(currentBinding?.mechanicsScopeMode);
  const priority = Number(currentBinding?.priority);
  const moduleCreationId = hasBinding
    ? getMechanicsModuleId(currentBinding)
    : "";

  return {
    eyebrow: "Room Runtime",
    title: "Mechanics Module",
    description:
      "Attach one Story mechanics module. Room-level mechanics are the highest runtime source for footers and root room state.",
    binding: hasBinding
      ? {
          title:
            currentBinding.moduleInstanceTitle ||
            "Untitled Mechanics Module",
          creationId: moduleCreationId || currentBinding.moduleInstanceId || "",
          moduleId: currentBinding.moduleId || TRACKERS_MODULE_ID,
          trigger:
            currentBinding.operationTriggers?.chatTurnDefault ||
            "get_tracker_context",
          scopeMode,
          enabled: currentBinding.enabled !== false,
          priority: Number.isFinite(priority) ? priority : 100,
        }
      : null,
    attachActionLabel: hasBinding
      ? "Replace Mechanics"
      : "Attach Mechanics",
    saving: Boolean(saving),
    savingMessage: "Saving runtime mechanics...",
    statusMessage: normalizeString(statusMessage),
    errorMessage: normalizeString(errorMessage),
  };
}

export function useStoryRoomRuntimeMechanicsPanelViewModel({
  room,
  roomId,
  onUpdated,
} = {}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mechanicsBindings = useMemo(
    () => getMechanicsModuleBindings(room),
    [room]
  );
  const currentBinding = mechanicsBindings[0] || null;
  const excludedModuleIds = useMemo(
    () => mechanicsBindings.map(getMechanicsModuleId).filter(Boolean),
    [mechanicsBindings]
  );

  const persistBinding = useCallback(
    async (nextBinding) => {
      if (!roomId || !nextBinding?.moduleId || saving) return null;

      setSaving(true);
      setStatusMessage("");
      setErrorMessage("");

      try {
        const result = await upsertStoryRoomEngineModuleBinding(
          roomId,
          nextBinding
        );

        setStatusMessage("Runtime mechanics saved.");

        if (typeof onUpdated === "function") {
          await onUpdated();
        }

        return result;
      } catch (error) {
        setErrorMessage(
          error?.message ||
            "Story runtime mechanics could not be saved."
        );
        return null;
      } finally {
        setSaving(false);
      }
    },
    [onUpdated, roomId, saving]
  );

  const onAttach = useCallback(
    async (moduleCreation) => {
      if (!moduleCreation?.id) return;

      await persistBinding(
        buildStoryRoomMechanicsBinding({
          room,
          roomId,
          moduleCreation,
        })
      );
    },
    [persistBinding, room, roomId]
  );

  const patchCurrentBinding = useCallback(
    async (patch) => {
      if (!currentBinding) return;

      await persistBinding({
        ...currentBinding,
        ...patch,
        moduleId: currentBinding.moduleId || TRACKERS_MODULE_ID,
      });
    },
    [currentBinding, persistBinding]
  );

  const onRemove = useCallback(async () => {
    if (!roomId || saving) return;

    const moduleId = currentBinding?.moduleId || TRACKERS_MODULE_ID;

    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      await deleteStoryRoomEngineModuleBinding(roomId, moduleId);
      setStatusMessage("Runtime mechanics removed.");

      if (typeof onUpdated === "function") {
        await onUpdated();
      }
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Story runtime mechanics could not be removed."
      );
    } finally {
      setSaving(false);
    }
  }, [currentBinding?.moduleId, onUpdated, roomId, saving]);

  const state = useMemo(
    () =>
      buildStoryRoomRuntimeMechanicsPanelState({
        currentBinding,
        saving,
        statusMessage,
        errorMessage,
      }),
    [currentBinding, errorMessage, saving, statusMessage]
  );

  return {
    viewProps: {
      ...state,
      onOpenPicker: () => setPickerOpen(true),
      onRemove,
      onToggleEnabled: (enabled) =>
        patchCurrentBinding({ enabled: Boolean(enabled) }),
      onChangeScopeMode: (mechanicsScopeMode) =>
        patchCurrentBinding({
          mechanicsScopeMode: normalizeScopeMode(mechanicsScopeMode),
        }),
      onChangePriority: (priorityValue) => {
        const priority = Number(priorityValue);
        return patchCurrentBinding({
          priority: Number.isFinite(priority) ? priority : 100,
        });
      },
    },
    pickerProps: pickerOpen
      ? {
          excludedModuleIds,
          onClose: () => setPickerOpen(false),
          onSelected: onAttach,
        }
      : null,
  };
}
