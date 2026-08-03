"use client";

import StudioComingSoonView from "@/components/studio/studio-coming-soon/StudioComingSoon.view";
import {
  studioComingSoonDefaultFixture,
  studioComingSoonLongContentFixture,
  studioComingSoonNoBodyFixture,
  studioComingSoonNoEyebrowFixture,
  studioComingSoonNoItemsFixture,
  studioComingSoonSingleItemFixture,
} from "@/components/studio/studio-coming-soon/StudioComingSoon.fixtures";

const PREVIEW_STATES = [
  {
    label: "Default",
    props: studioComingSoonDefaultFixture,
  },
  {
    label: "No Items",
    props: studioComingSoonNoItemsFixture,
  },
  {
    label: "No Supporting Body",
    props: studioComingSoonNoBodyFixture,
  },
  {
    label: "No Eyebrow",
    props: studioComingSoonNoEyebrowFixture,
  },
  {
    label: "Single Item",
    props: studioComingSoonSingleItemFixture,
  },
  {
    label: "Long Content",
    props: studioComingSoonLongContentFixture,
  },
];

export default function StudioComingSoonPreviewClient() {
  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Studio Coming Soon</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable placeholder View directly from
            contract-shaped fixtures. It does not activate Storylines, canon
            submissions, APIs, services, or persistence.
          </p>
        </header>

        <div className="space-y-10">
          {PREVIEW_STATES.map((state) => (
            <section key={state.label}>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                {state.label}
              </p>
              <StudioComingSoonView {...state.props} />
            </section>
          ))}
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only visible placeholder copy and roadmap items.
            Product planning, feature availability, page composition, APIs,
            services, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
