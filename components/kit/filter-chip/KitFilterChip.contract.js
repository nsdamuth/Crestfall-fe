export const KIT_FILTER_CHIP_VIEW_CONTRACT_VERSION = "1.1.0";

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
 * @property {string|null} [tooltip] added 1.1.0, 6 Sep 2026
 *   (FE/FILTERS): system tooltip text for the chip, rendered via the
 *   native title attribute as an interim pending the CR-047 tooltip
 *   component, so rating-tier chips inside KitFilterPanel keep the
 *   film anchor they carried as dropdown rows (CR-027). Omitted:
 *   behavior identical to 1.0.0.
 */

export {};
