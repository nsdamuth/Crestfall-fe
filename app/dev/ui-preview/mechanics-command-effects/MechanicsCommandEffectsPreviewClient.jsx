"use client";

import { useMemo, useState } from "react";

import MechanicsCommandEffects from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffects";
import { MECHANICS_COMMAND_EFFECTS_FIXTURES } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/mechanicsCommandEffects.fixtures.js";
import {
  getMechanicsEffectNumericArgumentOptions,
  getMechanicsEffectTargetArgumentOptions,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/mechanicsCommandEffectsNormalization.js";

export default function MechanicsCommandEffectsPreviewClient() {
  const [fixtureId, setFixtureId] = useState(MECHANICS_COMMAND_EFFECTS_FIXTURES[0].id);
  const fixture = useMemo(
    () => MECHANICS_COMMAND_EFFECTS_FIXTURES.find((item) => item.id === fixtureId) || MECHANICS_COMMAND_EFFECTS_FIXTURES[0],
    [fixtureId]
  );
  const [effects, setEffects] = useState(fixture.effects);

  function chooseFixture(nextId) {
    const next = MECHANICS_COMMAND_EFFECTS_FIXTURES.find((item) => item.id === nextId) || MECHANICS_COMMAND_EFFECTS_FIXTURES[0];
    setFixtureId(next.id);
    setEffects(next.effects);
  }

  const targetOptions = getMechanicsEffectTargetArgumentOptions(fixture.invocation);
  const numericOptions = getMechanicsEffectNumericArgumentOptions(fixture.invocation);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">M5B Preview</p>
          <h1 className="mt-2 font-display text-4xl">Command Effects, Values, and Targets</h1>
        </div>
        <select value={fixtureId} onChange={(event) => chooseFixture(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
          {MECHANICS_COMMAND_EFFECTS_FIXTURES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <MechanicsCommandEffects variant="BASE" effects={effects} onChange={setEffects} argumentOptions={targetOptions} numericArgumentOptions={numericOptions} />
        <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/30 p-5 text-xs text-[var(--muted)]">{JSON.stringify(effects, null, 2)}</pre>
      </div>
    </main>
  );
}
