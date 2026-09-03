const baseFixture = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Body",
  sectionDescription:
    "Edit physical silhouette fields using the same guided controls from character creation.",
  bodyPromptLabel: "Custom Body Prompt",
  bodyPromptPlaceholder:
    "Optional model-neutral physical details that should affect image generation across all rendering styles.",
  fantasyPromptLabel: "Fantasy Specific Prompt Details",
  fantasyPromptPlaceholder:
    "Optional short guidance applied only to fantasy and anime rendering stages.",
  realisticPromptLabel: "Realistic Specific Prompt Details",
  realisticPromptPlaceholder:
    "Optional short guidance applied only to realistic rendering stages.",
});

export const characterBodySectionPopulatedFixture = {
  ...baseFixture,
  bodyPromptValue:
    "Lean waist, dense fighter-level musculature, powerful legs, defined shoulders, and a balanced athletic silhouette.",
  fantasyPromptValue:
    "Painterly cel-shaded shadow limbs, heightened silhouette drama, and floating hair.",
  realisticPromptValue:
    "Natural skin detail, physically plausible muscle definition, and restrained makeup texture.",
};

export const characterBodySectionEmptyFixture = {
  ...baseFixture,
  bodyPromptValue: "",
  fantasyPromptValue: "",
  realisticPromptValue: "",
};

export const characterBodySectionLongContentFixture = {
  ...baseFixture,
  bodyPromptValue:
    "This deliberately long body-note fixture verifies that the portable Character Body section remains readable when a creator supplies extensive physical guidance covering posture, musculature, silhouette, movement implications, scars, asymmetry, visible conditioning, practical limitations, and image-generation details without allowing the note field to disrupt the surrounding guided-control layout.",
  fantasyPromptValue:
    "This fantasy-only fixture verifies that short lane-specific guidance can add stylized rendering cues such as painterly smoke, cel-shaded shadows, dramatic silhouette treatment, and magical visual emphasis without replacing the shared canonical body prompt.",
  realisticPromptValue:
    "This realistic-only fixture verifies that short lane-specific guidance can add texture, believable anatomy emphasis, and restrained realism cues without replacing the shared canonical body prompt.",
};

export const characterBodySectionMissingCallbacksFixture = {
  ...characterBodySectionPopulatedFixture,
  onChangeBodyPrompt: null,
  onChangeFantasyPrompt: null,
  onChangeRealisticPrompt: null,
};
