"use client";

import { Bookmark, Heart, UserCheck, UserPlus } from "lucide-react";

function stopAndRun(event, handler) {
  event.preventDefault();
  event.stopPropagation();
  handler?.();
}

export default function CreatorEngagementActionsView({
  liked = false,
  bookmarked = false,
  followed = false,
  canLike = false,
  canBookmark = false,
  canFollow = false,
  compact = false,
  onToggleLike = null,
  onToggleBookmark = null,
  onToggleFollow = null,
}) {
  if (!canLike && !canBookmark && !canFollow) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-5"}`}>
      {canLike ? (
        <CreatorEngagementButton
          active={liked}
          compact={compact}
          label={liked ? "Liked" : "Like"}
          title={liked ? "Unlike creator" : "Like creator"}
          onClick={(event) => stopAndRun(event, onToggleLike)}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </CreatorEngagementButton>
      ) : null}

      {canBookmark ? (
        <CreatorEngagementButton
          active={bookmarked}
          compact={compact}
          label={bookmarked ? "Saved" : "Save"}
          title={bookmarked ? "Remove creator bookmark" : "Bookmark creator"}
          onClick={(event) => stopAndRun(event, onToggleBookmark)}
        >
          <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
        </CreatorEngagementButton>
      ) : null}

      {canFollow ? (
        <CreatorEngagementButton
          active={followed}
          compact={compact}
          label={followed ? "Following" : "Follow"}
          title={followed ? "Unfollow creator" : "Follow creator"}
          onClick={(event) => stopAndRun(event, onToggleFollow)}
        >
          {followed ? <UserCheck size={14} /> : <UserPlus size={14} />}
        </CreatorEngagementButton>
      ) : null}
    </div>
  );
}

function CreatorEngagementButton({
  active = false,
  compact = false,
  label,
  title,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border text-xs uppercase tracking-[0.14em] transition ${
        compact ? "px-3 py-2" : "px-4 py-3"
      } ${
        active
          ? "border-pink-400/45 bg-pink-400/15 text-pink-200"
          : "border-white/10 bg-black/35 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
      }`}
    >
      {children}
      <span className={compact ? "hidden xl:inline" : ""}>{label}</span>
    </button>
  );
}
