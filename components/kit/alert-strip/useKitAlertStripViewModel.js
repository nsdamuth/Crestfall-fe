"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data or decision about when an
// alert should show.
export function useKitAlertStripViewModel({
  tone = "neutral",
  title = "",
  body = "",
  actionLabel = "",
  onAction = null,
  onDismiss = null,
} = {}) {
  return {
    tone,
    title,
    body,
    actionLabel,
    onAction,
    onDismiss,
  };
}
