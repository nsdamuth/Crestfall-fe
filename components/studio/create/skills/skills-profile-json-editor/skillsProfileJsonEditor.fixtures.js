import { normalizeSkillsProfileEditorValue } from "../skills-profile-editor/SkillsProfileEditor.contract.js";

export const skillsProfileJsonEditorProfileFixture = Object.freeze(
  normalizeSkillsProfileEditorValue({
    title: "Adventurer Skills",
    description:
      "Reusable combat, utility, and social Skill definitions for adventuring actors.",
    enabled: true,
    defaultPointCost: 1,
    skillDefinitions: [
      {
        id: "skill.swordsmanship",
        title: "Swordsmanship",
        description: "Training with one-handed and two-handed swords.",
        enabled: true,
        category: "COMBAT",
        startingRank: 0,
        maximumRank: 3,
        rankDefinitions: [
          {
            rank: 1,
            title: "Novice",
            description: "Basic stance, guard, and controlled strikes.",
            pointCost: 1,
            prerequisites: { minimumLevel: 1 },
            grants: { tags: ["swordsmanship.novice"] },
          },
          {
            rank: 2,
            title: "Adept",
            description: "Reliable combinations and defensive counters.",
            pointCost: 2,
            prerequisites: { minimumLevel: 2 },
            grants: { tags: ["swordsmanship.adept"] },
          },
          {
            rank: 3,
            title: "Master",
            description: "Exceptional control, timing, and precision.",
            pointCost: 3,
            prerequisites: { minimumLevel: 5 },
            grants: { tags: ["swordsmanship.master"] },
          },
        ],
        tags: ["combat", "weapon"],
        metadata: {},
      },
    ],
    tags: ["adventurer"],
    metadata: {},
  })
);
