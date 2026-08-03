"use client";

import StudioActionCardView from "@/components/studio/studio-action-card/StudioActionCard.view";
import {
  studioActionCardDisabledFixture,
  studioActionCardEnabledFixture,
  studioActionCardLongContentFixture,
  studioActionCardNoBodyFixture,
  studioActionCardNoEyebrowFixture,
  studioActionCardNoHrefFixture,
} from "@/components/studio/studio-action-card/StudioActionCard.fixtures";

const PREVIEW_STATES = [
  {
    label: "Enabled Link",
    props: studioActionCardEnabledFixture,
  },
  {
    label: "Disabled",
    props: studioActionCardDisabledFixture,
  },
  {
    label: "Missing Href",
    props: studioActionCardNoHrefFixture,
  },
  {
    label: "No Eyebrow",
    props: studioActionCardNoEyebrowFixture,
  },
  {
    label: "No Body",
    props: studioActionCardNoBodyFixture,
  },
  {
    label: "Long Content",
    props: studioActionCardLongContentFixture,
  },
];

export default function StudioActionCardPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Studio Action Card</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable action-card View directly from
            contract-shaped fixtures. Enabled destinations use preview hashes;
            no Canon session, Chronicle workflow, API, or persistence is
            connected.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PREVIEW_STATES.map((state) => (
            <div key={state.label} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                {state.label}
              </p>
              <StudioActionCardView {...state.props} />
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only visible card content, a supplied destination,
            an action label, and disabled state. Route selection, feature
            availability, permissions, workflow startup, APIs, and persistence
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
