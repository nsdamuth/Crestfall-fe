export function buildMechanicsDocumentOrchestrationCapability(
  canReplaceData = false
) {
  const enabled = canReplaceData === true;

  return {
    canReplaceData: enabled,
    presetButtonTitle: enabled
      ? "Open the validated Mechanics preset library"
      : "Atomic Mechanics data replacement is unavailable in this workflow",
    jsonButtonTitle: enabled
      ? "Open the complete Mechanics Module JSON editor"
      : "Atomic Mechanics data replacement is unavailable in this workflow",
  };
}

export function applyMechanicsDocumentReplacement({
  nextData,
  onReplaceMechanicsData,
} = {}) {
  if (typeof onReplaceMechanicsData !== "function") {
    return {
      ok: false,
      reason: "ATOMIC_REPLACEMENT_UNAVAILABLE",
    };
  }

  const result = onReplaceMechanicsData(nextData);

  return {
    ok: result === true,
    reason: result === true ? "APPLIED" : "REPLACEMENT_REJECTED",
  };
}

export function normalizeMechanicsPresetValidationGuide(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : null;
}
