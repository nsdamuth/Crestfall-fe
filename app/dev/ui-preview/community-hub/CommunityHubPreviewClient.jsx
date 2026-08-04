"use client";

import { useMemo, useState } from "react";

import CommunityHubView from "@/components/studio/community/community-hub/CommunityHub.view";
import {
  communityHubEmptyFixture,
  communityHubFixture,
} from "@/components/studio/community/community-hub/CommunityHub.fixtures";
import {
  getCommunityHubViewProps,
  INITIAL_VISIBLE_COMMUNITY_CREATIONS,
  INITIAL_VISIBLE_CREATORS,
  VISIBLE_COMMUNITY_CREATION_INCREMENT,
  VISIBLE_CREATOR_INCREMENT,
} from "@/components/studio/community/community-hub/useCommunityHubViewModel";

function PreviewFilterPanel({ eyebrow, body, actions, children }) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/40 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {body}
          </p>
        </div>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function PreviewSelect({ label, value, onChange, options }) {
  return (
    <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-sm text-[var(--foreground)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PreviewTagFilter({ tags, activeTag, onTagChange, label }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {["ALL", ...tags].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange?.(tag)}
            className={`rounded-full border px-3 py-2 text-xs ${
              activeTag === tag
                ? "border-[var(--muted-gold)] text-[var(--foreground)]"
                : "border-white/10 text-[var(--muted)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewCreationCard({ creation, liked, bookmarked, priority }) {
  return (
    <article className="min-h-48 rounded-2xl border border-white/10 bg-black/35 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
        {creation.type}
      </p>
      <h3 className="mt-2 font-display text-2xl tabular-nums">{creation.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
        {creation.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        {priority ? <span>eager</span> : null}
        {liked ? <span>liked</span> : null}
        {bookmarked ? <span>saved</span> : null}
      </div>
    </article>
  );
}

function PreviewCreatorCard({ creator, liked, bookmarked, followed }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/35 p-5">
      <h3 className="font-display text-2xl tabular-nums">{creator.displayName}</h3>
      <p className="mt-1 text-sm text-[var(--muted-gold)]">{creator.handle}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{creator.tagline}</p>
      <p className="mt-3 text-xs text-[var(--muted)]">
        {[liked && "liked", bookmarked && "saved", followed && "followed"]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </article>
  );
}

function PreviewCreatorListRow(props) {
  return (
    <div className="border-b border-white/10 p-4 last:border-b-0">
      <PreviewCreatorCard {...props} />
    </div>
  );
}

export default function CommunityHubPreviewClient() {
  const [fixtureKey, setFixtureKey] = useState("populated");
  const [mode, setMode] = useState("CREATIONS");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("ALL");
  const [activeType, setActiveType] = useState("ALL");
  const [activeCreationFilter, setActiveCreationFilter] = useState("ALL");
  const [activeCreatorFilter, setActiveCreatorFilter] = useState("ALL");
  const [creatorView, setCreatorView] = useState("GRID");
  const [mobileCreationGridMode, setMobileCreationGridMode] = useState("GRID");
  const [sort, setSort] = useState("RECOMMENDED");
  const [rating, setRating] = useState("ALL");
  const [rendering, setRendering] = useState("ALL");
  const [visibleCreationCount, setVisibleCreationCount] = useState(
    INITIAL_VISIBLE_COMMUNITY_CREATIONS
  );
  const [visibleCreatorCount, setVisibleCreatorCount] = useState(
    INITIAL_VISIBLE_CREATORS
  );
  const [showEngagementError, setShowEngagementError] = useState(false);

  const fixture =
    fixtureKey === "empty" ? communityHubEmptyFixture : communityHubFixture;
  const viewProps = useMemo(
    () =>
      getCommunityHubViewProps({
        ...fixture,
        mode,
        query,
        activeTag,
        activeType,
        activeCreationFilter,
        activeCreatorFilter,
        creatorView,
        mobileCreationGridMode,
        sort,
        rating,
        rendering,
        visibleCreationCount,
        visibleCreatorCount,
        creationEngagementMessage: showEngagementError
          ? "Community reaction could not be saved."
          : "",
        isCreationLiked: (creation) => creation.id === "community-creation-1",
        isCreationBookmarked: (creation) =>
          creation.id === "community-creation-2",
        isProfileLiked: (creator) => creator.id === "community-creator-1",
        isProfileBookmarked: (creator) =>
          creator.id === "community-creator-2",
        isProfileFollowed: (creator) =>
          creator.id === "community-creator-3",
      }),
    [
      fixture,
      mode,
      query,
      activeTag,
      activeType,
      activeCreationFilter,
      activeCreatorFilter,
      creatorView,
      mobileCreationGridMode,
      sort,
      rating,
      rendering,
      visibleCreationCount,
      visibleCreatorCount,
      showEngagementError,
    ]
  );

  function chooseFixture(key) {
    setFixtureKey(key);
    setMode("CREATIONS");
    setQuery("");
    setActiveTag("ALL");
    setActiveType("ALL");
    setActiveCreationFilter("ALL");
    setActiveCreatorFilter("ALL");
    setVisibleCreationCount(INITIAL_VISIBLE_COMMUNITY_CREATIONS);
    setVisibleCreatorCount(INITIAL_VISIBLE_CREATORS);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["populated", "Populated"],
            ["empty", "Empty"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => chooseFixture(key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                fixtureKey === key
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15"
                  : "border-white/15 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowEngagementError((current) => !current)}
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
          >
            Toggle engagement error
          </button>
        </div>

        <CommunityHubView
          {...viewProps}
          onModeChange={setMode}
          onQueryChange={setQuery}
          onActiveTagChange={setActiveTag}
          onActiveTypeChange={setActiveType}
          onActiveCreationFilterChange={setActiveCreationFilter}
          onActiveCreatorFilterChange={setActiveCreatorFilter}
          onCreatorViewChange={setCreatorView}
          onSortChange={setSort}
          onRatingChange={setRating}
          onRenderingChange={setRendering}
          onToggleMobileCreationGridMode={() =>
            setMobileCreationGridMode((current) =>
              current === "GRID" ? "LARGE" : "GRID"
            )
          }
          onLoadMoreCreations={() =>
            setVisibleCreationCount(
              (current) => current + VISIBLE_COMMUNITY_CREATION_INCREMENT
            )
          }
          onLoadMoreCreators={() =>
            setVisibleCreatorCount((current) => current + VISIBLE_CREATOR_INCREMENT)
          }
          FilterPanelComponent={PreviewFilterPanel}
          SelectComponent={PreviewSelect}
          TagFilterComponent={PreviewTagFilter}
          CreationCardComponent={PreviewCreationCard}
          CreatorCardComponent={PreviewCreatorCard}
          CreatorListRowComponent={PreviewCreatorListRow}
        />
      </div>
    </main>
  );
}
