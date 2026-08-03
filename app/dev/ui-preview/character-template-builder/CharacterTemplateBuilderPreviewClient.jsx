"use client";

import { useMemo, useState } from "react";

import CharacterTemplateBuilderView from "@/components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.view";
import {
  characterTemplateBuilderErrorFixture,
  characterTemplateBuilderReviewFixture,
  characterTemplateBuilderSavingFixture,
  characterTemplateBuilderTemplateFixture,
} from "@/components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.fixtures";
import { buildCharacterTemplateBuilderStepItems } from "@/components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.contract";

const STATES = [
  ["Template", characterTemplateBuilderTemplateFixture],
  ["Review", characterTemplateBuilderReviewFixture],
  ["Saving", characterTemplateBuilderSavingFixture],
  ["Error", characterTemplateBuilderErrorFixture],
];

function PreviewCard({ eyebrow, title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-3xl">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function CharacterTemplateBuilderPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeStep, setActiveStep] = useState(
    STATES[selectedState][1].activeStep
  );
  const fixture = STATES[selectedState][1];

  const previewProps = useMemo(() => {
    const stepItems = buildCharacterTemplateBuilderStepItems(activeStep);

    return {
      ...fixture,
      activeStep,
      activeIndex: Math.max(
        0,
        stepItems.findIndex((step) => step.active)
      ),
      stepItems,
      isFinalStep: activeStep === "review",
      onReset: () => {},
      onSelectStep: setActiveStep,
      onBack: () => {},
      onNext: () => {},
      onSave: () => {},
    };
  }, [activeStep, fixture]);

  function selectFixture(index) {
    setSelectedState(index);
    setActiveStep(STATES[index][1].activeStep);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development-only LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Template Builder
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture-driven portable View. No creation API, database, or saved
            Character Template is connected.
          </p>
        </div>

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

        <CharacterTemplateBuilderView
          {...previewProps}
          browseTemplatesContent={
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
            >
              Browse Templates
            </button>
          }
          editorContent={
            <PreviewCard
              eyebrow={activeStep}
              title={`${activeStep[0].toUpperCase()}${activeStep.slice(1)} Step`}
              body="The live Binding Shell injects the existing Crestfall template controls and modal bindings here."
            />
          }
        />
      </div>
    </main>
  );
}
