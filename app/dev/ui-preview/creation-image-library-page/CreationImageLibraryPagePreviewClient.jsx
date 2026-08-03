"use client";

import { useState } from "react";

import CreationImageLibraryPageView from "@/components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view";
import { creationImageLibraryViewFixture } from "@/components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.fixtures";

function PreviewLink({ href, children, ...props }) {
  return (
    <a href={href} {...props} onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

function PreviewQuickActions({ liked, bookmarked, onToggleLike, onToggleBookmark, onExpand }) {
  return (
    <div className="absolute right-2 top-2 flex gap-1 rounded-lg bg-black/70 p-1 text-[10px]">
      <button type="button" onClick={onToggleLike}>{liked ? "Liked" : "Like"}</button>
      <button type="button" onClick={onToggleBookmark}>{bookmarked ? "Saved" : "Save"}</button>
      <button type="button" onClick={onExpand}>Open</button>
    </div>
  );
}

export default function CreationImageLibraryPagePreviewClient() {
  const [mode, setMode] = useState("populated");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const fixture = {
    ...creationImageLibraryViewFixture,
    eligibilityFilter: filter,
    sortMode: sort,
    visibleImages:
      mode === "empty" || mode === "no-matches"
        ? []
        : creationImageLibraryViewFixture.visibleImages,
    hiddenImages:
      mode === "empty" ? [] : creationImageLibraryViewFixture.hiddenImages,
    featuredSlotCards:
      mode === "empty"
        ? creationImageLibraryViewFixture.featuredSlotCards.map((slot) => ({
            ...slot,
            image: null,
          }))
        : creationImageLibraryViewFixture.featuredSlotCards,
    hasImages: mode !== "empty",
    noMatchingImages: mode === "no-matches",
    isLoading: mode === "loading",
    loadStatus: mode === "error" ? "error" : "loaded",
    loadMessage: mode === "error" ? "Preview library request failed." : "",
    deleteMessage: message,
    onRefresh: () => setMessage("Refresh requested."),
    onSetEligibilityFilter: setFilter,
    onSetSortMode: setSort,
    onLoadMoreVisibleImages: () => setMessage("Load More completed."),
    onOpenPreview: () => setMessage("Lightbox requested."),
    onToggleLike: () => setMessage("Like toggled."),
    onToggleBookmark: () => setMessage("Bookmark toggled."),
    onAssignFeaturedSlot: () => setMessage("Featured slot updated."),
    onHideImage: () => setMessage("Image hidden."),
    onShowImage: () => setMessage("Image restored."),
    onDeleteImage: () => setMessage("Delete requested."),
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-2">
          {["populated", "loading", "empty", "no-matches", "error"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setMessage("");
              }}
              className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase"
            >
              {value === "no-matches" ? "No matching images" : value}
            </button>
          ))}
        </div>

        <CreationImageLibraryPageView
          {...fixture}
          BackLinkComponent={PreviewLink}
          renderQuickActions={(props) => <PreviewQuickActions {...props} />}
          renderLightbox={() => null}
        />
      </div>
    </main>
  );
}
