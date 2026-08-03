"use client";

import { useState } from "react";

import PublicProfileHeroView from "@/components/studio/profile/public-profile-hero/PublicProfileHero.view";
import {
  publicProfileHeroAliasFixture,
  publicProfileHeroCompleteFixture,
  publicProfileHeroFallbackFixture,
} from "@/components/studio/profile/public-profile-hero/PublicProfileHero.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete Profile",
    props: publicProfileHeroCompleteFixture,
  },
  alias: {
    label: "Alternate Creator",
    props: publicProfileHeroAliasFixture,
  },
  fallback: {
    label: "Fallback Profile",
    props: publicProfileHeroFallbackFixture,
  },
};

function PreviewAvatar({ displayName }) {
  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#080706] bg-[var(--muted-gold)]/20 font-display text-4xl text-[var(--muted-gold)] shadow-xl">
      {displayName.slice(0, 1)}
    </div>
  );
}

function PreviewAction({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-black/35 px-4 text-xs uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
    >
      {label}
    </button>
  );
}

export default function PublicProfileHeroPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [feedback, setFeedback] = useState("No preview action yet.");
  const activeState = PREVIEW_STATES[activeStateKey];
  const viewProps = activeState.props;

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Public Profile Hero</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable creator-profile hero without loading
            a public profile, engagement state, donation state, or Next.js route.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => {
                  setActiveStateKey(stateKey);
                  setFeedback("No preview action yet.");
                }}
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
        </section>

        <PublicProfileHeroView
          {...viewProps}
          avatarSlot={<PreviewAvatar displayName={viewProps.displayName} />}
          followersLinkSlot={
            <button
              type="button"
              onClick={() => setFeedback("Followers selected")}
              className="text-left transition hover:text-[var(--foreground)]"
            >
              <span className="font-display text-xl text-[var(--foreground)]">
                {viewProps.followersCount}
              </span>{" "}
              <span className="text-[var(--muted)]">Followers</span>
            </button>
          }
          followingLinkSlot={
            <button
              type="button"
              onClick={() => setFeedback("Following selected")}
              className="text-left transition hover:text-[var(--foreground)]"
            >
              <span className="font-display text-xl text-[var(--foreground)]">
                {viewProps.followingCount}
              </span>{" "}
              <span className="text-[var(--muted)]">Following</span>
            </button>
          }
          engagementActionsSlot={
            <>
              <PreviewAction
                label="Follow"
                onClick={() => setFeedback("Follow selected")}
              />
              <PreviewAction
                label="Donate"
                onClick={() => setFeedback("Donate selected")}
              />
              <PreviewAction
                label="Share"
                onClick={() => setFeedback("Share selected")}
              />
            </>
          }
        />

        <aside className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview Feedback
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{feedback}</p>
        </aside>
      </div>
    </main>
  );
}
