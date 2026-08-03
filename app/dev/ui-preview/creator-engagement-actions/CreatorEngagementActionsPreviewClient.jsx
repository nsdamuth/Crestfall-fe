"use client";

import { useState } from "react";

import CreatorEngagementActionsView from "@/components/studio/community/creator-engagement-actions/CreatorEngagementActions.view";
import {
  creatorEngagementActionsCompactFixture,
  creatorEngagementActionsDefaultFixture,
  creatorEngagementActionsEngagedFixture,
  creatorEngagementActionsFollowOnlyFixture,
  creatorEngagementActionsPartialFixture,
  creatorEngagementActionsUnavailableFixture,
} from "@/components/studio/community/creator-engagement-actions/CreatorEngagementActions.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: creatorEngagementActionsDefaultFixture,
  },
  engaged: {
    label: "All Active",
    props: creatorEngagementActionsEngagedFixture,
  },
  compact: {
    label: "Compact",
    props: creatorEngagementActionsCompactFixture,
  },
  partial: {
    label: "Like + Save",
    props: creatorEngagementActionsPartialFixture,
  },
  followOnly: {
    label: "Follow Only",
    props: creatorEngagementActionsFollowOnlyFixture,
  },
  unavailable: {
    label: "No Actions",
    props: creatorEngagementActionsUnavailableFixture,
  },
};

function cloneFixture(fixture) {
  return { ...fixture };
}

export default function CreatorEngagementActionsPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [actionProps, setActionProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [lastAction, setLastAction] = useState(
    "Choose an action to update local preview state."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setActionProps(cloneFixture(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function toggleLike() {
    setActionProps((current) => ({
      ...current,
      liked: !current.liked,
    }));
    setLastAction("Toggled creator Like in local preview state.");
  }

  function toggleBookmark() {
    setActionProps((current) => ({
      ...current,
      bookmarked: !current.bookmarked,
    }));
    setLastAction("Toggled creator Save in local preview state.");
  }

  function toggleFollow() {
    setActionProps((current) => ({
      ...current,
      followed: !current.followed,
    }));
    setLastAction("Toggled creator Follow in local preview state.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creator Engagement Actions
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable action View directly from
            contract-shaped fixtures. Like, Save, and Follow update local
            preview state only.
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
          <div className="rounded-2xl border border-white/10 bg-black/35 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Creator
            </p>
            <h2 className="mt-2 font-display text-3xl">Crestfallen Weaver</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Action clicks should update only the controls below and should not
              activate this surrounding preview card.
            </p>

            <CreatorEngagementActionsView
              {...actionProps}
              onToggleLike={actionProps.canLike ? toggleLike : null}
              onToggleBookmark={
                actionProps.canBookmark ? toggleBookmark : null
              }
              onToggleFollow={actionProps.canFollow ? toggleFollow : null}
            />
          </div>

          {activeStateKey === "unavailable" ? (
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              The View intentionally renders nothing when no engagement actions
              are available.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only engagement visual state, action availability,
            compact presentation state, and semantic callbacks. Creator records,
            reaction requests, authentication, optimistic updates, errors,
            refresh behavior, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
