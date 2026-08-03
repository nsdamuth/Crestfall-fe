"use client";

import { useEffect, useState } from "react";

import CharacterAppearanceSectionView from "@/components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view";
import {
  characterAppearanceSectionEmptyFixture,
  characterAppearanceSectionLongContentFixture,
  characterAppearanceSectionMissingCallbacksFixture,
  characterAppearanceSectionOutfitFixture,
  characterAppearanceSectionWardrobeFixture,
} from "@/components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.fixtures";

const PREVIEW_STATES = {
  outfit: {
    label: "Selected Outfit",
    props: characterAppearanceSectionOutfitFixture,
  },
  wardrobe: {
    label: "Selected Wardrobe",
    props: characterAppearanceSectionWardrobeFixture,
  },
  empty: {
    label: "No Clothing",
    props: characterAppearanceSectionEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterAppearanceSectionLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: characterAppearanceSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function PreviewAppearanceControl({ label, value, onChange }) {
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

export default function CharacterAppearanceSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("outfit");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.outfit.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  function setClothing(nextClothing, message) {
    setViewProps((current) => ({
      ...current,
      selectedClothing: cloneFixture(nextClothing),
    }));
    setFeedback(message);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Appearance Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Appearance section without Crestfall
            pickers or persistence. The four visual controls below are preview
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
            <CharacterAppearanceSectionView
              {...viewProps}
              skinToneControl={
                <PreviewAppearanceControl
                  label="Skin Tone"
                  value="Warm copper"
                  onChange={() => setFeedback("Skin Tone preview opened.")}
                />
              }
              eyeColorControl={
                <PreviewAppearanceControl
                  label="Eye Color"
                  value="Violet"
                  onChange={() => setFeedback("Eye Color preview opened.")}
                />
              }
              hairControl={
                <PreviewAppearanceControl
                  label="Hair"
                  value="Very long, wavy red hair"
                  onChange={() => setFeedback("Hair preview opened.")}
                />
              }
              visualHeritageControl={
                <PreviewAppearanceControl
                  label="Ethnic Appearance"
                  value="White European"
                  onChange={() =>
                    setFeedback("Visual heritage preview opened.")
                  }
                />
              }
              onPickOutfit={
                callbacksEnabled
                  ? () =>
                      setClothing(
                        characterAppearanceSectionOutfitFixture.selectedClothing,
                        "Outfit selected in local preview state."
                      )
                  : null
              }
              onPickWardrobe={
                callbacksEnabled
                  ? () =>
                      setClothing(
                        characterAppearanceSectionWardrobeFixture.selectedClothing,
                        "Wardrobe selected in local preview state."
                      )
                  : null
              }
              onClearDefaultClothing={
                callbacksEnabled
                  ? () =>
                      setClothing(
                        characterAppearanceSectionEmptyFixture.selectedClothing,
                        "Default clothing cleared in local preview state."
                      )
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
