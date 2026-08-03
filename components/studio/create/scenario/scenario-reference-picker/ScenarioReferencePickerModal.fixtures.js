const noop = () => {};

export const scenarioReferencePickerFixtureItems = [
  {
    id: "fixture-character-aniyya",
    title: "Aniyya",
    subtitle: "A seer whose calm attention conceals impossible depth.",
    typeLabel: "CHARACTER",
    ratingLabel: "SFW",
    imageUrl: "/assets/covers/crestfall-camellia-cover.png",
    imageAltText: "Aniyya reference image",
    isSelected: true,
  },
  {
    id: "fixture-character-dalethia",
    title: "Dalethia",
    subtitle: "An ancient presence moving through the modern city.",
    typeLabel: "CHARACTER",
    ratingLabel: "SFW",
    imageUrl: "/assets/covers/crestfall-cloak-cover.png",
    imageAltText: "Dalethia reference image",
    isSelected: false,
  },
  {
    id: "fixture-character-lux",
    title: "Lux",
    subtitle: "A luminous figure tied to Crestfall's hidden histories.",
    typeLabel: "CHARACTER",
    ratingLabel: "SFW",
    imageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    imageAltText: "Lux reference image",
    isSelected: true,
  },
  {
    id: "fixture-character-no-image",
    title: "Unnamed Witness",
    subtitle: "A reference card intentionally rendered without an image.",
    typeLabel: "CHARACTER",
    ratingLabel: "SFW",
    imageUrl: "",
    imageAltText: "Unnamed Witness reference image",
    isSelected: false,
  },
];

const baseFixture = {
  eyebrow: "Select Scenario Reference",
  title: "Required Characters",
  body:
    "Select Character creations required for this Scenario. Player Characters are not available here.",
  searchQuery: "",
  searchPlaceholder: "Search required characters...",
  items: scenarioReferencePickerFixtureItems,
  selectedCount: 2,
  showSelectedCount: true,
  showDoneAction: true,
  emptyMessage: "No Character creations are available yet.",
  onSearchQueryChange: noop,
  onChooseItem: noop,
  onClose: noop,
};

export const scenarioReferencePickerMultipleFixture = {
  ...baseFixture,
};

export const scenarioReferencePickerSingleFixture = {
  ...baseFixture,
  title: "Primary Location",
  body: "Choose the primary Location creation used by this Scenario.",
  searchPlaceholder: "Search primary location...",
  items: [
    {
      id: "fixture-location-aethelred",
      title: "Aethelred Tower",
      subtitle:
        "A vertical district of old wealth, hidden machinery, and guarded histories.",
      typeLabel: "LOCATION",
      ratingLabel: "SFW",
      imageUrl: "/assets/covers/crestfall-statue-cover.png",
      imageAltText: "Aethelred Tower reference image",
      isSelected: true,
    },
    {
      id: "fixture-location-glimmer",
      title: "The Glimmer District",
      subtitle: "Neon streets, layered nightlife, and businesses that never close.",
      typeLabel: "LOCATION",
      ratingLabel: "SFW",
      imageUrl: "/assets/covers/crestfall-compass-cover.png",
      imageAltText: "The Glimmer District reference image",
      isSelected: false,
    },
  ],
  selectedCount: 1,
  showSelectedCount: false,
  showDoneAction: false,
  emptyMessage: "No Location creations are available yet.",
};

export const scenarioReferencePickerEmptyFixture = {
  ...baseFixture,
  items: [],
  selectedCount: 0,
  showSelectedCount: false,
};

export const scenarioReferencePickerSearchEmptyFixture = {
  ...baseFixture,
  searchQuery: "not-a-real-reference",
  items: [],
  selectedCount: 2,
};

export const scenarioReferencePickerLongContentFixture = {
  ...baseFixture,
  title:
    "Required Characters Whose Presence Is Necessary for Every Intended Branch of This Deliberately Long Scenario",
  body:
    "This fixture verifies that the portable Scenario reference picker remains readable when its heading, explanatory copy, card title, card summary, and selection state are substantially longer than normal without exposing Scenario storage fields or registry-binding behavior to the View.",
  searchPlaceholder:
    "Search all required characters connected to this unusually detailed Scenario...",
  items: [
    {
      id: "fixture-character-long",
      title:
        "The Archivist Who Remembers Every Version of Crestfall Except the One Everyone Else Currently Inhabits",
      subtitle:
        "A deliberately verbose reference summary used to stress responsive card layout, title wrapping, selected-state placement, and metadata presentation.",
      typeLabel: "CHARACTER",
      ratingLabel: "SFW",
      imageUrl: "/assets/covers/crestfall-drawings-cover.png",
      imageAltText: "Long-content character reference image",
      isSelected: true,
    },
  ],
  selectedCount: 1,
};
