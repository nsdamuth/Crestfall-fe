"use client";

import { useState } from "react";

import MechanicsCompositionBuilderView from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view";
import MechanicsProgressionProfileFields from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields";
import {
  mechanicsCompositionConfiguredFixture,
  mechanicsCompositionEmptyFixture,
  mechanicsCompositionWarningFixture,
} from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/mechanicsCompositionBuilder.fixtures";

const PREVIEW_STATES = {
  empty: {
    label: "Empty",
    props: mechanicsCompositionEmptyFixture,
  },
  configured: {
    label: "Configured",
    props: mechanicsCompositionConfiguredFixture,
  },
  warnings: {
    label: "Warnings",
    props: mechanicsCompositionWarningFixture,
  },
};

export default function MechanicsCompositionBuilderPreviewClient() {
  const [stateKey, setStateKey] = useState("configured");
  const [lastAction, setLastAction] = useState("No preview action yet.");
  const state = PREVIEW_STATES[stateKey];

  function recordAction(message) {
    setLastAction(message);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Preview
          </p>
          <h1 className="mt-2 font-display text-5xl">
            Mechanics Composition Builder
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            LOOM preview for ordered Mechanics steps, conditions, continuation policies, dependencies, and isolated domain-action composition.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([key, preview]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStateKey(key)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  key === stateKey
                    ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {preview.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>

        <MechanicsCompositionBuilderView
          {...state.props}
          ProgressionProfileFieldsComponent={MechanicsProgressionProfileFields}
          onChooseReference={(value) => recordAction(`Reference ${value || "cleared"} selected.`)}
          onApplyReference={() => recordAction("Reference composition requested.")}
          onAddMechanicsStep={(phase) => recordAction(`${phase} Mechanics step requested.`)}
          onPatchMechanicsStep={(stepId) => recordAction(`Mechanics step ${stepId} changed.`)}
          onRemoveMechanicsStep={(stepId) => recordAction(`Mechanics step ${stepId} removed.`)}
          onMoveMechanicsStep={(stepId, direction) => recordAction(`Mechanics step ${stepId} moved ${direction}.`)}
          onToggleMechanicsDependency={(stepId, dependencyId) => recordAction(`${stepId} dependency ${dependencyId} toggled.`)}
          onToggleMechanicsOutcome={(stepId, outcome) => recordAction(`${stepId} outcome ${outcome} toggled.`)}
          onAddCondition={(stepId) => recordAction(`Condition requested for ${stepId}.`)}
          onPatchCondition={(stepId, conditionId) => recordAction(`Condition ${conditionId} changed on ${stepId}.`)}
          onRemoveCondition={(stepId, conditionId) => recordAction(`Condition ${conditionId} removed from ${stepId}.`)}
          onAddEffect={(stepId) => recordAction(`Effect requested for ${stepId}.`)}
          onPatchEffect={(stepId, effectId) => recordAction(`Effect ${effectId} changed on ${stepId}.`)}
          onRemoveEffect={(stepId, effectId) => recordAction(`Effect ${effectId} removed from ${stepId}.`)}
          onAddDomainStep={() => recordAction("Domain step requested.")}
          onPatchDomainStep={(stepId) => recordAction(`Domain step ${stepId} changed.`)}
          onRemoveDomainStep={(stepId) => recordAction(`Domain step ${stepId} removed.`)}
          onMoveDomainStep={(stepId, direction) => recordAction(`Domain step ${stepId} moved ${direction}.`)}
          onToggleDomainDependency={(stepId, dependencyId) => recordAction(`${stepId} dependency ${dependencyId} toggled.`)}
          onToggleDomainOutcome={(stepId, outcome) => recordAction(`${stepId} outcome ${outcome} toggled.`)}
        />
      </div>
    </main>
  );
}
