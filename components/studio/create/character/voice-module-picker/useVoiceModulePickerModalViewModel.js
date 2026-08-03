"use client";

import { useMemo, useState } from "react";

import {
  getVoiceModuleLabel,
  voiceModuleOptions,
} from "@/components/studio/create/character/constants/voiceModules";

function normalizeSelectedIds(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function toViewOption(option = {}) {
  return {
    id: option.value || "",
    label: option.label || option.value || "Untitled Voice Module",
    description: option.description || "",
  };
}

function groupOptionsByCategory(options = []) {
  const groups = new Map();

  options.forEach((option) => {
    const label = option.category || "Voice Modules";

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label).push(toViewOption(option));
  });

  return [...groups.entries()].map(([label, groupedOptions]) => ({
    id: label.toUpperCase().replace(/[^A-Z0-9]+/g, "_"),
    label,
    options: groupedOptions,
  }));
}

export function useVoiceModulePickerModalViewModel({
  label = "Voice Modules",
  value = [],
  onChange = null,
  description = "Optional reusable speech, accent, tone, or emphasis modules attached to this character.",
} = {}) {
  const [open, setOpen] = useState(false);

  const selectedIds = normalizeSelectedIds(value);
  const optionGroups = useMemo(
    () => groupOptionsByCategory(voiceModuleOptions),
    []
  );

  const selectedItems = selectedIds.map((moduleId) => ({
    id: moduleId,
    label: getVoiceModuleLabel(moduleId),
  }));

  function toggleModule(moduleId) {
    const nextSet = new Set(selectedIds);

    if (nextSet.has(moduleId)) {
      nextSet.delete(moduleId);
    } else {
      nextSet.add(moduleId);
    }

    onChange?.([...nextSet]);
  }

  function clearAll() {
    onChange?.([]);
  }

  return {
    open,
    triggerLabel: label,
    triggerDescription: description,
    triggerActionLabel: "Choose Modules",
    selectedItems,
    emptySelectionMessage: "No voice modules selected.",
    modalAriaLabel: "Choose voice modules",
    modalTitle: "Choose Voice Modules",
    modalDescription:
      "Select one or more prebuilt modules. Character voice still has priority; modules are expression overlays, not replacements.",
    optionGroups,
    selectedIds,
    clearActionLabel: "Clear All",
    doneActionLabel: "Done",
    canClear: selectedIds.length > 0,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onToggleModule: toggleModule,
    onClearAll: clearAll,
    onDone: () => setOpen(false),
  };
}
