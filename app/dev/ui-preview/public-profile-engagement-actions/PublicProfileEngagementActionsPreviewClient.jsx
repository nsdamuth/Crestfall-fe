"use client";

import { useState } from "react";

import PublicProfileEngagementActionsView from "@/components/studio/profile/public-profile-engagement-actions/PublicProfileEngagementActions.view";
import {
  publicProfileEngagementActiveFixture,
  publicProfileEngagementContentsFixture,
  publicProfileEngagementDefaultFixture,
  publicProfileEngagementErrorFixture,
  publicProfileEngagementHiddenFixture,
  publicProfileEngagementNoActionsFixture,
  publicProfileEngagementPartialFixture,
} from "@/components/studio/profile/public-profile-engagement-actions/PublicProfileEngagementActions.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: publicProfileEngagementDefaultFixture,
  },
  active: {
    label: "All Active",
    props: publicProfileEngagementActiveFixture,
  },
  error: {
    label: "Error",
    props: publicProfileEngagementErrorFixture,
  },
  partial: {
    label: "Like + Save",
    props: publicProfileEngagementPartialFixture,
  },
  noActions: {
    label: "No Actions",
    props: publicProfileEngagementNoActionsFixture,
  },
  hidden: {
    label: "Hidden",
    props: publicProfileEngagementHiddenFixture,
  },
  contents: {
    label: "Contents Layout",
    props: publicProfileEngagementContentsFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    engagementActions: { ...fixture.engagementActions },
  };
}

export default function PublicProfileEngagementActionsPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [lastAction, setLastAction] = useState(
    "Choose an engagement action to update local preview state."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps(cloneFixture(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function toggleEngagement(key, message) {
    setViewProps((current) => ({
      ...current,
      engagementActions: {
        ...current.engagementActions,
        [key]: !current.engagementActions[key],
      },
    }));
    setLastAction(message);
  }

  const engagementActions = {
    ...viewProps.engagementActions,
    onToggleLike: viewProps.engagementActions.canLike
      ? () => toggleEngagement("liked", "Toggled Like in local preview state.")
      : null,
    onToggleBookmark: viewProps.engagementActions.canBookmark
      ? () =>
          toggleEngagement(
            "bookmarked",
            "Toggled Save in local preview state."
          )
      : null,
    onToggleFollow: viewProps.engagementActions.canFollow
      ? () =>
          toggleEngagement(
            "followed",
            "Toggled Follow in local preview state."
          )
      : null,
  };

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Public Profile Engagement Actions
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable public-profile engagement surface
            directly from contract-shaped fixtures. Engagement actions update
            local state only.
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-6">
          <PublicProfileEngagementActionsView
            {...viewProps}
            engagementActions={engagementActions}
          />

          {!viewProps.isVisible ? (
            <p className="text-sm text-[var(--muted)]">
              The hidden fixture renders no engagement surface.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only visibility, layout, display-ready error text,
            and nested portable engagement-action props. Raw profiles,
            engagement hooks, authentication, API requests, optimistic updates,
            refreshes, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
