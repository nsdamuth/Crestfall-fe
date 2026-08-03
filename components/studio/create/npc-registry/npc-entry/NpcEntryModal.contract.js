export const NPC_ENTRY_MODAL_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * @typedef {Object} NpcEntryModeOption
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} NpcEntryCharacterCard
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} type
 * @property {string} contentRating
 * @property {string} imageUrl
 */

/**
 * Stable UI boundary for the portable NPC Person Entry modal View.
 *
 * The View receives semantic entry modes, display-ready character cards, and
 * semantic actions. It must not know NPC registry draft keys, creation-link
 * storage fields, or how selected characters are applied to registry entries.
 *
 * @typedef {Object} NpcEntryModalViewProps
 * @property {string} modalTitle
 * @property {string} selectedModeId
 * @property {NpcEntryModeOption[]} modeOptions
 * @property {NpcEntryCharacterCard[]} characterCards
 * @property {string[]} selectedCharacterIds
 * @property {string[]} disabledCharacterIds
 * @property {string} characterSearchPlaceholder
 * @property {string} characterEmptyMessage
 * @property {string} linkedCharacterMechanicsNote
 * @property {import("react").ReactNode|null} actorMechanicsProfileAttachmentContent
 * @property {string} nameLabel
 * @property {string} nameValue
 * @property {string} notesLabel
 * @property {string} notesValue
 * @property {number} notesRows
 * @property {string} notesPlaceholder
 * @property {string} saveLabel
 * @property {(() => void)|null} onClose
 * @property {((modeId: string) => void)|null} onChooseMode
 * @property {((characterId: string) => void)|null} onChooseCharacter
 * @property {((value: string) => void)|null} onChangeName
 * @property {((value: string) => void)|null} onChangeNotes
 * @property {(() => void)|null} onSave
 */

export {};
