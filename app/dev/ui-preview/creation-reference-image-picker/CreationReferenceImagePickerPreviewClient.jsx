"use client";

import { useState } from "react";

import CreationReferenceImagePickerModalView from "@/components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view";
import {
  creationReferenceImagePickerEmptyFixture,
  creationReferenceImagePickerLoadErrorFixture,
  creationReferenceImagePickerLoadingFixture,
  creationReferenceImagePickerLongLabelFixture,
  creationReferenceImagePickerPopulatedFixture,
  creationReferenceImagePickerUnavailablePreviewFixture,
} from "@/components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: creationReferenceImagePickerPopulatedFixture,
  },
  loading: {
    label: "Loading",
    props: creationReferenceImagePickerLoadingFixture,
  },
  empty: {
    label: "Empty",
    props: creationReferenceImagePickerEmptyFixture,
  },
  loadError: {
    label: "Load Error",
    props: creationReferenceImagePickerLoadErrorFixture,
  },
  unavailablePreview: {
    label: "Unavailable Preview",
    props: creationReferenceImagePickerUnavailablePreviewFixture,
  },
  longLabel: {
    label: "Long Label",
    props: creationReferenceImagePickerLongLabelFixture,
  },
};

export default function CreationReferenceImagePickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall creation or image library is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setLastAction("Modal closed. No application data was changed.");
  }

  function recordAction(message) {
    setLastAction(`${message} This was fixture-only and was not saved.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Reference Image Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load a creation, call an API, or
            update a visual-reference field.
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
                onClick={() => openState(stateKey)}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture cards contain only semantic IDs, display-ready URLs,
            alternative text, and presentation metadata. Creation loading,
            output-ID normalization, eligibility filtering, and form updates
            remain outside the View.
          </p>
        </section>
      </div>

      {activeState ? (
        <CreationReferenceImagePickerModalView
          {...activeState.props}
          onClose={closePreview}
          onRefresh={() => recordAction("Refresh requested.")}
          onLoadMore={() => recordAction("Load More requested.")}
          onChooseImage={(imageId) =>
            recordAction(`Reference ${imageId || "unknown"} selected.`)
          }
        />
      ) : null}
    </main>
  );
}
