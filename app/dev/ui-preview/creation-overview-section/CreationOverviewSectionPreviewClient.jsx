"use client";

import { useEffect, useState } from "react";

import CreationOverviewSectionView from "@/components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.view";
import {
  creationOverviewSectionEmptyFixture,
  creationOverviewSectionLongContentFixture,
  creationOverviewSectionMissingCallbacksFixture,
  creationOverviewSectionPopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: creationOverviewSectionPopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: creationOverviewSectionEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: creationOverviewSectionLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: creationOverviewSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function CreationOverviewSectionPreviewClient() {
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

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Overview Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Overview section without Creation
            Edit persistence or application state.
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
            <CreationOverviewSectionView
              {...viewProps}
              onChangeTitle={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        titleValue: value,
                      }));
                      setFeedback("Title updated in local preview state.");
                    }
                  : null
              }
              onChangeDescription={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        descriptionValue: value,
                      }));
                      setFeedback(
                        "Public description updated in local preview state."
                      );
                    }
                  : null
              }
              onPreview={
                callbacksEnabled
                  ? () => setFeedback("Preview action requested.")
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
