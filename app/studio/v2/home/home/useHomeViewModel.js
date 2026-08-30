"use client";

import { useMemo, useState } from "react";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import { setProfileFollowByUsername } from "@/lib/client/studio/profile/profileFollowClient";
import { projectCommunityCreations } from "@/lib/shared/presentation/communityPresentation";
import { projectCommunityCreators } from "@/lib/shared/presentation/creatorPresentation";
import {
  projectCreationsToStoryStartables,
  projectStoryRoomToContinueItem,
  resolveStoryContinueImageAnchor,
  resolveStoryContinueImageSrc,
} from "@/lib/shared/presentation/storiesPresentation";

const RAIL_ITEM_CAP = 12;

const DESTINATIONS = Object.freeze([
  Object.freeze({
    id: "stories",
    label: "Stories",
    supportingLine: "Continue a room or begin a new Story.",
    href: "/studio/v2/stories",
    identityKey: "DESTINATION_STORIES",
  }),
  Object.freeze({
    id: "adventures",
    label: "Adventures",
    supportingLine: "Explore connected Storylines and longer arcs.",
    href: "/studio/v2/adventures",
    identityKey: "DESTINATION_ADVENTURES",
  }),
  Object.freeze({
    id: "studio",
    label: "Studio",
    supportingLine: "Build characters, worlds, Stories, and mechanics.",
    href: "/studio",
    identityKey: "DESTINATION_STUDIO",
  }),
  Object.freeze({
    id: "images",
    label: "Images",
    supportingLine: "Generate and manage visual assets.",
    href: "/studio/v2/images",
    identityKey: "DESTINATION_IMAGES",
  }),
  Object.freeze({
    id: "vault",
    label: "Vault",
    supportingLine: "Find your work and public creations you saved.",
    href: "/studio/v2/vault",
    identityKey: "DESTINATION_VAULT",
  }),
  Object.freeze({
    id: "community",
    label: "Community",
    supportingLine: "Discover public creations across Crestfall.",
    href: "/studio/v2/community",
    identityKey: "DESTINATION_COMMUNITY",
  }),
  Object.freeze({
    id: "creators",
    label: "Creators",
    supportingLine: "Follow creators and browse their recent work.",
    href: "/studio/v2/creators",
    identityKey: "DESTINATION_CREATORS",
  }),
  Object.freeze({
    id: "lore",
    label: "Lore",
    supportingLine: "Read and author persistent world records.",
    href: "/studio/v2/lore",
    identityKey: "DESTINATION_LORE",
  }),
]);

const SORT_OPTIONS = Object.freeze([
  Object.freeze({ value: "recommended", label: "Recommended" }),
  Object.freeze({ value: "popular", label: "Most played" }),
  Object.freeze({ value: "recent", label: "Newest" }),
]);

const TOP_BANNER = Object.freeze({
  eyebrow: "Crestfall Chronicles",
  title: "Start something worth finishing.",
  ctaLabel: "Browse stories",
  secondaryCtaLabel: "See what others made",
  imageSrc: "/assets/covers/crestfall-compass-cover.png",
});

const BOTTOM_BANNER = Object.freeze({
  eyebrow: "Create",
  title: "Build the next world.",
  ctaLabel: "Open Studio",
  imageSrc: "/assets/covers/crestfall-drawings-cover.png",
});

