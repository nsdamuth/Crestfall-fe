"use client";

import { useState } from "react";

import {
  MechanicsCommandArgumentsSection,
  MechanicsCommandIdentitySection,
  MechanicsCommandInvocationSection,
  MechanicsCommandTriggersSection,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore";
import { listMechanicsCommandCoreFixtures } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/mechanicsCommandCore.fixtures";

const fixtures = listMechanicsCommandCoreFixtures();

export default function MechanicsCommandCorePreviewClient() {
  const [fixtureId, setFixtureId] = useState(fixtures[0]?.id || "");
  const fixture = fixtures.find((item) => item.id === fixtureId) || fixtures[0];
  const [command, setCommand] = useState(fixture?.command || {});

  function selectFixture(nextId) {
    const next = fixtures.find((item) => item.id === nextId) || fixtures[0];
    setFixtureId(next.id);
    setCommand(next.command);
  }

  function patchCommand(_index, patch) {
    setCommand((current) => ({ ...current, ...patch }));
  }

  const shared = {
    command,
    commandIndex: 0,
    commands: [command],
    onPatchCommand: patchCommand,
    onRemoveCommand: () => {},
  };

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            M4A Development Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Command Core</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Local command identity, invocation, argument, presentation, and trigger fixtures only. No production data is loaded or saved.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {fixtures.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFixture(item.id)}
              className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                fixtureId === item.id
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-white/5 text-[var(--muted)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
          {fixture?.description}
        </p>

        <article className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <MechanicsCommandIdentitySection {...shared} />
          <div className="mt-5 rounded-xl border border-[var(--muted-gold)]/20 bg-black/20 p-4">
            <MechanicsCommandInvocationSection {...shared} />
            <MechanicsCommandArgumentsSection {...shared} />
          </div>
          <MechanicsCommandTriggersSection {...shared} />
        </article>

        <pre className="max-h-[36rem] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-5 text-[var(--muted)]">
          {JSON.stringify(command, null, 2)}
        </pre>
      </div>
    </main>
  );
}
