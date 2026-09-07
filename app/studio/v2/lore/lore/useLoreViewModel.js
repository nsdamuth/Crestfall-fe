"use client";

// Normalizes loreContent.mock.js into Lore.view.jsx props and owns
// every piece of presentation-only local state: the three filter
// groups (approval state, world or faction, recency), the community
// section's load-more batch size, and the R4 fixture-action notice.
// Routing is not owned here: the Shell passes onNavigate (real
// Next.js navigation for built destinations) and this hook decides,
// per control, whether to call it or open the honest stub notice
// instead.
//
// V2 convergence: the product route is live. Public Lore comes from the
// existing Community creation catalogue filtered to LORE, owned Lore comes
// from the owner creation summary contract, and the Write Lore CTA enters the
// existing full Lore builder directly. Fixture data remains dev-preview only.
import { useMemo, useState } from "react";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import {
  getFirstAssignedCreationImageUrl,
  isLegacyDefaultCreationImageSrc,
} from "@/lib/shared/creations/creationMedia";
import { projectPublicLoreCreations } from "@/lib/shared/presentation/lorePresentation";

import { LORE_COMMUNITY_ITEMS } from "./loreContent.mock";

const PAGE_SIZE = 4;

// Filter sections, RULED 6 Sep 2026 (FE/FILTERS, Brian): search and
// Recency only. Approval state removed (the public projection emits
// canon or approved only, CR-063); the fixture-only World or faction
// facet retired with it. Recency is single-select over NESTED buckets
// (this week is inside this month is inside all time); All Time means
// no filter. Labels Title Case.
const RECENCY_OPTIONS = [
  { value: "week", label: "New This Week" },
  { value: "month", label: "New This Month" },
  { value: "all", label: "All Time" },
];

const TOP_BANNER = {
  eyebrow: "Lore",
  title: "Write into the world.",
  ctaLabel: "Write lore",
};

// Next-section chain, RULED 6 Sep 2026: Lore closes the loop back to
// Stories. Placeholder art shared by every section page's bottom
// banner (supersedes the per-page assignment from
// docs/reviews/BANNER-AUDIT.md).
const BOTTOM_BANNER = {
  eyebrow: "Loop",
  title: "Back to where every Story starts.",
  ctaLabel: "Open Stories",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
};

function withinRecency(daysAgo, selectedTier) {
  if (!selectedTier || selectedTier === "all") return true;
  if (selectedTier === "week") return daysAgo <= 7;
  if (selectedTier === "month") return daysAgo <= 30;
  return true;
}

function matchesLoreFilters(item, { query, recency }) {
  if (
    query &&
    !`${item.title || ""} ${item.subtitle || ""} ${item.description || ""}`
      .toLowerCase()
      .includes(query)
  ) return false;
  return withinRecency(item.daysAgo, recency);
}

