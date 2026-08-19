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

export const CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_BINDING_CONTRACT_VERSION =
  "creation_studio_mechanics_profile_catalog_binding_v1";

export const CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES =
  Object.freeze([
    Object.freeze({
      id: "SKILLS_PROFILE",
      number: 22,
      title: "Create a Skills Profile",
      assetTitle: "Skills Profile",
      creationType: "SKILLS_PROFILE",
      eyebrow: "Define Skills & Proficiencies",
      why:
        "Skills Profiles define reusable skills, proficiency ranks, point costs, and Progression prerequisites.",
      next:
        "Once skills exist, define the abilities, spells, techniques, attacks, and passives actors may reference.",
      assetEyebrow:
        "Skills & Proficiency Definitions",
      assetDescription:
        "Create reusable skills, proficiency ranks, point costs, and Progression prerequisites for Actor Mechanics Profiles.",
      contractVersion:
        SKILLS_PROFILE_CONTRACT_VERSION,
      routeKey: "skillsProfile",
    }),

    Object.freeze({
      id: "ABILITY_SPELL_PROFILE",
      number: 23,
      title:
        "Create an Ability & Spell Profile",
      assetTitle:
        "Ability & Spell Profile",
      creationType:
        "ABILITY_SPELL_PROFILE",
      eyebrow:
        "Define Abilities & Spells",
      why:
        "Ability & Spell Profiles define reusable spells, abilities, techniques, special attacks, passives, prerequisites, costs, targeting, and use policies.",
      next:
        "Once reusable capabilities exist, define the gameplay currencies actors can own and mutate.",
      assetEyebrow:
        "Ability & Spell Definitions",
      assetDescription:
        "Create reusable abilities, spells, techniques, special attacks, passives, prerequisites, costs, targeting, and use policies for Actor Mechanics Profiles.",
      contractVersion:
        ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
      routeKey:
        "abilitySpellProfile",
    }),

    Object.freeze({
      id: "WALLET_PROFILE",
      number: 24,
      title:
        "Create a Wallet Profile",
      assetTitle:
        "Wallet Profile",
      creationType:
        "WALLET_PROFILE",
      eyebrow:
        "Define Gameplay Currency",
      why:
        "Wallet Profiles define reusable currencies, starting balances, and authored minimum and maximum balance bounds while actor balances remain isolated Story state.",
      next:
        "Once gameplay currency exists, define the commands, effects, triggers, and guards that operate on actor state.",
      assetEyebrow:
        "Gameplay Currency Definitions",
      assetDescription:
        "Create reusable gameplay currencies, starting balances, and authored balance bounds for Actor Mechanics Profiles.",
      contractVersion:
        WALLET_PROFILE_CONTRACT_VERSION,
      routeKey:
        "walletProfile",
    }),
  ]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cloneStep(step = {}) {
  return {
    ...step,
    creationTypes:
      Array.isArray(step.creationTypes)
        ? [...step.creationTypes]
        : [],
    optionalAssetTitles:
      Array.isArray(step.optionalAssetTitles)
        ? [...step.optionalAssetTitles]
        : step.optionalAssetTitles,
  };
}

function cloneChapter(chapter = {}) {
  return {
    ...chapter,
    steps:
      Array.isArray(chapter.steps)
        ? chapter.steps.map(cloneStep)
        : [],
  };
}

function cloneSection(section = {}) {
  return {
    ...section,
    assetTitles:
      Array.isArray(section.assetTitles)
        ? [...section.assetTitles]
        : [],
  };
}

function routeProjection(routeTargets, entry) {
  const routeState = object(
    object(routeTargets)[entry.routeKey]
  );

  const href = text(routeState.href);
  const available =
    routeState.available === true &&
    Boolean(href);

  return {
    available,
    href:
      available ? href : "",
    unavailableReason:
      available
        ? ""
        : text(routeState.unavailableReason) ||
          "This creator route is not exposed by the Chassis integration shell yet.",
  };
}

function assetProjection(routeTargets, entry) {
  const route =
    routeProjection(routeTargets, entry);

  return {
    title:
      entry.assetTitle,
    eyebrow:
      entry.assetEyebrow,
    description:
      entry.assetDescription,
    href:
      route.href,
    image:
      "/assets/covers/crestfall-book-cover.png",
    disabled:
      !route.available,
    routeAvailable:
      route.available,
    routeUnavailableReason:
      route.unavailableReason,
    creationType:
      entry.creationType,
    profileContractVersion:
      entry.contractVersion,
  };
}

function augmentedRulesSteps() {
  const rulesChapter =
    GUIDED_BUILD_CHAPTER_DEFINITIONS.find(
      (chapter) =>
        chapter.id === "RULES_MECHANICS"
    );

  const currentSteps =
    Array.isArray(rulesChapter?.steps)
      ? rulesChapter.steps.map(cloneStep)
      : [];

  const beforeInsertion =
    currentSteps.filter(
      (step) =>
        Number(step.number) <= 21
    );

  const afterInsertion =
    currentSteps
      .filter(
        (step) =>
          Number(step.number) >= 22
      )
      .map((step) => ({
        ...step,
        number:
          Number(step.number) + 3,
      }));

  const progressionIndex =
    beforeInsertion.findIndex(
      (step) =>
        step.id ===
        "PROGRESSION_PROFILE"
    );

  if (progressionIndex >= 0) {
    beforeInsertion[progressionIndex] = {
      ...beforeInsertion[progressionIndex],
      next:
        "Once growth is defined, author the reusable skills and proficiency ranks actors can advance.",
    };
  }

  return [
    ...beforeInsertion,
    ...CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.map(
      (entry) => ({
        id: entry.id,
        number: entry.number,
        title: entry.title,
        assetTitle:
          entry.assetTitle,
        creationTypes: [
          entry.creationType,
        ],
        requiredCount: 1,
        eyebrow:
          entry.eyebrow,
        why:
          entry.why,
        next:
          entry.next,
      })
    ),
    ...afterInsertion,
  ];
}

export function projectCreationStudioMechanicsProfileCatalogBinding({
  routeTargets = {},
} = {}) {
  const guidedChapters =
    GUIDED_BUILD_CHAPTER_DEFINITIONS.map(
      cloneChapter
    );

  const rulesChapterIndex =
    guidedChapters.findIndex(
      (chapter) =>
        chapter.id ===
        "RULES_MECHANICS"
    );

  const rulesSteps =
    augmentedRulesSteps();

  if (rulesChapterIndex >= 0) {
    guidedChapters[
      rulesChapterIndex
    ] = {
      ...guidedChapters[
        rulesChapterIndex
      ],
      steps: rulesSteps,
    };
  }

  const reuseChapterIndex =
    guidedChapters.findIndex(
      (chapter) =>
        chapter.id ===
        "REUSE_SCALE"
    );

  if (
    reuseChapterIndex >= 0 &&
    guidedChapters[
      reuseChapterIndex
    ].steps.length > 0
  ) {
    guidedChapters[
      reuseChapterIndex
    ] = {
      ...guidedChapters[
        reuseChapterIndex
      ],
      steps:
        guidedChapters[
          reuseChapterIndex
        ].steps.map((step) => ({
          ...step,
          number:
            Number(step.number) + 3,
        })),
    };
  }

  const fullStudioSections =
    FULL_STUDIO_SECTION_DEFINITIONS.map(
      cloneSection
    );

  const fullRulesIndex =
    fullStudioSections.findIndex(
      (section) =>
        section.id ===
        "RULES_MECHANICS"
    );

  if (fullRulesIndex >= 0) {
    const existing =
      fullStudioSections[
        fullRulesIndex
      ];

    const assetTitles =
      [...existing.assetTitles];

    const progressionIndex =
      assetTitles.indexOf(
        "Progression Profile"
      );

    const additions =
      CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.map(
        (entry) =>
          entry.assetTitle
      );

    const nextAssetTitles =
      progressionIndex >= 0
        ? [
            ...assetTitles.slice(
              0,
              progressionIndex + 1
            ),
            ...additions,
            ...assetTitles.slice(
              progressionIndex + 1
            ),
          ]
        : [
            ...assetTitles,
            ...additions,
          ];

    fullStudioSections[
      fullRulesIndex
    ] = {
      ...existing,
      description:
        "Create formal stats, progression, skills, abilities, spells, gameplay wallets, meters, commands, effects, guards, and verified interpretation guidance.",
      assetTitles:
        nextAssetTitles,
    };
  }

  const assetAdditions =
    CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.map(
      (entry) =>
        assetProjection(
          routeTargets,
          entry
        )
    );

  const allGuidedSteps =
    guidedChapters.flatMap(
      (chapter) =>
        chapter.steps
    );

  return {
    bindingContractVersion:
      CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_BINDING_CONTRACT_VERSION,

    creationStudioExperienceVersion:
      CREATION_STUDIO_EXPERIENCE_VERSION,

    assetAdditions,

    guidedChapters,

    fullStudioSections,

    summary: {
      totalGuidedStepCount:
        allGuidedSteps.length,
      rulesMechanicsStepCount:
        rulesSteps.length,
      addedProfileCount:
        CREATION_STUDIO_MECHANICS_PROFILE_CATALOG_ENTRIES.length,
      availableRouteCount:
        assetAdditions.filter(
          (asset) =>
            asset.routeAvailable
        ).length,
      blockedRouteCount:
        assetAdditions.filter(
          (asset) =>
            !asset.routeAvailable
        ).length,
    },

    visualExtensionStatus: {
      catalogSemantics:
        "READY_FOR_CHASSIS_BINDING",
      liveCatalogExposure:
        assetAdditions.every(
          (asset) =>
            asset.routeAvailable
        )
          ? "READY_FOR_FE_WIRING"
          : "WAITING_FOR_CHASSIS_ROUTE_BINDING",
    },

    architecture: {
      catalogInformationArchitectureOwnedByFe: true,
      creatorRouteAuthorityOwnedByChassis: true,
      routeAvailabilityOwnedByChassis: true,
      creationCountLoadingOwnedByChassis: true,
      guidedProgressCalculationRemainsExistingContract: true,
      builderStartupOwnedByChassis: true,
      catalogVisualCompositionOwnedByFe: true,
    },
  };
}
