"use client";

import { useState } from "react";

import MechanicsProgressionProfileFields from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields";
import { listMechanicsProgressionProfileFixtures } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.fixtures";

const fixtures = listMechanicsProgressionProfileFixtures();

export default function MechanicsProgressionProfilePreviewClient() {
  const [fixtureId, setFixtureId] = useState(fixtures[0]?.id || "");
  const fixture = fixtures.find((item) => item.id === fixtureId) || fixtures[0];
  const [profile, setProfile] = useState(fixture?.profile || {});

  function selectFixture(nextId) {
    const next = fixtures.find((item) => item.id === nextId) || fixtures[0];
    setFixtureId(next.id);
    setProfile(next.profile);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            M3 Development Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Progression Profile
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Local effect-level fixtures only. Changes remain in this preview and are never persisted.
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

        <MechanicsProgressionProfileFields
          profile={profile}
          onChange={setProfile}
        />

        <pre className="max-h-[38rem] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-5 text-[var(--muted)]">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </main>
  );
}
