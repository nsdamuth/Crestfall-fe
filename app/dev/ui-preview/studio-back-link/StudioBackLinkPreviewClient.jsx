"use client";

import { useState } from "react";
import StudioBackLinkView from "@/components/studio/studio-back-link/StudioBackLink.view";
import { studioBackLinkFixtures } from "@/components/studio/studio-back-link/StudioBackLink.fixtures";

export default function StudioBackLinkPreviewClient() {
  const [fixtureId, setFixtureId] = useState(studioBackLinkFixtures[0].id);
  const fixture =
    studioBackLinkFixtures.find((item) => item.id === fixtureId) ??
    studioBackLinkFixtures[0];

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Preview
          </p>
          <h1 className="mt-2 font-display text-3xl">Studio Back Link</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Select a contract-shaped fixture and resize the viewport to verify
            the shared Studio return-navigation control. Preview destinations
            use local hash links only.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {studioBackLinkFixtures.map((item) => (
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
          <StudioBackLinkView {...fixture.props} />
        </section>

        <div
          id="studio-root"
          className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-[var(--muted)]"
        >
          Hash-link target used by the preview fixtures.
        </div>
      </div>
    </main>
  );
}
