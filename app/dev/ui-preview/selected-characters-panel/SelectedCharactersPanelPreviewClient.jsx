"use client";

import { useState } from "react";

import SelectedCharactersPanelView from "@/components/studio/room-templates/selected-characters-panel/SelectedCharactersPanel.view";
import {
  selectedCharactersEmptyFixture,
  selectedCharactersLongContentFixture,
  selectedCharactersMultipleFixture,
  selectedCharactersNoSubtitleFixture,
  selectedCharactersSingleFixture,
} from "@/components/studio/room-templates/selected-characters-panel/SelectedCharactersPanel.fixtures";

const PREVIEW_STATES = {
  empty: {
    label: "Empty",
    props: selectedCharactersEmptyFixture,
  },
  single: {
    label: "One Character",
    props: selectedCharactersSingleFixture,
  },
  multiple: {
    label: "Several Characters",
    props: selectedCharactersMultipleFixture,
  },
  noSubtitle: {
    label: "No Subtitle",
    props: selectedCharactersNoSubtitleFixture,
  },
  longContent: {
    label: "Long Content",
    props: selectedCharactersLongContentFixture,
  },
};

const PREVIEW_ADDITION = {
  id: "character-preview-guest",
  title: "Preview Guest",
  subtitle: "Added only inside the isolated preview",
  initial: "P",
};

export default function SelectedCharactersPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("multiple");
  const [characters, setCharacters] = useState(() => [
    ...PREVIEW_STATES.multiple.props.characters,
  ]);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Story package or character picker is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setCharacters([...nextState.props.characters]);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function addPreviewCharacter() {
    setCharacters((current) => {
      if (current.some((character) => character.id === PREVIEW_ADDITION.id)) {
        return current;
      }

      return [...current, PREVIEW_ADDITION];
    });
    setLastAction(
      "Simulated opening the character picker and added a preview-only character."
    );
  }

  function removePreviewCharacter(characterId) {
    const character = characters.find((item) => item.id === characterId);

    setCharacters((current) =>
      current.filter((item) => item.id !== characterId)
    );
    setLastAction(
      `Removed ${character?.title || "a character"} from preview-local state.`
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
            Selected Characters Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. It does not open the real creation picker, modify a Story
            package, attach participants, or save data.
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

        <SelectedCharactersPanelView
          characters={characters}
          onOpenCharacterPicker={addPreviewCharacter}
          onRemoveCharacter={removePreviewCharacter}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready character IDs, titles,
            subtitles, initials, and semantic callbacks. Story package fields,
            creation-reference objects, picker orchestration, selection
            mutation, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
