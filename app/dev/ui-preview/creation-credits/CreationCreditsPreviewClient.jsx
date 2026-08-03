"use client";

import CreationCreditsView from "@/components/studio/creations/creation-credits/CreationCredits.view";
import {
  creationCreditsEmptyFixture,
  creationCreditsLinkedCreatorFixture,
  creationCreditsLongContentFixture,
  creationCreditsMixedFixture,
  creationCreditsNoAssetTitleFixture,
  creationCreditsPlainCreatorFixture,
} from "@/components/studio/creations/creation-credits/CreationCredits.fixtures";

const PREVIEW_STATES = [
  {
    label: "Mixed Credits",
    props: creationCreditsMixedFixture,
  },
  {
    label: "Linked Creator",
    props: creationCreditsLinkedCreatorFixture,
  },
  {
    label: "Unlinked Creator",
    props: creationCreditsPlainCreatorFixture,
  },
  {
    label: "No Asset Title",
    props: creationCreditsNoAssetTitleFixture,
  },
  {
    label: "Long Content",
    props: creationCreditsLongContentFixture,
  },
  {
    label: "Empty Credits",
    props: creationCreditsEmptyFixture,
  },
];

export default function CreationCreditsPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Creation Credits</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable attribution View directly from
            contract-shaped fixtures. It does not load a creation, resolve an
            attribution graph, call an API, or save data.
          </p>
        </header>

        <section className="grid gap-5">
          {PREVIEW_STATES.map((state) => (
            <article
              key={state.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {state.label}
              </p>
              <CreationCreditsView {...state.props} />
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready credit IDs, kind labels,
            creator handles, optional creator routes, and optional asset
            titles. Attribution resolution, source graphs, ownership,
            visibility, APIs, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
