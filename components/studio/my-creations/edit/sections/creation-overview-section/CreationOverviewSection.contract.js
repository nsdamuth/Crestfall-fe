export const CREATION_OVERVIEW_SECTION_VIEW_CONTRACT_VERSION =
  "creation-overview-section.view.v1";

export const CREATION_OVERVIEW_SECTION_VIEW_CONTRACT = Object.freeze({
  copy: [
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "titleLabel",
    "descriptionLabel",
    "descriptionPlaceholder",
    "previewButtonLabel",
  ],
  values: ["titleValue", "descriptionValue"],
  state: ["previewDisabled"],
  callbacks: ["onChangeTitle", "onChangeDescription", "onPreview"],
});
