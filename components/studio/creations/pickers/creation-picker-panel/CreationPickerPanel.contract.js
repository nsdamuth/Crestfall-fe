export const CREATION_PICKER_PANEL_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Display fields consumed by the portable picker card.
 *
 * Callers may retain additional application-owned fields on an item. The View
 * ignores those fields and returns the selected item unchanged through the
 * semantic `onSelect` callback so the owning workflow can resolve it.
 *
 * @typedef {Object} CreationPickerPanelItem
 * @property {string} id
 * @property {string} title
 * @property {string} [subtitle]
 * @property {string} [description]
 * @property {string} [type]
 * @property {string} [contentRating]
 * @property {string} [imageUrl]
 */

/**
 * Stable UI boundary for the shared portable Creation Picker Panel.
 *
 * The View owns only presentation-local search state, filtering, card display,
 * and safe selection intent. It must not know how the selected item is applied,
 * picker ownership, registry persistence, APIs, permissions, or storage.
 *
 * @typedef {Object} CreationPickerPanelViewProps
 * @property {CreationPickerPanelItem[]} items
 * @property {string[]} selectedIds
 * @property {string[]} disabledIds
 * @property {string[]} recommendedIds
 * @property {string} searchPlaceholder
 * @property {string} emptyMessage
 * @property {import("react").ReactNode|null} actions
 * @property {string} gridClassName
 * @property {number} [pageSize] Optional render-page size. Omit/zero for the legacy unpaginated view.
 * @property {((item: CreationPickerPanelItem) => void)|null} onSelect
 */

export {};
