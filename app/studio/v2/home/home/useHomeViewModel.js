"use client";

import { useMemo, useState } from "react";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import { setProfileFollowByUsername } from "@/lib/client/studio/profile/profileFollowClient";
import { projectCommunityCreations } from "@/lib/shared/presentation/communityPresentation";
import { projectCommunityCreators } from "@/lib/shared/presentation/creatorPresentation";
import {
  projectOwnedLoreCreations,
  projectPublicLoreCreations,
} from "@/lib/shared/presentation/lorePresentation";
import {
  projectCreationsToStoryStartables,
  projectStoryRoomToContinueItem,
  resolveStoryContinueImageAnchor,
  resolveStoryContinueImageSrc,
} from "@/lib/shared/presentation/storiesPresentation";
import { projectCreationsToVaultItems } from "@/lib/shared/presentation/vaultPresentation";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";

const RAIL_ITEM_CAP = 12;
const TITLE_CHARACTER_CAP = 48;

// Home fine-tuning batch 1 (6 Sep 2026, Brian's brief): one list per
// sidebar section, in sidebar order. Studio and Images ship no list
// data anywhere in the app today (Studio is a hub with no list;
// Images fetches its library client-side only), so their lists have
// no source and render nothing; both are reported as data gaps.
const SECTIONS = Object.freeze([
  Object.freeze({ id: "stories", label: "Stories", href: "/studio/v2/stories" }),
  Object.freeze({ id: "adventures", label: "Adventures", href: "/studio/v2/adventures" }),
  Object.freeze({ id: "studio", label: "Studio", href: "/studio" }),
  Object.freeze({ id: "images", label: "Images", href: "/studio/v2/images" }),
  Object.freeze({ id: "vault", label: "Vault", href: "/studio/v2/vault" }),
  Object.freeze({ id: "community", label: "Community", href: "/studio/v2/community" }),
  Object.freeze({ id: "creators", label: "Creators", href: "/studio/v2/creators" }),
  Object.freeze({ id: "lore", label: "Lore", href: "/studio/v2/lore" }),
]);

// The ruled sort options (FE/FILTERS, 6 Sep 2026: Plays, Likes,
// Remixes, Newest; Saves retired). Ruling change (FE/FILTERS
// follow-up, 6 Sep 2026): every ruled sort option renders on every
// rail regardless of whether the payload carries the field yet; where
// a field is absent, the option is shown and selectable and leaves
// the rail in its current order (no invented values). Labels
// shortened 6 Sep 2026 (Home quick fix): "Most" dropped, the trigger
// reads "Sort: Plays".
const SORT_OPTIONS = Object.freeze([
  Object.freeze({ value: "plays", label: "Plays" }),
  Object.freeze({ value: "likes", label: "Likes" }),
  Object.freeze({ value: "remixes", label: "Remixes" }),
  Object.freeze({ value: "newest", label: "Newest" }),
]);

// Cold-start hero art: the ruled Eden confrontation
// (docs/CRESTFALL-DESIGN-CONTEXT.md, Home cold-start banner, closed;
// docs/APP-FUNCTION-MAP.csv Ruling f, 11 Aug 2026), restored here after
// commit 2906e3f1 had pointed the live view model at cover art.
const TOP_BANNER = Object.freeze({
  eyebrow: "Crestfall Chronicles",
  title: "Start something worth finishing.",
  ctaLabel: "Browse stories",
  secondaryCtaLabel: "See what others made",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
});

