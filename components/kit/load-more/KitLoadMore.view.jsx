import { Loader2 } from "lucide-react";

export default function KitLoadMoreView({
  isLoading = false,
  hasMore = true,
  remainingCount = null,
  onLoadMore = null,
}) {
  if (!hasMore && !isLoading) {
    return (
      <p className="text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        You have seen everything here.
      </p>
    );
  }

  const hasKnownCount =
    remainingCount !== null && remainingCount !== undefined && !isLoading;

  return (
    <div className="flex flex-col items-center gap-[var(--space-2)]">
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
