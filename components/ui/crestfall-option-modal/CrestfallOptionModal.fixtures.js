const noop = () => {};

const fantasyOptions = [
  { key: "none", id: "", label: "None", icon: null, selected: false },
  {
    key: "custom",
    id: "CUSTOM",
    label: "Custom",
    icon: null,
    selected: false,
  },
  {
    key: "adventurer",
    id: "ADVENTURER",
    label: "Adventurer",
    icon: null,
    selected: true,
  },
  {
    key: "artificer",
    id: "ARTIFICER",
    label: "Artificer",
    icon: "i-12",
    selected: false,
  },
  {
    key: "bard",
    id: "BARD",
    label: "Bard",
    icon: null,
    selected: false,
  },
  {
    key: "scholar",
    id: "SCHOLAR",
    label: "Scholar",
    icon: "i-28",
    selected: false,
  },
];

const modernOptions = [
  { key: "none", id: "", label: "None", icon: null, selected: false },
  {
    key: "custom",
    id: "CUSTOM",
    label: "Custom",
    icon: null,
    selected: false,
  },
  {
    key: "detective",
    id: "DETECTIVE",
    label: "Detective",
    icon: "i-14",
    selected: false,
  },
  {
    key: "doctor",
    id: "DOCTOR",
    label: "Doctor",
    icon: null,
    selected: false,
  },
  {
    key: "journalist",
    id: "JOURNALIST",
    label: "Journalist",
    icon: null,
    selected: false,
  },
];

const baseFixture = {
  open: true,
  title: "Select Role Archetype",
  triggerLabel: "Role Archetype",
  selectedLabel: "Adventurer",
  searchQuery: "",
  searchPlaceholder: "Search options...",
  groups: ["Fantasy", "Modern", "Sci-Fi"],
  activeGroup: "Fantasy",
  customMode: false,
  customEyebrow: "Custom Role Archetype",
  customValue: "",
  customPlaceholder: "Type a custom role...",
  options: fantasyOptions,
  columns: 3,
  onOpen: noop,
  onClose: noop,
  onSearchQueryChange: noop,
  onChooseGroup: noop,
  onChooseOption: noop,
  onCustomValueChange: noop,
  onBackFromCustom: noop,
  onUseCustom: noop,
};

export const crestfallOptionModalClosedFixture = {
  ...baseFixture,
  open: false,
};

export const crestfallOptionModalGroupedFixture = {
  ...baseFixture,
};

export const crestfallOptionModalModernFixture = {
  ...baseFixture,
  selectedLabel: "Not chosen",
  activeGroup: "Modern",
  options: modernOptions,
};

export const crestfallOptionModalCustomFixture = {
  ...baseFixture,
  customMode: true,
  customValue: "Reluctant occult investigator",
};

export const crestfallOptionModalNoResultsFixture = {
  ...baseFixture,
  searchQuery: "unmatched role",
  options: [],
};

export const crestfallOptionModalLongContentFixture = {
  ...baseFixture,
  title: "Select a Detailed Narrative and Occupational Role Archetype",
  triggerLabel: "Primary Narrative Role Archetype",
  selectedLabel:
    "Independent Investigator of Supernatural and Interdimensional Phenomena",
  options: [
    ...fantasyOptions.slice(0, 2),
    {
      key: "long-option",
      id: "INTERDIMENSIONAL_INVESTIGATOR",
      label:
        "Independent Investigator of Supernatural and Interdimensional Phenomena",
      icon: "i-61",
      selected: true,
    },
  ],
};
