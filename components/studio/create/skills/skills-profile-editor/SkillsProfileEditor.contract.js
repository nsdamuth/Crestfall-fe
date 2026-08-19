export const SKILLS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";
export const SKILLS_PROFILE_CONTRACT_VERSION = "skills_profile_contract_v0";
export const SKILLS_SKILL_DEFINITION_VERSION = "skills_skill_definition_v0";
export const SKILLS_RANK_DEFINITION_VERSION = "skills_rank_definition_v0";
export const SKILLS_PREREQUISITE_VERSION = "skills_prerequisite_v0";

export const SKILLS_PROFILE_LIMITS = Object.freeze({
  maxSkills: 96,
  maxRanksPerSkill: 20,
  maxRequiredUnlocks: 32,
  maxRequiredSkills: 32,
  maxTierIds: 24,
  maxTags: 24,
  maxIdentifierLength: 96,
  maxTitleLength: 160,
  maxDescriptionLength: 2400,
  maxPointCost: 1000000,
});

export const SKILLS_UNLOCK_TYPES = Object.freeze([
  "ABILITY",
  "SPELL",
  "SKILL",
  "FEATURE",
  "PASSIVE",
  "COMMAND",
  "EQUIPMENT_ACCESS",
  "ITEM_ACCESS",
  "TITLE",
  "CUSTOM",
]);

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeIdentifier(value, fallback = "") {
  return normalizeString(value).toLowerCase() || fallback;
}

