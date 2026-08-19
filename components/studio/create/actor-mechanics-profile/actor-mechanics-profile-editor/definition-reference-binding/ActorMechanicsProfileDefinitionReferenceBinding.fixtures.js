export const actorMechanicsProfileDefinitionReferenceBindingsFixture =
  Object.freeze([
    {
      id: "binding.stats",
      domain: "STATS",
      domainLabel: "Stats & Pools",
      definitionReferenceMode:
        "STATS_POOLS_PROFILE",
      hasStatsPoolsProfileReference: true,
      references: [
        {
          index: 0,
          referenceType: "CREATION",
          sourceId:
            "11111111-1111-4111-8111-111111111111",
          version:
            "stats_pools_profile_contract_v0",
          title:
            "Heroic Stats & Pools",
          issues: [],
        },
      ],
    },
    {
      id: "binding.progression",
      domain: "PROGRESSION",
      domainLabel: "Progression",
      definitionReferenceMode:
        "PROGRESSION_PROFILE",
      hasProgressionProfileReference: true,
      references: [
        {
          index: 0,
          referenceType: "CREATION",
          sourceId:
            "22222222-2222-4222-8222-222222222222",
          version:
            "progression_profile_contract_v0",
          title:
            "Adventurer Progression",
          issues: [],
        },
      ],
    },
    {
      id: "binding.skills",
      domain: "SKILLS",
      domainLabel: "Skills",
      definitionReferenceMode:
        "SKILLS_PROFILE",
      hasSkillsProfileReference: true,
      references: [
        {
          index: 0,
          referenceType: "CREATION",
          sourceId:
            "33333333-3333-4333-8333-333333333333",
          version:
            "skills_profile_contract_v0",
          title:
            "Aethelgard Field Skills",
          issues: [],
        },
      ],
    },
    {
      id: "binding.magic",
      domain: "MAGIC",
      domainLabel: "Magic",
      definitionReferenceMode:
        "ABILITY_SPELL_PROFILE",
      hasAbilitySpellProfileReference: true,
      references: [
        {
          index: 0,
          referenceType: "CREATION",
          sourceId:
            "44444444-4444-4444-8444-444444444444",
          version:
            "ability_spell_profile_contract_v0",
          title:
            "Arcane Vanguard",
          issues: [],
        },
      ],
    },
    {
      id: "binding.abilities",
      domain: "ABILITIES",
      domainLabel: "Abilities",
      definitionReferenceMode:
        "ABILITY_SPELL_PROFILE",
      hasAbilitySpellProfileReference: false,
      references: [],
    },
    {
      id: "binding.wallet",
      domain: "WALLET",
      domainLabel: "Wallet",
      definitionReferenceMode:
        "WALLET_PROFILE",
      hasWalletProfileReference: true,
      references: [
        {
          index: 0,
          referenceType: "CREATION",
          sourceId:
            "55555555-5555-4555-8555-555555555555",
          version:
            "wallet_profile_contract_v0",
          title:
            "Aethelgard Expedition Wallet",
          issues: [],
        },
      ],
    },
    {
      id: "binding.inventory",
      domain: "INVENTORY",
      domainLabel: "Inventory",
      definitionReferenceMode:
        "GENERIC",
      references: [
        {
          index: 0,
          referenceType:
            "BUILTIN_MODULE",
          sourceId:
            "core.inventory.v1",
          version: "1",
          title:
            "Core Inventory",
          issues: [],
        },
      ],
    },
  ]);

export const actorMechanicsProfileDefinitionReferenceSkillsPickerFixture =
  Object.freeze({
    title: "Select Skills Profile",
    body:
      "Choose an owned Skills Profile to provide reusable proficiency and rank definitions for this SKILLS binding. Actor ranks and unspent points are not copied or initialized by this attachment.",
    allowedTypes: [
      "SKILLS_PROFILE",
    ],
    selectedCreationIds: [
      "33333333-3333-4333-8333-333333333333",
    ],
  });

export const actorMechanicsProfileDefinitionReferenceMagicPickerFixture =
  Object.freeze({
    title:
      "Select Ability & Spell Profile",
    body:
      "Choose an owned Ability & Spell Profile to provide reusable spell and magic definitions for this MAGIC binding. Known spells, mastery, cooldowns, charges, and resource state are not copied or initialized by this attachment.",
    allowedTypes: [
      "ABILITY_SPELL_PROFILE",
    ],
    selectedCreationIds: [
      "44444444-4444-4444-8444-444444444444",
    ],
  });

export const actorMechanicsProfileDefinitionReferenceWalletPickerFixture =
  Object.freeze({
    title: "Select Wallet Profile",
    body:
      "Choose an owned Wallet Profile to provide reusable gameplay currency definitions for this WALLET binding. Live actor balances, revisions, and transaction history are not copied or initialized by this attachment.",
    allowedTypes: [
      "WALLET_PROFILE",
    ],
    selectedCreationIds: [
      "55555555-5555-4555-8555-555555555555",
    ],
  });
