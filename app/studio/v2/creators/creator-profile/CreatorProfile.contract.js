export const CREATOR_PROFILE_VIEW_CONTRACT_VERSION = "1.0.0";

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
 * mutePlacement is an OPEN item (standing open item CR-028 / item 36,
 * AWAITING BRIAN RENDER REVIEW): placement is not ruled. "engagement"
 * (the shipped default) renders Mute inline in the engagement action
 * row; "standalone" renders it as its own quiet line beneath the bio,
 * a genuinely competing placement. The product page always passes
 * "engagement"; the preview route exposes both through its harness.
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
 * @property {CreatorProfileEngagement} engagement
 * @property {"engagement"|"standalone"} mutePlacement
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
