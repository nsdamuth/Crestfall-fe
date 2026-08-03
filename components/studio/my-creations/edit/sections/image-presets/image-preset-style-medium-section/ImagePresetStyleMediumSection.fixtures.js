const baseFixture = {
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Style / Medium",
  sectionDescription:
    "Describe the visual medium, style family, rendering mode, texture, and art direction this preset contributes.",
  mediumLabel: "Medium",
  mediumValue: "Digital illustration with painterly finishing",
  artStyleLabel: "Art Style",
  artStyleValue: "Cinematic dark fantasy concept art",
  artistInfluenceLabel: "Artist / Era Influence",
  artistInfluenceValue: "Late romanticism and modern premium game key art",
  renderingModeLabel: "Rendering Mode",
  renderingModeValue: "Semi-realistic painterly rendering",
  textureStyleLabel: "Texture Style",
  textureStyleValue: "Layered brushwork with restrained surface grain",
  colorPaletteLabel: "Color Palette",
  colorPaletteValue: "Deep charcoal, muted gold, cold blue, and pale ivory",
  styleNotesLabel: "Style Notes",
  styleNotesValue:
    "Use dramatic but controlled brushwork, readable silhouettes, refined faces, atmospheric depth, and high-end editorial color handling.",
  styleNotesPlaceholder:
    "Describe the visual identity, medium behavior, surface texture, brushwork, color handling, and artistic feel.",
  onChangeMedium: null,
  onChangeArtStyle: null,
  onChangeArtistInfluence: null,
  onChangeRenderingMode: null,
  onChangeTextureStyle: null,
  onChangeColorPalette: null,
  onChangeStyleNotes: null,
};

export const imagePresetStyleMediumSectionDefaultFixture = {
  ...baseFixture,
};

export const imagePresetStyleMediumSectionEmptyFixture = {
  ...baseFixture,
  mediumValue: "",
  artStyleValue: "",
  artistInfluenceValue: "",
  renderingModeValue: "",
  textureStyleValue: "",
  colorPaletteValue: "",
  styleNotesValue: "",
};

export const imagePresetStyleMediumSectionLegacyInfluenceFixture = {
  ...baseFixture,
  artistInfluenceValue:
    "Legacy era_influence value normalized into Artist / Era Influence.",
};

export const imagePresetStyleMediumSectionLegacyRenderingFixture = {
  ...baseFixture,
  renderingModeValue:
    "Legacy rendering_style value normalized into Rendering Mode.",
};

export const imagePresetStyleMediumSectionLegacyNotesFixture = {
  ...baseFixture,
  styleNotesValue:
    "Legacy design_reference copy normalized into the current Style Notes field.",
};

export const imagePresetStyleMediumSectionMinimalFixture = {
  ...baseFixture,
  mediumValue: "Ink drawing",
  artStyleValue: "Graphic fantasy illustration",
  artistInfluenceValue: "",
  renderingModeValue: "Flat ink and wash",
  textureStyleValue: "Paper grain",
  colorPaletteValue: "Black, cream, and one red accent",
  styleNotesValue: "",
};

export const imagePresetStyleMediumSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Style, Medium, Surface Language, and Art-Direction Identity for a Cinematic Image Preset",
  sectionDescription:
    "Describe the complete reusable visual language this preset contributes across character portraits, environmental scenes, wardrobe studies, action compositions, catalogue images, and narrative key art while preserving a coherent medium, rendering approach, texture system, palette hierarchy, and artistic influence.",
  mediumValue:
    "Hybrid digital painting combining carefully modeled forms, hand-painted edges, subtle photographic texture references, and layered editorial finishing intended to remain painterly rather than becoming a literal photorealistic render.",
  artStyleValue:
    "Premium cinematic dark-fantasy concept art with restrained gothic ornament, strong visual storytelling, elegant silhouettes, and polished character-focused key-art composition.",
  artistInfluenceValue:
    "A broad synthesis of nineteenth-century romantic atmosphere, symbolist color, mid-century editorial illustration, contemporary game concept art, and luxury fashion campaign photography without directly imitating a single living artist.",
  renderingModeValue:
    "Semi-realistic painterly rendering with controlled hard and soft edges, high facial fidelity, simplified secondary detail, atmospheric perspective, and selective focal-area polish.",
  textureStyleValue:
    "Layered oil-like brush texture, fine paper grain, subtle fabric weave, restrained metallic micro-detail, soft atmospheric bloom, and lightly imperfect hand-painted transitions.",
  colorPaletteValue:
    "Deep charcoal, oxidized silver, muted antique gold, cold blue-gray, pale ivory, desaturated burgundy, and selective luminous accents organized around a dark value structure.",
  styleNotesValue:
    "Prioritize readable silhouettes and emotionally expressive faces. Keep decorative detail disciplined, use atmosphere to separate depth planes, allow visible brush character in secondary areas, and reserve the sharpest texture, color contrast, and material definition for the main subject and narrative focal point.",
};

export const imagePresetStyleMediumSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Visual Language",
  sectionTitle: "Medium & Art Direction",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  artistInfluenceLabel: "Historical / Editorial Influence",
  styleNotesLabel: "Art-Direction Notes",
};

export const imagePresetStyleMediumSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeMedium: null,
  onChangeArtStyle: null,
  onChangeArtistInfluence: null,
  onChangeRenderingMode: null,
  onChangeTextureStyle: null,
  onChangeColorPalette: null,
  onChangeStyleNotes: null,
};
