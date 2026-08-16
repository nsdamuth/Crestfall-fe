"use client";

import { useState } from "react";

import ChatComposerView from "@/components/studio/chat/chat-composer/ChatComposer.view";
import { chatComposerFixtures } from "@/components/studio/chat/chat-composer/ChatComposer.fixtures";

export default function ChatComposerPreviewClient() {
  const [fixtureId, setFixtureId] = useState(chatComposerFixtures[0].id);
  const fixture =
    chatComposerFixtures.find((item) => item.id === fixtureId) ?? chatComposerFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            Chat Composer
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            This route renders the portable composer View directly from
            contract-shaped fixtures, docked beneath a placeholder transcript
            frame. No Story is loaded and no message is sent. Resize the
            viewport below 1280px (xl) to exercise the mobile-docked
            composer and its tools sheet.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Preview states
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatComposerFixtures.map((item) => (
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
          className="flex h-[30rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)]"
        >
          <div className="flex-1 overflow-hidden p-[var(--space-5)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Transcript placeholder
          </div>
          <ChatComposerView {...fixture.props} />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Contract boundary
          </p>
          <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            Fixtures contain only display-ready mode, speaker, draft,
            autocomplete-menu, submit, streaming, and scene-tool state. Raw
            participant records, draft persistence, message submission,
            room state, streaming transport, and generation APIs remain
            application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
