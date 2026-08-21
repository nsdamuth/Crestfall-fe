import { useState } from "react";
import KitDropdown from "@/components/kit/KitDropdown";
import {
  kitDropdownTypeFixture,
  kitDropdownTypeSelectedFixture,
  kitDropdownRatingFixture,
  kitDropdownSortFixture,
  kitDropdownLongestLabelsFixture,
  kitDropdownDisabledFixture,
} from "@/components/kit/dropdown/KitDropdown.fixtures";

export function Default() {
  const [selected, setSelected] = useState(kitDropdownTypeFixture.selectedValues);
  return (
    <KitDropdown
      {...kitDropdownTypeFixture}
      selectedValues={selected}
      onToggleOption={(value) => setSelected([value])}
    />
  );
}

export function Selected() {
  const [selected, setSelected] = useState(kitDropdownTypeSelectedFixture.selectedValues);
  return (
    <KitDropdown
      {...kitDropdownTypeSelectedFixture}
      selectedValues={selected}
      onToggleOption={(value) => setSelected([value])}
    />
  );
}

export function MultiSelect() {
  const [selected, setSelected] = useState(kitDropdownRatingFixture.selectedValues);
  return (
    <KitDropdown
      {...kitDropdownRatingFixture}
      selectedValues={selected}
      onToggleOption={(value) =>
        setSelected((current) =>
          current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
        )
      }
    />
  );
}

export function Sort() {
  const [selected, setSelected] = useState(kitDropdownSortFixture.selectedValues);
  return (
    <KitDropdown
      {...kitDropdownSortFixture}
      selectedValues={selected}
      onToggleOption={(value) => setSelected([value])}
    />
  );
}

export function LongestLabels() {
  return <KitDropdown {...kitDropdownLongestLabelsFixture} />;
}

export function Disabled() {
  return <KitDropdown {...kitDropdownDisabledFixture} />;
}
