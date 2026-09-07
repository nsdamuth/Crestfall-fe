import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";

const noop = () => {};

const defaultFilterGroups = [
  {
    id: "type",
    label: "Type",
    isMultiSelect: true,
    // Remixable folded in as an additional option group (9 Aug 2026
    // kit polish pass); the standalone Remixable dropdown is retired.
    options: [
      { value: "character", label: "Characters", count: 214 },
      { value: "story", label: "Stories", count: 88 },
      { value: "adventure", label: "Adventures", count: 12 },
      { value: "image", label: "Images", count: 96 },
      { value: "remixable", label: "Remix", count: 122 },
    ],
  },
  {
    id: "rating",
    label: "Rating",
    isMultiSelect: true,
    options: CONTENT_RATING_TIERS.map((tier) => ({
      value: tier.tier,
      label: tier.label,
      tooltip: tier.tooltip,
      isDisabled: Boolean(tier.isDisabled),
      count: tier.isDisabled ? null : 40,
    })),
  },
];

const defaultSortOptions = [
  { value: "recent", label: "Most recent" },
  { value: "popular", label: "Most played" },
  { value: "hearts", label: "Most hearted" },
];

export const kitStudioFilterBarDefaultFixture = {
  searchValue: "",
  searchPlaceholder: "Search Community",
  onSearchChange: noop,
  filterGroups: defaultFilterGroups,
  selectedValues: { type: ["character"] },
  onFilterToggle: noop,
  sortOptions: defaultSortOptions,
  selectedSort: "recent",
  onSortChange: noop,
  isLoadingCounts: false,
  viewModeSlot: null,
};

export const kitStudioFilterBarEmptyGroupsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  filterGroups: [],
  sortOptions: [],
  selectedValues: {},
};

export const kitStudioFilterBarLongestLabelsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  filterGroups: [
    {
      id: "registry",
      label: "Attached registries",
      isMultiSelect: true,
      options: [
        { value: "faction", label: "Faction Registry Attachments", count: 4 },
        { value: "organization", label: "Organization Registry Attachments", count: 2 },
        { value: "location", label: "Location Registry Attachments", count: 9 },
      ],
    },
  ],
  selectedValues: { registry: ["organization"] },
};

export const kitStudioFilterBarManyOptionsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  filterGroups: [
    {
      id: "realm",
      label: "Realm",
      isMultiSelect: true,
      options: Array.from({ length: 14 }, (_, index) => ({
        value: `realm-${index + 1}`,
        label: `Realm ${index + 1}`,
        count: (index + 1) * 3,
      })),
    },
    ...defaultFilterGroups,
  ],
  selectedValues: { realm: ["realm-3", "realm-9"] },
};

export const kitStudioFilterBarLoadingCountsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  isLoadingCounts: true,
};

// 2.1.0 fixtures (6 Sep 2026, FE/FILTERS): quick tabs beside the
// Filter button, an active panel with selections in three sections,
// and the ruled dropdown fallback presentation.
export const kitStudioFilterBarQuickTabsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  searchPlaceholder: "Search your images",
  quickTabs: [
    { value: "ALL", label: "All", count: 128 },
    { value: "IMAGES", label: "Images", count: 116 },
    { value: "VIDEOS", label: "Videos", count: 12 },
    { value: "LIKED", label: "Liked", count: 9 },
  ],
  selectedQuickTab: "ALL",
  onQuickTabChange: noop,
  filterGroups: [
    {
      id: "activity",
      label: "Activity",
      isMultiSelect: false,
      options: [{ value: "BOOKMARKED", label: "Bookmarked", count: 14 }],
    },
  ],
  selectedValues: {},
  sortOptions: [],
  selectedSort: "",
};

export const kitStudioFilterBarPanelActiveFixture = {
  ...kitStudioFilterBarManyOptionsFixture,
  selectedValues: { realm: ["realm-3", "realm-9"], type: ["character", "story"], rating: ["EVERYONE"] },
  onClearFilters: noop,
};

export const kitStudioFilterBarDropdownsPresentationFixture = {
  ...kitStudioFilterBarDefaultFixture,
  filterPresentation: "dropdowns",
};
