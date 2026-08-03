"use client";

import { useState } from "react";

import CreationStatsRowView from "@/components/studio/creations/creation-stats-row/CreationStatsRow.view";
import {
  creationStatsRowCompactFixture,
  creationStatsRowCompleteFixture,
  creationStatsRowEmptyFixture,
  creationStatsRowFractionalFixture,
  creationStatsRowLargeNumbersFixture,
  creationStatsRowLikesOnlyFixture,
  creationStatsRowMediaFixture,
} from "@/components/studio/creations/creation-stats-row/CreationStatsRow.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete",
    props: creationStatsRowCompleteFixture,
  },
  compact: {
    label: "Compact",
    props: creationStatsRowCompactFixture,
  },
  likesOnly: {
    label: "Likes Only",
    props: creationStatsRowLikesOnlyFixture,
  },
  media: {
    label: "Media Only",
    props: creationStatsRowMediaFixture,
  },
  largeNumbers: {
    label: "Large Numbers",
    props: creationStatsRowLargeNumbersFixture,
  },
  fractional: {
    label: "Fractional Inputs",
    props: creationStatsRowFractionalFixture,
  },
  empty: {
    label: "Empty",
    props: creationStatsRowEmptyFixture,
  },
};

export default function CreationStatsRowPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Creation Stats Row</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable stats View directly from
            contract-shaped fixtures. It does not load a creation, query
            engagement totals, or modify media and chat activity.
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
            <CreationStatsRowView {...activeState.props} />

            {!activeState.props.items.length ? (
              <p className="text-sm leading-6 text-[var(--muted)]">
                No positive stat items are supplied in this fixture, so the
                portable View renders nothing.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures provide only ordered semantic stat IDs, positive numeric
            values, and compact presentation state. The live ViewModel remains
            responsible for reading and filtering the raw creation stats
            object.
          </p>
        </section>
      </div>
    </main>
  );
}
