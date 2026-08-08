"use client";

import { useRef, useState } from "react";

import StudioTopBarView from "@/components/studio/studio-top-bar/StudioTopBar.view";
import {
  studioTopBarBellIdleFixture,
  studioTopBarBellWithNotificationsFixture,
  studioTopBarCompactPanelOpenFixture,
  studioTopBarEmptyPanelOpenFixture,
  studioTopBarFullCenterOpenFixture,
  studioTopBarIdleFixture,
  studioTopBarSearchFocusedFixture,
} from "@/components/studio/studio-top-bar/StudioTopBar.fixtures";

const STATES = {
  idle: {
    label: "Bar idle",
    fixture: studioTopBarIdleFixture,
  },
  searchFocused: {
    label: "Search focused",
    fixture: studioTopBarSearchFocusedFixture,
  },
  bellIdle: {
    label: "Bell idle",
    fixture: studioTopBarBellIdleFixture,
  },
  bellWithNotifications: {
    label: "Bell with notifications",
    fixture: studioTopBarBellWithNotificationsFixture,
  },
  compactOpen: {
    label: "Compact panel open",
    fixture: studioTopBarCompactPanelOpenFixture,
  },
  fullOpen: {
    label: "Full notification center open",
    fixture: studioTopBarFullCenterOpenFixture,
  },
  emptyOpen: {
    label: "Empty state",
    fixture: studioTopBarEmptyPanelOpenFixture,
  },
};

const FILLER_ROWS = Array.from({ length: 24 }, (_, index) => index);

export default function StudioTopBarPreviewClient() {
  const [stateKey, setStateKey] = useState("idle");
  const [feedback, setFeedback] = useState("Fixture preview ready.");
  const [notifications, setNotifications] = useState(
    STATES[stateKey].fixture.notifications,
  );
  const [notificationsView, setNotificationsView] = useState(
    STATES[stateKey].fixture.notificationsView,
  );
  const bellRef = useRef(null);

  function selectState(key) {
    setStateKey(key);
    setNotifications(STATES[key].fixture.notifications);
    setNotificationsView(STATES[key].fixture.notificationsView);
    setFeedback(`${STATES[key].label} fixture loaded.`);
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="border-b border-[var(--line)] bg-[var(--surface-2)] p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Studio Top Bar Preview: scroll this page to test sticky + frost
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
        searchValue={STATES[stateKey].fixture.searchValue}
        searchPlaceholder={STATES[stateKey].fixture.searchPlaceholder}
        searchAutoFocus={STATES[stateKey].fixture.searchAutoFocus}
        notificationsLabel={STATES[stateKey].fixture.notificationsLabel}
        accountHref={STATES[stateKey].fixture.accountHref}
        accountAriaLabel={STATES[stateKey].fixture.accountAriaLabel}
        accountInitial={STATES[stateKey].fixture.accountInitial}
        notifications={notifications}
        notificationsView={notificationsView}
        bellRef={bellRef}
        accountLinkSlot={
          <a
            href="/studio/account"
            aria-label="creator@example.com"
            className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          >
            {STATES[stateKey].fixture.accountInitial}
          </a>
        }
        onSearchChange={() => setFeedback("onSearchChange callback received.")}
        onOpenNotifications={() => {
          setNotificationsView("compact");
          setFeedback("onOpenNotifications callback received.");
        }}
        onOpenNotificationCenter={() => {
          setNotificationsView("full");
          setFeedback("onOpenNotificationCenter callback received.");
        }}
        onCloseNotifications={() => {
          setNotificationsView(null);
          bellRef.current?.focus();
          setFeedback("onCloseNotifications callback received; focus returned to the bell.");
        }}
        onDismissNotification={(id) => {
          setNotifications((current) => current.filter((n) => n.id !== id));
          setFeedback(`onDismissNotification("${id}") callback received.`);
        }}
        onClearAllNotifications={() => {
          setNotifications([]);
          setFeedback("onClearAllNotifications callback received.");
        }}
      />

      <div className="mx-auto max-w-7xl px-[var(--space-5)] py-[var(--space-8)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]">
        <p className="mb-6 text-sm leading-7 text-[var(--ink-dim)]">
          The production bar is hidden below the large-screen breakpoint. Widen
          the preview window to test the exact desktop layout. Everything below
          is filler content, scrolled to verify the bar stays sticky, spans full
          width, and reads frosted with real content passing beneath it.
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
              <p className="mt-2 text-sm leading-7 text-[var(--ink-dim)]">
                Scrollable content used only to verify the sticky chrome bar
                and its frost read correctly against real page content. Not
                product copy.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
