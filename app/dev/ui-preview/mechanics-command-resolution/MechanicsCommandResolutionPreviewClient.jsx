"use client";

import { useState } from "react";

import MechanicsCommandResolution from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution";
import {
  MECHANICS_COMMAND_RESOLUTION_ARGUMENT_FIXTURES,
  MECHANICS_COMMAND_RESOLUTION_FIXTURES,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/mechanicsCommandResolution.fixtures.js";
import { normalizeMechanicsCommandResolution } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/mechanicsCommandResolutionNormalization.js";

export default function MechanicsCommandResolutionPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    MECHANICS_COMMAND_RESOLUTION_FIXTURES[1].id
  );
  const fixture =
    MECHANICS_COMMAND_RESOLUTION_FIXTURES.find(
      (item) => item.id === fixtureId
    ) || MECHANICS_COMMAND_RESOLUTION_FIXTURES[0];
  const [resolution, setResolution] = useState(() =>
    normalizeMechanicsCommandResolution(fixture.resolution)
  );

  function selectFixture(nextId) {
    const nextFixture =
      MECHANICS_COMMAND_RESOLUTION_FIXTURES.find(
        (item) => item.id === nextId
      ) || MECHANICS_COMMAND_RESOLUTION_FIXTURES[0];

    setFixtureId(nextFixture.id);
    setResolution(
      normalizeMechanicsCommandResolution(nextFixture.resolution)
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/40 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Development Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Command Resolution
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--muted)]">
            Local fixtures exercise automatic, threshold, opposed, legacy, and recoverable resolution shapes. Nothing is fetched or persisted.
          </p>

          <label className="mt-5 block max-w-md text-sm text-[var(--muted)]">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Fixture
            </span>
            <select
              value={fixtureId}
              onChange={(event) => selectFixture(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)]"
            >
              {MECHANICS_COMMAND_RESOLUTION_FIXTURES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6">
          <MechanicsCommandResolution
            resolution={resolution}
            argumentOptions={MECHANICS_COMMAND_RESOLUTION_ARGUMENT_FIXTURES}
            onChange={setResolution}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Normalized Fixture JSON
          </p>
          <pre className="mt-4 max-h-[40rem] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-4 text-xs leading-6 text-[var(--muted)]">
            {JSON.stringify(resolution, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
