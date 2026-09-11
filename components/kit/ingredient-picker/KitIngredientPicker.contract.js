export const KIT_INGREDIENT_PICKER_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the asset picker kit piece. THE
 * picker for Media Studio: one layout and one component for every
 * asset type (Character, Pose, Outfit, Location, Preset, Camera
 * framing), FE/MEDIA-STUDIO session 2, Brian's note 3 (9 Sep 2026).
 * Standing on KitModalFrame: variant "sheet" with the grabber under
 * 700px (the same sheet the composer uses), variant "modal" at 700px
 * and up. Search filtering and the filter dropdown's effect are the
 * caller's responsibility (matching the studio-filter-bar convention):
 * this View receives already-filtered, display-ready items and reports
 * search text and filter choice as intent.
 *
 * 1.2.0 to 2.0.0, BREAKING (session 2, 10 Sep 2026):
 * removed sourceMode, sourceOptions, onSourceModeChange (the Mine /
 * Public tablist is now the filter dropdown), showCreatePresetAction
 * and onCreatePreset (the "New Preset" card merged into Custom; Custom
 * opens the custom asset modal, note 4). Added description, filter,
 * itemLayout, customIsSelected. Eyebrow reads "Select asset".
 *
 * @typedef {Object} KitIngredientPickerItem
 * @property {string} id
 * @property {string} title
 * @property {string} [subtitle] cards: the small line under the title;
 *   rows: the option's group, rendered as a quiet uppercase label
 * @property {string} [description] rows layout only, one to two lines
 * @property {string|null} [imageSrc] cards layout only
 * @property {boolean} [isSelected]
 *
 * @typedef {Object} KitIngredientPickerFilter
 * @property {string} label trigger label, "Filter" on every Media
 *   Studio picker
 * @property {{value:string,label:string,count?:number}[]} options
 * @property {string} value the current single selection
 * @property {string|null} [restingValue] the value that means "no
 *   filter"; while selected the trigger reads plain and dim
 *   (KitDropdown 1.2.0)
 * @property {((value: string) => void)|null} onChange
 *
 * @typedef {Object} KitIngredientPickerViewProps
 * @property {string} slotLabel the asset word as the title (Character,
 *   Pose, Outfit, Location, Preset, Camera framing)
 * @property {string} [description] one sentence under the title;
 *   empty assembles "Choose a saved {label}, or write your own." (or
 *   without the Custom clause when showUseCustomAction is false)
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {((value: string) => void)|null} onSearchChange
 * @property {KitIngredientPickerFilter|null} [filter] the one filter
 *   dropdown to the right of the search field; null hides it
 * @property {KitIngredientPickerItem[]} items already filtered by the
 *   caller; empty renders the emptyMessage state inside the grid
 * @property {"cards"|"rows"} [itemLayout] cards (art tiles, the five
 *   asset slots) or rows (text options with a description, camera
 *   framing). Rows never render the Custom card.
 * @property {string} emptyMessage
 * @property {string} loadErrorMessage non-empty renders a danger
 *   banner above the grid; the grid still renders beneath it
 * @property {((itemId: string) => void)|null} onChooseIngredient
 * @property {boolean} showUseCustomAction renders Custom as the first
 *   card of the grid
 * @property {boolean} [customIsSelected] the slot already holds a
 *   once-only custom description; the Custom card reads selected
 * @property {(() => void)|null} onUseCustom opens the custom asset
 *   modal for this asset type
 * @property {string|null} [backLabel] NESTED MODAL LAW: when this
 *   picker opens from inside another modal (the mobile composer
 *   sheet), the caller passes a labeled back row above the title,
 *   firing onClose. Null when opened as a top-level modal.
 * @property {(() => void)|null} onClose
 */

export {};
