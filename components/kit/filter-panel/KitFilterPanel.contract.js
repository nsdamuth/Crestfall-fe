export const KIT_FILTER_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared Filter panel kit piece
 * (FE/FILTERS, ruled by Brian 6 Sep 2026: one Filter button opening a
 * panel, the OurDream pattern, structure matched, styling from
 * app/theme.css only). Supersedes the per-category dropdown row of
 * the 9 Aug 2026 filter-line law (docs/BUILD-BLUEPRINT.md 2.16(b),
 * amended the same day: filter categories live in one Filter panel;
 * dedicated dropdowns are the fallback).
 *
 * Anatomy: one trigger ("Filter", filter glyph, caret) carrying a live
 * active-count badge; a panel that is a popover below the trigger at
 * 700px and up and a bottom-docked sheet under 700px (the same law
 * KitDropdown follows, shared through useAnchoredPanel); inside the
 * panel, a search-within-filters field at the top, a "Filter by"
 * heading, then every section as a labelled chip group in the order
 * the caller passes, and Clear all at the bottom.
 *
 * The View owns only the open/closed flag and the search-within
 * text (sanctioned presentation-only local state; the text resets on
 * close). It does not know what list the selection filters, how
 * selection persists, or what a value maps to in a query; the caller
 * supplies display-ready sections and receives intent through the
 * semantic callbacks. The active count and the visible sections are
 * derived by the View; the caller never formats them.
 *
 * @typedef {Object} KitFilterPanelOption
 * @property {string} value
 * @property {string} label
 * @property {number|null} [count] shown beside the chip label
 * @property {string} [tooltip] system tooltip for the chip (rating
 *   tiers carry their film anchor here, CR-027 interim)
 * @property {boolean} [isDisabled] honest stub for an option the
 *   backend cannot answer yet
 *
 * @typedef {Object} KitFilterPanelSection
 * @property {string} id
 * @property {string} label
 * @property {KitFilterPanelOption[]} options
 * @property {boolean} [isMultiSelect] defaults true. Single-select
 *   sections still report through onToggleOption; the caller decides
 *   whether a second value replaces the first
 *
 * @typedef {Object} KitFilterPanelViewProps
 * @property {KitFilterPanelSection[]} sections rendered in the order
 *   given; a section with no options is not rendered
 * @property {Record<string, string[]>} selectedValues
 * @property {((sectionId: string, value: string) => void)|null} onToggleOption
 * @property {(() => void)|null} onClearAll when null, Clear all emits
 *   onToggleOption once per currently selected value instead, so a
 *   consumer that has not adopted onClearAll still clears correctly
 * @property {boolean} isLoadingCounts counts render blank while true
 * @property {string} triggerLabel default "Filter"
 * @property {string} searchPlaceholder default "Search filters"
 * @property {string} ariaLabel default "Filters"; names the popover
 *   and the sheet
 * @property {boolean} isDisabled
 */

export {};
