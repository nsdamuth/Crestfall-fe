const baseFixture = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Body",
  sectionDescription:
    "Edit physical silhouette fields using the same guided controls from character creation.",
  bodyNotesLabel: "Custom Body Notes",
  bodyNotesPlaceholder:
    "Optional physical details that should affect image generation or narration.",
});

export const characterBodySectionPopulatedFixture = {
  ...baseFixture,
  bodyNotesValue:
    "Lean waist, dense fighter-level musculature, powerful legs, defined shoulders, and a balanced athletic silhouette.",
};

export const characterBodySectionEmptyFixture = {
  ...baseFixture,
  bodyNotesValue: "",
};

export const characterBodySectionLongContentFixture = {
  ...baseFixture,
  bodyNotesValue:
    "This deliberately long body-note fixture verifies that the portable Character Body section remains readable when a creator supplies extensive physical guidance covering posture, musculature, silhouette, movement implications, scars, asymmetry, visible conditioning, practical limitations, and image-generation details without allowing the note field to disrupt the surrounding guided-control layout.",
};

export const characterBodySectionMissingCallbacksFixture = {
  ...characterBodySectionPopulatedFixture,
  onChangeBodyNotes: null,
};
