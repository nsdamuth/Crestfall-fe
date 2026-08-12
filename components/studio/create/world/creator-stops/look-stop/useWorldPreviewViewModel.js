// The preview generation cost, mirroring the Character quick create's
// package-local placeholder value (components/studio/create/character/
// character-preview/useCharacterPreviewViewModel.js) until CR-driven
// pricing lands for World previews.
export const WORLD_PREVIEW_TOKEN_COST = 40;

export function useWorldPreviewViewModel({ form = {} } = {}) {
  const name = form?.name || "";

  return {
    displayInitial: String(name || "W").slice(0, 1).toUpperCase(),
    worldName: name || "Unnamed World",
    premiseLabel: form?.premise || "Premise not written yet.",
    settingLabel: form?.setting || "Setting not chosen yet.",
    toneLabel: form?.tone || "Tone not set yet.",
    previewCostLabel: String(WORLD_PREVIEW_TOKEN_COST),
  };
}
