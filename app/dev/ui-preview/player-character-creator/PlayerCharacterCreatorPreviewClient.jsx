"use client";

import { useState } from "react";

import PlayerCharacterCreatorView from "@/components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.view";
import {
  playerCharacterAppearanceFixture,
  playerCharacterBodyFixture,
  playerCharacterEmptyFixture,
  playerCharacterErrorFixture,
  playerCharacterIdentityFixture,
  playerCharacterProfileFixture,
  playerCharacterReviewFixture,
  playerCharacterSavedFixture,
  playerCharacterSavingFixture,
} from "@/components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.fixtures";
import { PLAYER_CHARACTER_STEPS } from "@/components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.contract";

const PREVIEW_STATES = {
  identity: { label: "Identity", props: playerCharacterIdentityFixture },
  appearance: { label: "Appearance", props: playerCharacterAppearanceFixture },
  body: { label: "Body", props: playerCharacterBodyFixture },
  profile: { label: "Profile", props: playerCharacterProfileFixture },
  review: { label: "Review", props: playerCharacterReviewFixture },
  empty: { label: "Empty", props: playerCharacterEmptyFixture },
  saving: { label: "Saving", props: playerCharacterSavingFixture },
  saved: { label: "Saved", props: playerCharacterSavedFixture },
  error: { label: "Error", props: playerCharacterErrorFixture },
};

function FixtureFieldSlot({ label }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
      {label} controls supplied by the application Shell.
    </div>
  );
}

function buildStepState(activeStep) {
  const activeIndex = Math.max(
    0,
    PLAYER_CHARACTER_STEPS.findIndex((step) => step.id === activeStep)
  );

  return {
    activeStep,
    activeIndex,
    stepItems: PLAYER_CHARACTER_STEPS.map((step, index) => ({
      ...step,
      active: step.id === activeStep,
      visited: index <= activeIndex,
    })),
  };
}

export default function PlayerCharacterCreatorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("identity");
  const [viewProps, setViewProps] = useState({
    ...playerCharacterIdentityFixture,
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit preview-local player-character fields."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...state.props });
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function selectStep(stepId) {
    setViewProps((current) => ({
      ...current,
      ...buildStepState(stepId),
    }));
    setLastAction(`Selected the ${stepId} step in preview-local state.`);
  }

  function updateField(field, value) {
    setViewProps((current) => ({
      ...current,
      form: {
        ...current.form,
        [field]: value,
      },
    }));
    setLastAction(`Updated ${field} in preview-local state.`);
  }

  const slots = {
    characterColorPaletteContent: (
      <FixtureFieldSlot label="Character color palette" />
    ),
    skinToneContent: <FixtureFieldSlot label="Skin tone" />,
    eyeColorContent: <FixtureFieldSlot label="Eye color" />,
    hairColorContent: <FixtureFieldSlot label="Hair color" />,
    hairStyleContent: <FixtureFieldSlot label="Hair style" />,
    defaultClothingContent: <FixtureFieldSlot label="Default clothing" />,
    bodyTypeContent: <FixtureFieldSlot label="Body type" />,
    heightContent: <FixtureFieldSlot label="Height" />,
    buildContent: <FixtureFieldSlot label="Build" />,
  };

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Player Character Creator
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable creator directly. Persistence,
            navigation, clothing queries, and application field modals remain
            disconnected.
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

        <PlayerCharacterCreatorView
          {...viewProps}
          {...slots}
          onSelectStep={selectStep}
          onUpdateField={updateField}
          onNormalizeAdultAge={() => {
            setViewProps((current) => ({
              ...current,
              form: {
                ...current.form,
                age:
                  current.form.age && Number(current.form.age) < 18
                    ? "18"
                    : current.form.age,
              },
            }));
            setLastAction("Normalized the preview-local age to 18+.");
          }}
          onBack={() => {
            const nextIndex = Math.max(viewProps.activeIndex - 1, 0);
            selectStep(PLAYER_CHARACTER_STEPS[nextIndex].id);
          }}
          onNext={() => {
            const nextIndex = Math.min(
              viewProps.activeIndex + 1,
              PLAYER_CHARACTER_STEPS.length - 1
            );
            selectStep(PLAYER_CHARACTER_STEPS[nextIndex].id);
          }}
          onSave={() => setLastAction("Requested a preview-local draft save.")}
        />
      </div>
    </main>
  );
}
