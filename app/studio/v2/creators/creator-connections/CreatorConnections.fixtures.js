// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5): default, empty, loading, error, plus a
// high-volume cap/append pair proving the load-more pattern at 30+
// entries. Built directly from useCreatorConnectionsViewModel's
// output shape rather than re-deriving from
// creatorConnectionsContent.mock.js, so these exercise the View in
// isolation (preview route) without mounting the hook.
import { CREATOR_CONNECTIONS } from "./creatorConnectionsContent.mock";

const noop = () => {};

const VERMILLION = CREATOR_CONNECTIONS.vermillion;
const PAGE_SIZE = 6;

function decorateItem(item) {
  return {
    id: item.id,
    handle: item.handle,
    displayName: item.displayName,
    avatarSrc: item.avatarSrc,
    isFollowing: item.isFollowing,
    onToggleFollow: noop,
    onOpenProfile: noop,
  };
}

const BOTTOM_BANNER = {
  eyebrow: "Next stop",
  title: "Read the world this creator is writing into.",
  ctaLabel: "Read the lore",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Lilith.png"),
  onCtaClick: noop,
};

function loadMoreFor(visibleCount, allEntries) {
  const hasMore = visibleCount < allEntries.length;
  return {
    isLoading: false,
    hasMore,
    remainingCount: hasMore ? allEntries.length - visibleCount : null,
    onLoadMore: noop,
  };
}

function baseFixture() {
  const followersVisible = VERMILLION.followers.slice(0, PAGE_SIZE);
  return {
    displayName: VERMILLION.displayName,
    handle: VERMILLION.handle,
    activeTab: "followers",
    onChangeTab: noop,
    followersCount: VERMILLION.followers.length,
    followingCount: VERMILLION.following.length,
    items: followersVisible.map(decorateItem),
    emptyMessage: VERMILLION.followers.length === 0 ? "No followers yet." : null,
    loadMore: loadMoreFor(followersVisible.length, VERMILLION.followers),
    errorMessage: null,
    isLoading: false,
    bottomBanner: BOTTOM_BANNER,
  };
}

// Default: the Followers tab active, a populated list.
export const creatorConnectionsDefaultFixture = baseFixture();

// Following tab: same creator, Following tab active.
export const creatorConnectionsFollowingTabFixture = {
  ...baseFixture(),
  activeTab: "following",
  items: VERMILLION.following.slice(0, PAGE_SIZE).map(decorateItem),
  emptyMessage: VERMILLION.following.length === 0 ? "Not following anyone yet." : null,
  loadMore: loadMoreFor(Math.min(PAGE_SIZE, VERMILLION.following.length), VERMILLION.following),
};

// Empty: a creator with no followers and no following. Ruled
// empty-state law (matching Adventures/Lore/Creator Profile
// precedent): a message, not a fabricated placeholder row.
export const creatorConnectionsEmptyFixture = {
  ...baseFixture(),
  followersCount: 0,
  followingCount: 0,
  items: [],
  emptyMessage: "No followers yet.",
  loadMore: loadMoreFor(0, []),
};

// Loading: skeleton state, no content rendered.
export const creatorConnectionsLoadingFixture = {
  ...baseFixture(),
  isLoading: true,
};

// Error: page-level load failure, distinct from a tab's own empty
// state (docs/PARITY-ECHO-FULL.md Creators row 808-813 note, same
// pattern applied here).
export const creatorConnectionsErrorFixture = {
  ...baseFixture(),
  errorMessage: "This creator's connections could not be loaded.",
  items: [],
  emptyMessage: null,
};

// High-volume law, RULED from birth: 32 followers, the same
// batch-then-append KitLoadMoreView pattern the profile's Creations
// and Activity sections already use. `items` carries only the first
// page, `loadMore` exposes the remaining entries for Show more.
const FOLLOWER_CAP_ENTRIES = Array.from({ length: 32 }, (_, index) => ({
  id: `follower-cap-${index + 1}`,
  handle: `fixture-follower-${index + 1}`,
  displayName: `Fixture Follower ${index + 1}`,
  avatarSrc: null,
  isFollowing: index % 3 === 0,
}));

export const creatorConnectionsCapFixture = {
  ...baseFixture(),
  followersCount: FOLLOWER_CAP_ENTRIES.length,
  items: FOLLOWER_CAP_ENTRIES.slice(0, PAGE_SIZE).map(decorateItem),
  emptyMessage: null,
  loadMore: loadMoreFor(PAGE_SIZE, FOLLOWER_CAP_ENTRIES),
};

// Second batch revealed: proves the append behavior itself, eighteen
// entries visible (three Show more presses), fourteen still to come.
export const creatorConnectionsCapAppendedFixture = {
  ...creatorConnectionsCapFixture,
  items: FOLLOWER_CAP_ENTRIES.slice(0, PAGE_SIZE * 3).map(decorateItem),
  loadMore: loadMoreFor(PAGE_SIZE * 3, FOLLOWER_CAP_ENTRIES),
};
