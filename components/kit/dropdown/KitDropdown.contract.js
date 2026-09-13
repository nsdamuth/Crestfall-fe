export const KIT_DROPDOWN_VIEW_CONTRACT_VERSION = "1.5.0";

/**
 * 1.4.0 to 1.5.0 (fe/chat-studio brief 2 item 4, 13 Sep 2026),
 * additive: `placement` "up" anchors the 700px-and-up popover above
 * the trigger instead of below it, for a trigger on the bottom edge of
 * the viewport (the story composer's input mode chip). Horizontal
 * alignment (`align` plus the measured flip) is unchanged, and the
 * phone sheet is unaffected. Default "down", every existing consumer
 * pixel-stable.
 *
 * 1.3.0 to 1.4.0 (eight-fix package FIX 5, RULED 12 Sep 2026),
 * additive: `labelMode` "replace" lets a non-resting single-select
 * value take the trigger over, so the trigger reads the chosen
 * option's label alone and reads `label` while the value is the
 * default (restingValue). The menu still marks the default option as
 * selected. "prefix", the default, keeps the label-then-value grammar
 * of 1.3.0 on every existing consumer.
 *
 * 1.2.1 to 1.3.0 (FE/MEDIA-STUDIO session 3 review round 2, 10 Sep
 * 2026), additive: `align` sets the popover's baseline anchor, "left"
 * (the default, every existing consumer unchanged) or "right" for a
 * trigger pinned to the right edge of a bounded surface such as the
 * asset picker modal, whose left-anchored menu would otherwise run
 * past the panel. The measured flip still applies in both directions.
 *
 * 1.2.0 to 1.2.1 (FE/MEDIA-STUDIO session 2 review, 10 Sep 2026),
 * presentation only, no prop change: while a single-select sits on
 * its restingValue the trigger hides the value word as well as the
 * count, reading plain "Filter" instead of "Filter All". Consumers
 * without restingValue are pixel-stable.
 *
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
 * @property {string|null} [restingValue] (added 1.2.0, 10 Sep 2026,
 *   Media Studio browser review round 5) the one value that means
 *   "no filter", e.g. "All". While it is the only selection the
 *   trigger reads as untouched: no selection count, dim ink, the row
 *   still checked. A default is not a choice the user made. Omitted
 *   on every existing consumer, pixel-stable.
 * @property {string|null} [ariaLabel] (added 1.1.0, 10 Aug 2026
 *   review gate, D-3) the control's purpose for assistive tech when
 *   the visible label carries a VALUE rather than the group name
 *   (the account draft's Content Preference dropdown shows the
 *   selected tier as its label). Trigger announces
 *   "{ariaLabel}: {label}"; the listbox and sheet take ariaLabel
 *   alone. Omitted: behavior identical to 1.0.0.
 * @property {"left"|"right"} [align] (added 1.3.0, 10 Sep 2026) the
 *   popover's baseline anchor at 700px and up. Default "left".
 *   "right" anchors the menu to the trigger's right edge, for a
 *   trigger pinned to the right edge of a modal. The phone sheet is
 *   unaffected.
 * @property {"prefix"|"replace"} [labelMode] (added 1.4.0, 12 Sep
 *   2026) "replace": a non-resting single-select value replaces
 *   `label` on the trigger; while resting, the trigger reads `label`
 *   with no value. Default "prefix". Multi-select ignores it.
 * @property {"down"|"up"} [placement] (added 1.5.0, 13 Sep 2026) the
 *   popover's vertical anchor at 700px and up. Default "down" (below
 *   the trigger). "up" opens the panel above the trigger, aligned to
 *   it, for a trigger on the bottom edge of the viewport. The phone
 *   sheet is unaffected.
 */

export {};
