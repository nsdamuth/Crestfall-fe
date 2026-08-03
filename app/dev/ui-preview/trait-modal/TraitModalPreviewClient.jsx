"use client";

import { useState } from "react";

import TraitModalView from "@/components/studio/create/character/trait/TraitModal.view";
import {
  traitModalClosedFixture,
  traitModalCustomFixture,
  traitModalEmptyFixture,
  traitModalLongContentFixture,
  traitModalNoDescriptionFixture,
  traitModalPresetFixture,
} from "@/components/studio/create/character/trait/TraitModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: traitModalClosedFixture,
  },
  preset: {
    label: "Preset Value",
    props: traitModalPresetFixture,
  },
  empty: {
    label: "Not Chosen",
    props: traitModalEmptyFixture,
  },
  custom: {
    label: "Custom Entry",
    props: traitModalCustomFixture,
  },
  noDescription: {
    label: "No Description",
    props: traitModalNoDescriptionFixture,
  },
  longContent: {
    label: "Long Content",
    props: traitModalLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    options: (fixture.options || []).map((option) => ({ ...option })),
  };
}

function getOptionLabel(options, optionId) {
  return (
    options.find((option) => option.id === optionId)?.label ||
    optionId ||
    "Not chosen"
  );
}

export default function TraitModalPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(traitModalClosedFixture)
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
    const selectedOption = previewProps.options.find(
      (option) => option.id === optionId
    );

    if (selectedOption?.isCustom) {
      setPreviewProps((current) => ({ ...current, customActive: true }));
      setLastAction("Opened custom entry mode. This is fixture-only.");
      return;
    }

    setPreviewProps((current) => ({
      ...current,
      open: false,
      customActive: false,
      triggerSummary: getOptionLabel(current.options, optionId),
      options: current.options.map((option) => ({
        ...option,
        isSelected: option.id === optionId,
      })),
    }));
    setLastAction(
      `Selected ${getOptionLabel(previewProps.options, optionId)}. Nothing was saved.`
    );
  }

  function changeCustomValue(value) {
    setPreviewProps((current) => ({
      ...current,
      customValue: value,
    }));
    setLastAction("Changed custom fixture text. Nothing was saved.");
  }

  function backFromCustom() {
    setPreviewProps((current) => ({ ...current, customActive: false }));
    setLastAction("Returned to the fixture option list.");
  }

  function useCustomValue() {
    const nextValue = String(previewProps.customValue || "").trim();

    if (!nextValue) return;

    setPreviewProps((current) => ({
      ...current,
      open: false,
      customActive: false,
      customValue: "",
      triggerSummary: nextValue,
      options: current.options.map((option) => ({
        ...option,
        isSelected: false,
      })),
    }));
    setLastAction(`Used custom value “${nextValue}”. Nothing was saved.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Trait Modal</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load or update a Crestfall character,
            player-character, or character-template form.
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
            <TraitModalView
              {...previewProps}
              onOpen={openPreview}
              onClose={closePreview}
              onChooseOption={chooseOption}
              onChangeCustomValue={changeCustomValue}
              onBackFromCustom={backFromCustom}
              onUseCustomValue={useCustomValue}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready trait options and semantic actions.
            Crestfall field mapping, preset/custom routing, and form updates
            remain in the ViewModel.
          </p>
        </section>
      </div>
    </main>
  );
}
