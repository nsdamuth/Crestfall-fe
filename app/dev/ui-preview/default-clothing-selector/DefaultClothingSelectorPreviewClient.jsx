"use client";

import { useEffect, useState } from "react";

import DefaultClothingSelectorView from "@/components/studio/create/character/default-clothing-selector/DefaultClothingSelector.view";
import {
  defaultClothingEmptyFixture,
  defaultClothingLongContentFixture,
  defaultClothingMissingCallbacksFixture,
  defaultClothingMissingCopyFixture,
  defaultClothingOutfitFixture,
  defaultClothingWardrobeFixture,
} from "@/components/studio/create/character/default-clothing-selector/DefaultClothingSelector.fixtures";

const PREVIEW_STATES = {
  empty: {
    label: "Empty",
    props: defaultClothingEmptyFixture,
  },
  outfit: {
    label: "Outfit",
    props: defaultClothingOutfitFixture,
  },
  wardrobe: {
    label: "Wardrobe",
    props: defaultClothingWardrobeFixture,
  },
  missingCopy: {
    label: "Fallback Copy",
    props: defaultClothingMissingCopyFixture,
  },
  longContent: {
    label: "Long Content",
    props: defaultClothingLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: defaultClothingMissingCallbacksFixture,
  },
};

export default function DefaultClothingSelectorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("outfit");
  const [selectedClothing, setSelectedClothing] = useState(
    PREVIEW_STATES.outfit.props.selectedClothing
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setSelectedClothing(activeState.props.selectedClothing);
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Default Clothing Selector
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable selected-clothing surface directly
            from contract-shaped fixtures. Picker actions are simulated locally
            and do not load owned Outfit or Wardrobe creations.
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
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <DefaultClothingSelectorView
                {...activeState.props}
                selectedClothing={selectedClothing}
                onOpenOutfitPicker={
                  callbacksEnabled
                    ? () => setFeedback("Open Outfit picker intent received.")
                    : null
                }
                onOpenWardrobePicker={
                  callbacksEnabled
                    ? () => setFeedback("Open Wardrobe picker intent received.")
                    : null
                }
                onClearDefaultClothing={
                  callbacksEnabled
                    ? () => {
                        setSelectedClothing(null);
                        setFeedback("Clear default clothing intent received.");
                      }
                    : null
                }
              />
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain only display-ready clothing values. Raw
              character form fields, owned-creation loading, selection
              normalization, picker disclosure, and draft updates remain
              application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
