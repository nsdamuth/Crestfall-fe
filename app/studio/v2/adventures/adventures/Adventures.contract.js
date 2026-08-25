export const ADVENTURES_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Stable portable UI boundary for the Adventures page View
 * (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.3; docs/SPRINT-G-PLAN.md
 * section 3). New page this pass, contract authorized none to 1.0.0
 * at this gate. Build address /studio/v2/adventures (route law,
 * cutover sequence). Fixture-driven only, pre-parity: no fetch, no
 * services-api, no product data.
 *
 * Ruled composition, top to bottom, exhaustive: top banner (promo-
 * banner top treatment) with the build CTA, opening the existing
 * Adventure builder rehosted inside modal-frame -> studio-filter-bar
 * (search plus sort only; the catalog is Adventures-only, so no type
 * facet) -> creation-card grid, the public Adventure catalog -> load-
 * more -> bottom banner routing to Studio.
 *
 * What the View renders itself: the section order and every ruled
 * kit composition (promo-banner, studio-filter-bar, creation-card,
 * load-more, modal-frame). What it delegates: all data, all routing
 * (every onX callback), all local state that is not presentation-
 * only. The View fetches nothing.
 *
 * @typedef {Object} AdventuresBannerProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onCtaClick
 *
 * @typedef {Object} AdventuresCatalogItem
 * @property {"creation"} cardKind
 * @property {"adventure"} assetKind
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string|null} imageSrc
 * @property {import("@/components/kit/creation-card/KitCreationCard.contract").KitCreationCardBadge[]} badges
 * @property {import("@/components/kit/creation-card/KitCreationCard.contract").KitCreationCardStats} stats
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {(() => void)|null} onOpenAssetDetail
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 *
 * @typedef {Object} AdventuresFilterBar
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {((value: string) => void)|null} onSearchChange
 * @property {import("@/components/kit/studio-filter-bar/KitStudioFilterBar.contract").KitStudioFilterBarSortOption[]} sortOptions
 * @property {string} selectedSort
 * @property {((value: string) => void)|null} onSortChange
 *
 * @typedef {Object} AdventuresLoadMore
 * @property {boolean} isLoading
 * @property {boolean} hasMore
 * @property {number|null} remainingCount
 * @property {(() => void)|null} onLoadMore
 *
 * @typedef {Object} AdventuresViewProps
 * @property {AdventuresBannerProps} topBanner
 * @property {AdventuresFilterBar} filterBar
 * @property {AdventuresCatalogItem[]} catalogItems Visible slice, already paged.
 * @property {string|null} emptyMessage Non-null renders the empty-catalog state instead of the grid.
 * @property {string|null} errorMessage Non-null renders a KitAlertStrip danger banner instead of the grid or the empty-catalog state (10 Aug 2026 parity audit, section 2).
 * @property {AdventuresLoadMore} loadMore
 * @property {AdventuresBannerProps} bottomBanner
 * @property {boolean} isBuilderOpen
 * @property {(() => void)|null} onCloseBuilder
 * @property {{label: string, message: string}|null} notice R4 fixture-action notice (10 Aug 2026 review gate): non-persisting acknowledgement for any control whose real behavior waits on live wiring. Null renders nothing.
 * @property {(() => void)|null} onCloseNotice
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
