"use client";

import { useMemo, useState } from "react";

import CreationEditStickyActionBarView from "@/components/studio/my-creations/edit/creation-edit-sticky-action-bar/CreationEditStickyActionBar.view";
import {
  creationEditStickyActionBarApprovedInternalFixture,
  creationEditStickyActionBarArchivedFixture,
  creationEditStickyActionBarCanonFixture,
  creationEditStickyActionBarDraftFixture,
  creationEditStickyActionBarErrorFixture,
  creationEditStickyActionBarFeedbackFixture,
  creationEditStickyActionBarPublicFixture,
  creationEditStickyActionBarReviewFixture,
  creationEditStickyActionBarSavingFixture,
} from "@/components/studio/my-creations/edit/creation-edit-sticky-action-bar/CreationEditStickyActionBar.fixtures";

const PREVIEW_STATES = {
  draft: {
    label: "Private Draft",
    props: creationEditStickyActionBarDraftFixture,
  },
  approvedInternal: {
    label: "Approved Internal",
    props: creationEditStickyActionBarApprovedInternalFixture,
  },
  publicLive: {
    label: "Public Live",
    props: creationEditStickyActionBarPublicFixture,
  },
  review: {
    label: "In Review",
    props: creationEditStickyActionBarReviewFixture,
  },
  archived: {
    label: "Archived",
    props: creationEditStickyActionBarArchivedFixture,
  },
  canon: {
    label: "Canon Locked",
    props: creationEditStickyActionBarCanonFixture,
  },
  saving: {
    label: "Saving",
    props: creationEditStickyActionBarSavingFixture,
  },
  success: {
    label: "Save Success",
    props: creationEditStickyActionBarFeedbackFixture,
  },
  error: {
    label: "Save Error",
    props: creationEditStickyActionBarErrorFixture,
  },
};

export default function CreationEditStickyActionBarPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("draft");
  const [lastAction, setLastAction] = useState("No preview action yet.");
  const [selectedVisibility, setSelectedVisibility] = useState(null);

  const activeState = PREVIEW_STATES[activeStateKey];

  const viewProps = useMemo(() => {
    const fixture = activeState.props;
    const effectiveVisibility = selectedVisibility || fixture.visibilityLabel;

    return {
      ...fixture,
      visibilityLabel: effectiveVisibility,
      visibilityOptions: fixture.visibilityOptions.map((option) => ({
        ...option,
        active: option.value === effectiveVisibility,
      })),
      onSelectVisibility: (value) => {
        setSelectedVisibility(value);
        setLastAction(`Selected visibility: ${value}`);
      },
      onOpenReviewActions: () => setLastAction("Opened review actions."),
      onUnlistForEditing: () => setLastAction("Requested unlist for editing."),
      onSaveChanges: () => setLastAction("Requested save changes."),
      onCancelReview: () => setLastAction("Requested review cancellation."),
    };
  }, [activeState, selectedVisibility]);

  function selectState(stateKey) {
    setActiveStateKey(stateKey);
    setSelectedVisibility(null);
    setLastAction("No preview action yet.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Edit Sticky Action Bar
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable action-bar View directly from
            contract-shaped lifecycle fixtures. It does not load, save, unlist,
            publish, archive, or cancel review for a real creation.
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
                onClick={() => selectState(stateKey)}
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

        <section className="min-h-[360px] rounded-2xl border border-white/10 bg-black/25 p-6">
          <div className="min-h-[260px] rounded-xl border border-white/10 bg-black/25 p-5">
            <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Scroll or resize this surface to inspect sticky positioning and
              action wrapping. Buttons report local intent only.
            </p>
          </div>

          <CreationEditStickyActionBarView {...viewProps} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Local Preview Feedback
          </p>
          <p className="mt-3 text-sm text-[var(--foreground)]">{lastAction}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures supply only display-ready lifecycle summaries, action
            availability, feedback, and semantic callbacks. The live ViewModel
            remains responsible for interpreting the raw creation form and
            Crestfall edit, review, visibility, and canon rules.
          </p>
        </section>
      </div>
    </main>
  );
}
