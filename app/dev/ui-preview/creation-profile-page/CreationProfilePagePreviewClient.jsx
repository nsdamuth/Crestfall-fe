"use client";

import { useMemo, useState } from "react";
import {
  Camera,
  Link as LinkIcon,
  Share2,
} from "lucide-react";

import CreationProfilePageView from "@/components/studio/creations/creation-profile-page/CreationProfilePage.view";
import {
  CREATION_PROFILE_MEDIA_TABS,
  CREATION_PROFILE_SORT_OPTIONS,
  filterAndSortCreationProfileMedia,
  getCreationProfileDescription,
  normalizeCreationProfileCreation,
  normalizeCreationProfileMedia,
} from "@/components/studio/creations/creation-profile-page/useCreationProfilePageViewModel";
import {
  creationProfileEmptyMediaFixture,
  creationProfileFixture,
  creationProfileLoadErrorFixture,
  creationProfileMediaFixture,
} from "@/components/studio/creations/creation-profile-page/CreationProfilePage.fixtures";

const STATES = ["POPULATED", "EMPTY", "ERROR"];

export default function CreationProfilePagePreviewClient() {
  const [previewState, setPreviewState] = useState("POPULATED");
  const [activeTab, setActiveTab] = useState("IMAGES");
  const [sort, setSort] = useState("NEWEST");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [expanded, setExpanded] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState(null);
  const [likedIds, setLikedIds] = useState(() => new Set(["output-1", "output-4"]));
  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set(["output-2"]));

  const creation = normalizeCreationProfileCreation(creationProfileFixture);
  const sourceMedia =
    previewState === "EMPTY"
      ? creationProfileEmptyMediaFixture
      : creationProfileMediaFixture;
  const media = useMemo(
    () =>
      normalizeCreationProfileMedia(sourceMedia).map((item) => ({
        ...item,
        liked: likedIds.has(item.imageOutputId),
        bookmarked: bookmarkedIds.has(item.imageOutputId),
      })),
    [sourceMedia, likedIds, bookmarkedIds]
  );
  const filteredMedia = filterAndSortCreationProfileMedia({
    media,
    activeTab,
    query,
    sort,
  });
  const visibleMedia = filteredMedia.slice(0, visibleCount).map((item, index) => ({
    ...item,
    priority: index < 4,
  }));

  function toggleSet(setter, id) {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const actionSlots = Object.fromEntries(
    visibleMedia.map((item) => [
      item.id,
      <div
        key={`preview-action-${item.id}`}
        className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/70 px-2 py-1 text-[10px] text-[var(--muted)]"
      >
        {item.liked ? "Liked" : "Like"} · {item.bookmarked ? "Saved" : "Save"}
      </div>,
    ])
  );

  return (
    <main className="min-h-screen bg-[#050403] px-4 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          LOOM Development Preview
        </p>
        <h1 className="mt-2 font-display text-5xl">Creation Profile Page</h1>

        <div className="my-6 flex flex-wrap gap-2">
          {STATES.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setPreviewState(state)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                previewState === state
                  ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/15"
                  : "border-white/10 bg-black/30 text-[var(--muted)]"
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        <CreationProfilePageView
          shouldRender
          loadErrorMessage={
            previewState === "ERROR" ? creationProfileLoadErrorFixture : ""
          }
          creation={creation}
          description={getCreationProfileDescription(
            creation.description,
            expanded
          )}
          mediaTabs={CREATION_PROFILE_MEDIA_TABS.map((tab) => ({
            ...tab,
            active: tab.id === activeTab,
          }))}
          query={query}
          visibleMedia={visibleMedia}
          hasMoreMedia={visibleCount < filteredMedia.length}
          statusBadgesSlot={
            <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200">
              APPROVED · PUBLIC
            </span>
          }
          statsSlot={<span>148 likes · 921 messages</span>}
          creatorLinkSlot={
            <span className="text-[var(--foreground)]">@Crestfall</span>
          }
          generateLinkSlot={
            <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              <Camera size={14} /> Generate
            </span>
          }
          shareButtonSlot={
            <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              <Share2 size={14} /> Share
            </span>
          }
          sortControlSlot={
            <label className="block text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Sort
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setVisibleCount(12);
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-sm"
              >
                {CREATION_PROFILE_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          }
          mediaActionSlots={actionSlots}
          lightboxSlot={
            activePreviewId ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
                <button
                  type="button"
                  onClick={() => setActivePreviewId(null)}
                  className="rounded-2xl border border-[var(--muted-gold)]/30 bg-black px-8 py-6"
                >
                  <LinkIcon className="mx-auto" />
                  <span className="mt-3 block">Preview lightbox slot</span>
                </button>
              </div>
            ) : null
          }
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setVisibleCount(12);
          }}
          onQueryChange={(value) => {
            setQuery(value);
            setVisibleCount(12);
          }}
          onLoadMore={() => setVisibleCount((current) => current + 12)}
          onOpenMedia={setActivePreviewId}
          onToggleDescription={() => setExpanded((current) => !current)}
          onStartChat={() => undefined}
        />

        {visibleMedia.length ? (
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
            <button type="button" onClick={() => toggleSet(setLikedIds, "output-1")}>Toggle first like</button>
            <button type="button" onClick={() => toggleSet(setBookmarkedIds, "output-2")}>Toggle second bookmark</button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
