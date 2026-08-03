"use client";

import { useState } from "react";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function humanize(value) {
  return normalizeString(value).replaceAll("_", " ");
}

export function useMechanicsPresetValidationPanelViewModel({
  guide,
  onDismiss,
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const testCommand = normalizeString(guide?.testCommand);

  async function copyTestCommand() {
    if (!testCommand) return;

    try {
      await navigator.clipboard.writeText(testCommand);
      setCopyStatus("Test command copied.");
    } catch {
      setCopyStatus("Copy failed. Select the command text manually.");
    }
  }

  return {
    eyebrow: "Preset Applied",
    title: guide?.presetLabel || "Live Validation Guide",
    description:
      "The preset is loaded into the open builder. Save it normally, then use this bounded smoke test to verify the live runtime path.",
    statusLabel: guide?.statusLabel || "Live Validation Ready",
    testCommand,
    expectedOutcomeLabel: humanize(guide?.expectedOutcome),
    domainLaneLabels: Array.isArray(guide?.expectedDomainLanes)
      ? guide.expectedDomainLanes.map(humanize).filter(Boolean)
      : [],
    checks: Array.isArray(guide?.checks) ? guide.checks : [],
    steps: Array.isArray(guide?.steps) ? guide.steps : [],
    notes: Array.isArray(guide?.notes) ? guide.notes : [],
    copyStatus,
    onCopyTestCommand: copyTestCommand,
    onDismiss,
  };
}
