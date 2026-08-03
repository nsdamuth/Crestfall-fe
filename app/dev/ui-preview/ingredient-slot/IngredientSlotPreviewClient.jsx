"use client";

import { useState } from "react";

import IngredientSlotView from "@/components/studio/image-studio/ingredient-slot/IngredientSlot.view";
import {
  ingredientSlotCustomFixture,
  ingredientSlotLongContentFixture,
  ingredientSlotMissingIconFixture,
  ingredientSlotNoSubtitleFixture,
  ingredientSlotOptionalEmptyFixture,
  ingredientSlotRequiredEmptyFixture,
  ingredientSlotSelectedFixture,
} from "@/components/studio/image-studio/ingredient-slot/IngredientSlot.fixtures";

const PREVIEW_STATES = {
  requiredEmpty: {
    label: "Required Empty",
    props: ingredientSlotRequiredEmptyFixture,
  },
  optionalEmpty: {
    label: "Optional Empty",
    props: ingredientSlotOptionalEmptyFixture,
  },
  selected: {
    label: "Selected",
    props: ingredientSlotSelectedFixture,
  },
  custom: {
    label: "Custom",
    props: ingredientSlotCustomFixture,
  },
  noSubtitle: {
    label: "No Subtitle",
    props: ingredientSlotNoSubtitleFixture,
  },
  longContent: {
    label: "Long Content",
    props: ingredientSlotLongContentFixture,
  },
  missingIcon: {
    label: "Missing Icon",
    props: ingredientSlotMissingIconFixture,
  },
};

export default function IngredientSlotPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("requiredEmpty");
  const [lastAction, setLastAction] = useState("No preview action yet.");
  const activeState = PREVIEW_STATES[activeStateKey];

  const previewProps = {
    ...activeState.props,
    onOpenSlot: () => setLastAction(`Opened ${activeState.props.label}.`),
    onClearSlot: () => setLastAction(`Cleared ${activeState.props.label}.`),
  };

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Ingredient Slot</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Image Studio slot View directly
            from contract-shaped fixtures. It does not open the real ingredient
            picker, compose a prompt, or save an Image Studio selection.
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
                onClick={() => {
                  setActiveStateKey(stateKey);
                  setLastAction("No preview action yet.");
                }}
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
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-6">
          <div className="mx-auto w-full max-w-xs">
            <IngredientSlotView {...previewProps} />
          </div>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures provide display-ready slot state and semantic callbacks.
            The live ViewModel remains responsible for reading the raw slot
            definition and selected ingredient record.
          </p>
        </section>
      </div>
    </main>
  );
}
