import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SKILLS_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME,
  buildSkillsProfileJsonAiAuthoringGuide,
} from "./skillsProfileJsonAiAuthoringGuide.js";
import { skillsProfileJsonEditorProfileFixture } from "./skillsProfileJsonEditor.fixtures.js";
import {
  formatSkillsProfileJsonData,
  formatSkillsProfileJsonText,
  validateSkillsProfileJsonText,
} from "./skillsProfileJsonEditor.validation.js";

const profile = skillsProfileJsonEditorProfileFixture;
const formatted = formatSkillsProfileJsonData(profile);
const parsedFormatted = JSON.parse(formatted);
assert.equal(parsedFormatted.contractVersion, "skills_profile_contract_v0");
assert.equal(parsedFormatted.title, "Adventurer Skills");

const syntaxFailure = formatSkillsProfileJsonText('{"title":');
assert.equal(syntaxFailure.valid, false);
assert.equal(syntaxFailure.error.code, "SKILLS_PROFILE_JSON_INVALID");

const valid = validateSkillsProfileJsonText(formatted);
assert.equal(valid.valid, true);
assert.equal(valid.errors.length, 0);
assert.equal(valid.data.title, profile.title);

const forbidden = validateSkillsProfileJsonText(
  JSON.stringify({ ...profile, currentRanks: {} })
);
assert.equal(forbidden.valid, false);
assert.ok(
  forbidden.errors.some(
    (issue) => issue.code === "SKILLS_PROFILE_ACTOR_STATE_FORBIDDEN"
  )
);

const guide = buildSkillsProfileJsonAiAuthoringGuide(profile);
assert.match(guide, /Return one complete JSON object only/);
assert.match(guide, /Do not add actor ranks/);
assert.match(guide, /skills_profile_contract_v0/);
assert.match(guide, /Current Skills Profile JSON/);
assert.match(guide, /requiredUnlocks is an array of objects/);
assert.match(guide, /requiredSkills is an array of objects/);
assert.match(guide, /"unlockId": "skill\.slot\.1"/);
assert.match(guide, /"skillId": "skill\.athletics"/);
assert.match(guide, /Do not write:/);
assert.equal(
  SKILLS_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME,
  "crestfall-skills-profile-json-ai-authoring-guide.md"
);

const shellSource = readFileSync(
  new URL("./SkillsProfileJsonEditorModal.jsx", import.meta.url),
  "utf8"
);
const viewSource = readFileSync(
  new URL("./SkillsProfileJsonEditorModal.view.jsx", import.meta.url),
  "utf8"
);
const viewModelSource = readFileSync(
  new URL("./useSkillsProfileJsonEditorViewModel.js", import.meta.url),
  "utf8"
);

assert.match(shellSource, /useSkillsProfileJsonEditorViewModel/);
assert.match(shellSource, /SkillsProfileJsonEditorModalView/);
assert.match(viewSource, /ModalShell/);
assert.match(viewSource, /bg-\[#080706\]/);
assert.match(viewSource, /Download AI Guide/);
assert.match(viewSource, /Format JSON/);
assert.match(viewSource, /Reset from Builder/);
assert.match(viewSource, /Validate & Apply/);
assert.match(viewSource, /Authored Skills Profile/);
assert.doesNotMatch(viewSource, /fetch\s*\(/);
assert.doesNotMatch(viewSource, /supabase|PostGraphile/i);
assert.match(viewModelSource, /buildSkillsProfileJsonAiAuthoringGuide/);
assert.match(viewModelSource, /validateSkillsProfileJsonText/);

console.log(
  JSON.stringify(
    {
      diagnostic: "skills_profile_json_editor_v1",
      status: "PASSED",
      completeProfileAccepted: true,
      actorStateRejected: true,
      downloadableAiGuide: true,
      loomShellViewModelViewBoundary: true,
      opaqueModalShell: true,
      directPersistenceAllowed: false,
    },
    null,
    2
  )
);
