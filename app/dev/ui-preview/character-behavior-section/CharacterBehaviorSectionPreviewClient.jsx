"use client";

import { useEffect, useState } from "react";

import CharacterBehaviorSectionView from "@/components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.view";
import {
  characterBehaviorSectionEmptyFixture,
  characterBehaviorSectionExpressiveFixture,
  characterBehaviorSectionLongContentFixture,
  characterBehaviorSectionMissingCallbacksFixture,
  characterBehaviorSectionPopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: characterBehaviorSectionPopulatedFixture,
  },
  expressive: {
    label: "Expressive",
    props: characterBehaviorSectionExpressiveFixture,
  },
  empty: {
    label: "Empty",
    props: characterBehaviorSectionEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterBehaviorSectionLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: characterBehaviorSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function PreviewBehaviorControl({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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

export default function CharacterBehaviorSectionPreviewClient() {
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

  function control(label, value) {
    return (
      <PreviewBehaviorControl
        label={label}
        value={value}
        onClick={() => setFeedback(`${label} preview opened.`)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Behavior Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Behavior section without Crestfall
            personality, trait, or voice-module modals. Those application
            controls are represented by local preview slots.
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
            <CharacterBehaviorSectionView
              {...viewProps}
              outwardPersonalityControl={control(
                "Outward Personality",
                activeStateKey === "empty" ? "Not chosen" : "Commanding"
              )}
              internalPersonalityControl={control(
                "Internal Personality",
                activeStateKey === "empty" ? "Not chosen" : "Thinker"
              )}
              mbtiControl={control("MBTI Personality Type", "INTJ")}
              westernZodiacControl={control("Western Zodiac", "Scorpio")}
              eastAsianZodiacControl={control(
                "East Asian Zodiac",
                "Dragon"
              )}
              speechStyleControl={control("Speech Style", "Technical")}
              movementStyleControl={control("Movement Style", "Predatory")}
              voiceModulesControl={control(
                "Voice Modules",
                "Playful emphasis, urgent emphasis"
              )}
              interestsControl={control(
                "Interests",
                activeStateKey === "empty" ? "Not chosen" : "Knowledge"
              )}
              onSelectVerbosity={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        verbosityValue: value,
                      }));
                      setFeedback(`Verbosity changed to ${value || "none"}.`);
                    }
                  : null
              }
              onChangePhilosophy={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        philosophyValue: value,
                      }));
                      setFeedback("Philosophy changed in local preview state.");
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
