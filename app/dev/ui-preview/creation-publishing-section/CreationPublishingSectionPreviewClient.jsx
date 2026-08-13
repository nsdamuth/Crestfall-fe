"use client";

import { useEffect, useState } from "react";

import CreationPublishingSectionView from "@/components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view";
import {
  creationPublishingSectionDraftFixture,
  creationPublishingSectionErrorFixture,
  creationPublishingSectionInReviewFixture,
  creationPublishingSectionMatureFixture,
  creationPublishingSectionMissingCallbacksFixture,
  creationPublishingSectionOfficialCanonFixture,
  creationPublishingSectionSavingFixture,
  creationPublishingSectionTemplateFixture,
  creationPublishingSectionUnlistableFixture,
} from "@/components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.fixtures";

const PREVIEW_STATES = {
  draft: { label: "Draft", props: creationPublishingSectionDraftFixture },
  template: {
    label: "Template",
    props: creationPublishingSectionTemplateFixture,
  },
  inReview: {
    label: "In Review",
    props: creationPublishingSectionInReviewFixture,
  },
  unlistable: {
    label: "Unlistable (Public)",
    props: creationPublishingSectionUnlistableFixture,
  },
  officialCanon: {
    label: "Official Canon",
    props: creationPublishingSectionOfficialCanonFixture,
  },
  saving: {
    label: "Saving",
    props: creationPublishingSectionSavingFixture,
  },
  error: { label: "Error", props: creationPublishingSectionErrorFixture },
  mature: {
    label: "Mature / Unlisted",
    props: creationPublishingSectionMatureFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: creationPublishingSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function CreationPublishingSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("draft");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.draft.props)
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
            Creation Publishing Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders visibility, template-management, and review
            states without loading or submitting a real Crestfall creation.
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
            <CreationPublishingSectionView
              {...viewProps}
              onSelectVisibility={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        visibilityValue: value,
                      }));
                      setFeedback(`Visibility changed to ${value}.`);
                    }
                  : null
              }
              onSelectContentRating={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        contentRatingValue: value,
                      }));
                      setFeedback(`Content rating changed to ${value}.`);
                    }
                  : null
              }
              onSubmitPublicReview={
                callbacksEnabled
                  ? () => setFeedback("Public review callback invoked.")
                  : null
              }
              onSubmitCanonReview={
                callbacksEnabled
                  ? () => setFeedback("Canon review callback invoked.")
                  : null
              }
              onUnlistForEditing={
                callbacksEnabled
                  ? () => setFeedback("Unlist for editing callback invoked.")
                  : null
              }
              onCancelReview={
                callbacksEnabled
                  ? () => setFeedback("Cancel review callback invoked.")
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
