"use client";

import { useState } from "react";

import KitFilterChipView from "@/components/kit/filter-chip/KitFilterChip.view";
import {
  kitFilterChipDefaultFixture,
  kitFilterChipDisabledFixture,
  kitFilterChipDropdownExpandedFixture,
  kitFilterChipLongestLabelFixture,
  kitFilterChipSelectedFixture,
  kitFilterChipSortFixture,
  kitFilterChipToggleArmedFixture,
  kitFilterChipToggleIdleFixture,
} from "@/components/kit/filter-chip/KitFilterChip.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitFilterChipDefaultFixture },
  selected: { label: "Selected", props: kitFilterChipSelectedFixture },
  sort: { label: "Sort variant", props: kitFilterChipSortFixture },
  toggleIdle: { label: "Toggle, idle", props: kitFilterChipToggleIdleFixture },
  toggleArmed: { label: "Toggle, armed", props: kitFilterChipToggleArmedFixture },
  dropdown: { label: "Dropdown, expanded", props: kitFilterChipDropdownExpandedFixture },
  disabled: { label: "Disabled", props: kitFilterChipDisabledFixture },
  longest: { label: "Longest label", props: kitFilterChipLongestLabelFixture },
};

export default function KitFilterChipPreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [localProps, setLocalProps] = useState(STATES.default.props);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No list or query is connected."
  );

  function openState(key) {
    setActiveKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  function toggle() {
    setLocalProps((current) => ({ ...current, isSelected: !current.isSelected }));
    setLastAction("Toggled selection in local preview state.");
  }

  return (
    <KitPreviewShell
      title="Kit Filter Chip"
      description="The selectable filter chip, lifted verbatim from the already-specified .fchip recipe. Four variants: default, sort, select-toggle, and dropdown trigger."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className="flex min-h-[var(--space-20)] items-center justify-center">
        <KitFilterChipView {...localProps} onToggle={toggle} />
      </div>
    </KitPreviewShell>
  );
}
