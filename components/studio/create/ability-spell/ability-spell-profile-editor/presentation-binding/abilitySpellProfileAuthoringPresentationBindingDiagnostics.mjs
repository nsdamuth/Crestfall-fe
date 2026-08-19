import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_LIMITS,
} from "../AbilitySpellProfileEditor.contract.js";

import {
  ABILITY_SPELL_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_CREATION_TYPE,
} from "../../ability-spell-profile-builder/AbilitySpellProfileBuilder.contract.js";

import {
  ABILITY_SPELL_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_AUTHORING_CALLBACK_KEYS,
  projectAbilitySpellProfileAuthoringPresentationBinding,
} from "./AbilitySpellProfileAuthoringPresentationBinding.contract.js";

import {
  abilitySpellProfileAuthoringEmptyFixture,
  abilitySpellProfileAuthoringErrorFixture,
  abilitySpellProfileAuthoringJsonOpenFixture,
  abilitySpellProfileAuthoringValidFixture,
  abilitySpellProfileAuthoringWarningFixture,
} from "./AbilitySpellProfileAuthoringPresentationBinding.fixtures.js";

assert.equal(
  ABILITY_SPELL_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  "ability_spell_profile_authoring_presentation_binding_v1"
);

const valid =
  projectAbilitySpellProfileAuthoringPresentationBinding(
    abilitySpellProfileAuthoringValidFixture
  );

assert.equal(
  valid.bindingContractVersion,
  ABILITY_SPELL_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION
);

assert.equal(
  valid.editorViewContractVersion,
  ABILITY_SPELL_PROFILE_EDITOR_VIEW_CONTRACT_VERSION
);

assert.equal(
  valid.builderViewContractVersion,
  ABILITY_SPELL_PROFILE_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  valid.profileContractVersion,
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION
);

assert.equal(
  valid.creationType,
  ABILITY_SPELL_PROFILE_CREATION_TYPE
);

assert.equal(
  valid.creationType,
  "ABILITY_SPELL_PROFILE"
);

assert.deepEqual(valid.header, {
  eyebrow: "Definition Profile",
  title: "Ability & Spell Profile",
  description:
    "Shared definitions for Spells, Abilities, Techniques, Special Attacks, and Passives. Known state, mastery progress, cooldown remaining, charges, and resource balances remain actor-owned runtime state.",
});

assert.equal(
  valid.profile.title,
  "Arcane Vanguard"
);
assert.equal(valid.profile.enabled, true);
assert.deepEqual(
  valid.profile.tags,
  [
    "abilities",
    "magic",
    "vanguard",
  ]
);

assert.equal(
  valid.validation.state,
  "VALID"
);
assert.equal(
  valid.validation.valid,
  true
);
assert.deepEqual(valid.validation.errors, []);
assert.deepEqual(valid.validation.warnings, []);
assert.equal(
  valid.validation.validMessage,
  "Ability & Spell Profile definitions are valid."
);

assert.deepEqual(
  valid.definitions.summary,
  {
    definitionCount: 3,
    enabledDefinitionCount: 2,
    spellCount: 1,
    abilityCount: 0,
    techniqueCount: 1,
    passiveCount: 1,
  }
);

assert.equal(
  valid.definitions.maxCount,
  ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions
);
assert.equal(
  valid.definitions.canAdd,
  true
);
assert.equal(
  valid.definitions.addLabel,
  "Add Definition"
);
assert.equal(
  valid.definitions.items.length,
  3
);

const arcFlare =
  valid.definitions.items[0];

assert.equal(
  arcFlare.identity.id,
  "spell.arc_flare"
);
assert.equal(
  arcFlare.identity.type,
  "SPELL"
);
assert.equal(
  arcFlare.identity.enabled,
  true
);
assert.deepEqual(
  arcFlare.identity.aliases,
  ["flare"]
);
assert.deepEqual(
  arcFlare.prerequisites.requiredTierIds,
  ["tier.adept"]
);
assert.deepEqual(
  arcFlare.prerequisites.requiredSkills,
  [
    {
      skillId: "skill.arcana",
      minimumRank: 2,
      displayValue:
        "skill.arcana:2",
    },
  ]
);
assert.equal(
  arcFlare.prerequisites.requiredSkillsDisplay,
  "skill.arcana:2"
);
assert.equal(
  arcFlare.prerequisites.requiredUnlockCount,
  1
);
assert.equal(
  arcFlare.prerequisites.unlockAuthoringState,
  "JSON_EDITOR_ONLY_IN_CURRENT_V0_UI"
);

assert.deepEqual(
  arcFlare.targetModel,
  {
    mode: "ACTOR_SINGLE",
    rangeClass: "MEDIUM",
    minimumTargets: 1,
    maximumTargets: 1,
    requiresLineOfSight: true,
  }
);

assert.deepEqual(
  arcFlare.restrictions.forbiddenTags,
  ["injury"]
);

assert.equal(
  arcFlare.costs.count,
  1
);
assert.equal(
  arcFlare.costs.canAdd,
  true
);
assert.equal(
  arcFlare.costs.items[0].resourceType,
  "POOL"
);
assert.equal(
  arcFlare.costs.items[0].resourceId,
  "pool.mana"
);
assert.equal(
  arcFlare.costs.items[0].amount,
  5
);
assert.equal(
  arcFlare.costs.items[0].timing,
  "ON_USE"
);
assert.match(
  arcFlare.costs.helper,
  /Definition-time references only/i
);
assert.match(
  arcFlare.costs.helper,
  /Resource mutation is not implemented by this profile/i
);

