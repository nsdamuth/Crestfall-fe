import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_SKILLS_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE,
} from "./ActorMechanicsProfileEditor.contract.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const viewModel = readFileSync(path.join(directory, "useActorMechanicsProfileEditorViewModel.js"), "utf8");
const view = readFileSync(path.join(directory, "ActorMechanicsProfileEditor.view.jsx"), "utf8");

assert.equal(ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION, "1.5.0");
assert.equal(ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE, "SKILLS_PROFILE");
assert.equal(ACTOR_MECHANICS_PROFILE_SKILLS_CONTRACT_VERSION, "skills_profile_contract_v0");
assert.match(viewModel, /createSkillsProfileReference/);
assert.match(viewModel, /definitionReferenceMode:[\s\S]*SKILLS_PROFILE/);
assert.match(viewModel, /allowedTypes: \[ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE\]/);
assert.match(viewModel, /Actor ranks and unspent points are not copied or initialized/);
assert.match(view, /Select Skills Profile/);
assert.match(view, /Replace Skills Profile/);
assert.match(view, /onOpenSkillsProfilePicker/);
assert.match(view, /skills_profile_contract_v0/);

console.log(JSON.stringify({
  diagnostic: "actor_mechanics_profile_skills_reference_ui_v0",
  status: "PASSED",
  viewContractVersion: ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  creationType: ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE,
  profileContractVersion: ACTOR_MECHANICS_PROFILE_SKILLS_CONTRACT_VERSION,
  pickerAvailable: true,
  definitionOnly: true,
  actorStateCreated: false,
}, null, 2));
