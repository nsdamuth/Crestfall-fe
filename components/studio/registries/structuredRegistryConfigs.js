export const STRUCTURED_REGISTRY_TYPES = [
  "ORGANIZATION_REGISTRY",
  "FACTION_REGISTRY",
  "EVENT_REGISTRY",
  "QUEST_REGISTRY",
];
const DEFAULT_RELATIONSHIP_GROUPS = [
  {
    id: "linkedCharacters",
    label: "Linked Characters / People",
    pickerTitle: "Link Characters / People",
    emptyLabel: "No linked characters yet.",
    addLabel: "Link Character",
    allowedTypes: ["CHARACTER", "PLAYER_CHARACTER"],
  },
  {
    id: "linkedLocations",
    label: "Linked Locations",
    pickerTitle: "Link Locations",
    emptyLabel: "No linked locations yet.",
    addLabel: "Link Location",
    allowedTypes: ["LOCATION"],
  },
  {
    id: "linkedOrganizations",
    label: "Linked Organizations / Factions / Systems",
    pickerTitle: "Link Organizations / Factions",
    emptyLabel: "No linked organizations or factions yet.",
    addLabel: "Link Organization / Faction",
    allowedTypes: ["ORGANIZATION_REGISTRY", "FACTION_REGISTRY"],
  },
];
export const STRUCTURED_REGISTRY_CONFIGS = {
  ORGANIZATION_REGISTRY: {
    label: "Organization Registry",
    eyebrow: "Institution Spine",
    createTitle: "Organization Registry",
    builderTitle: "Organization Registry Builder",
    description:
      "Create a reusable organization spine for companies, agencies, clubs, schools, churches, teams, departments, branches, shell companies, and formal groups.",
    futureUse:
      "Runtime modules can later use Organization Registries to resolve institutional authority, membership, public identity, owned locations, departments, and hidden structures.",
    entryLabel: "Organization",
    entryPluralLabel: "Organizations",
    entryPlaceholder: "Aethelred Enterprises",
    categoryLabel: "Organization Type",
    categoryOptions: [
      "Company",
      "Agency",
      "Club",
      "School",
      "Church / Temple",
      "Team",
      "Department",
      "Shell Company",
      "Criminal Organization",
      "Public Institution",
      "Other",
    ],
    relationshipLabel: "Network / Relationships",
    rulesLabel: "Authority / Access Rules",
    promptLabel: "Institution Prompt Guidance",
    futurePayload: "ORGANIZATION_REGISTRY",
  },

  FACTION_REGISTRY: {
    label: "Faction Registry",
    eyebrow: "Power Spine",
    createTitle: "Faction Registry",
    builderTitle: "Faction Registry Builder",
    description:
      "Create a reusable faction-continuity spine for alliances, rivalries, territory, influence, leadership, knowledge, and pressure.",
    futureUse:
      "Runtime modules can later use Faction Registries to resolve political pressure, faction behavior, influence shifts, territorial control, and believable conflict escalation.",
    entryLabel: "Faction",
    entryPluralLabel: "Factions",
    entryPlaceholder: "Aethelred Network",
    categoryLabel: "Faction Type",
    categoryOptions: [
      "Corporate Power",
      "Government",
      "Criminal",
      "Religious / Occult",
      "Military / Security",
      "Street Group",
      "Political Bloc",
      "Hidden Network",
      "Independent Cell",
      "Other",
    ],
    relationshipLabel: "Alliances / Rivalries",
    rulesLabel: "Influence / Knowledge Rules",
    promptLabel: "Faction Prompt Guidance",
    futurePayload: "FACTION_REGISTRY",
  },

  EVENT_REGISTRY: {
    label: "Event Registry",
    eyebrow: "Continuity Ledger",
    createTitle: "Event Registry",
    builderTitle: "Event Registry Builder",
    description:
      "Create a reusable event ledger for incidents, scandals, holidays, conflicts, consequences, discoveries, and world-shaping history.",
    futureUse:
      "Runtime modules can later use Event Registries to prevent history drift, surface consequences, remember incidents, and keep world-shaping events active.",
    entryLabel: "Event",
    entryPluralLabel: "Events",
    entryPlaceholder: "Aethelred Tower Breach",
    categoryLabel: "Event Type",
    categoryOptions: [
      "Incident",
      "Scandal",
      "Battle / Conflict",
      "Holiday / Festival",
      "Disaster",
      "Discovery",
      "Meeting",
      "Investigation Beat",
      "Historical Event",
      "Recurring Event",
      "Other",
    ],
    relationshipLabel: "Participants / Locations",
    rulesLabel: "Consequences / Visibility Rules",
    promptLabel: "Event Prompt Guidance",
    futurePayload: "EVENT_REGISTRY",
    relationshipGroups: [{
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
        id: "linkedOrganizations",
        label: "Organizations / Factions / Systems",
        pickerTitle: "Link Organizations / Factions",
        emptyLabel: "No organizations or factions linked yet.",
        addLabel: "Link Organization / Faction",
        allowedTypes: ["ORGANIZATION_REGISTRY", "FACTION_REGISTRY"],
      },
      {
        id: "linkedEvents",
        label: "Related Event Registries",
        pickerTitle: "Link Related Event Registries",
        emptyLabel: "No related event registries linked yet.",
        addLabel: "Link Event Registry",
        allowedTypes: ["EVENT_REGISTRY"],
      },
      {
        id: "linkedQuests",
        label: "Related Quest Registries",
        pickerTitle: "Link Related Quest Registries",
        emptyLabel: "No related quest registries linked yet.",
        addLabel: "Link Quest Registry",
        allowedTypes: ["QUEST_REGISTRY"],
      },
    ],
  },

  QUEST_REGISTRY: {
    label: "Quest Registry",
    eyebrow: "Objective Spine",
    createTitle: "Quest Registry",
    builderTitle: "Quest Registry Builder",
    description:
      "Create a reusable quest spine for hooks, tasks, leads, requirements, branches, rewards, unresolved objectives, and soft side-quest logic.",
    futureUse:
      "Runtime modules can later use Quest Registries to surface hooks, preserve unresolved objectives, track branches, enforce requirements, and resolve soft quest progress without relying on prompt memory.",
    entryLabel: "Quest",
    entryPluralLabel: "Quests",
    entryPlaceholder: "OIP Case File: Mirror Drift",
    categoryLabel: "Quest Type",
    categoryOptions: [
      "Investigation",
      "Job Posting",
      "Side Quest",
      "Faction Task",
      "Social Objective",
      "Exploration",
      "Delivery / Retrieval",
      "Mystery",
      "Relationship Quest",
      "Hidden Route",
      "Recurring Objective",
      "Other",
    ],
    relationshipLabel: "Leads / Requirements",
    rulesLabel: "Branches / Outcomes",
    promptLabel: "Quest Prompt Guidance",
    futurePayload: "QUEST_REGISTRY",
    relationshipGroups: [
  {
    id: "linkedCharacters",
    label: "Linked Characters / People",
    pickerTitle: "Link Characters / People",
    emptyLabel: "No linked characters yet.",
    addLabel: "Link Character",
    allowedTypes: ["CHARACTER", "PLAYER_CHARACTER"],
  },
  {
    id: "linkedLocations",
    label: "Linked Locations",
    pickerTitle: "Link Locations",
    emptyLabel: "No linked locations yet.",
    addLabel: "Link Location",
    allowedTypes: ["LOCATION"],
  },
  {
    id: "linkedOrganizations",
    label: "Linked Organizations / Factions / Systems",
    pickerTitle: "Link Organizations / Factions",
    emptyLabel: "No organizations or factions linked yet.",
    addLabel: "Link Organization / Faction",
    allowedTypes: ["ORGANIZATION_REGISTRY", "FACTION_REGISTRY"],
  },
  {
    id: "linkedEvents",
    label: "Related Event Registries",
    pickerTitle: "Link Related Event Registries",
    emptyLabel: "No related event registries linked yet.",
    addLabel: "Link Event Registry",
    allowedTypes: ["EVENT_REGISTRY"],
  },
  {
    id: "linkedQuests",
    label: "Related Quest Registries",
    pickerTitle: "Link Related Quest Registries",
    emptyLabel: "No related quest registries linked yet.",
    addLabel: "Link Quest Registry",
    allowedTypes: ["QUEST_REGISTRY"],
  },
],
  },
};

export function getStructuredRegistryConfig(registryType) {
  const config =
    STRUCTURED_REGISTRY_CONFIGS[registryType] ||
    STRUCTURED_REGISTRY_CONFIGS.ORGANIZATION_REGISTRY;

  return {
    ...config,
    relationshipGroups: config.relationshipGroups || DEFAULT_RELATIONSHIP_GROUPS,
  };
}

export function isStructuredRegistryType(type) {
  return STRUCTURED_REGISTRY_TYPES.includes(String(type || "").toUpperCase());
}