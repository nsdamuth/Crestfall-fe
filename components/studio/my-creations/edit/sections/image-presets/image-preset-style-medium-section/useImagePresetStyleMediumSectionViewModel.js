const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Style / Medium",
  sectionDescription:
    "Describe the visual medium, style family, rendering mode, texture, and art direction this preset contributes.",
  mediumLabel: "Medium",
  artStyleLabel: "Art Style",
  artistInfluenceLabel: "Artist / Era Influence",
  renderingModeLabel: "Rendering Mode",
  textureStyleLabel: "Texture Style",
  colorPaletteLabel: "Color Palette",
  styleNotesLabel: "Style Notes",
  styleNotesPlaceholder:
    "Describe the visual identity, medium behavior, surface texture, brushwork, color handling, and artistic feel.",
});

export function getImagePresetStyleMediumSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    mediumValue: data.medium || "",
    artStyleValue: data.art_style || "",
    artistInfluenceValue: data.artist_influence || data.era_influence || "",
    renderingModeValue: data.rendering_mode || data.rendering_style || "",
    textureStyleValue: data.texture_style || "",
    colorPaletteValue: data.color_palette || "",
    styleNotesValue: data.style_notes || data.design_reference || "",
    onChangeMedium: (value) => updateDataField?.("medium", value),
    onChangeArtStyle: (value) => updateDataField?.("art_style", value),
    onChangeArtistInfluence: (value) =>
      updateDataField?.("artist_influence", value),
    onChangeRenderingMode: (value) =>
      updateDataField?.("rendering_mode", value),
    onChangeTextureStyle: (value) =>
      updateDataField?.("texture_style", value),
    onChangeColorPalette: (value) =>
      updateDataField?.("color_palette", value),
    onChangeStyleNotes: (value) => updateDataField?.("style_notes", value),
  };
}

export function useImagePresetStyleMediumSectionViewModel(props = {}) {
  return getImagePresetStyleMediumSectionViewProps(props);
}
