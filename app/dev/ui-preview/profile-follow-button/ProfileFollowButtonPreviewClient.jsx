"use client";

import { useState } from "react";

import ProfileFollowButtonView from "@/components/studio/profile/profile-follow-button/ProfileFollowButton.view";
import {
  profileFollowButtonDefaultFixture,
  profileFollowButtonFollowingFixture,
  profileFollowButtonHiddenFixture,
  profileFollowButtonSavingFollowFixture,
  profileFollowButtonSavingUnfollowFixture,
} from "@/components/studio/profile/profile-follow-button/ProfileFollowButton.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Follow",
    props: profileFollowButtonDefaultFixture,
  },
  following: {
    label: "Following",
    props: profileFollowButtonFollowingFixture,
  },
  savingFollow: {
    label: "Saving Follow",
    props: profileFollowButtonSavingFollowFixture,
  },
  savingUnfollow: {
    label: "Saving Unfollow",
    props: profileFollowButtonSavingUnfollowFixture,
  },
  hidden: {
    label: "Hidden",
    props: profileFollowButtonHiddenFixture,
  },
};

export default function ProfileFollowButtonPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState({
    ...profileFollowButtonDefaultFixture,
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or toggle the local preview button."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...nextState.props });
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function toggleFollow() {
    setViewProps((current) => ({
      ...current,
      isFollowing: !current.isFollowing,
    }));
    setLastAction("Toggled follow in preview-local state.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Profile Follow Button
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable follow-button View directly from
            contract-shaped fixtures. Interaction updates local state only.
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-8">
          <ProfileFollowButtonView
            {...viewProps}
            onToggleFollow={viewProps.isSaving ? null : toggleFollow}
          />

          {!viewProps.isVisible ? (
            <p className="text-sm text-[var(--muted)]">
              The hidden fixture renders no follow button.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready visibility, active, saving, and
            semantic callback props. Username routing, API requests, response
            interpretation, route refreshes, and persistence remain
            application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
