const noop = () => {};

const portraitOne =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='640' viewBox='0 0 480 640'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23100d0b'/%3E%3Cstop offset='1' stop-color='%236f5634'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='480' height='640' fill='url(%23g)'/%3E%3Ccircle cx='240' cy='220' r='92' fill='%23c9aa70'/%3E%3Cpath d='M80 640c15-190 95-285 160-285s145 95 160 285' fill='%232a2118'/%3E%3C/svg%3E";

const portraitTwo =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='640' viewBox='0 0 480 640'%3E%3Crect width='480' height='640' fill='%230d1420'/%3E%3Ccircle cx='240' cy='220' r='92' fill='%2386a6bd'/%3E%3Cpath d='M70 640c20-185 100-280 170-280s150 95 170 280' fill='%231d2c3a'/%3E%3C/svg%3E";

function featuredSlot({
  id,
  label,
  imageUrl = null,
  index,
  isActive = false,
}) {
  return Object.freeze({ id, label, imageUrl, index, isActive });
}

const baseFixture = Object.freeze({
  creationTitle: "Seraphine Vale",
  fallbackInitial: "S",
  activeMedia: null,
  featuredSlots: Object.freeze([]),
  imageLibraryHref:
    "/studio/my-creations/preview-creation/image-library?slot=primary",
  supportsChatMedia: true,
  onSelectFeaturedSlot: noop,
  onReplaceActiveSlot: noop,
});

const populatedSlots = Object.freeze([
  featuredSlot({
    id: "slot-primary",
    label: "Primary",
    imageUrl: portraitOne,
    index: 0,
    isActive: true,
  }),
  featuredSlot({
    id: "slot-alt-1",
    label: "Alt 1",
    imageUrl: portraitTwo,
    index: 1,
  }),
  featuredSlot({ id: "slot-alt-2", label: "Alt 2", index: 2 }),
  featuredSlot({ id: "slot-alt-3", label: "Alt 3", index: 3 }),
]);

export const creationEditMediaPopulatedFixture = Object.freeze({
  ...baseFixture,
  activeMedia: populatedSlots[0],
  featuredSlots: populatedSlots,
});

const emptySlots = Object.freeze([
  featuredSlot({
    id: "empty-primary",
    label: "Primary",
    index: 0,
    isActive: true,
  }),
  featuredSlot({ id: "empty-alt-1", label: "Alt 1", index: 1 }),
  featuredSlot({ id: "empty-alt-2", label: "Alt 2", index: 2 }),
  featuredSlot({ id: "empty-alt-3", label: "Alt 3", index: 3 }),
]);

export const creationEditMediaEmptyFixture = Object.freeze({
  ...baseFixture,
  creationTitle: "Untitled Creation",
  fallbackInitial: "U",
  activeMedia: emptySlots[0],
  featuredSlots: emptySlots,
});

const alternateActiveSlots = Object.freeze(
  populatedSlots.map((slot, index) =>
    Object.freeze({ ...slot, isActive: index === 1 })
  )
);

export const creationEditMediaAlternateActiveFixture = Object.freeze({
  ...baseFixture,
  activeMedia: alternateActiveSlots[1],
  featuredSlots: alternateActiveSlots,
  imageLibraryHref:
    "/studio/my-creations/preview-creation/image-library?slot=alt1",
});

export const creationEditMediaIngredientFixture = Object.freeze({
  ...creationEditMediaPopulatedFixture,
  creationTitle: "Obsidian Court Lighting Preset",
  fallbackInitial: "O",
  supportsChatMedia: false,
});

export const creationEditMediaNoCreationIdFixture = Object.freeze({
  ...creationEditMediaEmptyFixture,
  imageLibraryHref: "#",
});

export const creationEditMediaLongLabelsFixture = Object.freeze({
  ...baseFixture,
  creationTitle:
    "The Cartographer Who Recorded Every Vanished Road Beyond the Western Gate",
  fallbackInitial: "T",
  activeMedia: featuredSlot({
    id: "long-primary",
    label: "Primary Identity Reference Portrait",
    index: 0,
    isActive: true,
  }),
  featuredSlots: Object.freeze([
    featuredSlot({
      id: "long-primary",
      label: "Primary Identity Reference Portrait",
      index: 0,
      isActive: true,
    }),
    featuredSlot({
      id: "long-alt-1",
      label: "Alternate Ceremonial Appearance",
      index: 1,
    }),
    featuredSlot({
      id: "long-alt-2",
      label: "Alternate Expedition Appearance",
      index: 2,
    }),
    featuredSlot({
      id: "long-alt-3",
      label: "Alternate Night Encounter Appearance",
      index: 3,
    }),
  ]),
});
