export const STORYLINE_REFERENCE_PICKER_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Portable LOOM boundary for choosing Story or Scenario references.
 *
 * The View receives display-ready tabs, normalized reference items, copy, and
 * semantic callbacks. It does not create portals, touch document/body state,
 * interpret raw reference objects, filter options, or decide selection rules.
 * It composes `KitModalFrame` (portal, Escape, backdrop dismiss, and
 * body-scroll lock all live there now), matching the nested modal law: same
 * KitModalFrame branding as the Adventures builder modal it opens from,
 * scrollable, with an explicit back path (10 Aug 2026 defect ruling).
 * 1.0.0 to 1.1.0: closeLabel renamed to backLabel (the control is now a
 * labeled "Back to Storyline" affordance, not a bare close icon).
 *
 * @typedef {Object} StorylineReferencePickerTab
 * @property {"STORY"|"SCENARIO"} id
 * @property {string} label
 * @property {boolean} isActive
 *
 * @typedef {Object} StorylineReferencePickerItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {"STORY"|"SCENARIO"} kind
 * @property {string} kindLabel
 * @property {boolean} isSelected
 *
 * @typedef {Object} StorylineReferencePickerViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {string} dialogTitleId
 * @property {string} backLabel
 * @property {StorylineReferencePickerTab[]} tabs
 * @property {string} searchQuery
 * @property {string} searchPlaceholder
 * @property {StorylineReferencePickerItem[]} items
 * @property {string} emptyMessage
 * @property {(tabId: "STORY"|"SCENARIO") => void} onTabChange
 * @property {(query: string) => void} onSearchQueryChange
 * @property {(itemId: string) => void} onSelectItem
 * @property {() => void} onClose
 */

export {};
