export const CHARACTER_BODY_SECTION_VIEW_CONTRACT_VERSION = "1.1";

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
    "bodyPromptLabel",
    "bodyPromptValue",
    "bodyPromptPlaceholder",
    "fantasyPromptLabel",
    "fantasyPromptValue",
    "fantasyPromptPlaceholder",
    "realisticPromptLabel",
    "realisticPromptValue",
    "realisticPromptPlaceholder",
  ],
  callbacks: [
    "onChangeBodyPrompt",
    "onChangeFantasyPrompt",
    "onChangeRealisticPrompt",
  ],
  applicationOwnedControls: [
    "kibbePresetControl",
    "bodyTypeControl",
    "heightControl",
    "buildControl",
    "proportionsControl",
  ],
});
