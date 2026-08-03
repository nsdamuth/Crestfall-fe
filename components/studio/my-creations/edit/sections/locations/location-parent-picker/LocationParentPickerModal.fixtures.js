const noop = () => {};

const locationItems = [
  {
    id: "fixture-location-glimmer-district",
    title: "The Glimmer District",
    subtitle: "District · Urban · Entertainment and nightlife quarter.",
    displayImageUrl: "/assets/covers/crestfall-compass-cover.png",
    imageAltText: "The Glimmer District fixture cover",
    isSelected: true,
    badges: ["Location", "District", "Urban"],
    referenceText: "fixture-location-glimmer-district",
  },
  {
    id: "fixture-location-aethelred-tower",
    title: "Aethelred Tower",
    subtitle: "Building · Interior · Historic vertical settlement.",
    displayImageUrl: "/assets/covers/crestfall-statue-cover.png",
    imageAltText: "Aethelred Tower fixture cover",
    isSelected: false,
    badges: ["Location", "Building", "Interior"],
    referenceText: "fixture-location-aethelred-tower",
  },
  {
    id: "fixture-location-crestfall",
    title: "Crestfall",
    subtitle: "City · Exterior · Coastal city built around the Wound of Nod.",
    displayImageUrl: "/assets/covers/crestfall-book-cover.png",
    imageAltText: "Crestfall city fixture cover",
    isSelected: false,
    badges: ["Location", "City", "Exterior"],
    referenceText: "fixture-location-crestfall",
  },
];

const baseFixture = {
  eyebrow: "Location Hierarchy",
  title: "Select Parent Location",
  description:
    "Choose the broader location this place belongs under. The parent location provides inherited runtime context such as weather, time, knowledge, and travel rules.",
  searchPlaceholder: "Search locations...",
  searchQuery: "",
  items: locationItems,
  isLoading: false,
  loadingMessage: "Loading locations...",
  errorMessage: "",
  emptyMessage: "No parent locations found.",
  onSearchQueryChange: noop,
  onClose: noop,
  onChooseLocation: noop,
};

export const locationParentPickerPopulatedFixture = {
  ...baseFixture,
};

export const locationParentPickerLoadingFixture = {
  ...baseFixture,
  items: [],
  isLoading: true,
};

export const locationParentPickerEmptyFixture = {
  ...baseFixture,
  items: [],
};

export const locationParentPickerErrorFixture = {
  ...baseFixture,
  items: [],
  errorMessage: "Locations could not be loaded.",
};

export const locationParentPickerSearchEmptyFixture = {
  ...baseFixture,
  searchQuery: "No matching location",
  items: [],
};

export const locationParentPickerLongContentFixture = {
  ...baseFixture,
  description:
    "This deliberately long fixture verifies that location hierarchy guidance remains readable while the portable picker is displayed at narrow and wide responsive sizes without exposing raw creation data to the View.",
  items: [
    {
      id: "fixture-location-long",
      title:
        "The Vast Interconnected Municipal Region Surrounding the Northern Veil Transit Corridor",
      subtitle:
        "Region · Mixed Interior and Exterior · A deliberately verbose location summary used to stress the card layout and metadata badges.",
      displayImageUrl: "/assets/covers/crestfall-sundial-cover.png",
      imageAltText: "Long-content location fixture cover",
      isSelected: false,
      badges: ["Location", "Region", "Mixed Space"],
      referenceText: "fixture-location-long-reference-identifier",
    },
  ],
};

export const locationParentPickerFixtureItems = locationItems;
