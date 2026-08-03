import { normalizeStatsPoolsEditorValue } from "../stats-pools-editor/useStatsPoolsEditorViewModel.js";

export const statsPoolsJsonEditorProfileFixture = Object.freeze(
  normalizeStatsPoolsEditorValue({
    title: "Core Adventurer Stats and Pools",
    description:
      "Reusable definitions for core attributes, resources, derived values, modifiers, and conditions.",
    enabled: true,
    profileMode: "FULL",
    capabilityPolicy: {
      mode: "STANDARD",
      numericResolutionPolicy: "DETERMINISTIC",
      workingModeProfile: "",
      notes: "",
    },
    statDefinitions: [
      {
        id: "vitality",
        title: "Vitality",
        description: "Physical resilience and life-force capacity.",
        category: "CORE",
        valueType: "INTEGER",
        scale: {
          mode: "BOUNDED",
          minimum: 0,
          maximum: 100,
          defaultValue: 50,
        },
        derived: { enabled: false, formula: null },
        tags: ["physical", "core"],
      },
      {
        id: "defense",
        title: "Defense",
        description: "A derived defensive rating.",
        category: "DERIVED",
        valueType: "INTEGER",
        scale: {
          mode: "BOUNDED",
          minimum: 0,
          maximum: 200,
          defaultValue: 0,
        },
        derived: {
          enabled: true,
          formula: {
            root: {
              operation: "ADD",
              operands: [
                {
                  nodeType: "REFERENCE",
                  referenceType: "STAT",
                  referenceId: "vitality",
                  field: "CURRENT",
                },
                { nodeType: "CONSTANT", value: 10 },
              ],
            },
            rounding: "ROUND",
            notes: "",
          },
        },
        tags: ["derived"],
      },
    ],
    poolDefinitions: [
      {
        id: "health",
        title: "Health",
        description: "Current physical endurance.",
        category: "RESOURCE",
        valueType: "INTEGER",
        minimum: 0,
        maximum: {
          mode: "DERIVED",
          value: null,
          formula: {
            root: {
              operation: "MULTIPLY",
              operands: [
                {
                  nodeType: "REFERENCE",
                  referenceType: "STAT",
                  referenceId: "vitality",
                  field: "CURRENT",
                },
                { nodeType: "CONSTANT", value: 2 },
              ],
            },
            rounding: "ROUND",
            notes: "",
          },
        },
        defaultCurrent: { mode: "MAXIMUM", value: null },
        allowOverfill: false,
        tags: ["health"],
      },
    ],
    modifierDefinitions: [
      {
        id: "wounded-defense-penalty",
        title: "Wounded Defense Penalty",
        description: "Reduces Defense while wounded.",
        target: { targetType: "STAT_CURRENT", definitionId: "defense" },
        operation: "ADD",
        value: -10,
        stackPolicy: "UNIQUE",
        durationPolicy: "PERSISTENT",
        defaultDurationTurns: 0,
        priority: 10,
        notes: "",
      },
    ],
    conditionDefinitions: [
      {
        id: "wounded",
        title: "Wounded",
        description: "The actor is significantly injured.",
        stackPolicy: "UNIQUE",
        maximumStacks: 1,
        modifierDefinitionIds: ["wounded-defense-penalty"],
        tags: ["injury"],
      },
    ],
    metadata: {},
  })
);
