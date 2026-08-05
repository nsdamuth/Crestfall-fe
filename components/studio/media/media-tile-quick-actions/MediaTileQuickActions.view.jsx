import { Bookmark, Heart, Maximize2 } from "lucide-react";

function stopAndRun(event, handler) {
  event.preventDefault();
  event.stopPropagation();
  handler?.();
}

function QuickActionButton({
  label = "Action",
  active = false,
  onClick = null,
  children,
}) {
  return (
    <button
      type="button"
      onClick={(event) => stopAndRun(event, onClick)}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-full)] border transition ${
        active
          ? "border-pink-400/50 bg-pink-400/20 text-pink-200"
          : "border-white/10 bg-black/60 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function MediaTileQuickActionsView({
  liked = false,
  bookmarked = false,
  likeLabel = "Like",
  bookmarkLabel = "Bookmark",
  expandLabel = "Expand",
  onLike = null,
  onBookmark = null,
  onExpand = null,
}) {
  return (
    <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
      <QuickActionButton label={likeLabel} active={liked} onClick={onLike}>
        <Heart size={14} fill={liked ? "currentColor" : "none"} />
      </QuickActionButton>

      <QuickActionButton
        label={bookmarkLabel}
        active={bookmarked}
        onClick={onBookmark}
      >
        <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
      </QuickActionButton>

      <QuickActionButton label={expandLabel} onClick={onExpand}>
        <Maximize2 size={14} />
      </QuickActionButton>
    </div>
  );
}
