export const KIT_ART_PLACEHOLDER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared empty-art-slot mark.
 * RULED 11 Aug 2026 (Sprint H render review, item 5): any empty art
 * slot in scope (creator profile showcase, quick-create previews,
 * reference slots, card/tile art fallbacks) renders the geometric
 * gold line-art camellia mark centered on the elevated surface token
 * (--surface-2), never a blank box. New package, contract authorized
 * none to 1.0.0 at this gate.
 *
 * What the mark renders itself: the camellia line-art glyph, centered,
 * on --surface-2. Sizing and aspect ratio are the caller's
 * responsibility (this package renders the mark only, not the slot
 * frame), so it drops into any aspect-ratio container.
 *
 * What it delegates: all data, all layout beyond its own centering,
 * no tap target, no caption. A caller wanting a label under the mark
 * supplies its own text outside this package.
 *
 * @typedef {Object} KitArtPlaceholderViewProps
 * @property {"sm"|"md"|"lg"} [size] Mark size step. Defaults "md".
 */

export {};
