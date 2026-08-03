"use client";

import { useEffect, useState } from "react";

import ScenarioStoryCircleSectionView from "@/components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section/ScenarioStoryCircleSection.view";
import {
  scenarioStoryCircleCompleteFixture,
  scenarioStoryCircleCustomCopyFixture,
  scenarioStoryCircleEmptyFixture,
  scenarioStoryCircleLongContentFixture,
  scenarioStoryCircleMissingCallbacksFixture,
  scenarioStoryCirclePartialFixture,
} from "@/components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section/ScenarioStoryCircleSection.fixtures";

const PREVIEW_STATES = {
  complete: { label: "Complete", props: scenarioStoryCircleCompleteFixture },
  empty: { label: "Empty", props: scenarioStoryCircleEmptyFixture },
  partial: { label: "Partial", props: scenarioStoryCirclePartialFixture },
  longContent: {
    label: "Long Content",
    props: scenarioStoryCircleLongContentFixture,
  },
  customCopy: {
    label: "Custom Copy",
    props: scenarioStoryCircleCustomCopyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: scenarioStoryCircleMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    steps: fixture.steps.map((step) => ({ ...step })),
  };
}

export default function ScenarioStoryCircleSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.complete.props)
  );
  const [feedback, setFeedback] = useState("No preview edit yet.");
  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview edit yet.");
  }, [activeState]);

  const interactiveSteps = viewProps.steps.map((step) => ({
    ...step,
    onChange: callbacksEnabled
      ? (value) => {
          setViewProps((current) => ({
            ...current,
            steps: current.steps.map((candidate) =>
              candidate.id === step.id ? { ...candidate, value } : candidate
            ),
          }));
          setFeedback(`${step.label} ${step.title} updated.`);
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
            Scenario Story Circle Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story Circle View directly without
            loading a Scenario creation or writing to its stored data.
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
          <ScenarioStoryCircleSectionView
            {...viewProps}
            steps={interactiveSteps}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready Story Circle steps and semantic edit
            callbacks. Scenario storage mapping, object merging, Creation Edit
            state, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
