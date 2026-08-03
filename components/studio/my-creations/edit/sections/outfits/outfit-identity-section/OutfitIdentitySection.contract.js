export const OUTFIT_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Outfit identity View.
 *
 * The View must not inspect a creation form, know Outfit JSON storage fields,
 * resolve legacy category fields, parse tag strings into arrays, or decide how
 * identity changes are persisted. It renders display-ready values and emits
 * semantic edit intent only.
 *
 * @typedef {Object} OutfitIdentitySectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} nameLabel
 * @property {string} nameValue
 * @property {string} categoryLabel
 * @property {string} categoryValue
 * @property {string} intendedUseLabel
 * @property {string} intendedUseValue
 * @property {string} tagsLabel
 * @property {string} tagsValue
 * @property {string} creationTypeLabel
 * @property {string} creationTypeValue
 * @property {((value: string) => void)|null} onChangeName
 * @property {((value: string) => void)|null} onChangeCategory
 * @property {((value: string) => void)|null} onChangeIntendedUse
 * @property {((value: string) => void)|null} onChangeTags
 */

export {};
