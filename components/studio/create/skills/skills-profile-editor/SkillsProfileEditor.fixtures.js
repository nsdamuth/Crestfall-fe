import {
  createEmptySkillsProfile,
  normalizeSkillsProfileEditorValue,
} from "./SkillsProfileEditor.contract.js";

export const skillsProfileEditorFixture = Object.freeze({
  value: createEmptySkillsProfile(),
});

export const skillsProfileEditorFilledFixture = Object.freeze({
  value: normalizeSkillsProfileEditorValue({
    title: "Aethelgard Field Skills",
    description:
      "A filled Skills Profile covering rank ladders, point costs, tier and unlock prerequisites, cross-skill requirements, grants, tags, and metadata.",
    enabled: true,
    defaultPointCost: 2,
    skillDefinitions: [
      {
        id: "skill.focus",
        title: "Focus",
        description:
          "Maintains concentration under pressure and supports more advanced disciplines.",
        enabled: true,
        category: "MENTAL",
        startingRank: 1,
        maximumRank: 3,
        rankDefinitions: [
          {
            rank: 1,
            title: "Composed",
            description: "Basic concentration under ordinary pressure.",
            pointCost: 1,
            grants: {
              tags: ["focus.trained"],
              commandIds: ["command.steady"],
            },
          },
          {
            rank: 2,
            title: "Centered",
            description: "Sustain concentration during dangerous scenes.",
            pointCost: 2,
            prerequisites: {
              minimumLevel: 3,
              requiredTierIds: ["tier.adept"],
            },
            grants: {
              tags: ["focus.centered"],
              commandIds: ["command.hold_focus"],
            },
          },
          {
            rank: 3,
            title: "Unshaken",
            description: "Expert concentration against severe disruption.",
            pointCost: 4,
            prerequisites: {
              minimumLevel: 7,
              requiredTierIds: ["tier.veteran"],
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
        tags: ["mental", "discipline"],
        metadata: {
          fixturePurpose: "prerequisite_anchor",
        },
      },
      {
        id: "skill.arcana",
        title: "Arcana",
        description:
          "Practical understanding of magical theory, symbols, and controlled spellwork.",
        enabled: true,
        category: "KNOWLEDGE",
        startingRank: 0,
        maximumRank: 3,
        rankDefinitions: [
          {
            rank: 1,
            title: "Initiate",
            description: "Recognize common arcane structures and terminology.",
            pointCost: 2,
            grants: {
              tags: ["arcana.initiate"],
            },
          },
          {
            rank: 2,
            title: "Adept",
            description:
              "Apply arcane theory during active spell preparation.",
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
              "Interpret difficult magical systems and advanced workings.",
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
            },
            grants: {
              tags: ["arcana.scholar"],
              commandIds: ["command.decode_arcana"],
              metadata: {
                fixtureGrant: "advanced_arcane_analysis",
              },
            },
          },
        ],
        tags: ["knowledge", "arcane"],
        metadata: {
          fixturePurpose: "cross_skill_dependency",
        },
      },
      {
        id: "skill.athletics",
        title: "Athletics",
        description:
          "General physical conditioning, climbing, sprinting, and controlled movement.",
        enabled: true,
        category: "PHYSICAL",
        startingRank: 1,
        maximumRank: 2,
        rankDefinitions: [
          {
            rank: 1,
            title: "Trained",
            description: "Reliable movement and conditioning.",
            pointCost: 1,
            grants: {
              tags: ["athletics.trained"],
            },
          },
          {
            rank: 2,
            title: "Expert",
            description: "Advanced movement under difficult conditions.",
            pointCost: 3,
            prerequisites: {
              minimumLevel: 4,
              requiredUnlocks: [
                {
                  unlockType: "COMMAND",
                  unlockId: "command.guardian_step",
                  title: "Guardian Step",
                },
              ],
            },
            grants: {
              tags: ["athletics.expert"],
              commandIds: ["command.vault"],
            },
          },
        ],
        tags: ["physical", "movement"],
        metadata: {
          fixturePurpose: "independent_skill",
        },
      },
    ],
    tags: ["skills", "proficiencies", "fixture"],
    metadata: {
      fixtureVersion: "skills_profile_filled_v1",
    },
  }),
});
