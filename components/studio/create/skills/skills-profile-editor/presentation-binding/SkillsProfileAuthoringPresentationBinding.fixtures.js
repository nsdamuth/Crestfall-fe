export const skillsProfileAuthoringFilledProfileFixture =
  Object.freeze({
    contractVersion:
      "skills_profile_contract_v0",
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
    skillDefinitions: [
      {
        id: "skill.focus",
        title: "Focus",
        description:
          "Maintains concentration under pressure.",
        enabled: true,
        category: "MENTAL",
        startingRank: 1,
        maximumRank: 3,
        tags: [
          "mental",
          "discipline",
        ],
        rankDefinitions: [
          {
            rank: 1,
            title: "Composed",
            description:
              "Basic concentration under ordinary pressure.",
            pointCost: 1,
            prerequisites: {
              minimumLevel: 0,
              requiredTierIds: [],
              requiredSkills: [],
              requiredUnlocks: [],
            },
            grants: {
              tags: ["focus.trained"],
              commandIds: ["command.steady"],
            },
          },
          {
            rank: 2,
            title: "Centered",
            description:
              "Sustain concentration during dangerous scenes.",
            pointCost: 2,
            prerequisites: {
              minimumLevel: 3,
              requiredTierIds: ["tier.adept"],
              requiredSkills: [],
              requiredUnlocks: [],
            },
            grants: {
              tags: ["focus.centered"],
              commandIds: ["command.hold_focus"],
            },
          },
          {
            rank: 3,
            title: "Unshaken",
            description:
              "Expert concentration against severe disruption.",
            pointCost: 4,
            prerequisites: {
              minimumLevel: 7,
              requiredTierIds: ["tier.veteran"],
              requiredSkills: [],
              requiredUnlocks: [
                {
                  unlockType: "FEATURE",
                  unlockId: "feature.iron_will",
                  title: "Iron Will",
                },
              ],
            },
            grants: {
              tags: ["focus.unshaken"],
              commandIds: ["command.unshaken"],
            },
          },
        ],
      },
      {
        id: "skill.arcana",
        title: "Arcana",
        description:
          "Practical understanding of magical theory.",
        enabled: true,
        category: "KNOWLEDGE",
        startingRank: 0,
        maximumRank: 3,
        tags: ["knowledge", "arcane"],
        rankDefinitions: [
          {
            rank: 1,
            title: "Initiate",
            description:
              "Recognize common arcane structures.",
            pointCost: 2,
            prerequisites: {
              minimumLevel: 0,
              requiredTierIds: [],
              requiredSkills: [],
              requiredUnlocks: [],
            },
            grants: {
              tags: ["arcana.initiate"],
              commandIds: [],
            },
          },
          {
            rank: 2,
            title: "Adept",
            description:
              "Apply arcane theory during active preparation.",
            pointCost: 3,
            prerequisites: {
              minimumLevel: 5,
              requiredTierIds: ["tier.adept"],
              requiredSkills: [
                {
                  skillId: "skill.focus",
                  minimumRank: 1,
                },
              ],
              requiredUnlocks: [
                {
                  unlockType: "SPELL",
                  unlockId: "spell.arc_flare",
                  title: "Arc Flare",
                },
              ],
            },
            grants: {
              tags: ["arcana.adept"],
              commandIds: ["command.inspect_spell"],
            },
          },
          {
            rank: 3,
            title: "Scholar",
            description:
              "Interpret difficult magical systems.",
            pointCost: 5,
            prerequisites: {
              minimumLevel: 9,
              requiredTierIds: ["tier.veteran"],
              requiredSkills: [
                {
                  skillId: "skill.focus",
                  minimumRank: 2,
                },
              ],
              requiredUnlocks: [],
            },
            grants: {
              tags: ["arcana.scholar"],
              commandIds: ["command.decode_arcana"],
            },
          },
        ],
      },
      {
        id: "skill.athletics",
        title: "Athletics",
        description:
          "Physical conditioning and controlled movement.",
        enabled: false,
        category: "PHYSICAL",
        startingRank: 0,
        maximumRank: 2,
        tags: ["physical"],
        rankDefinitions: [
          {
            rank: 1,
            title: "Trained",
            pointCost: 1,
            prerequisites: {
              minimumLevel: 0,
              requiredTierIds: [],
              requiredSkills: [],
              requiredUnlocks: [],
            },
            grants: {
              tags: ["athletics.trained"],
              commandIds: [],
            },
          },
          {
            rank: 2,
            title: "Expert",
            pointCost: 3,
            prerequisites: {
              minimumLevel: 4,
              requiredTierIds: [],
              requiredSkills: [],
              requiredUnlocks: [],
            },
            grants: {
              tags: ["athletics.expert"],
              commandIds: ["command.vault"],
            },
          },
        ],
      },
    ],
  });

export const skillsProfileAuthoringValidFixture =
  Object.freeze({
    profile:
      skillsProfileAuthoringFilledProfileFixture,
    errors: [],
    warnings: [],
    metrics: {
      skillDefinitionCount: 3,
      enabledSkillDefinitionCount: 2,
      rankDefinitionCount: 8,
    },
    jsonEditorOpen: false,
  });

export const skillsProfileAuthoringWarningFixture =
  Object.freeze({
    profile:
      skillsProfileAuthoringFilledProfileFixture,
    errors: [],
    warnings: [
      {
        code:
          "SKILLS_PROFILE_FIXTURE_WARNING",
        path: "skillDefinitions[2]",
        message:
          "Athletics is currently disabled.",
        severity: "WARNING",
      },
    ],
    metrics: {
      skillDefinitionCount: 3,
      enabledSkillDefinitionCount: 2,
      rankDefinitionCount: 8,
    },
    jsonEditorOpen: false,
  });

export const skillsProfileAuthoringErrorFixture =
  Object.freeze({
    profile:
      skillsProfileAuthoringFilledProfileFixture,
    errors: [
      {
        code:
          "SKILLS_PROFILE_TITLE_REQUIRED",
        path: "title",
        message:
          "A Skills Profile title is required.",
        severity: "ERROR",
      },
    ],
    warnings: [],
    metrics: {
      skillDefinitionCount: 3,
      enabledSkillDefinitionCount: 2,
      rankDefinitionCount: 8,
    },
    jsonEditorOpen: false,
  });

export const skillsProfileAuthoringJsonOpenFixture =
  Object.freeze({
    ...skillsProfileAuthoringValidFixture,
    jsonEditorOpen: true,
  });

export const skillsProfileAuthoringEmptyFixture =
  Object.freeze({
    profile: {
      contractVersion:
        "skills_profile_contract_v0",
      title: "New Skills Profile",
      description: "",
      enabled: true,
      defaultPointCost: 1,
      tags: [],
      skillDefinitions: [],
    },
    errors: [],
    warnings: [
      {
        code: "SKILLS_PROFILE_EMPTY",
        path: "skillDefinitions",
        message:
          "An enabled Skills Profile has no enabled skills.",
        severity: "WARNING",
      },
    ],
    metrics: {
      skillDefinitionCount: 0,
      enabledSkillDefinitionCount: 0,
      rankDefinitionCount: 0,
    },
    jsonEditorOpen: false,
  });
