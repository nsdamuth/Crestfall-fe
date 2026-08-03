"use client";

import { useEffect, useState } from "react";

import RoomTemplateMultiplayerSectionView from "@/components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view";
import {
  roomTemplateMultiplayerSectionCustomCopyFixture,
  roomTemplateMultiplayerSectionDefaultFixture,
  roomTemplateMultiplayerSectionFreeformFixture,
  roomTemplateMultiplayerSectionLoadErrorFixture,
  roomTemplateMultiplayerSectionLongContentFixture,
  roomTemplateMultiplayerSectionMissingCallbacksFixture,
  roomTemplateMultiplayerSectionNoMutualsFixture,
  roomTemplateMultiplayerSectionSeveralInviteesFixture,
} from "@/components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Turn-Based",
    props: roomTemplateMultiplayerSectionDefaultFixture,
  },
  freeform: {
    label: "Freeform",
    props: roomTemplateMultiplayerSectionFreeformFixture,
  },
  several: {
    label: "Several Invitees",
    props: roomTemplateMultiplayerSectionSeveralInviteesFixture,
  },
  loadError: {
    label: "Load Error",
    props: roomTemplateMultiplayerSectionLoadErrorFixture,
  },
  noMutuals: {
    label: "No Mutuals",
    props: roomTemplateMultiplayerSectionNoMutualsFixture,
  },
  longContent: {
    label: "Long Content",
    props: roomTemplateMultiplayerSectionLongContentFixture,
  },
  customCopy: {
    label: "Custom Copy",
    props: roomTemplateMultiplayerSectionCustomCopyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: roomTemplateMultiplayerSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function syncSelection(mutualPlayers, invitedPlayers) {
  const invitedIds = new Set(invitedPlayers.map((player) => player.id));

  return mutualPlayers.map((player) => ({
    ...player,
    isSelected: invitedIds.has(player.id),
  }));
}

export default function RoomTemplateMultiplayerSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  function updateInvitees(nextInvitedPlayers) {
    const effectiveTurnBased =
      viewProps.effectiveTurnBased || nextInvitedPlayers.length > 0;

    setViewProps((current) => ({
      ...current,
      effectiveTurnBased,
      turnBasedDescription: effectiveTurnBased
        ? "Turn-based mode is enabled. Player turns and NPC response cycles can be handled by the room runtime later."
        : "Freeform mode. Players can choose who responds until turn-based mode is enabled.",
      showTurnBasedRequiredMessage: nextInvitedPlayers.length > 0,
      invitedPlayers: nextInvitedPlayers,
      mutualPlayers: syncSelection(current.mutualPlayers, nextInvitedPlayers),
    }));
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Template Multiplayer Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story multiplayer editor from
            contract-shaped fixtures. Turn mode, invitees, picker search, and
            removal actions update local preview state only.
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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <RoomTemplateMultiplayerSectionView
              {...viewProps}
              onToggleTurnBased={
                callbacksEnabled
                  ? () => {
                      setViewProps((current) => {
                        const nextTurnBased = current.invitedPlayers.length
                          ? true
                          : !current.effectiveTurnBased;

                        return {
                          ...current,
                          effectiveTurnBased: nextTurnBased,
                          turnBasedDescription: nextTurnBased
                            ? "Turn-based mode is enabled. Player turns and NPC response cycles can be handled by the room runtime later."
                            : "Freeform mode. Players can choose who responds until turn-based mode is enabled.",
                        };
                      });
                      setFeedback("Turn-based mode toggled.");
                    }
                  : null
              }
              onToggleInvitedPlayer={
                callbacksEnabled
                  ? (playerId) => {
                      const selected = viewProps.invitedPlayers.some(
                        (player) => player.id === playerId
                      );
                      const player = viewProps.mutualPlayers.find(
                        (item) => item.id === playerId
                      );

                      if (!player) return;

                      const nextInvitedPlayers = selected
                        ? viewProps.invitedPlayers.filter(
                            (item) => item.id !== playerId
                          )
                        : [
                            ...viewProps.invitedPlayers,
                            {
                              id: player.id,
                              username: player.username,
                              avatarUrl: player.imageUrl,
                              displayInitial: player.username
                                .slice(0, 1)
                                .toUpperCase(),
                              statusLabel: "Pending invite later",
                              removeAriaLabel: `Remove ${player.username}`,
                            },
                          ];

                      updateInvitees(nextInvitedPlayers);
                      setFeedback(
                        `${selected ? "Removed" : "Selected"} @${
                          player.username
                        }.`
                      );
                    }
                  : null
              }
              onRemoveInvitedPlayer={
                callbacksEnabled
                  ? (playerId) => {
                      const player = viewProps.invitedPlayers.find(
                        (item) => item.id === playerId
                      );
                      updateInvitees(
                        viewProps.invitedPlayers.filter(
                          (item) => item.id !== playerId
                        )
                      );
                      setFeedback(
                        `Removed @${player?.username || playerId}.`
                      );
                    }
                  : null
              }
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
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
              Fixtures contain only display-ready invitees, mutual followers,
              turn-mode state, and semantic callbacks. Mutual-follower loading,
              Story JSON fields, multiplayer synchronization, saving, and
              persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
