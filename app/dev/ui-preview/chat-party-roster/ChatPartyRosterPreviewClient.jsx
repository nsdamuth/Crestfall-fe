"use client";

import { useState } from "react";

import ChatPartyRosterView from "@/components/studio/chat/chat-party-roster/ChatPartyRoster.view";
import { chatPartyRosterFixtures } from "@/components/studio/chat/chat-party-roster/ChatPartyRoster.fixtures";

export default function ChatPartyRosterPreviewClient() {
  const [fixtureId, setFixtureId] = useState(chatPartyRosterFixtures[0].id);
  const fixture =
    chatPartyRosterFixtures.find((item) => item.id === fixtureId) ?? chatPartyRosterFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-10 text-[var(--ink)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            Chat Party Roster
          </h1>
          <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            The Party roster selection surface, opened from
            chat-cast-panel. KitModalFrame variant=&quot;modal&quot;: centered at
            700px and up, bottom-anchored under 700px. No Story is
            loaded.
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Preview states
          </p>

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatPartyRosterFixtures.map((item) => (
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
          <ChatPartyRosterView {...fixture.props} />
        </section>
      </div>
    </main>
  );
}
