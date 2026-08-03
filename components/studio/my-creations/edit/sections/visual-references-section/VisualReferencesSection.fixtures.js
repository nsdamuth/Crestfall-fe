const baseFixture = Object.freeze({
  sectionEyebrow: "Visual Consistency",
  sectionTitle: "Visual References",
  sectionDescription:
    "Assign one anime reference and one realistic reference from this creation's image library. Image Studio can later choose the correct reference automatically based on render family.",
  refreshLabel: "Refresh Library",
  loadErrorMessage: "Image library could not be loaded.",
});

const assignedCards = [
  {
    key: "anime",
    eyebrow: "Anime Reference",
    label: "Anime Reference Image",
    description: "Used for anime, fantasy, and fantasy-realistic render lanes.",
    imageOutputId: "anime-output-reference-001",
    imageUrl: "https://placehold.co/720x960/211913/d8bd7c?text=Anime+Reference",
    emptyMessage: "Reference assigned. Preview unavailable until library reloads.",
    chooseLabel: "Replace Reference",
    clearLabel: "Clear Anime Reference Image",
  },
  {
    key: "realistic",
    eyebrow: "Realistic Reference",
    label: "Realistic Reference Image",
    description: "Used for realistic and realistic-fantasy render lanes.",
    imageOutputId: "realistic-output-reference-002",
    imageUrl:
      "https://placehold.co/720x960/171717/c8c8c8?text=Realistic+Reference",
    emptyMessage: "Reference assigned. Preview unavailable until library reloads.",
    chooseLabel: "Replace Reference",
    clearLabel: "Clear Realistic Reference Image",
  },
];

const emptyCards = assignedCards.map((card) => ({
  ...card,
  imageOutputId: "",
  imageUrl: null,
  emptyMessage: "No reference image assigned.",
  chooseLabel: "Choose from Library",
  onClear: null,
}));

export const visualReferencesSectionAssignedFixture = {
  ...baseFixture,
  loadStatus: "loaded",
  referenceCards: assignedCards,
};

export const visualReferencesSectionEmptyFixture = {
  ...baseFixture,
  loadStatus: "loaded",
  referenceCards: emptyCards,
};

export const visualReferencesSectionMissingPreviewFixture = {
  ...baseFixture,
  loadStatus: "loaded",
  referenceCards: assignedCards.map((card) => ({
    ...card,
    imageUrl: null,
  })),
};

export const visualReferencesSectionErrorFixture = {
  ...baseFixture,
  loadStatus: "error",
  referenceCards: emptyCards,
};

export const visualReferencesSectionMissingCallbacksFixture = {
  ...visualReferencesSectionAssignedFixture,
  onRefresh: null,
  referenceCards: assignedCards.map((card) => ({
    ...card,
    onChoose: null,
    onClear: null,
  })),
};
