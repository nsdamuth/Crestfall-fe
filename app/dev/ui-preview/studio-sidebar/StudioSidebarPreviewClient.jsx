"use client";

import { useEffect, useMemo, useState } from "react";

import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import {
  studioSidebarCollapsedFixture,
  studioSidebarExpandedFixture,
  studioSidebarSocialOpenFixture,
} from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";

const STATES = Object.freeze({
  expanded: Object.freeze({
    label: "Expanded",
    fixture: studioSidebarExpandedFixture,
  }),
  social: Object.freeze({
    label: "Community Links Open",
    fixture: studioSidebarSocialOpenFixture,
  }),
  collapsed: Object.freeze({
    label: "Collapsed",
    fixture: studioSidebarCollapsedFixture,
  }),
});

export default function StudioSidebarPreviewClient() {
  const [stateKey, setStateKey] = useState("expanded");
  const [viewState, setViewState] = useState(STATES.expanded.fixture);
  const [feedback, setFeedback] = useState("Fixture preview ready.");

  useEffect(() => {
    setViewState(STATES[stateKey].fixture);
    setFeedback(`${STATES[stateKey].label} fixture loaded.`);
  }, [stateKey]);

  const viewProps = useMemo(
    () => ({
      ...viewState,
      economySlot: (
        <div className="rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/5 p-3 text-xs text-[var(--muted-gold)]">
          {viewState.collapsed ? "¢" : "99,550 Bot Coins"}
        </div>
      ),
      onToggleCollapsed: () => {
        const next = viewState.collapsed
          ? studioSidebarExpandedFixture
          : studioSidebarCollapsedFixture;
        setViewState(next);
        setFeedback(
          next.collapsed ? "Collapse callback received." : "Expand callback received."
        );
      },
      onToggleSocial: () => {
        setViewState((current) => ({
          ...current,
          socialOpen: !current.socialOpen,
        }));
        setFeedback("Community Links callback received.");
      },
    }),
    [viewState]
  );

  return (
    <main className="min-h-screen bg-[#080706] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-xl border border-[var(--muted-gold)]/25 bg-black/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Studio Sidebar Preview
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(STATES).map(([key, state]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStateKey(key)}
                className={`rounded-lg border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${
                  stateKey === key
                    ? "border-[var(--muted-gold)]/50 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">{feedback}</p>
        </div>

        <div className="flex min-h-[760px] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <StudioSidebarView {...viewProps} />
          <div className="flex-1 p-8 text-sm leading-7 text-[var(--muted)]">
            The production sidebar is hidden below the large-screen breakpoint.
            Widen the preview window to inspect the expanded and collapsed desktop
            states.
          </div>
        </div>
      </div>
    </main>
  );
}
