const toneOptions = [
  { value: "", label: "Not chosen" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "MYSTERY", label: "Mystery" },
  { value: "DARK_FAIRYTALE", label: "Dark Fairytale" },
  { value: "NOIR", label: "Noir" },
  { value: "ROMANCE", label: "Romance" },
  { value: "HORROR", label: "Horror" },
  { value: "COMEDY", label: "Comedy" },
  { value: "POLITICAL_INTRIGUE", label: "Political Intrigue" },
];

const participantModeOptions = [
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "SOLO", label: "Solo" },
  { value: "GROUP_CAPABLE", label: "Group-capable" },
];

const baseFixture = {
  sectionEyebrow: "Scenario Editor",
  sectionTitle: "Scenario Identity",
  sectionDescription:
    "Define what this scenario is, who it is for, and how it should appear when reused in stories later.",
  toneLabel: "Tone",
  toneValue: "MYSTERY",
  toneOptions,
  participantModeLabel: "Participant Mode",
  participantModeValue: "FLEXIBLE",
  participantModeOptions,
  tagsLabel: "Tags",
  tagsValue: "mystery, investigation, urban fantasy",
  creationTypeLabel: "Creation Type",
  creationTypeValue: "SCENARIO",
  onSelectTone: null,
  onSelectParticipantMode: null,
  onChangeTags: null,
};

export const scenarioIdentitySectionDefaultFixture = {
  ...baseFixture,
};

export const scenarioIdentitySectionSoloRomanceFixture = {
  ...baseFixture,
  toneValue: "ROMANCE",
  participantModeValue: "SOLO",
  tagsValue: "romance, intimate, character-driven",
};

export const scenarioIdentitySectionGroupHorrorFixture = {
  ...baseFixture,
  toneValue: "HORROR",
  participantModeValue: "GROUP_CAPABLE",
  tagsValue: "horror, ensemble, survival",
};

export const scenarioIdentitySectionDefaultFallbackFixture = {
  ...baseFixture,
  toneValue: "",
  participantModeValue: "FLEXIBLE",
  tagsValue: "",
  creationTypeValue: "",
};

export const scenarioIdentitySectionNoOptionsFixture = {
  ...baseFixture,
  toneOptions: [],
  participantModeOptions: [],
};

export const scenarioIdentitySectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Scenario Identity for a Long-Running Group-Capable Political Mystery",
  sectionDescription:
    "Define how this reusable scenario should be categorized and discovered across long-running stories, flexible participant configurations, group-capable sessions, and interconnected political-intrigue workflows.",
  tagsValue:
    "political intrigue, long-running mystery, group-capable, faction conflict, hidden agenda, investigation, dramatic fantasy",
};

export const scenarioIdentitySectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Scenario Package",
  sectionTitle: "Playable Setup Identity",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  toneLabel: "Primary Mood",
  participantModeLabel: "Supported Cast",
  tagsLabel: "Discovery Tags",
  creationTypeLabel: "Package Type",
};

export const scenarioIdentitySectionMissingCallbacksFixture = {
  ...baseFixture,
  onSelectTone: null,
  onSelectParticipantMode: null,
  onChangeTags: null,
};
