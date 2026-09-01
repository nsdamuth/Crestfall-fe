import { CHARACTER_PREVIEW_TOKEN_COST } from "./useCharacterPreviewViewModel";

export const characterPreviewDefaultFixture = {
  displayInitial: "S",
  characterName: "Seraphine Vale",
  characterSubtitle: "Ashen Court Diplomat",
  speciesLabel: "Human",
  genderPresentationLabel: "Feminine",
  clothingStyleLabel: "Layered ceremonial tailoring",
  previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
};

export const characterPreviewCustomIdentityFixture = {
  displayInitial: "O",
  characterName: "Orin of the Glass Tide",
  characterSubtitle: "Cartographer of drowned roads",
  speciesLabel: "Tideborn",
  genderPresentationLabel: "Androgynous",
  clothingStyleLabel: "Weathered expedition clothing",
  previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
};

export const characterPreviewEmptyFixture = {
  displayInitial: "C",
  characterName: "Unnamed Character",
  characterSubtitle: "Private Draft",
  speciesLabel: "Species not chosen yet.",
  genderPresentationLabel: "Gender presentation not chosen yet.",
  clothingStyleLabel: "Default clothing not chosen yet.",
  previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
};

export const characterPreviewMissingCustomValuesFixture = {
  displayInitial: "M",
  characterName: "Marek",
  characterSubtitle: "A character with incomplete custom identity values",
  speciesLabel: "Custom species not entered yet.",
  genderPresentationLabel: "Custom gender presentation not entered yet.",
  clothingStyleLabel: "Travel-worn leathers",
  previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
};

export const characterPreviewConceptFallbackFixture = {
  displayInitial: "T",
  characterName: "The Quiet Witness",
  characterSubtitle: "A patient observer of impossible histories",
  speciesLabel: "Human",
  genderPresentationLabel: "Masculine",
  clothingStyleLabel: "Simple archival robes",
  previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
};

export const characterPreviewLongContentFixture = {
  displayInitial: "A",
  characterName:
    "Aurelia Vespera, Last Cartographer of the Unremembered Kingdoms",
  characterSubtitle:
    "Royal surveyor, oathkeeper, and reluctant guide beyond the ninth gate",
  speciesLabel:
    "An ancient star-born lineage with a deliberately long display name for responsive testing",
  genderPresentationLabel:
    "A fluid and ceremonial presentation described with intentionally extended copy",
  clothingStyleLabel:
    "Layered expedition silks, weatherproof ceremonial armor, engraved navigation tools, and a long mantle designed to stress wrapping behavior",
  previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
};
