"use client";

import { useState } from "react";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import { studioPageHeaderFixtures } from "@/components/studio/studio-page-header/StudioPageHeader.fixtures";

export default function StudioPageHeaderPreviewClient() {
  const [fixtureId, setFixtureId] = useState(studioPageHeaderFixtures[0].id);
  const fixture =
    studioPageHeaderFixtures.find((item) => item.id === fixtureId) ??
    studioPageHeaderFixtures[0];

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Preview
          </p>
          <h1 className="mt-2 font-display text-3xl">Studio Page Header</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Select a contract-shaped fixture and resize the viewport to verify the
            shared Studio heading and optional action layout.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {studioPageHeaderFixtures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFixtureId(item.id)}
                className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                  item.id === fixture.id
                    ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                    : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-white/25"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-6 sm:p-8">
          <StudioPageHeaderView {...fixture.props} />
        </section>
      </div>
    </main>
  );
}
