"use client";

import { useMemo, useState } from "react";

import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";
import { CREATION_PICKER_BUCKETS } from "./creationPickerBuckets";

const VISIBILITY_LABELS = {
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
  PUBLIC: "Public",
};

const SORT_RECENCY = "sort-recency";

function badgeLabelFor(creation) {
  if (creation.isCanon) return "Canon";
  return VISIBILITY_LABELS[creation.visibility] || creation.visibility || "";
}

function toPickerItem(creation) {
  return {
    id: creation.id,
    title: creation.title,
    subtitle: getCreationTypeDisplayName(creation.type),
    imageSrc: creation.imageSrc,
    badgeLabel: badgeLabelFor(creation),
  };
}

// Chassis / orchestration adapter: owns search, bucket, and sort UI
// state and derives the portable View's props. The View itself stays
// fixture-fed and stateless; this is the only file in the package
// that touches React state or the owned-creations data shape.
export function useCreationPickerViewModel({
  creations = [],
  title = "Choose a creation",
  errorMessage = "",
  onSelect = null,
  onClose = null,
  onCreateNew = null,
} = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [activeBucket, setActiveBucket] = useState(null);
  const [sortMode, setSortMode] = useState("recent");

  const filtered = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    let list = creations;
    if (activeBucket) {
      list = list.filter((creation) => creation.bucket === activeBucket);
    }
    if (query) {
      list = list.filter((creation) => creation.title.toLowerCase().includes(query));
    }
    const sorted = [...list].sort((a, b) => {
      if (sortMode === "alpha") return a.title.localeCompare(b.title);
      return b.recency - a.recency;
    });
    return sorted;
  }, [creations, activeBucket, searchValue, sortMode]);

  const filters = useMemo(() => {
    const bucketChips = CREATION_PICKER_BUCKETS.map((bucket) => ({
      value: bucket.value,
      label: bucket.label,
      isSelected: activeBucket === bucket.value,
    }));
    const sortChip = {
      value: SORT_RECENCY,
      label: sortMode === "alpha" ? "Sort: A-Z" : "Sort: Recent",
      isSelected: sortMode === "alpha",
    };
    return [...bucketChips, sortChip];
  }, [activeBucket, sortMode]);

  function toggleFilter(value) {
    if (value === SORT_RECENCY) {
      setSortMode((current) => (current === "alpha" ? "recent" : "alpha"));
      return;
    }
    setActiveBucket((current) => (current === value ? null : value));
  }

  function toggleItem(id) {
    const creation = creations.find((entry) => entry.id === id);
    onSelect?.(creation || null);
    onClose?.();
  }

  return {
    title,
    items: filtered.map(toPickerItem),
    searchValue,
    searchPlaceholder: "Search your creations",
    filters,
    isSearching: false,
    isEmpty: creations.length === 0,
    emptyCreateLabel: "Create your first creation",
    emptyMessage: "No matching creations found.",
    errorMessage,
    onSearchChange: setSearchValue,
    onToggleFilter: toggleFilter,
    onToggleItem: toggleItem,
    onConfirm: () => onClose?.(),
    onClose: () => onClose?.(),
    onCreateNew: () => onCreateNew?.(),
  };
}