// Bottom banner: next section in the journey loop is Stories (chain
// ruling 6 Sep 2026, matching Home PRD R1). Landscape placeholder art
// shared by every section page's bottom banner. Copy is the Play copy
// the Stories page already carries (sidebar batch 1 carry-over, 6 Sep
// 2026): the banner sells Play, not Create.
const BOTTOM_BANNER = Object.freeze({
  eyebrow: "Play",
  title: "Worlds worth committing to.",
  ctaLabel: "Open Stories",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
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

function capTitle(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length <= TITLE_CHARACTER_CAP) return text;
  return `${text.slice(0, TITLE_CHARACTER_CAP - 1).trimEnd()}…`;
}

function toTimestamp(value) {
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
}

function createdTimestamp(item = {}) {
  const raw = item.rawCreation || {};
  return toTimestamp(raw.createdAt || raw.created_at) || (Number(item.recency) || 0);
}

function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sortItems(items = [], sortValue) {
  const hasField = items.some((item) => numberOrNull(item.sortValues?.[sortValue]) !== null);
  if (!hasField) return items;

  const copy = [...items];
  const read = (item) => item.sortValues?.[sortValue] ?? null;
  return copy.sort((a, b) => (read(b) || 0) - (read(a) || 0));
}

export function useHomeViewModel({
  rooms = [],
  ownedCreations = [],
  communityCreations = [],
  creators = [],
  creatorCreations = [],
  loreCommunityCreations = [],
  loreOwnedCreations = [],
  viewerUsername = null,
  viewerDisplayName = null,
  followingUsernames = [],
  storiesLoadError = null,
  communityLoadError = null,
  creatorsLoadError = null,
  loreLoadError = null,
  onNavigate = null,
} = {}) {
  const [sortSelections, setSortSelections] = useState({});
  const [followOverrides, setFollowOverrides] = useState({});
  const [notice, setNotice] = useState(null);

  const communityItems = useMemo(
    () => projectCommunityCreations(communityCreations),
    [communityCreations]
  );

  const storyStartables = useMemo(() => {
    const byId = new Map();
    const ownedSources = projectCreationsToStoryStartables(ownedCreations, { isOwn: true });
    const communitySources = projectCreationsToStoryStartables(communityCreations, { isOwn: false });

    [...ownedSources, ...communitySources].forEach((creation) => {
      if (creation?.id && !byId.has(creation.id)) {
        byId.set(creation.id, creation);
      }
    });

    return [...byId.values()];
  }, [ownedCreations, communityCreations]);

  const vaultOwnedItems = useMemo(
    () => projectCreationsToVaultItems(ownedCreations, { isOwn: true }),
    [ownedCreations]
  );

  const loreItems = useMemo(() => {
    const mine = projectOwnedLoreCreations(loreOwnedCreations).map((item) => ({ ...item, isOwn: true }));
    const community = projectPublicLoreCreations(loreCommunityCreations).map((item) => ({
      ...item,
      isOwn: false,
    }));
    const mineIds = new Set(mine.map((item) => item.id));
    return [...mine, ...community.filter((item) => !mineIds.has(item.id))];
  }, [loreOwnedCreations, loreCommunityCreations]);

  const engagementCandidates = useMemo(() => {
    const byId = new Map();
    [...communityItems, ...storyStartables, ...vaultOwnedItems, ...loreItems].forEach((item) => {
      if (item?.id && !byId.has(item.id)) byId.set(item.id, item);
    });
    return [...byId.values()];
  }, [communityItems, storyStartables, vaultOwnedItems, loreItems]);
  const engagement = useCreationEngagementState(engagementCandidates);

  const storySourceCreationById = useMemo(() => {
    const byId = new Map();
    storyStartables.forEach((creation) => byId.set(creation.id, creation));
    return byId;
  }, [storyStartables]);

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
      onContinue: () => onNavigate?.(buildStoryChatHref(item.roomId)),
      onSecondaryCtaClick: () => onNavigate?.("/studio/v2/stories"),
    };
  }, [rooms, storySourceCreationById, onNavigate]);

  const decorateCreation = useMemo(
    () =>
      (item, { assetKind = item.assetKind, openHref = null } = {}) => {
        const stats = item.stats || {
          plays: numberOrNull(item.plays),
          hearts: numberOrNull(item.hearts),
          saves: numberOrNull(item.saves),
          followers: null,
        };
        const href = openHref || `/studio/creations/${encodeURIComponent(item.id)}`;

        return {
          cardKind: "creation",
          id: item.id,
          assetKind,
          creationType: item.type,
          title: capTitle(item.title),
          subtitle: item.subtitle,
          imageSrc: item.imageSrc,
          badges: item.isCanon ? [{ label: "Canon", variant: "canon" }] : [],
          stats,
          liked: engagement.isCreationLiked(item),
          bookmarked: engagement.isCreationBookmarked(item),
          onOpenImageOverlay: () => onNavigate?.(href),
          onOpenAssetDetail: () => onNavigate?.(href),
          onLike: () => engagement.toggleCreationLike(item),
          onBookmark: () => engagement.toggleCreationBookmark(item),
          sortValues: {
            plays: numberOrNull(stats.plays),
            likes: numberOrNull(stats.hearts),
            remixes: numberOrNull(stats.remixes),
            newest: createdTimestamp(item),
          },
        };
      },
    [engagement, onNavigate]
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
            handle: capTitle(creator.handle),
            stats: {
              followers: creator.followers,
              likes: creator.likes,
              plays: creator.plays,
              works: creator.works,
            },
            isFollowing,
            sortValues: {
              plays: numberOrNull(creator.plays),
              likes: numberOrNull(creator.likes),
              remixes: null,
              newest: Number(creator.recency) || 0,
            },
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

  // Section sources, each the same data its section page loads.
  const sectionItems = useMemo(() => {
    const community = communityItems.map((item) => decorateCreation(item));
    const stories = storyStartables
      .filter((item) => !item.isArchived)
      .map((item) => decorateCreation(item));
    const adventures = communityItems
      .filter((item) => item.type === "STORYLINE")
      .map((item) => decorateCreation(item));
    const ownedIds = new Set(vaultOwnedItems.map((item) => item.id));
    const vault = [
      ...vaultOwnedItems.map((item) => decorateCreation(item)),
      ...communityItems
        .filter((item) => !ownedIds.has(item.id) && engagement.isCreationBookmarked(item))
        .map((item) => decorateCreation(item)),
    ];
    const lore = loreItems.map((item) =>
      decorateCreation(item, {
        assetKind: "lore",
        openHref: item.isOwn
          ? `/studio/v2/editor/${encodeURIComponent(item.id)}?origin=lore`
          : null,
      })
    );

    return {
      stories,
      adventures,
      studio: [],
      images: [],
      vault,
      community,
      creators: creatorCards,
      lore,
    };
  }, [communityItems, storyStartables, vaultOwnedItems, loreItems, creatorCards, decorateCreation, engagement]);

  const sectionRails = useMemo(
    () =>
      SECTIONS.map((section) => {
        const items = sectionItems[section.id] || [];
        const options = SORT_OPTIONS;
        const selectedValue = sortSelections[section.id] || options[0].value;
        const sorted = sortItems(items, selectedValue);

        return {
          id: section.id,
          label: section.label,
          viewAllLabel: "View all",
          onViewAll: () => onNavigate?.(section.href),
          items: sorted.slice(0, RAIL_ITEM_CAP),
          sortControl: {
            options,
            selectedValue,
            onChange: (value) =>
              setSortSelections((current) => ({ ...current, [section.id]: value })),
          },
        };
      }),
    [sectionItems, sortSelections, onNavigate]
  );

  const sourceErrors = [
    storiesLoadError,
    communityLoadError,
    creatorsLoadError,
    loreLoadError,
    engagement.engagementMessage,
  ].filter(Boolean);
  const hasDiscoverableData =
    sectionRails.some((rail) => rail.items.length > 0) || Boolean(continueItem);
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
    sectionRails,
    bottomBanner: {
      ...BOTTOM_BANNER,
      onCtaClick: () => onNavigate?.("/studio/v2/stories"),
    },
    errorMessage,
    warningMessage,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
