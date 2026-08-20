function item({
  id,
  title,
  subtitle = "",
  description = "",
  type = "CHARACTER",
  contentRating = "SFW",
  imageUrl = "",
} = {}) {
  return {
    id,
    title,
    subtitle,
    description,
    type,
    contentRating,
    imageUrl,
  };
}

const STANDARD_ITEMS = [
  item({
    id: "fixture-dalethia",
    title: "Dalethia",
    subtitle: "A court mage carrying an impossible inheritance.",
  }),
  item({
    id: "fixture-aniyya",
    title: "Aniyya",
    subtitle: "A wandering archivist with a talent for forbidden maps.",
  }),
  item({
    id: "fixture-aethelred",
    title: "Aethelred",
    subtitle: "An oathbound knight from the northern marches.",
  }),
  item({
    id: "fixture-lantern",
    title: "The Lantern Below",
    description: "A descent into the buried observatory beneath the old city.",
    type: "SCENARIO",
  }),
];

export const creationPickerPanelDefaultFixture = {
  items: STANDARD_ITEMS,
  selectedIds: ["fixture-dalethia"],
  disabledIds: ["fixture-aethelred"],
  recommendedIds: ["fixture-aniyya"],
  searchPlaceholder: "Search creations...",
  emptyMessage: "No creations found.",
  actions: null,
  gridClassName: "max-h-[46vh] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  pageSize: 0,
  onSelect: null,
};

export const creationPickerPanelWithActionsFixture = {
  ...creationPickerPanelDefaultFixture,
  actions: "Preview action slot content",
};

export const creationPickerPanelImageFixture = {
  ...creationPickerPanelDefaultFixture,
  items: [
    item({
      id: "fixture-image-card",
      title: "Portrait Reference",
      subtitle: "A selected Image Studio ingredient.",
      type: "IMAGE_PRESET",
      imageUrl:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23120f0b'/%3E%3Ccircle cx='320' cy='210' r='110' fill='%23866f45' opacity='.45'/%3E%3Ctext x='320' y='390' text-anchor='middle' fill='%23d7c59a' font-size='28' font-family='serif'%3ECrestfall Preview%3C/text%3E%3C/svg%3E",
    }),
    ...STANDARD_ITEMS.slice(1),
  ],
  selectedIds: ["fixture-image-card"],
};

export const creationPickerPanelSearchStressFixture = {
  ...creationPickerPanelDefaultFixture,
  items: [
    ...STANDARD_ITEMS,
    item({
      id: "fixture-location",
      title: "The Brass Finch",
      subtitle: "A crowded public house near the market gate.",
      type: "LOCATION",
    }),
    item({
      id: "fixture-narrator",
      title: "Noir Chronicle Voice",
      subtitle: "Measured prose with restrained sensory detail.",
      type: "NARRATOR",
    }),
  ],
  searchPlaceholder: "Search titles, descriptions, types, and ratings...",
};

export const creationPickerPanelEmptyFixture = {
  ...creationPickerPanelDefaultFixture,
  items: [],
  selectedIds: [],
  disabledIds: [],
  recommendedIds: [],
};

export const creationPickerPanelLongContentFixture = {
  ...creationPickerPanelDefaultFixture,
  items: [
    item({
      id: "fixture-long-item",
      title:
        "The Unreasonably Long Chronicle of the Lantern Keepers Beneath the Western Observatory",
      subtitle:
        "A deliberately extended description used to stress wrapping, truncation, card height, and narrow responsive layouts without changing application behavior.",
      type: "ROOM_TEMPLATE",
      contentRating: "MATURE",
    }),
    ...STANDARD_ITEMS,
  ],
  recommendedIds: ["fixture-long-item"],
};

export const creationPickerPanelCustomGridFixture = {
  ...creationPickerPanelDefaultFixture,
  gridClassName: "max-h-[38vh] sm:grid-cols-2 lg:grid-cols-3",
};


export const creationPickerPanelPaginationFixture = {
  ...creationPickerPanelSearchStressFixture,
  items: Array.from({ length: 25 }, (_, index) =>
    item({
      id: `fixture-paged-${index + 1}`,
      title: `Paged Creation ${index + 1}`,
      subtitle: "Synthetic item for presentation-only pagination validation.",
      type: index % 2 === 0 ? "CHARACTER" : "LOCATION",
    })
  ),
  selectedIds: [],
  disabledIds: [],
  recommendedIds: [],
  pageSize: 12,
};
