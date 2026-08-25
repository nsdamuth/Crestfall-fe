// The preview generation cost, mirroring the World and Character quick
// creates' package-local placeholder value (components/studio/create/
// world/creator-stops/look-stop/useWorldPreviewViewModel.js) until
// CR-driven pricing lands for Look previews.
export const LOOK_PREVIEW_TOKEN_COST = 40;

export function useLookPreviewViewModel({ form = {} } = {}) {
  const name = form?.name || "";

  return {
    displayInitial: String(name || "L").slice(0, 1).toUpperCase(),
    lookName: name || "Unnamed Look",
    vibeLabel: form?.vibe || "Vibe not written yet.",
    garmentsLabel: form?.garments || "Garments not chosen yet.",
    paletteLabel: form?.palette || "Palette not set yet.",
    previewCostLabel: String(LOOK_PREVIEW_TOKEN_COST),
  };
}
