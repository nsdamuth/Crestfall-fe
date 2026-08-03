const baseFixture = {
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Rendering Notes",
  sectionDescription:
    "Define lighting, detail level, linework, shading, atmosphere, and composition behavior for this image preset.",
  lightingStyleLabel: "Lighting Style",
  lightingStyleValue: "Dramatic side lighting with restrained rim light",
  detailLevelLabel: "Detail Level",
  detailLevelValue: "High focal detail with simplified secondary surfaces",
  lineworkLabel: "Linework",
  lineworkValue: "Mostly painted edges with selective ink-like accents",
  shadingLabel: "Shading",
  shadingValue: "Soft volumetric shadows with controlled hard contact edges",
  moodLabel: "Mood / Atmosphere",
  moodValue: "Brooding, elegant, mysterious, and cinematic",
  compositionStyleLabel: "Composition Style",
  compositionStyleValue: "Strong central silhouette with layered depth planes",
  renderingGuidanceLabel: "Rendering Guidance",
  renderingGuidanceValue:
    "Keep faces and hands refined, reserve the sharpest contrast for the subject, use atmosphere to separate depth, and prevent secondary detail from competing with the focal area.",
  renderingGuidancePlaceholder:
    "Describe how the preset should influence image detail, polish, line quality, lighting, surface finish, and visual mood.",
  onChangeLightingStyle: null,
  onChangeDetailLevel: null,
  onChangeLinework: null,
  onChangeShading: null,
  onChangeMood: null,
  onChangeCompositionStyle: null,
  onChangeRenderingGuidance: null,
};

export const imagePresetRenderingNotesSectionDefaultFixture = {
  ...baseFixture,
};

export const imagePresetRenderingNotesSectionEmptyFixture = {
  ...baseFixture,
  lightingStyleValue: "",
  detailLevelValue: "",
  lineworkValue: "",
  shadingValue: "",
  moodValue: "",
  compositionStyleValue: "",
  renderingGuidanceValue: "",
};

export const imagePresetRenderingNotesSectionLegacyAtmosphereFixture = {
  ...baseFixture,
  moodValue:
    "Legacy atmosphere value normalized into the current Mood / Atmosphere field.",
};

export const imagePresetRenderingNotesSectionMinimalFixture = {
  ...baseFixture,
  lightingStyleValue: "Natural window light",
  detailLevelValue: "Moderate",
  lineworkValue: "Clean",
  shadingValue: "Soft",
  moodValue: "Quiet",
  compositionStyleValue: "Simple portrait",
  renderingGuidanceValue: "",
};

export const imagePresetRenderingNotesSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Rendering Notes, Lighting Behavior, Surface Finish, Atmospheric Depth, and Composition Direction",
  sectionDescription:
    "Define how this reusable Image Preset should control focal hierarchy, lighting direction, line behavior, shading transitions, atmospheric perspective, material finish, composition rhythm, and the relationship between highly polished subject detail and deliberately simplified supporting areas.",
  lightingStyleValue:
    "A layered cinematic lighting setup combining a large cool ambient source, a narrow warm key, restrained backlight, selective reflective bounce, and soft volumetric separation that remains readable across portraits, full-body character studies, and environmental compositions.",
  detailLevelValue:
    "Very high detail in faces, hands, signature clothing, and story-critical props; moderate detail in supporting garments and nearby architecture; simplified tertiary surfaces and distant background information.",
  lineworkValue:
    "Primarily painterly edge construction with selective graphic contour reinforcement around the silhouette, facial features, hands, and important prop intersections, avoiding uniform outlines across every surface.",
  shadingValue:
    "Broad value grouping with soft atmospheric transitions, crisp contact shadows where forms overlap, controlled ambient occlusion, and restrained specular response tailored to each material rather than a uniform glossy finish.",
  moodValue:
    "Elegant, ominous, introspective, mythic, and emotionally restrained, with enough atmospheric tension to suggest a larger narrative without making every scene visually chaotic or melodramatic.",
  compositionStyleValue:
    "Strong silhouette-first design, asymmetric balance, clear foreground and background framing, intentional negative space, and a focal path that moves from face to hands or prop before resolving into environmental context.",
  renderingGuidanceValue:
    "Protect facial readability and expressive gesture above all secondary detail. Use lighting and atmospheric depth to separate overlapping forms. Preserve visible painterly character in low-priority regions, prevent decorative trim from becoming noisy, and reserve the strongest contrast, sharpest texture, and most saturated accents for the primary narrative focus.",
};

export const imagePresetRenderingNotesSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Render Behavior",
  sectionTitle: "Lighting & Composition",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  moodLabel: "Emotional Atmosphere",
  renderingGuidanceLabel: "Master Rendering Direction",
};

export const imagePresetRenderingNotesSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeLightingStyle: null,
  onChangeDetailLevel: null,
  onChangeLinework: null,
  onChangeShading: null,
  onChangeMood: null,
  onChangeCompositionStyle: null,
  onChangeRenderingGuidance: null,
};
