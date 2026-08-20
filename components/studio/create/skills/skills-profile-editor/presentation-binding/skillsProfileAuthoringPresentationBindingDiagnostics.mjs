import assert from "node:assert/strict";
import fs from "node:fs";

import {
  SKILLS_PROFILE_CONTRACT_VERSION,
  SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  SKILLS_PROFILE_LIMITS,
  SKILLS_UNLOCK_TYPES,
} from "../SkillsProfileEditor.contract.js";

import {
  SKILLS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  SKILLS_PROFILE_CREATION_TYPE,
} from "../../skills-profile-builder/SkillsProfileBuilder.contract.js";

import {
  SKILLS_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  SKILLS_PROFILE_AUTHORING_CALLBACK_KEYS,
  projectSkillsProfileAuthoringPresentationBinding,
} from "./SkillsProfileAuthoringPresentationBinding.contract.js";

import {
  skillsProfileAuthoringEmptyFixture,
  skillsProfileAuthoringErrorFixture,
  skillsProfileAuthoringJsonOpenFixture,
  skillsProfileAuthoringValidFixture,
  skillsProfileAuthoringWarningFixture,
} from "./SkillsProfileAuthoringPresentationBinding.fixtures.js";

assert.equal(
  SKILLS_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  "skills_profile_authoring_presentation_binding_v1"
);

const valid =
  projectSkillsProfileAuthoringPresentationBinding(
    skillsProfileAuthoringValidFixture
  );

assert.equal(
  valid.bindingContractVersion,
  SKILLS_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION
);
assert.equal(
  valid.editorViewContractVersion,
  SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION
);
assert.equal(
  valid.builderViewContractVersion,
  SKILLS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION
);
assert.equal(
  valid.profileContractVersion,
  SKILLS_PROFILE_CONTRACT_VERSION
);
assert.equal(valid.creationType, "SKILLS_PROFILE");

assert.deepEqual(valid.header, {
  eyebrow:
    "Skills & Proficiencies Definition",
  title: "Skills Profile",
  description:
    "Author reusable Skill ranks, point costs, prerequisites, and grants. Actor ranks and unspent points remain isolated Story state.",
});

assert.deepEqual(valid.profile, {
  title: "Aethelgard Field Skills",
  description:
    "Reusable proficiency definitions for field exploration, arcane work, and physical training.",
  enabled: true,
  defaultPointCost: 2,
  tags: [
    "skills",
    "proficiencies",
    "field",
  ],
});

assert.equal(valid.validation.state, "VALID");
assert.equal(valid.validation.valid, true);
assert.equal(
  valid.validation.validMessage,
  "Skills Profile definitions are valid."
);

assert.deepEqual(
  valid.skills.summary,
  {
    skillDefinitionCount: 3,
    enabledSkillDefinitionCount: 2,
    rankDefinitionCount: 8,
  }
);

assert.equal(
  valid.skills.maxCount,
  SKILLS_PROFILE_LIMITS.maxSkills
);
assert.equal(
  valid.skills.maxRanksPerSkill,
  SKILLS_PROFILE_LIMITS.maxRanksPerSkill
);
assert.equal(valid.skills.canAdd, true);
assert.equal(valid.skills.addLabel, "Add Skill");
assert.equal(valid.skills.items.length, 3);

const focus = valid.skills.items[0];

assert.equal(focus.identity.id, "skill.focus");
assert.equal(focus.identity.title, "Focus");
assert.equal(focus.identity.category, "MENTAL");
assert.equal(focus.identity.enabled, true);
assert.deepEqual(
  focus.identity.tags,
  ["mental", "discipline"]
);
assert.deepEqual(
  focus.progression,
  {
    startingRank: 1,
    maximumRank: 3,
    rankCount: 3,
  }
);

const focusRank3 = focus.ranks[2];

assert.equal(
  focusRank3.prerequisites.minimumLevel,
  7
);
assert.deepEqual(
  focusRank3.prerequisites.requiredTierIds,
  ["tier.veteran"]
);
assert.equal(
  focusRank3.prerequisites.requiredUnlockCount,
  1
);
assert.equal(
  focusRank3.prerequisites.requiredUnlocks[0].unlockType,
  "FEATURE"
);
assert.equal(
  focusRank3.prerequisites.requiredUnlocks[0].unlockId,
  "feature.iron_will"
);
assert.equal(
  focusRank3.prerequisites.structuredAuthoringState,
  "JSON_EDITOR_ONLY_IN_CURRENT_V0_UI"
);

const arcanaRank2 =
  valid.skills.items[1].ranks[1];

assert.deepEqual(
  arcanaRank2.prerequisites.requiredSkills,
  [
    {
      skillId: "skill.focus",
      minimumRank: 1,
      displayValue: "skill.focus:1",
    },
  ]
);
assert.equal(
  arcanaRank2.prerequisites.requiredSkillsDisplay,
  "skill.focus:1"
);
assert.equal(
  arcanaRank2.prerequisites.requiredUnlocks[0].unlockType,
  "SPELL"
);
assert.equal(
  arcanaRank2.prerequisites.requiredUnlocks[0].unlockId,
  "spell.arc_flare"
);
assert.deepEqual(
  arcanaRank2.grants.commandIds,
  ["command.inspect_spell"]
);

