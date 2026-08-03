export const CHARACTER_BODY_SECTION_VIEW_CONTRACT_VERSION = "1.0";

export const CHARACTER_BODY_SECTION_VIEW_CONTRACT = Object.freeze({
  version: CHARACTER_BODY_SECTION_VIEW_CONTRACT_VERSION,
  feature: "character-body-section",
  inputs: [
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "kibbePresetControl",
    "bodyTypeControl",
    "heightControl",
    "buildControl",
    "proportionsControl",
    "bodyNotesLabel",
    "bodyNotesValue",
    "bodyNotesPlaceholder",
  ],
  callbacks: ["onChangeBodyNotes"],
  applicationOwnedControls: [
    "kibbePresetControl",
    "bodyTypeControl",
    "heightControl",
    "buildControl",
    "proportionsControl",
  ],
});
