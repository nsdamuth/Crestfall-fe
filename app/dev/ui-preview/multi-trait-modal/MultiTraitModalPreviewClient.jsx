"use client";

import { useState } from "react";

import MultiTraitModalView from "@/components/studio/create/character/multi-trait/MultiTraitModal.view";
import {
  multiTraitModalClosedFixture,
  multiTraitModalCustomFixture,
  multiTraitModalEmptyFixture,
  multiTraitModalExclusiveFixture,
  multiTraitModalLongContentFixture,
  multiTraitModalSelectedFixture,
} from "@/components/studio/create/character/multi-trait/MultiTraitModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: multiTraitModalClosedFixture,
  },
  selected: {
    label: "Multiple Selected",
    props: multiTraitModalSelectedFixture,
  },
  empty: {
    label: "Not Chosen",
    props: multiTraitModalEmptyFixture,
  },
  exclusive: {
    label: "Exclusive Value",
    props: multiTraitModalExclusiveFixture,
  },
  custom: {
    label: "Custom Entry",
    props: multiTraitModalCustomFixture,
  },
  longContent: {
    label: "Long Content",
    props: multiTraitModalLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    options: (fixture.options || []).map((option) => ({ ...option })),
  };
}

function getSelectedSummary(options) {
  const labels = options
    .filter((option) => option.isSelected && !option.isNone)
    .map((option) => option.label);

  return labels.length ? labels.join(" + ") : "Not chosen";
}

export default function MultiTraitModalPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(multiTraitModalClosedFixture)
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
    setLastAction("Opened the fixture-only modal.");
  }

  function closePreview() {
    setPreviewProps((current) => ({
      ...current,
      open: false,
      customActive: false,
    }));
    setLastAction("Closed the fixture-only modal. No application data changed.");
  }

  function chooseOption(optionId) {
    const chosenOption = previewProps.options.find(
      (option) => option.id === optionId
    );

    if (!chosenOption) return;

    if (chosenOption.isCustom) {
      setPreviewProps((current) => ({ ...current, customActive: true }));
      setLastAction("Opened custom entry mode. This is fixture-only.");
      return;
    }

    setPreviewProps((current) => {
      let nextOptions;

      if (chosenOption.isNone) {
        nextOptions = current.options.map((option) => ({
          ...option,
          isSelected: option.isNone,
        }));
      } else if (chosenOption.isExclusive) {
        nextOptions = current.options.map((option) => ({
          ...option,
          isSelected: option.id === optionId,
        }));
      } else {
        nextOptions = current.options.map((option) => ({
          ...option,
          isSelected: option.isExclusive
            ? false
            : option.id === optionId
              ? !option.isSelected
              : option.isSelected,
        }));
      }

      return {
        ...current,
        options: nextOptions,
        triggerSummary: getSelectedSummary(nextOptions),
      };
    });

    setLastAction(`Toggled ${chosenOption.label}. Nothing was saved.`);
  }

  function changeCustomValue(value) {
    setPreviewProps((current) => ({ ...current, customValue: value }));
    setLastAction("Changed custom fixture text. Nothing was saved.");
  }

  function backFromCustom() {
    setPreviewProps((current) => ({ ...current, customActive: false }));
    setLastAction("Returned to the fixture option list.");
  }

  function addCustomValue() {
    const nextValue = String(previewProps.customValue || "").trim();

    if (!nextValue) return;

    setPreviewProps((current) => ({
      ...current,
      customActive: false,
      customValue: "",
      triggerSummary:
        current.triggerSummary === "Not chosen"
          ? nextValue
          : `${current.triggerSummary} + ${nextValue}`,
    }));
    setLastAction(`Added custom value “${nextValue}”. Nothing was saved.`);
  }

  function finishSelection() {
    setPreviewProps((current) => ({ ...current, open: false }));
    setLastAction("Closed the fixture modal with Done. Nothing was saved.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Multi-Trait Modal</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load or update a Crestfall character or
            character-template form.
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
          <div className="mt-4 max-w-xl">
            <MultiTraitModalView
              {...previewProps}
              onOpen={openPreview}
              onClose={closePreview}
              onChooseOption={chooseOption}
              onChangeCustomValue={changeCustomValue}
              onBackFromCustom={backFromCustom}
              onAddCustomValue={addCustomValue}
              onDone={finishSelection}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready multi-select options and semantic
            actions. Crestfall field mapping, exclusive selection rules, and
            form updates remain in the ViewModel.
          </p>
        </section>
      </div>
    </main>
  );
}
