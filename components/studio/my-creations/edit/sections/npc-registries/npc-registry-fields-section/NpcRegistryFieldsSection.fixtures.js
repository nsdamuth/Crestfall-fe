const baseFixture = {
  sectionEyebrow: "NPC Registry Editor",
  registryTitleValue: "Old Crescent People",
  scopeValue: "Old Crescent shops and attached story rooms",
  descriptionValue:
    "Tracks recurring residents, relationships, knowledge boundaries, and public identities in the Old Crescent.",
  descriptionPlaceholder:
    "Describe what this registry tracks and where it should be used.",
  creationTypeValue: "NPC_REGISTRY",
  entryCountValue: "3",
  relationshipCountValue: "2",
  knowledgeRuleCountValue: "1",
  primaryActionDisabled: false,
  helperMessage: "",
  cards: [],
  emptyMessage: "",
  loadError: "",
  onChangeRegistryTitle: null,
  onChangeScope: null,
  onChangeDescription: null,
  onPrimaryAction: null,
};

export const npcRegistryFieldsOverviewFixture = {
  ...baseFixture,
  activeSection: "overview",
  sectionTitle: "Registry Overview",
  sectionDescription:
    "Edit the registry metadata and scope shown in My Creations and future registry pickers.",
  primaryActionLabel: "",
};

export const npcRegistryFieldsEntriesFixture = {
  ...baseFixture,
  activeSection: "entries",
  sectionTitle: "People Entries",
  sectionDescription:
    "Add linked characters, player characters, or lightweight NPCs that should remain consistent across attached rooms.",
  primaryActionLabel: "Add Person",
  emptyMessage: "No people entries yet.",
  cards: [
    {
      id: "entry-kessa",
      eyebrow: "Linked Creation",
      title: "Kessa Cindervell",
      body: "Artificer, appraiser, and recurring Old Crescent resident.",
      imageUrl: "/assets/covers/profile.png",
      registryNotes: "Keeps a guarded workshop in the trade district.",
      meta: "CHARACTER · APPROVED · PRIVATE · SFW",
      footer: "Mechanics follow the linked Character creation.",
      referenceWarning: "",
      onEdit: null,
      onDelete: null,
    },
    {
      id: "entry-marlowe",
      eyebrow: "Lightweight NPC",
      title: "Marlowe",
      body: "Workshop assistant and resonance-instrument specialist.",
      meta: "Actor Mechanics: Old Crescent Sparse NPC Progression",
      onEdit: null,
      onDelete: null,
    },
  ],
};

export const npcRegistryFieldsRelationshipsFixture = {
  ...baseFixture,
  activeSection: "relationships",
  sectionTitle: "Relationships",
  sectionDescription:
    "Define directional or mutual links between people entries.",
  primaryActionLabel: "Add Relationship",
  emptyMessage: "No relationships yet.",
  cards: [
    {
      id: "relationship-mentor",
      eyebrow: "Mentor · STRONG",
      title: "Kessa Cindervell → Marlowe",
      body: "Kessa trusts Marlowe with delicate workshop instruments.",
      onEdit: null,
      onDelete: null,
    },
  ],
};

export const npcRegistryFieldsKnowledgeFixture = {
  ...baseFixture,
  activeSection: "knowledge",
  sectionTitle: "Knowledge Rules",
  sectionDescription:
    "Control what people know, suspect, falsely believe, or are forbidden from knowing unless story events expose it.",
  primaryActionLabel: "Add Knowledge Rule",
  emptyMessage: "No knowledge rules yet.",
  cards: [
    {
      id: "knowledge-mirror-drift",
      eyebrow: "Default: RUMOR",
      title: "Mirror Drift complaints",
      body: "Marlowe knows specific reports; most residents know only rumors.",
      onEdit: null,
      onDelete: null,
    },
  ],
};

export const npcRegistryFieldsAliasesFixture = {
  ...baseFixture,
  activeSection: "aliases",
  sectionTitle: "Aliases & Secret Identities",
  sectionDescription:
    "Map public identities, disguises, and secret identities to one canonical person.",
  primaryActionLabel: "Add Alias Rule",
  emptyMessage: "No alias rules yet.",
  cards: [
    {
      id: "alias-brasswhisker",
      eyebrow: "Alias Mapping",
      title: "The Brasswhisker = Kessa Cindervell",
      body: "Use the title publicly in trade-district and workshop scenes.",
      onEdit: null,
      onDelete: null,
    },
  ],
};

export const npcRegistryFieldsEmptyFixture = {
  ...baseFixture,
  activeSection: "entries",
  sectionTitle: "People Entries",
  sectionDescription:
    "Add linked characters, player characters, or lightweight NPCs that should remain consistent across attached rooms.",
  entryCountValue: "0",
  relationshipCountValue: "0",
  knowledgeRuleCountValue: "0",
  primaryActionLabel: "Add Person",
  cards: [],
  emptyMessage: "No people entries yet.",
};

export const npcRegistryFieldsBlockedRelationshipFixture = {
  ...baseFixture,
  activeSection: "relationships",
  sectionTitle: "Relationships",
  sectionDescription:
    "Define directional or mutual links between people entries.",
  entryCountValue: "1",
  relationshipCountValue: "0",
  primaryActionLabel: "Add Relationship",
  primaryActionDisabled: true,
  helperMessage:
    "Add at least two people entries before creating relationships.",
  cards: [],
  emptyMessage: "No relationships yet.",
};

export const npcRegistryFieldsLoadErrorFixture = {
  ...npcRegistryFieldsEntriesFixture,
  loadError: "Character options could not be loaded.",
};
