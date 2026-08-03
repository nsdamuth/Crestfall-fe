"use client";

import { useState } from "react";

import CrestfallOptionModalView from "@/components/ui/crestfall-option-modal/CrestfallOptionModal.view";
import {
  crestfallOptionModalClosedFixture,
  crestfallOptionModalCustomFixture,
  crestfallOptionModalGroupedFixture,
  crestfallOptionModalLongContentFixture,
  crestfallOptionModalModernFixture,
  crestfallOptionModalNoResultsFixture,
} from "@/components/ui/crestfall-option-modal/CrestfallOptionModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: crestfallOptionModalClosedFixture,
  },
  grouped: {
    label: "Grouped Options",
    props: crestfallOptionModalGroupedFixture,
  },
  modern: {
    label: "Modern Group",
    props: crestfallOptionModalModernFixture,
  },
  custom: {
    label: "Custom Entry",
    props: crestfallOptionModalCustomFixture,
  },
  noResults: {
    label: "No Results",
    props: crestfallOptionModalNoResultsFixture,
  },
  longContent: {
    label: "Long Content",
    props: crestfallOptionModalLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    groups: [...(fixture.groups || [])],
    options: (fixture.options || []).map((option) => ({ ...option })),
  };
}

export default function CrestfallOptionModalPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(crestfallOptionModalClosedFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall form is connected."
  );

  function loadState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Loaded the ${state.label} fixture.`);
  }

  function openPreview() {
    setPreviewProps((current) => ({ ...current, open: true }));
    setLastAction("Opened the fixture-only option picker.");
  }

  function closePreview() {
    setPreviewProps((current) => ({ ...current, open: false }));
    setLastAction("Closed the fixture-only picker. No application data changed.");
  }

  function chooseOption(optionId) {
    if (optionId === "CUSTOM") {
      setPreviewProps((current) => ({ ...current, customMode: true }));
      setLastAction("Opened fixture-only custom entry mode.");
      return;
    }

    const selectedOption = previewProps.options.find(
      (option) => option.id === optionId
    );

    setPreviewProps((current) => ({
      ...current,
      open: false,
      selectedLabel: selectedOption?.label || "Not chosen",
      options: current.options.map((option) => ({
        ...option,
        selected: option.id === optionId,
      })),
    }));
    setLastAction(
      `Selected ${selectedOption?.label || "None"}. This changed fixture state only.`
    );
  }

  function useCustom() {
    const nextValue = previewProps.customValue.trim();

    if (!nextValue) return;

    setPreviewProps((current) => ({
      ...current,
      open: false,
      customMode: false,
      selectedLabel: nextValue,
      customValue: "",
    }));
    setLastAction(`Applied custom role “${nextValue}” to fixture state only.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Crestfall Option Modal
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract fixtures.
            It does not load or update a character, player character, or template.
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
                onClick={() => loadState(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
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
            Interactive Trigger
          </p>
          <div className="mt-4 max-w-2xl">
            <CrestfallOptionModalView
              {...previewProps}
              onOpen={openPreview}
              onClose={closePreview}
              onSearchQueryChange={(searchQuery) =>
                setPreviewProps((current) => ({ ...current, searchQuery }))
              }
              onChooseGroup={(activeGroup) => {
                setPreviewProps((current) => ({ ...current, activeGroup }));
                setLastAction(
                  `Selected the ${activeGroup} fixture group. Display options remain fixture-controlled.`
                );
              }}
              onChooseOption={chooseOption}
              onCustomValueChange={(customValue) =>
                setPreviewProps((current) => ({ ...current, customValue }))
              }
              onBackFromCustom={() =>
                setPreviewProps((current) => ({
                  ...current,
                  customMode: false,
                }))
              }
              onUseCustom={useCustom}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready option cards and semantic actions.
            Source grouping, pinned-option ordering, custom-value application, and
            Crestfall form persistence remain in the ViewModel and caller.
          </p>
        </section>
      </div>
    </main>
  );
}
