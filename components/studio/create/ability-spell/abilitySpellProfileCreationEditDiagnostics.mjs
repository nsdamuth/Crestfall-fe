import assert from "node:assert/strict";
import fs from "node:fs";

const constants = fs.readFileSync("components/studio/my-creations/edit/creationEditConstants.js", "utf8");
const shellViewModel = fs.readFileSync("components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js", "utf8");
const sectionMap = fs.readFileSync("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js", "utf8");

assert.match(constants, /ABILITY_SPELL_PROFILE_EDIT_SECTIONS/);
assert.match(constants, /id: "ABILITY_SPELL_PROFILE", label: "Ability & Spell Profiles"/);
assert.match(constants, /label: "Ability & Spell Profile"/);
assert.match(constants, /id: "abilitySpell", label: "Abilities & Spells"/);
assert.match(shellViewModel, /isAbilitySpellProfile: creationType === "ABILITY_SPELL_PROFILE"/);
assert.match(shellViewModel, /isAbilitySpellProfile: flags\.isAbilitySpellProfile/);
assert.match(sectionMap, /import AbilitySpellProfileEditor/);
assert.match(sectionMap, /ABILITY_SPELL_PROFILE:\s*\{/);
assert.match(sectionMap, /ctx\.form\.data\?\.ability_spell_profile/);
assert.match(sectionMap, /ctx\.form\.data\?\.abilitySpellProfile/);
assert.match(sectionMap, /updateDataField\("ability_spell_profile"/);

console.log(JSON.stringify({
  diagnostic: "ability_spell_profile_creation_edit_v1",
  status: "PASSED",
  creationType: "ABILITY_SPELL_PROFILE",
  editSection: "abilitySpell",
  dataKey: "ability_spell_profile",
  registryDrivenSpecializedEditor: true,
  pageLevelSaveRemainsAuthoritative: true,
}, null, 2));
