export const KIT_DROPDOWN_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the branded dropdown kit piece
 * (docs/BUILD-BLUEPRINT.md sections 2.9 menu-popover recipe and 2.16
 * filter-line law, ruled 9 Aug 2026). One trigger chip opening one
 * options panel: a popover below the trigger at 700px and up, a
 * bottom-docked sheet under 700px (modal law, RESTYLE-RULES Ruling 7).
 *
 * The View owns only the open/closed presentation state (sanctioned
 * presentation-only local state). It does not know what list the
 * selection filters, how selection persists, or what a value maps to
 * in a query; the caller supplies display-ready options and receives
 * intent through the semantic callbacks.
 *
 * DROPDOWN OVERFLOW fix (10 Aug 2026 defect ruling), no prop change:
 * the 700px-and-up popover used to always anchor left of the trigger,
 * so the last dropdown in a row near the viewport's right edge (Lore's
 * Recency filter, named in the ruling) rendered off-screen. The View
 * now measures the panel after it opens and flips to right-anchored
 * when left-anchoring would overflow, re-measuring on resize while
 * open. Purely internal; the public props above are unchanged.
 *
 * Selection count law (filter-line law, 9 Aug 2026): a multi-select
 * trigger shows its live selection count beside the label; a
 * single-select trigger shows the selected option's label. The count
 * and label are derived by the View from selectedValues; the caller
 * never formats them.
 *
 * @typedef {Object} KitDropdownOption
 * @property {string} value
 * @property {string} label
 * @property {number|null} [count] displayed right-aligned, tabular
 * @property {string} [description] supporting line under the label
 * @property {string} [tooltip] system tooltip text for the row
 *   (rating tiers carry their film anchor here); rendered via the
 *   native title attribute as an interim, pending a design-system
 *   tooltip pattern, flagged in docs/CONTRACT-REQUESTS.md CR-027
 * @property {boolean} [isDisabled] honest stub for an option the
 *   backend cannot answer yet; renders with the word "Soon"
 *
 * @typedef {Object} KitDropdownViewProps
 * @property {string} label the group name shown on the trigger
 * @property {KitDropdownOption[]} options
 * @property {string[]} selectedValues
 * @property {boolean} isMultiSelect
 * @property {boolean} isDisabled
 * @property {((value: string) => void)|null} onToggleOption
 *   fires per option activation; single-select closes after firing,
 *   multi-select stays open for further toggles
 * @property {string|null} [ariaLabel] (added 1.1.0, 10 Aug 2026
 *   review gate, D-3) the control's purpose for assistive tech when
 *   the visible label carries a VALUE rather than the group name
 *   (the account draft's Content Preference dropdown shows the
 *   selected tier as its label). Trigger announces
 *   "{ariaLabel}: {label}"; the listbox and sheet take ariaLabel
 *   alone. Omitted: behavior identical to 1.0.0.
 */

export {};
