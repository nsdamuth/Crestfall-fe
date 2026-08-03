const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Optional",
  sectionTitle: "Advanced Guidance",
  sectionDescription:
    "Advanced guidance is for power users who want deeper control. These fields are stored in the creation data payload.",
  greetingLabel: "Greeting",
  greetingPlaceholder: "Optional opening message.",
  scenarioLabel: "Scenario",
  scenarioPlaceholder: "Optional scenario/premise setup.",
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

function normalizeText(value) {
  return typeof value === "string" ? value : "";
}

export function getCharacterAdvancedSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    greetingValue: normalizeText(data.greeting),
    scenarioValue: normalizeText(data.scenario),
    relationshipValue: normalizeText(data.relationship_to_player),
    backstoryValue: normalizeText(data.backstory),
    appearanceNotesValue: normalizeText(data.appearance_notes),
    personalityNotesValue: normalizeText(data.personality_notes),
    runtimeNotesValue: normalizeText(data.extra_runtime_notes),
    creatorDirectivesValue: data.creator_directives,
    onChangeGreeting: (value) => updateDataField?.("greeting", value),
    onChangeScenario: (value) => updateDataField?.("scenario", value),
    onChangeRelationship: (value) =>
      updateDataField?.("relationship_to_player", value),
    onChangeBackstory: (value) => updateDataField?.("backstory", value),
    onChangeAppearanceNotes: (value) =>
      updateDataField?.("appearance_notes", value),
    onChangePersonalityNotes: (value) =>
      updateDataField?.("personality_notes", value),
    onChangeRuntimeNotes: (value) =>
      updateDataField?.("extra_runtime_notes", value),
    onChangeCreatorDirectives: (value) =>
      updateDataField?.("creator_directives", value),
  };
}

export function useCharacterAdvancedSectionViewModel(props = {}) {
  return getCharacterAdvancedSectionViewProps(props);
}
