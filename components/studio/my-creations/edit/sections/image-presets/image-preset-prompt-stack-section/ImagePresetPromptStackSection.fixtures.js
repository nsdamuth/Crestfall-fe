const baseFixture = {
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Prompt Stack",
  sectionDescription:
    "Edit the reusable prompt language this image preset contributes when selected in Image Studio.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidanceValue:
    "cinematic dark-fantasy portrait, elegant painterly finish, dramatic atmosphere",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this style preset.",
  stylePromptLabel: "Style Prompt",
  stylePromptValue:
    "digital painting, controlled brush texture, selective graphic edges, deep atmospheric perspective",
  stylePromptPlaceholder:
    "Specific style terms, medium descriptors, rendering phrases, or art-direction language.",
  qualityNotesLabel: "Quality / Polish Notes",
  qualityNotesValue:
    "Prioritize expressive faces, readable hands, consistent costume details, and restrained background noise.",
  qualityNotesPlaceholder:
    "Optional quality, finish, detail, polish, or consistency guidance.",
  imagePromptLabel: "Standalone Image Prompt",
  imagePromptValue:
    "A museum-quality catalogue image demonstrating the preset through a single adult fantasy character in a richly layered interior.",
  imagePromptPlaceholder:
    "Optional standalone prompt for generating preview, catalogue, or reference images for this image preset as its own visual asset. Max 2,000 characters.",
  negativePromptLabel: "Negative Prompt",
  negativePromptValue:
    "photorealistic, 3d render, flat lighting, muddy colors, malformed hands, excessive background clutter",
  negativePromptPlaceholder:
    "Optional negatives this image preset should contribute when selected. Example: photorealistic, 3d render, dull colors, flat lighting. Max 2,000 characters.",
  usageNotesLabel: "Usage Notes",
  usageNotesValue:
    "Best for character portraits, intimate story moments, and medium-scale environmental scenes.",
  usageNotesPlaceholder:
    "When should this preset be used? What characters, scenes, poses, outfits, or locations does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesValue:
    "Works well with fantasy outfits, dramatic poses, ornate interiors, and realistic-fantasy render lanes.",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, outfits, poses, locations, or visual genres.",
  onChangePromptGuidance: null,
  onChangeStylePrompt: null,
  onChangeQualityNotes: null,
  onChangeImagePrompt: null,
  onChangeNegativePrompt: null,
  onChangeUsageNotes: null,
  onChangeCompatibilityNotes: null,
};

export const imagePresetPromptStackSectionDefaultFixture = {
  ...baseFixture,
};

export const imagePresetPromptStackSectionEmptyFixture = {
  ...baseFixture,
  promptGuidanceValue: "",
  stylePromptValue: "",
  qualityNotesValue: "",
  imagePromptValue: "",
  negativePromptValue: "",
  usageNotesValue: "",
  compatibilityNotesValue: "",
};

export const imagePresetPromptStackSectionLegacyPromptFixture = {
  ...baseFixture,
  promptGuidanceValue:
    "Legacy prompt value normalized into the current Prompt Guidance field.",
};

export const imagePresetPromptStackSectionMinimalFixture = {
  ...baseFixture,
  promptGuidanceValue: "soft watercolor fantasy illustration",
  stylePromptValue: "",
  qualityNotesValue: "",
  imagePromptValue: "",
  negativePromptValue: "",
  usageNotesValue: "Character portraits",
  compatibilityNotesValue: "",
};

export const imagePresetPromptStackSectionLimitStressFixture = {
  ...baseFixture,
  imagePromptValue:
    "A".repeat(1980) + " near the maximum standalone prompt length.",
  negativePromptValue:
    "B".repeat(1980) + " near the maximum negative prompt length.",
};

export const imagePresetPromptStackSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Prompt Stack, Style Language, Quality Direction, Standalone Generation Guidance, Negative Constraints, and Compatibility",
  sectionDescription:
    "Define a reusable prompt contribution that remains understandable across character portraits, environmental compositions, wardrobe studies, pose references, narrative illustrations, and future Image Studio workflows without leaking storage or persistence details into the portable View.",
  promptGuidanceValue:
    "cinematic mythic-fantasy illustration, adult character focus, elegant silhouette hierarchy, atmospheric depth, intentional value grouping, controlled focal contrast, subtle environmental storytelling, and consistent visual language across a broad series of connected images",
  stylePromptValue:
    "painterly digital illustration with selective graphic contour accents, nuanced material response, restrained high-frequency detail, layered atmospheric perspective, sophisticated color separation, and carefully controlled transitions between rendered focal areas and looser supporting passages",
  qualityNotesValue:
    "Preserve facial identity, hand anatomy, costume continuity, readable props, and stable palette relationships. Keep tertiary texture subordinate to the narrative focus, avoid excessive micro-detail, and maintain consistent polish across characters and environments.",
  usageNotesValue:
    "Use for character introductions, dramatic conversations, relationship scenes, ceremonial outfits, intimate interiors, narrative location studies, promotional catalogue imagery, and any scene where emotional readability matters more than raw spectacle.",
  compatibilityNotesValue:
    "Designed for realistic-fantasy and painterly fantasy lanes. Compatible with structured character appearance, outfit, pose, location, and camera guidance. Avoid pairing with presets that demand flat cel shading, extreme photorealism, or intentionally crude sketch output.",
};

export const imagePresetPromptStackSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Generation Language",
  sectionTitle: "Reusable Prompt Contribution",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  promptGuidanceLabel: "Core Prompt Language",
  qualityNotesLabel: "Consistency Direction",
};

export const imagePresetPromptStackSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangePromptGuidance: null,
  onChangeStylePrompt: null,
  onChangeQualityNotes: null,
  onChangeImagePrompt: null,
  onChangeNegativePrompt: null,
  onChangeUsageNotes: null,
  onChangeCompatibilityNotes: null,
};
