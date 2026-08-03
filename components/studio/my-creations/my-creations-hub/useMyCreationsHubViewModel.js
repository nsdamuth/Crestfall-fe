"use client";

import { useEffect, useMemo, useState } from "react";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import {
  tabs,
  typeMeta,
} from "@/components/studio/my-creations/edit/creationEditConstants";
import {
  buildFeaturedMedia,
  getFirstCreationImageUrl,
} from "@/lib/shared/creations/creationMedia";

export const INITIAL_VISIBLE_CREATIONS = 12;
export const VISIBLE_CREATION_INCREMENT = 12;
export const EAGER_CREATION_IMAGE_COUNT = 4;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

export function formatCreationUpdatedAt(value) {
  if (!value) return "Recently updated";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCreationTags(creation = {}, data = {}) {
  const possibleTags = [data.tags, creation.tags].find((item) =>
    Array.isArray(item)
  );

  if (!possibleTags) return [];

  return possibleTags
    .map((tag) => normalizeText(tag))
    .filter(Boolean);
}

export function normalizeOwnedCreation(creation = {}, index = 0) {
  const data = normalizeObject(creation.data);
  const type = normalizeText(creation.type || data.type, "CHARACTER");
  const typeLabel =
    typeMeta[type]?.label || String(type).replaceAll("_", " ");
  const title = normalizeText(
    creation.title || data.title || data.name,
    "Untitled Creation"
  );
  const tags = getCreationTags(creation, data);
  const featuredMedia = buildFeaturedMedia({
    row: creation,
    data,
    title: normalizeText(title, "Creation preview"),
    max: 4,
    padTo: 0,
    usePlaceholder: true,
    idPrefix: "media",
  });

  return {
    ...creation,
    id: normalizeText(creation.id, `creation-${index}`),
    title,
    subtitle: normalizeText(
      data.subtitle || data.role || data.scope || data.archetype || data.tagline
    ),
    type,
    typeLabel,
    visibility: normalizeText(
      creation.visibility || data.visibility,
      "PRIVATE"
    ),
    status: normalizeText(creation.status || data.status, "DRAFT"),
    canonStatus: normalizeText(
      creation.canonStatus ||
        creation.canon_status ||
        data.canonStatus ||
        data.canon_status,
      "NONE"
    ),
    contentRating: normalizeText(
      creation.contentRating ||
        creation.content_rating ||
        data.contentRating ||
        data.content_rating,
      "SFW"
    ),
    updatedAt: formatCreationUpdatedAt(
      creation.updatedAt || creation.updated_at || data.updatedAt
    ),
    description: normalizeText(
      creation.description || data.description || data.summary,
      "No description has been added yet."
    ),
    imageUrl: getFirstCreationImageUrl(featuredMedia),
    featuredMedia,
    stats: normalizeObject(creation.stats || data.stats),
    tags,
  };
}

export function getTopCreationTags(creations = [], limit = 10) {
  const counts = new Map();

  creations.forEach((creation) => {
    const tags = Array.isArray(creation?.tags) ? creation.tags : [];

    tags.forEach((tag) => {
      const cleanTag = normalizeText(tag);

      if (!cleanTag) return;

      const key = cleanTag.toLowerCase();
      const existing = counts.get(key);

      counts.set(key, {
        label: existing?.label || cleanTag,
        count: (existing?.count || 0) + 1,
      });
    });
  });

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map((tag) => tag.label);
}

export function filterOwnedCreations({
  creations = [],
  activeTab = "ALL",
  activeTag = "ALL",
  query = "",
} = {}) {
  const normalizedQuery = normalizeText(query).toLowerCase();
  const normalizedActiveTag = normalizeText(activeTag, "ALL").toLowerCase();

  return creations.filter((creation) => {
    const creationTags = Array.isArray(creation?.tags) ? creation.tags : [];
    const matchesTab =
      activeTab === "ALL" ||
      creation.type === activeTab ||
      creation.status === activeTab;
    const matchesTag =
      normalizedActiveTag === "all" ||
      creationTags.some(
        (tag) => normalizeText(tag).toLowerCase() === normalizedActiveTag
      );
    const searchableText = [
      creation.title,
      creation.description,
      creation.creatorHandle,
      creation.visibility,
      creation.status,
      creation.canonStatus,
      creation.typeLabel,
      ...creationTags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery =
      !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesTab && matchesTag && matchesQuery;
  });
}

export function getMyCreationsHubViewProps({
  creations = [],
  activeTab = "ALL",
  activeTag = "ALL",
  query = "",
  mobileGridMode = "GRID",
  visibleCount = INITIAL_VISIBLE_CREATIONS,
  engagementMessage = "",
  isCreationLiked = () => false,
  isCreationBookmarked = () => false,
  toggleCreationLike = null,
  toggleCreationBookmark = null,
} = {}) {
  const normalizedCreations = creations.map(normalizeOwnedCreation);
  const ownedCreationTags = getTopCreationTags(normalizedCreations);
  const filteredCreations = filterOwnedCreations({
    creations: normalizedCreations,
    activeTab,
    activeTag,
    query,
  });
  const safeVisibleCount = Number.isFinite(Number(visibleCount))
    ? Math.max(0, Math.trunc(Number(visibleCount)))
    : INITIAL_VISIBLE_CREATIONS;
  const visibleCreations = filteredCreations.slice(0, safeVisibleCount);
  const remainingCreationCount = Math.max(
    filteredCreations.length - visibleCreations.length,
    0
  );
  const isMobileCompactGrid = mobileGridMode === "GRID";

  return {
    eyebrow: "Creation Library",
    filterBody:
      "Creations start private by default. Publish, share, submit for review, or submit to canon later from the individual creation.",
    queryPlaceholder: "Search your creations...",
    createHref: "/studio/create",
    createLabel: "Create New",
    emptyActionLabel: "Start Creating",
    tagFilterLabel: "Your Tags",
    allTagValue: "ALL",
    tabs,
    activeTab,
    activeTag,
    query,
    ownedCreationTags,
    visibleCreations,
    filteredCreationCount: filteredCreations.length,
    remainingCreationCount,
    nextLoadCount: Math.min(
      remainingCreationCount,
      VISIBLE_CREATION_INCREMENT
    ),
    isMobileCompactGrid,
    mobileGridToggleLabel: isMobileCompactGrid ? "Large" : "Grid",
    creationGridClass: isMobileCompactGrid
      ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
    engagementMessage: normalizeText(engagementMessage),
    eagerCreationImageCount: EAGER_CREATION_IMAGE_COUNT,
    visibleCreationIncrement: VISIBLE_CREATION_INCREMENT,
    isCreationLiked,
    isCreationBookmarked,
    toggleCreationLike,
    toggleCreationBookmark,
  };
}

export function useMyCreationsHubViewModel({ creations = [] } = {}) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeTag, setActiveTag] = useState("ALL");
  const [query, setQuery] = useState("");
  const [mobileGridMode, setMobileGridMode] = useState("GRID");
  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_CREATIONS
  );

  const normalizedCreations = useMemo(
    () => creations.map(normalizeOwnedCreation),
    [creations]
  );
  const engagementState = useCreationEngagementState(normalizedCreations);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CREATIONS);
  }, [activeTab, activeTag, query]);

  const viewProps = useMemo(
    () =>
      getMyCreationsHubViewProps({
        creations,
        activeTab,
        activeTag,
        query,
        mobileGridMode,
        visibleCount,
        engagementMessage: engagementState.engagementMessage,
        isCreationLiked: engagementState.isCreationLiked,
        isCreationBookmarked: engagementState.isCreationBookmarked,
        toggleCreationLike: engagementState.toggleCreationLike,
        toggleCreationBookmark: engagementState.toggleCreationBookmark,
      }),
    [
      creations,
      activeTab,
      activeTag,
      query,
      mobileGridMode,
      visibleCount,
      engagementState.engagementMessage,
      engagementState.isCreationLiked,
      engagementState.isCreationBookmarked,
      engagementState.toggleCreationLike,
      engagementState.toggleCreationBookmark,
    ]
  );

  return {
    ...viewProps,
    onActiveTabChange: setActiveTab,
    onActiveTagChange: setActiveTag,
    onQueryChange: setQuery,
    onToggleMobileGridMode: () =>
      setMobileGridMode((current) =>
        current === "GRID" ? "LARGE" : "GRID"
      ),
    onLoadMore: () =>
      setVisibleCount(
        (current) => current + VISIBLE_CREATION_INCREMENT
      ),
  };
}
