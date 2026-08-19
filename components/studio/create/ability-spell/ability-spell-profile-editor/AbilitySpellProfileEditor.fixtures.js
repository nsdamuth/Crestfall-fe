import {
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
  ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
  createEmptyAbilitySpellProfile,
  normalizeAbilitySpellProfileEditorValue,
} from "./AbilitySpellProfileEditor.contract.js";

export const abilitySpellProfileEditorFixture = Object.freeze({
  value: createEmptyAbilitySpellProfile(),
});

export const abilitySpellProfileEditorFilledFixture = Object.freeze({
  value: normalizeAbilitySpellProfileEditorValue({
    title: "Arcane Vanguard",
    description:
      "A filled Ability and Spell profile covering resource costs, prerequisites, targeting, typed operations, cooldowns, charges, mastery, and passive definitions.",
    enabled: true,
    abilityDefinitions: [
      {
        id: "spell.arc_flare",
        title: "Arc Flare",
        aliases: ["Flare"],
        type: "SPELL",
        school: "ARCANE",
        category: "OFFENSE",
        description:
          "Launch a focused arcane flare at one visible target in medium range.",
        narrativeDescription:
          "A compact knot of blue-white fire snaps from the caster's hand toward the chosen target.",
        enabled: true,
        prerequisites: {
          minimumLevel: 5,
          requiredTierIds: ["tier.adept"],
          requiredUnlocks: [
            {
              unlockType: "FEATURE",
              unlockId: "feature.arcane_focus",
              title: "Arcane Focus",
            },
          ],
          requiredSkills: [
            {
              skillId: "skill.arcana",
              minimumRank: 2,
            },
          ],
        },
        costs: [
          {
            id: "cost.arc_flare_mana",
            resourceType: "POOL",
            resourceId: "pool.mana",
            amount: 5,
            timing: "ON_USE",
          },
        ],
        targetModel: {
          mode: "ACTOR_SINGLE",
          minimumTargets: 1,
          maximumTargets: 1,
          rangeClass: "MEDIUM",
          requiresLineOfSight: true,
        },
        restrictions: {
          requiredTags: ["conscious"],
          forbiddenTags: ["silenced"],
          notes: "The actor must be able to cast and perceive the authorized target.",
        },
        operationReferences: [
          {
            referenceVersion: ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
            id: "operation.arc_flare_damage",
            domain: "STATS_POOLS",
            operation: "MUTATE_POOL",
            version: "actor_mechanics_profile.stats_pools.mutate_pool.v0",
            targetBinding: {
              bindingVersion: ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
              mode: "AUTHORIZED_ABILITY_TARGET",
            },
            arguments: {
              mutationType: "DAMAGE",
              poolQuery: "pool.health",
              amount: 12,
            },
          },
        ],
        cooldownPolicy: {
          mode: "TURN_COUNT",
          amount: 2,
          unit: "TURN",
        },
        chargePolicy: {
          mode: "UNLIMITED",
          resetPolicy: "NONE",
        },
        masteryPolicy: {
          mode: "RANKED",
          maximumMastery: 5,
        },
        tags: ["arcane", "damage", "ranged"],
        metadata: {
          fixturePurpose: "filled_spell",
        },
      },
      {
        id: "technique.guardian_step",
        title: "Guardian Step",
        aliases: ["Guard Step"],
        type: "TECHNIQUE",
        school: "MARTIAL",
        category: "DEFENSE",
        description:
          "Spend stamina to reposition and reinforce the source actor.",
        narrativeDescription:
          "The actor plants a guarded step, shifts position, and settles into a defensive stance.",
        enabled: true,
        prerequisites: {
          minimumLevel: 2,
          requiredSkills: [
            {
              skillId: "skill.athletics",
              minimumRank: 1,
            },
          ],
        },
        costs: [
          {
            id: "cost.guardian_step_stamina",
            resourceType: "POOL",
            resourceId: "pool.stamina",
            amount: 4,
            timing: "ON_USE",
          },
        ],
        targetModel: {
          mode: "SELF",
          minimumTargets: 1,
          maximumTargets: 1,
          rangeClass: "SELF",
          requiresLineOfSight: false,
        },
        restrictions: {
          forbiddenTags: ["immobilized"],
          notes: "This technique is unavailable while the source actor is immobilized.",
        },
        operationReferences: [
          {
            referenceVersion: ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
            id: "operation.guardian_step_restore",
            domain: "STATS_POOLS",
            operation: "MUTATE_POOL",
            version: "actor_mechanics_profile.stats_pools.mutate_pool.v0",
            targetBinding: {
              bindingVersion: ABILITY_SPELL_OPERATION_TARGET_BINDING_VERSION,
              mode: "SOURCE_ACTOR",
            },
            arguments: {
              mutationType: "RESTORE",
              poolQuery: "pool.guard",
              amount: 6,
            },
          },
        ],
        cooldownPolicy: {
          mode: "TURN_COUNT",
          amount: 1,
          unit: "TURN",
        },
        chargePolicy: {
          mode: "FIXED",
          maximumCharges: 2,
          resetPolicy: "SCENE",
        },
        masteryPolicy: {
          mode: "NUMERIC",
          maximumMastery: 100,
        },
        tags: ["martial", "defense", "movement"],
        metadata: {
          fixturePurpose: "filled_technique",
        },
      },
      {
        id: "passive.steady_channel",
        title: "Steady Channel",
        type: "PASSIVE",
        school: "ARCANE",
        category: "PASSIVE",
        description:
          "A passive definition with no active target or resource payment.",
        narrativeDescription:
          "The actor's practiced control keeps their channel steady without an active invocation.",
        enabled: true,
        prerequisites: {
          minimumLevel: 1,
        },
        costs: [],
        targetModel: {
          mode: "NONE",
          minimumTargets: 0,
          maximumTargets: 0,
          rangeClass: "NONE",
          requiresLineOfSight: false,
        },
        restrictions: {
          notes: "Definition-only passive fixture.",
        },
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
        tags: ["arcane", "passive"],
        metadata: {
          fixturePurpose: "filled_passive",
        },
      },
    ],
    tags: ["abilities", "magic", "fixture"],
    metadata: {
      fixtureVersion: "ability_spell_profile_filled_v1",
    },
  }),
});
