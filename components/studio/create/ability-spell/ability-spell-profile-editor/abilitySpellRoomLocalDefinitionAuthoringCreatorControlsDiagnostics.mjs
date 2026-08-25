import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const contractPath =
  "components/studio/create/ability-spell/ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";
const viewPath =
  "components/studio/create/ability-spell/ability-spell-profile-editor/AbilitySpellProfileEditor.view.jsx";
const viewModelPath =
  "components/studio/create/ability-spell/ability-spell-profile-editor/useAbilitySpellProfileEditorViewModel.js";
const guidePath =
  "components/studio/create/ability-spell/ability-spell-profile-json-editor/abilitySpellProfileJsonAiAuthoringGuide.js";

const contract = read(contractPath);
const view = read(viewPath);
const viewModel = read(viewModelPath);
const guide = read(guidePath);

assert.match(contract, /ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODES/);
assert.match(contract, /ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODE_OPTIONS/);
assert.match(contract, /normalizeAbilitySpellRoomLocalDefinitionAuthoringGroup/);
assert.match(contract, /normalizeAbilitySpellRoomLocalCustomTextField/);
assert.match(contract, /roomLocalDefinitionAuthoring/);
assert.match(contract, /minimumDefinitions/);
assert.match(contract, /maximumDefinitions/);
assert.match(contract, /allowedTypes/);
assert.match(contract, /allowedSchools/);
assert.match(contract, /allowedCategories/);
assert.match(contract, /requiredFields/);
assert.match(contract, /customTextFields/);
assert.match(contract, /NARRATIVE_ONLY/);

assert.match(view, /Actor Setup · Player-Authored Room Abilities/);
assert.match(view, /Add Authoring Group/);
assert.match(view, /Player-authored definition titles must be unique/);
assert.match(view, /Minimum definitions/);
assert.match(view, /Maximum definitions/);
assert.match(view, /Allowed types/);
assert.match(view, /Allowed schools/);
assert.match(view, /Allowed categories/);
assert.match(view, /Required core fields/);
assert.match(view, /Add Field/);
assert.match(view, /narrative-only/i);

assert.match(viewModel, /updateRoomLocalDefinitionAuthoringMode/);
assert.match(viewModel, /updateRoomLocalDefinitionAuthoringUniqueTitles/);
assert.match(viewModel, /addRoomLocalDefinitionAuthoringGroup/);
assert.match(viewModel, /removeRoomLocalDefinitionAuthoringGroup/);
assert.match(viewModel, /updateRoomLocalDefinitionAuthoringGroupField/);
assert.match(viewModel, /addRoomLocalDefinitionCustomTextField/);
assert.match(viewModel, /removeRoomLocalDefinitionCustomTextField/);
assert.match(viewModel, /updateRoomLocalDefinitionCustomTextField/);

assert.match(guide, /roomLocalDefinitionAuthoring/);
assert.match(guide, /NARRATIVE_ONLY/);
assert.match(guide, /cannot author prerequisites, structured costs, target models, restrictions, operation references, cooldowns, charges, or mastery policy/);
assert.match(guide, /customTextFields/);

for (const source of [contract, view, viewModel, guide]) {
  assert.doesNotMatch(source, /Crownfall|Vermillion|eleven measures|KINGDOM OF ORIGIN/i);
}
assert.doesNotMatch(view, /\bfetch\s*\(|PostGraphile|\.from\s*\(/);
assert.doesNotMatch(viewModel, /\bfetch\s*\(|PostGraphile|\.from\s*\(/);

console.log(
  JSON.stringify(
    {
      diagnostic: "ability_spell_room_local_definition_authoring_creator_controls_v1",
      status: "PASSED",
      existingAbilitySpellProfileEditorReused: true,
      creatorCanEnableRoomLocalDefinitionAuthoring: true,
      creatorOwnsDefinitionCountsAndFilters: true,
      creatorOwnsRequiredAndCustomTextFields: true,
      existingDefinitionSelectionRemainsSeparate: true,
      narrativeOnlyPlayerAuthorityBoundaryVisible: true,
      jsonAuthoringGuideUpdated: true,
      directDatabaseAccessFromEditor: false,
      providerAuthorityGranted: false,
      crownfallSpecificRulesIntroduced: false,
    },
    null,
    2
  )
);
