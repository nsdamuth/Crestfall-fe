const noop = () => {};

const CANON_ART = encodeURI(
  "/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"
);

export const editorHeaderDefaultFixture = {
  imageSrc: CANON_ART,
  title: "Vermillion Ashgrove",
  typeLabel: "Character",
  typeIcon: null,
  visibilityLabel: "Private",
  visibilityVariant: "status",
  hasUnsavedChanges: false,
  switcherLabel: "Switch creation",
  onOpenSwitcher: noop,
  onOpenSections: noop,
  actions: null,
};

export const editorHeaderNoArtFixture = {
  ...editorHeaderDefaultFixture,
  imageSrc: null,
  title: "Coldwater Vigil",
  typeLabel: "Story",
};

export const editorHeaderNoSectionsTriggerFixture = {
  ...editorHeaderDefaultFixture,
  onOpenSections: null,
};

export const editorHeaderCanonFixture = {
  ...editorHeaderDefaultFixture,
  visibilityLabel: "Canon",
  visibilityVariant: "canon",
};

export const editorHeaderDirtySwitchConfirmFixture = {
  ...editorHeaderDefaultFixture,
  title: "Vermillion Ashgrove-Highcourt, Third Archivist of the Wandering Table",
  hasUnsavedChanges: true,
};

export const editorHeaderLongestFixture = {
  ...editorHeaderDefaultFixture,
  title:
    "Vermillion Ashgrove-Highcourt, Third Archivist of the Wandering Table, Keeper of the Sundered Ledgers",
  typeLabel: "Actor Mechanics Profile",
  visibilityLabel: "Unlisted",
};
