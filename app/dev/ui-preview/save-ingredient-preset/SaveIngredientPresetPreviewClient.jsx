"use client";

import { useState } from "react";

import SaveIngredientPresetModalView from "@/components/studio/image-studio/save-ingredient-preset/SaveIngredientPresetModal.view";
import {
  saveIngredientPresetErrorFixture,
  saveIngredientPresetLocationFixture,
  saveIngredientPresetLongContentFixture,
  saveIngredientPresetReadyFixture,
  saveIngredientPresetSavingFixture,
  saveIngredientPresetValidationFixture,
} from "@/components/studio/image-studio/save-ingredient-preset/SaveIngredientPresetModal.fixtures";

const PREVIEW_STATES = {
  ready: {
    label: "Ready",
    props: saveIngredientPresetReadyFixture,
  },
  saving: {
    label: "Saving",
    props: saveIngredientPresetSavingFixture,
  },
  validation: {
    label: "Missing Required Values",
    props: saveIngredientPresetValidationFixture,
  },
  error: {
    label: "Save Error",
    props: saveIngredientPresetErrorFixture,
  },
  location: {
    label: "Location Preset",
    props: saveIngredientPresetLocationFixture,
  },
  longContent: {
    label: "Long Content",
    props: saveIngredientPresetLongContentFixture,
  },
};

export default function SaveIngredientPresetPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [draftValues, setDraftValues] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Image Studio session or persistence is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;
  const viewProps = activeState
    ? {
        ...activeState.props,
        ...(draftValues || {}),
      }
    : null;

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setDraftValues(null);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setDraftValues(null);
    setLastAction("Modal closed. No preset was created or selected.");
  }

  function changeValue(key, value) {
    setDraftValues((current) => ({
      ...(current || {}),
      [key]: value,
    }));
  }

  function recordAction(message) {
    setLastAction(`${message} This was fixture-only and was not saved.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Save Ingredient Preset Modal
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not create a private draft, update the composer, or call a
            Crestfall API.
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
            Fixtures contain only display-ready form values. Image Studio slot
            configuration, creation payload construction, API calls, and the
            selection of a newly saved preset remain outside the View.
          </p>
        </section>
      </div>

      {viewProps ? (
        <SaveIngredientPresetModalView
          {...viewProps}
          onChangeName={(value) => changeValue("nameValue", value)}
          onChangeDescription={(value) =>
            changeValue("descriptionValue", value)
          }
          onChangePrompt={(value) => changeValue("promptValue", value)}
          onChangeTags={(value) => changeValue("tagsValue", value)}
          onSavePreset={() => recordAction("Save as Preset requested.")}
          onUseOnce={() => recordAction("Use Once requested.")}
          onClose={closePreview}
        />
      ) : null}
    </main>
  );
}
