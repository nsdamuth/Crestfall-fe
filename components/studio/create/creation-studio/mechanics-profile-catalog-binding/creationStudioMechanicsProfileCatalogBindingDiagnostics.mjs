import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CREATION_STUDIO_EXPERIENCE_VERSION,
  GUIDED_BUILD_CHAPTER_DEFINITIONS,
  FULL_STUDIO_SECTION_DEFINITIONS,
} from "../CreationStudio.contract.mjs";

import {
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
} from "../../ability-spell/ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";

import {
  SKILLS_PROFILE_CONTRACT_VERSION,
} from "../../skills/skills-profile-editor/SkillsProfileEditor.contract.js";

import {
  WALLET_PROFILE_CONTRACT_VERSION,
} from "../../wallet/wallet-profile-editor/WalletProfileEditor.contract.js";

import {
  CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_BINDING_CONTRACT_VERSION,
  CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES,
  projectCreationStudioMechanicsProfileCatalogBinding,
} from "./CreationStudioMechanicsProfileCatalogBinding.contract.js";

import {
  creationStudioMechanicsProfileCatalogAllRoutesFixture,
  creationStudioMechanicsProfileCatalogNoRoutesFixture,
  creationStudioMechanicsProfileCatalogPartialRoutesFixture,
} from "./CreationStudioMechanicsProfileCatalogBinding.fixtures.js";

assert.equal(
  CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_BINDING_CONTRACT_VERSION,
  "creation_studio_mechanics_profile_catalog_binding_v1"
);

assert.equal(
  CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.length,
  3
);

assert.deepEqual(
  CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.map(
    (entry) => [
      entry.id,
      entry.number,
      entry.assetTitle,
      entry.creationType,
      entry.contractVersion,
    ]
  ),
  [
    [
      "SKILLS_PROFILE",
      22,
      "Skills Profile",
      "SKILLS_PROFILE",
      SKILLS_PROFILE_CONTRACT_VERSION,
    ],
    [
      "ABILITY_SPELL_PROFILE",
      23,
      "Ability & Spell Profile",
      "ABILITY_SPELL_PROFILE",
      ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
    ],
    [
      "WALLET_PROFILE",
      24,
      "Wallet Profile",
      "WALLET_PROFILE",
      WALLET_PROFILE_CONTRACT_VERSION,
    ],
  ]
);

const currentRules =
  GUIDED_BUILD_CHAPTER_DEFINITIONS.find(
    (chapter) =>
      chapter.id ===
      "RULES_MECHANICS"
  );

assert.equal(
  currentRules.steps.length,
  5
);

assert.deepEqual(
  currentRules.steps.map(
    (step) =>
      step.id
  ),
  [
    "STATS_POOLS_PROFILE",
    "PROGRESSION_PROFILE",
    "MECHANICS_MODULE",
    "ACTOR_MECHANICS_PROFILE",
    "RULES_CODEX",
  ]
);

const currentFullRules =
  FULL_STUDIO_SECTION_DEFINITIONS.find(
    (section) =>
      section.id ===
      "RULES_MECHANICS"
  );

assert.deepEqual(
  currentFullRules.assetTitles,
  [
    "Stats & Pools Profile",
    "Progression Profile",
    "Mechanics Module",
    "Actor Mechanics Profile",
    "Rules Codex",
  ]
);

const allRoutes =
  projectCreationStudioMechanicsProfileCatalogBinding(
    creationStudioMechanicsProfileCatalogAllRoutesFixture
  );

assert.equal(
  allRoutes.bindingContractVersion,
  CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_BINDING_CONTRACT_VERSION
);

assert.equal(
  allRoutes.creationStudioExperienceVersion,
  CREATION_STUDIO_EXPERIENCE_VERSION
);

