"use client";

import { useEffect, useMemo, useState } from "react";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import { useProfileEngagementState } from "@/components/studio/engagement/hooks/useProfileEngagementState";

export const INITIAL_VISIBLE_COMMUNITY_CREATIONS = 12;
export const VISIBLE_COMMUNITY_CREATION_INCREMENT = 12;
export const INITIAL_VISIBLE_CREATORS = 12;
export const VISIBLE_CREATOR_INCREMENT = 12;
export const EAGER_CREATION_IMAGE_COUNT = 4;

export const communityCreationTypes = Object.freeze([
  { id: "ALL", label: "All" },
  { id: "CHARACTER", label: "Characters" },
  { id: "SCENARIO", label: "Scenarios" },
  { id: "ROOM_TEMPLATE", label: "Rooms" },
  { id: "LOCATION", label: "Locations" },
  { id: "OUTFIT", label: "Outfits" },
  { id: "POSE", label: "Poses" },
  { id: "NARRATOR", label: "Narrators" },
  { id: "IMAGE_PRESET", label: "Image Presets" },
]);

export const communityCreationFilters = Object.freeze([
  { id: "ALL", label: "All" },
  { id: "FEATURED", label: "Featured" },
  { id: "CANON", label: "Canon" },
  { id: "UPDATED", label: "Recently Updated" },
]);

export const communityCreatorFilters = Object.freeze([
  { id: "ALL", label: "All" },
  { id: "FEATURED", label: "Featured" },
  { id: "ACTIVE", label: "Recently Active" },
  { id: "CANON_CONTRIBUTORS", label: "Canon Contributors" },
]);

export const communitySortOptions = Object.freeze([
  { value: "RECOMMENDED", label: "Recommended" },
  { value: "NEWEST", label: "Newest" },
  { value: "UPDATED", label: "Recently Updated" },
  { value: "LIKED", label: "Most Liked" },
  { value: "USED", label: "Most Used" },
]);

