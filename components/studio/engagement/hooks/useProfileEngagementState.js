"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  fetchProfileReactions,
  setProfileBookmark,
  setProfileFollow,
  setProfileLike,
} from "@/lib/client/studio/engagement/profileReactionClient";

function getProfileReactionId(profile) {
  return (
    profile?.profileId ||
    profile?.profile_id ||
    profile?.id ||
    ""
  );
}

function normalizeProfileIds(profiles = []) {
  return [
    ...new Set(
      profiles
        .map(getProfileReactionId)
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

export function useProfileEngagementState(profiles = []) {
  const router = useRouter();
  const [likedProfileIds, setLikedProfileIds] = useState(() => new Set());
  const [bookmarkedProfileIds, setBookmarkedProfileIds] = useState(
    () => new Set()
  );
  const [followedProfileIds, setFollowedProfileIds] = useState(() => new Set());
  const [engagementMessage, setEngagementMessage] = useState("");

  const profileIds = useMemo(() => normalizeProfileIds(profiles), [profiles]);

  useEffect(() => {
    if (!profileIds.length) {
      setLikedProfileIds(new Set());
      setBookmarkedProfileIds(new Set());
      setFollowedProfileIds(new Set());
      return;
    }

    let cancelled = false;

    fetchProfileReactions(profileIds)
      .then((reactions) => {
        if (cancelled) return;

        setLikedProfileIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "LIKE")
              .map((reaction) => reaction.profileId)
          )
        );

        setBookmarkedProfileIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "BOOKMARK")
              .map((reaction) => reaction.profileId)
          )
        );

        setFollowedProfileIds(
          new Set(
            reactions
              .filter((reaction) => reaction.reactionType === "FOLLOW")
              .map((reaction) => reaction.profileId)
          )
        );
      })
      .catch(() => {
        if (cancelled) return;

        // Community/profile browsing can be signed-out. Stay quiet until click.
        setLikedProfileIds(new Set());
        setBookmarkedProfileIds(new Set());
        setFollowedProfileIds(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [profileIds]);

  async function toggleProfileLike(profile) {
    const profileId = getProfileReactionId(profile);

    if (!profileId) {
      setEngagementMessage("This creator cannot be liked yet.");
      return;
    }

    const nextActive = !likedProfileIds.has(profileId);

    setEngagementMessage("");
    toggleSetItem(setLikedProfileIds, profileId);

    try {
      const result = await setProfileLike(
        profileId,
        nextActive
      );

      /*
       * Counts are server-owned read-model data.
       * Refresh the surrounding Server Component
       * after the mutation so creator cards and
       * public-profile stats receive the new
       * authoritative values.
       */
      router.refresh();
      return result;
    } catch (error) {
      toggleSetItem(setLikedProfileIds, profileId);
      setEngagementMessage(error?.message || "Creator like could not be saved.");
    }
  }

  async function toggleProfileBookmark(profile) {
    const profileId = getProfileReactionId(profile);

    if (!profileId) {
      setEngagementMessage("This creator cannot be bookmarked yet.");
      return;
    }

    const nextActive = !bookmarkedProfileIds.has(profileId);

    setEngagementMessage("");
    toggleSetItem(setBookmarkedProfileIds, profileId);

    try {
      return await setProfileBookmark(
        profileId,
        nextActive
      );
    } catch (error) {
      toggleSetItem(setBookmarkedProfileIds, profileId);
      setEngagementMessage(
        error?.message || "Creator bookmark could not be saved."
      );
    }
  }

  async function toggleProfileFollow(profile) {
    const profileId = getProfileReactionId(profile);

    if (!profileId) {
      setEngagementMessage("This creator cannot be followed yet.");
      return;
    }

    const nextActive = !followedProfileIds.has(profileId);

    setEngagementMessage("");
    toggleSetItem(setFollowedProfileIds, profileId);

    try {
      const result = await setProfileFollow(
        profileId,
        nextActive
      );

      router.refresh();
      return result;
    } catch (error) {
      toggleSetItem(setFollowedProfileIds, profileId);
      setEngagementMessage(
        error?.message || "Creator follow could not be saved."
      );
    }
  }

  function isProfileLiked(profile) {
    return likedProfileIds.has(getProfileReactionId(profile));
  }

  function isProfileBookmarked(profile) {
    return bookmarkedProfileIds.has(getProfileReactionId(profile));
  }

  function isProfileFollowed(profile) {
    return followedProfileIds.has(getProfileReactionId(profile));
  }

  return {
    likedProfileIds,
    bookmarkedProfileIds,
    followedProfileIds,
    engagementMessage,
    setEngagementMessage,
    isProfileLiked,
    isProfileBookmarked,
    isProfileFollowed,
    toggleProfileLike,
    toggleProfileBookmark,
    toggleProfileFollow,
  };
}