"use client";

import { useEffect, useState } from "react";

import ScenarioMiddlewareSectionView from "@/components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section/ScenarioMiddlewareSection.view";
import {
  scenarioMiddlewareAllDisabledFixture,
  scenarioMiddlewareAllEnabledFixture,
  scenarioMiddlewareCustomConfigurationFixture,
  scenarioMiddlewareDefaultsFixture,
  scenarioMiddlewareLongCopyFixture,
  scenarioMiddlewareMissingCallbacksFixture,
} from "@/components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section/ScenarioMiddlewareSection.fixtures";

const PREVIEW_STATES = {
  defaults: { label: "Defaults", props: scenarioMiddlewareDefaultsFixture },
  custom: {
    label: "Custom",
    props: scenarioMiddlewareCustomConfigurationFixture,
  },
  allEnabled: {
    label: "All Enabled",
    props: scenarioMiddlewareAllEnabledFixture,
  },
  allDisabled: {
    label: "All Disabled",
    props: scenarioMiddlewareAllDisabledFixture,
  },
  longCopy: { label: "Long Copy", props: scenarioMiddlewareLongCopyFixture },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: scenarioMiddlewareMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    modules: fixture.modules.map((module) => ({ ...module })),
  };
}

export default function ScenarioMiddlewareSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("defaults");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.defaults.props)
  );
  const [feedback, setFeedback] = useState("No preview toggle yet.");
  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview toggle yet.");
  }, [activeState]);

  const interactiveModules = viewProps.modules.map((module) => ({
    ...module,
    onToggle: callbacksEnabled
      ? () => {
          setViewProps((current) => ({
            ...current,
            modules: current.modules.map((candidate) =>
              candidate.id === module.id
                ? { ...candidate, isEnabled: !candidate.isEnabled }
                : candidate
            ),
          }));
          setFeedback(`${module.title} toggled.`);
        }
      : null,
  }));

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Scenario Middleware Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable middleware-selection View directly
            without loading or mutating a Scenario creation.
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
                onClick={() => setActiveStateKey(stateKey)}
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
            {feedback}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
          <ScenarioMiddlewareSectionView
            {...viewProps}
            modules={interactiveModules}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready module cards and semantic toggles.
            Scenario storage mapping, default resolution, object merging, and
            persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
