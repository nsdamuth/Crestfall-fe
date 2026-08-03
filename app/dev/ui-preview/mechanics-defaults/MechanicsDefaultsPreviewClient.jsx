"use client";

import { useState } from "react";

import MechanicsDefaults from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/MechanicsDefaults";
import { MECHANICS_DEFAULTS_FIXTURES } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/mechanicsDefaults.fixtures";
import { normalizeMechanicsDefaults } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/mechanicsDefaultsNormalization";

export default function MechanicsDefaultsPreviewClient() {
  const [fixtureId, setFixtureId] = useState(MECHANICS_DEFAULTS_FIXTURES[1].id);
  const fixture =
    MECHANICS_DEFAULTS_FIXTURES.find((item) => item.id === fixtureId) ||
    MECHANICS_DEFAULTS_FIXTURES[0];
  const [defaults, setDefaults] = useState(() =>
    normalizeMechanicsDefaults(fixture.defaults)
  );

  function selectFixture(nextId) {
    const nextFixture =
      MECHANICS_DEFAULTS_FIXTURES.find((item) => item.id === nextId) ||
      MECHANICS_DEFAULTS_FIXTURES[0];
    setFixtureId(nextId);
    setDefaults(normalizeMechanicsDefaults(nextFixture.defaults));
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Defaults</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Local fixtures only. Nothing is fetched or persisted.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {MECHANICS_DEFAULTS_FIXTURES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFixture(item.id)}
              className={`rounded-xl border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                item.id === fixtureId
                  ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]"
                  : "border-white/10 bg-black/20 text-[var(--muted)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <MechanicsDefaults defaults={defaults} onChange={setDefaults} />

        <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/30 p-5 text-xs leading-6 text-[var(--muted)]">
          {JSON.stringify(defaults, null, 2)}
        </pre>
      </div>
    </main>
  );
}
