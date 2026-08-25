"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CreatorConnectionsView from "./creator-connections/CreatorConnections.view";
import { projectLiveCreatorConnections } from "@/lib/shared/presentation/creatorProfilePresentation";
import { setProfileFollowByUsername } from "@/lib/client/studio/profile/profileFollowClient";

const PAGE_SIZE = 12;

export default function CreatorConnectionsLive({ pageData = {}, initialTab = "followers" } = {}) {
  const router = useRouter();
  const projected = useMemo(() => projectLiveCreatorConnections(pageData), [pageData]);
  const [activeTab, setActiveTab] = useState(initialTab === "following" ? "following" : "followers");
  const [visibleFollowersCount, setVisibleFollowersCount] = useState(PAGE_SIZE);
  const [visibleFollowingCount, setVisibleFollowingCount] = useState(PAGE_SIZE);
  const [followOverrides, setFollowOverrides] = useState(() => new Map());
  const [actionError, setActionError] = useState("");

  const source = activeTab === "following" ? projected.following : projected.followers;
  const visibleCount = activeTab === "following" ? visibleFollowingCount : visibleFollowersCount;

  function currentFollowState(item) {
    return followOverrides.has(item.handle) ? followOverrides.get(item.handle) : item.isFollowing;
  }

  async function toggleFollow(item) {
    if (!item.canFollow || !item.handle) return;
    const previous = currentFollowState(item);
    const next = !previous;
    setActionError("");
    setFollowOverrides((current) => new Map(current).set(item.handle, next));

    try {
      await setProfileFollowByUsername({ username: item.handle, active: next });
      router.refresh();
    } catch (error) {
      setFollowOverrides((current) => new Map(current).set(item.handle, previous));
      setActionError(error?.message || "Follow state could not be saved.");
    }
  }

  const items = source.slice(0, visibleCount).map((item) => ({
    ...item,
    isFollowing: currentFollowState(item),
    onToggleFollow: item.canFollow ? () => toggleFollow(item) : null,
    onOpenProfile: () => router.push(`/studio/v2/creators/${encodeURIComponent(item.handle)}`),
  }));

  const hasMore = visibleCount < source.length;

  function changeTab(tab) {
    const next = tab === "following" ? "following" : "followers";
    setActiveTab(next);
    router.replace(
      `/studio/v2/creators/${encodeURIComponent(projected.profile.handle)}/connections?tab=${next}`,
      { scroll: false }
    );
  }

  return (
    <CreatorConnectionsView
      displayName={projected.profile.displayName}
      handle={projected.profile.handle}
      activeTab={activeTab}
      onChangeTab={changeTab}
      followersCount={projected.followCounts.followers}
      followingCount={projected.followCounts.following}
      items={items}
      emptyMessage={source.length ? null : activeTab === "following" ? "Not following anyone yet." : "No followers yet."}
      loadMore={{
        isLoading: false,
        hasMore,
        remainingCount: hasMore ? source.length - visibleCount : null,
        onLoadMore: () =>
          activeTab === "following"
            ? setVisibleFollowingCount((current) => current + PAGE_SIZE)
            : setVisibleFollowersCount((current) => current + PAGE_SIZE),
      }}
      errorMessage={pageData.loadError || null}
      actionError={actionError}
      isLoading={false}
      bottomBanner={{
        eyebrow: "Next stop",
        title: "Read the world this creator is writing into.",
        ctaLabel: "Read the lore",
        imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Maya Chen.png"),
        onCtaClick: () => router.push("/studio/v2/lore"),
      }}
    />
  );
}
