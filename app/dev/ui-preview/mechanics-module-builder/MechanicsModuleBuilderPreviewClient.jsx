"use client";

import { useState } from "react";

import MechanicsModuleBuilderView from "@/components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.view";
import {
  mechanicsModuleBuilderCustomContractFixture,
  mechanicsModuleBuilderDefaultFixture,
  mechanicsModuleBuilderEmptyFixture,
  mechanicsModuleBuilderErrorFixture,
  mechanicsModuleBuilderSavedFixture,
  mechanicsModuleBuilderSavingFixture,
} from "@/components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.fixtures";

const PREVIEW_STATES = {
  default: { label: "Default", props: mechanicsModuleBuilderDefaultFixture },
  empty: { label: "Empty", props: mechanicsModuleBuilderEmptyFixture },
  custom: {
    label: "Custom contract",
    props: mechanicsModuleBuilderCustomContractFixture,
  },
  saving: { label: "Saving", props: mechanicsModuleBuilderSavingFixture },
  saved: { label: "Saved", props: mechanicsModuleBuilderSavedFixture },
  error: { label: "Error", props: mechanicsModuleBuilderErrorFixture },
};

function FixtureRuntimeFields() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Meters", "2 tracker definitions"],
        ["Commands", "3 matched commands"],
        ["Status", "1 response readout"],
        ["Guards", "2 conditional rules"],
      ].map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-white/10 bg-black/25 p-4"
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            {label}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default function MechanicsModuleBuilderPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState({
    ...mechanicsModuleBuilderDefaultFixture,
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit preview-local mechanics identity fields."
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
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Module Builder
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable builder frame directly. The live
            mechanics fields editor, creation persistence, preset application,
            and navigation remain disconnected.
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

        <MechanicsModuleBuilderView
          {...viewProps}
          runtimeFieldsContent={<FixtureRuntimeFields />}
          onUpdateField={updateField}
          onSave={() => setLastAction("Requested a preview-local draft save.")}
        />
      </div>
    </main>
  );
}
