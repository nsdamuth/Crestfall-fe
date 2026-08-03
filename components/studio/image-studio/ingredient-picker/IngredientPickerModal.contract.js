export const INGREDIENT_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} IngredientPickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} type
 * @property {string} contentRating
 * @property {string} imageUrl
 */

/**
 * Stable UI boundary for the portable Image Studio ingredient picker View.
 *
 * The View must not know Image Studio slot objects, allowed creation types,
 * raw creation payloads, selected-ingredient storage, or what custom/preset
 * actions do after the user chooses them. It renders display-ready cards and
 * emits semantic user actions only.
 *
 * @typedef {Object} IngredientPickerModalViewProps
 * @property {string} ingredientLabel
 * @property {"users"|"user"|"theater"|"shirt"|"map-pin"|"sparkles"} headerIconName
 * @property {IngredientPickerViewItem[]} items
 * @property {string} selectedItemId
 * @property {string} loadErrorMessage
 * @property {string} searchPlaceholder
 * @property {string} emptyMessage
 * @property {boolean} showUseCustomAction
 * @property {boolean} showCreatePresetAction
 * @property {(() => void)|null} onClose
 * @property {((itemId: string) => void)|null} onChooseIngredient
 * @property {(() => void)|null} onUseCustom
 * @property {(() => void)|null} onCreatePreset
 */

export {};
