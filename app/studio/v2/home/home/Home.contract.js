export const HOME_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the Home page View
 * (docs/CRESTFALL-DESIGN-CONTEXT.md, 10 Aug 2026 ruling;
 * docs/SPRINT-G-PLAN.md section 1). 1.0.0 to 2.0.0, RULED 10 Aug 2026
 * (Home fix wave, docs/SPRINT-H-PLAN.md 1a): a rendered surface leaves
 * the composition and the top banner's meaning changes, a meaning
 * change, never a patch.
 *
 * Ruled composition, top to bottom, exhaustive, seven surfaces: one
 * top banner (promo-banner top treatment, galaxy layer always on),
 * now the continue surface -> eight destination tiles, one per other
 * section -> four KitRail instances (top rated, recently added, from
 * the community, creators to follow), the top rail alone seating a
 * sort dropdown in its head control slot -> medium bottom banner
 * (promo-banner bottom treatment) routing to Stories. Home carries no
 * filter line and no local search; its one control beyond navigation
 * is the top rail's sort.
 *
 * The separate card-treatment Continue strip is REMOVED. `continueItem`
 * stays in the contract as the input that switches the one top
 * banner's state: present, the banner shows eyebrow "Continue", the
 * item's title, a "Last played" supporting line, CTA "Continue" wired
 * to the item's resume callback, and the item's own art (falling back
 * to `topBanner.imageSrc` when the item has none). Null, the banner
 * falls back to the general hero (`topBanner`'s own eyebrow, title,
 * CTA, art).
 *
 * What the View renders itself: the section order and every ruled
 * kit composition (promo-banner, destination-tile, rail,
 * creation-card, creator-card, dropdown). What it delegates: all
 * data, all routing (every onX callback), all local state that is
 * not presentation-only. The View fetches nothing.
 *
 * @typedef {Object} HomeBannerProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onCtaClick
 *
 * @typedef {Object} HomeContinueItem
 * @property {string} id
 * @property {string} title
 * @property {string} kindLabel Display kind ("Story", "Adventure", "Character").
 * @property {string} lastPlayedLabel e.g. "2 hours ago".
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onContinue
 *
 * @typedef {Object} HomeDestinationTile
 * @property {string} id
 * @property {string} label
 * @property {string} supportingLine
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onOpen
 *
 * @typedef {Object} HomeCreationCardItem
 * @property {"creation"} cardKind
 * @property {string} id
 * @property {"image"|"character"|"story"|"adventure"} assetKind
 * @property {string} title
 * @property {string} subtitle
 * @property {string|null} imageSrc
 * @property {import("@/components/kit/creation-card/KitCreationCard.contract").KitCreationCardBadge[]} badges
 * @property {import("@/components/kit/creation-card/KitCreationCard.contract").KitCreationCardStats} stats
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {(() => void)|null} onOpenImageOverlay
 * @property {(() => void)|null} onOpenAssetDetail
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 *
 * @typedef {Object} HomeCreatorCardItem
 * @property {"creator"} cardKind
 * @property {string} id
 * @property {string} handle
 * @property {string|null} avatarSrc
 * @property {import("@/components/kit/creator-card/KitCreatorCard.contract").KitCreatorCardStats} stats
 * @property {import("@/components/kit/creator-card/KitCreatorCard.contract").KitCreatorCardThumbnail[]} thumbnails
 * @property {boolean} isFollowing
 * @property {((thumbnailId: string) => void)|null} onThumbnailOpen
 * @property {(() => void)|null} onFollow
 * @property {(() => void)|null} onViewProfile
 *
 * @typedef {Object} HomeRail
 * @property {string} label
 * @property {string} viewAllLabel
 * @property {(() => void)|null} onViewAll
 * @property {Array<HomeCreationCardItem|HomeCreatorCardItem>} items
 *
 * @typedef {Object} HomeSortControl
 * @property {import("@/components/kit/dropdown/KitDropdown.contract").KitDropdownOption[]} options
 * @property {string} selectedValue
 * @property {((value: string) => void)|null} onChange
 *
 * @typedef {Object} HomeViewProps
 * @property {HomeBannerProps} topBanner The general-hero fallback content and art for the one top banner.
 * @property {HomeContinueItem|null} continueItem When present, its content and art fill the one top banner in place of `topBanner`; null falls back to `topBanner` (the ruled empty Continue state).
 * @property {HomeDestinationTile[]} destinationTiles Eight, in journey order.
 * @property {HomeRail} topRatedRail
 * @property {HomeRail} recentlyAddedRail
 * @property {HomeRail} fromTheCommunityRail
 * @property {HomeRail} creatorsToFollowRail
 * @property {HomeSortControl} sortControl Seated in the top rail's head control slot only.
 * @property {HomeBannerProps} bottomBanner
 * @property {{label: string, message: string}|null} notice R4 fixture-action notice (10 Aug 2026 review gate): non-persisting acknowledgement for any control whose real behavior waits on live wiring. Null renders nothing.
 * @property {(() => void)|null} onCloseNotice
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
