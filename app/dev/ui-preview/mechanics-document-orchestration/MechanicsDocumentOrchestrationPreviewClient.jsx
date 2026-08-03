"use client";

import { useState } from "react";

import {
  MechanicsDocumentOrchestrationControls,
  MechanicsDocumentOrchestrationSurfaces,
  useMechanicsDocumentOrchestrationViewModel,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/MechanicsDocumentOrchestration";
import { MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/mechanicsDocumentOrchestration.fixtures.js";
import { normalizeMechanicsDocument } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentNormalization.js";

export default function MechanicsDocumentOrchestrationPreviewClient() {
  const [fixtureId, setFixtureId] = useState("AVAILABLE");
  const fixture =
    MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES.find(
      (item) => item.id === fixtureId
    ) || MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES[0];
  const [mechanicsData, setMechanicsData] = useState(fixture.mechanicsData);
  const [replacementCount, setReplacementCount] = useState(0);

  function selectFixture(nextId) {
    const next = MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES.find(
      (item) => item.id === nextId
    );
    setFixtureId(nextId);
    setMechanicsData(next?.mechanicsData || {});
    setReplacementCount(0);
  }

  function replaceMechanicsData(nextData) {
    setMechanicsData(normalizeMechanicsDocument(nextData));
    setReplacementCount((current) => current + 1);
    return true;
  }

  const orchestration = useMechanicsDocumentOrchestrationViewModel({
    mechanicsData,
    canReplaceData: fixture.canReplaceData,
    onReplaceMechanicsData: replaceMechanicsData,
  });

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            M8 Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Document Orchestration
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Atomic replacement calls: {replacementCount}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {MECHANICS_DOCUMENT_ORCHESTRATION_FIXTURES.map((item) => (
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
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <MechanicsDocumentOrchestrationControls
              {...orchestration.controlsProps}
            />
          </div>
        </section>

        <MechanicsDocumentOrchestrationSurfaces
          {...orchestration.surfacesProps}
        />

        <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-6 text-[var(--muted)]">
          {JSON.stringify(mechanicsData, null, 2)}
        </pre>
      </div>
    </main>
  );
}
