"use client";

import { useState } from "react";

import RoomTemplatePackagePickerModalView from "@/components/studio/create/room-template/room-template-package-picker/RoomTemplatePackagePickerModal.view";
import {
  roomTemplatePackagePickerCharactersFixture,
  roomTemplatePackagePickerEmptyFixture,
  roomTemplatePackagePickerLongContentFixture,
  roomTemplatePackagePickerNoResultsFixture,
  roomTemplatePackagePickerPlayersFixture,
  roomTemplatePackagePickerScenarioFixture,
} from "@/components/studio/create/room-template/room-template-package-picker/RoomTemplatePackagePickerModal.fixtures";

const PREVIEW_STATES = {
  characters: {
    label: "Characters",
    props: roomTemplatePackagePickerCharactersFixture,
  },
  players: {
    label: "Players",
    props: roomTemplatePackagePickerPlayersFixture,
  },
  scenario: {
    label: "Scenario",
    props: roomTemplatePackagePickerScenarioFixture,
  },
  empty: {
    label: "Empty",
    props: roomTemplatePackagePickerEmptyFixture,
  },
  noResults: {
    label: "Search Test",
    props: roomTemplatePackagePickerNoResultsFixture,
  },
  longContent: {
    label: "Long Content",
    props: roomTemplatePackagePickerLongContentFixture,
  },
};

export default function RoomTemplatePackagePickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No room package or player invitation is connected."
  );

  const activeState = activeStateKey ? PREVIEW_STATES[activeStateKey] : null;

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setLastAction("Modal closed. No room-package state was changed.");
  }

  function chooseItem(itemId) {
    setLastAction(
      `Item ${itemId || "unknown"} selected. This was fixture-only and was not saved.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Template Package Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not load Crestfall creations, invite a player, alter a room
            package, apply recommendations, or save application data.
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
            Fixture cards contain only display-ready values. Raw creation and
            profile records, room-template state, recommendation structures,
            and mode-specific callback routing remain outside the View.
          </p>
        </section>
      </div>

      {activeState ? (
        <RoomTemplatePackagePickerModalView
          {...activeState.props}
          onClose={closePreview}
          onChooseItem={chooseItem}
        />
      ) : null}
    </main>
  );
}
