const noop = () => {};

const baseCounts = {
  trackerCount: 1,
  commandCount: 2,
  guardCount: 1,
  statusBlockCount: 1,
  defaultCount: 3,
};

export const mechanicsPresetApplicationEmptyFixture = {
  title: "Mechanics Preset Library",
  description: "Choose a preset to preview its safe application boundary.",
  query: "",
  scopeFilter: "ALL",
  scopeOptions: [
    { id: "ALL", label: "All Presets" },
    { id: "MODULE", label: "Modules" },
    { id: "COMMAND", label: "Commands" },
  ],
  presetCards: [],
  selectedPresetId: "",
  selectedPreset: null,
  commandTargets: [],
  selectedCommandId: "",
  requiresCommandTarget: false,
  applyModeOptions: [],
  selectedApplyMode: "",
  preview: null,
  errors: [],
  warnings: [],
  confirmationRequired: false,
  replacementConfirmed: false,
  canApply: false,
  statusMessage: "",
  onClose: noop,
  onChangeQuery: noop,
  onChooseScope: noop,
  onChoosePreset: noop,
  onChooseCommand: noop,
  onChooseApplyMode: noop,
  onToggleReplacementConfirmation: noop,
  onApplyPreset: noop,
};

export const mechanicsPresetApplicationSelectedFixture = {
  ...mechanicsPresetApplicationEmptyFixture,
  presetCards: [
    {
      id: "module.social_probe.v1",
      label: "Social Probe Module",
      eyebrow: "Module Starter",
      summary: "1 command · 1 tracker · 1 guard",
      available: true,
      validationStatus: "REFERENCE_RUNTIME_READY",
      validationLabel: "Reference Runtime Ready",
      testCommand: "/probe kessa",
    },
    {
      id: "command.give_item.v1",
      label: "Give Held Item",
      eyebrow: "Command Starter",
      summary: "2 typed arguments · 1 domain action",
      available: true,
      validationStatus: "COMMAND_SMOKE_READY",
      validationLabel: "Command Smoke Test Ready",
      testCommand: "/give compass kessa",
    },
  ],
  selectedPresetId: "module.social_probe.v1",
  selectedPreset: {
    id: "module.social_probe.v1",
    label: "Social Probe Module",
    description: "A complete opposed social check module.",
    eyebrow: "Module Starter",
    badges: ["Mechanics Only", "Replace Module"],
    replacementPaths: ["module"],
    preservedPaths: ["creation.title", "creation.visibility"],
    available: true,
    liveValidation: {
      version: "mechanics_preset_live_validation_v1",
      presetId: "module.social_probe.v1",
      presetLabel: "Social Probe Module",
      status: "REFERENCE_RUNTIME_READY",
      statusLabel: "Reference Runtime Ready",
      runtimeImplementationId: "runtime.social_probe.v1",
      runtimeImplementationVersion: "mechanics_reference_runtime_implementation_v1",
      testCommand: "/probe kessa",
      expectedOutcome: "SUCCESS",
      expectedDomainLanes: [],
      checks: ["Command resolves as SUCCESS."],
      steps: ["Save, attach, run /probe kessa, and verify state."],
      notes: [],
    },
  },
  applyModeOptions: [
    { id: "REPLACE_MODULE", label: "REPLACE MODULE", destructive: true },
    { id: "MERGE_MODULE", label: "MERGE MODULE", destructive: false },
  ],
  selectedApplyMode: "MERGE_MODULE",
  preview: {
    valid: true,
    currentCounts: baseCounts,
    nextCounts: { ...baseCounts, commandCount: 3, trackerCount: 2 },
  },
  canApply: true,
};

export const mechanicsPresetApplicationConflictFixture = {
  ...mechanicsPresetApplicationSelectedFixture,
  preview: {
    valid: false,
    currentCounts: baseCounts,
    nextCounts: null,
  },
  errors: [
    {
      path: "$.instanceData.commands[0].id",
      message: "Cannot merge preset command because that ID already exists.",
    },
  ],
  canApply: false,
};
