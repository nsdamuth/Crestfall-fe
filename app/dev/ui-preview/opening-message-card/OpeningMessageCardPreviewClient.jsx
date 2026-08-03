"use client";

import { useState } from "react";

import OpeningMessageCardView from "@/components/studio/room-templates/opening-message-card/OpeningMessageCard.view";
import {
  openingMessageCharacterSpeakerFixture,
  openingMessageEmptyFixture,
  openingMessageFirstFixture,
  openingMessageLongContentFixture,
  openingMessageManySpeakersFixture,
  openingMessagePlayerPromptFixture,
} from "@/components/studio/room-templates/opening-message-card/OpeningMessageCard.fixtures";

const PREVIEW_STATES = {
  first: {
    label: "First Message",
    props: openingMessageFirstFixture,
  },
  characterSpeaker: {
    label: "Character Speaker",
    props: openingMessageCharacterSpeakerFixture,
  },
  playerPrompt: {
    label: "Player Prompt",
    props: openingMessagePlayerPromptFixture,
  },
  empty: {
    label: "Empty",
    props: openingMessageEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: openingMessageLongContentFixture,
  },
  manySpeakers: {
    label: "Many Speakers",
    props: openingMessageManySpeakersFixture,
  },
};

function fixtureState(fixture) {
  return {
    messageLabel: fixture.messageLabel,
    speakerValue: fixture.speakerValue,
    speakerOptions: fixture.speakerOptions,
    bodyValue: fixture.bodyValue,
    canRemove: fixture.canRemove,
  };
}

export default function OpeningMessageCardPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("characterSpeaker");
  const [cardState, setCardState] = useState(() =>
    fixtureState(PREVIEW_STATES.characterSpeaker.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Story package or opening-message collection is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setCardState(fixtureState(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function changeSpeaker(speakerValue) {
    setCardState((current) => ({ ...current, speakerValue }));
    setLastAction(`Changed the preview speaker to ${speakerValue}.`);
  }

  function changeBody(bodyValue) {
    setCardState((current) => ({ ...current, bodyValue }));
    setLastAction("Updated the message in preview-local state.");
  }

  function removeMessage() {
    setLastAction(
      "Simulated removing this message from preview-local state. No Story data changed."
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
            Opening Message Card
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. Speaker changes, message edits, and removal actions stay
            in local preview state and do not modify or save a Story.
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

        <OpeningMessageCardView
          {...cardState}
          onChangeSpeaker={changeSpeaker}
          onChangeBody={changeBody}
          onRemoveMessage={removeMessage}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only the display label, speaker value and options,
            message body, removal availability, and semantic callbacks. Message
            IDs, selected character records, update field names, collection
            mutation, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
