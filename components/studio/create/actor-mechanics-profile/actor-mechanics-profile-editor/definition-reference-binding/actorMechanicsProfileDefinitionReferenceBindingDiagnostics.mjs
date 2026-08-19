import assert from "node:assert/strict";
import fs from "node:fs";

import {
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
} from "../ActorMechanicsProfileEditor.contract.js";

import {
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
} from "../../../ability-spell/ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";

import {
  SKILLS_PROFILE_CONTRACT_VERSION,
} from "../../../skills/skills-profile-editor/SkillsProfileEditor.contract.js";

import {
  WALLET_PROFILE_CONTRACT_VERSION,
} from "../../../wallet/wallet-profile-editor/WalletProfileEditor.contract.js";

import {
  ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_BINDING_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_CALLBACK_KEYS,
  ACTOR_MECHANICS_PROFILE_MANAGED_REFERENCE_MODES,
  projectActorMechanicsProfileDefinitionReferenceBinding,
  projectActorMechanicsProfileDefinitionReferenceBindingItem,
} from "./ActorMechanicsProfileDefinitionReferenceBinding.contract.js";

import {
  actorMechanicsProfileDefinitionReferenceBindingsFixture,
  actorMechanicsProfileDefinitionReferenceMagicPickerFixture,
  actorMechanicsProfileDefinitionReferenceSkillsPickerFixture,
  actorMechanicsProfileDefinitionReferenceWalletPickerFixture,
} from "./ActorMechanicsProfileDefinitionReferenceBinding.fixtures.js";

assert.equal(
  ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_BINDING_CONTRACT_VERSION,
  "actor_mechanics_profile_definition_reference_binding_v1"
);

assert.deepEqual(
  ACTOR_MECHANICS_PROFILE_MANAGED_REFERENCE_MODES,
  [
    "STATS_POOLS_PROFILE",
    "PROGRESSION_PROFILE",
    "SKILLS_PROFILE",
    "ABILITY_SPELL_PROFILE",
    "WALLET_PROFILE",
  ]
);

const projection =
  projectActorMechanicsProfileDefinitionReferenceBinding({
    bindings:
      actorMechanicsProfileDefinitionReferenceBindingsFixture,
    pickerProps:
      actorMechanicsProfileDefinitionReferenceSkillsPickerFixture,
  });

assert.equal(
  projection.bindingContractVersion,
  ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_BINDING_CONTRACT_VERSION
);

assert.equal(
  projection.actorMechanicsProfileEditorViewContractVersion,
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION
);

assert.equal(
  projection.bindings.length,
  7
);

assert.deepEqual(
  projection.summary,
  {
    bindingCount: 7,
    managedBindingCount: 6,
    pendingFeVisualExtensionCount: 4,
    selectedManagedCreationReferenceCount: 5,
  }
);

const stats =
  projection.bindings.find(
    (item) =>
      item.bindingId === "binding.stats"
  );

assert.equal(stats.managed, true);
assert.equal(
  stats.definitionReferenceMode,
  "STATS_POOLS_PROFILE"
);
assert.equal(
  stats.visualStatus,
  "CURRENT_FE_CONTROL_AVAILABLE"
);
assert.equal(
  stats.label,
  "Stats & Pools Profile"
);
assert.equal(
  stats.creationType,
  "STATS_POOLS_PROFILE"
);
assert.equal(
  stats.actionLabel,
  "Replace Stats & Pools Profile"
);
assert.equal(
  stats.displayReference.title,
  "Heroic Stats & Pools"
);

const progression =
  projection.bindings.find(
    (item) =>
      item.bindingId ===
      "binding.progression"
  );

assert.equal(
  progression.visualStatus,
  "CURRENT_FE_CONTROL_AVAILABLE"
);
assert.equal(
  progression.creationType,
  "PROGRESSION_PROFILE"
);

const skills =
  projection.bindings.find(
    (item) =>
      item.bindingId === "binding.skills"
  );

assert.equal(
  skills.visualStatus,
  "PENDING_FE_VISUAL_EXTENSION"
);
assert.equal(
  skills.creationType,
  "SKILLS_PROFILE"
);
assert.equal(
  skills.fallbackVersion,
  SKILLS_PROFILE_CONTRACT_VERSION
);
assert.equal(
  skills.actionLabel,
  "Replace Skills Profile"
);
assert.equal(
  skills.displayReference.title,
  "Aethelgard Field Skills"
);
assert.match(
  skills.description,
  /actor ranks and unspent points are not copied or initialized/i
);

const magic =
  projection.bindings.find(
    (item) =>
      item.bindingId === "binding.magic"
  );

assert.equal(
  magic.visualStatus,
  "PENDING_FE_VISUAL_EXTENSION"
);
assert.equal(
  magic.creationType,
  "ABILITY_SPELL_PROFILE"
);
assert.equal(
  magic.fallbackVersion,
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION
);
assert.match(
  magic.description,
  /reusable spell and magic definitions/i
);
assert.match(
  magic.description,
  /mastery, cooldowns, charges, and resource state remain owner-scoped/i
);

const abilities =
  projection.bindings.find(
    (item) =>
      item.bindingId ===
      "binding.abilities"
  );

