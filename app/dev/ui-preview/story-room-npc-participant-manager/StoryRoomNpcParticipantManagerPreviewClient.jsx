"use client";

import { useState } from "react";

import StoryRoomNpcParticipantManagerView from "@/components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.view";
import {
  storyRoomNpcParticipantBusyFixture,
  storyRoomNpcParticipantClosedFixture,
  storyRoomNpcParticipantCompleteFixture,
  storyRoomNpcParticipantEmptyRegistryFixture,
  storyRoomNpcParticipantErrorFixture,
  storyRoomNpcParticipantLoadingFixture,
  storyRoomNpcParticipantLongContentFixture,
  storyRoomNpcParticipantNoRegistryFixture,
  storyRoomNpcParticipantUnavailableFixture,
} from "@/components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete",
    props: storyRoomNpcParticipantCompleteFixture,
  },
  closed: {
    label: "Closed",
    props: storyRoomNpcParticipantClosedFixture,
  },
  loading: {
    label: "Loading",
    props: storyRoomNpcParticipantLoadingFixture,
  },
  noRegistry: {
    label: "No Registry",
    props: storyRoomNpcParticipantNoRegistryFixture,
  },
  emptyRegistry: {
    label: "Empty Registry",
    props: storyRoomNpcParticipantEmptyRegistryFixture,
  },
  error: {
    label: "Error",
    props: storyRoomNpcParticipantErrorFixture,
  },
  busy: {
    label: "Busy",
    props: storyRoomNpcParticipantBusyFixture,
  },
  unavailable: {
    label: "Unavailable Source",
    props: storyRoomNpcParticipantUnavailableFixture,
  },
  longContent: {
    label: "Long Content",
    props: storyRoomNpcParticipantLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    sections: fixture.sections.map((section) => ({
      ...section,
      entries: section.entries.map((entry) => ({ ...entry })),
    })),
  };
}

export default function StoryRoomNpcParticipantManagerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [panelProps, setPanelProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.complete.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Story Room NPC lifecycle operation is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPanelProps(cloneFixture(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function togglePanel() {
    setPanelProps((current) => ({
      ...current,
      isOpen: !current.isOpen,
    }));
    setLastAction("Toggled the preview disclosure locally.");
  }

  function activateNpc(actionId) {
    setLastAction(`Activated preview NPC action: ${actionId}.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Room NPC Participant Manager
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. Disclosure and NPC actions affect local preview feedback
            only; no Story Room, registry lifecycle, API, or persistence
            workflow is connected.
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

        <div className="max-w-sm">
          <StoryRoomNpcParticipantManagerView
            {...panelProps}
            onTogglePanel={togglePanel}
            onActivateNpc={activateNpc}
          />
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready notices, sections, NPC cards,
            action states, and opaque semantic action IDs. Story Room lifecycle
            payloads, raw registry and participant identifiers, API calls,
            snapshot updates, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
