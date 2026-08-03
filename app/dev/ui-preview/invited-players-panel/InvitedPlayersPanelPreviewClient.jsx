"use client";

import { useState } from "react";

import InvitedPlayersPanelView from "@/components/studio/room-templates/invited-players-panel/InvitedPlayersPanel.view";
import {
  invitedPlayersEmptyFixture,
  invitedPlayersLoadErrorFixture,
  invitedPlayersLongNamesFixture,
  invitedPlayersSeveralFixture,
  invitedPlayersSingleFixture,
} from "@/components/studio/room-templates/invited-players-panel/InvitedPlayersPanel.fixtures";

const PREVIEW_STATES = {
  empty: {
    label: "Empty",
    props: invitedPlayersEmptyFixture,
  },
  single: {
    label: "Single Player",
    props: invitedPlayersSingleFixture,
  },
  several: {
    label: "Several Players",
    props: invitedPlayersSeveralFixture,
  },
  loadError: {
    label: "Load Error",
    props: invitedPlayersLoadErrorFixture,
  },
  longNames: {
    label: "Long Names",
    props: invitedPlayersLongNamesFixture,
  },
};

const previewPlayerPool = Object.freeze([
  {
    id: "preview-ilyra",
    username: "ilyra_vale",
    avatarUrl: null,
    displayInitial: "I",
  },
  {
    id: "preview-sen",
    username: "archivist_sen",
    avatarUrl: null,
    displayInitial: "A",
  },
  {
    id: "preview-courier",
    username: "glass_courier",
    avatarUrl: null,
    displayInitial: "G",
  },
]);

function fixtureState(fixture) {
  return {
    invitedPlayers: [...fixture.invitedPlayers],
    loadError: fixture.loadError,
  };
}

export default function InvitedPlayersPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("several");
  const [panelState, setPanelState] = useState(() =>
    fixtureState(PREVIEW_STATES.several.props)
  );
  const [nextPlayerIndex, setNextPlayerIndex] = useState(0);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No mutual-follower query or Story package is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPanelState(fixtureState(nextState.props));
    setNextPlayerIndex(0);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function addPreviewPlayer() {
    const candidate = previewPlayerPool[nextPlayerIndex % previewPlayerPool.length];

    setPanelState((current) => {
      if (current.invitedPlayers.some((player) => player.id === candidate.id)) {
        return current;
      }

      return {
        ...current,
        invitedPlayers: [...current.invitedPlayers, candidate],
      };
    });
    setNextPlayerIndex((current) => current + 1);
    setLastAction(
      `Simulated selecting @${candidate.username} in preview-local state.`
    );
  }

  function removePreviewPlayer(playerId) {
    setPanelState((current) => ({
      ...current,
      invitedPlayers: current.invitedPlayers.filter(
        (player) => player.id !== playerId
      ),
    }));
    setLastAction("Removed one invitee from preview-local state.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Invited Players Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. Adding and removing invitees changes only local preview
            state and does not query followers, send invitations, or save a Story.
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

        <InvitedPlayersPanelView
          {...panelState}
          onOpenPlayerPicker={addPreviewPlayer}
          onRemovePlayer={removePreviewPlayer}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready invitees, a load-error message,
            and semantic add/remove callbacks. Mutual-follower loading, picker
            orchestration, raw player records, Story package updates, and future
            invitation delivery remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
