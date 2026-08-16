"use client";

import { useState } from "react";

import ChatCastPanelView from "@/components/studio/chat/chat-cast-panel/ChatCastPanel.view";
import { chatCastPanelFixtures } from "@/components/studio/chat/chat-cast-panel/ChatCastPanel.fixtures";

export default function ChatCastPanelPreviewClient() {
  const [fixtureId, setFixtureId] = useState(chatCastPanelFixtures[0].id);
  const fixture =
    chatCastPanelFixtures.find((item) => item.id === fixtureId) ?? chatCastPanelFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            Chat Cast Panel
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            This route renders the portable cast panel View directly from
            contract-shaped fixtures. Desktop shows the sticky rail; resize
            below 1280px (xl) to see the mobile Room &amp; Cast sheet trigger.
            No Story is loaded and no message is sent.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Preview states
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatCastPanelFixtures.map((item) => (
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

        <section key={fixture.id} className="max-w-md rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-5)]">
          <ChatCastPanelView {...fixture.props} />
        </section>
      </div>
    </main>
  );
}
