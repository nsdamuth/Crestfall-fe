// The preview generation cost, mirroring the Character, World, and
// Look quick creates' package-local placeholder value
// (components/studio/create/look/creator-stops/look-stop/
// useLookPreviewViewModel.js) until CR-driven pricing lands for Story
// cover previews.
export const COVER_PREVIEW_TOKEN_COST = 40;

export function useCoverPreviewViewModel({ form = {} } = {}) {
  const name = form?.name || "";
  const castCount = Array.isArray(form?.castCharacters) ? form.castCharacters.length : 0;

  return {
    displayInitial: String(name || "S").slice(0, 1).toUpperCase(),
    storyName: name || "Unnamed Story",
    premiseLabel: form?.premise || "Premise not written yet.",
    castLabel:
      castCount === 0
        ? "No cast chosen yet."
        : `${castCount} character${castCount === 1 ? "" : "s"} in the cast.`,
    settingLabel: form?.setting?.title
      ? `Set in ${form.setting.title}.`
      : "Setting not chosen yet.",
    previewCostLabel: String(COVER_PREVIEW_TOKEN_COST),
  };
}
