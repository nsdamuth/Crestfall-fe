export const OUTFIT_GARMENT_DESIGN_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Outfit garment-design View.
 *
 * The View must not inspect a creation form, know Outfit JSON storage fields,
 * resolve legacy design-reference values, or decide how garment-design changes
 * are persisted. It renders display-ready values and emits semantic edit intent.
 *
 * @typedef {Object} OutfitGarmentDesignSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} silhouetteLabel
 * @property {string} silhouetteValue
 * @property {string} fitLabel
 * @property {string} fitValue
 * @property {string} coverageLabel
 * @property {string} coverageValue
 * @property {string} styleLanguageLabel
 * @property {string} styleLanguageValue
 * @property {string} clothingPiecesLabel
 * @property {string} clothingPiecesValue
 * @property {string} clothingPiecesPlaceholder
 * @property {string} designNotesLabel
 * @property {string} designNotesValue
 * @property {string} designNotesPlaceholder
 * @property {((value: string) => void)|null} onChangeSilhouette
 * @property {((value: string) => void)|null} onChangeFit
 * @property {((value: string) => void)|null} onChangeCoverage
 * @property {((value: string) => void)|null} onChangeStyleLanguage
 * @property {((value: string) => void)|null} onChangeClothingPieces
 * @property {((value: string) => void)|null} onChangeDesignNotes
 */

export {};
