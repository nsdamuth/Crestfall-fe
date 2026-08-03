export const MECHANICS_COMMAND_OUTCOME_FIXTURES = Object.freeze([
  Object.freeze({
    id: "default-branches",
    label: "Default Branches",
    outcomes: {
      version: "mechanics_command_outcomes_v1",
    },
  }),
  Object.freeze({
    id: "custom-branches",
    label: "Custom Branches",
    outcomes: {
      version: "mechanics_command_outcomes_v1",
      SUCCESS: {
        effectMode: "APPEND",
        summary: "The action succeeds with an extra status change.",
        effects: [
          {
            id: "mark_ready",
            type: "FLAG_SET",
            targetId: "ready",
            value: true,
            reason: "The success marks the actor ready.",
          },
        ],
      },
      FAILURE: {
        effectMode: "REPLACE",
        summary: "The action fails and records a warning.",
        effects: [
          {
            id: "warning",
            type: "COUNTER_INCREMENT",
            targetId: "warnings",
            amount: 1,
          },
        ],
      },
    },
  }),
  Object.freeze({
    id: "legacy-aliases",
    label: "Legacy Aliases",
    outcomes: {
      version: "mechanics_command_outcomes_v1",
      criticalSuccess: {
        mode: "APPEND",
        description: "Legacy camel-case branch.",
        effects: [],
        futureBranchMetadata: { retained: true },
      },
      failure: {
        effect_mode: "NONE",
        reason: "Legacy lowercase branch.",
      },
      futureOutcomeMetadata: { retained: true },
    },
  }),
  Object.freeze({
    id: "malformed-recoverable",
    label: "Malformed but Recoverable",
    outcomes: {
      version: "",
      SUCCESS: {
        effectMode: "UNKNOWN",
        effects: "not-an-array",
        summary: 42,
      },
      FUMBLE: null,
    },
  }),
]);
