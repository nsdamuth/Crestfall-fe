export const KIT_INGREDIENT_PICKER_VIEW_CONTRACT_VERSION = "1.1.0";

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
 * 1.0.0 to 1.1.0, additive: backLabel. NESTED MODAL LAW (the R1
 * credits pattern, generalized 10 Aug 2026): when this picker opens
 * from inside another modal (Images v2's mobile create-image panel,
 * under 700px), the caller passes a labeled backLabel so the return
 * path reads at a glance, rather than a bare close icon. Null when
 * opened as a top-level modal (Images v2's desktop inline panel is
 * not itself a modal), where there is no modal beneath to name.
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
 * @property {string|null} [backLabel] Added 1.1.0. Non-null renders a
 *   labeled back row above the title (e.g. "Back to Image Creator"),
 *   firing onClose, for the nested-modal case.
 * @property {(() => void)|null} onClose
 */

export {};
