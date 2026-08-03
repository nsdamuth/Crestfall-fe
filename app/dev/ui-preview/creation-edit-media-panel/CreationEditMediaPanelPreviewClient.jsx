"use client";

import { useState } from "react";

import CreationEditMediaPanelView from "@/components/studio/my-creations/creation-edit-media-panel/CreationEditMediaPanel.view";
import {
  creationEditMediaAlternateActiveFixture,
  creationEditMediaEmptyFixture,
  creationEditMediaIngredientFixture,
  creationEditMediaLongLabelsFixture,
  creationEditMediaNoCreationIdFixture,
  creationEditMediaPopulatedFixture,
} from "@/components/studio/my-creations/creation-edit-media-panel/CreationEditMediaPanel.fixtures";

const FEATURED_SLOT_KEYS = ["primary", "alt1", "alt2", "alt3"];

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: creationEditMediaPopulatedFixture,
  },
  empty: {
    label: "Empty Slots",
    props: creationEditMediaEmptyFixture,
  },
  alternate: {
    label: "Alternate Active",
    props: creationEditMediaAlternateActiveFixture,
  },
  ingredient: {
    label: "Image Ingredient",
    props: creationEditMediaIngredientFixture,
  },
  noCreationId: {
    label: "No Creation ID",
    props: creationEditMediaNoCreationIdFixture,
  },
  longLabels: {
    label: "Long Labels",
    props: creationEditMediaLongLabelsFixture,
  },
};

function fixtureState(fixture) {
  return {
    creationTitle: fixture.creationTitle,
    fallbackInitial: fixture.fallbackInitial,
    activeMedia: fixture.activeMedia,
    featuredSlots: fixture.featuredSlots.map((slot) => ({ ...slot })),
    imageLibraryHref: fixture.imageLibraryHref,
    supportsChatMedia: fixture.supportsChatMedia,
  };
}

export default function CreationEditMediaPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("populated");
  const [panelState, setPanelState] = useState(() =>
    fixtureState(PREVIEW_STATES.populated.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No creation, image library, or save workflow is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPanelState(fixtureState(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function selectFeaturedSlot(slotIndex) {
    setPanelState((current) => {
      const nextSlots = current.featuredSlots.map((slot) => ({
        ...slot,
        isActive: slot.index === slotIndex,
      }));

      return {
        ...current,
        featuredSlots: nextSlots,
        activeMedia:
          nextSlots.find((slot) => slot.index === slotIndex) || null,
        imageLibraryHref:
          current.imageLibraryHref === "#"
            ? "#"
            : `/studio/my-creations/preview-creation/image-library?slot=${
                FEATURED_SLOT_KEYS[slotIndex] || "primary"
              }`,
      };
    });
    setLastAction(`Selected featured-media slot ${slotIndex + 1} locally.`);
  }

  function handlePreviewNavigation(event) {
    const link = event.target.closest?.("a");

    if (!link) {
      return;
    }

    event.preventDefault();
    setLastAction(`Preview navigation intercepted for ${link.getAttribute("href")}.`);
  }

  function replaceActiveSlot() {
    const activeSlot = panelState.featuredSlots.find((slot) => slot.isActive);

    setLastAction(
      `Simulated opening Replace Slot for ${activeSlot?.label || "the active slot"}.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Edit Media Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. Slot selection and replacement actions modify only local
            preview state and never load or save creation media.
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

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <div className="max-w-md" onClickCapture={handlePreviewNavigation}>
          <CreationEditMediaPanelView
            {...panelState}
            onSelectFeaturedSlot={selectFeaturedSlot}
            onReplaceActiveSlot={replaceActiveSlot}
          />
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready featured slots, navigation, creation
            labeling, the current chat-capability presentation state, and semantic
            slot callbacks. Creation forms, slot storage keys, image picker state,
            route construction, API calls, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
