"use client";

import { useState } from "react";

import SkinToneModalView from "@/components/studio/create/character/skin-tone/SkinToneModal.view";
import {
  skinToneClosedFixture,
  skinToneCustomFixture,
  skinToneEmptyFixture,
  skinToneLongContentFixture,
  skinTonePresetFixture,
} from "@/components/studio/create/character/skin-tone/SkinToneModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: skinToneClosedFixture,
  },
  preset: {
    label: "Preset Value",
    props: skinTonePresetFixture,
  },
  empty: {
    label: "Not Chosen",
    props: skinToneEmptyFixture,
  },
  custom: {
    label: "Custom Value",
    props: skinToneCustomFixture,
  },
  longContent: {
    label: "Long Content",
    props: skinToneLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    options: (fixture.options || []).map((option) => ({
      ...option,
      swatchStyle: option.swatchStyle ? { ...option.swatchStyle } : {},
    })),
  };
}

function getOptionLabel(options, optionId) {
  return (
    options.find((option) => option.id === optionId)?.label ||
    optionId ||
    "Not chosen"
  );
}

export default function SkinTonePreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(skinToneClosedFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall character is connected."
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
    setPreviewProps((current) => ({ ...current, open: false }));
    setLastAction("Closed the fixture-only modal. No application data changed.");
  }

  function chooseOption(optionId) {
    const selectedOption = previewProps.options.find(
      (option) => option.id === optionId
    );
    const customActive = Boolean(selectedOption?.isCustom);

    setPreviewProps((current) => ({
      ...current,
      selectedOptionId: optionId,
      customActive,
      customValue: customActive ? current.customValue : "",
      triggerSummary: customActive
        ? current.customValue || "Custom"
        : getOptionLabel(current.options, optionId),
      open: customActive,
    }));
    setLastAction(
      `Skin tone changed to ${getOptionLabel(
        previewProps.options,
        optionId
      )}. This was fixture-only.`
    );
  }

  function changeCustomValue(value) {
    setPreviewProps((current) => ({
      ...current,
      selectedOptionId: "CUSTOM",
      customActive: true,
      customValue: String(value || "").slice(0, current.customValueMaxLength),
      triggerSummary: String(value || "").trim() || "Custom",
    }));
    setLastAction("Custom fixture text changed. Nothing was saved.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Skin Tone Modal</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load a character form or save appearance
            data.
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
            <SkinToneModalView
              {...previewProps}
              onOpen={openPreview}
              onClose={closePreview}
              onChooseOption={chooseOption}
              onChangeCustomValue={changeCustomValue}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready skin-tone swatches and semantic
            actions. Crestfall form-field mapping, preset/custom detection, and
            character persistence remain in the ViewModel.
          </p>
        </section>
      </div>
    </main>
  );
}
