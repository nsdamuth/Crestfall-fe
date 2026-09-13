import { Loader2 } from "lucide-react";

export default function KitLoadMoreView({
  isLoading = false,
  hasMore = true,
  remainingCount = null,
  onLoadMore = null,
}) {
  // --space-6 above the control in every state (fe/chat-studio brief 3
  // item 12): the one place the gap between a list and its Show more
  // is written, so every list view that mounts it gets the same air.
  if (!hasMore && !isLoading) {
    return (
      <p className="mt-[var(--space-6)] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        You have seen everything here.
      </p>
    );
  }

  const hasKnownCount =
    remainingCount !== null && remainingCount !== undefined && !isLoading;

  return (
    <div className="mt-[var(--space-6)] flex flex-col items-center gap-[var(--space-2)]">
      <button
        type="button"
        disabled={isLoading}
        aria-busy={isLoading}
        onClick={() => onLoadMore?.()}
        className="cf-btn cf-btn--secondary active:bg-[var(--state-pressed-fill)]"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Loading
          </>
        ) : (
          "Show more"
        )}
      </button>

      {hasKnownCount && (
        <p className="tabular-nums text-[length:var(--text-label)] text-[var(--ink-faint)]">
          {remainingCount} more
        </p>
      )}
    </div>
  );
}
