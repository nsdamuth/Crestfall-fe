"use client";

import { useState } from "react";

import ModalActionsView from "@/components/studio/create/npc-registry/modal-actions/ModalActions.view";
import { npcRegistryModalActionsFixtures } from "@/components/studio/create/npc-registry/modal-actions/ModalActions.fixtures";

export default function NpcRegistryModalActionsPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    npcRegistryModalActionsFixtures[0]?.id || "save-entry"
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const fixture =
    npcRegistryModalActionsFixtures.find((item) => item.id === fixtureId) ||
    npcRegistryModalActionsFixtures[0];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            NPC Registry Modal Actions
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable NPC Registry action row directly
            from contract-shaped fixtures. It does not validate a form, mutate
            a registry, call an API, or save data.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-2">
            {npcRegistryModalActionsFixtures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFixtureId(item.id);
                  setFeedback("No preview action yet.");
                }}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                  fixtureId === item.id
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                    : "border-white/10 bg-black/30 text-[var(--muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Portable Action Row
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-[#080706] p-5">
            <ModalActionsView
              {...fixture.props}
              onClose={
                fixture.id === "missing-actions"
                  ? null
                  : () => setFeedback("Cancel intent received locally.")
              }
              onSave={
                fixture.id === "missing-actions"
                  ? null
                  : () =>
                      setFeedback(
                        `${fixture.props.saveLabel || "Primary action"} intent received locally.`
                      )
              }
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {feedback}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures supply only the primary-action label and Cancel/Save
            intent. Form state, validation, save eligibility, registry
            mutations, APIs, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
