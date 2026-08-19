export const itemOperationAuthoringFilledFixture = Object.freeze({
  requirementSets: [
    {
      id: "equip-strength",
      enabled: true,
      actionTypes: ["EQUIP"],
      requirementMode: "ANY",
      requirements: [
        {
          id: "strength",
          type: "STATS_POOLS_STAT_CURRENT",
          bindingId: "stats",
          targetId: "stat.strength",
          operator: "GTE",
          value: 40,
        },
        {
          id: "focus",
          type: "SKILLS_RANK_CURRENT",
          bindingId: "skills",
          targetId: "skill.focus",
          operator: "GTE",
          value: 2,
        },
      ],
      metadata: {
        fixturePurpose: "equipment_requirement",
      },
    },
    {
      id: "consume-known-manual",
      enabled: true,
      actionTypes: ["CONSUME"],
      requirements: [
        {
          id: "arcana-rank",
          type: "SKILLS_RANK_CURRENT",
          bindingId: "skills",
          targetId: "skill.arcana",
          operator: "GTE",
          value: 1,
        },
      ],
      metadata: {
        fixturePurpose: "consumable_requirement",
      },
    },
  ],
  effectReferences: [
    {
      id: "healing-tonic",
      enabled: true,
      actionTypes: ["USE", "CONSUME"],
      domain: "stats_pools",
      operation: "mutate_pool",
      targetRole: "AUTHORIZED_TARGET",
      arguments: {
        mutationType: "RESTORE",
        poolQuery: "pool.health",
        amount: 25,
        bindingId: "stats",
      },
      metadata: {
        fixturePurpose: "typed_pool_restore",
      },
    },
    {
      id: "guild-purse",
      enabled: true,
      actionTypes: ["CONSUME"],
      domain: "wallet",
      operation: "mutate_balance",
      targetRole: "SOURCE_ACTOR",
      arguments: {
        mutationType: "CREDIT",
        currencyQuery: "currency.crowns",
        amount: 10,
        bindingId: "wallet",
      },
      metadata: {
        fixturePurpose: "typed_wallet_credit",
      },
    },
    {
      id: "training-manual",
      enabled: true,
      actionTypes: ["CONSUME"],
      domain: "skills",
      operation: "advance_rank",
      targetRole: "SOURCE_ACTOR",
      arguments: {
        skillQuery: "skill.arcana",
        bindingId: "skills",
      },
      metadata: {
        fixturePurpose: "typed_skill_advance",
      },
    },
    {
      id: "spell-manual",
      enabled: true,
      actionTypes: ["CONSUME"],
      domain: "ability_spell",
      operation: "set_knowledge",
      targetRole: "SOURCE_ACTOR",
      arguments: {
        abilityQuery: "spell.arc_flare",
        knowledgeState: "KNOWN",
        unlockState: "UNLOCKED",
      },
      metadata: {
        fixturePurpose: "typed_ability_knowledge",
      },
    },
    {
      id: "condition-salve",
      enabled: true,
      actionTypes: ["USE"],
      domain: "stats_pools",
      operation: "remove_condition",
      targetRole: "AUTHORIZED_TARGET",
      arguments: {
        conditionQuery: "condition.injured",
        removeStacks: 1,
        removeAll: false,
        bindingId: "stats",
      },
      metadata: {
        fixturePurpose: "typed_condition_remove",
      },
    },
  ],
});

export const itemOperationAuthoringEmptyFixture = Object.freeze({
  requirementSets: [],
  effectReferences: [],
});
