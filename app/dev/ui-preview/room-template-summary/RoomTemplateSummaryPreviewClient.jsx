"use client";

import { useState } from "react";

import RoomTemplateSummaryView from "@/components/studio/room-templates/room-template-summary/RoomTemplateSummary.view";
import {
  roomTemplateSummaryCompleteFixture,
  roomTemplateSummaryCustomHeadingFixture,
  roomTemplateSummaryEmptyFixture,
  roomTemplateSummaryLongContentFixture,
  roomTemplateSummaryNoRowsFixture,
  roomTemplateSummaryPartialFixture,
} from "@/components/studio/room-templates/room-template-summary/RoomTemplateSummary.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete",
    props: roomTemplateSummaryCompleteFixture,
  },
  empty: {
    label: "Empty",
    props: roomTemplateSummaryEmptyFixture,
  },
  partial: {
    label: "Partial",
    props: roomTemplateSummaryPartialFixture,
  },
  noRows: {
    label: "No Rows",
    props: roomTemplateSummaryNoRowsFixture,
  },
  customHeading: {
    label: "Custom Heading",
    props: roomTemplateSummaryCustomHeadingFixture,
  },
  longContent: {
    label: "Long Content",
    props: roomTemplateSummaryLongContentFixture,
  },
};

export default function RoomTemplateSummaryPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Template Summary
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Create Story package summary from
            contract-shaped fixtures. It does not load or modify a Story draft.
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

        <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Story Builder
            </p>
            <h2 className="mt-2 font-display text-4xl">Preview Draft</h2>
            <RoomTemplateSummaryView {...activeState.props} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain display-ready summary rows. Raw selected
              creations, picker state, Story package mutation, saving, APIs,
              and persistence remain application-owned.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
