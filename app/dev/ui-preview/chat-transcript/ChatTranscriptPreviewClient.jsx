"use client";

import { useState } from "react";

import ChatTranscriptView from "@/components/studio/chat/chat-transcript/ChatTranscript.view";
import { chatTranscriptFixtures } from "@/components/studio/chat/chat-transcript/ChatTranscript.fixtures";

export default function ChatTranscriptPreviewClient() {
  const [fixtureId, setFixtureId] = useState(chatTranscriptFixtures[0].id);
  const fixture =
    chatTranscriptFixtures.find((item) => item.id === fixtureId) ?? chatTranscriptFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            Chat Transcript
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            This route renders the portable transcript View directly from
            contract-shaped fixtures inside a fixed-height frame so scroll,
            windowing, and the jump-to-latest law can be exercised. No Story
            is loaded and no message is sent.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Preview states
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatTranscriptFixtures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFixtureId(item.id)}
                className={`min-h-[var(--control-md)] touch-manipulation rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                  item.id === fixture.id
                    ? "border-[var(--gold-action)]/60 bg-[var(--fill)] text-[var(--gold-bright)]"
                    : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex h-[42rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)]">
          <ChatTranscriptView {...fixture.props} />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Contract boundary
          </p>
          <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            Fixtures contain only display-ready message items, the opening
            hero image, and delivery/loading/error state. Media re-slotting,
            raw chat messages, engine metadata, sending, APIs, and
            persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
