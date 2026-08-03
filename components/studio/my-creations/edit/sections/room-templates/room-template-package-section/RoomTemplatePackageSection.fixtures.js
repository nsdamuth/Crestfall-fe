const selectedCharactersPanelProps = {
  characters: [
    {
      id: "character-captain-vale",
      title: "Captain Vale",
      subtitle: "Expedition commander",
      initial: "C",
    },
    {
      id: "character-mira-ashfall",
      title: "Mira Ashfall",
      subtitle: "Arcane cartographer",
      initial: "M",
    },
  ],
  onOpenCharacterPicker: null,
  onRemoveCharacter: null,
};

const scenarioRecommendationsPanelProps = {
  requiredCharacterTitles: ["Captain Vale"],
  optionalCharacterTitles: ["Mira Ashfall"],
  suggestedLocationTitle: "The Brass Observatory",
  suggestedNarratorTitle: "The Chronicle Keeper",
  suggestedNpcRegistryTitles: ["Observatory Staff"],
  canApplyRequiredCharacters: true,
  canApplyOptionalCharacters: true,
  canApplySuggestedLocation: true,
  canApplySuggestedNarrator: true,
  canApplySuggestedNpcRegistries: true,
  onApplyAll: null,
  onApplyRequiredCharacters: null,
  onApplyOptionalCharacters: null,
  onApplySuggestedLocation: null,
  onApplySuggestedNarrator: null,
  onApplySuggestedNpcRegistries: null,
  onSkipRecommendations: null,
};

const selectionCards = [
  {
    id: "scenario",
    iconName: "scenario",
    label: "Scenario",
    value: {
      title: "The Last Light of Orison",
      subtitle: "A sealed observatory and a failing star map.",
    },
    placeholder: "Select Scenario",
    onOpen: null,
  },
  {
    id: "narrator",
    iconName: "narrator",
    label: "Narrator",
    value: {
      title: "The Chronicle Keeper",
      subtitle: "Measured, atmospheric guidance",
    },
    placeholder: "Select Narrator",
    onOpen: null,
  },
  {
    id: "location",
    iconName: "location",
    label: "Location / Scene",
    value: {
      title: "The Brass Observatory",
      subtitle: "An abandoned celestial archive",
    },
    placeholder: "Optional Location",
    onOpen: null,
  },
];

const pickerViewProps = {
  eyebrow: "Story Picker",
  title: "Select Scenario",
  description:
    "Choose from your available Crestfall creations. Scenario recommendations are marked when available, but the room package remains editable.",
  iconName: "scenario",
  items: [
    {
      id: "scenario-last-light",
      title: "The Last Light of Orison",
      subtitle: "A sealed observatory and a failing star map.",
      type: "SCENARIO",
      contentRating: "SFW",
      imageUrl: null,
    },
    {
      id: "scenario-ember-road",
      title: "The Ember Road",
      subtitle: "A caravan crosses a kingdom under siege.",
      type: "SCENARIO",
      contentRating: "SFW",
      imageUrl: null,
    },
  ],
  selectedIds: ["scenario-last-light"],
  recommendedIds: ["scenario-last-light"],
  searchPlaceholder: "Search...",
  emptyMessage: "No scenarios found.",
  onClose: null,
  onChooseItem: null,
};

const baseFixture = {
  sectionEyebrow: "Story Editor",
  sectionTitle: "Story Package",
  sectionDescription:
    "Choose the actual ingredients that make this Story. Scenario recommendations can be applied, skipped, or replaced.",
  selectedCharactersPanelProps,
  showScenarioRecommendations: false,
  scenarioRecommendationsPanelProps,
  selectionCards,
  referenceLoadError: "",
  pickerViewProps: null,
};

export const roomTemplatePackageSectionDefaultFixture = {
  ...baseFixture,
};

export const roomTemplatePackageSectionRecommendationsFixture = {
  ...baseFixture,
  showScenarioRecommendations: true,
};

export const roomTemplatePackageSectionEmptyFixture = {
  ...baseFixture,
  selectedCharactersPanelProps: {
    characters: [],
    onOpenCharacterPicker: null,
    onRemoveCharacter: null,
  },
  selectionCards: selectionCards.map((card) => ({
    ...card,
    value: null,
  })),
};

export const roomTemplatePackageSectionLoadErrorFixture = {
  ...baseFixture,
  referenceLoadError: "Room template references could not be loaded.",
};

export const roomTemplatePackageSectionPickerFixture = {
  ...baseFixture,
  pickerViewProps,
};

export const roomTemplatePackageSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle: "Story Package for the Observatory Chronicle",
  sectionDescription:
    "Choose the characters, scenario, narrator, location, and recommended NPC registries that define this reusable Story package across longer ensemble sessions and multiple player perspectives.",
  selectedCharactersPanelProps: {
    ...selectedCharactersPanelProps,
    characters: [
      ...selectedCharactersPanelProps.characters,
      {
        id: "character-orrin",
        title: "Archivist Orrin of the Seventh Vault",
        subtitle: "Keeper of the observatory's sealed records",
        initial: "A",
      },
    ],
  },
};

export const roomTemplatePackageSectionMissingCallbacksFixture = {
  ...baseFixture,
};
