"use client";

import { useMemo, useState } from "react";

import CharacterCreatorView from "@/components/studio/create/character/character-creator/CharacterCreator.view";
import {
  characterCreatorErrorFixture,
  characterCreatorIdentityFixture,
  characterCreatorReviewFixture,
  characterCreatorSavingFixture,
} from "@/components/studio/create/character/character-creator/CharacterCreator.fixtures";
import { buildCharacterCreatorStepItems } from "@/components/studio/create/character/character-creator/CharacterCreator.contract";

const STATES = [
  ["Identity", characterCreatorIdentityFixture],
  ["Review", characterCreatorReviewFixture],
  ["Saving", characterCreatorSavingFixture],
  ["Error", characterCreatorErrorFixture],
];

function PreviewCard({ eyebrow, title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function CharacterCreatorPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeStep, setActiveStep] = useState(
    STATES[selectedState][1].activeStep
  );
  const fixture = STATES[selectedState][1];

  const previewProps = useMemo(() => {
    const stepItems = buildCharacterCreatorStepItems(activeStep);

    return {
      ...fixture,
      activeStep,
      activeIndex: Math.max(
        0,
        stepItems.findIndex((step) => step.active)
      ),
      stepItems,
      onSelectStep: setActiveStep,
      onBack: () => {},
      onNext: () => {},
      onSave: () => {},
      onClose: () => {},
    };
  }, [activeStep, fixture]);

  function selectFixture(index) {
    setSelectedState(index);
    setActiveStep(STATES[index][1].activeStep);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {STATES.map(([label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectFixture(index)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                index === selectedState
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <CharacterCreatorView
          {...previewProps}
          headerContent={
            <PreviewCard
              eyebrow="Create"
              title="Create a Crestfall Character"
              body="Fixture-driven Character Creator preview."
            />
          }
          previewContent={
            <PreviewCard
              eyebrow="Character Preview"
              title="Kaela Veynskald"
              body="Mountain ranger, roadsworn guardian, and fixture preview subject."
            />
          }
          editorContent={
            <PreviewCard
              eyebrow={activeStep}
              title={`${activeStep[0].toUpperCase()}${activeStep.slice(1)} Step`}
              body="The live Binding Shell injects the existing Crestfall step editor here."
            />
          }
        />
      </div>
    </main>
  );
}
