const noop = () => {};

export const mechanicsPresetValidationReferenceFixture = {
  eyebrow: "Preset Applied",
  title: "Social Probe Module",
  description:
    "The preset is loaded into the open builder. Save it normally, then use this bounded smoke test to verify the live runtime path.",
  statusLabel: "Reference Runtime Ready",
  testCommand: "/probe kessa",
  expectedOutcomeLabel: "SUCCESS",
  domainLaneLabels: [],
  checks: [
    "Command resolves as SUCCESS.",
    "No cross-domain runtime lane is required.",
    "Mechanics values persist after refresh without replaying the same turn.",
  ],
  steps: [
    "Apply the preset, then use the normal page Save action.",
    "Attach the saved Mechanics Module to a fresh test chat instance.",
    "Run /probe kessa.",
    "Compare the command result and runtime state with the expected checks below.",
  ],
  notes: ["Runs the opposed Social Probe module with target-scoped effect binding."],
  copyStatus: "",
  onCopyTestCommand: noop,
  onDismiss: noop,
};

export const mechanicsPresetValidationDomainFixture = {
  ...mechanicsPresetValidationReferenceFixture,
  title: "Item Handoff",
  testCommand: "/give compass kessa",
  domainLaneLabels: ["ITEM RUNTIME"],
};
