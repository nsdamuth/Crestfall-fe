import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
} from "./ActorMechanicsProfileEditor.contract.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const viewModel = readFileSync(path.join(directory, "useActorMechanicsProfileEditorViewModel.js"), "utf8");
const view = readFileSync(path.join(directory, "ActorMechanicsProfileEditor.view.jsx"), "utf8");

assert.equal(ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION, "1.5.0");
assert.equal(ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE, "ABILITY_SPELL_PROFILE");
assert.equal(ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CONTRACT_VERSION, "ability_spell_profile_contract_v0");
assert.match(viewModel, /createAbilitySpellProfileReference/);
assert.match(viewModel, /\["MAGIC", "ABILITIES"\]\.includes\(binding\.domain\)/);
assert.match(viewModel, /definitionReferenceMode:[\s\S]*ABILITY_SPELL_PROFILE/);
assert.match(viewModel, /allowedTypes:[\s\S]*ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE/);
assert.match(viewModel, /Known spells, mastery, cooldowns, charges, and resource state are not copied or initialized/);
assert.match(viewModel, /Known abilities, mastery, cooldowns, charges, and resource state are not copied or initialized/);
assert.match(view, /Select Ability & Spell Profile/);
assert.match(view, /Replace Ability & Spell Profile/);
assert.match(view, /onOpenAbilitySpellProfilePicker/);
assert.match(view, /ability_spell_profile_contract_v0/);

console.log(JSON.stringify({
  diagnostic: "actor_mechanics_profile_ability_spell_reference_ui_v0",
  status: "PASSED",
  viewContractVersion: ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  creationType: ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE,
  profileContractVersion: ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CONTRACT_VERSION,
  domains: ["MAGIC", "ABILITIES"],
  pickerAvailable: true,
  definitionOnly: true,
  actorStateCreated: false,
}, null, 2));
