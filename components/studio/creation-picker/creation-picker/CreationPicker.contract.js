export const CREATION_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the creation picker (the "mini
 * vault"), docs/plans/FABLE-GATE-2-STUDIO.md wave SW1. Composes the
 * kit's KitPickerModal (components/kit/picker-modal/) in grid
 * layout: search field, a filter chip row carrying the five vault
 * buckets plus a "More" bucket (ruling N7 option A) and one trailing
 * sort chip, a tile grid of owned creations, single-select confirms
 * on tap. Fixture-fed; every list, filter, search, and sort state is
 * caller-owned, matching KitPickerModal's own law. A true-empty
 * vault (zero owned creations) renders a distinct "Nothing here yet"
 * state with a Create call to action instead of delegating to the
 * kit's plain-text empty message, which carries no action slot.
 *
 * @typedef {Object} CreationPickerItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle type eyebrow, the display name from
 *   lib/shared/presentation/terminology.js
 * @property {string} [imageSrc] art thumb; the no-image fallback
 *   renders when absent
 * @property {string} badgeLabel visibility badge ("Private",
 *   "Unlisted", "Public") or "Canon" when the item is canon
 *
 * @typedef {Object} CreationPickerFilterChip
 * @property {string} value one of the six creationPickerBuckets.js
 *   bucket values, or "sort-recency" for the trailing sort toggle
 * @property {string} label
 * @property {boolean} isSelected
 *
 * @typedef {Object} CreationPickerViewProps
 * @property {string} [title] default "Choose a creation"
 * @property {CreationPickerItem[]} items
 * @property {string} searchValue
 * @property {string} [searchPlaceholder]
 * @property {CreationPickerFilterChip[]} filters bucket row plus the
 *   trailing sort chip
 * @property {boolean} isSearching
 * @property {boolean} isLoading live owned-creations request is in flight
 * @property {boolean} isEmpty true only when the owned-creations list
 *   itself is empty (not a search/filter miss); renders the Create
 *   CTA state instead of the kit's plain empty text
 * @property {string} [emptyCreateLabel] default "Create your first
 *   creation"
 * @property {string} [emptyMessage] no-results text (search/filter
 *   produced zero rows against a non-empty vault)
 * @property {string} [errorMessage]
 * @property {((value: string) => void)|null} onSearchChange
 * @property {((value: string) => void)|null} onToggleFilter fires for
 *   both bucket chips and the sort chip; bucket selection is
 *   single-active (radio), sort is a two-state toggle, both live with
 *   the caller
 * @property {((id: string) => void)|null} onToggleItem fires per tile
 *   activation; single-select confirms and closes immediately
 * @property {(() => void)|null} onConfirm
 * @property {(() => void)|null} onClose
 * @property {(() => void)|null} [onCreateNew] fires from the
 *   true-empty state's Create CTA
 */

export {};
