export const SELECTED_CHARACTERS_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready character supplied to the portable Selected Characters Panel.
 *
 * @typedef {Object} SelectedCharacterViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} initial
 */

/**
 * Stable UI boundary for the portable Selected Characters Panel View.
 *
 * The View must not know Story package fields, creation/reference payloads,
 * picker state, selection mutation rules, or persistence behavior. It receives
 * display-ready character items and emits semantic user intent only.
 *
 * @typedef {Object} SelectedCharactersPanelViewProps
 * @property {SelectedCharacterViewItem[]} characters
 * @property {(() => void)|null} onOpenCharacterPicker
 * @property {((characterId: string) => void)|null} onRemoveCharacter
 */

export {};
