"use client";

import { useState } from "react";

import RoomTemplatePackageSectionView from "@/components/studio/my-creations/edit/sections/room-templates/room-template-package-section/RoomTemplatePackageSection.view";
import {
  roomTemplatePackageSectionDefaultFixture,
  roomTemplatePackageSectionEmptyFixture,
  roomTemplatePackageSectionLoadErrorFixture,
  roomTemplatePackageSectionLongContentFixture,
  roomTemplatePackageSectionMissingCallbacksFixture,
  roomTemplatePackageSectionPickerFixture,
  roomTemplatePackageSectionRecommendationsFixture,
} from "@/components/studio/my-creations/edit/sections/room-templates/room-template-package-section/RoomTemplatePackageSection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Selected Package",
    props: roomTemplatePackageSectionDefaultFixture,
  },
  recommendations: {
    label: "Recommendations",
    props: roomTemplatePackageSectionRecommendationsFixture,
  },
  empty: {
    label: "Empty Package",
    props: roomTemplatePackageSectionEmptyFixture,
  },
  loadError: {
    label: "Load Error",
    props: roomTemplatePackageSectionLoadErrorFixture,
  },
  picker: {
    label: "Picker Open",
    props: roomTemplatePackageSectionPickerFixture,
  },
  longContent: {
    label: "Long Content",
    props: roomTemplatePackageSectionLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: roomTemplatePackageSectionMissingCallbacksFixture,
  },
};

export default function RoomTemplatePackageSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";
  const sourceProps = activeState.props;

  const selectedCharactersPanelProps = {
    ...sourceProps.selectedCharactersPanelProps,
    onOpenCharacterPicker: callbacksEnabled
      ? () => setFeedback("Open character picker requested.")
      : null,
    onRemoveCharacter: callbacksEnabled
      ? (characterId) => setFeedback(`Remove character: ${characterId}`)
      : null,
  };

  const scenarioRecommendationsPanelProps = {
    ...sourceProps.scenarioRecommendationsPanelProps,
    onApplyAll: callbacksEnabled
      ? () => setFeedback("Apply all recommendations requested.")
      : null,
    onApplyRequiredCharacters: callbacksEnabled
      ? () => setFeedback("Apply required characters requested.")
      : null,
    onApplyOptionalCharacters: callbacksEnabled
      ? () => setFeedback("Apply optional characters requested.")
      : null,
    onApplySuggestedLocation: callbacksEnabled
      ? () => setFeedback("Apply suggested location requested.")
      : null,
    onApplySuggestedNarrator: callbacksEnabled
      ? () => setFeedback("Apply suggested narrator requested.")
      : null,
    onApplySuggestedNpcRegistries: callbacksEnabled
      ? () => setFeedback("Apply suggested NPC registries requested.")
      : null,
    onSkipRecommendations: callbacksEnabled
      ? () => setFeedback("Skip recommendations requested.")
      : null,
  };

  const selectionCards = sourceProps.selectionCards.map((card) => ({
    ...card,
    onOpen: callbacksEnabled
      ? () => setFeedback(`Open ${card.id} picker requested.`)
      : null,
  }));

  const pickerViewProps = sourceProps.pickerViewProps
    ? {
        ...sourceProps.pickerViewProps,
        onClose: callbacksEnabled
          ? () => setFeedback("Close picker requested.")
          : null,
        onChooseItem: callbacksEnabled
          ? (itemId) => setFeedback(`Choose picker item: ${itemId}`)
          : null,
      }
    : null;

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Template Package Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story Package View directly from
            contract-shaped fixtures. It does not authenticate, load
            creations, update a room template, or persist recommendation
            changes.
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
                onClick={() => {
                  setActiveStateKey(stateKey);
                  setFeedback("No preview action yet.");
                }}
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
            <RoomTemplatePackageSectionView
              {...sourceProps}
              selectedCharactersPanelProps={selectedCharactersPanelProps}
              scenarioRecommendationsPanelProps={
                scenarioRecommendationsPanelProps
              }
              selectionCards={selectionCards}
              pickerViewProps={pickerViewProps}
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
              Fixtures contain only display-ready child-View props, selection
              cards, error copy, and semantic callbacks. Creation loading,
              room-template storage fields, recommendation resolution, registry
              merging, saving, and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