function relativeTimeLabel(value) {
  const timestamp = value ? new Date(value).getTime() : 0;
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "recently";

  const deltaMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (deltaMinutes < 2) return "just now";
  if (deltaMinutes < 60) return `${deltaMinutes} minutes ago`;

  const hours = Math.round(deltaMinutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  return "recently";
}

function creationScore(item = {}) {
  return (Number(item.hearts) || 0) * 8 + (Number(item.saves) || 0) * 5 + (Number(item.plays) || 0);
}

function sortCommunity(items = [], sortValue = "recommended") {
  const copy = [...items];
  if (sortValue === "recent") {
    return copy.sort((a, b) => (b.recency || 0) - (a.recency || 0));
  }
  if (sortValue === "popular") {
    return copy.sort((a, b) => (b.plays || 0) - (a.plays || 0) || (b.hearts || 0) - (a.hearts || 0));
  }

  return copy.sort(
    (a, b) =>
      Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
      Number(Boolean(b.isCanon)) - Number(Boolean(a.isCanon)) ||
      creationScore(b) - creationScore(a) ||
      (b.recency || 0) - (a.recency || 0)
  );
}

function rail(label, items, onViewAll) {
  return {
    label,
    viewAllLabel: "View all",
    onViewAll,
    items: items.slice(0, RAIL_ITEM_CAP),
  };
}

export function useHomeViewModel({
  rooms = [],
  ownedCreations = [],
  communityCreations = [],
  creators = [],
  creatorCreations = [],
  viewerUsername = null,
  viewerDisplayName = null,
  followingUsernames = [],
  storiesLoadError = null,
  communityLoadError = null,
  creatorsLoadError = null,
  onNavigate = null,
} = {}) {
  const [sortValue, setSortValue] = useState("recommended");
  const [followOverrides, setFollowOverrides] = useState({});
  const [notice, setNotice] = useState(null);

  const communityItems = useMemo(
    () => projectCommunityCreations(communityCreations),
    [communityCreations]
  );
  const engagement = useCreationEngagementState(communityItems);

  const storySourceCreationById = useMemo(() => {
    const byId = new Map();
    const ownedSources = projectCreationsToStoryStartables(ownedCreations, {
      isOwn: true,
    });
    const communitySources = projectCreationsToStoryStartables(communityCreations, {
      isOwn: false,
    });

    [...ownedSources, ...communitySources].forEach((creation) => {
      if (creation?.id && !byId.has(creation.id)) {
        byId.set(creation.id, creation);
      }
    });

    return byId;
  }, [ownedCreations, communityCreations]);

  const creatorItems = useMemo(
    () =>
      projectCommunityCreators(creators, {
        creations: creatorCreations,
        viewerUsername,
        followingUsernames,
      }),
    [creators, creatorCreations, viewerUsername, followingUsernames]
  );

  const continueItem = useMemo(() => {
    const projected = (Array.isArray(rooms) ? rooms : [])
      .map((room, index) => projectStoryRoomToContinueItem(room, index))
      .filter((item) => !["COMPLETED", "ARCHIVED", "DELETED"].includes(item.status))
      .sort((a, b) => (b.recency || 0) - (a.recency || 0));

    const item = projected[0] || null;
    if (!item) return null;

    const sourceCreation = item.sourceCreationId
      ? storySourceCreationById.get(item.sourceCreationId)
      : null;

    return {
      id: item.id,
      title: item.title,
      kindLabel: item.kind === "adventure" ? "Adventure" : "Story",
      lastPlayedLabel: relativeTimeLabel(item.lastPlayed),
      imageSrc: resolveStoryContinueImageSrc(item, sourceCreation),
      imageAnchor: resolveStoryContinueImageAnchor(item, sourceCreation),
      secondaryCtaLabel: "Explore recent stories",
      onContinue: () => onNavigate?.(`/studio/story-rooms/${encodeURIComponent(item.roomId)}`),
      onSecondaryCtaClick: () => onNavigate?.("/studio/v2/stories"),
    };
  }, [rooms, storySourceCreationById, onNavigate]);

  const destinationTiles = useMemo(
    () =>
      DESTINATIONS.map((item) => ({
        ...item,
        onOpen: () => onNavigate?.(item.href),
      })),
    [onNavigate]
  );

  const decoratedCommunity = useMemo(
    () =>
      communityItems.map((item) => ({
        cardKind: "creation",
        id: item.id,
        assetKind: item.assetKind,
        creationType: item.type,
        title: item.title,
        subtitle: item.subtitle,
        imageSrc: item.imageSrc,
        badges: item.isCanon ? [{ label: "Canon", variant: "canon" }] : [],
        stats: {
          plays: item.plays,
          hearts: item.hearts,
          saves: item.saves,
          followers: null,
        },
        liked: engagement.isCreationLiked(item),
        bookmarked: engagement.isCreationBookmarked(item),
        onOpenImageOverlay: () => onNavigate?.(`/studio/creations/${encodeURIComponent(item.id)}`),
        onOpenAssetDetail: () => onNavigate?.(`/studio/creations/${encodeURIComponent(item.id)}`),
        onLike: () => engagement.toggleCreationLike(item),
        onBookmark: () => engagement.toggleCreationBookmark(item),
      })),
    [communityItems, engagement, onNavigate]
  );

  const creatorCards = useMemo(
    () =>
      creatorItems
        .filter((creator) => !creator.isOwnProfile)
        .map((creator) => {
          const overridden = followOverrides[creator.id];
          const isFollowing = typeof overridden === "boolean" ? overridden : creator.isFollowing;

          return {
            cardKind: "creator",
            ...creator,
            stats: {
              followers: creator.followers,
              likes: creator.likes,
              plays: creator.plays,
              works: creator.works,
            },
            isFollowing,
            onThumbnailOpen: (thumbnailId) => {
              const thumbnail = creator.thumbnails.find((entry) => entry.id === thumbnailId);
              if (thumbnail?.creationId) {
                onNavigate?.(`/studio/creations/${encodeURIComponent(thumbnail.creationId)}`);
              }
            },
            onViewProfile: () =>
              onNavigate?.(`/studio/v2/creators/${encodeURIComponent(creator.username)}`),
            onFollow: creator.canFollow
              ? async () => {
                  const nextFollowing = !isFollowing;
                  setFollowOverrides((current) => ({ ...current, [creator.id]: nextFollowing }));
                  try {
                    await setProfileFollowByUsername({
                      username: creator.username,
                      active: nextFollowing,
                    });
                  } catch (error) {
                    setFollowOverrides((current) => ({ ...current, [creator.id]: isFollowing }));
                    setNotice({
                      label: nextFollowing ? "Follow creator" : "Unfollow creator",
                      message: error?.message || "Follow state could not be saved.",
                    });
                  }
                }
              : null,
          };
        }),
    [creatorItems, followOverrides, onNavigate]
  );

  const sorted = useMemo(
    () => sortCommunity(decoratedCommunity, sortValue),
    [decoratedCommunity, sortValue]
  );
  // This shelf represents newly created work, not most recently edited work.
  // The community projection's recency value tracks updatedAt, so read the
  // authoritative createdAt value from the raw creation summaries instead.
  const createdAtById = useMemo(() => {
    const byId = new Map();

    (Array.isArray(communityCreations) ? communityCreations : []).forEach((creation) => {
      if (!creation?.id) return;
      const created = creation.createdAt || creation.created_at || null;
      const timestamp = created ? new Date(created).getTime() : 0;
      byId.set(creation.id, Number.isFinite(timestamp) ? timestamp : 0);
    });

    return byId;
  }, [communityCreations]);

  const recent = useMemo(
    () =>
      [...decoratedCommunity].sort(
        (a, b) => (createdAtById.get(b.id) || 0) - (createdAtById.get(a.id) || 0)
      ),
    [decoratedCommunity, createdAtById]
  );

  const topRatedRail = rail("Popular now", sorted, () => onNavigate?.("/studio/v2/community"));
  const recentlyAddedRail = rail("Recently added", recent, () => onNavigate?.("/studio/v2/community"));
  const fromTheCommunityRail = rail(
    "From the community",
    decoratedCommunity.filter((item) => !sorted.slice(0, 4).some((top) => top.id === item.id)),
    () => onNavigate?.("/studio/v2/community")
  );
  const creatorsToFollowRail = rail(
    "Creators to follow",
    creatorCards,
    () => onNavigate?.("/studio/v2/creators")
  );

  const sourceErrors = [storiesLoadError, communityLoadError, creatorsLoadError, engagement.engagementMessage]
    .filter(Boolean);
  const hasDiscoverableData = decoratedCommunity.length > 0 || creatorCards.length > 0 || Boolean(continueItem);
  const errorMessage = !hasDiscoverableData && sourceErrors.length ? sourceErrors[0] : null;
  const warningMessage = hasDiscoverableData && sourceErrors.length ? sourceErrors.join(" ") : null;
  const welcomeName =
    (typeof viewerDisplayName === "string" && viewerDisplayName.trim()) ||
    (typeof viewerUsername === "string" && viewerUsername.trim()) ||
    "Player";

  return {
    welcomeName,
    topBanner: {
      ...TOP_BANNER,
      onCtaClick: () => onNavigate?.("/studio/v2/stories"),
      onSecondaryCtaClick: () => onNavigate?.("/studio/v2/community"),
    },
    continueItem,
    destinationTiles,
    topRatedRail,
    recentlyAddedRail,
    fromTheCommunityRail,
    creatorsToFollowRail,
    sortControl: {
      options: SORT_OPTIONS,
      selectedValue: sortValue,
      onChange: setSortValue,
    },
    bottomBanner: {
      ...BOTTOM_BANNER,
      onCtaClick: () => onNavigate?.("/studio"),
    },
    errorMessage,
    warningMessage,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
