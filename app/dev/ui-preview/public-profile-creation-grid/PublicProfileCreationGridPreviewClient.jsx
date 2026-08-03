"use client";

import PublicProfileCreationGridView from "@/components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.view";
import {
  publicProfileCreationGridEmptyFixture,
  publicProfileCreationGridErrorFixture,
  publicProfileCreationGridPopulatedFixture,
} from "@/components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.fixtures";

function PreviewCard({ label, index }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="flex aspect-[4/5] items-center justify-center bg-white/[0.04] px-5 text-center text-sm uppercase tracking-[0.16em] text-[var(--muted-gold)]">
        Application Card {index + 1}
      </div>
      <div className="p-5">
        <p className="font-display text-2xl">{label}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Semantic slot standing in for the application-owned Creation Card.
        </p>
      </div>
    </article>
  );
}

function FixturePreview({ fixture }) {
  const creationSlots = fixture.creationLabels.map((label, index) => (
    <PreviewCard key={label} label={label} index={index} />
  ));

  return (
    <PublicProfileCreationGridView
      {...fixture}
      creationSlots={creationSlots}
    />
  );
}

export default function PublicProfileCreationGridPreviewClient() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--foreground)] md:px-10">
      <div className="mx-auto max-w-7xl space-y-14">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Public Profile Creation Grid
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            Portable public-profile grid with application-owned Creation Cards injected as semantic slots.
          </p>
        </header>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Populated Grid
          </p>
          <FixturePreview fixture={publicProfileCreationGridPopulatedFixture} />
        </section>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Empty Grid
          </p>
          <FixturePreview fixture={publicProfileCreationGridEmptyFixture} />
        </section>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            Engagement Error
          </p>
          <FixturePreview fixture={publicProfileCreationGridErrorFixture} />
        </section>
      </div>
    </main>
  );
}
