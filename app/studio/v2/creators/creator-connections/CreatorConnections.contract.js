export const CREATOR_CONNECTIONS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the Creators connections sub-page
 * View (docs/PARITY-ECHO-FULL.md Creators rows 814-818: back link,
 * tabs, connection list, per-connection profile link, per-connection
 * follow/following control). New page this pass, contract authorized
 * none to 1.0.0 at this gate. Build address
 * /studio/v2/creators/[handle]/connections. Fixture-driven only,
 * pre-parity: no fetch, no services-api, no product data.
 *
 * Composition, top to bottom: back button -> page header (eyebrow,
 * owning creator's display name as title, "@handle" as description)
 * -> tab switcher (Followers count / Following count, legacy row
 * 814-817 precedent: tabs, not stacked sections) -> capped connection
 * list for the active tab with load-more -> bottom banner routing to
 * Lore. A page-level errorMessage replaces the list with a
 * KitAlertStripView danger banner, distinct from a tab's own empty
 * state.
 *
 * @typedef {Object} CreatorConnectionsItem
 * @property {string} id
 * @property {string} handle
 * @property {string} displayName
 * @property {string|null} avatarSrc
 * @property {boolean} isFollowing
 * @property {(() => void)|null} onToggleFollow
 * @property {(() => void)|null} onOpenProfile
 *
 * @typedef {Object} CreatorConnectionsViewProps
 * @property {string} displayName Owning creator's display name.
 * @property {string} handle Owning creator's handle.
 * @property {"followers"|"following"} activeTab
 * @property {(("followers"|"following") => void)|null} onChangeTab
 * @property {number|null} followersCount
 * @property {number|null} followingCount
 * @property {CreatorConnectionsItem[]} items Visible batch for the active tab.
 * @property {string|null} emptyMessage
 * @property {{isLoading: boolean, hasMore: boolean, remainingCount: number|null, onLoadMore: (() => void)|null}} loadMore
 * @property {string|null} errorMessage Page-level load-error banner, distinct from a tab's own empty state.
 * @property {boolean} isLoading
 * @property {{eyebrow: string, title: string, ctaLabel: string, imageSrc: string|null, onCtaClick: (() => void)|null}} bottomBanner Routes to Lore, Creators' next stop.
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
