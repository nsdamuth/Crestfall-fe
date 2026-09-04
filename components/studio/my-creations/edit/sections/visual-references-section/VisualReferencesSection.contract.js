export const VISUAL_REFERENCES_SECTION_VIEW_CONTRACT_VERSION = "1.0";

export const VISUAL_REFERENCES_SECTION_VIEW_CONTRACT = Object.freeze({
  version: VISUAL_REFERENCES_SECTION_VIEW_CONTRACT_VERSION,
  feature: "visual-references-section",
  inputs: [
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "referenceGuidance",
    "refreshLabel",
    "loadStatus",
    "loadErrorMessage",
    "referenceCards",
    "pickerModal",
  ],
  callbacks: ["onRefresh"],
  referenceCardShape: [
    "key",
    "eyebrow",
    "label",
    "description",
    "imageOutputId",
    "imageUrl",
    "emptyMessage",
    "chooseLabel",
    "clearLabel",
    "onChoose",
    "onClear",
  ],
  applicationOwnedControls: ["pickerModal"],
});
