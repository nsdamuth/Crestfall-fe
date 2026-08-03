import { buildStructuredRegistryBuilderTabs } from "./StructuredRegistryBuilder.contract";

const relationshipGroups = [
  {
    id: "linkedCharacters",
    label: "Participants / People",
    pickerTitle: "Link Participants / People",
    emptyLabel: "No participants linked yet.",
    addLabel: "Link Participant",
    allowedTypes: ["CHARACTER", "PLAYER_CHARACTER"],
  },
  {
    id: "linkedLocations",
    label: "Event Locations",
    pickerTitle: "Link Event Locations",
    emptyLabel: "No event locations linked yet.",
    addLabel: "Link Location",
    allowedTypes: ["LOCATION"],
  },
  {
    id: "linkedQuests",
    label: "Related Quest Registries",
    pickerTitle: "Link Related Quest Registries",
    emptyLabel: "No related quest registries linked yet.",
    addLabel: "Link Quest Registry",
    allowedTypes: ["QUEST_REGISTRY"],
  },
];

const config = {
  label: "Event Registry",
  eyebrow: "Continuity Ledger",
  builderTitle: "Event Registry Builder",
  description:
    "Create a reusable event ledger for incidents, discoveries, conflicts, and consequences.",
  futureUse:
    "Runtime modules can use this registry to preserve event continuity and surface consequences.",
  entryLabel: "Event",
  entryPluralLabel: "Events",
  entryPlaceholder: "Aethelred Tower Breach",
  categoryLabel: "Event Type",
  categoryOptions: ["Incident", "Discovery", "Investigation Beat", "Other"],
  relationshipLabel: "Participants / Locations",
  rulesLabel: "Consequences / Visibility Rules",
  promptLabel: "Event Prompt Guidance",
  futurePayload: "EVENT_REGISTRY",
  relationshipGroups,
};

const categoryOptions = config.categoryOptions.map((option) => ({
  value: option,
  label: option,
}));

const entries = [
  {
    id: "entry_oip_elevator",
    name: "The Elevator Arrives Twice",
    aliases: ["Duplicate Elevator Incident"],
    aliasesText: "Duplicate Elevator Incident",
    category: "Incident",
    summary: "Two elevators open onto the same floor from incompatible directions.",
    publicDescription:
      "An ordinary elevator malfunction produced incompatible witness accounts.",
    hiddenNotes:
      "The event expresses a partial convergence between unrelated case records.",
    visualIdentity:
      "Fluorescent elevator light, duplicate floor indicators, delayed timestamps.",
    relationshipNotes: "Can seed an OIP casework investigation.",
    rulesNotes: "Present as restrained anomaly pressure rather than catastrophe.",
    accessRules: "Surface at OIP Headquarters during elevated irregular pressure.",
    knowledgeRules: "Most staff know only that an elevator malfunction occurred.",
    consequences: "May create conflicting footage and a new investigation lead.",
    linkedCharacters: [
      {
        id: "link_lara",
        creationId: "character-lara",
        type: "CHARACTER",
        title: "Lara Hopkins",
        description: "OIP investigator",
        imageUrl: "",
        notes: "Potential witness interviewer.",
      },
    ],
    linkedLocations: [
      {
        id: "link_oip_hq",
        creationId: "location-oip-hq",
        type: "LOCATION",
        title: "Office of Irregular Phenomena Headquarters",
        description: "Primary event location.",
        imageUrl: "",
        notes: "Primary event location.",
      },
    ],
    linkedQuests: [],
  },
  {
    id: "entry_mirror_drift",
    name: "Mirror Drift",
    aliases: ["OIP Mirror Case"],
    aliasesText: "OIP Mirror Case",
    category: "Investigation Beat",
    summary: "Reflective glass briefly shows scenes out of sync with reality.",
    publicDescription: "Several shopkeepers report impossible reflections.",
    hiddenNotes: "Keep this optional and low pressure until the player engages.",
    visualIdentity: "Cloudy mirror glass and faint double-images.",
    relationshipNotes: "Old Crescent artisan shops.",
    rulesNotes: "Never override the current scene.",
    accessRules: "Surface near reflective surfaces or artisan complaints.",
    knowledgeRules: "Most characters know only rumors.",
    consequences: "May lead to a minor investigation.",
    linkedCharacters: [],
    linkedLocations: [],
    linkedQuests: [],
  },
];

const reviewPayload = {
  scope: "OIP Headquarters and Crestfall City irregular incidents",
  entries: entries.map(({ aliasesText, ...entry }) => entry),
  prompt_guidance: {
    summary: "Use these incidents as optional world pressure.",
    usageNotes: "Surface only when location and scene context support them.",
    negativePromptNotes: "Do not force catastrophic escalation.",
  },
  registry_kind: "EVENT_REGISTRY",
};

const baseFixture = {
  config,
  title: "OIP Irregular Incident Queue",
  description:
    "Tracks irregular incidents, fragmented evidence, and restrained anomaly pressure.",
  scope: "OIP Headquarters and Crestfall City",
  entries,
  activeEntryId: entries[0].id,
  activeEntry: entries[0],
  promptGuidance: reviewPayload.prompt_guidance,
  reviewPayloadText: JSON.stringify(reviewPayload, null, 2),
  tabs: buildStructuredRegistryBuilderTabs("overview"),
  activeTab: "overview",
  hideTabs: false,
  isEditMode: false,
  saveStatus: "idle",
  saveMessage: "",
  categoryOptions,
};

export const structuredRegistryBuilderOverviewFixture = {
  ...baseFixture,
};

export const structuredRegistryBuilderEntriesFixture = {
  ...baseFixture,
  tabs: buildStructuredRegistryBuilderTabs("entries"),
  activeTab: "entries",
};

export const structuredRegistryBuilderRelationshipsFixture = {
  ...baseFixture,
  tabs: buildStructuredRegistryBuilderTabs("relationships"),
  activeTab: "relationships",
};

export const structuredRegistryBuilderRulesFixture = {
  ...baseFixture,
  tabs: buildStructuredRegistryBuilderTabs("rules"),
  activeTab: "rules",
};

export const structuredRegistryBuilderPromptFixture = {
  ...baseFixture,
  tabs: buildStructuredRegistryBuilderTabs("prompt"),
  activeTab: "prompt",
};

export const structuredRegistryBuilderReviewFixture = {
  ...baseFixture,
  tabs: buildStructuredRegistryBuilderTabs("review"),
  activeTab: "review",
};

export const structuredRegistryBuilderEditFixture = {
  ...baseFixture,
  tabs: buildStructuredRegistryBuilderTabs("entries"),
  activeTab: "entries",
  hideTabs: true,
  isEditMode: true,
};

export const structuredRegistryBuilderSavingFixture = {
  ...baseFixture,
  saveStatus: "saving",
  saveMessage: "Saving Event Registry draft...",
};

export const structuredRegistryBuilderErrorFixture = {
  ...baseFixture,
  saveStatus: "error",
  saveMessage: "Event Registry could not be saved.",
};
