"use client";

import { useState } from "react";

import MechanicsModulePickerModalView from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker/MechanicsModulePickerModal.view";
import {
  mechanicsModulePickerEmptyFixture,
  mechanicsModulePickerErrorFixture,
  mechanicsModulePickerLoadingFixture,
  mechanicsModulePickerLongContentFixture,
  mechanicsModulePickerMineFixture,
  mechanicsModulePickerPublicFixture,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker/MechanicsModulePickerModal.fixtures";

const PREVIEW_STATES = {
  mine: {
    label: "My Mechanics",
    props: mechanicsModulePickerMineFixture,
  },
  public: {
    label: "Public Mechanics",
    props: mechanicsModulePickerPublicFixture,
  },
  loading: {
    label: "Loading",
    props: mechanicsModulePickerLoadingFixture,
  },
  empty: {
    label: "Empty",
    props: mechanicsModulePickerEmptyFixture,
  },
  error: {
    label: "Load Error",
    props: mechanicsModulePickerErrorFixture,
  },
  longContent: {
    label: "Long Content",
    props: mechanicsModulePickerLongContentFixture,
  },
};

export default function MechanicsModulePickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Mechanics Module is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setLastAction("Modal closed. No runtime binding was changed.");
  }

  function chooseModule(moduleId) {
    setLastAction(
      `Module ${moduleId || "unknown"} selected. This was fixture-only and was not attached or saved.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Module Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not load owned or public creations, attach a module, update a
            runtime binding, or save application data.
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
                onClick={() => openState(stateKey)}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures provide display-ready module cards only. Raw creation
            records, excluded binding IDs, API loading, and attachment callback
            routing remain outside the View.
          </p>
        </section>
      </div>

      {activeState ? (
        <MechanicsModulePickerModalView
          key={activeStateKey}
          {...activeState.props}
          onClose={closePreview}
          onChooseModule={chooseModule}
        />
      ) : null}
    </main>
  );
}
