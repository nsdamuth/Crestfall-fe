"use client";

import { useState } from "react";

import ResponsiveFilterPanelView from "@/components/studio/ui/responsive-filter-panel/ResponsiveFilterPanel.view";
import {
  responsiveFilterPanelDesktopClosedFixture,
  responsiveFilterPanelDesktopOpenFixture,
  responsiveFilterPanelLongContentFixture,
  responsiveFilterPanelMobileBodyFixture,
  responsiveFilterPanelMobileClosedFixture,
  responsiveFilterPanelMobileOpenFixture,
  responsiveFilterPanelNoActionsFixture,
  responsiveFilterPanelNoBodyFixture,
} from "@/components/studio/ui/responsive-filter-panel/ResponsiveFilterPanel.fixtures";

const PREVIEW_STATES = {
  desktopOpen: {
    label: "Desktop Open",
    props: responsiveFilterPanelDesktopOpenFixture,
  },
  desktopClosed: {
    label: "Desktop Closed",
    props: responsiveFilterPanelDesktopClosedFixture,
  },
  mobileClosed: {
    label: "Mobile Closed",
    props: responsiveFilterPanelMobileClosedFixture,
  },
  mobileOpen: {
    label: "Mobile Open",
    props: responsiveFilterPanelMobileOpenFixture,
  },
  mobileBody: {
    label: "Mobile Body Visible",
    props: responsiveFilterPanelMobileBodyFixture,
  },
  noBody: {
    label: "No Body",
    props: responsiveFilterPanelNoBodyFixture,
  },
  noActions: {
    label: "No Actions",
    props: responsiveFilterPanelNoActionsFixture,
  },
  longContent: {
    label: "Long Content",
    props: responsiveFilterPanelLongContentFixture,
  },
};

export default function ResponsiveFilterPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("desktopOpen");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. Resize the browser to test both responsive controls."
  );

  const activeState = PREVIEW_STATES[activeStateKey];
  const previewProps = {
    ...activeState.props,
    mobileOpen,
    desktopOpen,
  };

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setMobileOpen(state.props.mobileOpen);
    setDesktopOpen(state.props.desktopOpen);
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Responsive Filter Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not load creations, creators, engagement state, or saved
            filters. Resize the browser across the medium breakpoint to test
            the independent mobile and desktop disclosure controls.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <ResponsiveFilterPanelView
          {...previewProps}
          onToggleMobileFilters={() => {
            setMobileOpen((current) => !current);
            setLastAction(
              mobileOpen
                ? "Mobile filters hidden locally."
                : "Mobile filters shown locally."
            );
          }}
          onToggleDesktopFilters={() => {
            setDesktopOpen((current) => !current);
            setLastAction(
              desktopOpen
                ? "Desktop filters hidden locally."
                : "Desktop filters shown locally."
            );
          }}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready heading, action, and filter content
            plus mobile and desktop disclosure state. Search, tag, status,
            creation-type, and creator-mode behavior remain owned by the host
            Community and My Creations features.
          </p>
        </section>
      </div>
    </main>
  );
}
