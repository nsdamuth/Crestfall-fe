"use client";

import { useEffect, useState } from "react";

import CharacterAdvancedSectionView from "@/components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.view";
import {
  characterAdvancedSectionEmptyFixture,
  characterAdvancedSectionLongContentFixture,
  characterAdvancedSectionMissingCallbacksFixture,
  characterAdvancedSectionPopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: characterAdvancedSectionPopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: characterAdvancedSectionEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterAdvancedSectionLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: characterAdvancedSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function AdvancedPromptingPreviewSlot({ onActivate }) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/30 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        Application-Owned Slot
      </p>
      <h3 className="mt-3 font-display text-2xl">Creator Directives</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        The live Shell injects the existing Advanced Prompting editor here.
      </p>
      <button
        type="button"
        onClick={onActivate}
        className="mt-4 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20"
      >
        Preview Directive Action
      </button>
    </section>
  );
}

const FIELD_BINDINGS = [
  ["greetingValue", "onChangeGreeting", "Greeting"],
  ["scenarioValue", "onChangeScenario", "Scenario"],
  ["relationshipValue", "onChangeRelationship", "Relationship"],
  ["backstoryValue", "onChangeBackstory", "Backstory"],
  ["appearanceNotesValue", "onChangeAppearanceNotes", "Appearance notes"],
  ["personalityNotesValue", "onChangePersonalityNotes", "Personality notes"],
  ["runtimeNotesValue", "onChangeRuntimeNotes", "Runtime notes"],
];

export default function CharacterAdvancedSectionPreviewClient() {
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

  const callbacks = Object.fromEntries(
    FIELD_BINDINGS.map(([valueKey, callbackKey, label]) => [
      callbackKey,
      callbacksEnabled
        ? (value) => {
            setViewProps((current) => ({
              ...current,
              [valueKey]: value,
            }));
            setFeedback(`${label} updated in local preview state.`);
          }
        : null,
    ])
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Advanced Guidance Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Advanced Guidance section without
            Crestfall persistence or the application Advanced Prompting Shell.
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
            <CharacterAdvancedSectionView
              {...viewProps}
              {...callbacks}
              advancedPromptingControl={
                <AdvancedPromptingPreviewSlot
                  onActivate={() =>
                    setFeedback("Advanced Prompting preview action selected.")
                  }
                />
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
