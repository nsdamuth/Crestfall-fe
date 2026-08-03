export const SAVE_INGREDIENT_PRESET_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Image Studio preset-save View.
 *
 * The View must not know Image Studio slot objects, creation types, draft
 * payloads, client API modules, or how a successful preset becomes selected in
 * the composer. It renders display-ready form state and emits semantic actions.
 *
 * @typedef {Object} SaveIngredientPresetModalViewProps
 * @property {boolean} open
 * @property {string} presetTypeLabel
 * @property {string} introText
 * @property {string} helperText
 * @property {string} nameValue
 * @property {string} descriptionValue
 * @property {string} promptValue
 * @property {string} tagsValue
 * @property {boolean} isSaving
 * @property {boolean} canSave
 * @property {string} saveMessage
 * @property {"info"|"error"} saveMessageTone
 * @property {((value: string) => void)|null} onChangeName
 * @property {((value: string) => void)|null} onChangeDescription
 * @property {((value: string) => void)|null} onChangePrompt
 * @property {((value: string) => void)|null} onChangeTags
 * @property {(() => void)|null} onSavePreset
 * @property {(() => void)|null} onUseOnce
 * @property {(() => void)|null} onClose
 */

export {};
