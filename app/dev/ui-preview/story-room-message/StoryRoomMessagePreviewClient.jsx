"use client";

import { useState } from "react";

import StoryRoomMessageView from "@/components/studio/story-rooms/story-room-message/StoryRoomMessage.view";
import {
  storyRoomMessageCharacterFixture,
  storyRoomMessageFailedFixture,
  storyRoomMessageLongFixture,
  storyRoomMessageMinimalFixture,
  storyRoomMessageNarratorFixture,
  storyRoomMessageOpeningFixture,
  storyRoomMessagePlayerFixture,
  storyRoomMessageSystemFixture,
} from "@/components/studio/story-rooms/story-room-message/StoryRoomMessage.fixtures";

const PREVIEW_STATES = {
  player: {
    label: "Player Sending",
    props: storyRoomMessagePlayerFixture,
  },
  narrator: {
    label: "Semantic Narrator",
    props: storyRoomMessageNarratorFixture,
  },
  opening: {
    label: "Opening Scene",
    props: storyRoomMessageOpeningFixture,
  },
  system: {
    label: "System",
    props: storyRoomMessageSystemFixture,
  },
  character: {
    label: "Character Palette",
    props: storyRoomMessageCharacterFixture,
  },
  failed: {
    label: "Failed Player",
    props: storyRoomMessageFailedFixture,
  },
  long: {
    label: "Long Content",
    props: storyRoomMessageLongFixture,
  },
  minimal: {
    label: "Minimal",
    props: storyRoomMessageMinimalFixture,
  },
};

export default function StoryRoomMessagePreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("narrator");
  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Story Room Message</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable message View directly from
            contract-shaped fixtures. No Story Room is loaded and no message is
            sent.
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

        <section className="rounded-2xl border border-white/10 bg-black/45 p-5">
          <StoryRoomMessageView {...activeState.props} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready message tone, speaker identity,
            body mode, semantic segments, palette colors, status blocks, and
            delivery state. Raw chat messages, engine metadata, presentation
            validation, palette resolution, sending, APIs, and persistence
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
