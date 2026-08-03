"use client";

import { useState } from "react";

import CreationStatusBadgesView from "@/components/studio/creations/creation-status-badges/CreationStatusBadges.view";
import {
  creationStatusBadgesCanonFixture,
  creationStatusBadgesCompactFixture,
  creationStatusBadgesCustomFixture,
  creationStatusBadgesEmptyFixture,
  creationStatusBadgesPrivateDraftFixture,
  creationStatusBadgesPublicFixture,
  creationStatusBadgesRejectedFixture,
  creationStatusBadgesReviewFixture,
} from "@/components/studio/creations/creation-status-badges/CreationStatusBadges.fixtures";

const PREVIEW_STATES = {
  privateDraft: {
    label: "Private Draft",
    props: creationStatusBadgesPrivateDraftFixture,
  },
  public: {
    label: "Public Approved",
    props: creationStatusBadgesPublicFixture,
  },
  canon: {
    label: "Canon",
    props: creationStatusBadgesCanonFixture,
  },
  review: {
    label: "In Review",
    props: creationStatusBadgesReviewFixture,
  },
  rejected: {
    label: "Rejected Explicit",
    props: creationStatusBadgesRejectedFixture,
  },
  custom: {
    label: "Fallback Tones",
    props: creationStatusBadgesCustomFixture,
  },
  compact: {
    label: "Compact",
    props: creationStatusBadgesCompactFixture,
  },
  empty: {
    label: "Empty",
    props: creationStatusBadgesEmptyFixture,
  },
};

export default function CreationStatusBadgesPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("privateDraft");
  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Status Badges
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable badge View directly from
            contract-shaped fixtures. It does not load a creation or interpret
            publication, moderation, canon, or persistence state.
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
                onClick={() => setActiveStateKey(stateKey)}
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-6">
          <div className="min-h-28 rounded-xl border border-white/10 bg-black/30 p-6">
            <CreationStatusBadgesView {...activeState.props} />

            {!activeState.props.badges.length ? (
              <p className="text-sm leading-6 text-[var(--muted)]">
                No visible badge items are supplied in this fixture. The live
                component preserves its empty badge-row container.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures supply only ordered badge IDs, visible values, and compact
            presentation state. The live ViewModel remains responsible for
            reading the raw creation record and deciding which badges apply.
          </p>
        </section>
      </div>
    </main>
  );
}
