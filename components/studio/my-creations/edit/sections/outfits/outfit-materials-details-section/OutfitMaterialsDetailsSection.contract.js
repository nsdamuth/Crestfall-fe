export const OUTFIT_MATERIALS_DETAILS_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Outfit materials-and-details View.
 *
 * The View must not inspect a creation form, know Outfit JSON storage fields,
 * resolve legacy color or trim fields, or decide how edits are persisted. It
 * renders display-ready values and emits semantic edit intent.
 *
 * @typedef {Object} OutfitMaterialsDetailsSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} mainColorsLabel
 * @property {string} mainColorsValue
 * @property {string} accentColorsLabel
 * @property {string} accentColorsValue
 * @property {string} materialsLabel
 * @property {string} materialsValue
 * @property {string} accessoriesLabel
 * @property {string} accessoriesValue
 * @property {string} detailsLabel
 * @property {string} detailsValue
 * @property {string} detailsPlaceholder
 * @property {string} armorNotesLabel
 * @property {string} armorNotesValue
 * @property {string} armorNotesPlaceholder
 * @property {((value: string) => void)|null} onChangeMainColors
 * @property {((value: string) => void)|null} onChangeAccentColors
 * @property {((value: string) => void)|null} onChangeMaterials
 * @property {((value: string) => void)|null} onChangeAccessories
 * @property {((value: string) => void)|null} onChangeDetails
 * @property {((value: string) => void)|null} onChangeArmorNotes
 */

export {};
