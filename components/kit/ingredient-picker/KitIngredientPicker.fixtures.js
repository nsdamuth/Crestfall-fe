// Fixture states per docs/SPRINT-E-PLAN.md section 4: per-slot
// default, empty results, load error. A savable-slot variant is
// added to exercise the New Preset card (savable slots only), a
// meaningful state the plan's minimum list does not name separately
// but the anatomy requires covering.
const noop = () => {};

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const CHARACTER_ITEMS = [
  { id: "char-1", title: "Vesper Ash", subtitle: "Character", imageSrc: creatorArt("vermillion-8"), isSelected: true },
  { id: "char-2", title: "Kaela Veynskald", subtitle: "Character", imageSrc: creatorArt("vermillion-2"), isSelected: false },
  { id: "char-3", title: "Elowen", subtitle: "Character", imageSrc: creatorArt("vermillion-4"), isSelected: false },
  { id: "char-4", title: "Corwin", subtitle: "Character", imageSrc: null, isSelected: false },
];

const POSE_ITEMS = [
  { id: "pose-1", title: "Half-Turn, Cloak Drawn Back", subtitle: "Pose", imageSrc: creatorArt("vermillion-6"), isSelected: false },
  { id: "pose-2", title: "Seated, Hands Folded", subtitle: "Pose", imageSrc: creatorArt("vermillion-9"), isSelected: true },
  { id: "pose-3", title: "Mid-Stride, Looking Back", subtitle: "Pose", imageSrc: creatorArt("vermillion-11"), isSelected: false },
];

export const kitIngredientPickerFixtures = [
  {
    id: "default",
    label: "Character (default)",
    props: {
      slotLabel: "Character",
      searchValue: "",
      searchPlaceholder: "Search character...",
      onSearchChange: noop,
      items: CHARACTER_ITEMS,
      emptyMessage: "No character assets found.",
      loadErrorMessage: "",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      onUseCustom: noop,
      showCreatePresetAction: false,
      onCreatePreset: noop,
      onClose: noop,
    },
  },
  {
    id: "savableSlot",
    label: "Pose (savable slot)",
    props: {
      slotLabel: "Pose",
      searchValue: "",
      searchPlaceholder: "Search pose...",
      onSearchChange: noop,
      items: POSE_ITEMS,
      emptyMessage: "No pose assets found.",
      loadErrorMessage: "",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      onUseCustom: noop,
      showCreatePresetAction: true,
      onCreatePreset: noop,
      onClose: noop,
    },
  },
  {
    id: "emptyResults",
    label: "Empty results",
    props: {
      slotLabel: "Location / Scene",
      searchValue: "underwater cathedral",
      searchPlaceholder: "Search location / scene...",
      onSearchChange: noop,
      items: [],
      emptyMessage: "No location / scene assets found.",
      loadErrorMessage: "",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      onUseCustom: noop,
      showCreatePresetAction: true,
      onCreatePreset: noop,
      onClose: noop,
    },
  },
  {
    id: "loadError",
    label: "Load error",
    props: {
      slotLabel: "Clothing Source",
      searchValue: "",
      searchPlaceholder: "Search clothing source...",
      onSearchChange: noop,
      items: [],
      emptyMessage: "No clothing source assets found.",
      loadErrorMessage: "Image Studio assets could not be loaded.",
      onChooseIngredient: noop,
      showUseCustomAction: true,
      onUseCustom: noop,
      showCreatePresetAction: true,
      onCreatePreset: noop,
      onClose: noop,
    },
  },
];
