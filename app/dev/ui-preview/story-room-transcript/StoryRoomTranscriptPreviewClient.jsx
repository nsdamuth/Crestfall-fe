"use client";

import { useState } from "react";

import StoryRoomTranscriptView from "@/components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view";
import {
  storyRoomTranscriptConversationFixture,
  storyRoomTranscriptEmptyFixture,
  storyRoomTranscriptErrorFixture,
  storyRoomTranscriptHistoryFixture,
  storyRoomTranscriptLoadingFixture,
  storyRoomTranscriptLongFixture,
  storyRoomTranscriptSendingFixture,
} from "@/components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.fixtures";

const PREVIEW_STATES = {
  conversation: {
    label: "Conversation",
    props: storyRoomTranscriptConversationFixture,
  },
  history: {
    label: "Earlier History",
    props: storyRoomTranscriptHistoryFixture,
  },
  loading: {
    label: "Loading",
    props: storyRoomTranscriptLoadingFixture,
  },
  empty: {
    label: "Empty",
    props: storyRoomTranscriptEmptyFixture,
  },
  sending: {
    label: "Sending",
    props: storyRoomTranscriptSendingFixture,
  },
  error: {
    label: "Error",
    props: storyRoomTranscriptErrorFixture,
  },
  long: {
    label: "Long Content",
    props: storyRoomTranscriptLongFixture,
  },
};

export default function StoryRoomTranscriptPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("conversation");
  const activeState = PREVIEW_STATES[activeStateKey];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Story Room Transcript</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable transcript View directly from
            contract-shaped message fixtures. No Story Room is loaded and no
            turn is sent.
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

        <section className="flex h-[720px] min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <StoryRoomTranscriptView
            key={activeStateKey}
            {...activeState.props}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready message View props and
            transcript status values. Raw chat messages, engine metadata,
            message loading, turn sending, APIs, and persistence remain
            application-owned. Load Earlier and auto-scroll are local visual
            behaviors.
          </p>
        </section>
      </div>
    </main>
  );
}
