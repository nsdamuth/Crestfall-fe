"use client";

// Normalizes creatorConnectionsContent.mock.js into
// CreatorConnections.view.jsx props and owns every piece of
// presentation-only local state: the active tab, each tab's
// load-more batch size, and per-connection follow toggles. Routing is
// not owned here: the Shell passes onNavigate; this hook decides, per
// control, whether to call it.
import { useMemo, useState } from "react";

import { resolveCreatorConnections } from "./creatorConnectionsContent.mock";

const PAGE_SIZE = 6;

// Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
// banner-audit sitting): Maya Chen.png, reassigned off Lilith.png so
// Creator Connections does not share a banner with Creators, Creator
// Profile, Community, and Vault, all one click apart (see
// docs/reviews/BANNER-AUDIT.md).
const BOTTOM_BANNER = {
  eyebrow: "Next stop",
  title: "Read the world this creator is writing into.",
  ctaLabel: "Read the lore",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Maya Chen.png"),
};

export function useCreatorConnectionsViewModel({
  handle = "",
  initialTab = "followers",
  fixtureMode = "default",
  onNavigate = null,
} = {}) {
  const record = useMemo(() => resolveCreatorConnections(handle), [handle]);

  const [activeTab, setActiveTab] = useState(initialTab === "following" ? "following" : "followers");
  const [visibleFollowersCount, setVisibleFollowersCount] = useState(PAGE_SIZE);
  const [visibleFollowingCount, setVisibleFollowingCount] = useState(PAGE_SIZE);
  const [followedIds, setFollowedIds] = useState([]);

  function toggleFollow(id) {
    setFollowedIds((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }

  const errorMessage = fixtureMode === "error" ? "This creator's connections could not be loaded." : null;
  const isLoading = fixtureMode === "loading";

  const followersSource = fixtureMode === "empty" || fixtureMode === "error" ? [] : record?.followers || [];
  const followingSource = fixtureMode === "empty" || fixtureMode === "error" ? [] : record?.following || [];

  const activeSource = activeTab === "following" ? followingSource : followersSource;
  const visibleCount = activeTab === "following" ? visibleFollowingCount : visibleFollowersCount;

  function isFollowed(item) {
    if (followedIds.includes(item.id)) return true;
    if (followedIds.includes(`unfollow:${item.id}`)) return false;
    return item.isFollowing;
  }

  function decorate(item) {
    return {
      id: item.id,
      handle: item.handle,
      displayName: item.displayName,
      avatarSrc: item.avatarSrc,
      isFollowing: isFollowed(item),
      onToggleFollow: () => toggleFollow(item.id),
      onOpenProfile: () => onNavigate?.(`/studio/v2/creators/${item.handle}`),
    };
  }

  const items = activeSource.slice(0, visibleCount).map(decorate);
  const hasMore = visibleCount < activeSource.length;
  const loadMore = {
    isLoading: false,
    hasMore,
    remainingCount: hasMore ? activeSource.length - visibleCount : null,
    onLoadMore: () =>
      activeTab === "following"
        ? setVisibleFollowingCount((current) => current + PAGE_SIZE)
        : setVisibleFollowersCount((current) => current + PAGE_SIZE),
  };

  const emptyMessage =
    fixtureMode !== "error" && activeSource.length === 0
      ? activeTab === "following"
        ? "Not following anyone yet."
        : "No followers yet."
      : null;

  const bottomBanner = {
    ...BOTTOM_BANNER,
    onCtaClick: () => onNavigate?.("/studio/v2/lore"),
  };

  return {
    displayName: record?.displayName || "",
    handle: record?.handle || handle,
    activeTab,
    onChangeTab: setActiveTab,
    followersCount: followersSource.length,
    followingCount: followingSource.length,
    items,
    emptyMessage,
    loadMore,
    errorMessage,
    isLoading,
    bottomBanner,
  };
}
