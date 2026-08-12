export const CREATOR_PROFILE_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Stable portable UI boundary for the Creators profile-detail page
 * View (docs/PARITY-ECHO-FULL.md Creators rows 796-818, the entire
 * profile-detail page: the largest single-page build item on that
 * list). New page this pass, contract authorized none to 1.0.0 at
 * this gate. Build address /studio/v2/creators/[handle] (route law,
 * cutover sequence). Fixture-driven only, pre-parity: no fetch, no
 * services-api, no product data.
 *
 * Composition, top to bottom: back button -> page header (eyebrow,
 * display name, short description) -> identity block (avatar, handle,
 * bio, tabular stat tiles, engagement action row: Follow, Like,
 * Bookmark, Share, Donate, Mute) -> Creations grid (KitCreationCard,
 * no onPlay/onGenerate, expand fallback only) with load-more ->
 * Activity section -> Badges section -> bottom banner routing to
 * Lore. The donate action opens a page-local modal (amount, message,
 * anonymous). A profile-level load-error banner replaces the whole
 * content area below the header when errorMessage is set, distinct
 * from a per-section empty state.
 *
 * v1.1.0, RULED 11 Aug 2026 (item 36, CR-028, closed): mute
 * placement is ruled, inline in the engagement action row only,
 * labeled "Mute content" ("Muted" when active). The
 * standalone-under-bio variant this contract once carried as a
 * genuinely competing placement is retired; `mutePlacement` leaves
 * the prop surface, no toggle, no second render path. A removal is a
 * major bump per contract law elsewhere in this repo, but this prop
 * was never ruled stable (AWAITING BRIAN RENDER REVIEW since it
 * shipped), so its retirement closes the open item rather than
 * breaking a settled one; v1.1.0 records the removal for
 * traceability. Accessible label matches the visible label (button
 * text content is the accessible name); the icon is unchanged.
 *
 * v1.2.0: the Followers and Following stat tiles are interactive,
 * routing to the new Creators connections sub-page
 * (/studio/v2/creators/[handle]/connections). Additive minor bump:
 * `onOpenFollowers` and `onOpenFollowing` join the prop surface,
 * both optional; when absent the tiles render exactly as before
 * (non-interactive). Plays and Works stay non-interactive, no prop
 * added for either.
 *
 * @typedef {Object} CreatorProfileStats
 * @property {number|null} followers
 * @property {number|null} following
 * @property {number|null} plays
 * @property {number|null} works
 *
 * @typedef {Object} CreatorProfileWorkItem
 * @property {"creation"} cardKind
 * @property {string} assetKind
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
 * @typedef {Object} CreatorProfileBadgeItem
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {string|null} imageSrc
 *
 * @typedef {Object} CreatorProfileActivityItem
 * @property {string} id
 * @property {"creation"|"donation"} kind
 * @property {string} label
 * @property {string} timestamp
 *
 * @typedef {Object} CreatorProfileEngagement
 * @property {boolean} isFollowing
 * @property {(() => void)|null} onFollow
 * @property {boolean} isLiked
 * @property {(() => void)|null} onLike
 * @property {boolean} isBookmarked
 * @property {(() => void)|null} onBookmark
 * @property {(() => void)|null} onShare
 * @property {(() => void)|null} onOpenDonate
 * @property {boolean} isMuted
 * @property {(() => void)|null} onToggleMute
 *
 * @typedef {Object} CreatorProfileDonateModal
 * @property {string} recipientDisplayName
 * @property {string} amount
 * @property {((value: string) => void)|null} onAmountChange
 * @property {string} amountError
 * @property {string} message
 * @property {((value: string) => void)|null} onMessageChange
 * @property {boolean} isAnonymous
 * @property {((value: boolean) => void)|null} onAnonymousChange
 * @property {(() => void)|null} onSubmit
 * @property {(() => void)|null} onClose
 *
 * @typedef {Object} CreatorProfileViewProps
 * @property {string} displayName
 * @property {string} handle
 * @property {string} bio
 * @property {string|null} avatarSrc
 * @property {CreatorProfileStats} stats
 * @property {(() => void)|null} [onOpenFollowers] Routes the Followers stat tile to the connections page (tab=followers). Tile is non-interactive when absent.
 * @property {(() => void)|null} [onOpenFollowing] Routes the Following stat tile to the connections page (tab=following). Tile is non-interactive when absent.
 * @property {CreatorProfileEngagement} engagement
 * @property {CreatorProfileWorkItem[]} workItems
 * @property {string|null} worksEmptyMessage
 * @property {{isLoading: boolean, hasMore: boolean, remainingCount: number|null, onLoadMore: (() => void)|null}} worksLoadMore
 * @property {CreatorProfileActivityItem[]} activityItems
 * @property {string|null} activityEmptyMessage
 * @property {CreatorProfileBadgeItem[]} badgeItems
 * @property {string|null} badgesEmptyMessage
 * @property {string|null} errorMessage Profile-level load-error banner, distinct from a section's own empty state.
 * @property {boolean} isLoading
 * @property {boolean} isDonateModalOpen
 * @property {CreatorProfileDonateModal} donateModal
 * @property {{eyebrow: string, title: string, ctaLabel: string, imageSrc: string|null, onCtaClick: (() => void)|null}} bottomBanner Routes to Lore, Creators' next stop.
 * @property {{label: string, message: string}|null} notice R4 fixture-action notice for any control whose real behavior waits on live wiring (share, donate submission).
 * @property {(() => void)|null} onCloseNotice
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
