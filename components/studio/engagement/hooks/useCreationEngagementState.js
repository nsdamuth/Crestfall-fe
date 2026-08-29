"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchCreationReactions,
  setCreationBookmark,
  setCreationLike,
} from "@/lib/client/studio/engagement/creationReactionClient";

function normalizeCreationIds(creations = []) {
  return [
    ...new Set(
      creations
        .map((creation) => creation?.id)
        .filter((id) => typeof id === "string" && id.trim())
    ),
  ];
}

function toggleSetItem(setter, id) {
  if (!id) return;

  setter((current) => {
    const next = new Set(current);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    return next;
  });
}

export function useCreationEngagementState(creations = []) {
  const [likedCreationIds, setLikedCreationIds] = useState(() => new Set());
  const [bookmarkedCreationIds, setBookmarkedCreationIds] = useState(
    () => new Set()
  );
  const [engagementMessage, setEngagementMessage] = useState("");

  const normalizedCreationIds = normalizeCreationIds(creations);
  const creationIdsKey = normalizedCreationIds.join("|");
  // Keyed on the serialized id list, not the `creations` array reference,
  // so callers that pass a fresh array/object each render (spreads,
  // inline literals) do not re-fire the effect below on every render.
  const creationIds = useMemo(
    () => normalizedCreationIds,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [creationIdsKey]
  );

  useEffect(() => {
    if (!creationIds.length) {
      setLikedCreationIds(new Set());
      setBookmarkedCreationIds(new Set());
      return;
    }

    let cancelled = false;

    fetchCreationReactions(creationIds)
      .then((reactions) => {
        if (cancelled) return;

        setLikedCreationIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "LIKE")
              .map((reaction) => reaction.creationId)
          )
        );

        setBookmarkedCreationIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "BOOKMARK")
              .map((reaction) => reaction.creationId)
          )
        );
      })
      .catch(() => {
        if (cancelled) return;

        // Public/community pages can be viewed signed-out. Keep this quiet
        // until the user actually clicks Like/Bookmark.
        setLikedCreationIds(new Set());
        setBookmarkedCreationIds(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [creationIds]);

  async function toggleCreationLike(creation) {
    const creationId = creation?.id;

    if (!creationId) {
      setEngagementMessage("This creation cannot be liked yet.");
      return;
    }

    const nextActive = !likedCreationIds.has(creationId);

    setEngagementMessage("");
    toggleSetItem(setLikedCreationIds, creationId);

    try {
      await setCreationLike(creationId, nextActive);
    } catch (error) {
      toggleSetItem(setLikedCreationIds, creationId);
      setEngagementMessage(error?.message || "Like could not be saved.");
    }
  }

  async function toggleCreationBookmark(creation) {
    const creationId = creation?.id;

    if (!creationId) {
      setEngagementMessage("This creation cannot be bookmarked yet.");
      return;
    }

    const nextActive = !bookmarkedCreationIds.has(creationId);

    setEngagementMessage("");
    toggleSetItem(setBookmarkedCreationIds, creationId);

    try {
      await setCreationBookmark(creationId, nextActive);
    } catch (error) {
      toggleSetItem(setBookmarkedCreationIds, creationId);
      setEngagementMessage(error?.message || "Bookmark could not be saved.");
    }
  }

  function isCreationLiked(creation) {
    return likedCreationIds.has(creation?.id);
  }

  function isCreationBookmarked(creation) {
    return bookmarkedCreationIds.has(creation?.id);
  }

  function withCreationEngagement(creation) {
    return {
      ...creation,
      liked: Boolean(creation?.liked) || isCreationLiked(creation),
      bookmarked:
        Boolean(creation?.bookmarked) || isCreationBookmarked(creation),
    };
  }

  return {
    likedCreationIds,
    bookmarkedCreationIds,
    engagementMessage,
    setEngagementMessage,
    isCreationLiked,
    isCreationBookmarked,
    toggleCreationLike,
    toggleCreationBookmark,
    withCreationEngagement,
  };
}