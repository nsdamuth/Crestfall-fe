"use client";

import { useState } from "react";

import MechanicsPresetApplicationModalView from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view";
import {
  mechanicsPresetApplicationConflictFixture,
  mechanicsPresetApplicationEmptyFixture,
  mechanicsPresetApplicationSelectedFixture,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/mechanicsPresetApplication.fixtures";

const STATES = {
  selected: mechanicsPresetApplicationSelectedFixture,
  conflict: mechanicsPresetApplicationConflictFixture,
  empty: mechanicsPresetApplicationEmptyFixture,
};

export default function MechanicsPresetApplicationPreviewClient() {
  const [activeKey, setActiveKey] = useState("");
  const [lastAction, setLastAction] = useState("Choose a preview state.");
  const active = activeKey ? STATES[activeKey] : null;

  function record(message) {
    setLastAction(message);
  }

  return (
    <main className="min-h-screen bg-[#080706] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Development UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Preset Application</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Contract-shaped fixture states for the LOOM preset library View.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
            {Object.keys(STATES).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                {key}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>
      </div>

      {active ? (
        <MechanicsPresetApplicationModalView
          {...active}
          onClose={() => {
            record("Close requested.");
            setActiveKey("");
          }}
          onChoosePreset={(id) => record(`Preset ${id} selected.`)}
          onChooseScope={(id) => record(`Scope ${id} selected.`)}
          onChooseCommand={(id) => record(`Command ${id} selected.`)}
          onChooseApplyMode={(id) => record(`Apply mode ${id} selected.`)}
          onApplyPreset={() => record("Apply Preset requested.")}
        />
      ) : null}
    </main>
  );
}
