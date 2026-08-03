"use client";

import { useEffect, useMemo, useState } from "react";

import ScenarioRuntimeGuidanceSectionView from "@/components/studio/my-creations/edit/sections/scenarios/scenario-runtime-guidance-section/ScenarioRuntimeGuidanceSection.view";
import {
  scenarioRuntimeGuidanceEmptyFixture,
  scenarioRuntimeGuidanceLongCopyFixture,
  scenarioRuntimeGuidanceMissingCallbacksFixture,
  scenarioRuntimeGuidancePopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/scenarios/scenario-runtime-guidance-section/ScenarioRuntimeGuidanceSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: scenarioRuntimeGuidancePopulatedFixture,
  },
  empty: { label: "Empty", props: scenarioRuntimeGuidanceEmptyFixture },
  longCopy: {
    label: "Long Copy",
    props: scenarioRuntimeGuidanceLongCopyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: scenarioRuntimeGuidanceMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return { ...fixture };
}

export default function ScenarioRuntimeGuidanceSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("populated");
  const activeState = PREVIEW_STATES[activeStateKey];
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.populated.props)
  );
  const [feedback, setFeedback] = useState("No preview edit yet.");
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview edit yet.");
  }, [activeState]);

  const interactiveProps = useMemo(() => {
    const bind = (fieldName, label) =>
      callbacksEnabled
        ? (value) => {
            setViewProps((current) => ({ ...current, [fieldName]: value }));
            setFeedback(`${label} updated.`);
          }
        : null;

    return {
      ...viewProps,
      onOpeningSceneChange: bind("openingScene", "Opening Scene"),
      onOpeningMessagesChange: bind("openingMessages", "Opening Messages"),
      onPrivateRuntimeGuidanceChange: bind(
        "privateRuntimeGuidance",
        "Private Runtime Guidance"
      ),
      onDriftFixesChange: bind("driftFixes", "Drift Fixes"),
      onFailureHandlingChange: bind(
        "failureHandling",
        "Failure Handling"
      ),
    };
  }, [callbacksEnabled, viewProps]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Scenario Runtime Guidance Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable opening and runtime guidance View
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
          <ScenarioRuntimeGuidanceSectionView {...interactiveProps} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain normalized text and semantic change callbacks.
            Scenario storage keys and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
