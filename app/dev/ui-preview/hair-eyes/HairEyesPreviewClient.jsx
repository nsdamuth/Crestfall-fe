"use client";

import { useState } from "react";

import HairEyesModalView from "@/components/studio/create/character/hair-eyes/HairEyesModal.view";
import {
  hairEyesClosedFixture,
  hairEyesCustomFixture,
  hairEyesEmptyFixture,
  hairEyesLongCustomFixture,
  hairEyesPresetFixture,
} from "@/components/studio/create/character/hair-eyes/HairEyesModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: hairEyesClosedFixture,
  },
  preset: {
    label: "Preset Values",
    props: hairEyesPresetFixture,
  },
  empty: {
    label: "Not Chosen",
    props: hairEyesEmptyFixture,
  },
  custom: {
    label: "Custom Values",
    props: hairEyesCustomFixture,
  },
  longCustom: {
    label: "Long Content",
    props: hairEyesLongCustomFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    sections: (fixture.sections || []).map((section) => ({
      ...section,
      options: (section.options || []).map((option) => ({
        ...option,
        swatchStyle: option.swatchStyle
          ? { ...option.swatchStyle }
          : null,
      })),
    })),
  };
}

function getOptionLabel(section, optionId) {
  return (
    section?.options?.find((option) => option.id === optionId)?.label ||
    optionId ||
    "Not chosen"
  );
}

export default function HairEyesPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(hairEyesClosedFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall character, Player Character, or template is connected."
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

  function chooseOption(sectionId, optionId) {
    const selectedSection = previewProps.sections.find(
      (section) => section.id === sectionId
    );
    const selectedOption = selectedSection?.options?.find(
      (option) => option.id === optionId
    );
    const customActive = Boolean(selectedOption?.isCustom);

    setPreviewProps((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              selectedOptionId: optionId,
              customActive,
              customValue: customActive ? section.customValue : "",
            }
          : section
      ),
    }));
    setLastAction(
      `${selectedSection?.title || "Appearance"} changed to ${getOptionLabel(
        selectedSection,
        optionId
      )}. This was fixture-only.`
    );
  }

  function changeCustomValue(sectionId, value) {
    setPreviewProps((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              selectedOptionId: "CUSTOM",
              customActive: true,
              customValue: String(value || "").slice(
                0,
                current.customValueMaxLength
              ),
            }
          : section
      ),
    }));
    setLastAction("Custom fixture text changed. Nothing was saved.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Hair & Eyes Modal</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load a builder form or save appearance data.
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
          <div className="mt-4 max-w-md">
            <HairEyesModalView
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
            The View receives semantic appearance sections and display-ready
            options. Crestfall form-field names, custom-value detection, and
            builder persistence remain in the ViewModel.
          </p>
        </section>
      </div>
    </main>
  );
}
