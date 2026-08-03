"use client";

import { useState } from "react";

import StudioCharacterCardView from "@/components/studio/studio-character-card/StudioCharacterCard.view";
import {
  studioCharacterCardDefaultFixture,
  studioCharacterCardFallbackCopyFixture,
  studioCharacterCardLongContentFixture,
  studioCharacterCardNoEyebrowFixture,
  studioCharacterCardNoImageFixture,
} from "@/components/studio/studio-character-card/StudioCharacterCard.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: studioCharacterCardDefaultFixture,
  },
  noImage: {
    label: "No Image",
    props: studioCharacterCardNoImageFixture,
  },
  noEyebrow: {
    label: "No Eyebrow",
    props: studioCharacterCardNoEyebrowFixture,
  },
  fallbackCopy: {
    label: "Fallback Copy",
    props: studioCharacterCardFallbackCopyFixture,
  },
  longContent: {
    label: "Long Content",
    props: studioCharacterCardLongContentFixture,
  },
};

export default function StudioCharacterCardPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");

  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Studio Character Card</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable official-character card directly
            from contract-shaped fixtures. Details targets a preview hash, and
            the future Start action remains disabled.
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

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StudioCharacterCardView {...activeState.props} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready image, identity, summary, and route
            values. Raw character records, asset-path construction, search,
            pagination, session startup, API requests, and persistence remain
            application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
