const noop = () => {};

const fixtureImages = [
  {
    id: "fixture-image-1",
    displayImageUrl: "/assets/covers/crestfall-painting-cover.png",
    altText: "Fixture portrait option one",
    metadataLabel: "SFW · CLEAR",
    isSelected: true,
  },
  {
    id: "fixture-image-2",
    displayImageUrl: "/assets/covers/crestfall-statue-cover.png",
    altText: "Fixture portrait option two",
    metadataLabel: "SFW · APPROVED",
  },
  {
    id: "fixture-image-3",
    displayImageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    altText: "Fixture portrait option three",
    metadataLabel: "MATURE · CLEAR",
  },
  {
    id: "fixture-image-4",
    displayImageUrl: "/assets/covers/crestfall-camellia-cover.png",
    altText: "Fixture portrait option four",
    metadataLabel: "SFW · CLEAR",
  },
];

const baseFixture = {
  slotLabel: "Primary",
  images: fixtureImages,
  isLoading: false,
  loadErrorMessage: "",
  saveMessage: "",
  saveMessageTone: "notice",
  activeImageId: null,
  hasMoreImages: true,
  refreshDisabled: false,
  onClose: noop,
  onRefresh: noop,
  onLoadMore: noop,
  onChooseImage: noop,
};

export const creationFeaturedImagePickerPopulatedFixture = {
  ...baseFixture,
};

export const creationFeaturedImagePickerLoadingFixture = {
  ...baseFixture,
  images: [],
  isLoading: true,
  hasMoreImages: false,
  refreshDisabled: true,
};

export const creationFeaturedImagePickerEmptyFixture = {
  ...baseFixture,
  images: [],
  hasMoreImages: false,
};

export const creationFeaturedImagePickerLoadErrorFixture = {
  ...baseFixture,
  images: [],
  loadErrorMessage: "Image library could not be loaded.",
  hasMoreImages: false,
};

export const creationFeaturedImagePickerSavingFixture = {
  ...baseFixture,
  activeImageId: fixtureImages[1].id,
};

export const creationFeaturedImagePickerSaveErrorFixture = {
  ...baseFixture,
  saveMessage: "Featured image slot could not be saved.",
  saveMessageTone: "error",
  hasMoreImages: false,
};

export const creationFeaturedImagePickerStockFixture = {
  ...baseFixture,
  sourceOptions: [
    { id: "library", label: "Your Images" },
    { id: "stock", label: "Crestfall Stock" },
  ],
  activeSource: "stock",
  images: [
    {
      id: "crestfall-stock-compass",
      title: "Compass",
      displayImageUrl: "/assets/covers/crestfall-compass-cover.png",
      altText: "Compass",
      description: "Antique navigation artwork for travel, locations, and worldbuilding.",
      category: "Worlds & Places",
      orientationLabel: "Portrait cover",
      metadataLabel: "Worlds & Places · Portrait cover",
      tags: ["cartography", "travel", "world"],
      isStockMedia: true,
      isSelected: true,
    },
    {
      id: "crestfall-stock-book",
      title: "Book",
      displayImageUrl: "/assets/covers/crestfall-book-cover.png",
      altText: "Book",
      description: "Antique book artwork for stories, chronicles, codices, and lore.",
      category: "Story & Lore",
      orientationLabel: "Portrait cover",
      metadataLabel: "Story & Lore · Portrait cover",
      tags: ["book", "lore", "story"],
      isStockMedia: true,
    },
  ],
  hasMoreImages: false,
  searchValue: "",
  searchPlaceholder: "Search stock by title, tag, or use...",
  filterOptions: [
    { id: "all", label: "All" },
    { id: "Worlds & Places", label: "Worlds & Places" },
    { id: "Story & Lore", label: "Story & Lore" },
  ],
  activeFilter: "all",
  resultsLabel: "2 of 2 stock images",
  showClearFilters: false,
  helperText: "Choose Crestfall-owned artwork by title, category, or tag.",
  onSearchChange: noop,
  onFilterChange: noop,
  onClearFilters: noop,
};
