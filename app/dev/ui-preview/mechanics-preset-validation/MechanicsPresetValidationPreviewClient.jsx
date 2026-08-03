"use client";

import { useState } from "react";

import MechanicsPresetValidationPanelView from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/MechanicsPresetValidationPanel.view";
import {
  mechanicsPresetValidationDomainFixture,
  mechanicsPresetValidationReferenceFixture,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/mechanicsPresetValidationPanel.fixtures";

const STATES = {
  reference: mechanicsPresetValidationReferenceFixture,
  domain: mechanicsPresetValidationDomainFixture,
};

export default function MechanicsPresetValidationPreviewClient() {
  const [activeKey, setActiveKey] = useState("reference");
  const [lastAction, setLastAction] = useState("Reference fixture loaded.");
  const active = STATES[activeKey];

  return (
    <main className="min-h-screen bg-[#080706] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Development UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Preset Live Validation
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Contract-shaped LOOM fixtures for the transient post-apply validation guide.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
            {Object.keys(STATES).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveKey(key);
                  setLastAction(`${key} fixture loaded.`);
                }}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                {key}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>

        <MechanicsPresetValidationPanelView
          {...active}
          onCopyTestCommand={() => setLastAction("Copy requested.")}
          onDismiss={() => setLastAction("Dismiss requested.")}
        />
      </div>
    </main>
  );
}
