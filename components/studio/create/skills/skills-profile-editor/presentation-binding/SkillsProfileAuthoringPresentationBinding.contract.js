import {
  SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  SKILLS_PROFILE_CONTRACT_VERSION,
  SKILLS_PROFILE_LIMITS,
  SKILLS_UNLOCK_TYPES,
} from "../SkillsProfileEditor.contract.js";

import {
  SKILLS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  SKILLS_PROFILE_CREATION_TYPE,
} from "../../skills-profile-builder/SkillsProfileBuilder.contract.js";

export const SKILLS_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION =
  "skills_profile_authoring_presentation_binding_v1";

export const SKILLS_PROFILE_AUTHORING_CALLBACK_KEYS = Object.freeze([
  "onUpdateProfileField",
  "onAddSkill",
  "onRemoveSkill",
  "onUpdateSkillField",
  "onUpdateRankField",
  "onOpenJsonEditor",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function issueProjection(issue = {}) {
  const source = object(issue);

  return {
    code: text(source.code),
    path: text(source.path),
    message: text(source.message),
    severity:
      text(source.severity).toUpperCase() || "ERROR",
  };
}

function requiredSkillProjection(value = {}) {
  const source = object(value);
  const skillId = text(source.skillId);
  const minimumRank = number(source.minimumRank, 1);

  return {
    skillId,
    minimumRank,
    displayValue:
      skillId
        ? `${skillId}:${minimumRank}`
        : "",
  };
}

function unlockProjection(value = {}) {
  const source = object(value);

  return {
    unlockType: text(source.unlockType),
    unlockId: text(source.unlockId),
    referenceType: text(source.referenceType),
    referenceId: text(source.referenceId),
    title:
      text(source.title) ||
      text(source.unlockId) ||
      "Unlock",
  };
}

function rankProjection(rank = {}, rankIndex = 0) {
  const source = object(rank);
  const prerequisites = object(source.prerequisites);
  const grants = object(source.grants);

  const requiredSkills =
    array(prerequisites.requiredSkills)
      .map(requiredSkillProjection);

  const requiredUnlocks =
    array(prerequisites.requiredUnlocks)
      .map(unlockProjection);

  return {
    index: rankIndex,
    rank: number(source.rank, rankIndex + 1),
    title:
      text(source.title) ||
      `Rank ${rankIndex + 1}`,
    description: text(source.description),
    pointCost: number(source.pointCost, 0),

    prerequisites: {
      minimumLevel:
        number(prerequisites.minimumLevel, 0),
      requiredTierIds:
        array(prerequisites.requiredTierIds)
          .map(text)
          .filter(Boolean),
      requiredSkills,
      requiredSkillsDisplay:
        requiredSkills
          .map((entry) => entry.displayValue)
          .filter(Boolean)
          .join(", "),
      requiredUnlocks,
      requiredUnlockCount:
        requiredUnlocks.length,

      structuredAuthoringState:
        requiredSkills.length > 0 ||
        requiredUnlocks.length > 0
          ? "JSON_EDITOR_ONLY_IN_CURRENT_V0_UI"
          : "NO_STRUCTURED_REQUIREMENTS",
    },

    grants: {
      tags:
        array(grants.tags)
          .map(text)
          .filter(Boolean),
      commandIds:
        array(grants.commandIds)
          .map(text)
          .filter(Boolean),
    },

    removeAllowed: false,
  };
}

function skillProjection(skill = {}, skillIndex = 0) {
  const source = object(skill);
  const ranks =
    array(source.rankDefinitions)
      .map(rankProjection);

  return {
    index: skillIndex,
    key:
      text(source.id) ||
      `skill-${skillIndex + 1}`,

    identity: {
      id: text(source.id),
      title:
        text(source.title) ||
        text(source.id) ||
        `Skill ${skillIndex + 1}`,
      description: text(source.description),
      enabled:
        source.enabled !== false,
      category:
        text(source.category) || "GENERAL",
      tags:
        array(source.tags)
          .map(text)
          .filter(Boolean),
    },

    progression: {
      startingRank:
        number(source.startingRank, 0),
      maximumRank:
        number(
          source.maximumRank,
          ranks.length || 1
        ),
      rankCount:
        ranks.length,
    },

    ranks,

    removeLabel: "Remove",
  };
}

export function projectSkillsProfileAuthoringPresentationBinding({
  profile = {},
  errors = [],
  warnings = [],
  metrics = {},
  jsonEditorOpen = false,
  callbacks = {},
} = {}) {
  const safeProfile = object(profile);
  const safeMetrics = object(metrics);
  const callbackSource = object(callbacks);

  const skills =
    array(safeProfile.skillDefinitions)
      .map(skillProjection);

  const projectedErrors =
    array(errors).map(issueProjection);

  const projectedWarnings =
    array(warnings).map(issueProjection);

  const validationState =
    projectedErrors.length > 0
      ? "ERROR"
      : projectedWarnings.length > 0
        ? "WARNING"
        : "VALID";

  return {
    bindingContractVersion:
      SKILLS_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,

    editorViewContractVersion:
      SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,

    builderViewContractVersion:
      SKILLS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,

    profileContractVersion:
      text(safeProfile.contractVersion) ||
      SKILLS_PROFILE_CONTRACT_VERSION,

    creationType:
      SKILLS_PROFILE_CREATION_TYPE,

    header: {
      eyebrow:
        "Skills & Proficiencies Definition",
      title: "Skills Profile",
      description:
        "Author reusable Skill ranks, point costs, prerequisites, and grants. Actor ranks and unspent points remain isolated Story state.",
    },

    profile: {
      title: text(safeProfile.title),
      description:
        text(safeProfile.description),
      enabled:
        safeProfile.enabled !== false,
      defaultPointCost:
        number(safeProfile.defaultPointCost, 0),
      tags:
        array(safeProfile.tags)
          .map(text)
          .filter(Boolean),
    },

    validation: {
      state: validationState,
      valid:
        projectedErrors.length === 0,
      errors: projectedErrors,
      warnings: projectedWarnings,
      validMessage:
        "Skills Profile definitions are valid.",
    },

    skills: {
      title: "Skill Definitions",

      summary: {
        skillDefinitionCount:
          number(
            safeMetrics.skillDefinitionCount,
            skills.length
          ),
        enabledSkillDefinitionCount:
          number(
            safeMetrics.enabledSkillDefinitionCount,
            skills.filter(
              (skill) =>
                skill.identity.enabled
            ).length
          ),
        rankDefinitionCount:
          number(
            safeMetrics.rankDefinitionCount,
            skills.reduce(
              (total, skill) =>
                total +
                skill.progression.rankCount,
              0
            )
          ),
      },

      items: skills,
      maxCount:
        SKILLS_PROFILE_LIMITS.maxSkills,
      maxRanksPerSkill:
        SKILLS_PROFILE_LIMITS.maxRanksPerSkill,
      canAdd:
        skills.length <
        SKILLS_PROFILE_LIMITS.maxSkills,
      addLabel: "Add Skill",
      emptyState:
        "No Skill definitions are authored yet. Add a Skill or paste a complete profile through the JSON editor.",
    },

    limits: {
      maxSkills:
        SKILLS_PROFILE_LIMITS.maxSkills,
      maxRanksPerSkill:
        SKILLS_PROFILE_LIMITS.maxRanksPerSkill,
      maxRequiredUnlocks:
        SKILLS_PROFILE_LIMITS.maxRequiredUnlocks,
      maxRequiredSkills:
        SKILLS_PROFILE_LIMITS.maxRequiredSkills,
      maxTierIds:
        SKILLS_PROFILE_LIMITS.maxTierIds,
      maxTags:
        SKILLS_PROFILE_LIMITS.maxTags,
      maxPointCost:
        SKILLS_PROFILE_LIMITS.maxPointCost,
    },

    enumOptions: {
      unlockTypes:
        [...SKILLS_UNLOCK_TYPES],
    },

    structuredPrerequisiteAuthoring: {
      visualStatus:
        "JSON_EDITOR_ONLY_IN_CURRENT_V0_UI",
      helper:
        "Advancement-unlock and cross-skill prerequisites remain available through the complete JSON editor so their structured identities are preserved.",
    },

    jsonEditor: {
      open:
        jsonEditorOpen === true,
      actionLabel:
        "JSON Editor & AI Guide",
      visualStatus:
        "PENDING_FE_VISUAL_EXTENSION",
      helper:
        "The Chassis owns JSON validation/application behavior. The FE lane still needs the ruled JSON Editor & AI Guide presentation.",
    },

    visualExtensionStatus: {
      profileEditor:
        "PENDING_FE_VISUAL_BUILD",
      structuredPrerequisites:
        "PENDING_FE_VISUAL_EXTENSION",
      jsonEditor:
        "PENDING_FE_VISUAL_EXTENSION",
    },

    callbacks: {
      onUpdateProfileField:
        callbackSource.onUpdateProfileField || null,
      onAddSkill:
        callbackSource.onAddSkill || null,
      onRemoveSkill:
        callbackSource.onRemoveSkill || null,
      onUpdateSkillField:
        callbackSource.onUpdateSkillField || null,
      onUpdateRankField:
        callbackSource.onUpdateRankField || null,
      onOpenJsonEditor:
        callbackSource.onOpenJsonEditor || null,
    },

    architecture: {
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
    },
  };
}
