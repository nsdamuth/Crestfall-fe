const baseFixture = Object.freeze({
  sectionEyebrow: "Optional",
  sectionTitle: "Advanced Guidance",
  sectionDescription:
    "Advanced guidance is for power users who want deeper control. These fields are stored in the creation data payload.",
  greetingLabel: "Greeting",
  greetingPlaceholder: "Optional opening message.",
  showRelationshipToPlayer: true,
  relationshipLabel: "Relationship to Player",
  relationshipPlaceholder: "Optional starting relationship or dynamic.",
  appearanceNotesLabel: "Appearance Notes",
  appearanceNotesPlaceholder: "Optional advanced appearance guidance.",
  personalityNotesLabel: "Personality Notes",
  personalityNotesPlaceholder: "Optional deeper personality instructions.",
  runtimeNotesLabel: "Extra Runtime Notes",
  runtimeNotesPlaceholder: "Optional runtime edge-case instructions.",
});

export const characterAdvancedSectionPopulatedFixture = {
  ...baseFixture,
  greetingValue:
    "*The workshop bell gives a suspicious second chime.* \"Do not touch that. It has opinions.\"",
  relationshipValue:
    "She initially treats the player as a possible customer, possible hazard, and possible source of interesting trouble.",
  appearanceNotesValue:
    "Keep her recognizably feline without making her fully animal; emphasize brass tools, expressive posture, and practical workwear.",
  personalityNotesValue:
    "Her curiosity is tactile and predatory rather than careless. She respects honest trade and reacts seriously to damaged tools.",
  runtimeNotesValue:
    "Actions use single asterisks, dialogue uses quotation marks, and responses should remain grounded in the current object or problem.",
};

export const characterAdvancedSectionEmptyFixture = {
  ...baseFixture,
  greetingValue: "",
  relationshipValue: "",
  appearanceNotesValue: "",
  personalityNotesValue: "",
  runtimeNotesValue: "",
};

export const characterAdvancedSectionLongContentFixture = {
  ...baseFixture,
  greetingValue:
    "This deliberately long greeting fixture verifies that the portable layout remains readable when the opening message contains several paragraphs of environmental description, character movement, dialogue, and scene framing without changing the application-owned storage or advanced-prompting behavior.",
  relationshipValue:
    "The relationship begins with uncertainty and conditional cooperation, develops through observed behavior rather than automatic trust, and preserves the character's boundaries even when affection, rivalry, obligation, or shared danger becomes relevant.",
  appearanceNotesValue:
    "Appearance guidance remains detailed enough to preserve silhouette, materials, expressions, scars, posture, movement, and visual exclusions while still allowing scene lighting, clothing changes, and rendering style to vary naturally.",
  personalityNotesValue:
    "Personality guidance describes motives, contradictions, boundaries, habits, emotional defenses, social expectations, and anti-drift instructions in enough detail to test long-form text wrapping and editing.",
  runtimeNotesValue:
    "Runtime notes describe formatting, pacing, scene grounding, memory limits, response length, narration conventions, escalation boundaries, and handling of uncertain information without introducing persistence behavior into the portable View.",
};

export const characterAdvancedSectionMissingCallbacksFixture = {
  ...characterAdvancedSectionPopulatedFixture,
  onChangeGreeting: null,
  onChangeRelationship: null,
  onChangeAppearanceNotes: null,
  onChangePersonalityNotes: null,
  onChangeRuntimeNotes: null,
};

export const playerCharacterAdvancedSectionFixture = {
  ...characterAdvancedSectionPopulatedFixture,
  sectionDescription:
    "Optional advanced guidance for your Player Character. These fields shape Crestfall presentation and runtime context without changing player control.",
  showRelationshipToPlayer: false,
};
