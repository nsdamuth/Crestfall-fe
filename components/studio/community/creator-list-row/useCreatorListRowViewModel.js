import {
  getCreatorHandle,
  getCreatorName,
  getCreatorProfileHref,
} from "@/components/studio/community/CreatorDisplay";
import { useCreatorEngagementActionsViewModel } from "@/components/studio/community/creator-engagement-actions/useCreatorEngagementActionsViewModel";

function displayCount(value) {
  return value || 0;
}

export function useCreatorListRowViewModel({
  creator = null,
  liked = false,
  bookmarked = false,
  followed = false,
  onToggleLike,
  onToggleBookmark,
  onToggleFollow,
} = {}) {
  const creatorName = getCreatorName(creator);
  const creatorHandle = getCreatorHandle(creator);

  return {
    creatorName,
    creatorHandle,
    profileHref: getCreatorProfileHref(creator),
    avatarInitial: creatorName.slice(0, 1).toUpperCase(),
    summary:
      creator?.tagline || creator?.description || "Crestfall creator.",
    featured: Boolean(creator?.featured),
    canonContributor: Boolean(creator?.canonContributor),
    stats: [
      {
        id: "followers",
        value: displayCount(creator?.stats?.followers),
        label: "followers",
      },
      {
        id: "creations",
        value: displayCount(creator?.stats?.characters),
        label: "creations",
      },
      {
        id: "canon",
        value: displayCount(creator?.stats?.canon),
        label: "canon",
      },
      {
        id: "likes",
        value: displayCount(creator?.stats?.likes),
        label: "likes",
      },
    ],
    engagementActions: useCreatorEngagementActionsViewModel({
      creator,
      liked,
      bookmarked,
      followed,
      onToggleLike,
      onToggleBookmark,
      onToggleFollow,
      compact: true,
    }),
  };
}
