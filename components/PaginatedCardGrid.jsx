"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function PaginatedCardGrid({
  items = [],
  initialCount = 24,
  batchSize = 12,
  className = "",
  renderItem,
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef(null);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + batchSize, items.length)
    );
  }, [batchSize, items.length]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <div className={className}>
        {visibleItems.map((item, index) => renderItem(item, index))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="rounded-xl border border-[var(--gold-ornament)]/30 px-5 py-3 text-sm uppercase tracking-[0.2em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}