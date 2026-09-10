// Fixture states: per-slot default (cards, source filter), the rows
// layout (camera framing, group filter, no Custom), empty results
// (Custom still first), load error. The longest-content case rides on
// the long titles inside the default and camera sets.
const noop = () => {};

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const SOURCE_FILTER = {
  label: "Filter",
  options: [
    { value: "MINE", label: "Mine" },
    { value: "PUBLIC", label: "Public" },
  ],
  value: "MINE",
  restingValue: "MINE",
  onChange: noop,
};

const CAMERA_FILTER = {
  label: "Filter",
  options: [
    { value: "ALL", label: "All" },
    { value: "shot-size", label: "Shot size" },
    { value: "camera-angle", label: "Camera angle" },
    { value: "lens", label: "Lens" },
  ],
  value: "ALL",
  restingValue: "ALL",
  onChange: noop,
};

const CHARACTER_ITEMS = [
  { id: "char-1", title: "Vesper Ash", subtitle: "Character", imageSrc: creatorArt("vermillion-8"), isSelected: true },
  { id: "char-2", title: "Kaela Veynskald, Warden of the Northern Reach", subtitle: "Character", imageSrc: creatorArt("vermillion-2"), isSelected: false },
  { id: "char-3", title: "Elowen", subtitle: "Character", imageSrc: creatorArt("vermillion-4"), isSelected: false },
  { id: "char-4", title: "Corwin", subtitle: "Character", imageSrc: null, isSelected: false },
];

const CAMERA_ITEMS = [
  { id: "AUTO", title: "Auto / No Camera Filter", description: "Let the image model choose framing and camera treatment.", subtitle: "Automatic", isSelected: true },
  { id: "EXTREME_WIDE_SHOT", title: "Extreme Wide Shot (EWS)", description: "Establishing view with the character small in the environment.", subtitle: "Shot size", isSelected: false },
  { id: "WIDE_SHOT", title: "Wide Shot (WS)", description: "Full figure visible from head to toe.", subtitle: "Shot size", isSelected: false },
  { id: "LOW_ANGLE", title: "Low Angle", description: "Camera below eye level looking up, the subject reads taller and more commanding than a level shot would make them.", subtitle: "Camera angle", isSelected: false },
  { id: "TELEPHOTO", title: "Telephoto Lens", description: "Compressed depth, the background pulled close behind the subject.", subtitle: "Lens", isSelected: false },
];

export const kitIngredientPickerFixtures = [
  {
    id: "default",
    label: "Character (default)",
    props: {
      slotLabel: "Character",
      description: "",
      searchValue: "",
      searchPlaceholder: "Search character...",
      onSearchChange: noop,
      filter: SOURCE_FILTER,
      items: CHARACTER_ITEMS,
      itemLayout: "cards",
      emptyMessage: "No character assets found.",
      loadErrorMessage: "",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      customIsSelected: false,
      onUseCustom: noop,
      onClose: noop,
    },
  },
  {
    id: "camera",
    label: "Camera framing (rows)",
    props: {
      slotLabel: "Camera framing",
      description: "Choose one camera treatment. Auto leaves the camera to the image model.",
      searchValue: "",
      searchPlaceholder: "Search camera presets...",
      onSearchChange: noop,
      filter: CAMERA_FILTER,
      items: CAMERA_ITEMS,
      itemLayout: "rows",
      emptyMessage: "No camera presets match this search.",
      loadErrorMessage: "",
      onChooseIngredient: noop,
      showUseCustomAction: false,
      customIsSelected: false,
      onUseCustom: null,
      onClose: noop,
    },
  },
  {
    id: "emptyResults",
    label: "Empty results",
    props: {
      slotLabel: "Location",
      description: "",
      searchValue: "underwater cathedral",
      searchPlaceholder: "Search location...",
      onSearchChange: noop,
      filter: SOURCE_FILTER,
      items: [],
      itemLayout: "cards",
      emptyMessage: "No location assets found.",
      loadErrorMessage: "",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      customIsSelected: true,
      onUseCustom: noop,
      onClose: noop,
    },
  },
  {
    id: "loadError",
    label: "Load error",
    props: {
      slotLabel: "Outfit",
      description: "",
      searchValue: "",
      searchPlaceholder: "Search outfit...",
      onSearchChange: noop,
      filter: SOURCE_FILTER,
      items: [],
      itemLayout: "cards",
      emptyMessage: "No outfit assets found.",
      loadErrorMessage: "Media Studio assets could not be loaded.",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      customIsSelected: false,
      onUseCustom: noop,
      onClose: noop,
    },
  },
];
