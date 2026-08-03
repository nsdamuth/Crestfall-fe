"use client";

import { useState } from "react";

import MechanicsJsonEditorModalView from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/MechanicsJsonEditorModal.view";
import {
  mechanicsJsonEditorBaseFixture,
  mechanicsJsonEditorErrorFixture,
  mechanicsJsonEditorWarningFixture,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/mechanicsJsonEditor.fixtures";

const PREVIEW_STATES = {
  valid: {
    label: "Valid JSON",
    props: mechanicsJsonEditorBaseFixture,
  },
  errors: {
    label: "Compliance Errors",
    props: mechanicsJsonEditorErrorFixture,
  },
  warnings: {
    label: "Normalization Notices",
    props: mechanicsJsonEditorWarningFixture,
  },
};

export default function MechanicsJsonEditorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("valid");
  const [open, setOpen] = useState(false);
  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)]">
      <div className="mx-auto grid max-w-5xl gap-6">
        <header>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Development Preview
          </p>
          <h1 className="mt-2 font-display text-5xl">
            Mechanics JSON Editor
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Contract-shaped fixtures verify the portable modal View without
            creation persistence or API behavior.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Preview States
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(
              ([stateKey, state]) => (
                <button
                  key={stateKey}
                  type="button"
                  onClick={() => {
                    setActiveStateKey(stateKey);
                    setOpen(true);
                  }}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                >
                  {state.label}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]"
          >
            Open {activeState.label}
          </button>
        </section>
      </div>

      {open ? (
        <MechanicsJsonEditorModalView
          {...activeState.props}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </main>
  );
}
