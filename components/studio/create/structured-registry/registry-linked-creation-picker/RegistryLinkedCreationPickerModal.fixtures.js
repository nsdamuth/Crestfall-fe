const noop = () => {};

const fixtureCreations = [
  {
    id: "fixture-location-registry",
    title: "Glimmer District Locations",
    subtitle:
      "LOCATION_REGISTRY · District and venue references for the Glimmer District.",
    typeLabel: "LOCATION_REGISTRY",
    displayImageUrl: "/assets/covers/crestfall-compass-cover.png",
    imageAltText: "Glimmer District location registry cover",
    isSelected: true,
  },
  {
    id: "fixture-npc-registry",
    title: "Aethelred Tower Residents",
    subtitle:
      "NPC_REGISTRY · Recurring residents, staff, visitors, and witnesses.",
    typeLabel: "NPC_REGISTRY",
    displayImageUrl: "/assets/covers/crestfall-book-cover.png",
    imageAltText: "Aethelred Tower NPC registry cover",
    isSelected: false,
  },
  {
    id: "fixture-item-registry",
    title: "Recovered Wound Artifacts",
    subtitle:
      "ITEM_REGISTRY · Catalogued relics recovered from beneath Crestfall.",
    typeLabel: "ITEM_REGISTRY",
    displayImageUrl: "/assets/covers/crestfall-scrolls-cover.png",
    imageAltText: "Recovered Wound artifacts registry cover",
    isSelected: false,
  },
];

const baseFixture = {
  title: "Attach Registry",
  body: "Choose a registry to attach to this location.",
  searchQuery: "",
  creations: fixtureCreations,
  isLoading: false,
  errorMessage: "",
  onSearchQueryChange: noop,
  onClose: noop,
  onChooseCreation: noop,
};

export const registryLinkedCreationPickerPopulatedFixture = {
  ...baseFixture,
};

export const registryLinkedCreationPickerLoadingFixture = {
  ...baseFixture,
  creations: [],
  isLoading: true,
};

export const registryLinkedCreationPickerEmptyFixture = {
  ...baseFixture,
  creations: [],
};

export const registryLinkedCreationPickerErrorFixture = {
  ...baseFixture,
  creations: [],
  errorMessage: "Creations could not be loaded.",
};

export const registryLinkedCreationPickerSearchEmptyFixture = {
  ...baseFixture,
  searchQuery: "No matching registry",
  creations: [],
};

export const registryLinkedCreationPickerLongContentFixture = {
  ...baseFixture,
  title: "Attach a Creation to the Selected Structured Registry Relationship",
  body:
    "This deliberately long fixture verifies that caller-supplied headings and explanatory text remain readable when the reusable picker is opened from a complex registry workflow.",
  creations: [
    {
      id: "fixture-long-registry",
      title:
        "Comprehensive Registry of Interconnected Locations, Residents, Artifacts, Events, and Operational Rules",
      subtitle:
        "LOCATION_REGISTRY · A deliberately verbose summary used to stress the card layout at narrow and wide responsive widths without exposing raw creation data to the View.",
      typeLabel: "LOCATION_REGISTRY",
      displayImageUrl: "/assets/covers/crestfall-sundial-cover.png",
      imageAltText: "Long-content registry fixture cover",
      isSelected: false,
    },
  ],
};

export const registryLinkedCreationPickerFixtureItems = fixtureCreations;
