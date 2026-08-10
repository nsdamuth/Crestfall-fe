"use client";

import { useState } from "react";

import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import {
  kitDropdownDisabledFixture,
  kitDropdownEmptyFixture,
  kitDropdownLongestLabelsFixture,
  kitDropdownRatingFixture,
  kitDropdownSortFixture,
  kitDropdownTypeFixture,
  kitDropdownTypeSelectedFixture,
} from "@/components/kit/dropdown/KitDropdown.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  type: { label: "Type (multi)", props: kitDropdownTypeFixture },
  selected: { label: "Type (2 selected)", props: kitDropdownTypeSelectedFixture },
  rating: { label: "Rating (3 tiers)", props: kitDropdownRatingFixture },
  sort: { label: "Sort (single)", props: kitDropdownSortFixture },
  longest: { label: "Longest labels", props: kitDropdownLongestLabelsFixture },
  empty: { label: "Empty", props: kitDropdownEmptyFixture },
  disabled: { label: "Disabled", props: kitDropdownDisabledFixture },
};

export default function KitDropdownPreviewClient() {
  const [activeKey, setActiveKey] = useState("type");
  const [selectedValues, setSelectedValues] = useState(
    STATES.type.props.selectedValues
  );

  const active = STATES[activeKey];

  function openState(key) {
    setActiveKey(key);
    setSelectedValues(STATES[key].props.selectedValues);
  }

  function toggleValue(value) {
    if (active.props.isMultiSelect) {
      setSelectedValues((current) =>
        current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value]
      );
    } else {
      setSelectedValues([value]);
    }
  }

  return (
    <KitPreviewShell
      title="Kit Dropdown"
      description="Branded dropdown per the filter-line law: popover below the trigger at 700px and up, bottom-docked sheet under 700px. Selection lives in preview state only."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note="Fixture-only. Open each state at 390 and 1440; the panel must be fully usable in both. Rating tiers carry their film anchor as a row tooltip (native title attribute), not a visible description line."
    >
      <div className="flex min-h-[24rem] flex-wrap items-start gap-[var(--space-3)]">
        <KitDropdownView
          {...active.props}
          selectedValues={selectedValues}
          onToggleOption={toggleValue}
        />
      </div>
    </KitPreviewShell>
  );
}
