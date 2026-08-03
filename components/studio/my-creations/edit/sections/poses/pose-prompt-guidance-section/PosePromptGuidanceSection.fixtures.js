const baseFixture = {
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Edit the reusable image-generation guidance this pose contributes when selected in Image Studio.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidanceValue:
    "Full-body contrapposto stance, shoulders angled slightly away from camera, chin raised, weight resting on the rear leg, relaxed hands.",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this pose.",
  usageNotesLabel: "Usage Notes",
  usageNotesValue:
    "Best for confident character portraits, fashion-oriented renders, and full-body compositions where the silhouette should remain readable.",
  usageNotesPlaceholder:
    "When should this pose be used? What character types, outfits, locations, or image presets does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesValue:
    "Works best with standing camera presets and outfits without large floor-length trains or rigid seated props.",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, outfits, props, image presets, or scene types.",
  onChangePromptGuidance: null,
  onChangeUsageNotes: null,
  onChangeCompatibilityNotes: null,
};

export const posePromptGuidanceSectionDefaultFixture = {
  ...baseFixture,
};

export const posePromptGuidanceSectionEmptyFixture = {
  ...baseFixture,
  promptGuidanceValue: "",
  usageNotesValue: "",
  compatibilityNotesValue: "",
};

export const posePromptGuidanceSectionPromptOnlyFixture = {
  ...baseFixture,
  usageNotesValue: "",
  compatibilityNotesValue: "",
};

export const posePromptGuidanceSectionLegacyPromptFixture = {
  ...baseFixture,
  sectionDescription:
    "This display state represents a Pose whose existing legacy prompt value was normalized by the application layer.",
  promptGuidanceValue:
    "Dynamic over-the-shoulder stance, torso twisted toward the camera, one hand resting near a weapon hilt.",
};

export const posePromptGuidanceSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Prompt Guidance for a Complex Multi-Character Cinematic Pose",
  sectionDescription:
    "Edit reusable image-generation guidance for a pose intended to remain legible across multiple render styles, wide environmental compositions, layered wardrobes, handheld props, and characters with substantially different body proportions.",
  promptGuidanceValue:
    "Full-body cinematic stance with the lead character positioned slightly forward of the supporting figure, both bodies turned along complementary diagonals, feet planted at visibly different depths, shoulders separated to preserve each silhouette, hands positioned away from facial features, and eyelines converging toward an off-camera point of tension. Maintain natural weight distribution, readable joints, and enough negative space around weapons, capes, wings, or long garments to prevent visual tangling.",
  usageNotesValue:
    "Use for confrontation scenes, promotional ensemble art, paired-character reveals, or Story illustrations where two participants must share visual importance without appearing mirrored. Prefer landscape or wide portrait framing and avoid tight face crops.",
  compatibilityNotesValue:
    "May require adaptation for seated characters, quadrupeds, extreme height differences, wheelchairs, large mounted creatures, or scenes where architecture constrains foot placement. Avoid combining with camera presets that crop below the waist unless the lower-body relationship is intentionally discarded.",
};

export const posePromptGuidanceSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Image Contribution",
  sectionTitle: "Pose Prompt and Usage Guardrails",
  sectionDescription:
    "Review the visible prompt contribution and the circumstances in which this pose should or should not be selected.",
  promptGuidanceLabel: "Generated Prompt Contribution",
  usageNotesLabel: "Recommended Uses",
  compatibilityNotesLabel: "Known Conflicts",
};

export const posePromptGuidanceSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangePromptGuidance: null,
  onChangeUsageNotes: null,
  onChangeCompatibilityNotes: null,
};