assert.equal(
  arcFlare.operationReferences.count,
  1
);
assert.equal(
  arcFlare.operationReferences.executableCount,
  1
);
assert.equal(
  arcFlare.operationReferences.items[0].executable,
  true
);
assert.equal(
  arcFlare.operationReferences.items[0].domain,
  "STATS_POOLS"
);
assert.equal(
  arcFlare.operationReferences.items[0].operation,
  "MUTATE_POOL"
);
assert.equal(
  arcFlare.operationReferences.items[0].targetBinding.mode,
  "AUTHORIZED_ABILITY_TARGET"
);
assert.match(
  arcFlare.operationReferences.helper,
  /trusted Ability\/Spell use boundary/i
);

assert.deepEqual(
  arcFlare.cooldownPolicy,
  {
    mode: "TURN_COUNT",
    amount: 2,
    unit: "TURN",
  }
);

assert.deepEqual(
  arcFlare.chargePolicy,
  {
    mode: "FIXED",
    maximumCharges: 3,
    resetPolicy: "REST",
  }
);

assert.deepEqual(
  arcFlare.masteryPolicy,
  {
    mode: "RANKED",
    maximumMastery: 5,
  }
);

assert.equal(
  valid.enumOptions.abilityTypes.includes("SPELL"),
  true
);
assert.equal(
  valid.enumOptions.abilityTypes.includes("SPECIAL_ATTACK"),
  true
);
assert.equal(
  valid.enumOptions.targetModes.includes("AREA"),
  true
);
assert.equal(
  valid.enumOptions.cooldownModes.includes("WORLD_TIME"),
  true
);
assert.equal(
  valid.enumOptions.chargeModes.includes("FIXED"),
  true
);
assert.equal(
  valid.enumOptions.masteryModes.includes("RANKED"),
  true
);
assert.equal(
  valid.enumOptions.costResourceTypes.includes("CURRENCY"),
  true
);

const warning =
  projectAbilitySpellProfileAuthoringPresentationBinding(
    abilitySpellProfileAuthoringWarningFixture
  );

assert.equal(
  warning.validation.state,
  "WARNING"
);
assert.equal(
  warning.validation.valid,
  true
);
assert.equal(
  warning.validation.warnings.length,
  1
);
assert.equal(
  warning.validation.warnings[0].severity,
  "WARNING"
);

const error =
  projectAbilitySpellProfileAuthoringPresentationBinding(
    abilitySpellProfileAuthoringErrorFixture
  );

assert.equal(
  error.validation.state,
  "ERROR"
);
assert.equal(
  error.validation.valid,
  false
);
assert.equal(
  error.validation.errors[0].code,
  "ABILITY_SPELL_TARGET_RANGE_INVALID"
);

const jsonOpen =
  projectAbilitySpellProfileAuthoringPresentationBinding(
    abilitySpellProfileAuthoringJsonOpenFixture
  );

assert.equal(jsonOpen.jsonEditor.open, true);
assert.equal(
  jsonOpen.jsonEditor.actionLabel,
  "JSON Editor & AI Guide"
);
assert.equal(
  jsonOpen.jsonEditor.visualStatus,
  "PENDING_FE_VISUAL_EXTENSION"
);

const empty =
  projectAbilitySpellProfileAuthoringPresentationBinding(
    abilitySpellProfileAuthoringEmptyFixture
  );

assert.equal(
  empty.definitions.items.length,
  0
);
assert.equal(
  empty.definitions.summary.enabledDefinitionCount,
  0
);
assert.equal(
  empty.validation.state,
  "WARNING"
);
assert.equal(
  empty.definitions.emptyState,
  "No definitions are authored yet. Add one or paste a complete profile through the JSON editor."
);

assert.deepEqual(
  valid.visualExtensionStatus,
  {
    profileEditor:
      "PENDING_FE_VISUAL_BUILD",
    jsonEditor:
      "PENDING_FE_VISUAL_EXTENSION",
  }
);

assert.deepEqual(
  ABILITY_SPELL_PROFILE_AUTHORING_CALLBACK_KEYS,
  [
    "onUpdateProfileField",
    "onAddDefinition",
    "onRemoveDefinition",
    "onUpdateDefinitionField",
    "onUpdatePrerequisiteField",
    "onUpdateTargetField",
    "onUpdateRestrictionField",
    "onUpdatePolicyField",
    "onAddCost",
    "onUpdateCostField",
    "onRemoveCost",
    "onAddOperationReference",
    "onUpdateOperationReferenceField",
    "onRemoveOperationReference",
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
  runtimeAbilityStateExcluded: true,
  runtimeExecutionOwnedByChassis: true,
  editorVisualCompositionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./AbilitySpellProfileAuthoringPresentationBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "normalizeAbilitySpellProfileEditorValue",
  "validateAbilitySpellProfileEditorValue",
  "normalizeAbilitySpellDefinition",
  "normalizeAbilitySpellCost",
  "normalizeAbilitySpellOperationReference",
  "commit(",
  "setJsonEditorOpen",
  "applyJsonProfile",
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
    "ability_spell_profile_authoring_presentation_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    ABILITY_SPELL_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,
  editorViewContractVersion:
    ABILITY_SPELL_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  builderViewContractVersion:
    ABILITY_SPELL_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  profileContractVersion:
    ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  creationType:
    ABILITY_SPELL_PROFILE_CREATION_TYPE,
  definitionSectionsCovered: true,
  prerequisiteTargetRestrictionProjectionCovered: true,
  costAndExecutableOperationProjectionCovered: true,
  cooldownChargeMasteryProjectionCovered: true,
  validationStatesCovered: true,
  jsonEditorPendingVisualExtensionExplicit: true,
  profileEditorPendingVisualBuildExplicit: true,
  chassisNormalizationValidationMutationPersistenceExcluded: true,
}, null, 2));
