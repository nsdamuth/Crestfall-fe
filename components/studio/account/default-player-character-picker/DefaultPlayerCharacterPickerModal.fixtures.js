const noop = () => {};

const fixturePlayerCharacters = [
  {
    id: "fixture-player-character-1",
    title: "Mara Veyne",
    description:
      "A watchful investigator who follows supernatural disturbances through Crestfall.",
    displayImageUrl: "/assets/covers/crestfall-painting-cover.png",
    imageAltText: "Mara Veyne player character portrait",
    isSelected: true,
  },
  {
    id: "fixture-player-character-2",
    title: "Silas Thorn",
    description:
      "A former city guard with a talent for surviving places sensible people avoid.",
    displayImageUrl: "/assets/covers/crestfall-statue-cover.png",
    imageAltText: "Silas Thorn player character portrait",
    isSelected: false,
  },
  {
    id: "fixture-player-character-3",
    title: "Ilyra Ash",
    description:
      "An occult archivist searching for the missing pages of her family's forbidden history.",
    displayImageUrl: "/assets/covers/crestfall-ballerina-cover.png",
    imageAltText: "Ilyra Ash player character portrait",
    isSelected: false,
  },
];

const baseFixture = {
  searchQuery: "",
  playerCharacters: fixturePlayerCharacters,
  isLoading: false,
  errorMessage: "",
  onSearchQueryChange: noop,
  onClose: noop,
  onChoosePlayerCharacter: noop,
};

export const defaultPlayerCharacterPickerPopulatedFixture = {
  ...baseFixture,
};

export const defaultPlayerCharacterPickerLoadingFixture = {
  ...baseFixture,
  playerCharacters: [],
  isLoading: true,
};

export const defaultPlayerCharacterPickerEmptyFixture = {
  ...baseFixture,
  playerCharacters: [],
};

export const defaultPlayerCharacterPickerErrorFixture = {
  ...baseFixture,
  playerCharacters: [],
  errorMessage: "Player characters could not be loaded.",
};

export const defaultPlayerCharacterPickerSearchEmptyFixture = {
  ...baseFixture,
  searchQuery: "No matching identity",
  playerCharacters: [],
};

export const defaultPlayerCharacterPickerLongContentFixture = {
  ...baseFixture,
  playerCharacters: [
    {
      id: "fixture-player-character-long",
      title:
        "Doctor Alessandra Maren Vale of the Crestfall Historical Recovery Society",
      description:
        "A deliberately long fixture description used to verify that unusually verbose player-character names and summaries remain readable without damaging the modal card layout at desktop and constrained widths.",
      displayImageUrl: "/assets/covers/crestfall-book-cover.png",
      imageAltText: "Long-content player character portrait",
      isSelected: false,
    },
  ],
};

export const defaultPlayerCharacterPickerFixtureItems =
  fixturePlayerCharacters;
