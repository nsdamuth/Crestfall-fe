const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Opening Scene and Runtime Guidance",
  sectionDescription:
    "Edit opening setup, hidden runtime notes, drift fixes, and failure handling.",
});

function normalizeTextValue(value) {
  return typeof value === "string" ? value : "";
}

export function getScenarioRuntimeGuidanceSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    openingScene: normalizeTextValue(data.opening_scene),
    openingMessages: normalizeTextValue(data.opening_messages),
    privateRuntimeGuidance: normalizeTextValue(
      data.private_runtime_guidance
    ),
    driftFixes: normalizeTextValue(data.drift_fixes),
    failureHandling: normalizeTextValue(data.failure_handling),
    onOpeningSceneChange: (value) =>
      updateDataField?.("opening_scene", value),
    onOpeningMessagesChange: (value) =>
      updateDataField?.("opening_messages", value),
    onPrivateRuntimeGuidanceChange: (value) =>
      updateDataField?.("private_runtime_guidance", value),
    onDriftFixesChange: (value) => updateDataField?.("drift_fixes", value),
    onFailureHandlingChange: (value) =>
      updateDataField?.("failure_handling", value),
  };
}

export function useScenarioRuntimeGuidanceSectionViewModel(props = {}) {
  return getScenarioRuntimeGuidanceSectionViewProps(props);
}
