"use client";

import { useState } from "react";

import StoryRoomStatePanelView from "@/components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view";
import {
  storyRoomStateEmptySectionsFixture,
  storyRoomStateEngineFixture,
  storyRoomStateLongContentFixture,
  storyRoomStateMobileFixture,
  storyRoomStateNoActionsFixture,
  storyRoomStateRoomFallbackFixture,
} from "@/components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.fixtures";

const PREVIEW_STATES = {
  engine: {
    label: "Engine State",
    props: storyRoomStateEngineFixture,
  },
  roomFallback: {
    label: "Room Fallback",
    props: storyRoomStateRoomFallbackFixture,
  },
  mobile: {
    label: "Mobile Drawer",
    props: storyRoomStateMobileFixture,
  },
  longContent: {
    label: "Long Content",
    props: storyRoomStateLongContentFixture,
  },
  noActions: {
    label: "No Actions",
    props: storyRoomStateNoActionsFixture,
  },
  emptySections: {
    label: "Empty Sections",
    props: storyRoomStateEmptySectionsFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    sections: fixture.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({ ...row })),
    })),
    actions: fixture.actions.map((action) => ({ ...action })),
  };
}

export default function StoryRoomStatePanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("engine");
  const [panelProps, setPanelProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.engine.props)
  );
  const [panelVisible, setPanelVisible] = useState(true);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Story Room or engine operation is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPanelProps(cloneFixture(nextState.props));
    setPanelVisible(true);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function closePanel() {
    setPanelVisible(false);
    setLastAction("Closed the preview panel locally.");
  }

  function reopenPanel() {
    setPanelVisible(true);
    setLastAction("Reopened the preview panel locally.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Room State Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. Close and reopen behavior affects only local preview
            state; no Story Room, engine module, export, or share workflow is
            connected.
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

            {!panelVisible ? (
              <button
                type="button"
                onClick={reopenPanel}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                Reopen Panel
              </button>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <div className="max-w-sm">
          {panelVisible ? (
            <StoryRoomStatePanelView
              {...panelProps}
              onClosePanel={
                panelProps.showCloseControl ? closePanel : null
              }
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/25 p-8 text-sm text-[var(--muted)]">
              The preview panel is closed. Use Reopen Panel above to restore it.
            </div>
          )}
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready sections, rows, disabled future
            actions, close-control visibility, and semantic close intent. Story
            snapshots, engine results, room-state fallback logic, chat layout,
            mobile drawer ownership, APIs, export/share behavior, and
            persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
