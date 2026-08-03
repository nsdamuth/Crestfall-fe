export const OPENING_MESSAGE_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready speaker option supplied to the portable Opening Message Card.
 *
 * @typedef {Object} OpeningMessageSpeakerOption
 * @property {string} value
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Opening Message Card View.
 *
 * The View must not know opening-message IDs, Story package fields, selected
 * character records, update field names, removal rules, or persistence
 * behavior. It receives display-ready values and emits semantic user intent.
 *
 * @typedef {Object} OpeningMessageCardViewProps
 * @property {string} messageLabel
 * @property {string} speakerValue
 * @property {OpeningMessageSpeakerOption[]} speakerOptions
 * @property {string} bodyValue
 * @property {boolean} canRemove
 * @property {((speakerValue: string) => void)|null} onChangeSpeaker
 * @property {((bodyValue: string) => void)|null} onChangeBody
 * @property {(() => void)|null} onRemoveMessage
 */

export {};
