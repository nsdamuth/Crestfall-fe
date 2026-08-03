"use client";

import { useState } from "react";

import SelectionCardView from "@/components/studio/create/room-template/selection-card/SelectionCard.view";
import {
  selectionCardEditEmptyFixture,
  selectionCardEditLongContentFixture,
  selectionCardEditMissingIconFixture,
  selectionCardEditNarratorFixture,
  selectionCardEditScenarioFixture,
  selectionCardEditTitleOnlyFixture,
} from "@/components/studio/create/room-template/selection-card/SelectionCard.fixtures";

const PREVIEW_STATES = [
  { label: "Selected Scenario", props: selectionCardEditScenarioFixture },
  { label: "Selected Narrator", props: selectionCardEditNarratorFixture },
  { label: "Empty Optional Location", props: selectionCardEditEmptyFixture },
  { label: "Title Only", props: selectionCardEditTitleOnlyFixture },
  { label: "Missing Icon Fallback", props: selectionCardEditMissingIconFixture },
  { label: "Long Content", props: selectionCardEditLongContentFixture },
];

export default function SelectionCardEditPreviewClient() {
  const [lastAction, setLastAction] = useState("No picker opened yet.");

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Selection Card — Story Edit
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable edit-flow card directly from
            contract-shaped fixtures. It does not load references, open a real
            picker, apply recommendations, update a Story package, call an API,
            or persist a selection.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {PREVIEW_STATES.map((state) => (
            <article key={state.label} className="grid gap-3">
              <SelectionCardView
                {...state.props}
                onOpen={() => setLastAction(`${state.label} picker requested.`)}
              />
              <p className="px-1 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {state.label}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Local Action Feedback
          </p>
          <p className="mt-3 text-sm text-[var(--foreground)]">{lastAction}</p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Clicking a fixture only reports semantic picker-open intent inside
            this preview.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only visible labels, an optional display icon,
            selected title and subtitle, placeholder copy, and picker-open
            intent. Reference loading, recommendation behavior, picker state,
            Story updates, APIs, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
