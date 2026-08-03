"use client";

import { useEffect, useMemo, useState } from "react";

import WardrobeFieldsSectionView from "@/components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view";
import {
  wardrobeFieldsEmptyFixture,
  wardrobeFieldsEntriesFixture,
  wardrobeFieldsOverviewFixture,
  wardrobeFieldsRulesFixture,
} from "@/components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.fixtures";

const PREVIEW_STATES = {
  overview: { label: "Overview", props: wardrobeFieldsOverviewFixture },
  entries: { label: "Entries", props: wardrobeFieldsEntriesFixture },
  rules: { label: "Rules", props: wardrobeFieldsRulesFixture },
  empty: { label: "Empty", props: wardrobeFieldsEmptyFixture },
};

function cloneFixture(fixture) {
  const entries = fixture.entries.map((entry) => ({ ...entry }));
  const activeEntryId = fixture.activeEntry?.id || null;

  return {
    ...fixture,
    entries,
    activeEntry:
      entries.find((entry) => entry.id === activeEntryId) || null,
  };
}

export default function WardrobeFieldsSectionPreviewClient() {
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

    const updateEntry = (entryId, updates, message) => {
      setViewProps((current) => {
        const entries = current.entries.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        );

        return {
          ...current,
          entries,
          activeEntry:
            entries.find((entry) => entry.id === current.activeEntry?.id) ||
            null,
        };
      });
      setFeedback(message);
    };

    const entries = viewProps.entries.map((entry) => ({
      ...entry,
      onSelect: () => {
        setViewProps((current) => ({
          ...current,
          activeEntry:
            current.entries.find((candidate) => candidate.id === entry.id) ||
            null,
        }));
        setFeedback(`Selected ${entry.labelDisplay}.`);
      },
      onChangeLabel: (value) =>
        updateEntry(
          entry.id,
          { labelValue: value, labelDisplay: value || "Untitled Outfit Entry" },
          "Entry label updated."
        ),
      onChangeEnabled: (value) =>
        updateEntry(
          entry.id,
          {
            enabledChecked: value,
            enabledDisplay: value ? "Enabled" : "Disabled",
          },
          "Entry availability updated."
        ),
      onChooseOutfit: () => setFeedback("Open Outfit picker."),
      onDelete: () => setFeedback(`Delete ${entry.labelDisplay}.`),
    }));

    return {
      ...viewProps,
      entries,
      activeEntry:
        entries.find((entry) => entry.id === viewProps.activeEntry?.id) || null,
      onChangeWardrobeTitle: updateTopLevel(
        "wardrobeTitleValue",
        "Wardrobe title"
      ),
      onChangeWardrobeScope: updateTopLevel(
        "wardrobeScopeValue",
        "Wardrobe scope"
      ),
      onChangeWardrobeDescription: updateTopLevel(
        "wardrobeDescriptionValue",
        "Wardrobe description"
      ),
      onAddEntry: () => setFeedback("Add Entry selected."),
      onChangeFallbackMode: updateTopLevel(
        "fallbackModeValue",
        "Fallback mode"
      ),
      onChangeAllowRandom: updateTopLevel(
        "allowRandomChecked",
        "Random selection"
      ),
      onChangePromptSummary: updateTopLevel(
        "promptSummaryValue",
        "Prompt summary"
      ),
      onChangePromptUsageNotes: updateTopLevel(
        "promptUsageNotesValue",
        "Usage notes"
      ),
      onChangeImagePrompt: updateTopLevel(
        "imagePromptValue",
        "Image prompt"
      ),
      onChangeNegativePrompt: updateTopLevel(
        "negativePromptValue",
        "Negative prompt"
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
            Wardrobe Fields Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Wardrobe Creation Edit sections
            without loading Outfit creations or opening the Outfit picker.
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
          <WardrobeFieldsSectionView {...interactiveProps} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain normalized Outfit entries, selection rules,
            prompts, and semantic callbacks. Outfit creation loading and
            Wardrobe storage remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
