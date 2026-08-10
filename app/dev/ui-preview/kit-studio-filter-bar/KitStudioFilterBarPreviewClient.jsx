"use client";

import { useState } from "react";

import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import {
  kitStudioFilterBarDefaultFixture,
  kitStudioFilterBarEmptyGroupsFixture,
  kitStudioFilterBarLoadingCountsFixture,
  kitStudioFilterBarLongestLabelsFixture,
  kitStudioFilterBarManyOptionsFixture,
} from "@/components/kit/studio-filter-bar/KitStudioFilterBar.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitStudioFilterBarDefaultFixture },
  empty: { label: "Empty groups", props: kitStudioFilterBarEmptyGroupsFixture },
  longest: { label: "Longest labels", props: kitStudioFilterBarLongestLabelsFixture },
  many: { label: "Many options", props: kitStudioFilterBarManyOptionsFixture },
  loading: { label: "Loading counts", props: kitStudioFilterBarLoadingCountsFixture },
};

export default function KitStudioFilterBarPreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [localProps, setLocalProps] = useState(STATES.default.props);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No list, query, or persisted filter state is connected."
  );

  function openState(key) {
    setActiveKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  function toggleFilter(groupId, value) {
    setLocalProps((current) => {
      const currentValues = current.selectedValues?.[groupId] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value];

      return {
        ...current,
        selectedValues: { ...current.selectedValues, [groupId]: nextValues },
      };
    });
    setLastAction(`Toggled "${value}" in group "${groupId}" (local preview only).`);
  }

  return (
    <KitPreviewShell
      title="Kit Studio Filter Bar"
      description="One sticky line: search, branded filter dropdowns with selection counts, sort dropdown, and a view-mode slot. At 390 the search takes its own row inside the sticky block; dropdowns open as bottom sheets."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className="relative -m-[var(--space-6)] overflow-hidden rounded-[var(--radius-lg)]">
        <KitStudioFilterBarView
          {...localProps}
          onSearchChange={(value) => {
            setLocalProps((current) => ({ ...current, searchValue: value }));
            setLastAction(`Search changed to "${value}" (local preview only).`);
          }}
          onFilterToggle={toggleFilter}
          onSortChange={(value) => {
            setLocalProps((current) => ({ ...current, selectedSort: value }));
            setLastAction(`Sort changed to "${value}" (local preview only).`);
          }}
        />
        <div className="h-[var(--space-20)] bg-[var(--surface-2)] px-[var(--space-5)] py-[var(--space-4)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
          Content grid renders below the sticky bar (not part of this
          package).
        </div>
      </div>
    </KitPreviewShell>
  );
}
