export const ROOM_TEMPLATE_OPENING_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Story opening-context View.
 *
 * The View must not inspect a creation form, know Story JSON storage fields,
 * choose the fallback opening message, derive speakers from selected
 * characters, generate message IDs, or decide how edits are persisted. It
 * renders display-ready opening content and emits semantic edit intent only.
 *
 * @typedef {Object} RoomTemplateOpeningSpeakerOption
 * @property {*} value
 * @property {*} label
 *
 * @typedef {Object} RoomTemplateOpeningMessageViewModel
 * @property {*} id
 * @property {string} messageLabel
 * @property {*} speakerValue
 * @property {*} bodyValue
 * @property {boolean} canRemove
 *
 * @typedef {Object} RoomTemplateOpeningSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} publicOpeningContextLabel
 * @property {*} publicOpeningContextValue
 * @property {string} publicOpeningContextPlaceholder
 * @property {string} speakerLabel
 * @property {RoomTemplateOpeningSpeakerOption[]} speakerOptions
 * @property {string} messageLabel
 * @property {string} messagePlaceholder
 * @property {RoomTemplateOpeningMessageViewModel[]} openingMessages
 * @property {string} removeMessageLabel
 * @property {string} addMessageLabel
 * @property {((value: string) => void)|null} onChangePublicOpeningContext
 * @property {((id: *, value: *) => void)|null} onChangeOpeningMessageSpeaker
 * @property {((id: *, value: string) => void)|null} onChangeOpeningMessageBody
 * @property {(() => void)|null} onAddOpeningMessage
 * @property {((id: *) => void)|null} onRemoveOpeningMessage
 */

export {};
