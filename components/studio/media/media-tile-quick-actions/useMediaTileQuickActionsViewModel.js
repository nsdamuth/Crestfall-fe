"use client";

export function getMediaTileQuickActionsViewProps({
  liked = false,
  bookmarked = false,
  onToggleLike = null,
  onToggleBookmark = null,
  onExpand = null,
} = {}) {
  const isLiked = Boolean(liked);
  const isBookmarked = Boolean(bookmarked);

  return {
    liked: isLiked,
    bookmarked: isBookmarked,
    likeLabel: isLiked ? "Unlike" : "Like",
    bookmarkLabel: isBookmarked ? "Remove bookmark" : "Bookmark",
    expandLabel: "Expand",
    onLike: onToggleLike,
    onBookmark: onToggleBookmark,
    onExpand,
  };
}

export function useMediaTileQuickActionsViewModel(props = {}) {
  return getMediaTileQuickActionsViewProps(props);
}
