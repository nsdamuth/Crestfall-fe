"use client";

import { useMemo, useState } from "react";

function toViewOption(option, index, selectedValue) {
  const value = option?.value ?? "";

  return {
    key: `${String(value)}:${index}`,
    id: value,
    label: option?.label || String(value),
    icon: option?.icon || null,
    selected: value === selectedValue,
  };
}

export function useCrestfallOptionModalViewModel({
  title = "Select Option",
  value = "",
  options = [],
  onChange = null,
  triggerLabel = "Option",
  placeholder = "Search options...",
  columns = 3,
  groups = [],
} = {}) {
  const normalizedOptions = Array.isArray(options) ? options : [];
  const normalizedGroups = Array.isArray(groups) ? groups : [];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [activeGroup, setActiveGroup] = useState(normalizedGroups[0] || null);

  const selected = useMemo(
    () =>
      normalizedOptions.find((option) => option?.value === value) ||
      (value
        ? {
            label: value,
            value,
          }
        : null),
    [normalizedOptions, value]
  );

  const pinnedOptions = useMemo(
    () => normalizedOptions.filter((option) => option?.pinned),
    [normalizedOptions]
  );

  const groupedOptions = useMemo(
    () =>
      normalizedOptions.filter((option) => {
        if (option?.pinned) return false;
        if (activeGroup && option?.group !== activeGroup) return false;
        return true;
      }),
    [activeGroup, normalizedOptions]
  );

  const visibleOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...pinnedOptions, ...groupedOptions]
      .filter((option) => {
        if (!normalizedQuery) return true;

        return (
          String(option?.label || "")
            .toLowerCase()
            .includes(normalizedQuery) ||
          String(option?.value || "")
            .toLowerCase()
            .includes(normalizedQuery)
        );
      })
      .sort((left, right) => {
        if (left?.pinned && !right?.pinned) return -1;
        if (!left?.pinned && right?.pinned) return 1;
        return String(left?.label || "").localeCompare(
          String(right?.label || "")
        );
      })
      .map((option, index) => toViewOption(option, index, value));
  }, [groupedOptions, pinnedOptions, query, value]);

  function chooseOption(optionId) {
    if (optionId === "CUSTOM") {
      setCustomMode(true);
      return;
    }

    onChange?.(optionId);
    setOpen(false);
    setQuery("");
  }

  function useCustomValue() {
    const nextValue = customValue.trim();

    if (!nextValue) return;

    onChange?.(nextValue);
    setCustomMode(false);
    setOpen(false);
    setQuery("");
    setCustomValue("");
  }

  return {
    open,
    title,
    triggerLabel,
    selectedLabel: selected?.label || "Not chosen",
    searchQuery: query,
    searchPlaceholder: placeholder,
    groups: normalizedGroups,
    activeGroup,
    customMode,
    customEyebrow: "Custom Role Archetype",
    customValue,
    customPlaceholder: "Type a custom role...",
    options: visibleOptions,
    columns,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onSearchQueryChange: setQuery,
    onChooseGroup: setActiveGroup,
    onChooseOption: chooseOption,
    onCustomValueChange: setCustomValue,
    onBackFromCustom: () => setCustomMode(false),
    onUseCustom: useCustomValue,
  };
}
