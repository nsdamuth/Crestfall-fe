"use client";

import { useState } from "react";

import NpcEntryModalView from "@/components/studio/create/npc-registry/npc-entry/NpcEntryModal.view";
import {
  npcEntryDisabledCharactersFixture,
  npcEntryEmptyFixture,
  npcEntryLightweightFixture,
  npcEntryLinkedFixture,
  npcEntryLongContentFixture,
  npcEntryNoCharactersFixture,
} from "@/components/studio/create/npc-registry/npc-entry/NpcEntryModal.fixtures";

const PREVIEW_STATES = {
  lightweight: {
    label: "Lightweight NPC",
    props: npcEntryLightweightFixture,
  },
  linked: {
    label: "Linked Character",
    props: npcEntryLinkedFixture,
  },
  empty: {
    label: "Empty",
    props: npcEntryEmptyFixture,
  },
  noCharacters: {
    label: "No Characters",
    props: npcEntryNoCharactersFixture,
  },
  disabledCharacters: {
    label: "Already Linked",
    props: npcEntryDisabledCharactersFixture,
  },
  longContent: {
    label: "Long Content",
    props: npcEntryLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    modeOptions: (fixture.modeOptions || []).map((option) => ({ ...option })),
    characterCards: (fixture.characterCards || []).map((card) => ({ ...card })),
    selectedCharacterIds: [...(fixture.selectedCharacterIds || [])],
    disabledCharacterIds: [...(fixture.disabledCharacterIds || [])],
  };
}

export default function NpcEntryPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [previewProps, setPreviewProps] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No NPC Registry is connected."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function chooseMode(modeId) {
    setPreviewProps((current) => ({
      ...current,
      selectedModeId: modeId,
    }));
    setLastAction(`Changed the fixture entry mode to ${modeId}.`);
  }

  function chooseCharacter(characterId) {
    setPreviewProps((current) => {
      const character = (current.characterCards || []).find(
        (card) => card.id === characterId
      );

      return {
        ...current,
        selectedCharacterIds: characterId ? [characterId] : [],
        nameValue: character?.title || current.nameValue,
        notesValue:
          current.notesValue || character?.description || character?.subtitle || "",
      };
    });
    setLastAction("Selected a fixture character. Nothing was saved.");
  }

  function changeName(value) {
    setPreviewProps((current) => ({ ...current, nameValue: value }));
    setLastAction("Changed the fixture NPC name. Nothing was saved.");
  }

  function changeNotes(value) {
    setPreviewProps((current) => ({ ...current, notesValue: value }));
    setLastAction("Changed the fixture registry notes. Nothing was saved.");
  }

  function savePreview() {
    setLastAction(
      `Simulated saving ${previewProps?.nameValue || "a person entry"}. No application data changed.`
    );
  }

  function closePreview() {
    setActiveStateKey(null);
    setPreviewProps(null);
    setLastAction("Modal closed. No NPC Registry data changed.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">NPC Person Entry Modal</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load, change, or save an NPC Registry.
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
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives semantic entry modes, display-ready character
            cards, selected and unavailable IDs, and semantic actions. Registry
            draft keys and linked-creation behavior remain in the ViewModel and
            its live callers.
          </p>
        </section>
      </div>

      {previewProps ? (
        <NpcEntryModalView
          {...previewProps}
          onClose={closePreview}
          onChooseMode={chooseMode}
          onChooseCharacter={chooseCharacter}
          onChangeName={changeName}
          onChangeNotes={changeNotes}
          onSave={savePreview}
        />
      ) : null}
    </main>
  );
}
