const noop = () => {};

const CANON_ART = encodeURI(
  "/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"
);

function slots(primaryUrl = null) {
  return [
    { id: "slot-1", index: 0, label: "Primary", imageSrc: primaryUrl, isActive: true },
    { id: "slot-2", index: 1, label: "Alt 1", imageSrc: null, isActive: false },
    { id: "slot-3", index: 2, label: "Alt 2", imageSrc: null, isActive: false },
    { id: "slot-4", index: 3, label: "Alt 3", imageSrc: null, isActive: false },
  ];
}

export const editorHeaderDefaultFixture = {
  primaryImageSrc: CANON_ART,
  slots: slots(CANON_ART),
  onSelectSlot: noop,
  onReplaceActiveSlot: noop,
  generateHref: "/studio/v2/images",
  imageLibraryHref: "#library",
  title: "Vermillion Ashgrove",
  typeLabel: "Character",
  typeIcon: null,
  visibilityLabel: "Private",
  visibilityVariant: "status",
  actions: null,
};

export const editorHeaderNoArtFixture = {
  ...editorHeaderDefaultFixture,
  primaryImageSrc: null,
  slots: slots(null),
  title: "Coldwater Vigil",
  typeLabel: "Story",
};

export const editorHeaderCanonFixture = {
  ...editorHeaderDefaultFixture,
  visibilityLabel: "Canon",
  visibilityVariant: "canon",
};

export const editorHeaderNoActionsFixture = {
  ...editorHeaderDefaultFixture,
  onReplaceActiveSlot: null,
  generateHref: null,
  imageLibraryHref: null,
};

export const editorHeaderLongestFixture = {
  ...editorHeaderDefaultFixture,
  title:
    "Vermillion Ashgrove-Highcourt, Third Archivist of the Wandering Table, Keeper of the Sundered Ledgers",
  typeLabel: "Actor Mechanics Profile",
  visibilityLabel: "Unlisted",
};
