import {
  abilitySpellProfileEditorFilledFixture,
} from "../ability-spell-profile-editor/AbilitySpellProfileEditor.fixtures.js";

export const abilitySpellProfileBuilderFilledFixture = Object.freeze({
  title: "Arcane Vanguard",
  description:
    "A filled creation wrapper for the Ability and Spell profile presentation contract.",
  visibility: "PRIVATE",
  contentRating: "SFW",
  abilitySpellProfile: abilitySpellProfileEditorFilledFixture.value,
});