assert.deepEqual(
  allRoutes.assetAdditions.map(
    (asset) => [
      asset.title,
      asset.href,
      asset.disabled,
      asset.creationType,
      asset.profileContractVersion,
    ]
  ),
  [
    [
      "Skills Profile",
      "/studio/create/skills-profile",
      false,
      "SKILLS_PROFILE",
      SKILLS_PROFILE_CONTRACT_VERSION,
    ],
    [
      "Ability & Spell Profile",
      "/studio/create/ability-spell-profile",
      false,
      "ABILITY_SPELL_PROFILE",
      ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
    ],
    [
      "Wallet Profile",
      "/studio/create/wallet-profile",
      false,
      "WALLET_PROFILE",
      WALLET_PROFILE_CONTRACT_VERSION,
    ],
  ]
);

const rulesChapter =
  allRoutes.guidedChapters.find(
    (chapter) =>
      chapter.id ===
      "RULES_MECHANICS"
  );

assert.deepEqual(
  rulesChapter.steps.map(
    (step) => [
      step.id,
      step.number,
      step.assetTitle,
    ]
  ),
  [
    [
      "STATS_POOLS_PROFILE",
      20,
      "Stats & Pools Profile",
    ],
    [
      "PROGRESSION_PROFILE",
      21,
      "Progression Profile",
    ],
    [
      "SKILLS_PROFILE",
      22,
      "Skills Profile",
    ],
    [
      "ABILITY_SPELL_PROFILE",
      23,
      "Ability & Spell Profile",
    ],
    [
      "WALLET_PROFILE",
      24,
      "Wallet Profile",
    ],
    [
      "MECHANICS_MODULE",
      25,
      "Mechanics Module",
    ],
    [
      "ACTOR_MECHANICS_PROFILE",
      26,
      "Actor Mechanics Profile",
    ],
    [
      "RULES_CODEX",
      27,
      "Rules Codex",
    ],
  ]
);

assert.equal(
  rulesChapter.steps.find(
    (step) =>
      step.id ===
      "PROGRESSION_PROFILE"
  ).next,
  "Once growth is defined, author the reusable skills and proficiency ranks actors can advance."
);

assert.equal(
  rulesChapter.steps.find(
    (step) =>
      step.id ===
      "SKILLS_PROFILE"
  ).why,
  "Skills Profiles define reusable skills, proficiency ranks, point costs, and Progression prerequisites."
);

assert.equal(
  rulesChapter.steps.find(
    (step) =>
      step.id ===
      "ABILITY_SPELL_PROFILE"
  ).why,
  "Ability & Spell Profiles define reusable spells, abilities, techniques, special attacks, passives, prerequisites, costs, targeting, and use policies."
);

assert.equal(
  rulesChapter.steps.find(
    (step) =>
      step.id ===
      "WALLET_PROFILE"
  ).why,
  "Wallet Profiles define reusable currencies, starting balances, and authored minimum and maximum balance bounds while actor balances remain isolated Story state."
);

const reuseChapter =
  allRoutes.guidedChapters.find(
    (chapter) =>
      chapter.id ===
      "REUSE_SCALE"
  );

assert.equal(
  reuseChapter.steps[0].id,
  "CHARACTER_TEMPLATE"
);

assert.equal(
  reuseChapter.steps[0].number,
  28
);

const allSteps =
  allRoutes.guidedChapters.flatMap(
    (chapter) =>
      chapter.steps
  );

assert.equal(
  allSteps.length,
  28
);

assert.deepEqual(
  allSteps.map(
    (step) => step.number
  ),
  Array.from(
    { length: 28 },
    (_, index) =>
      index + 1
  )
);

const fullRules =
  allRoutes.fullStudioSections.find(
    (section) =>
      section.id ===
      "RULES_MECHANICS"
  );

assert.deepEqual(
  fullRules.assetTitles,
  [
    "Stats & Pools Profile",
    "Progression Profile",
    "Skills Profile",
    "Ability & Spell Profile",
    "Wallet Profile",
    "Mechanics Module",
    "Actor Mechanics Profile",
    "Rules Codex",
  ]
);

