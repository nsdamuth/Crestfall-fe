const noop = () => {};

const templateCards = [
  {
    id: "hero",
    sourceLabel: "Built-In",
    categoryLabel: "Classic",
    title: "Hero",
    description:
      "Courageous protagonist structure with duty, flaws, optimism, and adventure hooks.",
    prefillLabel: "Prefills",
    prefillSummary:
      "Identity, personality, speech style, clothing style, and creator notes.",
    actionLabel: "Apply Template",
  },
  {
    id: "princess",
    sourceLabel: "Built-In",
    categoryLabel: "Courtly",
    title: "Princess",
    description:
      "Elegant high-status character with obligation, grace, political pressure, and social expectations.",
    prefillLabel: "Prefills",
    prefillSummary:
      "Identity, personality, speech style, clothing style, and creator notes.",
    actionLabel: "Apply Template",
  },
  {
    id: "warrior",
    sourceLabel: "Built-In",
    categoryLabel: "Combat",
    title: "Warrior",
    description:
      "Disciplined fighter archetype with combat readiness, loyalty, and strength under pressure.",
    prefillLabel: "Prefills",
    prefillSummary:
      "Identity, personality, speech style, clothing style, and creator notes.",
    actionLabel: "Apply Template",
  },
  {
    id: "badass-biker",
    sourceLabel: "Built-In",
    categoryLabel: "Modern",
    title: "Badass Biker",
    description:
      "Rebellious modern archetype with crew loyalty, attitude, street pressure, and danger.",
    prefillLabel: "Prefills",
    prefillSummary:
      "Identity, personality, speech style, clothing style, and creator notes.",
    actionLabel: "Apply Template",
  },
];

const baseFixture = {
  eyebrow: "Character Templates",
  modalTitle: "Use Template",
  modalDescription:
    "Select a template to prefill character creation fields. This does not duplicate an existing character.",
  tabs: [
    { id: "BUILT_IN", label: "Built-In" },
    { id: "MY_TEMPLATES", label: "My Templates" },
    { id: "COMMUNITY", label: "Community" },
  ],
  activeTabId: "BUILT_IN",
  searchQuery: "",
  searchPlaceholder: "Search templates...",
  showTemplateGrid: true,
  templates: templateCards,
  emptyStateTitle: "Templates Soon",
  emptyStateDescription:
    "This tab will later show saved, shared, and managed character templates.",
  onClose: noop,
  onChooseTab: noop,
  onChangeSearchQuery: noop,
  onChooseTemplate: noop,
};

export const characterTemplateModalPopulatedFixture = {
  ...baseFixture,
};

export const characterTemplateModalFilteredFixture = {
  ...baseFixture,
  searchQuery: "warrior",
  templates: templateCards.filter((template) => template.id === "warrior"),
};

export const characterTemplateModalMyTemplatesFixture = {
  ...baseFixture,
  activeTabId: "MY_TEMPLATES",
  showTemplateGrid: false,
  templates: [],
  emptyStateTitle: "My Templates Soon",
};

export const characterTemplateModalCommunityFixture = {
  ...baseFixture,
  activeTabId: "COMMUNITY",
  showTemplateGrid: false,
  templates: [],
  emptyStateTitle: "Community Templates Soon",
};

export const characterTemplateModalEmptyFixture = {
  ...baseFixture,
  templates: [],
};

export const characterTemplateModalLongContentFixture = {
  ...baseFixture,
  modalDescription:
    "Select a template to prefill character creation fields while preserving the current creation workflow, existing character identity, and every field that is not supplied by the chosen template.",
  templates: [
    {
      ...templateCards[0],
      title:
        "The Reluctant Heir Who Must Reconcile Ancient Duty with a Dangerous Modern World",
      categoryLabel: "Courtly Adventure and Political Intrigue",
      description:
        "A deliberately long template description used to stress responsive wrapping, card height, modal scrolling, and action placement without exposing the underlying character-form payload to the View.",
      prefillSummary:
        "Identity, outward and internal personality, speech style, clothing style, creator notes, and several carefully coordinated narrative prompts.",
    },
    ...templateCards.slice(1),
  ],
};
