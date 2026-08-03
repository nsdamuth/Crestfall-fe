"use client";

import { useEffect, useState } from "react";

import StoryNarrativeRuntimeSectionView from "@/components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section/StoryNarrativeRuntimeSection.view";
import {
  storyNarrativeRuntimeCustomCopyFixture,
  storyNarrativeRuntimeEmptyFixture,
  storyNarrativeRuntimeLatePhaseFixture,
  storyNarrativeRuntimeLongContentFixture,
  storyNarrativeRuntimeMissingCallbacksFixture,
  storyNarrativeRuntimePopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section/StoryNarrativeRuntimeSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: storyNarrativeRuntimePopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: storyNarrativeRuntimeEmptyFixture,
  },
  latePhase: {
    label: "Late Phase",
    props: storyNarrativeRuntimeLatePhaseFixture,
  },
  longContent: {
    label: "Long Content",
    props: storyNarrativeRuntimeLongContentFixture,
  },
  customCopy: {
    label: "Custom Copy",
    props: storyNarrativeRuntimeCustomCopyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: storyNarrativeRuntimeMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function StoryNarrativeRuntimeSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("populated");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.populated.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  function updatePhase(phaseId, field, value, feedbackLabel) {
    setViewProps((current) => ({
      ...current,
      phases: current.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              [field]: value,
            }
          : phase
      ),
    }));
    setFeedback(`${phaseId} ${feedbackLabel} changed.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Narrative Runtime Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story authoring View directly from
            contract-shaped fixtures. Policy and phase edits update local
            preview state only.
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
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <StoryNarrativeRuntimeSectionView
              {...viewProps}
              onChangeBranchingPolicy={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        branchingPolicyValue: value,
                      }));
                      setFeedback(`Branching policy changed: ${value}`);
                    }
                  : null
              }
              onChangeCompletionPolicy={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        completionPolicyValue: value,
                      }));
                      setFeedback(`Completion policy changed: ${value}`);
                    }
                  : null
              }
              onChangeCompletionGuidance={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        completionGuidanceValue: value,
                      }));
                      setFeedback("Completion guidance changed.");
                    }
                  : null
              }
              onChangePhaseObjective={
                callbacksEnabled
                  ? (phaseId, value) =>
                      updatePhase(
                        phaseId,
                        "objectiveValue",
                        value,
                        "objective"
                      )
                  : null
              }
              onChangePhasePressures={
                callbacksEnabled
                  ? (phaseId, value) =>
                      updatePhase(
                        phaseId,
                        "pressuresValue",
                        value,
                        "pressures"
                      )
                  : null
              }
              onChangePhaseConsequences={
                callbacksEnabled
                  ? (phaseId, value) =>
                      updatePhase(
                        phaseId,
                        "consequencesValue",
                        value,
                        "consequences"
                      )
                  : null
              }
              onChangePhaseReentryHooks={
                callbacksEnabled
                  ? (phaseId, value) =>
                      updatePhase(
                        phaseId,
                        "reentryHooksValue",
                        value,
                        "reentry hooks"
                      )
                  : null
              }
              onChangePhaseBeatSuggestions={
                callbacksEnabled
                  ? (phaseId, value) =>
                      updatePhase(
                        phaseId,
                        "beatSuggestionsValue",
                        value,
                        "beat suggestions"
                      )
                  : null
              }
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain only display-ready policies, labels, phase text,
              disclosure defaults, and semantic callbacks. Raw creation forms,
              Story authoring storage, normalization, guidance arrays, saving,
              and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
