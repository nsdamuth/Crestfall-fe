const sharedCopy = {
  sectionEyebrow: "Creation Editor",
  sectionTitle: "Overview",
  sectionDescription:
    "Quick creation gets users here; serious editing, publishing, review, and deletion live here.",
  titleLabel: "Title",
  descriptionLabel: "Public Description",
  descriptionPlaceholder:
    "Describe this creation for public or private viewing.",
  previewButtonLabel: "Preview Soon",
  previewDisabled: true,
};

export const creationOverviewSectionPopulatedFixture = {
  ...sharedCopy,
  titleValue: "The Prism-Weave of Aethelgard",
  descriptionValue:
    "An infinite magical reality of floating spheres, impossible cities, living bazaars, glittering bridges, bargains, and dangerous wishes.",
};

export const creationOverviewSectionEmptyFixture = {
  ...sharedCopy,
  titleValue: "",
  descriptionValue: "",
};

export const creationOverviewSectionLongContentFixture = {
  ...sharedCopy,
  titleValue:
    "Office of Irregular Phenomena — Restricted Cross-Case Convergence Archive",
  descriptionValue:
    "A deliberately long public description used to verify wrapping, vertical rhythm, and responsive behavior while preserving the exact Overview field layout supplied by Creation Edit.",
};

export const creationOverviewSectionMissingCallbacksFixture = {
  ...creationOverviewSectionPopulatedFixture,
  onChangeTitle: null,
  onChangeDescription: null,
  onPreview: null,
};
