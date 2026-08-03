"use client";

import { useEffect, useMemo, useState } from "react";

import ItemRegistryFieldsSectionView from "@/components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view";
import {
  itemRegistryFieldsAssociationsFixture,
  itemRegistryFieldsEmptyFixture,
  itemRegistryFieldsEntriesFixture,
  itemRegistryFieldsOverviewFixture,
  itemRegistryFieldsPromptFixture,
  itemRegistryFieldsReviewFixture,
  itemRegistryFieldsTrackingFixture,
} from "@/components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.fixtures";

const PREVIEW_STATES = {
  overview: { label: "Overview", props: itemRegistryFieldsOverviewFixture },
  entries: { label: "Entries", props: itemRegistryFieldsEntriesFixture },
  associations: {
    label: "Associations",
    props: itemRegistryFieldsAssociationsFixture,
  },
  tracking: { label: "Tracking", props: itemRegistryFieldsTrackingFixture },
  prompt: { label: "Prompt", props: itemRegistryFieldsPromptFixture },
  review: { label: "Review", props: itemRegistryFieldsReviewFixture },
  empty: { label: "Empty", props: itemRegistryFieldsEmptyFixture },
};

function cloneFixture(fixture) {
  const entries = fixture.entries.map((entry) => ({ ...entry }));
  const activeEntryId = fixture.activeEntry?.id || null;

  return {
    ...fixture,
    entries,
    activeEntry:
      entries.find((entry) => entry.id === activeEntryId) || null,
    startingAssignmentContentByEntryId: {
      ...(fixture.startingAssignmentContentByEntryId || {}),
    },
  };
}

export default function ItemRegistryFieldsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("overview");
  const activeState = PREVIEW_STATES[activeStateKey];
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.overview.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const interactiveProps = useMemo(() => {
    const updateTopLevel = (field, label) => (value) => {
      setViewProps((current) => ({ ...current, [field]: value }));
      setFeedback(`${label} updated.`);
    };

    const entries = viewProps.entries.map((entry) => ({
      ...entry,
      onSelect: () => setFeedback(`Selected ${entry.nameDisplay}.`),
      onChangeName: (value) => {
        setViewProps((current) => ({
          ...current,
          entries: current.entries.map((candidate) =>
            candidate.id === entry.id
              ? { ...candidate, nameValue: value, nameDisplay: value || "Untitled Object" }
              : candidate
          ),
          activeEntry:
            current.activeEntry?.id === entry.id
              ? {
                  ...current.activeEntry,
                  nameValue: value,
                  nameDisplay: value || "Untitled Object",
                }
              : current.activeEntry,
        }));
        setFeedback("Entry name updated.");
      },
      onDelete: () => setFeedback(`Delete ${entry.nameDisplay}.`),
    }));

    return {
      ...viewProps,
      entries,
      activeEntry:
        entries.find((entry) => entry.id === viewProps.activeEntry?.id) || null,
      onChangeRegistryTitle: updateTopLevel(
        "registryTitleValue",
        "Registry title"
      ),
      onChangeRegistryScope: updateTopLevel(
        "registryScopeValue",
        "Registry scope"
      ),
      onChangeRegistryDescription: updateTopLevel(
        "registryDescriptionValue",
        "Registry description"
      ),
      onAddEntry: () => setFeedback("Add Entry selected."),
      onChangePromptSummary: updateTopLevel(
        "promptSummaryValue",
        "Prompt summary"
      ),
      onChangePromptUsageNotes: updateTopLevel(
        "promptUsageNotesValue",
        "Usage notes"
      ),
      onChangePromptNegativeNotes: updateTopLevel(
        "promptNegativeNotesValue",
        "Negative prompt notes"
      ),
    };
  }, [viewProps]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Item Registry Fields Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders every portable Item Registry Creation Edit
            section without loading Creations or opening linked-Creation
            pickers.
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
          <ItemRegistryFieldsSectionView {...interactiveProps} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain normalized entries, options, payload text, and
            semantic callbacks. Starting-holder creation selection and registry
            storage remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
