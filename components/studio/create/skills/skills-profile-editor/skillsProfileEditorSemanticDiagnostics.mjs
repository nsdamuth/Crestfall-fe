import assert from "node:assert/strict";

import {
  SKILLS_PROFILE_CONTRACT_VERSION,
  SKILLS_PREREQUISITE_VERSION,
  SKILLS_RANK_DEFINITION_VERSION,
  SKILLS_SKILL_DEFINITION_VERSION,
  validateSkillsProfileEditorValue,
} from "./SkillsProfileEditor.contract.js";
import {
  skillsProfileEditorFilledFixture,
  skillsProfileEditorFixture,
} from "./SkillsProfileEditor.fixtures.js";

for (const fixture of [
  skillsProfileEditorFixture,
  skillsProfileEditorFilledFixture,
]) {
  const result = validateSkillsProfileEditorValue(fixture.value);
  assert.equal(result.valid, true);
  assert.equal(result.normalized.contractVersion, SKILLS_PROFILE_CONTRACT_VERSION);
}

const result = validateSkillsProfileEditorValue(
  skillsProfileEditorFilledFixture.value
);
const filled = result.normalized;

assert.equal(filled.skillDefinitions.length, 3);
assert.equal(result.metrics.skillDefinitionCount, 3);
assert.equal(result.metrics.enabledSkillDefinitionCount, 3);
assert.equal(result.metrics.rankDefinitionCount, 8);

for (const skill of filled.skillDefinitions) {
  assert.equal(skill.definitionVersion, SKILLS_SKILL_DEFINITION_VERSION);
  assert.equal(skill.rankDefinitions.length, skill.maximumRank);

  for (const rank of skill.rankDefinitions) {
    assert.equal(rank.definitionVersion, SKILLS_RANK_DEFINITION_VERSION);
    assert.equal(
      rank.prerequisites.prerequisiteVersion,
      SKILLS_PREREQUISITE_VERSION
    );
  }
}

const arcana = filled.skillDefinitions.find(
  (skill) => skill.id === "skill.arcana"
);
assert.ok(arcana);
assert.equal(arcana.maximumRank, 3);
assert.deepEqual(
  arcana.rankDefinitions[1].prerequisites.requiredSkills,
  [
    {
      skillId: "skill.focus",
      minimumRank: 1,
      metadata: {},
    },
  ]
);
assert.equal(
  arcana.rankDefinitions[1].prerequisites.requiredUnlocks[0].unlockType,
  "SPELL"
);
assert.equal(
  arcana.rankDefinitions[2].grants.metadata.fixtureGrant,
  "advanced_arcane_analysis"
);

const focus = filled.skillDefinitions.find(
  (skill) => skill.id === "skill.focus"
);
assert.ok(focus);
assert.equal(
  focus.rankDefinitions[2].prerequisites.requiredUnlocks[0].unlockType,
  "FEATURE"
);

for (const skill of filled.skillDefinitions) {
  assert.equal(Object.hasOwn(skill, "currentRank"), false);
  assert.equal(Object.hasOwn(skill, "spentPoints"), false);
  assert.equal(Object.hasOwn(skill, "unlocked"), false);
}

console.log(JSON.stringify({
  diagnostic: "skills_profile_fe_semantic_contract_v1",
  status: "PASSED",
  profileContractVersion: SKILLS_PROFILE_CONTRACT_VERSION,
  filledSkillCount: filled.skillDefinitions.length,
  filledRankCount: result.metrics.rankDefinitionCount,
  crossSkillPrerequisiteCovered: true,
  typedUnlockPrerequisiteCovered: true,
  runtimeStateExcluded: true,
}, null, 2));
