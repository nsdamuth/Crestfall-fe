"use client";

import { useEffect, useState } from "react";

import CreationDangerSectionView from "@/components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view";
import {
  creationDangerSectionApprovedFixture,
  creationDangerSectionArchivedFixture,
  creationDangerSectionCanonLockedFixture,
  creationDangerSectionDraftFixture,
  creationDangerSectionErrorFixture,
  creationDangerSectionMissingCallbacksFixture,
  creationDangerSectionSavingFixture,
} from "@/components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.fixtures";

const PREVIEW_STATES = {
  draft: { label: "Draft", props: creationDangerSectionDraftFixture },
  approved: {
    label: "Approved",
    props: creationDangerSectionApprovedFixture,
  },
  archived: {
    label: "Archived",
    props: creationDangerSectionArchivedFixture,
  },
  canonLocked: {
    label: "Canon Locked",
    props: creationDangerSectionCanonLockedFixture,
  },
  saving: { label: "Saving", props: creationDangerSectionSavingFixture },
  error: { label: "Error", props: creationDangerSectionErrorFixture },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: creationDangerSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function CreationDangerSectionPreviewClient() {
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
            Creation Danger Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable archive and delete interface without
            loading a Crestfall creation or invoking real lifecycle mutations.
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
            <CreationDangerSectionView
              {...viewProps}
              onArchive={
                callbacksEnabled
                  ? () => setFeedback("Archive callback invoked.")
                  : null
              }
              onDelete={
                callbacksEnabled
                  ? () => setFeedback("Delete callback invoked.")
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
