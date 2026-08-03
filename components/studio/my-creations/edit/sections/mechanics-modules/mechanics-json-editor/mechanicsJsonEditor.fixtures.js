const noop = () => {};

export const mechanicsJsonEditorBaseFixture = {
  title: "Mechanics JSON Editor",
  description:
    "Copy, inspect, or replace the complete authored Mechanics Module data. Validate & Apply updates the current builder only; use the page Save action to persist it.",
  jsonText: JSON.stringify(
    {
      moduleDefinitionId: "core.trackers.v1",
      moduleId: "core.trackers.v1",
      priority: 65,
      tags: ["mechanics", "test"],
      contractVersion: "trackers_instance_data.v0_2",
      instanceData: {
        contractVersion: "trackers_instance_data.v0_2",
        trackers: [
          {
            id: "trust",
            label: "Trust",
            kind: "meter",
            min: 0,
            max: 100,
            initial: 40,
            phases: [],
            mutationHints: [],
          },
        ],
        commands: [],
        guards: [],
        statusBlocks: [],
        defaults: {
          flags: [],
          counters: [],
          stages: [],
        },
      },
    },
    null,
    2
  ),
  errors: [],
  warnings: [],
  statusMessage: "",
  copyStatus: "idle",
  guideDownloadStatus: "idle",
  canApply: true,
  hasDraftChanges: false,
  characterCount: 642,
  lineCount: 31,
  onClose: noop,
  onChangeJson: noop,
  onCopy: noop,
  onDownloadAiGuide: noop,
  onFormat: noop,
  onReset: noop,
  onValidateAndApply: noop,
};

export const mechanicsJsonEditorErrorFixture = {
  ...mechanicsJsonEditorBaseFixture,
  jsonText:
    '{\n  "moduleDefinitionId": "core.trackers.v1",\n  "instanceData": {\n    "commands": [\n      { "id": "probe", "resolution": { "mode": "UNKNOWN" } }\n    ]\n  }\n}',
  errors: [
    {
      path: "$.instanceData.commands[0].resolution.mode",
      message: 'Unsupported resolution mode "UNKNOWN".',
    },
    {
      path:
        "$.instanceData.commands[0].resolution.die.count",
      message:
        "Die count must be an integer from 1 through 20.",
    },
  ],
  warnings: [],
  statusMessage:
    "2 compliance errors must be fixed before the JSON can be applied.",
  hasDraftChanges: true,
};

export const mechanicsJsonEditorWarningFixture = {
  ...mechanicsJsonEditorBaseFixture,
  warnings: [
    {
      path: "$.instanceData.commands[0].resolution.mode",
      message:
        'Alias "CONTESTED" will normalize to "OPPOSED_DIE".',
    },
  ],
  statusMessage:
    "JSON is valid and contains one normalization notice.",
  hasDraftChanges: true,
};
