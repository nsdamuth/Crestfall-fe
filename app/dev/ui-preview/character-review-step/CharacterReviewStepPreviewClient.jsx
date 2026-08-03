"use client";

import { useState } from "react";

import CharacterReviewStepView from "@/components/studio/create/character/review-step/CharacterReviewStep.view";
import {
  characterReviewStepFixture,
  characterReviewStepFixtureStates,
} from "@/components/studio/create/character/review-step/CharacterReviewStep.fixtures";
import useCharacterReviewStepViewModel from "@/components/studio/create/character/review-step/useCharacterReviewStepViewModel";

const STATE_OPTIONS = [
  { id: "collapsed", label: "Collapsed" },
  { id: "advanced", label: "Advanced open" },
  { id: "minimumAge", label: "Under-18 blur" },
  { id: "sparse", label: "Sparse summary" },
];

function buildState(stateKey) {
  const state = characterReviewStepFixtureStates[stateKey];

  return {
    form: {
      ...characterReviewStepFixture,
      ...(state?.overrides || {}),
      age: state?.age ?? characterReviewStepFixture.age,
    },
    advancedOpen: Boolean(state?.advancedOpen),
  };
}

export default function CharacterReviewStepPreviewClient() {
  const [stateKey, setStateKey] = useState("collapsed");
  const [previewState, setPreviewState] = useState(() =>
    buildState("collapsed")
  );

  function updateField(field, value) {
    setPreviewState((current) => ({
      ...current,
      form: {
        ...current.form,
        [field]: value,
      },
    }));
  }

  function setAdvancedOpen(valueOrUpdater) {
    setPreviewState((current) => ({
      ...current,
      advancedOpen:
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(current.advancedOpen)
          : Boolean(valueOrUpdater),
    }));
  }

  const { viewProps, advancedPromptingProps } =
    useCharacterReviewStepViewModel({
      form: previewState.form,
      updateField,
      advancedOpen: previewState.advancedOpen,
      setAdvancedOpen,
    });

  function selectState(nextStateKey) {
    setStateKey(nextStateKey);
    setPreviewState(buildState(nextStateKey));
  }

  return (
    <main className="min-h-screen bg-[#050403] p-4 text-[var(--foreground)] sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Development-only LOOM preview
          </p>
          <h1 className="mt-2 font-display text-3xl">
            Character Review Step
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercises publishing controls, adult-age normalization, advanced
            guidance, and summary projection using local fixture state only.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectState(option.id)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                  stateKey === option.id
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15"
                    : "border-white/10 bg-black/25 text-[var(--muted)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
          <CharacterReviewStepView
            {...viewProps}
            advancedPromptingContent={
              <div className="rounded-xl border border-dashed border-[var(--muted-gold)]/30 bg-black/25 p-4 text-sm text-[var(--muted)]">
                Injected Advanced Prompting region. Current fixture value:
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs">
                  {JSON.stringify(advancedPromptingProps.value, null, 2)}
                </pre>
              </div>
            }
          />
        </section>

        <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/45 p-4 text-xs text-[var(--muted)]">
          {JSON.stringify(previewState.form, null, 2)}
        </pre>
      </div>
    </main>
  );
}
