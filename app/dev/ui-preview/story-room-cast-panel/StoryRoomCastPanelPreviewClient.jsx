"use client";

import { useMemo, useState } from "react";

import StoryRoomCastPanelView from "@/components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view";
import {
  storyRoomCastPanelCompleteFixture,
  storyRoomCastPanelErrorFixture,
  storyRoomCastPanelLockedFixture,
  storyRoomCastPanelLongContentFixture,
  storyRoomCastPanelMobileFixture,
  storyRoomCastPanelNoMediaFixture,
  storyRoomCastPanelSettingFixture,
} from "@/components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete",
    props: storyRoomCastPanelCompleteFixture,
  },
  noMedia: {
    label: "No Media",
    props: storyRoomCastPanelNoMediaFixture,
  },
  mobile: {
    label: "Mobile Placement",
    props: storyRoomCastPanelMobileFixture,
  },
  setting: {
    label: "Setting PC",
    props: storyRoomCastPanelSettingFixture,
  },
  errors: {
    label: "Errors",
    props: storyRoomCastPanelErrorFixture,
  },
  locked: {
    label: "Limited Actions",
    props: storyRoomCastPanelLockedFixture,
  },
  long: {
    label: "Long Content",
    props: storyRoomCastPanelLongContentFixture,
  },
};

export default function StoryRoomCastPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [lastAction, setLastAction] = useState("No preview action yet.");
  const [selectedCastId, setSelectedCastId] = useState("narrator");

  const activeState = PREVIEW_STATES[activeStateKey];

  const viewProps = useMemo(() => {
    const fixture = activeState.props;

    return {
      ...fixture,
      castMembers: fixture.castMembers.map((member) => ({
        ...member,
        selected: member.selectable && member.id === selectedCastId,
        selectionLabel:
          member.selectable && member.id === selectedCastId
            ? "Next responder"
            : member.selectionLabel === "Next responder"
              ? "Select responder"
              : member.selectionLabel,
      })),
      npcParticipantManager: fixture.npcParticipantManager
        ? {
            ...fixture.npcParticipantManager,
            onTogglePanel: () =>
              setLastAction("Toggled Registry NPC manager."),
            onActivateNpc: (actionId) =>
              setLastAction(`Activated Registry NPC action: ${actionId}`),
          }
        : null,
      onClosePanel: () => setLastAction("Requested panel close."),
      onSelectCastMember: (participantId) => {
        setSelectedCastId(participantId);
        setLastAction(`Selected next responder: ${participantId}`);
      },
      onOpenPlayerCharacterPicker: () =>
        setLastAction("Requested Player Character picker."),
      onDeleteRoom: () => setLastAction("Requested Story deletion."),
    };
  }, [activeState, selectedCastId]);

  function selectState(stateKey) {
    setActiveStateKey(stateKey);
    setSelectedCastId("narrator");
    setLastAction("No preview action yet.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Room Cast Panel
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Room & Cast View directly from
            contract-shaped fixtures. It does not load a Story Room, query
            Player Characters, load or unload an NPC, delete a Story, or save
            responder state.
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
                onClick={() => selectState(stateKey)}
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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <StoryRoomCastPanelView {...viewProps} />

          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Local Preview Feedback
            </p>
            <p className="mt-3 text-sm text-[var(--foreground)]">
              {lastAction}
            </p>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Resize this route to inspect the same narrow panel geometry used
              in Story Rooms. The Mobile Placement fixture removes the internal
              close control, matching its placement inside the mobile drawer.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures supply only display-ready room media, cast cards, action
            availability, errors, child participant-manager props, and semantic
            callbacks. The live ViewModel remains responsible for raw Story
            Room records, Player Character selection, NPC lifecycle callbacks,
            responder IDs, and deletion orchestration.
          </p>
        </section>
      </div>
    </main>
  );
}
