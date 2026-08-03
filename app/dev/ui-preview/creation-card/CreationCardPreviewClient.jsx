"use client";

import { useState } from "react";

import CreationCardView from "@/components/studio/creations/creation-card/CreationCard.view";
import {
  creationCardBusyFixture,
  creationCardCommunityFixture,
  creationCardErrorFixture,
  creationCardMobileFallbackFixture,
  creationCardOwnerFixture,
  creationCardPlayerCharacterFixture,
} from "@/components/studio/creations/creation-card/CreationCard.fixtures";

const PREVIEW_STATES = {
  owner: {
    label: "Owner",
    props: creationCardOwnerFixture,
  },
  community: {
    label: "Community",
    props: creationCardCommunityFixture,
  },
  playerCharacter: {
    label: "Player Character",
    props: creationCardPlayerCharacterFixture,
  },
  compactFallback: {
    label: "Compact Fallback",
    props: creationCardMobileFallbackFixture,
  },
  busy: {
    label: "Busy",
    props: creationCardBusyFixture,
  },
  error: {
    label: "Error",
    props: creationCardErrorFixture,
  },
};

export default function CreationCardPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("owner");
  const [viewProps, setViewProps] = useState({ ...creationCardOwnerFixture });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or interact with the portable card."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...nextState.props });
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function recordAction(label) {
    setLastAction(label);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Creation Card</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable card View directly. It does not load
            a preview graph, persist reactions, change the default Player
            Character, or create a Story Room.
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-8">
          <div className="mx-auto max-w-sm">
            <CreationCardView
              {...viewProps}
              onOpenPreview={() => recordAction("Preview intent emitted.")}
              onToggleLike={() => {
                setViewProps((current) => ({
                  ...current,
                  liked: !current.liked,
                }));
                recordAction("Like intent emitted.");
              }}
              onToggleBookmark={() => {
                setViewProps((current) => ({
                  ...current,
                  bookmarked: !current.bookmarked,
                }));
                recordAction("Bookmark intent emitted.");
              }}
              onSetDefaultPlayerCharacter={() =>
                recordAction("Default Player Character intent emitted.")
              }
              onStartChat={() => recordAction("Start Story intent emitted.")}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready content, child-View props, links,
            visual states, and semantic callbacks. Raw creation normalization,
            preview loading, Story Room creation, profile-default persistence,
            routing, and preview-modal ownership remain in the application
            chassis and binding Shell.
          </p>
        </section>
      </div>
    </main>
  );
}
