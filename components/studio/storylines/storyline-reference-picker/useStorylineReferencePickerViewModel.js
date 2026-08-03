"use client";

import { useEffect, useMemo, useState } from "react";

const STORY_TAB = "STORY";
const SCENARIO_TAB = "SCENARIO";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOption(option, kind, selectedIds) {
  const id = normalizeString(option?.id);
  const title = normalizeString(option?.title) || `Untitled ${kind}`;

  return {
    id,
    title,
    subtitle: normalizeString(option?.subtitle) || "No description provided.",
    kind,
    kindLabel: kind === STORY_TAB ? "Story" : "Scenario",
    isSelected: selectedIds.has(id),
  };
}

function matchesQuery(option, query) {
  if (!query) return true;

  return [option?.title, option?.subtitle]
    .map(normalizeString)
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(query);
}

export function getStorylineReferencePickerViewProps({
  activeTab = STORY_TAB,
  query = "",
  stories = [],
  scenarios = [],
  selectedReferenceIds = [],
  onActiveTabChange = null,
  onQueryChange = null,
  onSelect = null,
  onClose = null,
} = {}) {
  const safeTab = activeTab === SCENARIO_TAB ? SCENARIO_TAB : STORY_TAB;
  const selectedIds = new Set(
    normalizeArray(selectedReferenceIds).map(normalizeString).filter(Boolean)
  );
  const sourceOptions =
    safeTab === STORY_TAB ? normalizeArray(stories) : normalizeArray(scenarios);
  const normalizedQuery = normalizeString(query).toLowerCase();
  const items = sourceOptions
    .filter((option) => matchesQuery(option, normalizedQuery))
    .map((option) => normalizeOption(option, safeTab, selectedIds));

  return {
    eyebrow: "Storyline Sequence",
    title: "Add a Story or Scenario",
    description:
      "Stories load a complete playable package. Scenarios apply a reusable narrative structure to the continuing chat.",
    dialogTitleId: "storyline-reference-picker-title",
    closeLabel: "Close Storyline reference picker",
    tabs: [
      {
        id: STORY_TAB,
        label: "Stories",
        isActive: safeTab === STORY_TAB,
      },
      {
        id: SCENARIO_TAB,
        label: "Scenarios",
        isActive: safeTab === SCENARIO_TAB,
      },
    ],
    searchQuery: query,
    searchPlaceholder:
      safeTab === STORY_TAB ? "Search Stories" : "Search Scenarios",
    items,
    emptyMessage: `No matching ${
      safeTab === STORY_TAB ? "Stories" : "Scenarios"
    } were found.`,
    onTabChange: onActiveTabChange,
    onSearchQueryChange: onQueryChange,
    onSelectItem: onSelect,
    onClose,
  };
}

export function useStorylineReferencePickerViewModel({
  stories = [],
  scenarios = [],
  selectedReferenceIds = [],
  onSelect,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(STORY_TAB);
  const [query, setQuery] = useState("");
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    const portalNode = document.createElement("div");
    const previousOverflow = document.body.style.overflow;

    portalNode.dataset.crestfallStorylineReferencePickerPortal = "true";
    portalNode.style.position = "relative";
    portalNode.style.zIndex = "2147483647";

    document.body.appendChild(portalNode);
    document.body.style.overflow = "hidden";
    setPortalTarget(portalNode);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      portalNode.remove();
    };
  }, [onClose]);

  const rawOptions = useMemo(
    () => ({
      [STORY_TAB]: normalizeArray(stories),
      [SCENARIO_TAB]: normalizeArray(scenarios),
    }),
    [scenarios, stories]
  );

  const viewProps = useMemo(
    () =>
      getStorylineReferencePickerViewProps({
        activeTab,
        query,
        stories: rawOptions[STORY_TAB],
        scenarios: rawOptions[SCENARIO_TAB],
        selectedReferenceIds,
        onActiveTabChange: (nextTab) => {
          setActiveTab(nextTab === SCENARIO_TAB ? SCENARIO_TAB : STORY_TAB);
          setQuery("");
        },
        onQueryChange: setQuery,
        onSelect: (itemId) => {
          const selected = rawOptions[activeTab].find(
            (option) => normalizeString(option?.id) === itemId
          );

          if (selected && !selectedReferenceIds.includes(itemId)) {
            onSelect?.(selected);
          }
        },
        onClose,
      }),
    [
      activeTab,
      onClose,
      onSelect,
      query,
      rawOptions,
      selectedReferenceIds,
    ]
  );

  return {
    portalTarget,
    ...viewProps,
  };
}
