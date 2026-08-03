"use client";

import { useEffect, useState } from "react";

import CharacterBodySectionView from "@/components/studio/my-creations/edit/sections/character-body-section/CharacterBodySection.view";
import {
  characterBodySectionEmptyFixture,
  characterBodySectionLongContentFixture,
  characterBodySectionMissingCallbacksFixture,
  characterBodySectionPopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/character-body-section/CharacterBodySection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: characterBodySectionPopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: characterBodySectionEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterBodySectionLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: characterBodySectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function PreviewBodyControl({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--muted-gold)]/40"
    >
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <span className="mt-2 block text-sm text-[var(--foreground)]">
        {value}
      </span>
    </button>
  );
}

export default function CharacterBodySectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("populated");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.populated.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Body Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Body section without Crestfall
            trait or preset modals. The guided controls below are local preview
            slots.
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
            <CharacterBodySectionView
              {...viewProps}
              kibbePresetControl={
                <PreviewBodyControl
                  label="Kibbe Preset"
                  value="Natural"
                  onChange={() => setFeedback("Kibbe preset preview opened.")}
                />
              }
              bodyTypeControl={
                <PreviewBodyControl
                  label="Body Type"
                  value="Athletic"
                  onChange={() => setFeedback("Body Type preview opened.")}
                />
              }
              heightControl={
                <PreviewBodyControl
                  label="Height"
                  value="Above Average"
                  onChange={() => setFeedback("Height preview opened.")}
                />
              }
              buildControl={
                <PreviewBodyControl
                  label="Build"
                  value="Graceful"
                  onChange={() => setFeedback("Build preview opened.")}
                />
              }
              proportionsControl={
                <PreviewBodyControl
                  label="Proportions"
                  value="Broad shoulders, narrow waist, wide hips"
                  onChange={() => setFeedback("Proportions preview opened.")}
                />
              }
              onChangeBodyNotes={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        bodyNotesValue: value,
                      }));
                      setFeedback("Body notes updated in local preview state.");
                    }
                  : null
              }
            />
          </div>

          <aside className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
