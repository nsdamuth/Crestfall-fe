"use client";

import { useState } from "react";

import MechanicsCommandOutcomes from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes/MechanicsCommandOutcomes";
import { MECHANICS_COMMAND_OUTCOME_FIXTURES } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes/mechanicsCommandOutcomes.fixtures";

function PreviewEffectCard({ effect, outcome, onPatch, onRemove }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
          {outcome.replaceAll("_", " ")} Effect
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs uppercase tracking-[0.14em] text-red-200"
        >
          Remove
        </button>
      </div>
      <input
        value={effect.id || ""}
        onChange={(event) => onPatch({ id: event.target.value })}
        className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-[var(--foreground)]"
      />
      <pre className="mt-3 overflow-auto text-xs text-[var(--muted)]">
        {JSON.stringify(effect, null, 2)}
      </pre>
    </div>
  );
}

export default function MechanicsCommandOutcomesPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    MECHANICS_COMMAND_OUTCOME_FIXTURES[0].id
  );
  const fixture = MECHANICS_COMMAND_OUTCOME_FIXTURES.find(
    (item) => item.id === fixtureId
  );
  const [command, setCommand] = useState({ outcomes: fixture.outcomes });

  function selectFixture(nextId) {
    const next = MECHANICS_COMMAND_OUTCOME_FIXTURES.find(
      (item) => item.id === nextId
    );
    setFixtureId(nextId);
    setCommand({ outcomes: next.outcomes });
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Development Preview
        </p>
        <h1 className="mt-2 font-display text-4xl">Mechanics Command Outcomes</h1>
        <select
          value={fixtureId}
          onChange={(event) => selectFixture(event.target.value)}
          className="mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3"
        >
          {MECHANICS_COMMAND_OUTCOME_FIXTURES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <MechanicsCommandOutcomes
            outcomes={command.outcomes}
            commandIndex={0}
            onPatchCommand={(_index, patch) =>
              setCommand((current) => ({ ...current, ...patch }))
            }
            normalizeEffect={(effect) => ({ ...effect })}
            EffectCardComponent={PreviewEffectCard}
            argumentOptions={[]}
            numericArgumentOptions={[]}
          />
        </div>
      </div>
    </main>
  );
}
