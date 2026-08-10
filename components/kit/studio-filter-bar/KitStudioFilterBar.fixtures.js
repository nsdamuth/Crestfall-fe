const noop = () => {};

const defaultFilterGroups = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "character", label: "Character", count: 214 },
      { value: "story", label: "Story", count: 88 },
      { value: "adventure", label: "Adventure", count: 12 },
    ],
  },
  {
    id: "rating",
    label: "Rating tier",
    options: [
      { value: "sfw", label: "SFW", count: 301 },
      { value: "mature", label: "Mature", count: 13 },
    ],
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
      options: [
        { value: "faction", label: "Faction Registry Attachments", count: 4 },
        { value: "organization", label: "Organization Registry Attachments", count: 2 },
        { value: "location", label: "Location Registry Attachments", count: 9 },
      ],
    },
  ],
  selectedValues: { registry: ["organization"] },
};

export const kitStudioFilterBarManyChipsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  filterGroups: [
    {
      id: "realm",
      label: "Realm",
      options: Array.from({ length: 14 }, (_, index) => ({
        value: `realm-${index + 1}`,
        label: `Realm ${index + 1}`,
        count: (index + 1) * 3,
      })),
    },
  ],
  selectedValues: { realm: ["realm-3", "realm-9"] },
};

export const kitStudioFilterBarLoadingCountsFixture = {
  ...kitStudioFilterBarDefaultFixture,
  isLoadingCounts: true,
};
