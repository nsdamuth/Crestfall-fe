import { CREATION_PICKER_BUCKETS } from "./creationPickerBuckets";

const noop = () => {};

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const ITEMS = [
  { id: "fx-character", title: "Lilith of the Vermillion Coast", subtitle: "Character", imageSrc: canonArt("Lilith"), badgeLabel: "Canon" },
  { id: "fx-player-character", title: "Vesper Ash", subtitle: "Player Character", imageSrc: canonArt("Jax Riker"), badgeLabel: "Private" },
  { id: "fx-location", title: "The Vermillion Coast Tavern", subtitle: "Location", imageSrc: canonArt("athelgard-ampitheater-profile"), badgeLabel: "Private" },
  { id: "fx-faction-registry", title: "Coastal Trade Factions", subtitle: "Faction Registry", imageSrc: creatorArt("vermillion-5"), badgeLabel: "Unlisted" },
  { id: "fx-outfit", title: "Traveler's Garb of the Vermillion Coast", subtitle: "Outfit", imageSrc: creatorArt("vermillion-2"), badgeLabel: "Private" },
  { id: "fx-pose", title: "Windswept Overlook Pose", subtitle: "Pose", imageSrc: creatorArt("vermillion-10"), badgeLabel: "Unlisted" },
  { id: "fx-story", title: "Coldwater Vigil", subtitle: "Story", imageSrc: creatorArt("vermillion-12"), badgeLabel: "Public" },
  { id: "fx-adventure", title: "Neon Harbor Cycle", subtitle: "Adventure", imageSrc: creatorArt("vermillion-13"), badgeLabel: "Canon" },
  { id: "fx-narrator", title: "The Vermillion Narrator", subtitle: "Narrator", imageSrc: creatorArt("vermillion-15"), badgeLabel: "Private" },
  { id: "fx-lore", title: "The Black Crown Sky Lore", subtitle: "Lore Asset", imageSrc: creatorArt("vermillion-21"), badgeLabel: "Canon" },
];

function bucketChips(activeValue) {
  return [
    ...CREATION_PICKER_BUCKETS.map((bucket) => ({
      value: bucket.value,
      label: bucket.label,
      isSelected: activeValue === bucket.value,
    })),
    { value: "sort-recency", label: "Sort: Recent", isSelected: false },
  ];
}

export const creationPickerDefaultFixture = {
  title: "Choose a creation",
  items: ITEMS,
  searchValue: "",
  searchPlaceholder: "Search your creations",
  filters: bucketChips(null),
  isSearching: false,
  isEmpty: false,
  emptyCreateLabel: "Create your first creation",
  emptyMessage: "No matching creations found.",
  errorMessage: "",
  onSearchChange: noop,
  onToggleFilter: noop,
  onToggleItem: noop,
  onConfirm: noop,
  onClose: noop,
  onCreateNew: noop,
};

export const creationPickerEmptyFixture = {
  ...creationPickerDefaultFixture,
  title: "Choose a creation",
  items: [],
  isEmpty: true,
};

export const creationPickerSearchingFixture = {
  ...creationPickerDefaultFixture,
  searchValue: "vermill",
  isSearching: true,
  items: [],
};

export const creationPickerNoResultsFixture = {
  ...creationPickerDefaultFixture,
  searchValue: "a creation that does not exist",
  items: [],
  emptyMessage: "No matching creations found.",
};

export const creationPickerErrorFixture = {
  ...creationPickerDefaultFixture,
  items: [],
  errorMessage: "Could not load your creations. Try again.",
};

export const creationPickerLongestFixture = {
  ...creationPickerDefaultFixture,
  items: [
    {
      id: "fx-longest",
      title: "The Lantern-Keeper of the Vermillion Coast, Third Cycle, Reforged Cartography Edition",
      subtitle: "Actor Mechanics Profile",
      imageSrc: creatorArt("vermillion-22"),
      badgeLabel: "Unlisted",
    },
    ...ITEMS,
  ],
};

export const creationPickerFilteredCharactersFixture = {
  ...creationPickerDefaultFixture,
  items: ITEMS.filter((item) => item.subtitle === "Character" || item.subtitle === "Player Character"),
  filters: bucketChips("characters"),
};

export const creationPickerFilteredWorldsFixture = {
  ...creationPickerDefaultFixture,
  items: ITEMS.filter((item) => item.subtitle === "Location" || item.subtitle === "Faction Registry"),
  filters: bucketChips("worlds"),
};

export const creationPickerFilteredLooksFixture = {
  ...creationPickerDefaultFixture,
  items: ITEMS.filter((item) => item.subtitle === "Outfit" || item.subtitle === "Pose"),
  filters: bucketChips("looks"),
};

export const creationPickerFilteredStoriesFixture = {
  ...creationPickerDefaultFixture,
  items: ITEMS.filter((item) => item.subtitle === "Story"),
  filters: bucketChips("stories"),
};

export const creationPickerFilteredAdventuresFixture = {
  ...creationPickerDefaultFixture,
  items: ITEMS.filter((item) => item.subtitle === "Adventure"),
  filters: bucketChips("adventures"),
};

export const creationPickerFilteredMoreFixture = {
  ...creationPickerDefaultFixture,
  items: ITEMS.filter((item) => item.subtitle === "Narrator" || item.subtitle === "Lore Asset"),
  filters: bucketChips("more"),
};
