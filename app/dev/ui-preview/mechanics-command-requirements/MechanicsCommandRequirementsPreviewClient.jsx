"use client";

import { useState } from "react";
import MechanicsCommandRequirements from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements/MechanicsCommandRequirements";
import { mechanicsCommandRequirementsFixtures } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements/mechanicsCommandRequirements.fixtures.js";

export default function MechanicsCommandRequirementsPreviewClient() {
  const [fixtureId, setFixtureId] = useState(mechanicsCommandRequirementsFixtures[1].id);
  const fixture = mechanicsCommandRequirementsFixtures.find((item) => item.id === fixtureId) || mechanicsCommandRequirementsFixtures[0];
  const [requirements, setRequirements] = useState(fixture.requirements);

  function selectFixture(nextId) {
    const next = mechanicsCommandRequirementsFixtures.find((item) => item.id === nextId) || mechanicsCommandRequirementsFixtures[0];
    setFixtureId(next.id);
    setRequirements(next.requirements);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">Development Preview</p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Command Requirements</h1>
        </div>
        <select value={fixtureId} onChange={(event) => selectFixture(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
          {mechanicsCommandRequirementsFixtures.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <MechanicsCommandRequirements
          requirements={requirements}
          commandIndex={0}
          onPatchCommand={(_index, patch) => setRequirements(patch.requirements || [])}
        />
        <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/30 p-5 text-xs text-[var(--muted)]">{JSON.stringify(requirements, null, 2)}</pre>
      </div>
    </main>
  );
}
