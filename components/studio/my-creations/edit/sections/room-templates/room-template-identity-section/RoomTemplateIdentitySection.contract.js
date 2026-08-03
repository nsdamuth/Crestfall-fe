export const ROOM_TEMPLATE_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Story identity View.
 *
 * The View must not inspect a creation form, know Story JSON storage fields,
 * choose application defaults, parse tag strings into arrays, or decide how
 * identity changes are persisted. It renders display-ready values and emits
 * semantic edit intent only.
 *
 * @typedef {Object} RoomTemplateIdentityOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} RoomTemplateIdentitySectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} roomModeLabel
 * @property {string} roomModeValue
 * @property {RoomTemplateIdentityOption[]} roomModeOptions
 * @property {string} playerCharacterModeLabel
 * @property {string} playerCharacterModeValue
 * @property {RoomTemplateIdentityOption[]} playerCharacterModeOptions
 * @property {string} tagsLabel
 * @property {string} tagsValue
 * @property {((value: string) => void)|null} onSelectRoomMode
 * @property {((value: string) => void)|null} onSelectPlayerCharacterMode
 * @property {((value: string) => void)|null} onChangeTags
 */

export {};
