// Terminology map (4.6, D8/F2, ED1G): a raw data-layer enum never
// surfaces to the screen.
const CREATION_TYPE_LABELS = Object.freeze({
  SCENARIO: "Scenario",
});

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Scenario Identity",
  sectionDescription:
    "Define what this scenario is, who it is for, and how it should appear when reused in stories later.",
  toneLabel: "Tone",
  participantModeLabel: "Participant Mode",
  tagsLabel: "Tags",
  creationTypeLabel: "Creation Type",
});

export const SCENARIO_TONE_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "MYSTERY", label: "Mystery" },
  { value: "DARK_FAIRYTALE", label: "Dark Fairytale" },
  { value: "NOIR", label: "Noir" },
  { value: "ROMANCE", label: "Romance" },
  { value: "HORROR", label: "Horror" },
  { value: "COMEDY", label: "Comedy" },
  { value: "POLITICAL_INTRIGUE", label: "Political Intrigue" },
]);

export const SCENARIO_PARTICIPANT_MODE_OPTIONS = Object.freeze([
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "SOLO", label: "Solo" },
  { value: "GROUP_CAPABLE", label: "Group-capable" },
]);

export function formatScenarioIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parseScenarioIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getScenarioIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    toneValue: data.tone || "",
    toneOptions: SCENARIO_TONE_OPTIONS,
    participantModeValue: data.participant_mode || "FLEXIBLE",
    participantModeOptions: SCENARIO_PARTICIPANT_MODE_OPTIONS,
    tagsValue: formatScenarioIdentityTags(data.tags),
    creationTypeValue: CREATION_TYPE_LABELS[form?.type] || form?.type || "",
    onSelectTone: (value) => updateDataField?.("tone", value),
    onSelectParticipantMode: (value) =>
      updateDataField?.("participant_mode", value),
    onChangeTags: (value) =>
      updateDataField?.("tags", parseScenarioIdentityTags(value)),
  };
}

export function useScenarioIdentitySectionViewModel(props = {}) {
  return getScenarioIdentitySectionViewProps(props);
}
