const noop = () => {};

const baseFixture = Object.freeze({
  requiredCharacterTitles: [],
  optionalCharacterTitles: [],
  suggestedLocationTitle: "",
  suggestedNarratorTitle: "",
  suggestedNpcRegistryTitles: [],
  canApplyRequiredCharacters: false,
  canApplyOptionalCharacters: false,
  canApplySuggestedLocation: false,
  canApplySuggestedNarrator: false,
  canApplySuggestedNpcRegistries: false,
  onApplyAll: noop,
  onApplyRequiredCharacters: noop,
  onApplyOptionalCharacters: noop,
  onApplySuggestedLocation: noop,
  onApplySuggestedNarrator: noop,
  onApplySuggestedNpcRegistries: noop,
  onSkipRecommendations: noop,
});

export const scenarioRecommendationsCompleteFixture = Object.freeze({
  ...baseFixture,
  requiredCharacterTitles: ["Mara Voss", "Captain Elian Rook"],
  optionalCharacterTitles: ["Archivist Sen", "The Glass Courier"],
  suggestedLocationTitle: "The Ember Archive",
  suggestedNarratorTitle: "Measured Chronicle Narrator",
  suggestedNpcRegistryTitles: ["Archive Staff", "Rook's Pursuers"],
  canApplyRequiredCharacters: true,
  canApplyOptionalCharacters: true,
  canApplySuggestedLocation: true,
  canApplySuggestedNarrator: true,
  canApplySuggestedNpcRegistries: true,
});

export const scenarioRecommendationsEmptyFixture = Object.freeze({
  ...baseFixture,
});

export const scenarioRecommendationsCharactersOnlyFixture = Object.freeze({
  ...baseFixture,
  requiredCharacterTitles: ["Mara Voss"],
  optionalCharacterTitles: ["Archivist Sen", "The Glass Courier"],
  canApplyRequiredCharacters: true,
  canApplyOptionalCharacters: true,
});

export const scenarioRecommendationsSettingOnlyFixture = Object.freeze({
  ...baseFixture,
  suggestedLocationTitle: "The Ember Archive",
  suggestedNarratorTitle: "Measured Chronicle Narrator",
  canApplySuggestedLocation: true,
  canApplySuggestedNarrator: true,
});

export const scenarioRecommendationsNpcRegistriesOnlyFixture = Object.freeze({
  ...baseFixture,
  suggestedNpcRegistryTitles: ["Archive Staff", "Rook's Pursuers"],
  canApplySuggestedNpcRegistries: true,
});

export const scenarioRecommendationsLongContentFixture = Object.freeze({
  ...baseFixture,
  requiredCharacterTitles: [
    "Lady Seraphine Valecourt, Keeper of the Ninth Observatory",
    "Commander Orren Tal, Acting Warden of the Western Causeway",
    "The Unregistered Witness from the Ashen District",
  ],
  optionalCharacterTitles: [
    "Ilyra Fen, Senior Cartographer of Unstable Roads",
    "Brother Caldus of the Lantern Archive",
    "Mira Thorn, Licensed Salvager and Reluctant Diplomat",
    "The Silent Advocate",
  ],
  suggestedLocationTitle:
    "The Submerged Hall of Testimony Beneath the Old Imperial Archive",
  suggestedNarratorTitle:
    "A restrained historical narrator who notices institutional contradictions",
  suggestedNpcRegistryTitles: [
    "Imperial Archive Staff and Rotating Night Custodians",
    "Witnesses Protected by the Seventh Civic Compact",
    "Unlicensed Salvagers Operating Below the Flood Line",
  ],
  canApplyRequiredCharacters: true,
  canApplyOptionalCharacters: true,
  canApplySuggestedLocation: true,
  canApplySuggestedNarrator: true,
  canApplySuggestedNpcRegistries: true,
});
