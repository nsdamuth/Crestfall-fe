const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Garment Design",
  sectionDescription:
    "Describe the visible clothing pieces, silhouette, fit, coverage, and style language for this outfit.",
  silhouetteLabel: "Silhouette",
  fitLabel: "Fit",
  coverageLabel: "Coverage",
  styleLanguageLabel: "Style Language",
  clothingPiecesLabel: "Clothing Pieces",
  clothingPiecesPlaceholder:
    "List the visible pieces: jacket, boots, belts, gloves, armor plates, dress layers, etc.",
  designNotesLabel: "Design Notes",
  designNotesPlaceholder:
    "Describe the outfit's visual identity, proportions, mood, and design intent.",
});

export function getOutfitGarmentDesignSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    silhouetteValue: data.silhouette || "",
    fitValue: data.fit || "",
    coverageValue: data.coverage || "",
    styleLanguageValue: data.style_language || "",
    clothingPiecesValue: data.clothing_pieces || "",
    designNotesValue: data.design_notes || data.design_reference || "",
    onChangeSilhouette: (value) =>
      updateDataField?.("silhouette", value),
    onChangeFit: (value) => updateDataField?.("fit", value),
    onChangeCoverage: (value) => updateDataField?.("coverage", value),
    onChangeStyleLanguage: (value) =>
      updateDataField?.("style_language", value),
    onChangeClothingPieces: (value) =>
      updateDataField?.("clothing_pieces", value),
    onChangeDesignNotes: (value) =>
      updateDataField?.("design_notes", value),
  };
}

export function useOutfitGarmentDesignSectionViewModel(props = {}) {
  return getOutfitGarmentDesignSectionViewProps(props);
}
