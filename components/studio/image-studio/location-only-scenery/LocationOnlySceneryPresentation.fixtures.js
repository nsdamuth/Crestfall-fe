export const locationOnlySceneryLocationFixture = Object.freeze({
  mode: "IMAGE",
  selectedIngredients: {
    location: {
      id: "fixture-location-brasswhisker-workshop",
      title: "The Brasswhisker's Workshop",
      type: "LOCATION",
    },
  },
  enabled: true,
});

export const locationOnlySceneryDisabledFixture = Object.freeze({
  ...locationOnlySceneryLocationFixture,
  enabled: false,
});

export const locationOnlySceneryCharacterFixture = Object.freeze({
  mode: "IMAGE",
  selectedIngredients: {
    location: {
      id: "fixture-location-brasswhisker-workshop",
      title: "The Brasswhisker's Workshop",
      type: "LOCATION",
    },
    character: {
      id: "fixture-character-kessa",
      title: "Kessa Cindervell",
      type: "CHARACTER",
    },
  },
  enabled: true,
});

export const locationOnlySceneryPlayerCharacterFixture = Object.freeze({
  mode: "IMAGE",
  selectedIngredients: {
    location: {
      id: "fixture-location-brasswhisker-workshop",
      title: "The Brasswhisker's Workshop",
      type: "LOCATION",
    },
    playerCharacter: {
      id: "fixture-player-rowan",
      title: "Rowan",
      type: "PLAYER_CHARACTER",
    },
  },
  enabled: true,
});

export const locationOnlySceneryVideoFixture = Object.freeze({
  ...locationOnlySceneryLocationFixture,
  mode: "VIDEO",
});

export const locationOnlySceneryEmptyFixture = Object.freeze({
  mode: "IMAGE",
  selectedIngredients: {},
  enabled: true,
});
