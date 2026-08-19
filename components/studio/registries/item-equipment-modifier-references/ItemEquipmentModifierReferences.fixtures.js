export const itemEquipmentModifierReferencesEmptyFixture = Object.freeze({
  references: [],
  maxReferences: 16,
});

export const itemEquipmentModifierReferencesFilledFixture = Object.freeze({
  references: [
    {
      id: "equipment.shield-strength",
      enabled: true,
      statsPoolsBindingId: "stats",
      modifierDefinitionId: "modifier.shield-strength",
      stacks: 1,
      metadata: {
        fixturePurpose: "single_equipped_modifier",
      },
    },
    {
      id: "equipment.insulated-lining",
      enabled: true,
      statsPoolsBindingId: "stats",
      modifierDefinitionId: "modifier.cold-resistance",
      stacks: 2,
      metadata: {
        fixturePurpose: "stacked_equipped_modifier",
      },
    },
    {
      id: "equipment.dormant-rune",
      enabled: false,
      stats_pools_binding_id: "stats-alt",
      modifier_definition_id: "modifier.arcane-ward",
      stacks: 0,
      metadata: {
        fixturePurpose: "disabled_alias_shape",
      },
    },
  ],
  maxReferences: 16,
});

export const itemEquipmentModifierReferencesLimitFixture = Object.freeze({
  references: Array.from({ length: 20 }, (_, index) => ({
    id: `equipment.limit-${index + 1}`,
    enabled: true,
    bindingId: "stats",
    definitionId: `modifier.limit-${index + 1}`,
    stacks: 5000,
  })),
  maxReferences: 16,
});
