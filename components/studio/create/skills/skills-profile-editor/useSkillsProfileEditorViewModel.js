"use client";

import { useMemo, useState } from "react";

import {
  SKILLS_PROFILE_LIMITS,
  normalizeSkillsProfileEditorValue,
  normalizeSkillsRankDefinition,
  normalizeSkillsSkillDefinition,
  validateSkillsProfileEditorValue,
} from "./SkillsProfileEditor.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toInteger(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

export function useSkillsProfileEditorViewModel({ value = {}, onChange = null } = {}) {
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const profile = useMemo(() => normalizeSkillsProfileEditorValue(value), [value]);
  const validation = useMemo(
    () => validateSkillsProfileEditorValue(profile),
    [profile]
  );

  function commit(nextProfile) {
    onChange?.(normalizeSkillsProfileEditorValue(nextProfile));
  }

  function updateProfileField(field, nextValue) {
    const valueByField = {
      tags: parseList(nextValue),
      defaultPointCost: Math.max(
        0,
        Math.min(
          SKILLS_PROFILE_LIMITS.maxPointCost,
          toInteger(nextValue, profile.defaultPointCost)
        )
      ),
    };
    commit({
      ...profile,
      [field]: Object.hasOwn(valueByField, field)
        ? valueByField[field]
        : nextValue,
    });
  }

  function addSkill() {
    const nextIndex = profile.skillDefinitions.length;
    if (nextIndex >= SKILLS_PROFILE_LIMITS.maxSkills) return;
    const nextSkill = normalizeSkillsSkillDefinition(
      {
        id: `skill.${nextIndex + 1}`,
        title: `Skill ${nextIndex + 1}`,
        enabled: true,
        category: "GENERAL",
        startingRank: 0,
        maximumRank: 1,
        rankDefinitions: [
          {
            rank: 1,
            title: "Trained",
            pointCost: profile.defaultPointCost,
          },
        ],
      },
      nextIndex,
      profile.defaultPointCost
    );
    commit({
      ...profile,
      skillDefinitions: [...profile.skillDefinitions, nextSkill],
    });
  }

  function removeSkill(skillIndex) {
    commit({
      ...profile,
      skillDefinitions: profile.skillDefinitions.filter(
        (_skill, index) => index !== skillIndex
      ),
    });
  }

  function updateSkillField(skillIndex, field, nextValue) {
    const skills = profile.skillDefinitions.map((skill, index) => {
      if (index !== skillIndex) return skill;

      if (field === "maximumRank") {
        const maximumRank = Math.max(
          1,
          Math.min(
            SKILLS_PROFILE_LIMITS.maxRanksPerSkill,
            toInteger(nextValue, skill.maximumRank)
          )
        );
        const rankByNumber = new Map(
          skill.rankDefinitions.map((rank) => [rank.rank, rank])
        );
        const rankDefinitions = Array.from({ length: maximumRank }, (_, rankIndex) =>
          rankByNumber.get(rankIndex + 1) ||
          normalizeSkillsRankDefinition(
            {
              rank: rankIndex + 1,
              title: `Rank ${rankIndex + 1}`,
              pointCost: profile.defaultPointCost,
            },
            rankIndex,
            profile.defaultPointCost
          )
        );
        return {
          ...skill,
          maximumRank,
          startingRank: Math.min(skill.startingRank, maximumRank),
          rankDefinitions,
        };
      }

      const valueByField = {
        id: normalizeString(nextValue).toLowerCase(),
        category: normalizeString(nextValue).toUpperCase(),
        startingRank: Math.max(
          0,
          Math.min(skill.maximumRank, toInteger(nextValue, skill.startingRank))
        ),
        tags: parseList(nextValue),
      };

      return {
        ...skill,
        [field]: Object.hasOwn(valueByField, field)
          ? valueByField[field]
          : nextValue,
      };
    });

    commit({ ...profile, skillDefinitions: skills });
  }

  function updateRankField(skillIndex, rankIndex, field, nextValue) {
    const skills = profile.skillDefinitions.map((skill, index) => {
      if (index !== skillIndex) return skill;
      const rankDefinitions = skill.rankDefinitions.map((rank, indexValue) => {
        if (indexValue !== rankIndex) return rank;

        if (field === "minimumLevel") {
          return {
            ...rank,
            prerequisites: {
              ...rank.prerequisites,
              minimumLevel: Math.max(0, toInteger(nextValue, 0)),
            },
          };
        }
        if (field === "requiredTierIds") {
          return {
            ...rank,
            prerequisites: {
              ...rank.prerequisites,
              requiredTierIds: parseList(nextValue).map((entry) =>
                entry.toLowerCase()
              ),
            },
          };
        }
        if (field === "grantTags" || field === "commandIds") {
          return {
            ...rank,
            grants: {
              ...rank.grants,
              [field === "grantTags" ? "tags" : "commandIds"]:
                parseList(nextValue).map((entry) => entry.toLowerCase()),
            },
          };
        }

        return {
          ...rank,
          [field]: field === "pointCost"
            ? Math.max(
                0,
                Math.min(
                  SKILLS_PROFILE_LIMITS.maxPointCost,
                  toInteger(nextValue, rank.pointCost)
                )
              )
            : nextValue,
        };
      });
      return { ...skill, rankDefinitions };
    });

    commit({ ...profile, skillDefinitions: skills });
  }

  function applyJsonProfile(nextProfile) {
    commit(nextProfile);
    setJsonEditorOpen(false);
  }

  return {
    viewProps: {
      profile,
      errors: validation.errors,
      warnings: validation.warnings,
      metrics: validation.metrics,
      onUpdateProfileField: updateProfileField,
      onAddSkill: addSkill,
      onRemoveSkill: removeSkill,
      onUpdateSkillField: updateSkillField,
      onUpdateRankField: updateRankField,
      onOpenJsonEditor: () => setJsonEditorOpen(true),
    },
    jsonEditorProps: jsonEditorOpen
      ? {
          value: profile,
          onApply: applyJsonProfile,
          onClose: () => setJsonEditorOpen(false),
        }
      : null,
  };
}
