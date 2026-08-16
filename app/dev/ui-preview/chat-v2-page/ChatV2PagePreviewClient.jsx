"use client";

import { useState } from "react";

import ChatShellView from "@/components/studio/chat/chat-shell/ChatShell.view";
import { chatShellFixtures } from "@/components/studio/chat/chat-shell/ChatShell.fixtures";
import StoryChatPage from "@/app/studio/v2/stories/[id]/StoryChatPage";

const MODES = [
  { id: "fixtures", label: "Fixture states" },
  { id: "live-mock", label: "Live mock page" },
];

export default function ChatV2PagePreviewClient() {
  const [modeId, setModeId] = useState(MODES[0].id);
  const [fixtureId, setFixtureId] = useState(chatShellFixtures[0].id);
  const fixture = chatShellFixtures.find((item) => item.id === fixtureId) ?? chatShellFixtures[0];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--canvas)] text-[var(--ink)]">
      <header className="shrink-0 border-b border-[var(--line-whisper)] bg-[var(--surface-3)] px-[var(--space-5)] py-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Fixture-Driven UI Preview
        </p>
        <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
          Chat V2 Page
        </h1>
        <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          The wave C5 chat-shell package (fixture states) and the mock page
          Binding Shell at app/studio/v2/stories/[id] (live send loop
          against fixture data, pending CR-043). No Story is loaded.
        </p>

        <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setModeId(item.id)}
              className={`min-h-[var(--control-md)] touch-manipulation rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                item.id === modeId
                  ? "border-[var(--gold-action)]/60 bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {modeId === "fixtures" ? (
          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
            {chatShellFixtures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFixtureId(item.id)}
                className={`min-h-[var(--control-md)] touch-manipulation rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                  item.id === fixture.id
                    ? "border-[var(--gold-action)]/60 bg-[var(--fill)] text-[var(--gold-bright)]"
                    : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1">
        {modeId === "fixtures" ? (
          <div key={fixture.id} className="h-full min-h-[calc(var(--control-md)*14)]">
            <ChatShellView {...fixture.props} />
          </div>
        ) : (
          <StoryChatPage id="preview-story" />
        )}
      </div>
    </div>
  );
}
