export const KIT_LOAD_MORE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared load-more kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.4). No infinite scroll: an
 * initial batch renders, then this control appends the next batch on
 * request, per the ratified load-more pagination rule in
 * docs/CRESTFALL-PRODUCT-MODEL-UXUI.md section 3.4.
 *
 * The View does not fetch, page, or know the total count; it only
 * renders the state it is given and reports intent through
 * onLoadMore.
 *
 * @typedef {Object} KitLoadMoreViewProps
 * @property {boolean} isLoading
 * @property {boolean} hasMore
 * @property {number|null} remainingCount
 * @property {(() => void)|null} onLoadMore
 */

export {};
