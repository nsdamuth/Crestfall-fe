"use client";

import { useMemo, useState } from "react";

export const PUBLIC_PROFILE_TAB_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "creations",
    label: "Creations",
    title: "Characters & Canon Work",
  }),
  Object.freeze({ id: "activity", label: "Activity", title: "Activity" }),
  Object.freeze({ id: "badges", label: "Badges", title: "Badges" }),
]);

const DEFAULT_TAB_ID = "creations";

export function normalizePublicProfileTabId(value) {
  return PUBLIC_PROFILE_TAB_DEFINITIONS.some((tab) => tab.id === value)
    ? value
    : DEFAULT_TAB_ID;
}

export function buildPublicProfileTabState(activeTab) {
  const normalizedActiveTab = normalizePublicProfileTabId(activeTab);
  const activeDefinition =
    PUBLIC_PROFILE_TAB_DEFINITIONS.find(
      (tab) => tab.id === normalizedActiveTab
    ) || PUBLIC_PROFILE_TAB_DEFINITIONS[0];

  return {
    activeTab: normalizedActiveTab,
    title: activeDefinition.title,
    tabs: PUBLIC_PROFILE_TAB_DEFINITIONS.map((tab) => ({
      id: tab.id,
      label: tab.label,
      isActive: tab.id === normalizedActiveTab,
    })),
  };
}

export function usePublicProfileTabsViewModel({
  initialTab = DEFAULT_TAB_ID,
} = {}) {
  const [activeTab, setActiveTab] = useState(() =>
    normalizePublicProfileTabId(initialTab)
  );

  const tabState = useMemo(
    () => buildPublicProfileTabState(activeTab),
    [activeTab]
  );

  return {
    eyebrow: "Public Profile",
    ...tabState,
    onSelectTab: (tabId) => setActiveTab(normalizePublicProfileTabId(tabId)),
  };
}
