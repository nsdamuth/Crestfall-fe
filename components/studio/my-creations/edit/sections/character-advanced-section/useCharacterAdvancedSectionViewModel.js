const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Optional",
  sectionTitle: "Advanced Guidance",
  sectionDescription:
    "Advanced guidance is for power users who want deeper control. These fields are stored in the creation data payload.",
  greetingLabel: "Greeting",
  greetingPlaceholder: "Optional opening message.",
  relationshipLabel: "Relationship to Player",
  relationshipPlaceholder: "Optional starting relationship or dynamic.",
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
  creationType = "",
} = {}) {
  const data = form?.data || {};
  const normalizedCreationType = String(creationType || form?.type || "").toUpperCase();
  const isPlayerCharacter = normalizedCreationType === "PLAYER_CHARACTER";

  return {
    ...DEFAULT_COPY,
    sectionDescription: isPlayerCharacter
      ? "Optional advanced guidance for your Player Character. These fields shape Crestfall presentation and runtime context without changing player control."
      : DEFAULT_COPY.sectionDescription,
    showRelationshipToPlayer: !isPlayerCharacter,
    greetingValue: normalizeText(data.greeting),
    relationshipValue: normalizeText(data.relationship_to_player),
    appearanceNotesValue: normalizeText(data.appearance_notes),
    personalityNotesValue: normalizeText(data.personality_notes),
    runtimeNotesValue: normalizeText(data.extra_runtime_notes),
    creatorDirectivesValue: data.creator_directives,
    onChangeGreeting: (value) => updateDataField?.("greeting", value),
    onChangeRelationship: (value) =>
      updateDataField?.("relationship_to_player", value),
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
