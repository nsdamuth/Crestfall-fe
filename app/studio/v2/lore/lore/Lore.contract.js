export const LORE_VIEW_CONTRACT_VERSION = "1.4.0";

/**
 * Stable portable UI boundary for the Lore page View
 * (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.9; docs/SPRINT-G-PLAN.md
 * section 4; docs/SPRINT-H-PLAN.md section 5.7). New page this pass,
 * contract authorized none to 1.0.0 at this gate. Build address
 * /studio/v2/lore (route law, cutover sequence). Fixture-driven only,
 * pre-parity: no fetch, no services-api, no product data.
 *
 * Ruled composition, top to bottom, exhaustive: top banner (promo-
 * banner top treatment) with the write-lore CTA (item 39, RULED 10
 * Aug 2026: the top banner CTA, "Write lore") -> studio-filter-bar
 * (search plus approval state, world or faction, and recency facets;
 * no separate sort, matching the three ruled facets exactly) ->
 * left-aligned editorial labels, the standard design-system section-
 * label treatment (LORE HEADER, RULING CHANGED, 10 Aug 2026 defect
 * ruling: superseded the 9 Aug centered ruling; Lore now matches the
 * other eight pages, StudioPageHeaderView for the page eyebrow/title/
 * description, the same eyebrow recipe reused for the two grid
 * section labels) -> two creation-card grids, Community Lore (public
 * archive, load-more paginated) then Your Lore (one creator's own
 * drafts, every approval state, shown in full) -> bottom banner
 * routing to Home, the loop's closing banner.
 *
 * headerAlign, KitStudioPage's additive v1.1.0 seat added specifically
 * for this page's earlier centered ruling, is no longer consumed by
 * any page now that Lore left-aligns (default "left" applies). Left
 * in place per the 10 Aug 2026 defect ruling rather than removed.
 *
 * The write-lore CTA (docs/SPRINT-G-PLAN.md section 4) opens a
 * creation modal composed on modal-frame with KitFormField fields
 * (title, world or faction) and a KitAlertStrip approval notice,
 * wired 10 Aug 2026 (Sprint H integration) now that waves H2a
 * (form-field) and H2c (alert-strip) have landed. 1.0.0 -> 1.1.0,
 * additive: isCreateModalOpen and createModal. Submission itself
 * still stubs with the R4 fixture-action notice: no services-api
 * exists to submit to (CR-015 pipeline confirmation stays open with
 * Nick, non-blocking, per docs/SPRINT-G-PLAN.md section 4; HIDE/STUB
 * law, docs/FRONTEND-SOP.md section 5).
 *
 * What the View renders itself: the section order and every ruled
 * kit composition (promo-banner, studio-filter-bar, creation-card,
 * load-more). What it delegates: all data, all routing (every onX
 * callback), all local state that is not presentation-only. The View
 * fetches nothing.
 *
 * @typedef {Object} LoreBannerProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onCtaClick
 *
 * @typedef {Object} LoreCardItem
 * @property {"creation"} cardKind
 * @property {"lore"} assetKind Not yet in KitCreationCard's documented assetKind enum ("image"|"character"|"story"|"adventure"); the View's onOpen resolver only special-cases "image", so "lore" routes to onOpenAssetDetail exactly like character/story/adventure. Flagged for H6 as a KitCreationCard contract note, not a required contract change (nothing in components/kit/creation-card is edited by this wave).
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
 * @typedef {Object} LoreFilterBar
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {((value: string) => void)|null} onSearchChange
 * @property {import("@/components/kit/studio-filter-bar/KitStudioFilterBar.contract").KitStudioFilterBarGroup[]} filterGroups
 * @property {Record<string, string[]>} selectedValues
 * @property {((groupId: string, value: string) => void)|null} onFilterToggle
 *
 * @typedef {Object} LoreLoadMore
 * @property {boolean} isLoading
 * @property {boolean} hasMore
 * @property {number|null} remainingCount
 * @property {(() => void)|null} onLoadMore
 *
 * @typedef {Object} LoreCreateModal
 * @property {string} title
 * @property {((value: string) => void)|null} onTitleChange
 * @property {string} titleError Empty string when valid; set on submit if title is blank.
 * @property {string} world
 * @property {((value: string) => void)|null} onWorldChange
 * @property {string} content
 * @property {((value: string) => void)|null} onContentChange
 * @property {(() => void)|null} onSubmit Validates title, then stubs with the R4 notice (no submission pipeline yet).
 * @property {(() => void)|null} onClose Fires from all of modal-frame's dismissal paths; resets the fields.
 * @property {(() => void)|null} onOpenAdvancedEditor Added 1.4.0 (10 Aug 2026, h-restore ruling 4). Navigates to /studio/create/lore, the advanced chapters/sections/blocks builder; the modal's own field set is unchanged.
 *
 * @typedef {Object} LoreViewProps
 * @property {LoreBannerProps} topBanner
 * @property {LoreFilterBar} filterBar
 * @property {LoreCardItem[]} communityItems Visible slice of the public archive, already paged.
 * @property {string|null} communityEmptyMessage Non-null renders the empty-section state instead of the community grid.
 * @property {LoreLoadMore} communityLoadMore
 * @property {LoreCardItem[]} mineItems The creator's own drafts, shown in full, no paging.
 * @property {string|null} mineEmptyMessage Non-null renders the empty-section state instead of the mine grid.
 * @property {string|null} errorMessage Added 1.3.0 (10 Aug 2026 parity audit, section 2). Non-null renders a KitAlertStrip danger banner instead of both grids.
 * @property {LoreBannerProps} bottomBanner
 * @property {boolean} isCreateModalOpen Added 1.1.0. The write-lore CTA's creation modal, mounted only while open (modal-frame convention).
 * @property {LoreCreateModal} createModal Added 1.1.0.
 * @property {{label: string, message: string}|null} notice R4 fixture-action notice (10 Aug 2026 review gate): non-persisting acknowledgement for any control whose real behavior waits on live wiring. Null renders nothing.
 * @property {(() => void)|null} onCloseNotice
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
