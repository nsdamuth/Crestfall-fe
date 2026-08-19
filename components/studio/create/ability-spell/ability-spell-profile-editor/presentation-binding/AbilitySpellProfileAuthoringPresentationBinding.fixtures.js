export const abilitySpellProfileAuthoringFilledProfileFixture =
  Object.freeze({
    contractVersion:
      "ability_spell_profile_contract_v0",
    title: "Arcane Vanguard",
    description:
      "A reusable combat and utility Ability/Spell definition set.",
    enabled: true,
    tags: [
      "abilities",
      "magic",
      "vanguard",
    ],
    abilityDefinitions: [
      {
        id: "spell.arc_flare",
        title: "Arc Flare",
        type: "SPELL",
        aliases: ["flare"],
        school: "EVOCATION",
        category: "OFFENSE",
        description:
          "Launches a short-range burst of arcane fire.",
        narrativeDescription:
          "A bright lance of blue-white flame.",
        enabled: true,
        tags: ["arcane", "fire"],
        prerequisites: {
          minimumLevel: 5,
          requiredTierIds: ["tier.adept"],
          requiredUnlocks: [
            {
              unlockType: "FEATURE",
              unlockId: "feature.arcane_training",
              title: "Arcane Training",
            },
          ],
          requiredSkills: [
            {
              skillId: "skill.arcana",
              minimumRank: 2,
            },
          ],
        },
        targetModel: {
          mode: "ACTOR_SINGLE",
          rangeClass: "MEDIUM",
          minimumTargets: 1,
          maximumTargets: 1,
          requiresLineOfSight: true,
        },
        restrictions: {
          requiredTags: [],
          forbiddenTags: ["injury"],
          notes:
            "Cannot be cast while the actor has an injury restriction.",
        },
        costs: [
          {
            id: "cost.mana",
            resourceType: "POOL",
            resourceId: "pool.mana",
            amount: 5,
            timing: "ON_USE",
          },
        ],
        operationReferences: [
          {
            id: "operation.damage",
            referenceVersion:
              "ability_spell_operation_reference_v1",
            domain: "STATS_POOLS",
            operation: "MUTATE_POOL",
            version:
              "actor_mechanics_profile.stats_pools.mutate_pool.v0",
            targetBinding: {
              bindingVersion:
                "ability_spell_operation_target_binding_v0",
              mode:
                "AUTHORIZED_ABILITY_TARGET",
            },
          },
        ],
        cooldownPolicy: {
          mode: "TURN_COUNT",
          amount: 2,
          unit: "TURN",
        },
        chargePolicy: {
          mode: "FIXED",
          maximumCharges: 3,
          resetPolicy: "REST",
        },
        masteryPolicy: {
          mode: "RANKED",
          maximumMastery: 5,
        },
      },
      {
        id: "ability.guardian_step",
        title: "Guardian Step",
        type: "TECHNIQUE",
        aliases: [],
        school: "GENERAL",
        category: "DEFENSE",
        description:
          "A defensive repositioning technique.",
        narrativeDescription:
          "The actor shifts into a guarded stance.",
        enabled: true,
        tags: ["defense"],
        prerequisites: {
          minimumLevel: 1,
          requiredTierIds: [],
          requiredUnlocks: [],
          requiredSkills: [],
        },
        targetModel: {
          mode: "SELF",
          rangeClass: "SELF",
          minimumTargets: 1,
          maximumTargets: 1,
          requiresLineOfSight: false,
        },
        restrictions: {
          requiredTags: [],
          forbiddenTags: [],
          notes: "",
        },
        costs: [],
        operationReferences: [],
        cooldownPolicy: {
          mode: "NONE",
          amount: 0,
          unit: "TURN",
        },
        chargePolicy: {
          mode: "UNLIMITED",
          maximumCharges: 0,
          resetPolicy: "NONE",
        },
        masteryPolicy: {
          mode: "NONE",
          maximumMastery: 0,
        },
      },
      {
        id: "passive.arcane_sense",
        title: "Arcane Sense",
        type: "PASSIVE",
        aliases: [],
        school: "DIVINATION",
        category: "UTILITY",
        description:
          "Improves recognition of nearby arcane phenomena.",
        narrativeDescription: "",
        enabled: false,
        tags: ["utility"],
        prerequisites: {
          minimumLevel: 0,
          requiredTierIds: [],
          requiredUnlocks: [],
          requiredSkills: [],
        },
        targetModel: {
          mode: "NONE",
          rangeClass: "SELF",
          minimumTargets: 0,
          maximumTargets: 0,
          requiresLineOfSight: false,
        },
        restrictions: {
          requiredTags: [],
          forbiddenTags: [],
          notes: "",
        },
        costs: [],
        operationReferences: [],
        cooldownPolicy: {
          mode: "NONE",
          amount: 0,
          unit: "TURN",
        },
        chargePolicy: {
          mode: "UNLIMITED",
          maximumCharges: 0,
          resetPolicy: "NONE",
        },
        masteryPolicy: {
          mode: "NONE",
          maximumMastery: 0,
        },
      },
    ],
  });

