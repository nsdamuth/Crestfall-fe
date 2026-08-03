"use client";

import { useState } from "react";

import MechanicsTrackersSection from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/MechanicsTrackersSection";
import { listMechanicsTrackerFixtures } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/mechanicsTrackers.fixtures";

const fixtures = listMechanicsTrackerFixtures();

export default function MechanicsTrackersPreviewClient() {
  const [fixtureId, setFixtureId] = useState(fixtures[1]?.id || fixtures[0]?.id || "");
  const fixture = fixtures.find((item) => item.id === fixtureId) || fixtures[0];
  const [trackers, setTrackers] = useState(fixture?.trackers || []);

  function selectFixture(nextId) {
    const next = fixtures.find((item) => item.id === nextId) || fixtures[0];
    setFixtureId(next.id);
    setTrackers(next.trackers);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">M2 Development Preview</p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Trackers</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Local fixtures only. Changes remain in this preview and are never persisted.
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
        <MechanicsTrackersSection trackers={trackers} onChange={setTrackers} />
        <pre className="max-h-[34rem] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-5 text-[var(--muted)]">
          {JSON.stringify(trackers, null, 2)}
        </pre>
      </div>
    </main>
  );
}
