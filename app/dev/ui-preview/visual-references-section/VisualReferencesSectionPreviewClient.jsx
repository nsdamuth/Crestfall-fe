"use client";

import { useEffect, useState } from "react";

import VisualReferencesSectionView from "@/components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.view";
import {
  visualReferencesSectionAssignedFixture,
  visualReferencesSectionEmptyFixture,
  visualReferencesSectionErrorFixture,
  visualReferencesSectionMissingCallbacksFixture,
  visualReferencesSectionMissingPreviewFixture,
} from "@/components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.fixtures";

const PREVIEW_STATES = {
  assigned: {
    label: "Assigned",
    props: visualReferencesSectionAssignedFixture,
  },
  empty: {
    label: "Empty",
    props: visualReferencesSectionEmptyFixture,
  },
  missingPreview: {
    label: "Preview Missing",
    props: visualReferencesSectionMissingPreviewFixture,
  },
  error: {
    label: "Load Error",
    props: visualReferencesSectionErrorFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: visualReferencesSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    referenceCards: (fixture.referenceCards || []).map((card) => ({ ...card })),
  };
}

function PickerPreviewSlot({ label, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <section className="w-full max-w-md rounded-2xl border border-[var(--muted-gold)]/35 bg-[#11100e] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          Application-Owned Slot
        </p>
        <h2 className="mt-3 font-display text-3xl">{label}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          The live Shell injects the creation image-library picker here.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          Close Preview Picker
        </button>
      </section>
    </div>
  );
}

export default function VisualReferencesSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("assigned");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.assigned.props)
  );
  const [activePickerLabel, setActivePickerLabel] = useState("");
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setActivePickerLabel("");
    setFeedback("No preview action yet.");
  }, [activeState]);

  const referenceCards = (viewProps.referenceCards || []).map((card) => ({
    ...card,
    onChoose: callbacksEnabled
      ? () => {
          setActivePickerLabel(card.label);
          setFeedback(`${card.label} picker opened.`);
        }
      : null,
    onClear:
      callbacksEnabled && card.imageOutputId
        ? () => {
            setViewProps((current) => ({
              ...current,
              referenceCards: current.referenceCards.map((currentCard) =>
                currentCard.key === card.key
                  ? {
                      ...currentCard,
                      imageOutputId: "",
                      imageUrl: null,
                      emptyMessage: "No reference image assigned.",
                      chooseLabel: "Choose from Library",
                    }
                  : currentCard
              ),
            }));
            setFeedback(`${card.label} cleared in local preview state.`);
          }
        : null,
  }));

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Visual References Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable reference cards without loading a
            real creation image library or application picker.
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
            <VisualReferencesSectionView
              {...viewProps}
              referenceCards={referenceCards}
              onRefresh={
                callbacksEnabled
                  ? () => setFeedback("Library refresh requested.")
                  : null
              }
              pickerModal={
                activePickerLabel ? (
                  <PickerPreviewSlot
                    label={activePickerLabel}
                    onClose={() => {
                      setActivePickerLabel("");
                      setFeedback("Preview picker closed.");
                    }}
                  />
                ) : null
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
