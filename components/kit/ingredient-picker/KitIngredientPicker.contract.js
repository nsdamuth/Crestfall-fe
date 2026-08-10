export const KIT_INGREDIENT_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the ingredient picker kit piece
 * (docs/SPRINT-E-PLAN.md section 1.2, R6). Fixture-driven mirror of
 * the live ingredient picker's function
 * (components/studio/image-studio/ingredient-picker/, READ ONLY
 * reference, never imported). Standing on KitModalFrame
 * (variant="modal", full-screen at 390 per R4). Search filtering is
 * the caller's responsibility (matching the studio-filter-bar
 * convention): this View receives already-filtered, display-ready
 * items and reports search-text intent through onSearchChange.
 *
 * @typedef {Object} KitIngredientPickerItem
 * @property {string} id
 * @property {string} title
 * @property {string} [subtitle]
 * @property {string|null} [imageSrc]
 * @property {boolean} [isSelected]
 *
 * @typedef {Object} KitIngredientPickerViewProps
 * @property {string} slotLabel the ingredient slot's live label
 *   (Character, Player Character, Pose, Clothing Source,
 *   Location / Scene, Rendering Preset)
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {((value: string) => void)|null} onSearchChange
 * @property {KitIngredientPickerItem[]} items already filtered by the
 *   caller; empty renders the emptyMessage state
 * @property {string} emptyMessage
 * @property {string} loadErrorMessage non-empty renders a danger
 *   banner above the grid; the grid still renders beneath it
 * @property {((itemId: string) => void)|null} onChooseIngredient
 * @property {boolean} showUseCustomAction renders the "Use Once" card
 * @property {(() => void)|null} onUseCustom
 * @property {boolean} showCreatePresetAction renders the "New Preset"
 *   card; only true for the four savable slots (pose, outfit,
 *   location, preset)
 * @property {(() => void)|null} onCreatePreset
 * @property {(() => void)|null} onClose
 */

export {};