export const communityRatingOptions = Object.freeze([
  { value: "ALL", label: "All Ratings" },
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

export const communityRenderingOptions = Object.freeze([
  { value: "ALL", label: "All Styles" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
  { value: "EITHER", label: "Either / Auto" },
]);

export const topCommunityTags = Object.freeze([
  "Dark Fantasy",
  "Canon",
  "Romance",
  "Villain",
  "Aethelred",
  "Crestfall",
  "Primordial",
  "Modern",
  "Mystery",
  "Sandbox",
]);

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeTags(value) {
  return Array.isArray(value)
    ? value.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];
}

export function normalizeCommunityCreation(creation = {}, index = 0) {
  return {
    ...creation,
    id: normalizeText(creation.id, `community-creation-${index}`),
    title: creation.title,
    description: creation.description,
    creatorHandle: creation.creatorHandle,
    type: creation.type,
    contentRating: creation.contentRating,
    renderingStyle: creation.renderingStyle,
    canonStatus: creation.canonStatus,
    tags: normalizeTags(creation.tags),
    stats: normalizeObject(creation.stats),
    featured: Boolean(creation.featured),
    recentlyUpdated: Boolean(creation.recentlyUpdated),
  };
}

export function normalizeCommunityCreator(creator = {}, index = 0) {
  return {
    ...creator,
    id: normalizeText(creator.id, `community-creator-${index}`),
    displayName: creator.displayName,
    handle: creator.handle,
    tagline: creator.tagline,
    description: creator.description,
    featured: Boolean(creator.featured),
    recentlyActive: Boolean(creator.recentlyActive),
    canonContributor: Boolean(creator.canonContributor),
  };
}

export function getCommunityCreationSortValue(creation, sort) {
  if (sort === "NEWEST") {
    return new Date(creation.createdAt || 0).getTime();
  }

  if (sort === "UPDATED") {
    return new Date(creation.updatedAt || 0).getTime();
  }

  if (sort === "LIKED") {
    return Number(creation.stats?.likes || 0);
  }

  if (sort === "USED") {
    return Number(creation.stats?.messages || 0);
  }

  return Number(creation.featured) * 1000000 + Number(creation.stats?.likes || 0);
}

export function matchesCommunityCanonFilter(creation) {
  return ["OFFICIAL", "ACCEPTED"].includes(creation.canonStatus);
}

export function filterCommunityCreations({
  creations = [],
  query = "",
  activeTag = "ALL",
  activeType = "ALL",
  activeCreationFilter = "ALL",
  rating = "ALL",
  rendering = "ALL",
  sort = "RECOMMENDED",
} = {}) {
  const normalizedQuery = normalizeText(query).toLowerCase();
  const normalizedActiveTag = normalizeText(activeTag, "ALL").toLowerCase();

  return creations
    .filter((creation) => {
      const matchesType = activeType === "ALL" || creation.type === activeType;
      const matchesFilter =
        activeCreationFilter === "ALL" ||
        (activeCreationFilter === "FEATURED" && creation.featured) ||
        (activeCreationFilter === "CANON" &&
          matchesCommunityCanonFilter(creation)) ||
        (activeCreationFilter === "UPDATED" && creation.recentlyUpdated);
      const matchesRating =
        rating === "ALL" || creation.contentRating === rating;
      const matchesRendering =
        rendering === "ALL" || creation.renderingStyle === rendering;
      const matchesTag =
        normalizedActiveTag === "all" ||
        creation.tags.some(
          (tag) => normalizeText(tag).toLowerCase() === normalizedActiveTag
        );
      const searchableText = [
        creation.title,
        creation.description,
        creation.creatorHandle,
        ...creation.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return (
        matchesType &&
        matchesFilter &&
        matchesRating &&
        matchesRendering &&
        matchesTag &&
        matchesQuery
      );
    })
    .sort(
      (left, right) =>
        getCommunityCreationSortValue(right, sort) -
        getCommunityCreationSortValue(left, sort)
    );
}

export function filterCommunityCreators({
  creators = [],
  query = "",
  activeCreatorFilter = "ALL",
} = {}) {
  const normalizedQuery = normalizeText(query).toLowerCase();

  return creators.filter((creator) => {
    const matchesFilter =
      activeCreatorFilter === "ALL" ||
      (activeCreatorFilter === "FEATURED" && creator.featured) ||
      (activeCreatorFilter === "ACTIVE" && creator.recentlyActive) ||
      (activeCreatorFilter === "CANON_CONTRIBUTORS" &&
        creator.canonContributor);
    const searchableText = [
      creator.displayName,
      creator.handle,
      creator.tagline,
      creator.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery =
      !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });
}

export function getCommunityHubViewProps({
  creations = [],
  creators = [],
  mode = "CREATIONS",
  query = "",
  activeTag = "ALL",
  activeType = "ALL",
  activeCreationFilter = "ALL",
  activeCreatorFilter = "ALL",
  creatorView = "GRID",
  mobileCreationGridMode = "GRID",
  mobileCreatorGridMode = "LARGE",
  sort = "RECOMMENDED",
  rating = "ALL",
  rendering = "ALL",
  visibleCreationCount = INITIAL_VISIBLE_COMMUNITY_CREATIONS,
  visibleCreatorCount = INITIAL_VISIBLE_CREATORS,
  creationEngagementMessage = "",
  profileEngagementMessage = "",
  isCreationLiked = () => false,
  isCreationBookmarked = () => false,
  toggleCreationLike = null,
  toggleCreationBookmark = null,
  isProfileLiked = () => false,
  isProfileBookmarked = () => false,
  isProfileFollowed = () => false,
  toggleProfileLike = null,
  toggleProfileBookmark = null,
  toggleProfileFollow = null,
} = {}) {
  const normalizedCreations = creations.map(normalizeCommunityCreation);
  const normalizedCreators = creators.map(normalizeCommunityCreator);
  const filteredCreations = filterCommunityCreations({
    creations: normalizedCreations,
    query,
    activeTag,
    activeType,
    activeCreationFilter,
    rating,
    rendering,
    sort,
  });
  const filteredCreators = filterCommunityCreators({
    creators: normalizedCreators,
    query,
    activeCreatorFilter,
  });
  const safeVisibleCreationCount = Number.isFinite(Number(visibleCreationCount))
    ? Math.max(0, Math.trunc(Number(visibleCreationCount)))
    : INITIAL_VISIBLE_COMMUNITY_CREATIONS;
  const safeVisibleCreatorCount = Number.isFinite(Number(visibleCreatorCount))
    ? Math.max(0, Math.trunc(Number(visibleCreatorCount)))
    : INITIAL_VISIBLE_CREATORS;
  const visibleCommunityCreations = filteredCreations.slice(
    0,
    safeVisibleCreationCount
  );
  const visibleCommunityCreators = filteredCreators.slice(
    0,
    safeVisibleCreatorCount
  );
  const remainingCommunityCreationCount = Math.max(
    filteredCreations.length - visibleCommunityCreations.length,
    0
  );
  const remainingCommunityCreatorCount = Math.max(
    filteredCreators.length - visibleCommunityCreators.length,
    0
  );
  const isMobileCompactCreationGrid = mobileCreationGridMode === "GRID";
  const isMobileCompactCreatorGrid = mobileCreatorGridMode === "GRID";

  return {
    eyebrow: "Community Browser",
    filterBody:
      "Browse public creations and creator profiles. Featured is a curation layer, not a separate content type.",
    mode,
    query,
    queryPlaceholder:
      mode === "CREATIONS"
        ? "Search creations, creators, tags..."
        : "Search creators...",
    activeTag,
    activeType,
    activeCreationFilter,
    activeCreatorFilter,
    creatorView,
    creationTypes: communityCreationTypes,
    creationFilters: communityCreationFilters,
    creatorFilters: communityCreatorFilters,
    sortOptions: communitySortOptions,
    ratingOptions: communityRatingOptions,
    renderingOptions: communityRenderingOptions,
    topCommunityTags,
    sort,
    rating,
    rendering,
    visibleCommunityCreations,
    visibleCommunityCreators,
    filteredCreationCount: filteredCreations.length,
    filteredCreatorCount: filteredCreators.length,
    remainingCommunityCreationCount,
    remainingCommunityCreatorCount,
    nextCreationLoadCount: Math.min(
      remainingCommunityCreationCount,
      VISIBLE_COMMUNITY_CREATION_INCREMENT
    ),
    nextCreatorLoadCount: Math.min(
      remainingCommunityCreatorCount,
      VISIBLE_CREATOR_INCREMENT
    ),
    isMobileCompactCreationGrid,
    isMobileCompactCreatorGrid,
    mobileCreationGridToggleLabel: isMobileCompactCreationGrid
      ? "Large"
      : "Grid",
    creationGridClass: isMobileCompactCreationGrid
      ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
    creatorGridClass: isMobileCompactCreatorGrid
      ? "grid-cols-2 lg:grid-cols-2"
      : "grid-cols-1 lg:grid-cols-2",
    engagementMessage: normalizeText(
      creationEngagementMessage || profileEngagementMessage
    ),
    eagerCreationImageCount: EAGER_CREATION_IMAGE_COUNT,
    isCreationLiked,
    isCreationBookmarked,
    toggleCreationLike,
    toggleCreationBookmark,
    isProfileLiked,
    isProfileBookmarked,
    isProfileFollowed,
    toggleProfileLike,
    toggleProfileBookmark,
    toggleProfileFollow,
  };
}

export function useCommunityHubViewModel({
  creations = [],
  creators = [],
} = {}) {
  const [activeTag, setActiveTag] = useState("ALL");
  const [mode, setMode] = useState("CREATIONS");
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("ALL");
  const [activeCreationFilter, setActiveCreationFilter] = useState("ALL");
  const [activeCreatorFilter, setActiveCreatorFilter] = useState("ALL");
  const [creatorView, setCreatorView] = useState("GRID");
  const [mobileCreationGridMode, setMobileCreationGridMode] = useState("GRID");
  const [mobileCreatorGridMode] = useState("LARGE");
  const [sort, setSort] = useState("RECOMMENDED");
  const [rating, setRating] = useState("ALL");
  const [rendering, setRendering] = useState("ALL");
  const [visibleCreationCount, setVisibleCreationCount] = useState(
    INITIAL_VISIBLE_COMMUNITY_CREATIONS
  );
  const [visibleCreatorCount, setVisibleCreatorCount] = useState(
    INITIAL_VISIBLE_CREATORS
  );

  const normalizedCreations = useMemo(
    () => creations.map(normalizeCommunityCreation),
    [creations]
  );
  const normalizedCreators = useMemo(
    () => creators.map(normalizeCommunityCreator),
    [creators]
  );
  const creationEngagement = useCreationEngagementState(normalizedCreations);
  const profileEngagement = useProfileEngagementState(normalizedCreators);

  useEffect(() => {
    setVisibleCreationCount(INITIAL_VISIBLE_COMMUNITY_CREATIONS);
  }, [activeType, activeCreationFilter, activeTag, query, rating, rendering, sort]);

  useEffect(() => {
    setVisibleCreatorCount(INITIAL_VISIBLE_CREATORS);
  }, [activeCreatorFilter, query, creatorView]);

  const viewProps = useMemo(
    () =>
      getCommunityHubViewProps({
        creations,
        creators,
        mode,
        query,
        activeTag,
        activeType,
        activeCreationFilter,
        activeCreatorFilter,
        creatorView,
        mobileCreationGridMode,
        mobileCreatorGridMode,
        sort,
        rating,
        rendering,
        visibleCreationCount,
        visibleCreatorCount,
        creationEngagementMessage: creationEngagement.engagementMessage,
        profileEngagementMessage: profileEngagement.engagementMessage,
        isCreationLiked: creationEngagement.isCreationLiked,
        isCreationBookmarked: creationEngagement.isCreationBookmarked,
        toggleCreationLike: creationEngagement.toggleCreationLike,
        toggleCreationBookmark: creationEngagement.toggleCreationBookmark,
        isProfileLiked: profileEngagement.isProfileLiked,
        isProfileBookmarked: profileEngagement.isProfileBookmarked,
        isProfileFollowed: profileEngagement.isProfileFollowed,
        toggleProfileLike: profileEngagement.toggleProfileLike,
        toggleProfileBookmark: profileEngagement.toggleProfileBookmark,
        toggleProfileFollow: profileEngagement.toggleProfileFollow,
      }),
    [
      creations,
      creators,
      mode,
      query,
      activeTag,
      activeType,
      activeCreationFilter,
      activeCreatorFilter,
      creatorView,
      mobileCreationGridMode,
      mobileCreatorGridMode,
      sort,
      rating,
      rendering,
      visibleCreationCount,
      visibleCreatorCount,
      creationEngagement.engagementMessage,
      creationEngagement.isCreationLiked,
      creationEngagement.isCreationBookmarked,
      creationEngagement.toggleCreationLike,
      creationEngagement.toggleCreationBookmark,
      profileEngagement.engagementMessage,
      profileEngagement.isProfileLiked,
      profileEngagement.isProfileBookmarked,
      profileEngagement.isProfileFollowed,
      profileEngagement.toggleProfileLike,
      profileEngagement.toggleProfileBookmark,
      profileEngagement.toggleProfileFollow,
    ]
  );

  return {
    ...viewProps,
    onModeChange: setMode,
    onQueryChange: setQuery,
    onActiveTagChange: setActiveTag,
    onActiveTypeChange: setActiveType,
    onActiveCreationFilterChange: setActiveCreationFilter,
    onActiveCreatorFilterChange: setActiveCreatorFilter,
    onCreatorViewChange: setCreatorView,
    onSortChange: setSort,
    onRatingChange: setRating,
    onRenderingChange: setRendering,
    onToggleMobileCreationGridMode: () =>
      setMobileCreationGridMode((current) =>
        current === "GRID" ? "LARGE" : "GRID"
      ),
    onLoadMoreCreations: () =>
      setVisibleCreationCount(
        (current) => current + VISIBLE_COMMUNITY_CREATION_INCREMENT
      ),
    onLoadMoreCreators: () =>
      setVisibleCreatorCount((current) => current + VISIBLE_CREATOR_INCREMENT),
  };
}
