export const storyStartOpeningLocationOptionsFixture = Object.freeze([
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    title: "Deepcross",
    subtitle: "Fogbound market district",
    imageUrl: "/fixtures/deepcross.webp",
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    title: "Sunreach",
    subtitle: "High terraces above the eastern gate",
    imageUrl: "/fixtures/sunreach.webp",
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    title: "Brasswhisker Workshop",
    subtitle: "Workshop in the Old Crescent",
    imageUrl: "/fixtures/brasswhisker.webp",
  },
]);

export const storyStartOpeningLocationClosedFixture = Object.freeze({
  selectionRequired: true,
  open: false,
  options: storyStartOpeningLocationOptionsFixture,
  selectedLocationId: "",
  pending: false,
  error: "",
});

export const storyStartOpeningLocationOpenFixture = Object.freeze({
  selectionRequired: true,
  open: true,
  options: storyStartOpeningLocationOptionsFixture,
  selectedLocationId: "",
  pending: false,
  error: "",
});

export const storyStartOpeningLocationSelectedFixture = Object.freeze({
  ...storyStartOpeningLocationOpenFixture,
  selectedLocationId:
    "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
});

export const storyStartOpeningLocationPendingFixture = Object.freeze({
  ...storyStartOpeningLocationSelectedFixture,
  pending: true,
});

export const storyStartOpeningLocationInvalidSelectionFixture = Object.freeze({
  ...storyStartOpeningLocationOpenFixture,
  selectedLocationId:
    "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  error:
    "The selected starting Location is not allowed by this Story.",
});

export const storyStartOpeningLocationEmptyAllowedSetFixture = Object.freeze({
  selectionRequired: true,
  open: true,
  options: [],
  selectedLocationId: "",
  pending: false,
  error: "",
});

export const storyStartOpeningLocationFixedFixture = Object.freeze({
  selectionRequired: false,
  open: true,
  options: storyStartOpeningLocationOptionsFixture,
  selectedLocationId: "",
  pending: false,
  error: "",
});
