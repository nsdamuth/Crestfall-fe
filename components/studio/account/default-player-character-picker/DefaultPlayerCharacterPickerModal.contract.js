export const DEFAULT_PLAYER_CHARACTER_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} DefaultPlayerCharacterPickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} displayImageUrl
 * @property {string} imageAltText
 * @property {boolean} isSelected
 */

/**
 * Stable UI boundary for the portable player-character picker View.
 *
 * The View must not know Crestfall creation payloads, PLAYER_CHARACTER query
 * parameters, featured-media fallback rules, profile fields, story-room
 * assignment behavior, or selection payload storage fields. It renders
 * display-ready cards and emits semantic user actions only.
 *
 * @typedef {Object} DefaultPlayerCharacterPickerModalViewProps
 * @property {string} searchQuery
 * @property {DefaultPlayerCharacterPickerViewItem[]} playerCharacters
 * @property {boolean} isLoading
 * @property {string} errorMessage
 * @property {((query: string) => void)|null} onSearchQueryChange
 * @property {(() => void)|null} onClose
 * @property {((playerCharacterId: string) => void)|null} onChoosePlayerCharacter
 */

export {};
