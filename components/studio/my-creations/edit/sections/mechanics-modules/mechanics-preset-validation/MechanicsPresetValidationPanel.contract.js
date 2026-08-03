export const MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT_VERSION =
  "1.0.0";

export const MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT = Object.freeze({
  version: MECHANICS_PRESET_VALIDATION_PANEL_VIEW_CONTRACT_VERSION,
  values: [
    "eyebrow",
    "title",
    "description",
    "statusLabel",
    "testCommand",
    "expectedOutcomeLabel",
    "domainLaneLabels",
    "checks",
    "steps",
    "notes",
    "copyStatus",
  ],
  callbacks: ["onCopyTestCommand", "onDismiss"],
});