export function useLoreViewModel({
  fixtureMode = "full",
  live = false,
  communityCreations = [],
  communityLoadError = null,
  ownedTimelines = [],
  ownedTimelinesLoadError = null,
  onNavigate = null,
} = {}) {
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [visibleCommunityCount, setVisibleCommunityCount] = useState(PAGE_SIZE);
  const [notice, setNotice] = useState(null);

  function toggleId(setter) {
    return (id) =>
      setter((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }

  const toggleLiked = toggleId(setLikedIds);
  const toggleSaved = toggleId(setSavedIds);

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  function navigateOrStub(route, label) {
    if (route) {
      onNavigate?.(route);
      return;
    }
    openNotice(label, `${label} opens once this section is built. Nothing was opened in this preview.`);
  }

  const liveCommunitySource = useMemo(
    () => projectPublicLoreCreations(communityCreations),
    [communityCreations]
  );
  const communitySource = useMemo(() => {
    if (live) return liveCommunitySource;
    if (fixtureMode === "empty" || fixtureMode === "error" || fixtureMode === "pendingApproval") return [];
    return LORE_COMMUNITY_ITEMS;
  }, [live, liveCommunitySource, fixtureMode]);
  // The Your Lore grid is removed (RULED 6 Sep 2026, FE/FILTERS): the
  // page shows Community Lore and Timelines. Owned lore still opens
  // from the Vault.
  const engagementState = useCreationEngagementState(live ? communitySource : []);

  const timelineItems = useMemo(() => {
    if (!live) return [];

    return (Array.isArray(ownedTimelines) ? ownedTimelines : [])
      .filter((creation) => String(creation?.type || "").toUpperCase() === "TIMELINE")
      .map((creation) => {
        const timeline = creation?.data?.timeline || {};
        const entries = Array.isArray(timeline.entries) ? timeline.entries : [];
        const mediaImageSrc = getFirstAssignedCreationImageUrl(
          creation?.featuredMedia,
          null
        );
        const topLevelImageSrc = String(
          creation?.imageUrl || creation?.imageSrc || ""
        ).trim();
        const assignedImageSrc =
          mediaImageSrc ||
          (topLevelImageSrc && !isLegacyDefaultCreationImageSrc(topLevelImageSrc)
            ? topLevelImageSrc
            : null);

        return {
          id: creation.id,
          title: creation.title || "Untitled Timeline",
          description: creation.description || "A curated Lore chronology.",
          imageSrc: assignedImageSrc,
          identityKey: "TIMELINE",
          entryCount: entries.length,
          publicEnabled: timeline.publicEnabled === true,
          onOpen: () =>
            onNavigate?.(
              `/studio/v2/lore/timelines/${encodeURIComponent(creation.id)}`
            ),
        };
      });
  }, [live, ownedTimelines, onNavigate]);

  const filterGroups = useMemo(
    () => [
      {
        id: "recency",
        label: "Recency",
        isMultiSelect: false,
        options: RECENCY_OPTIONS.map((option) => ({
          ...option,
          count: communitySource.filter((item) => withinRecency(item.daysAgo, option.value)).length,
        })),
      },
    ],
    [communitySource]
  );

  const filteredCommunity = useMemo(() => {
    const criteria = {
      query: searchValue.trim().toLowerCase(),
      recency: selectedValues.recency?.[0] || null,
    };
    return communitySource.filter((item) => matchesLoreFilters(item, criteria));
  }, [communitySource, selectedValues, searchValue]);

  // Lore edit door, RULED 10 Aug 2026 (h-restore ruling 4): the "Your
  // Lore" grid is the only edit door; its cards open the advanced lore
  // page directly, single path, no fork, the same way the Vault popup
  // opens the advanced editor. The advanced page exists at
  // /studio/create/lore (the standalone chapters/sections/blocks
  // builder) but only as a create-mode address, no per-id edit route;
  // navigating there from an existing card opens the builder honestly
  // rather than that item's saved content, the same CR-007/CR-008
  // reopen-in-place gap already carried for Vault. Community Lore
  // cards stay read-only (no advanced-editor path, no community/browse
  // list surface per ruling 4).
  function decorate(item, { isMine }) {
    const badges = [];
    if (item.approvalState === "canon") {
      badges.push({ label: "Canon", variant: "canon" });
    }

    return {
      cardKind: "creation",
      assetKind: "lore",
      creationType: item.type || "LORE",
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      imageSrc: item.imageSrc,
      badges,
      stats: item.stats,
      liked: live
        ? engagementState.isCreationLiked(item)
        : likedIds.includes(item.id),
      bookmarked: live
        ? engagementState.isCreationBookmarked(item)
        : savedIds.includes(item.id),
      onOpenAssetDetail: live
        ? isMine
          ? () => onNavigate?.(`/studio/v2/editor/${encodeURIComponent(item.id)}?origin=lore`)
          : () => onNavigate?.(`/studio/creations/${encodeURIComponent(item.id)}`)
        : isMine
          ? () => onNavigate?.("/studio/create/lore")
          : () => openNotice(item.title, `Reading "${item.title}" opens once the Lore reading surface is built.`),
      onLike: () =>
        live ? engagementState.toggleCreationLike(item) : toggleLiked(item.id),
      onBookmark: () =>
        live ? engagementState.toggleCreationBookmark(item) : toggleSaved(item.id),
    };
  }

  const visibleCommunityItems = filteredCommunity.slice(0, visibleCommunityCount);
  const communityItems = visibleCommunityItems.map((item) => decorate(item, { isMine: false }));

  const communityHasMore = visibleCommunityCount < filteredCommunity.length;
  const communityRemainingCount = communityHasMore ? filteredCommunity.length - visibleCommunityCount : null;

  const communityEmptyMessage = communityLoadError
    ? null
    : filteredCommunity.length === 0 && (live || fixtureMode !== "error")
      ? "No published Lore matches these filters yet."
      : null;

  // Error state (10 Aug 2026 parity audit, section 2): no v2 page had
  // one; this restores the KitAlertStrip danger banner every fixture-
  // driven page now carries under fixtureMode "error".
  const errorMessage = !live && fixtureMode === "error" ? "Lore could not be loaded." : null;

  const filterBar = {
    searchValue,
    searchPlaceholder: "Search Lore",
    onSearchChange: (value) => {
      setSearchValue(value);
      setVisibleCommunityCount(PAGE_SIZE);
    },
    filterGroups,
    selectedValues,
    onFilterToggle: (groupId, value) => {
      setSelectedValues((current) => {
        if (groupId === "recency") {
          // Single-select; "all" means no filter, so it clears.
          const currentTier = current.recency?.[0] || null;
          const nextTier = value === "all" || currentTier === value ? [] : [value];
          return { ...current, recency: nextTier };
        }
        const currentValues = current[groupId] || [];
        const nextValues = currentValues.includes(value)
          ? currentValues.filter((entry) => entry !== value)
          : [...currentValues, value];
        return { ...current, [groupId]: nextValues };
      });
      setVisibleCommunityCount(PAGE_SIZE);
    },
    onClearFilters: () => {
      setSelectedValues({});
      setVisibleCommunityCount(PAGE_SIZE);
    },
  };

  const communityLoadMore = {
    isLoading: false,
    hasMore: communityHasMore,
    remainingCount: communityRemainingCount,
    onLoadMore: () => setVisibleCommunityCount((current) => current + PAGE_SIZE),
  };

  // Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
  // banner-audit sitting): The Seer.png, reassigned off
  // lilith-lux-eden-confrontation.png so Lore does not share a banner
  // with Home and Studio (see docs/reviews/BANNER-AUDIT.md); the
  // oracle character also reads well against "Write into the world."
  const topBanner = {
    ...TOP_BANNER,
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/The Seer.png"),
    onCtaClick: () => onNavigate?.("/studio/create/lore"),
  };

  const bottomBanner = {
    ...BOTTOM_BANNER,
    onCtaClick: () => navigateOrStub("/studio/v2/stories", "Open Stories"),
  };


  return {
    topBanner,
    filterBar,
    timelineItems,
    timelineError: ownedTimelinesLoadError,
    timelineEmptyMessage:
      live && !ownedTimelinesLoadError && timelineItems.length === 0
        ? "No Timelines yet. Build one to organize your Lore chronologically."
        : null,
    onBuildTimeline: () =>
      onNavigate?.("/studio/v2/editor/new?type=TIMELINE&origin=lore"),
    communityItems,
    communityError: communityLoadError,
    communityEmptyMessage,
    communityLoadMore,
    errorMessage,
    bottomBanner,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
