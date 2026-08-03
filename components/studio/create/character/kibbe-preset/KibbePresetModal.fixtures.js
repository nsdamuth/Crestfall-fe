const noop = () => {};

export const kibbePresetModalIdentityOptionsFixture = [
  {
    value: "",
    label: "Not chosen",
    description: "Do not use a Kibbe-inspired silhouette identity.",
  },
  {
    value: "DRAMATIC",
    label: "Dramatic",
    description: "Long, sleek, and sharply defined visual lines.",
  },
  {
    value: "SOFT_DRAMATIC",
    label: "Soft Dramatic",
    description: "A strong vertical silhouette softened by prominent curves.",
  },
  {
    value: "FLAMBOYANT_NATURAL",
    label: "Flamboyant Natural",
    description: "An elongated, broad, open silhouette with relaxed strength.",
  },
  {
    value: "SOFT_NATURAL",
    label: "Soft Natural",
    description: "A softly curved silhouette with visible width and relaxed shaping.",
  },
  {
    value: "DRAMATIC_CLASSIC",
    label: "Dramatic Classic",
    description: "Balanced proportions with a controlled vertical line.",
  },
  {
    value: "SOFT_CLASSIC",
    label: "Soft Classic",
    description: "Balanced visual lines softened by gentle curves.",
  },
  {
    value: "FLAMBOYANT_GAMINE",
    label: "Flamboyant Gamine",
    description: "A compact, angular silhouette with energetic contrast.",
  },
  {
    value: "SOFT_GAMINE",
    label: "Soft Gamine",
    description: "A compact adult silhouette with rounded, softly defined curves.",
  },
  {
    value: "THEATRICAL_ROMANTIC",
    label: "Theatrical Romantic",
    description: "A delicate, curve-led silhouette with refined sharp accents.",
  },
  {
    value: "ROMANTIC",
    label: "Romantic",
    description: "A softly rounded, curve-led silhouette with gentle shaping.",
  },
];

export const kibbePresetModalOpenFixture = {
  open: true,
  label: "Kibbe-Inspired Body Identity",
  selectedPresetLabel: "Soft Dramatic",
  identityOptions: kibbePresetModalIdentityOptionsFixture,
  pendingValue: "SOFT_DRAMATIC",
  pendingPreset: {
    value: "SOFT_DRAMATIC",
    label: "Soft Dramatic",
    description:
      "A strong vertical silhouette softened by prominent curves and an elegant, commanding presence.",
  },
  suggestionRows: [
    { label: "Body Type", value: "Curvy" },
    { label: "Build", value: "Powerful" },
    { label: "Height", value: "Tall" },
    {
      label: "Proportions",
      value: "Narrow Waist + Full Chest / Bust + Wide Hips",
    },
  ],
  onOpen: noop,
  onClose: noop,
  onSelectIdentity: noop,
  onSaveIdentityOnly: noop,
  onFillEmptyFields: noop,
  onReplaceBodyTraits: noop,
};

export const kibbePresetModalEmptyFixture = {
  ...kibbePresetModalOpenFixture,
  selectedPresetLabel: "Not chosen",
  pendingValue: "",
  pendingPreset: {
    value: "",
    label: "Not chosen",
    description: "Do not use a Kibbe-inspired silhouette identity.",
  },
  suggestionRows: [],
};

export const kibbePresetModalClosedFixture = {
  ...kibbePresetModalOpenFixture,
  open: false,
};