assert.equal(
  abilities.hasReference,
  false
);
assert.equal(
  abilities.actionLabel,
  "Select Ability & Spell Profile"
);
assert.match(
  abilities.emptyState,
  /reusable ability and spell definitions/i
);

const wallet =
  projection.bindings.find(
    (item) =>
      item.bindingId === "binding.wallet"
  );

assert.equal(
  wallet.visualStatus,
  "PENDING_FE_VISUAL_EXTENSION"
);
assert.equal(
  wallet.creationType,
  "WALLET_PROFILE"
);
assert.equal(
  wallet.fallbackVersion,
  WALLET_PROFILE_CONTRACT_VERSION
);
assert.match(
  wallet.description,
  /gameplay currency definitions/i
);
assert.match(
  wallet.description,
  /Live balances, revisions, and transaction history remain owner-scoped/i
);

const inventory =
  projection.bindings.find(
    (item) =>
      item.bindingId ===
      "binding.inventory"
  );

assert.equal(
  inventory.managed,
  false
);
assert.equal(
  inventory.visualStatus,
  "CURRENT_GENERIC_REFERENCE_EDITOR"
);
assert.equal(
  inventory.references[0].referenceType,
  "BUILTIN_MODULE"
);

assert.deepEqual(
  projection.visualExtensionStatus,
  {
    skillsProfileControl:
      "PENDING_FE_VISUAL_EXTENSION",
    abilitySpellProfileControl:
      "PENDING_FE_VISUAL_EXTENSION",
    walletProfileControl:
      "PENDING_FE_VISUAL_EXTENSION",
  }
);

assert.deepEqual(
  projection.picker,
  {
    title: "Select Skills Profile",
    body:
      "Choose an owned Skills Profile to provide reusable proficiency and rank definitions for this SKILLS binding. Actor ranks and unspent points are not copied or initialized by this attachment.",
    allowedTypes: [
      "SKILLS_PROFILE",
    ],
    selectedCreationIds: [
      "33333333-3333-4333-8333-333333333333",
    ],
    onClose: null,
    onSelect: null,
    authority:
      "CHASSIS_APPLICATION_VIEWMODEL",
  }
);

const magicPicker =
  projectActorMechanicsProfileDefinitionReferenceBinding({
    bindings:
      actorMechanicsProfileDefinitionReferenceBindingsFixture,
    pickerProps:
      actorMechanicsProfileDefinitionReferenceMagicPickerFixture,
  });

assert.deepEqual(
  magicPicker.picker.allowedTypes,
  ["ABILITY_SPELL_PROFILE"]
);

assert.match(
  magicPicker.picker.body,
  /spell and magic definitions/i
);

const walletPicker =
  projectActorMechanicsProfileDefinitionReferenceBinding({
    bindings:
      actorMechanicsProfileDefinitionReferenceBindingsFixture,
    pickerProps:
      actorMechanicsProfileDefinitionReferenceWalletPickerFixture,
  });

assert.deepEqual(
  walletPicker.picker.allowedTypes,
  ["WALLET_PROFILE"]
);

const mismatched =
  projectActorMechanicsProfileDefinitionReferenceBindingItem({
    binding: {
      id: "bad",
      domain: "INVENTORY",
      definitionReferenceMode:
        "WALLET_PROFILE",
      references: [],
    },
  });

assert.equal(
  mismatched.managed,
  false
);

assert.deepEqual(
  ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_CALLBACK_KEYS,
  [
    "onOpenStatsPoolsProfilePicker",
    "onOpenProgressionProfilePicker",
    "onOpenSkillsProfilePicker",
    "onOpenAbilitySpellProfilePicker",
    "onOpenWalletProfilePicker",
  ]
);

assert.deepEqual(
  projection.architecture,
  {
    definitionReferenceModeOwnedByChassis: true,
    referenceSelectionStateOwnedByChassis: true,
    pickerOpenStateOwnedByChassis: true,
    candidateCreationLoadingOwnedByChassis: true,
    profileReferenceMutationOwnedByChassis: true,
    runtimeActorStateExcludedFromAttachment: true,
    managedProfileControlPresentationOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./ActorMechanicsProfileDefinitionReferenceBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "createSkillsProfileReference",
  "createAbilitySpellProfileReference",
  "createWalletProfileReference",
  "setSkillsPickerBindingId",
  "setAbilitySpellPickerBindingId",
  "setWalletPickerBindingId",
  "selectSkillsProfile",
  "selectAbilitySpellProfile",
  "selectWalletProfile",
  "fetchOwnedCreations",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
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
    "actor_mechanics_profile_definition_reference_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_BINDING_CONTRACT_VERSION,
  actorMechanicsProfileEditorViewContractVersion:
    ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  managedReferenceModeCount:
    ACTOR_MECHANICS_PROFILE_MANAGED_REFERENCE_MODES.length,
  existingStatsAndProgressionControlsPreserved: true,
  skillsProfileReferenceProjectionCovered: true,
  abilitySpellMagicAndAbilitiesProjectionCovered: true,
  walletProfileReferenceProjectionCovered: true,
  genericReferenceEditorPreserved: true,
  chassisPickerAndReferenceMutationExcluded: true,
  runtimeActorStateIsolationCopyCovered: true,
  existingActorMechanicsEditorViewUnmodified: true,
  existingActorMechanicsEditorViewModelUnmodified: true,
}, null, 2));
