"use client";

import { useMemo, useState } from "react";

import ScenarioReferencePickerModalView from "@/components/studio/create/scenario/scenario-reference-picker/ScenarioReferencePickerModal.view";
import {
  scenarioReferencePickerEmptyFixture,
  scenarioReferencePickerLongContentFixture,
  scenarioReferencePickerMultipleFixture,
  scenarioReferencePickerSearchEmptyFixture,
  scenarioReferencePickerSingleFixture,
} from "@/components/studio/create/scenario/scenario-reference-picker/ScenarioReferencePickerModal.fixtures";

const PREVIEW_STATES = {
  multiple: {
    label: "Multiple Selection",
    props: scenarioReferencePickerMultipleFixture,
  },
  single: {
    label: "Single Selection",
    props: scenarioReferencePickerSingleFixture,
  },
  empty: {
    label: "Empty",
    props: scenarioReferencePickerEmptyFixture,
  },
  searchEmpty: {
    label: "No Search Results",
    props: scenarioReferencePickerSearchEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: scenarioReferencePickerLongContentFixture,
  },
};

export default function ScenarioReferencePickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Scenario, registry binding, or creation reference is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  const previewProps = useMemo(() => {
    if (!activeState) return null;

    const baseItems = activeState.props.items || [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredItems = normalizedQuery
      ? baseItems.filter((item) =>
          [item.title, item.subtitle, item.typeLabel, item.ratingLabel]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : baseItems;

    const items = filteredItems.map((item) => ({
      ...item,
      isSelected: selectedIds.includes(item.id),
    }));

    return {
      ...activeState.props,
      searchQuery,
      items,
      selectedCount: selectedIds.length,
      showSelectedCount:
        activeState.props.showDoneAction && selectedIds.length > 0,
    };
  }, [activeState, searchQuery, selectedIds]);

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];
    const initialSelectedIds = (state.props.items || [])
      .filter((item) => item.isSelected)
      .map((item) => item.id);

    setActiveStateKey(stateKey);
    setSearchQuery(state.props.searchQuery || "");
    setSelectedIds(initialSelectedIds);
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setSearchQuery("");
    setSelectedIds([]);
    setLastAction("Modal closed. No Scenario reference data was changed.");
  }

  function chooseItem(itemId) {
    if (!activeState) return;

    if (activeState.props.showDoneAction) {
      setSelectedIds((current) =>
        current.includes(itemId)
          ? current.filter((id) => id !== itemId)
          : [...current, itemId]
      );
      setLastAction(
        `Reference ${itemId || "unknown"} toggled in fixture-only multiple-selection state.`
      );
      return;
    }

    setSelectedIds(itemId ? [itemId] : []);
    setLastAction(
      `Reference ${itemId || "unknown"} selected in fixture-only single-selection state.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Scenario Reference Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load creations, update a Scenario,
            or persist registry bindings.
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
            Fixture cards contain display-ready reference content only.
            Scenario fields, raw option objects, registry bindings, and
            single-versus-multiple persistence behavior remain outside the
            View.
          </p>
        </section>
      </div>

      {previewProps ? (
        <ScenarioReferencePickerModalView
          {...previewProps}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            setLastAction(`Search changed to “${value}”.`);
          }}
          onChooseItem={chooseItem}
          onClose={closePreview}
        />
      ) : null}
    </main>
  );
}
