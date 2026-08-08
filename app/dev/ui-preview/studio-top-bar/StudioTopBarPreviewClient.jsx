"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";

import StudioTopBarView from "@/components/studio/studio-top-bar/StudioTopBar.view";
import {
  studioTopBarIdleFixture,
  studioTopBarNotificationsEmptyOpenFixture,
  studioTopBarNotificationsOpenFixture,
  studioTopBarSearchFocusedFixture,
} from "@/components/studio/studio-top-bar/StudioTopBar.fixtures";

const STATES = {
  idle: {
    label: "Bell idle",
    fixture: studioTopBarIdleFixture,
  },
  searchFocused: {
    label: "Search focused",
    fixture: studioTopBarSearchFocusedFixture,
  },
  notificationsOpen: {
    label: "Bell with notifications, popup open",
    fixture: studioTopBarNotificationsOpenFixture,
  },
  notificationsEmptyOpen: {
    label: "Popup open, no notifications",
    fixture: studioTopBarNotificationsEmptyOpenFixture,
  },
};

export default function StudioTopBarPreviewClient() {
  const [stateKey, setStateKey] = useState("idle");
  const [feedback, setFeedback] = useState("Fixture preview ready.");
  const state = STATES[stateKey];

  return (
    <main className="min-h-screen bg-[var(--canvas)] p-8 text-[var(--ink)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Studio Top Bar Preview
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(STATES).map(([key, entry]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStateKey(key)}
                className={`rounded-[var(--radius-md)] border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${
                  stateKey === key
                    ? "border-[var(--gold-ornament)]/50 text-[var(--ink)]"
                    : "border-[var(--line)] text-[var(--ink-dim)]"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--ink-dim)]">{feedback}</p>
        </div>

        <StudioTopBarView
          key={stateKey}
          {...state.fixture}
          accountLinkSlot={
            <a
              href="/studio/account"
              aria-label="creator@example.com"
              className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
            >
              <UserRound size={17} />
            </a>
          }
          onSearchChange={() => setFeedback("onSearchChange callback received.")}
          onOpenNotifications={() =>
            setFeedback("onOpenNotifications callback received.")
          }
        />

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-8 text-sm leading-7 text-[var(--ink-dim)]">
          The production bar is hidden below the large-screen breakpoint. Widen
          the preview window to test the exact desktop layout.
        </div>
      </div>
    </main>
  );
}
