"use client";

import { useState } from "react";

import CharacterColorPaletteModalView from "@/components/studio/create/character/character-color-palette/CharacterColorPaletteModal.view";
import {
  characterColorPaletteClosedFixture,
  characterColorPaletteDefaultFixture,
  characterColorPaletteEmptyFixture,
  characterColorPaletteLongContentFixture,
  characterColorPaletteSeasonalFixture,
} from "@/components/studio/create/character/character-color-palette/CharacterColorPaletteModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: characterColorPaletteClosedFixture,
  },
  defaultPalette: {
    label: "Default Palette",
    props: characterColorPaletteDefaultFixture,
  },
  seasonal: {
    label: "Seasonal Palette",
    props: characterColorPaletteSeasonalFixture,
  },
  empty: {
    label: "No Palettes",
    props: characterColorPaletteEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterColorPaletteLongContentFixture,
  },
};

function clonePalette(palette = {}) {
  return {
    ...palette,
    swatches: [...(palette.swatches || [])],
    previewColors: { ...(palette.previewColors || {}) },
  };
}

function cloneFixture(fixture) {
  return {
    ...fixture,
    triggerPalette: clonePalette(fixture.triggerPalette),
    paletteFamilies: (fixture.paletteFamilies || []).map((family) => ({
      ...family,
      palettes: (family.palettes || []).map(clonePalette),
    })),
  };
}

function findPalette(families, paletteId) {
  for (const family of families) {
    const palette = (family.palettes || []).find((item) => item.id === paletteId);
    if (palette) return palette;
  }

  return null;
}

export default function CharacterColorPalettePreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(characterColorPaletteClosedFixture)
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
    setLastAction("Opened the fixture-only palette selector.");
  }

  function closePreview() {
    setPreviewProps((current) => ({ ...current, open: false }));
    setLastAction("Closed the fixture-only selector. No application data changed.");
  }

  function choosePalette(paletteId) {
    const selectedPalette = findPalette(previewProps.paletteFamilies, paletteId);

    if (!selectedPalette) return;

    setPreviewProps((current) => ({
      ...current,
      open: false,
      selectedPaletteId: paletteId,
      triggerPalette: clonePalette(selectedPalette),
    }));
    setLastAction(
      `Selected ${selectedPalette.label}. This changed fixture state only.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Color Palette Modal
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract fixtures.
            It does not load a character or save a palette preference.
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
            <CharacterColorPaletteModalView
              {...previewProps}
              onOpen={openPreview}
              onClose={closePreview}
              onChoosePalette={choosePalette}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready palette families and semantic actions.
            Crestfall palette constants, fallback selection, and character form
            persistence remain in the ViewModel and caller.
          </p>
        </section>
      </div>
    </main>
  );
}
