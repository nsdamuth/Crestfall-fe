"use client";

import { useEffect, useMemo, useState } from "react";

import OutfitPromptGuidanceSectionView from "@/components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view";
import {
  outfitPromptGuidanceAdvancedFixture,
  outfitPromptGuidanceEmptyFixture,
  outfitPromptGuidanceLongContentFixture,
  outfitPromptGuidanceMissingCallbacksFixture,
  outfitPromptGuidanceNormalFixture,
} from "@/components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.fixtures";

const PREVIEW_STATES = {
  normal: { label: "Normal", props: outfitPromptGuidanceNormalFixture },
  advanced: { label: "Advanced", props: outfitPromptGuidanceAdvancedFixture },
  empty: { label: "Empty", props: outfitPromptGuidanceEmptyFixture },
  longContent: {
    label: "Long Content",
    props: outfitPromptGuidanceLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: outfitPromptGuidanceMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    clothingModeOptions: fixture.clothingModeOptions.map((option) => ({
      ...option,
    })),
    clothingSections: fixture.clothingSections.map((field) => ({ ...field })),
  };
}

export default function OutfitPromptGuidanceSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("normal");
  const activeState = PREVIEW_STATES[activeStateKey];
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.normal.props)
  );
  const [feedback, setFeedback] = useState("No preview edit yet.");
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview edit yet.");
  }, [activeState]);

  const interactiveProps = useMemo(() => {
    const updateField = (fieldName, label) =>
      callbacksEnabled
        ? (value) => {
            setViewProps((current) => ({ ...current, [fieldName]: value }));
            setFeedback(`${label} updated.`);
          }
        : null;

    return {
      ...viewProps,
      onClothingModeChange: callbacksEnabled
        ? (mode) => {
            setViewProps((current) => ({
              ...current,
              clothingMode: mode,
              clothingModeOptions: current.clothingModeOptions.map((option) => ({
                ...option,
                active: option.value === mode,
              })),
            }));
            setFeedback(`Clothing mode changed to ${mode}.`);
          }
        : null,
      onNormalClothingPromptChange: updateField(
        "normalClothingPrompt",
        "Normal clothing prompt"
      ),
      onSignatureClothingChange: updateField(
        "signatureClothing",
        "Signature clothing"
      ),
      onClothingSectionChange: callbacksEnabled
        ? (sectionId, value) => {
            setViewProps((current) => ({
              ...current,
              clothingSections: current.clothingSections.map((field) =>
                field.id === sectionId ? { ...field, value } : field
              ),
            }));
            setFeedback(`${sectionId} clothing section updated.`);
          }
        : null,
      onStandaloneImagePromptChange: updateField(
        "standaloneImagePrompt",
        "Standalone image prompt"
      ),
      onNegativePromptChange: updateField("negativePrompt", "Negative prompt"),
      onUsageNotesChange: updateField("usageNotes", "Usage notes"),
      onCompatibilityNotesChange: updateField(
        "compatibilityNotes",
        "Compatibility notes"
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
            Outfit Prompt Guidance Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Outfit prompt-guidance View without
            loading or mutating an Outfit creation.
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
          <OutfitPromptGuidanceSectionView {...interactiveProps} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain normalized prompt values, body-section rows, and
            semantic change callbacks. Outfit storage keys and compatibility
            writes remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
