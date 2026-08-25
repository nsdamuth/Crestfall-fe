"use client";

import { useState } from "react";

import ChatSessionDialogsView from "@/components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view";
import { chatSessionDialogsFixtures } from "@/components/studio/chat/chat-session-dialogs/ChatSessionDialogs.fixtures";

export default function ChatSessionDialogsPreviewClient() {
  const [fixtureId, setFixtureId] = useState(chatSessionDialogsFixtures[0].id);
  const fixture =
    chatSessionDialogsFixtures.find((item) => item.id === fixtureId) ?? chatSessionDialogsFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            Chat Session Dialogs
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            This route renders the portable dialogs View directly from
            contract-shaped fixtures. Report, Export, Share, Delete Story,
            and the summary-pending composition. Every dialog is composed
            on KitModalFrame, full-screen at 390. No Story is loaded.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Preview states
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatSessionDialogsFixtures.map((item) => (
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

        <section
          key={fixture.id}
          className="min-h-[calc(var(--control-md)*10)] rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-5)]"
        >
          <ChatSessionDialogsView {...fixture.props} />
        </section>
      </div>
    </main>
  );
}
