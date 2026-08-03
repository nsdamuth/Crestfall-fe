const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Rendering Notes",
  sectionDescription:
    "Define lighting, detail level, linework, shading, atmosphere, and composition behavior for this image preset.",
  lightingStyleLabel: "Lighting Style",
  detailLevelLabel: "Detail Level",
  lineworkLabel: "Linework",
  shadingLabel: "Shading",
  moodLabel: "Mood / Atmosphere",
  compositionStyleLabel: "Composition Style",
  renderingGuidanceLabel: "Rendering Guidance",
  renderingGuidancePlaceholder:
    "Describe how the preset should influence image detail, polish, line quality, lighting, surface finish, and visual mood.",
});

export function getImagePresetRenderingNotesSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    lightingStyleValue: data.lighting_style || "",
    detailLevelValue: data.detail_level || "",
    lineworkValue: data.linework || "",
    shadingValue: data.shading || "",
    moodValue: data.mood || data.atmosphere || "",
    compositionStyleValue: data.composition_style || "",
    renderingGuidanceValue: data.rendering_guidance || "",
    onChangeLightingStyle: (value) =>
      updateDataField?.("lighting_style", value),
    onChangeDetailLevel: (value) => updateDataField?.("detail_level", value),
    onChangeLinework: (value) => updateDataField?.("linework", value),
    onChangeShading: (value) => updateDataField?.("shading", value),
    onChangeMood: (value) => updateDataField?.("mood", value),
    onChangeCompositionStyle: (value) =>
      updateDataField?.("composition_style", value),
    onChangeRenderingGuidance: (value) =>
      updateDataField?.("rendering_guidance", value),
  };
}

export function useImagePresetRenderingNotesSectionViewModel(props = {}) {
  return getImagePresetRenderingNotesSectionViewProps(props);
}
