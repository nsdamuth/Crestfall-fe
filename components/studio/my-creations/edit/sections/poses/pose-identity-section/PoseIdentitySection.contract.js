export const POSE_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the portable Pose identity View.
 *
 * The View must not inspect a creation form, know Pose JSON storage fields,
 * resolve legacy category fields, parse tag strings into arrays, or decide how
 * identity changes are persisted. It renders display-ready values and emits
 * semantic edit intent only.
 *
 * @typedef {Object} PoseIdentitySectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} nameLabel
 * @property {string} nameValue
 * @property {string} categoryLabel
 * @property {string} categoryValue
 * @property {Array<{value:string,label:string}>} categoryOptions
 * @property {string} categoryHelper
 * @property {string} intendedUseLabel
 * @property {string} intendedUseValue
 * @property {string} intendedUseHelper
 * @property {string} tagsLabel
 * @property {string} tagsValue
 * @property {string} tagsHelper
 * @property {string} creationTypeLabel
 * @property {string} creationTypeValue
 * @property {((value: string) => void)|null} onChangeName
 * @property {((value: string) => void)|null} onChangeCategory
 * @property {((value: string) => void)|null} onChangeIntendedUse
 * @property {((value: string) => void)|null} onChangeTags
 */

export {};
