"use client";

import { useState } from "react";

import IngredientPickerModalView from "@/components/studio/image-studio/ingredient-picker/IngredientPickerModal.view";
import {
  ingredientPickerCharacterFixture,
  ingredientPickerEmptyFixture,
  ingredientPickerLoadErrorFixture,
  ingredientPickerLongLabelFixture,
  ingredientPickerNoActionsFixture,
  ingredientPickerPresetActionsFixture,
} from "@/components/studio/image-studio/ingredient-picker/IngredientPickerModal.fixtures";

const PREVIEW_STATES = {
  character: {
    label: "Character",
    props: ingredientPickerCharacterFixture,
  },
  presetActions: {
    label: "Custom + Preset",
    props: ingredientPickerPresetActionsFixture,
  },
  empty: {
    label: "Empty",
    props: ingredientPickerEmptyFixture,
  },
  loadError: {
    label: "Load Error",
    props: ingredientPickerLoadErrorFixture,
  },
  noActions: {
    label: "No Extra Actions",
    props: ingredientPickerNoActionsFixture,
  },
  longLabel: {
    label: "Long Label",
    props: ingredientPickerLongLabelFixture,
  },
};

export default function IngredientPickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Image Studio session or creations are connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setLastAction("Modal closed. No Image Studio state was changed.");
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
            Image Studio Ingredient Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not load creations, alter composer ingredients, open the real
            custom editor, or create a preset.
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
            Fixture cards contain only display-ready values. Slot definitions,
            raw creation objects, selected ingredient storage, and the effects
            of custom or preset actions remain outside the View.
          </p>
        </section>
      </div>

      {activeState ? (
        <IngredientPickerModalView
          {...activeState.props}
          onClose={closePreview}
          onChooseIngredient={(itemId) =>
            recordAction(`Ingredient ${itemId || "unknown"} selected.`)
          }
          onUseCustom={() => recordAction("Use Once requested.")}
          onCreatePreset={() => recordAction("New Preset requested.")}
        />
      ) : null}
    </main>
  );
}
