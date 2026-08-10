import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";

const noop = () => {};

export const kitDropdownTypeFixture = {
  label: "Type",
  options: [
    { value: "character", label: "Characters", count: 12 },
    { value: "story", label: "Stories", count: 9 },
    { value: "adventure", label: "Adventures", count: 3 },
    { value: "image", label: "Images", count: 21 },
  ],
  selectedValues: [],
  isMultiSelect: true,
  isDisabled: false,
  onToggleOption: noop,
};

export const kitDropdownTypeSelectedFixture = {
  ...kitDropdownTypeFixture,
  selectedValues: ["character", "story"],
};

// The rating facet, three presentation tiers over the three backend
// values (lib/shared/presentation/terminology.js). Film anchors ride
// as the row tooltip, not a visible description line.
export const kitDropdownRatingFixture = {
  label: "Rating",
  options: CONTENT_RATING_TIERS.map((tier) => ({
    value: tier.tier,
    label: tier.label,
    tooltip: tier.tooltip,
    count: 4,
  })),
  selectedValues: [],
  isMultiSelect: true,
  isDisabled: false,
  onToggleOption: noop,
};

export const kitDropdownSortFixture = {
  label: "Sort",
  options: [
    { value: "recommended", label: "Recommended" },
    { value: "popular", label: "Most played" },
    { value: "recent", label: "Newest" },
    { value: "saved", label: "Most saved" },
  ],
  selectedValues: ["recommended"],
  isMultiSelect: false,
  isDisabled: false,
  onToggleOption: noop,
};

export const kitDropdownLongestLabelsFixture = {
  label: "A very long facet name",
  options: [
    {
      value: "long-1",
      label: "The Lantern-Keeper of the Vermillion Coast, Third Cycle",
      description:
        "A supporting line long enough to prove the row wraps its description instead of overflowing the panel.",
      count: 1204,
    },
    { value: "long-2", label: "Short", count: 2 },
  ],
  selectedValues: ["long-1"],
  isMultiSelect: true,
  isDisabled: false,
  onToggleOption: noop,
};

export const kitDropdownEmptyFixture = {
  ...kitDropdownTypeFixture,
  label: "Empty",
  options: [],
};

export const kitDropdownDisabledFixture = {
  ...kitDropdownTypeFixture,
  label: "Disabled",
  isDisabled: true,
};
