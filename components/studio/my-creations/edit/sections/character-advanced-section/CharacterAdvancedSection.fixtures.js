const baseFixture = Object.freeze({
  sectionEyebrow: "Optional",
  sectionTitle: "Advanced Guidance",
  sectionDescription:
    "Advanced guidance is for power users who want deeper control. These fields are stored in the creation data payload.",
  greetingLabel: "Greeting",
  greetingPlaceholder: "Optional opening message.",
  scenarioLabel: "Scenario",
  scenarioPlaceholder: "Optional scenario/premise setup.",
  showRelationshipToPlayer: true,
  relationshipLabel: "Relationship to Player",
  relationshipPlaceholder: "Optional starting relationship or dynamic.",
  backstoryLabel: "Backstory",
  backstoryPlaceholder: "Optional history, origins, or important past events.",
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
  scenarioValue:
    "The player arrives during an appraisal involving a cursed object, a dishonest seller, and a mechanism that has started counting down.",
  relationshipValue:
    "She initially treats the player as a possible customer, possible hazard, and possible source of interesting trouble.",
  backstoryValue:
    "She grew up among traders, jewelers, lockmakers, and artificers before turning her sensitivity to enchanted objects into a profession.",
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
  scenarioValue: "",
  relationshipValue: "",
  backstoryValue: "",
  appearanceNotesValue: "",
  personalityNotesValue: "",
  runtimeNotesValue: "",
};

export const characterAdvancedSectionLongContentFixture = {
  ...baseFixture,
  greetingValue:
    "This deliberately long greeting fixture verifies that the portable layout remains readable when the opening message contains several paragraphs of environmental description, character movement, dialogue, and scene framing without changing the application-owned storage or advanced-prompting behavior.",
  scenarioValue:
    "A long scenario fixture covers the immediate premise, active pressure, likely participants, environmental constraints, pacing guidance, expected sources of conflict, and the kinds of choices that should remain available to the player throughout the opening scene.",
  relationshipValue:
    "The relationship begins with uncertainty and conditional cooperation, develops through observed behavior rather than automatic trust, and preserves the character's boundaries even when affection, rivalry, obligation, or shared danger becomes relevant.",
  backstoryValue:
    "The backstory fixture spans formative experiences, professional training, important losses, unresolved obligations, institutional relationships, and the specific history that should influence present decisions without forcing exposition into every response.",
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
  onChangeScenario: null,
  onChangeRelationship: null,
  onChangeBackstory: null,
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
