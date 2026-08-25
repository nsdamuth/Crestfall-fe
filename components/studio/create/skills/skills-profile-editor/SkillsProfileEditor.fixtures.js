import { createEmptySkillsProfile } from "./SkillsProfileEditor.contract";

export const skillsProfileEditorFixture = createEmptySkillsProfile();
export const skillsProfileEditorLockedFixture = {
  ...createEmptySkillsProfile(),
  title: "Veteran Skills",
  skillDefinitions: [
    {
      ...createEmptySkillsProfile().skillDefinitions[0],
      id: "skill.stealth",
      title: "Stealth",
      maximumRank: 2,
      rankDefinitions: [
        {
          ...createEmptySkillsProfile().skillDefinitions[0].rankDefinitions[0],
          rank: 1,
          title: "Trained",
          pointCost: 1,
        },
        {
          ...createEmptySkillsProfile().skillDefinitions[0].rankDefinitions[0],
          rank: 2,
          title: "Expert",
          pointCost: 2,
          prerequisites: {
            ...createEmptySkillsProfile().skillDefinitions[0].rankDefinitions[0].prerequisites,
            minimumLevel: 5,
            requiredTierIds: ["tier.veteran"],
          },
        },
      ],
    },
  ],
};
