export const SKILLS_PROFILE_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-skills-profile-json-ai-authoring-guide.md";
export const SKILLS_PROFILE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

export function buildSkillsProfileJsonAiAuthoringGuide(profile) {
  return `# Crestfall Skills Profile JSON AI Authoring Guide

Guide contract: skills_json_ai_authoring_guide_v0
Profile contract: skills_profile_contract_v0
Skill contract: skills_skill_definition_v0
Rank contract: skills_rank_definition_v0
Prerequisite contract: skills_prerequisite_v0

## Task
Modify the complete current Skills Profile JSON at the end of this guide. Return one complete JSON object only. Do not return Markdown fences, commentary, patches, or partial fragments.

## Non-negotiable boundaries
- Preserve existing content outside the requested changes.
- Preserve existing skill IDs unless explicitly asked to rename or remove them.
- IDs use lowercase letters, numbers, dots, colons, underscores, or hyphens.
- Keep all contract and definition version values unchanged.
- The asset owns reusable definitions only.
- Do not add actor ranks, current proficiencies, unspent points, owner IDs, participant IDs, namespaces, revisions, reward history, or mutation instructions.
- Each skill must include one rank definition for every integer rank from 1 through maximumRank.
- startingRank must be between 0 and maximumRank.
- requiredUnlocks is an array of objects, never an array of strings.
- Every requiredUnlocks entry must include at least unlockId or referenceId.
- Supported unlockType values: ABILITY, SPELL, SKILL, FEATURE, PASSIVE, COMMAND, EQUIPMENT_ACCESS, ITEM_ACCESS, TITLE, CUSTOM.
- requiredSkills is an array of objects, never an array of skill-ID strings.
- Every requiredSkills entry must include skillId and minimumRank.
- Required skills must reference another enabled skill in the same profile and cannot self-reference.
- Maximum skills: 96. Maximum ranks per skill: 20.

## Prerequisite object shapes

### Required unlock object
Use objects like this inside requiredUnlocks:

{
  "unlockType": "FEATURE",
  "unlockId": "skill.slot.1",
  "referenceType": "SKILL_SLOT",
  "referenceId": "skill-slot-1",
  "title": "Skill Slot I",
  "metadata": {}
}

Minimal valid identity:

{
  "unlockId": "skill.slot.1"
}

Do not write:

"requiredUnlocks": ["skill.slot.1"]

### Required skill object
Use objects like this inside requiredSkills:

{
  "skillId": "skill.athletics",
  "minimumRank": 2,
  "metadata": {}
}

Do not write:

"requiredSkills": ["skill.athletics"]

## Complete shape
{
  "contractVersion": "skills_profile_contract_v0",
  "title": "Profile title",
  "description": "Definition purpose",
  "enabled": true,
  "defaultPointCost": 1,
  "skillDefinitions": [
    {
      "definitionVersion": "skills_skill_definition_v0",
      "id": "skill.example",
      "title": "Example Skill",
      "description": "",
      "enabled": true,
      "category": "GENERAL",
      "startingRank": 0,
      "maximumRank": 2,
      "rankDefinitions": [
        {
          "definitionVersion": "skills_rank_definition_v0",
          "rank": 1,
          "title": "Trained",
          "description": "",
          "pointCost": 1,
          "prerequisites": {
            "prerequisiteVersion": "skills_prerequisite_v0",
            "minimumLevel": 0,
            "requiredTierIds": [],
            "requiredUnlocks": [],
            "requiredSkills": [],
            "metadata": {}
          },
          "grants": {
            "tags": [],
            "commandIds": [],
            "metadata": {}
          },
          "metadata": {}
        },
        {
          "definitionVersion": "skills_rank_definition_v0",
          "rank": 2,
          "title": "Adept",
          "description": "",
          "pointCost": 2,
          "prerequisites": {
            "prerequisiteVersion": "skills_prerequisite_v0",
            "minimumLevel": 3,
            "requiredTierIds": ["veteran"],
            "requiredUnlocks": [
              {
                "unlockType": "FEATURE",
                "unlockId": "skill.slot.1",
                "referenceType": "SKILL_SLOT",
                "referenceId": "skill-slot-1",
                "title": "Skill Slot I",
                "metadata": {}
              }
            ],
            "requiredSkills": [
              {
                "skillId": "skill.supporting-example",
                "minimumRank": 1,
                "metadata": {}
              }
            ],
            "metadata": {}
          },
          "grants": {
            "tags": [],
            "commandIds": [],
            "metadata": {}
          },
          "metadata": {}
        }
      ],
      "tags": [],
      "metadata": {}
    },
    {
      "definitionVersion": "skills_skill_definition_v0",
      "id": "skill.supporting-example",
      "title": "Supporting Example",
      "description": "Enabled because another skill references it as a prerequisite.",
      "enabled": true,
      "category": "GENERAL",
      "startingRank": 0,
      "maximumRank": 1,
      "rankDefinitions": [
        {
          "definitionVersion": "skills_rank_definition_v0",
          "rank": 1,
          "title": "Trained",
          "description": "",
          "pointCost": 1,
          "prerequisites": {
            "prerequisiteVersion": "skills_prerequisite_v0",
            "minimumLevel": 0,
            "requiredTierIds": [],
            "requiredUnlocks": [],
            "requiredSkills": [],
            "metadata": {}
          },
          "grants": {
            "tags": [],
            "commandIds": [],
            "metadata": {}
          },
          "metadata": {}
        }
      ],
      "tags": [],
      "metadata": {}
    }
  ],
  "tags": [],
  "metadata": {}
}

## Current Skills Profile JSON
${JSON.stringify(profile, null, 2)}
`;
}
