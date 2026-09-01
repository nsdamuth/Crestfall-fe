"use client";

import { useRef, useState } from "react";

import StudioTopBarView from "@/components/studio/studio-top-bar/StudioTopBar.view";
import {
  studioTopBarBellIdleFixture,
  studioTopBarBellWithNotificationsFixture,
  studioTopBarCompactPanelOpenFixture,
  studioTopBarEmptyPanelOpenFixture,
  studioTopBarErrorPanelOpenFixture,
  studioTopBarIdleFixture,
  studioTopBarLoadingPanelOpenFixture,
  studioTopBarMobileBarIdleFixture,
  studioTopBarSearchFocusedFixture,
} from "@/components/studio/studio-top-bar/StudioTopBar.fixtures";

const STATES = {
  idle: { label: "Bar idle", fixture: studioTopBarIdleFixture },
  mobileBarIdle: { label: "Mobile bar idle", fixture: studioTopBarMobileBarIdleFixture },
  searchFocused: { label: "Search focused", fixture: studioTopBarSearchFocusedFixture },
  bellIdle: { label: "Bell idle", fixture: studioTopBarBellIdleFixture },
  bellWithNotifications: {
    label: "Bell with feed data",
    fixture: studioTopBarBellWithNotificationsFixture,
  },
  open: { label: "Notifications open", fixture: studioTopBarCompactPanelOpenFixture },
  loading: { label: "Loading state", fixture: studioTopBarLoadingPanelOpenFixture },
  error: { label: "Error state", fixture: studioTopBarErrorPanelOpenFixture },
  emptyOpen: { label: "Empty state", fixture: studioTopBarEmptyPanelOpenFixture },
};

const FILLER_ROWS = Array.from({ length: 24 }, (_, index) => index);

export default function StudioTopBarPreviewClient() {
  const [stateKey, setStateKey] = useState("idle");
  const [feedback, setFeedback] = useState("Fixture preview ready.");
  const [notificationsView, setNotificationsView] = useState(
    STATES[stateKey].fixture.notificationsView
  );
  const bellRef = useRef(null);

  function selectState(key) {
    setStateKey(key);
    setNotificationsView(STATES[key].fixture.notificationsView);
    setFeedback(`${STATES[key].label} fixture loaded.`);
  }

  const fixture = STATES[stateKey].fixture;

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="border-b border-[var(--line)] bg-[var(--surface-2)] p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Studio Top Bar Preview: quiet notifications
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(STATES).map(([key, entry]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectState(key)}
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
        {...fixture}
        notificationsView={notificationsView}
        bellRef={bellRef}
        accountLinkSlot={
          <a
            href="/studio/account"
            aria-label="creator@example.com"
            className="hidden h-[var(--control-md)] w-[var(--control-md)] shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:flex"
          >
            {fixture.accountInitial}
          </a>
        }
        onOpenMenu={() => setFeedback("onOpenMenu callback received.")}
        onSearchChange={() => setFeedback("onSearchChange callback received.")}
        onOpenNotifications={() => {
          setNotificationsView("compact");
          setFeedback("onOpenNotifications callback received.");
        }}
        onCloseNotifications={() => {
          setNotificationsView(null);
          bellRef.current?.focus();
          setFeedback("Notifications closed; focus returned to the bell.");
        }}
      />

      <div className="mx-auto max-w-7xl px-[var(--space-5)] py-[var(--space-8)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]">
        <p className="mb-6 text-sm leading-7 text-[var(--ink-dim)]">
          The bell stays visually stable whether the feed is empty or populated.
          It opens one quiet recent-activity modal with no unread count, badge,
          clear-all or removal pressure.
        </p>
        <div className="space-y-4">
          {FILLER_ROWS.map((row) => (
            <div
              key={row}
              className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-8"
            >
              <p className="font-display text-[var(--text-heading)] leading-[var(--lh-heading)] text-[var(--gold-bright)]">
                Filler section {row + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
