"use client";

import { useState } from "react";

import MediaHistoryGrid from "@/components/studio/image-studio/MediaHistoryGrid";
import { mediaHistoryGridFixtureItems } from "@/components/studio/image-studio/media-history-grid/MediaHistoryGrid.fixtures";

export default function MediaHistoryGridPreviewClient() {
  const [mode, setMode] = useState("populated");
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  const generatedMedia = mode === "empty" ? [] : mediaHistoryGridFixtureItems;
  const historyStatus = mode === "loading" ? "loading" : "success";
  const historyError = mode === "error" ? "Fixture history request failed." : "";

  function handleLoadMore() {
    setLoadingMore(true);
    window.setTimeout(() => {
      setLoadingMore(false);
      setLoadCount((current) => current + 1);
    }, 350);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-[var(--foreground)] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-5xl">Media History Grid</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercises the Image Studio Binding Shell with masonry dimensions,
            pending and failed jobs, filters, mobile layout controls, reactions,
            selection, bulk deletion, Lightbox integration, and history states.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {["populated", "loading", "empty", "error"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] ${
                  mode === value
                    ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-[var(--muted)]">
            Load More completed: {loadCount}
          </p>
        </div>

        <MediaHistoryGrid
          generatedMedia={generatedMedia}
          historyStatus={historyStatus}
          historyError={historyError}
          hasMoreHistory={mode === "populated"}
          isLoadingMoreHistory={loadingMore}
          onLoadMoreHistory={handleLoadMore}
        />
      </div>
    </main>
  );
}
