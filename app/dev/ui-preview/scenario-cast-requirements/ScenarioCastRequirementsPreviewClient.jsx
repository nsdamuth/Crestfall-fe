"use client";

import { useState } from "react";

import ScenarioCastRequirementsSectionView from "@/components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section/ScenarioCastRequirementsSection.view";
import {
  scenarioCastRequirementsDefaultFixture,
  scenarioCastRequirementsEmptyFixture,
  scenarioCastRequirementsErrorFixture,
} from "@/components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section/ScenarioCastRequirementsSection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Selected References",
    props: scenarioCastRequirementsDefaultFixture,
  },
  empty: {
    label: "Empty",
    props: scenarioCastRequirementsEmptyFixture,
  },
  error: {
    label: "Load Error",
    props: scenarioCastRequirementsErrorFixture,
  },
};

export default function ScenarioCastRequirementsPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState({
    ...scenarioCastRequirementsDefaultFixture,
    fields: scenarioCastRequirementsDefaultFixture.fields.map((field) => ({
      ...field,
      selectedItems: [...field.selectedItems],
    })),
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or interact with a reference field."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({
      ...nextState.props,
      fields: nextState.props.fields.map((field) => ({
        ...field,
        selectedItems: [...field.selectedItems],
      })),
    });
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  const interactiveFields = viewProps.fields.map((field) => ({
    ...field,
    onOpen: () => setLastAction(`Open intent emitted for ${field.label}.`),
    onRemove: (referenceId) => {
      setViewProps((current) => ({
        ...current,
        fields: current.fields.map((currentField) =>
          currentField.id === field.id
            ? {
                ...currentField,
                selectedItems: currentField.selectedItems.filter(
                  (item) => item.id !== referenceId
                ),
              }
            : currentField
        ),
      }));
      setLastAction(`Remove intent emitted for ${field.label}.`);
    },
  }));

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Scenario Cast Requirements
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable section View directly. It does not
            load owner creations, open the application picker, update Scenario
            fields, or rebuild registry binding state.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-8">
          <ScenarioCastRequirementsSectionView
            {...viewProps}
            fields={interactiveFields}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready selector labels, selected chips,
            errors, and semantic callbacks. Creation loading, type filtering,
            Scenario storage fields, picker ownership, and registry binding
            updates remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
