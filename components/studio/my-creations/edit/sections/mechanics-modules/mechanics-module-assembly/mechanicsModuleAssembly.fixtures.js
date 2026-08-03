export const MECHANICS_MODULE_ASSEMBLY_FIXTURES = Object.freeze([
  Object.freeze({
    id: "COMPLETE",
    label: "Complete Assembly",
    mechanicsData: {
      moduleDefinitionId: "core.trackers.v1",
      moduleId: "core.trackers.v1",
      contractVersion: "trackers_instance_data.v0_2",
      priority: 89,
      tags: ["preview", "m9-assembly"],
      futureRootMetadata: { retained: true },
      instanceData: {
        contractVersion: "trackers_instance_data.v0_2",
        trackers: [
          {
            id: "resolve",
            label: "Resolve",
            min: 0,
            max: 100,
            initial: 50,
            phases: [],
            mutationHints: [],
          },
        ],
        commands: [
          {
            id: "observe",
            label: "Observe",
            invocation: {
              command: "observe",
              prefixes: ["/"],
              aliases: [],
              arguments: [],
            },
            requirements: [],
            attemptEffects: [],
            effects: [],
            outcomes: {},
            triggers: [],
          },
        ],
        defaults: {
          flags: [{ id: "enabled", label: "Enabled", initial: true }],
          counters: [],
          stages: [],
        },
        statusBlocks: [
          {
            id: "summary",
            label: "Summary",
            slot: "main_footer",
            placement: "response_end",
            required: false,
            visibility: "public",
            lines: ["Resolve: {{tracker.resolve.value}}"],
          },
        ],
        guards: [
          {
            id: "enabled_guard",
            label: "Enabled Guard",
            enforcement: "GUIDANCE",
            mode: "ALL",
            conditions: [],
            onFail: { summary: "", composerGuidance: "" },
            onPass: { summary: "" },
            composerVisibility: "FULL",
            publicVisibility: "PUBLIC",
          },
        ],
        futureInstanceMetadata: { retained: true },
      },
    },
  }),
  Object.freeze({
    id: "EMPTY",
    label: "Empty Assembly",
    mechanicsData: {
      moduleDefinitionId: "core.trackers.v1",
      instanceData: {
        trackers: [],
        commands: [],
        defaults: { flags: [], counters: [], stages: [] },
        statusBlocks: [],
        guards: [],
      },
    },
  }),
]);
