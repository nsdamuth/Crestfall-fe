"use client";

import { useState } from "react";

import StudioMobileNavView from "@/components/studio/studio-mobile-nav/StudioMobileNav.view";
import {
  studioMobileNavActiveDockTileFixture,
  studioMobileNavClosedFixture,
  studioMobileNavDrawerOpenFixture,
  studioMobileNavSocialOpenFixture,
} from "@/components/studio/studio-mobile-nav/StudioMobileNav.fixtures";

const STATES = Object.freeze([
  Object.freeze({ label: "Closed", fixture: studioMobileNavClosedFixture }),
  Object.freeze({ label: "Drawer Open", fixture: studioMobileNavDrawerOpenFixture }),
  Object.freeze({
    label: "Community Links Open",
    fixture: studioMobileNavSocialOpenFixture,
  }),
  Object.freeze({
    label: "Active Dock Tile",
    fixture: studioMobileNavActiveDockTileFixture,
  }),
]);

function PreviewLink({ href, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

function EconomyFixture({ label }) {
  return (
    <div className="rounded-lg border border-[var(--muted-gold)]/20 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)]">
      {label}: 99,500
    </div>
  );
}

export default function StudioMobileNavPreviewClient() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [closedFeedback, setClosedFeedback] = useState("");
  const selectedState = STATES[selectedIndex] || STATES[0];

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-3xl">Studio Mobile Nav</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Fixture-driven closed, drawer-open, and Community Links states.
            The header row (hamburger, search, bell) moved to the
            studio-top-bar package (8 Aug 2026); this package now owns only
            the drawer and bottom dock. View this preview below the large
            breakpoint.
          </p>
          {closedFeedback ? (
            <p className="mt-2 text-xs text-[var(--muted-gold)]">
              {closedFeedback}
            </p>
          ) : null}
        </header>

        <div className="relative z-[70] flex flex-wrap gap-2">
          {STATES.map((state, index) => (
            <button
              key={state.label}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setClosedFeedback("");
              }}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                selectedIndex === index
                  ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-[var(--muted-gold)]/20 text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>

        <section className="min-h-[760px] rounded-2xl border border-[var(--muted-gold)]/20 bg-black/70">
          <div className="mx-auto max-w-md px-6 pb-24 pt-24 text-sm leading-7 text-[var(--muted)]">
            Active fixture: {selectedState.label}. Fixture content sits beneath
            the fixed mobile navigation surfaces.
          </div>
          <StudioMobileNavView
            {...selectedState.fixture}
            InternalLinkComponent={PreviewLink}
            drawerEconomySlot={<EconomyFixture label="Drawer coins" />}
            onCloseMenu={() => setClosedFeedback("onCloseMenu callback received.")}
          />
        </section>
      </div>
    </main>
  );
}
