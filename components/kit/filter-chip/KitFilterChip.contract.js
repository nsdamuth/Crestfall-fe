export const KIT_FILTER_CHIP_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared filter chip kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.7, lifted from the fully
 * specified .fchip recipe in docs/RESTYLE-RULES.md).
 *
 * The View receives a label, an optional count, a selected flag, and
 * a constrained variant. It does not know what the chip filters, what
 * list it scopes, or how selection is persisted; the caller owns all
 * of that and reports intent through onToggle.
 *
 * @typedef {Object} KitFilterChipViewProps
 * @property {string} label
 * @property {number|null} count
 * @property {boolean} isSelected
 * @property {"default"|"sort"|"toggle"|"dropdown"} variant
 * @property {boolean} isDisabled
 * @property {(() => void)|null} onToggle
 */

export {};
