import { useMemo } from "react";

import { useCreatorEngagementActionsViewModel } from "@/components/studio/community/creator-engagement-actions/useCreatorEngagementActionsViewModel";
import { useProfileEngagementState } from "@/components/studio/engagement/hooks/useProfileEngagementState";

export function usePublicProfileEngagementActionsViewModel({
  profile = null,
  className = "mt-4",
} = {}) {
  const profiles = useMemo(() => {
    return profile?.id ? [profile] : [];
  }, [profile?.id]);

  const {
    engagementMessage,
    isProfileLiked,
    isProfileBookmarked,
    isProfileFollowed,
    toggleProfileLike,
    toggleProfileBookmark,
    toggleProfileFollow,
  } = useProfileEngagementState(profiles);

  const isVisible = Boolean(profile?.id);

  return {
    isVisible,
    className: typeof className === "string" ? className : "mt-4",
    errorMessage:
      typeof engagementMessage === "string" ? engagementMessage : "",
    engagementActions: useCreatorEngagementActionsViewModel({
      creator: profile,
      liked: isVisible ? isProfileLiked(profile) : false,
      bookmarked: isVisible ? isProfileBookmarked(profile) : false,
      followed: isVisible ? isProfileFollowed(profile) : false,
      onToggleLike: toggleProfileLike,
      onToggleBookmark: toggleProfileBookmark,
      onToggleFollow: toggleProfileFollow,
    }),
  };
}