export const abilitySpellProfileAuthoringFilledValidationFixture =
  Object.freeze({
    errors: [],
    warnings: [
      {
        code:
          "ABILITY_SPELL_PROFILE_FIXTURE_WARNING",
        path: "abilityDefinitions[2]",
        message:
          "Arcane Sense is currently disabled.",
        severity: "WARNING",
      },
    ],
    metrics: {
      definitionCount: 3,
      enabledDefinitionCount: 2,
      spellCount: 1,
      abilityCount: 0,
      techniqueCount: 1,
      passiveCount: 1,
    },
  });

export const abilitySpellProfileAuthoringValidFixture =
  Object.freeze({
    profile:
      abilitySpellProfileAuthoringFilledProfileFixture,
    errors: [],
    warnings: [],
    metrics:
      abilitySpellProfileAuthoringFilledValidationFixture.metrics,
    jsonEditorOpen: false,
  });

export const abilitySpellProfileAuthoringWarningFixture =
  Object.freeze({
    profile:
      abilitySpellProfileAuthoringFilledProfileFixture,
    ...abilitySpellProfileAuthoringFilledValidationFixture,
    jsonEditorOpen: false,
  });

export const abilitySpellProfileAuthoringErrorFixture =
  Object.freeze({
    profile:
      abilitySpellProfileAuthoringFilledProfileFixture,
    errors: [
      {
        code:
          "ABILITY_SPELL_TARGET_RANGE_INVALID",
        path:
          "abilityDefinitions[0].targetModel.maximumTargets",
        message:
          "maximumTargets cannot be lower than minimumTargets.",
        severity: "ERROR",
      },
    ],
    warnings: [],
    metrics:
      abilitySpellProfileAuthoringFilledValidationFixture.metrics,
    jsonEditorOpen: false,
  });

export const abilitySpellProfileAuthoringJsonOpenFixture =
  Object.freeze({
    ...abilitySpellProfileAuthoringValidFixture,
    jsonEditorOpen: true,
  });

export const abilitySpellProfileAuthoringEmptyFixture =
  Object.freeze({
    profile: {
      contractVersion:
        "ability_spell_profile_contract_v0",
      title:
        "New Ability & Spell Profile",
      description: "",
      enabled: true,
      tags: [],
      abilityDefinitions: [],
    },
    errors: [],
    warnings: [
      {
        code: "ABILITY_SPELL_PROFILE_EMPTY",
        path: "abilityDefinitions",
        message:
          "An enabled Ability & Spell Profile has no enabled definitions.",
        severity: "WARNING",
      },
    ],
    metrics: {
      definitionCount: 0,
      enabledDefinitionCount: 0,
      spellCount: 0,
      abilityCount: 0,
      techniqueCount: 0,
      passiveCount: 0,
    },
    jsonEditorOpen: false,
  });
