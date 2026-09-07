"use client";

import { useState } from "react";

import KitFilterPanelView from "@/components/kit/filter-panel/KitFilterPanel.view";
import {
  kitFilterPanelDefaultFixture,
  kitFilterPanelDisabledOptionFixture,
  kitFilterPanelEmptyFixture,
  kitFilterPanelLoadingCountsFixture,
  kitFilterPanelLongestLabelsFixture,
  kitFilterPanelManySectionsFixture,
  kitFilterPanelNoClearAllCallbackFixture,
} from "@/components/kit/filter-panel/KitFilterPanel.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitFilterPanelDefaultFixture },
  empty: { label: "No sections", props: kitFilterPanelEmptyFixture },
  many: { label: "Many sections", props: kitFilterPanelManySectionsFixture },
  longest: { label: "Longest labels", props: kitFilterPanelLongestLabelsFixture },
  loading: { label: "Loading counts", props: kitFilterPanelLoadingCountsFixture },
  disabled: { label: "Disabled option", props: kitFilterPanelDisabledOptionFixture },
  noClear: { label: "No Clear all callback", props: kitFilterPanelNoClearAllCallbackFixture },
};

export default function KitFilterPanelPreviewClient() {
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

  function toggleOption(sectionId, value) {
    setLocalProps((current) => {
      const currentValues = current.selectedValues?.[sectionId] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value];

      return {
        ...current,
        selectedValues: { ...current.selectedValues, [sectionId]: nextValues },
      };
    });
    setLastAction(`Toggled "${value}" in section "${sectionId}" (local preview only).`);
  }

  const clearAll =
    localProps.onClearAll === null
      ? null
      : () => {
          setLocalProps((current) => ({ ...current, selectedValues: {} }));
          setLastAction("Clear all fired once (local preview only).");
        };

  return (
    <KitPreviewShell
      title="Kit Filter Panel"
      description="One Filter trigger with an active-count badge opening a panel: search-within-filters, labelled chip-group sections in caller order, Clear all. Popover at 700px and up, bottom sheet below."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className="flex min-h-[28rem] items-start justify-end">
        <KitFilterPanelView {...localProps} onToggleOption={toggleOption} onClearAll={clearAll} />
      </div>
    </KitPreviewShell>
  );
}
