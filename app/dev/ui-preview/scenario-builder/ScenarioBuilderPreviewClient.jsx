"use client";

import { useState } from "react";

import ScenarioBuilderView from "@/components/studio/create/scenario/scenario-builder/ScenarioBuilder.view";
import {
  scenarioBuilderConfiguredFixture,
  scenarioBuilderEmptyFixture,
  scenarioBuilderErrorFixture,
  scenarioBuilderReferenceErrorFixture,
  scenarioBuilderSavedFixture,
  scenarioBuilderSavingFixture,
} from "@/components/studio/create/scenario/scenario-builder/ScenarioBuilder.fixtures";

const PREVIEW_STATES = {
  configured: { label: "Configured", props: scenarioBuilderConfiguredFixture },
  empty: { label: "Empty", props: scenarioBuilderEmptyFixture },
  references: { label: "Reference Error", props: scenarioBuilderReferenceErrorFixture },
  saving: { label: "Saving", props: scenarioBuilderSavingFixture },
  saved: { label: "Saved", props: scenarioBuilderSavedFixture },
  error: { label: "Error", props: scenarioBuilderErrorFixture },
};

export default function ScenarioBuilderPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("configured");
  const [viewProps, setViewProps] = useState({
    ...scenarioBuilderConfiguredFixture,
    form: { ...scenarioBuilderConfiguredFixture.form },
    circle: { ...scenarioBuilderConfiguredFixture.circle },
    enabledModules: { ...scenarioBuilderConfiguredFixture.enabledModules },
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit preview-local Scenario fields."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];
    setActiveStateKey(stateKey);
    setViewProps({
      ...state.props,
      form: { ...state.props.form },
      circle: { ...state.props.circle },
      enabledModules: { ...state.props.enabledModules },
    });
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateField(field, value) {
    setViewProps((current) => ({
      ...current,
      form: { ...current.form, [field]: value },
    }));
    setLastAction(`Updated ${field} in preview-local state.`);
  }

  function updateCircle(stepId, value) {
    setViewProps((current) => ({
      ...current,
      circle: { ...current.circle, [stepId]: value },
    }));
    setLastAction(`Updated story-circle step ${stepId}.`);
  }

  function toggleModule(moduleId) {
    setViewProps((current) => ({
      ...current,
      enabledModules: {
        ...current.enabledModules,
        [moduleId]: !current.enabledModules[moduleId],
      },
    }));
    setLastAction(`Toggled ${moduleId} in preview-local state.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Scenario Builder</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Scenario Builder View directly.
            Creation loading, picker orchestration, persistence, and navigation
            are represented only by preview-local callbacks.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
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
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>

        <ScenarioBuilderView
          {...viewProps}
          onUpdateField={updateField}
          onUpdateCircle={updateCircle}
          onToggleModule={toggleModule}
          onSave={() => setLastAction("Requested a preview-local draft save.")}
        />
      </div>
    </main>
  );
}
