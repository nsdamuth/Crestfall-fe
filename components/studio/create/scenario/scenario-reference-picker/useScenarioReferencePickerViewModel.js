"use client";

import { useMemo, useState } from "react";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getSelectedItems(selected, multiple) {
  if (multiple) {
    return normalizeArray(selected);
  }

  return selected ? [selected] : [];
}

function matchesQuery(item, normalizedQuery) {
  if (!normalizedQuery) return true;

  return [item?.title, item?.subtitle, item?.type, item?.contentRating]
    .map(normalizeString)
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

function toViewItem(item, selectedIds) {
  const title = normalizeString(item?.title) || "Untitled Reference";

  return {
    id: normalizeString(item?.id),
    title,
    subtitle: normalizeString(item?.subtitle) || "No description yet.",
    typeLabel: normalizeString(item?.type) || "REFERENCE",
    ratingLabel: normalizeString(item?.contentRating) || "SFW",
    imageUrl: normalizeString(item?.imageUrl),
    imageAltText: `${title} reference image`,
    isSelected: selectedIds.has(item?.id),
  };
}

export function useScenarioReferencePickerViewModel({
  title = "Select Reference",
  body = "Choose a Scenario reference.",
  options = [],
  selected = null,
  multiple = false,
  onChange,
  onClose,
  emptyMessage = "No matching creations found.",
}) {
  const [query, setQuery] = useState("");

  const safeOptions = useMemo(() => normalizeArray(options), [options]);
  const selectedItems = useMemo(
    () => getSelectedItems(selected, multiple),
    [multiple, selected]
  );
  const selectedIds = useMemo(
    () => new Set(selectedItems.map((item) => item?.id).filter(Boolean)),
    [selectedItems]
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return safeOptions.filter((item) => matchesQuery(item, normalizedQuery));
  }, [query, safeOptions]);

  const items = useMemo(
    () => filteredOptions.map((item) => toViewItem(item, selectedIds)),
    [filteredOptions, selectedIds]
  );

  function chooseItem(itemId) {
    const item = safeOptions.find((option) => option?.id === itemId);

    if (!item) return;

    if (multiple) {
      if (selectedIds.has(item.id)) {
        onChange?.(
          selectedItems.filter((selectedItem) => selectedItem?.id !== item.id)
        );
        return;
      }

      onChange?.([...selectedItems, item]);
      return;
    }

    onChange?.(item);
    onClose?.();
  }

  return {
    eyebrow: "Select Scenario Reference",
    title,
    body,
    searchQuery: query,
    searchPlaceholder: `Search ${String(title || "references").toLowerCase()}...`,
    items,
    selectedCount: selectedItems.length,
    showSelectedCount: Boolean(multiple && selectedItems.length),
    showDoneAction: Boolean(multiple),
    emptyMessage,
    onSearchQueryChange: setQuery,
    onChooseItem: chooseItem,
    onClose,
  };
}
