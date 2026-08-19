export const itemRegistryMechanicsAuthoringActiveEntryFixture = Object.freeze({
  id: "item-resonance-compass",
  name: "Brass Resonance Compass",
  equipmentModifierReferences: [
    {
      id: "equipment.compass-focus",
      enabled: true,
      statsPoolsBindingId: "stats",
      modifierDefinitionId: "modifier.arcane-focus",
      stacks: 1,
      metadata: {
        fixturePurpose: "equipped_modifier",
      },
    },
    {
      id: "equipment.compass-ward",
      enabled: false,
      statsPoolsBindingId: "stats",
      modifierDefinitionId: "modifier.resonance-ward",
      stacks: 2,
      metadata: {
        fixturePurpose: "disabled_modifier",
      },
    },
  ],
  operationRequirementSets: [
    {
      id: "use-arcana",
      enabled: true,
      actionTypes: ["ITEM_USE"],
      requirements: [
        {
          id: "arcana-rank",
          type: "SKILLS_RANK_CURRENT",
          bindingId: "skills",
          targetId: "skill.arcana",
          operator: "GTE",
          value: 2,
        },
      ],
      metadata: {
        fixturePurpose: "use_requirement",
      },
    },
    {
      id: "equip-focus",
      enabled: true,
      actionTypes: ["ITEM_EQUIP"],
      requirements: [
        {
          id: "focus-rank",
          type: "SKILLS_RANK_CURRENT",
          bindingId: "skills",
          targetId: "skill.focus",
          operator: "GTE",
          value: 1,
        },
      ],
      metadata: {
        fixturePurpose: "equip_requirement",
      },
    },
  ],
  operationEffectReferences: [
    {
      id: "compass-focus-restore",
      enabled: true,
      actionTypes: ["ITEM_USE"],
      domain: "STATS_POOLS",
      operation: "MUTATE_POOL",
      targetRole: "SOURCE_ACTOR",
      arguments: {
        mutationType: "RESTORE",
        poolQuery: "pool.focus",
        amount: 5,
        bindingId: "stats",
      },
      metadata: {
        fixturePurpose: "pool_restore",
      },
    },
    {
      id: "compass-arcana-rank",
      enabled: true,
      actionTypes: ["ITEM_USE"],
      domain: "SKILLS",
      operation: "ADVANCE_RANK",
      targetRole: "SOURCE_ACTOR",
      arguments: {
        skillQuery: "skill.arcana",
        bindingId: "skills",
      },
      metadata: {
        fixturePurpose: "skill_advance",
      },
    },
    {
      id: "compass-unlock-reading",
      enabled: true,
      actionTypes: ["ITEM_USE"],
      domain: "ABILITY_SPELL",
      operation: "SET_KNOWLEDGE",
      targetRole: "SOURCE_ACTOR",
      arguments: {
        abilityQuery: "ability.resonance_reading",
        knowledgeState: "KNOWN",
        unlockState: "UNLOCKED",
      },
      metadata: {
        fixturePurpose: "ability_unlock",
      },
    },
  ],
});

export const itemRegistryMechanicsAuthoringEmptyEntryFixture = Object.freeze({
  id: "item-empty",
  name: "Plain Workshop Token",
  equipmentModifierReferences: [],
  operationRequirementSets: [],
  operationEffectReferences: [],
});

export const itemRegistryMechanicsAuthoringNoActiveEntryFixture = Object.freeze({
  activeEntry: null,
});

export const itemRegistryMechanicsAuthoringAtLimitsFixture = Object.freeze({
  id: "item-limits",
  name: "Stress Test Item",
  equipmentModifierReferences: Array.from({ length: 16 }, (_, index) => ({
    id: `equipment.limit-${index + 1}`,
    enabled: true,
    statsPoolsBindingId: "stats",
    modifierDefinitionId: `modifier.limit-${index + 1}`,
    stacks: 1,
  })),
  operationRequirementSets: Array.from({ length: 16 }, (_, index) => ({
    id: `requirement.limit-${index + 1}`,
    enabled: true,
    actionTypes: ["ITEM_USE"],
    requirements: [],
  })),
  operationEffectReferences: Array.from({ length: 32 }, (_, index) => ({
    id: `effect.limit-${index + 1}`,
    enabled: true,
    actionTypes: ["ITEM_USE"],
    domain: "STATS_POOLS",
    operation: "MUTATE_POOL",
    targetRole: "SOURCE_ACTOR",
    arguments: {
      mutationType: "RESTORE",
      poolQuery: "pool.health",
      amount: 1,
      bindingId: "stats",
    },
  })),
});
