"use client";

import { useState } from "react";

import ChatMessageView from "@/components/studio/chat/chat-message/ChatMessage.view";
import { chatMessageFixtures } from "@/components/studio/chat/chat-message/ChatMessage.fixtures";

export default function ChatMessagePreviewClient() {
  const [fixtureId, setFixtureId] = useState(chatMessageFixtures[0].id);
  const fixture =
    chatMessageFixtures.find((item) => item.id === fixtureId) ?? chatMessageFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            Chat Message
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            This route renders the portable message View directly from
            contract-shaped fixtures. No Story is loaded, no message is sent,
            and enableFixturePaletteDemo is only ever set true from within
            these fixtures.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Preview states
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatMessageFixtures.map((item) => (
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

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-5)]">
          <ChatMessageView {...fixture.props} />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Contract boundary
          </p>
          <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            Fixtures contain only display-ready message tone, speaker
            identity, body mode, segments, status blocks, delivery state, and
            action-row state. Raw chat messages, engine metadata, presentation
            validation, palette resolution, streaming transport, sending,
            APIs, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
