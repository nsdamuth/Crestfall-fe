"use client";

import { useState } from "react";

import CreatorListRowView from "@/components/studio/community/creator-list-row/CreatorListRow.view";
import {
  creatorListRowDefaultFixture,
  creatorListRowFallbackSummaryFixture,
  creatorListRowFeaturedFixture,
  creatorListRowLongContentFixture,
  creatorListRowNoActionsFixture,
  creatorListRowPartialActionsFixture,
} from "@/components/studio/community/creator-list-row/CreatorListRow.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: creatorListRowDefaultFixture,
  },
  featured: {
    label: "Featured + Canon",
    props: creatorListRowFeaturedFixture,
  },
  fallback: {
    label: "Fallback + Zero Stats",
    props: creatorListRowFallbackSummaryFixture,
  },
  longContent: {
    label: "Long Content",
    props: creatorListRowLongContentFixture,
  },
  partialActions: {
    label: "Partial Actions",
    props: creatorListRowPartialActionsFixture,
  },
  noActions: {
    label: "No Actions",
    props: creatorListRowNoActionsFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    stats: fixture.stats.map((stat) => ({ ...stat })),
    engagementActions: { ...fixture.engagementActions },
  };
}

export default function CreatorListRowPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [rowProps, setRowProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [lastAction, setLastAction] = useState(
    "Choose an engagement action to update local preview state."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setRowProps(cloneFixture(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function updateEngagement(key, message) {
    setRowProps((current) => ({
      ...current,
      engagementActions: {
        ...current.engagementActions,
        [key]: !current.engagementActions[key],
      },
    }));
    setLastAction(message);
  }

  const engagementActions = {
    ...rowProps.engagementActions,
    onToggleLike: rowProps.engagementActions.canLike
      ? () => updateEngagement("liked", "Toggled Like in local preview state.")
      : null,
    onToggleBookmark: rowProps.engagementActions.canBookmark
      ? () =>
          updateEngagement("bookmarked", "Toggled Save in local preview state.")
      : null,
    onToggleFollow: rowProps.engagementActions.canFollow
      ? () =>
          updateEngagement("followed", "Toggled Follow in local preview state.")
      : null,
  };

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Creator List Row</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable list-row View directly from
            contract-shaped fixtures. Engagement actions update local state
            only, and the profile link targets a preview hash.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
          <CreatorListRowView
            {...rowProps}
            engagementActions={engagementActions}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready creator identity, badges, stats,
            profile navigation, and nested portable engagement-action props.
            Raw profile records, identity fallbacks, engagement requests,
            authentication, filtering, and persistence remain
            application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