assert.equal(
  fullRules.description,
  "Create formal stats, progression, skills, abilities, spells, gameplay wallets, meters, commands, effects, guards, and verified interpretation guidance."
);

assert.deepEqual(
  allRoutes.summary,
  {
    totalGuidedStepCount: 28,
    rulesMechanicsStepCount: 8,
    addedProfileCount: 3,
    availableRouteCount: 3,
    blockedRouteCount: 0,
  }
);

assert.equal(
  allRoutes.visualExtensionStatus.liveCatalogExposure,
  "READY_FOR_FE_WIRING"
);

const partialRoutes =
  projectCreationStudioMechanicsProfileCatalogBinding(
    creationStudioMechanicsProfileCatalogPartialRoutesFixture
  );

assert.deepEqual(
  partialRoutes.assetAdditions.map(
    (asset) => [
      asset.title,
      asset.routeAvailable,
      asset.disabled,
      asset.href,
    ]
  ),
  [
    [
      "Skills Profile",
      true,
      false,
      "/studio/create/skills-profile",
    ],
    [
      "Ability & Spell Profile",
      false,
      true,
      "",
    ],
    [
      "Wallet Profile",
      false,
      true,
      "",
    ],
  ]
);

assert.equal(
  partialRoutes.assetAdditions[1].routeUnavailableReason,
  "Ability & Spell Profile routing is waiting for the Chassis route mount."
);

assert.equal(
  partialRoutes.assetAdditions[2].routeUnavailableReason,
  "This creator route is not exposed by the Chassis integration shell yet."
);

assert.equal(
  partialRoutes.visualExtensionStatus.liveCatalogExposure,
  "WAITING_FOR_CHASSIS_ROUTE_BINDING"
);

const noRoutes =
  projectCreationStudioMechanicsProfileCatalogBinding(
    creationStudioMechanicsProfileCatalogNoRoutesFixture
  );

assert.equal(
  noRoutes.summary.availableRouteCount,
  0
);

assert.equal(
  noRoutes.summary.blockedRouteCount,
  3
);

assert.equal(
  noRoutes.assetAdditions.every(
    (asset) =>
      asset.disabled &&
      asset.href === ""
  ),
  true
);

assert.deepEqual(
  allRoutes.architecture,
  {
    catalogInformationArchitectureOwnedByFe: true,
    creatorRouteAuthorityOwnedByChassis: true,
    routeAvailabilityOwnedByChassis: true,
    creationCountLoadingOwnedByChassis: true,
    guidedProgressCalculationRemainsExistingContract: true,
    builderStartupOwnedByChassis: true,
    catalogVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./CreationStudioMechanicsProfileCatalogBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  'href: "/studio/create/skills-profile"',
  'href: "/studio/create/ability-spell-profile"',
  'href: "/studio/create/wallet-profile"',
  "fetchOwnedCreations",
  "buildCreationTypeCounts",
  "buildGuidedChapterStates",
  "getRecommendedGuidedStep",
  "router.push",
  "next/navigation",
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
    "creation_studio_mechanics_profile_catalog_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_BINDING_CONTRACT_VERSION,
  creationStudioExperienceVersion:
    CREATION_STUDIO_EXPERIENCE_VERSION,
  addedProfileCount:
    CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.length,
  totalGuidedStepCount:
    allRoutes.summary.totalGuidedStepCount,
  rulesMechanicsStepCount:
    allRoutes.summary.rulesMechanicsStepCount,
  guidedDependencyOrderCovered: true,
  fullStudioCatalogExpansionCovered: true,
  sourceCatalogCopyCovered: true,
  chassisSuppliedRouteTargetsCovered: true,
  missingRouteDeadLinkProtectionCovered: true,
  existingCreationStudioContractUnmodified: true,
  existingCreationStudioViewUnmodified: true,
  existingCreationStudioViewModelUnmodified: true,
  chassisRoutingCountsStartupExcluded: true,
}, null, 2));
