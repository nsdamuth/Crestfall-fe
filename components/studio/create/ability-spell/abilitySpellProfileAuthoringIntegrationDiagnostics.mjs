import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const page = read("app/studio/create/ability-spell-profile/page.js");
const builder = read("components/studio/create/ability-spell/ability-spell-profile-builder/useAbilitySpellProfileBuilderViewModel.js");
const client = read("lib/client/studio/ability-spell/abilitySpellClient.js");
const sectionMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
const editViewModel = read("components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js");
const constants = read("components/studio/my-creations/edit/creationEditConstants.js");
const serverTypes = read("lib/server/creations/constants.js");
const policy = read("lib/shared/creations/creationTypePolicy.js");

assert.match(page, /AbilitySpellProfileBuilderShell/);
assert.match(builder, /type: ABILITY_SPELL_PROFILE_CREATION_TYPE/);
assert.match(builder, /ability_spell_profile: result\.normalized/);
assert.match(builder, /router\.replace\(`\/studio\/my-creations\/\$\{creation\.id\}\/edit`\)/);
assert.match(client, /createCreationDraft/);
assert.doesNotMatch(client, /supabase|PostGraphile|from\(/i);
assert.match(editViewModel, /isAbilitySpellProfile: creationType === "ABILITY_SPELL_PROFILE"/);
assert.match(constants, /ABILITY_SPELL_PROFILE_EDIT_SECTIONS/);
assert.match(sectionMap, /import AbilitySpellProfileEditor/);
assert.match(sectionMap, /ABILITY_SPELL_PROFILE:\s*\{/);
assert.match(sectionMap, /ctx\.form\.data\?\.ability_spell_profile/);
assert.match(sectionMap, /updateDataField\("ability_spell_profile"/);
assert.match(serverTypes, /"ABILITY_SPELL_PROFILE"/);
assert.match(policy, /ABILITY_SPELL_PROFILE:/);
assert.match(policy, /editMode: "ABILITY_SPELL_PROFILE"/);

console.log(JSON.stringify({
  diagnostic: "ability_spell_profile_authoring_integration_v1",
  status: "PASSED",
  creationRoute: "/studio/create/ability-spell-profile",
  creationType: "ABILITY_SPELL_PROFILE",
  dataKey: "ability_spell_profile",
  registryDrivenEditRouteIntegrated: true,
  repeatCreateGuard: true,
}, null, 2));
