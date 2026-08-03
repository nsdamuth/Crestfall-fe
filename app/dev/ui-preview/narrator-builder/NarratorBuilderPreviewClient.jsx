"use client";

import { useState } from "react";

import NarratorBuilderView from "@/components/studio/create/narrator/narrator-builder/NarratorBuilder.view";
import {
  narratorBuilderDefaultFixture,
  narratorBuilderEmptyFixture,
  narratorBuilderEnsembleFixture,
  narratorBuilderErrorFixture,
  narratorBuilderSavedFixture,
  narratorBuilderSavingFixture,
} from "@/components/studio/create/narrator/narrator-builder/NarratorBuilder.fixtures";

const PREVIEW_STATES = {
  default: { label: "Default", props: narratorBuilderDefaultFixture },
  empty: { label: "Empty", props: narratorBuilderEmptyFixture },
  ensemble: { label: "Ensemble", props: narratorBuilderEnsembleFixture },
  saving: { label: "Saving", props: narratorBuilderSavingFixture },
  saved: { label: "Saved", props: narratorBuilderSavedFixture },
  error: { label: "Error", props: narratorBuilderErrorFixture },
};

export default function NarratorBuilderPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState({
    ...narratorBuilderDefaultFixture,
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit preview-local narrator fields."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...state.props });
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateField(field, value) {
    setViewProps((current) => ({
      ...current,
      [field]: value,
    }));
    setLastAction(`Updated ${field} in preview-local state.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Narrator Builder</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Narrator Builder View directly.
            Creation persistence and navigation are represented only by
            preview-local callbacks.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
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
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>

        <NarratorBuilderView
          {...viewProps}
          onUpdateField={updateField}
          onSave={() => setLastAction("Requested a preview-local draft save.")}
        />
      </div>
    </main>
  );
}
