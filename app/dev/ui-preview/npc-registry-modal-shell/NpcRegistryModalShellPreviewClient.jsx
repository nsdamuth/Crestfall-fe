"use client";

import { useState } from "react";

import ModalShellView from "@/components/studio/create/npc-registry/modal-shell/ModalShell.view";
import { npcRegistryModalShellFixtures } from "@/components/studio/create/npc-registry/modal-shell/ModalShell.fixtures";

export default function NpcRegistryModalShellPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    npcRegistryModalShellFixtures[0]?.id || "standard"
  );
  const [open, setOpen] = useState(true);

  const fixture =
    npcRegistryModalShellFixtures.find((item) => item.id === fixtureId) ||
    npcRegistryModalShellFixtures[0];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            NPC Registry Modal Shell
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable NPC Registry modal frame directly
            from contract-shaped fixtures. It does not load a registry, mutate
            an NPC entry, call an API, or save data.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-2">
            {npcRegistryModalShellFixtures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFixtureId(item.id);
                  setOpen(true);
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

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
          >
            Open Selected Modal
          </button>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Selected fixture: {fixture?.label || "None"}. Closing the modal
            changes preview-local state only.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures supply only a modal title, child presentation, and close
            intent. Form state, validation, saving, registry mutations, APIs,
            and persistence remain application-owned.
          </p>
        </section>
      </div>

      {open && fixture ? (
        <ModalShellView
          {...fixture.props}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </main>
  );
}
