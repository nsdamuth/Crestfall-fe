import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  SKILLS_PROFILE_CONTRACT_VERSION,
  SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  SKILLS_PROFILE_LIMITS,
  createEmptySkillsProfile,
  validateSkillsProfileEditorValue,
} from "./SkillsProfileEditor.contract.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const view = readFileSync(path.join(directory, "SkillsProfileEditor.view.jsx"), "utf8");
const viewModel = readFileSync(path.join(directory, "useSkillsProfileEditorViewModel.js"), "utf8");
const shell = readFileSync(path.join(directory, "../SkillsProfileEditor.jsx"), "utf8");
const builderView = readFileSync(path.join(directory, "../skills-profile-builder/SkillsProfileBuilder.view.jsx"), "utf8");
const builderViewModel = readFileSync(path.join(directory, "../skills-profile-builder/useSkillsProfileBuilderViewModel.js"), "utf8");

const profile = createEmptySkillsProfile();
const validation = validateSkillsProfileEditorValue(profile);
assert.equal(SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION, "1.0.0");
assert.equal(SKILLS_PROFILE_CONTRACT_VERSION, "skills_profile_contract_v0");
assert.equal(validation.valid, true);
assert.equal(validation.normalized.skillDefinitions[0].rankDefinitions.length, 1);
assert.equal(validation.normalized.actorConfiguration.starterSelection.mode, "NONE");
assert.equal(SKILLS_PROFILE_LIMITS.maxRanksPerSkill, 250);
assert.match(view, /max=\{maxRanksPerSkill\}/);
assert.doesNotMatch(view, /max=\{20\}/);
assert.match(view, /JSON Editor & AI Guide/);
assert.match(view, /Skill Definitions/);
assert.match(view, /Actor Setup · Starter Skills/);
assert.match(view, /Starter selection mode/);
assert.doesNotMatch(view, /fetch\(|createCreationDraft|supabase|PostGraphile/i);
assert.match(viewModel, /maximumRank/);
assert.match(viewModel, /rankDefinitions/);
assert.match(viewModel, /updateStarterSelectionMode/);
assert.match(viewModel, /addStarterSlot/);
assert.match(shell, /SkillsProfileJsonEditorModal/);
assert.doesNotMatch(builderView, /fetch\(|createCreationDraft|supabase|PostGraphile/i);
assert.match(builderViewModel, /createSkillsProfileDraft/);
assert.match(builderViewModel, /skills_profile/);

console.log(JSON.stringify({
  diagnostic: "skills_profile_loom_editor_v0",
  status: "PASSED",
  profileContractVersion: SKILLS_PROFILE_CONTRACT_VERSION,
  checks: {
    completeStarterValid: true,
    rankTableRebuildOwnedByViewModel: true,
    maximumRankInputUsesContractLimit: true,
    rankCeiling250: true,
    jsonEditorAvailable: true,
    viewApiFree: true,
    builderViewApiFree: true,
    existingCreationClientPathUsed: true,
  },
}, null, 2));