assert.equal(
  valid.skills.items[2].identity.enabled,
  false
);

assert.deepEqual(
  valid.enumOptions.unlockTypes,
  [...SKILLS_UNLOCK_TYPES]
);
assert.equal(
  valid.enumOptions.unlockTypes.includes("SPELL"),
  true
);
assert.equal(
  valid.enumOptions.unlockTypes.includes("CUSTOM"),
  true
);

assert.equal(valid.limits.maxSkills, 96);
assert.equal(valid.limits.maxRanksPerSkill, 20);
assert.equal(valid.limits.maxRequiredUnlocks, 32);
assert.equal(valid.limits.maxRequiredSkills, 32);
assert.equal(valid.limits.maxPointCost, 1000000);

assert.equal(
  valid.structuredPrerequisiteAuthoring.visualStatus,
  "WIRED_JSON_EDITOR_ONLY_LEGACY_PRESENTATION"
);
assert.match(
  valid.structuredPrerequisiteAuthoring.helper,
  /authored through the live complete JSON editor/i
);

const warning =
  projectSkillsProfileAuthoringPresentationBinding(
    skillsProfileAuthoringWarningFixture
  );

assert.equal(warning.validation.state, "WARNING");
assert.equal(warning.validation.valid, true);
assert.equal(warning.validation.warnings.length, 1);

const error =
  projectSkillsProfileAuthoringPresentationBinding(
    skillsProfileAuthoringErrorFixture
  );

assert.equal(error.validation.state, "ERROR");
assert.equal(error.validation.valid, false);
assert.equal(
  error.validation.errors[0].code,
  "SKILLS_PROFILE_TITLE_REQUIRED"
);

const jsonOpen =
  projectSkillsProfileAuthoringPresentationBinding(
    skillsProfileAuthoringJsonOpenFixture
  );

assert.equal(jsonOpen.jsonEditor.open, true);
assert.equal(
  jsonOpen.jsonEditor.actionLabel,
  "JSON Editor & AI Guide"
);
assert.equal(
  jsonOpen.jsonEditor.visualStatus,
  "WIRED_LEGACY_PRESENTATION"
);

const empty =
  projectSkillsProfileAuthoringPresentationBinding(
    skillsProfileAuthoringEmptyFixture
  );

assert.equal(empty.skills.items.length, 0);
assert.equal(
  empty.validation.state,
  "WARNING"
);
assert.equal(
  empty.skills.emptyState,
  "No Skill definitions are authored yet. Add a Skill or paste a complete profile through the JSON editor."
);

assert.deepEqual(
  valid.visualExtensionStatus,
  {
    profileEditor:
      "WIRED_LEGACY_PRESENTATION",
    structuredPrerequisites:
      "WIRED_JSON_EDITOR_ONLY_LEGACY_PRESENTATION",
    jsonEditor:
      "WIRED_LEGACY_PRESENTATION",
  }
);

assert.deepEqual(
  SKILLS_PROFILE_AUTHORING_CALLBACK_KEYS,
  [
    "onUpdateProfileField",
    "onAddSkill",
    "onRemoveSkill",
    "onUpdateSkillField",
    "onUpdateRankField",
    "onOpenJsonEditor",
  ]
);

assert.deepEqual(valid.architecture, {
  profileNormalizationOwnedByChassis: true,
  profileValidationOwnedByChassis: true,
  editorMutationOwnedByChassis: true,
  jsonValidationOwnedByChassis: true,
  creationPayloadOwnedByChassis: true,
  persistenceOwnedByChassis: true,
  actorRuntimeRanksExcluded: true,
  actorUnspentPointsExcluded: true,
  advancementExecutionOwnedByChassis: true,
  editorVisualCompositionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./SkillsProfileAuthoringPresentationBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "normalizeSkillsProfileEditorValue",
  "validateSkillsProfileEditorValue",
  "normalizeSkillsRankDefinition",
  "normalizeSkillsSkillDefinition",
  "commit(",
  "setJsonEditorOpen",
  "applyJsonProfile",
  "updateProfileField(",
  "updateSkillField(",
  "updateRankField(",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useMemo(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "skills_profile_authoring_presentation_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    SKILLS_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  editorViewContractVersion:
    SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  builderViewContractVersion:
    SKILLS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  profileContractVersion:
    SKILLS_PROFILE_CONTRACT_VERSION,
  creationType:
    SKILLS_PROFILE_CREATION_TYPE,
  skillAndRankSectionsCovered: true,
  pointCostTierGrantProjectionCovered: true,
  structuredSkillAndUnlockPrerequisitesCovered: true,
  validationStatesCovered: true,
  structuredPrerequisiteLegacyJsonPathWired: true,
  jsonEditorLegacyPresentationWired: true,
  profileEditorLegacyPresentationWired: true,
  chassisNormalizationValidationMutationPersistenceExcluded: true,
}, null, 2));
