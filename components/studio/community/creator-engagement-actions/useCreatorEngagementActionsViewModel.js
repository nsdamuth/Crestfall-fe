export function useCreatorEngagementActionsViewModel({
  creator = null,
  liked = false,
  bookmarked = false,
  followed = false,
  onToggleLike,
  onToggleBookmark,
  onToggleFollow,
  compact = false,
} = {}) {
  const canLike = typeof onToggleLike === "function";
  const canBookmark = typeof onToggleBookmark === "function";
  const canFollow = typeof onToggleFollow === "function";

  return {
    liked: Boolean(liked),
    bookmarked: Boolean(bookmarked),
    followed: Boolean(followed),
    canLike,
    canBookmark,
    canFollow,
    compact: Boolean(compact),
    onToggleLike: canLike ? () => onToggleLike(creator) : null,
    onToggleBookmark: canBookmark ? () => onToggleBookmark(creator) : null,
    onToggleFollow: canFollow ? () => onToggleFollow(creator) : null,
  };
}
