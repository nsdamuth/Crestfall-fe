const noop = () => {};

const ROOM_ITEMS = [
  { id: "room-1", title: "The Vermillion Coast Tavern", subtitle: "Location, Public" },
  { id: "room-2", title: "Aethelgard Amphitheater", subtitle: "Location, Canon", badgeLabel: "Canon" },
  { id: "room-3", title: "Lilith's Sanctum", subtitle: "Location, Private" },
  { id: "room-4", title: "The Black Crown Sky Overlook", subtitle: "Location, Public" },
];

export const kitPickerModalSingleFixture = {
  title: "Select a room template",
  layout: "rows",
  isMultiSelect: false,
  items: ROOM_ITEMS,
  selectedIds: [],
  searchValue: "",
  searchPlaceholder: "Search room templates",
  filters: [],
  isLoading: false,
  hasMore: false,
  isSearching: false,
  onSearchChange: noop,
  onToggleItem: noop,
  onConfirm: noop,
  onClose: noop,
};

export const kitPickerModalMultiSelectedFixture = {
  title: "Select creations to include",
  layout: "grid",
  isMultiSelect: true,
  items: ROOM_ITEMS,
  selectedIds: ["room-1", "room-3"],
  searchValue: "",
  searchPlaceholder: "Search creations",
  filters: [
    { value: "location", label: "Locations", isSelected: true },
    { value: "character", label: "Characters", isSelected: false },
  ],
  isLoading: false,
  hasMore: true,
  isSearching: false,
  onSearchChange: noop,
  onToggleFilter: noop,
  onToggleItem: noop,
  onLoadMore: noop,
  onConfirm: noop,
  onClose: noop,
};

export const kitPickerModalSearchingFixture = {
  ...kitPickerModalSingleFixture,
  searchValue: "vermill",
  isSearching: true,
  items: [],
};

export const kitPickerModalEmptyFixture = {
  ...kitPickerModalSingleFixture,
  searchValue: "no matching creations",
  items: [],
  emptyMessage: "No matching creations found.",
};

export const kitPickerModalLoadingFixture = {
  ...kitPickerModalMultiSelectedFixture,
  isLoading: true,
  hasMore: true,
};

export const kitPickerModalErrorFixture = {
  ...kitPickerModalSingleFixture,
  items: [],
  errorMessage: "Could not load room templates. Try again.",
};

export const kitPickerModalLongestRowsFixture = {
  title: "Select a scenario reference",
  layout: "rows",
  isMultiSelect: true,
  items: [
    {
      id: "long-1",
      title: "The Lantern-Keeper of the Vermillion Coast, Third Cycle, Reforged Edition",
      subtitle:
        "A supporting line long enough to prove the row truncates instead of overflowing the picker.",
      badgeLabel: "Canon",
    },
    { id: "long-2", title: "Short", subtitle: "Location" },
  ],
  selectedIds: ["long-1"],
  searchValue: "",
  searchPlaceholder: "Search scenario references",
  filters: [],
  isLoading: false,
  hasMore: false,
  isSearching: false,
  onSearchChange: noop,
  onToggleItem: noop,
  onConfirm: noop,
  onClose: noop,
};