function normalizeInteger(value, fallback = 0, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function uniqueStrings(values, { lowercase = true, limit = SKILLS_PROFILE_LIMITS.maxTags } = {}) {
  const source = Array.isArray(values)
    ? values
    : typeof values === "string"
      ? values.split(",")
      : [];
  const seen = new Set();
  const result = [];

  source.forEach((value) => {
    const raw = normalizeString(value);
    const candidate = lowercase ? raw.toLowerCase() : raw;
    if (!candidate || seen.has(candidate) || result.length >= limit) return;
    seen.add(candidate);
    result.push(candidate);
  });

  return result;
}

export function normalizeSkillsUnlockRequirement(value = {}, index = 0) {
  const source = normalizeObject(value);
  const requestedType = normalizeString(source.unlockType || source.type).toUpperCase();

  return {
    unlockType: SKILLS_UNLOCK_TYPES.includes(requestedType)
      ? requestedType
      : requestedType || null,
    unlockId: normalizeIdentifier(source.unlockId || source.id) || null,
    referenceType: normalizeString(source.referenceType).toUpperCase() || null,
    referenceId: normalizeString(source.referenceId) || null,
    title: normalizeString(source.title) || `Unlock ${index + 1}`,
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeSkillsSkillRequirement(value = {}, index = 0) {
  const source = normalizeObject(value);
  return {
    skillId: normalizeIdentifier(source.skillId || source.id, `skill.${index + 1}`),
    minimumRank: normalizeInteger(
      source.minimumRank ?? source.rank,
      1,
      0,
      SKILLS_PROFILE_LIMITS.maxRanksPerSkill
    ),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeSkillsPrerequisites(value = {}) {
  const source = normalizeObject(value);
  return {
    prerequisiteVersion:
      normalizeString(source.prerequisiteVersion) || SKILLS_PREREQUISITE_VERSION,
    minimumLevel: normalizeInteger(source.minimumLevel, 0, 0),
    requiredTierIds: uniqueStrings(source.requiredTierIds, {
      limit: SKILLS_PROFILE_LIMITS.maxTierIds,
    }),
    requiredUnlocks: normalizeArray(source.requiredUnlocks)
      .slice(0, SKILLS_PROFILE_LIMITS.maxRequiredUnlocks)
      .map(normalizeSkillsUnlockRequirement),
    requiredSkills: normalizeArray(source.requiredSkills)
      .slice(0, SKILLS_PROFILE_LIMITS.maxRequiredSkills)
      .map(normalizeSkillsSkillRequirement),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeSkillsRankDefinition(value = {}, index = 0, defaultPointCost = 1) {
  const source = normalizeObject(value);
  const rank = normalizeInteger(
    source.rank,
    index + 1,
    1,
    SKILLS_PROFILE_LIMITS.maxRanksPerSkill
  );

  return {
    definitionVersion:
      normalizeString(source.definitionVersion) || SKILLS_RANK_DEFINITION_VERSION,
    rank,
    title: normalizeString(source.title) || `Rank ${rank}`,
    description: normalizeString(source.description),
    pointCost: normalizeInteger(
      source.pointCost,
      defaultPointCost,
      0,
      SKILLS_PROFILE_LIMITS.maxPointCost
    ),
    prerequisites: normalizeSkillsPrerequisites(source.prerequisites),
    grants: {
      tags: uniqueStrings(normalizeObject(source.grants).tags),
      commandIds: uniqueStrings(normalizeObject(source.grants).commandIds),
      metadata: normalizeObject(normalizeObject(source.grants).metadata),
    },
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeSkillsSkillDefinition(value = {}, index = 0, defaultPointCost = 1) {
  const source = normalizeObject(value);
  const sourceRanks = normalizeArray(source.rankDefinitions)
    .slice(0, SKILLS_PROFILE_LIMITS.maxRanksPerSkill)
    .map((rank, rankIndex) =>
      normalizeSkillsRankDefinition(rank, rankIndex, defaultPointCost)
    )
    .sort((left, right) => left.rank - right.rank);
  const maximumRank = normalizeInteger(
    source.maximumRank,
    sourceRanks.length || 1,
    1,
    SKILLS_PROFILE_LIMITS.maxRanksPerSkill
  );
  const rankByNumber = new Map(sourceRanks.map((rank) => [rank.rank, rank]));
  const rankDefinitions = Array.from({ length: maximumRank }, (_, rankIndex) =>
    rankByNumber.get(rankIndex + 1) ||
    normalizeSkillsRankDefinition(
      { rank: rankIndex + 1, pointCost: defaultPointCost },
      rankIndex,
      defaultPointCost
    )
  );

  return {
    definitionVersion:
      normalizeString(source.definitionVersion) || SKILLS_SKILL_DEFINITION_VERSION,
    id: normalizeIdentifier(source.id, `skill.${index + 1}`),
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    category: normalizeString(source.category).toUpperCase() || "GENERAL",
    startingRank: normalizeInteger(source.startingRank, 0, 0, maximumRank),
    maximumRank,
    rankDefinitions,
    tags: uniqueStrings(source.tags),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeSkillsProfileEditorValue(value = {}) {
  const source = normalizeObject(value);
  const defaultPointCost = normalizeInteger(
    source.defaultPointCost,
    1,
    0,
    SKILLS_PROFILE_LIMITS.maxPointCost
  );

  return {
    contractVersion:
      normalizeString(source.contractVersion) || SKILLS_PROFILE_CONTRACT_VERSION,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    defaultPointCost,
    skillDefinitions: normalizeArray(source.skillDefinitions)
      .slice(0, SKILLS_PROFILE_LIMITS.maxSkills)
      .map((skill, index) =>
        normalizeSkillsSkillDefinition(skill, index, defaultPointCost)
      ),
    tags: uniqueStrings(source.tags),
    metadata: normalizeObject(source.metadata),
  };
}

function createIssue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function validateSkillsProfileEditorValue(value = {}) {
  const raw = normalizeObject(value);
  const normalized = normalizeSkillsProfileEditorValue(value);
  const issues = [];

  if (normalized.contractVersion !== SKILLS_PROFILE_CONTRACT_VERSION) {
    issues.push(
      createIssue(
        "SKILLS_PROFILE_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${SKILLS_PROFILE_CONTRACT_VERSION}.`
      )
    );
  }

  if (!normalized.title) {
    issues.push(
      createIssue("SKILLS_PROFILE_TITLE_REQUIRED", "title", "A Skills Profile title is required.")
    );
  } else if (normalized.title.length > SKILLS_PROFILE_LIMITS.maxTitleLength) {
    issues.push(
      createIssue(
        "SKILLS_PROFILE_TITLE_TOO_LONG",
        "title",
        `Title must not exceed ${SKILLS_PROFILE_LIMITS.maxTitleLength} characters.`
      )
    );
  }

  if (normalized.description.length > SKILLS_PROFILE_LIMITS.maxDescriptionLength) {
    issues.push(
      createIssue(
        "SKILLS_PROFILE_DESCRIPTION_TOO_LONG",
        "description",
        `Description must not exceed ${SKILLS_PROFILE_LIMITS.maxDescriptionLength} characters.`
      )
    );
  }

  if (normalizeArray(raw.skillDefinitions).length > SKILLS_PROFILE_LIMITS.maxSkills) {
    issues.push(
      createIssue(
        "SKILLS_PROFILE_SKILL_LIMIT_EXCEEDED",
        "skillDefinitions",
        `At most ${SKILLS_PROFILE_LIMITS.maxSkills} skills are supported.`
      )
    );
  }

  const skillIds = new Set();
  const enabledSkillIds = new Set(
    normalized.skillDefinitions.filter((skill) => skill.enabled).map((skill) => skill.id)
  );

  normalized.skillDefinitions.forEach((skill, skillIndex) => {
    const path = `skillDefinitions[${skillIndex}]`;

    if (skill.definitionVersion !== SKILLS_SKILL_DEFINITION_VERSION) {
      issues.push(
        createIssue(
          "SKILLS_SKILL_DEFINITION_VERSION_UNSUPPORTED",
          `${path}.definitionVersion`,
          `Expected ${SKILLS_SKILL_DEFINITION_VERSION}.`
        )
      );
    }

    if (!IDENTIFIER_PATTERN.test(skill.id)) {
      issues.push(
        createIssue(
          "SKILLS_SKILL_ID_INVALID",
          `${path}.id`,
          "Skill IDs must use lowercase letters, numbers, dots, colons, underscores, or hyphens."
        )
      );
    }

    if (skill.id.length > SKILLS_PROFILE_LIMITS.maxIdentifierLength) {
      issues.push(
        createIssue(
          "SKILLS_SKILL_ID_TOO_LONG",
          `${path}.id`,
          `Skill IDs must not exceed ${SKILLS_PROFILE_LIMITS.maxIdentifierLength} characters.`
        )
      );
    }

    if (skillIds.has(skill.id)) {
      issues.push(
        createIssue(
          "SKILLS_SKILL_ID_DUPLICATE",
          `${path}.id`,
          `Duplicate skill ID '${skill.id}'.`
        )
      );
    }
    skillIds.add(skill.id);

    if (!skill.title) {
      issues.push(
        createIssue(
          "SKILLS_SKILL_TITLE_REQUIRED",
          `${path}.title`,
          "Every skill requires a title."
        )
      );
    }

    if (skill.rankDefinitions.length !== skill.maximumRank) {
      issues.push(
        createIssue(
          "SKILLS_RANK_DEFINITION_MISSING",
          `${path}.rankDefinitions`,
          `Skill '${skill.id}' requires one rank definition for every rank through ${skill.maximumRank}.`
        )
      );
    }

    const seenRanks = new Set();
    skill.rankDefinitions.forEach((rank, rankIndex) => {
      const rankPath = `${path}.rankDefinitions[${rankIndex}]`;

      if (rank.definitionVersion !== SKILLS_RANK_DEFINITION_VERSION) {
        issues.push(
          createIssue(
            "SKILLS_RANK_DEFINITION_VERSION_UNSUPPORTED",
            `${rankPath}.definitionVersion`,
            `Expected ${SKILLS_RANK_DEFINITION_VERSION}.`
          )
        );
      }

      if (seenRanks.has(rank.rank)) {
        issues.push(
          createIssue(
            "SKILLS_RANK_NUMBER_DUPLICATE",
            `${rankPath}.rank`,
            `Duplicate rank ${rank.rank} for '${skill.id}'.`
          )
        );
      }
      seenRanks.add(rank.rank);

      if (rank.prerequisites.prerequisiteVersion !== SKILLS_PREREQUISITE_VERSION) {
        issues.push(
          createIssue(
            "SKILLS_PREREQUISITE_VERSION_UNSUPPORTED",
            `${rankPath}.prerequisites.prerequisiteVersion`,
            `Expected ${SKILLS_PREREQUISITE_VERSION}.`
          )
        );
      }

      rank.prerequisites.requiredUnlocks.forEach((unlock, unlockIndex) => {
        const unlockPath = `${rankPath}.prerequisites.requiredUnlocks[${unlockIndex}]`;
        if (unlock.unlockType && !SKILLS_UNLOCK_TYPES.includes(unlock.unlockType)) {
          issues.push(
            createIssue(
              "SKILLS_REQUIRED_UNLOCK_TYPE_INVALID",
              `${unlockPath}.unlockType`,
              `Unsupported unlock type '${unlock.unlockType}'.`
            )
          );
        }
        if (!unlock.unlockId && !unlock.referenceId) {
          issues.push(
            createIssue(
              "SKILLS_REQUIRED_UNLOCK_IDENTITY_REQUIRED",
              unlockPath,
              "A required unlock needs an unlockId or referenceId."
            )
          );
        }
      });

      rank.prerequisites.requiredSkills.forEach((requirement, requirementIndex) => {
        const requirementPath = `${rankPath}.prerequisites.requiredSkills[${requirementIndex}]`;
        if (!IDENTIFIER_PATTERN.test(requirement.skillId)) {
          issues.push(
            createIssue(
              "SKILLS_REQUIRED_SKILL_ID_INVALID",
              `${requirementPath}.skillId`,
              "Required-skill IDs must use the standard identifier format."
            )
          );
        }
        if (requirement.skillId === skill.id) {
          issues.push(
            createIssue(
              "SKILLS_REQUIRED_SKILL_SELF_REFERENCE",
              `${requirementPath}.skillId`,
              "A skill cannot require itself as a separate prerequisite."
            )
          );
        }
      });
    });
  });

  normalized.skillDefinitions.forEach((skill, skillIndex) => {
    skill.rankDefinitions.forEach((rank, rankIndex) => {
      rank.prerequisites.requiredSkills.forEach((requirement, requirementIndex) => {
        if (!enabledSkillIds.has(requirement.skillId)) {
          issues.push(
            createIssue(
              "SKILLS_REQUIRED_SKILL_NOT_FOUND",
              `skillDefinitions[${skillIndex}].rankDefinitions[${rankIndex}].prerequisites.requiredSkills[${requirementIndex}].skillId`,
              `Required skill '${requirement.skillId}' is not an enabled skill in this profile.`
            )
          );
        }
      });
    });
  });

  if (normalized.enabled && !enabledSkillIds.size) {
    issues.push(
      createIssue(
        "SKILLS_PROFILE_EMPTY",
        "skillDefinitions",
        "An enabled Skills Profile has no enabled skills.",
        "WARNING"
      )
    );
  }

  const errors = issues.filter((issue) => issue.severity !== "WARNING");
  const warnings = issues.filter((issue) => issue.severity === "WARNING");

  return {
    valid: errors.length === 0,
    normalized,
    issues,
    errors,
    warnings,
    metrics: {
      skillDefinitionCount: normalized.skillDefinitions.length,
      enabledSkillDefinitionCount: enabledSkillIds.size,
      rankDefinitionCount: normalized.skillDefinitions.reduce(
        (total, skill) => total + skill.rankDefinitions.length,
        0
      ),
    },
  };
}

export function createEmptySkillsProfile() {
  return normalizeSkillsProfileEditorValue({
    title: "New Skills Profile",
    description: "Reusable deterministic Skills and Proficiencies definitions.",
    enabled: true,
    defaultPointCost: 1,
    skillDefinitions: [
      {
        id: "skill.example",
        title: "Example Skill",
        description: "Replace this starter with an authored proficiency.",
        enabled: true,
        category: "GENERAL",
        startingRank: 0,
        maximumRank: 1,
        rankDefinitions: [{ rank: 1, title: "Trained", pointCost: 1 }],
        tags: ["starter"],
      },
    ],
    tags: ["skills"],
  });
}
