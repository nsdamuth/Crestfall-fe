"use client";

import { useMemo, useState } from "react";

import MechanicsCommandDomainActions from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions";
import { listMechanicsCommandDomainActionFixtures } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/mechanicsCommandDomainActions.fixtures.js";
import { normalizeMechanicsCommandDomainAction } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/mechanicsCommandDomainActionsNormalization.js";

export default function MechanicsCommandDomainActionsPreviewClient() {
  const fixtures = useMemo(() => listMechanicsCommandDomainActionFixtures(), []);
  const [fixtureId, setFixtureId] = useState(fixtures[0].id);
  const selected = fixtures.find((fixture) => fixture.id === fixtureId) || fixtures[0];
  const [domainAction, setDomainAction] = useState(() =>
    normalizeMechanicsCommandDomainAction(selected.domainAction)
  );

  function selectFixture(nextId) {
    const next = fixtures.find((fixture) => fixture.id === nextId) || fixtures[0];
    setFixtureId(next.id);
    setDomainAction(normalizeMechanicsCommandDomainAction(next.domainAction));
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Development Preview · M5C
          </p>
          <h1 className="mt-2 font-display text-4xl">Mechanics Command Domain Actions</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Fixture-only authoring for Item, participant-condition, Location transition, and active-journey domain adapters. Nothing is fetched or persisted.
          </p>
        </header>

        <label className="grid max-w-xl gap-2 text-sm text-[var(--muted)]">
          <span>Fixture</span>
          <select
            value={fixtureId}
            onChange={(event) => selectFixture(event.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)]"
          >
            {fixtures.map((fixture) => (
              <option key={fixture.id} value={fixture.id}>
                {fixture.label}
              </option>
            ))}
          </select>
        </label>

        <MechanicsCommandDomainActions
          domainAction={domainAction}
          invocation={selected.invocation}
          onChange={setDomainAction}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Canonical Domain Action
          </p>
          <pre className="mt-4 max-h-[32rem] overflow-auto rounded-xl bg-black/40 p-4 text-xs leading-6 text-[var(--muted)]">
            {JSON.stringify(domainAction, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
