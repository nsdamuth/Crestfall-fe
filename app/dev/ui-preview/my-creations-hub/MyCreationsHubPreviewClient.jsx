"use client";

import { useMemo, useState } from "react";

import MyCreationsHubView from "@/components/studio/my-creations/my-creations-hub/MyCreationsHub.view";
import {
  myCreationsHubEmptyFixture,
  myCreationsHubFixture,
} from "@/components/studio/my-creations/my-creations-hub/MyCreationsHub.fixtures";
import {
  getMyCreationsHubViewProps,
  INITIAL_VISIBLE_CREATIONS,
  VISIBLE_CREATION_INCREMENT,
} from "@/components/studio/my-creations/my-creations-hub/useMyCreationsHubViewModel";

function PreviewLink({ href, children, ...props }) {
  return (
    <a href={href} {...props} onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

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

function PreviewTagFilter({ tags, activeTag, onTagChange, allValue, label }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[allValue, ...tags].map((tag) => (
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
        {creation.typeLabel}
      </p>
      <h3 className="mt-2 font-display text-2xl">{creation.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
        {creation.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        <span>{creation.status}</span>
        <span>{creation.visibility}</span>
        {priority ? <span>eager</span> : null}
        {liked ? <span>liked</span> : null}
        {bookmarked ? <span>saved</span> : null}
      </div>
    </article>
  );
}

export default function MyCreationsHubPreviewClient() {
  const [fixtureKey, setFixtureKey] = useState("populated");
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeTag, setActiveTag] = useState("ALL");
  const [query, setQuery] = useState("");
  const [mobileGridMode, setMobileGridMode] = useState("GRID");
  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_CREATIONS
  );
  const [showEngagementError, setShowEngagementError] = useState(false);

  const fixture =
    fixtureKey === "empty"
      ? myCreationsHubEmptyFixture
      : myCreationsHubFixture;
  const viewProps = useMemo(
    () =>
      getMyCreationsHubViewProps({
        creations: fixture.creations,
        activeTab,
        activeTag,
        query,
        mobileGridMode,
        visibleCount,
        engagementMessage: showEngagementError
          ? "Like could not be saved."
          : "",
        isCreationLiked: (creation) =>
          creation.id === "creation-character-1",
        isCreationBookmarked: (creation) =>
          creation.id === "creation-location-1",
      }),
    [
      fixture,
      activeTab,
      activeTag,
      query,
      mobileGridMode,
      visibleCount,
      showEngagementError,
    ]
  );

  function chooseFixture(key) {
    setFixtureKey(key);
    setActiveTab("ALL");
    setActiveTag("ALL");
    setQuery("");
    setVisibleCount(INITIAL_VISIBLE_CREATIONS);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-2">
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

        <MyCreationsHubView
          {...viewProps}
          onActiveTabChange={(value) => {
            setActiveTab(value);
            setVisibleCount(INITIAL_VISIBLE_CREATIONS);
          }}
          onActiveTagChange={(value) => {
            setActiveTag(value);
            setVisibleCount(INITIAL_VISIBLE_CREATIONS);
          }}
          onQueryChange={(value) => {
            setQuery(value);
            setVisibleCount(INITIAL_VISIBLE_CREATIONS);
          }}
          onToggleMobileGridMode={() =>
            setMobileGridMode((current) =>
              current === "GRID" ? "LARGE" : "GRID"
            )
          }
          onLoadMore={() =>
            setVisibleCount(
              (current) => current + VISIBLE_CREATION_INCREMENT
            )
          }
          InternalLinkComponent={PreviewLink}
          FilterPanelComponent={PreviewFilterPanel}
          TagFilterComponent={PreviewTagFilter}
          CreationCardComponent={PreviewCreationCard}
        />
      </div>
    </main>
  );
}
