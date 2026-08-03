"use client";

import { useState } from "react";

import CharacterPreviewView from "@/components/studio/create/character/character-preview/CharacterPreview.view";
import {
  characterPreviewConceptFallbackFixture,
  characterPreviewCustomIdentityFixture,
  characterPreviewDefaultFixture,
  characterPreviewEmptyFixture,
  characterPreviewLongContentFixture,
  characterPreviewMissingCustomValuesFixture,
} from "@/components/studio/create/character/character-preview/CharacterPreview.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: characterPreviewDefaultFixture,
  },
  customIdentity: {
    label: "Custom Identity",
    props: characterPreviewCustomIdentityFixture,
  },
  empty: {
    label: "Empty Draft",
    props: characterPreviewEmptyFixture,
  },
  missingCustomValues: {
    label: "Missing Custom Values",
    props: characterPreviewMissingCustomValuesFixture,
  },
  conceptFallback: {
    label: "Concept Fallback",
    props: characterPreviewConceptFallbackFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterPreviewLongContentFixture,
  },
};

export default function CharacterPreviewPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");

  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Character Preview</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable character-creator preview directly
            from contract-shaped fixtures. It does not load or modify a real
            character draft.
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

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <CharacterPreviewView {...activeState.props} />

          <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain display-ready preview values. Raw builder fields,
              custom-value sentinel rules, validation, step state, APIs, and
              character persistence remain application-owned.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
