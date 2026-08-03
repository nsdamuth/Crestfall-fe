"use client";

import { useMemo } from "react";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizePublicProfileCreations(creations = []) {
  return Array.isArray(creations)
    ? creations.filter((creation) => creation && typeof creation === "object")
    : [];
}

export function buildPublicProfileCreationCardModels({
  creations = [],
  isCreationLiked = () => false,
  isCreationBookmarked = () => false,
} = {}) {
  return normalizePublicProfileCreations(creations).map((creation, index) => ({
    key: normalizeText(creation.id) || `public-profile-creation-${index}`,
    creation,
    liked: Boolean(isCreationLiked(creation)),
    bookmarked: Boolean(isCreationBookmarked(creation)),
  }));
}

export function getPublicProfileCreationGridViewProps({
  creations = [],
  engagementMessage = "",
  isCreationLiked = () => false,
  isCreationBookmarked = () => false,
  toggleCreationLike = () => {},
  toggleCreationBookmark = () => {},
} = {}) {
  const cardModels = buildPublicProfileCreationCardModels({
    creations,
    isCreationLiked,
    isCreationBookmarked,
  });

  return {
    engagementMessage: normalizeText(engagementMessage),
    hasCreations: cardModels.length > 0,
    cardModels,
    emptyTitle: "No public creations yet",
    emptyDescription:
      "Public approved creations from this creator will appear here.",
    onToggleLike: toggleCreationLike,
    onToggleBookmark: toggleCreationBookmark,
  };
}

export function usePublicProfileCreationGridViewModel({ creations = [] } = {}) {
  const normalizedCreations = useMemo(
    () => normalizePublicProfileCreations(creations),
    [creations]
  );
  const engagement = useCreationEngagementState(normalizedCreations);

  return getPublicProfileCreationGridViewProps({
    creations: normalizedCreations,
    engagementMessage: engagement.engagementMessage,
    isCreationLiked: engagement.isCreationLiked,
    isCreationBookmarked: engagement.isCreationBookmarked,
    toggleCreationLike: engagement.toggleCreationLike,
    toggleCreationBookmark: engagement.toggleCreationBookmark,
  });
}
