import {
  skillsProfileEditorFilledFixture,
} from "../skills-profile-editor/SkillsProfileEditor.fixtures.js";

export const skillsProfileBuilderFilledFixture = Object.freeze({
  title: "Aethelgard Field Skills",
  description:
    "A filled creation wrapper for the Skills Profile presentation contract.",
  visibility: "PRIVATE",
  contentRating: "SFW",
  skillsProfile: skillsProfileEditorFilledFixture.value,
});
