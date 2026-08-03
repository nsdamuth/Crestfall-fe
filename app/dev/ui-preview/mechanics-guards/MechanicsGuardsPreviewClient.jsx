"use client";

import { useState } from "react";

import MechanicsGuards from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards";
import { MECHANICS_GUARD_FIXTURES } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/mechanicsGuards.fixtures.js";

export default function MechanicsGuardsPreviewClient() {
  const [fixtureId, setFixtureId] = useState("CURRENT");
  const fixture =
    MECHANICS_GUARD_FIXTURES.find((item) => item.id === fixtureId) ||
    MECHANICS_GUARD_FIXTURES[0];
  const [guards, setGuards] = useState(fixture.guards);
  const [foldSignal, setFoldSignal] = useState({ revision: 0, expanded: true });

  function selectFixture(nextId) {
    const next = MECHANICS_GUARD_FIXTURES.find((item) => item.id === nextId);
    setFixtureId(nextId);
    setGuards(next?.guards || []);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            M7C Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Guards</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {MECHANICS_GUARD_FIXTURES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectFixture(item.id)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                  item.id === fixtureId
                    ? "border-[var(--muted-gold)]/50 text-[var(--muted-gold)]"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                setFoldSignal((current) => ({
                  revision: current.revision + 1,
                  expanded: !current.expanded,
                }))
              }
              className="rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              Toggle All
            </button>
          </div>
        </div>

        <MechanicsGuards
          guards={guards}
          onChange={setGuards}
          foldSignal={foldSignal}
        />

        <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-6 text-[var(--muted)]">
          {JSON.stringify(guards, null, 2)}
        </pre>
      </div>
    </main>
  );
}
