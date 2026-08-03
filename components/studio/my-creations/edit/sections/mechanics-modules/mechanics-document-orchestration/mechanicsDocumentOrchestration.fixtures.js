const noop = () => {};

export const MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES = Object.freeze([
  Object.freeze({
    id: "AVAILABLE",
    label: "Atomic Replacement Available",
    mechanicsData: {
      moduleDefinitionId: "core.trackers.v1",
      moduleId: "core.trackers.v1",
      contractVersion: "trackers_instance_data.v0_2",
      priority: 65,
      tags: ["preview", "orchestration"],
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
        commands: [],
        defaults: { flags: [], counters: [], stages: [] },
        statusBlocks: [],
        guards: [],
        futureInstanceMetadata: { retained: true },
      },
    },
    canReplaceData: true,
  }),
  Object.freeze({
    id: "UNAVAILABLE",
    label: "Atomic Replacement Unavailable",
    mechanicsData: {
      moduleDefinitionId: "core.trackers.v1",
      instanceData: {},
    },
    canReplaceData: false,
  }),
]);

export const mechanicsDocumentOrchestrationControlsFixture = {
  canReplaceData: true,
  presetButtonTitle: "Open the validated Mechanics preset library",
  jsonButtonTitle: "Open the complete Mechanics Module JSON editor",
  onOpenPresetLibrary: noop,
  onOpenJsonEditor: noop,
};
