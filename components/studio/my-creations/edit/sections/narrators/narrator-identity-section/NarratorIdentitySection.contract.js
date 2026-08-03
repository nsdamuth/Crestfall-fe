export const NARRATOR_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} NarratorToneOptionViewItem
 * @property {string} value
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Narrator identity View.
 *
 * The View must not inspect a creation form, know narrator JSON storage fields,
 * parse tag strings into arrays, or decide how identity changes are persisted.
 * It renders display-ready values and emits semantic edit intent only.
 *
 * @typedef {Object} NarratorIdentitySectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} nameLabel
 * @property {string} nameValue
 * @property {string} tagsLabel
 * @property {string} tagsValue
 * @property {string} toneLabel
 * @property {string} toneValue
 * @property {NarratorToneOptionViewItem[]} toneOptions
 * @property {string} creationTypeLabel
 * @property {string} creationTypeValue
 * @property {((value: string) => void)|null} onChangeName
 * @property {((value: string) => void)|null} onChangeTags
 * @property {((value: string) => void)|null} onSelectTone
 */

export {};
