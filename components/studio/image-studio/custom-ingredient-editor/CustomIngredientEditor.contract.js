export const CUSTOM_INGREDIENT_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Image Studio custom ingredient editor.
 *
 * The View must not know Image Studio slot objects, selected-ingredient state,
 * composer storage, preset creation behavior, or how clearing and returning to
 * presets affect the wider workbench. It renders display-ready editor state
 * and emits semantic user actions only.
 *
 * @typedef {Object} CustomIngredientEditorViewProps
 * @property {boolean} open
 * @property {string} ingredientLabel
 * @property {string} introText
 * @property {string} promptValue
 * @property {string} promptPlaceholder
 * @property {boolean} showSavePresetAction
 * @property {((value: string) => void)|null} onChangePrompt
 * @property {(() => void)|null} onBackToPresets
 * @property {(() => void)|null} onClear
 * @property {(() => void)|null} onSavePreset
 */

export {};
