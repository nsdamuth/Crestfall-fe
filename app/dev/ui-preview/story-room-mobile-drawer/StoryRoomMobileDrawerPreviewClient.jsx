"use client";

import { useState } from "react";

import StoryRoomMobileDrawerView from "@/components/studio/story-rooms/story-room-mobile-drawer/StoryRoomMobileDrawer.view";
import {
  storyRoomMobileDrawerCastFixture,
  storyRoomMobileDrawerEmptyContentFixture,
  storyRoomMobileDrawerLongContentFixture,
  storyRoomMobileDrawerNoTitleFixture,
  storyRoomMobileDrawerStateFixture,
} from "@/components/studio/story-rooms/story-room-mobile-drawer/StoryRoomMobileDrawer.fixtures";

const PREVIEW_STATES = [
  { label: "Room & Cast", props: storyRoomMobileDrawerCastFixture },
  { label: "Chronicle State", props: storyRoomMobileDrawerStateFixture },
  { label: "Long Content", props: storyRoomMobileDrawerLongContentFixture },
  { label: "Empty Content", props: storyRoomMobileDrawerEmptyContentFixture },
  { label: "No Title", props: storyRoomMobileDrawerNoTitleFixture },
];

export default function StoryRoomMobileDrawerPreviewClient() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const selected = PREVIEW_STATES[selectedIndex];

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Room Mobile Drawer
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Select a fixture, then resize the browser below 1280px to inspect
            the actual mobile-only drawer. Closing and reopening affect preview
            state only; no Story Room data, API, engine module, or persistence
            is connected.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Fixture State
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {PREVIEW_STATES.map((state, index) => (
              <button
                key={state.label}
                type="button"
                onClick={() => {
                  setSelectedIndex(index);
                  setOpen(true);
                }}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  selectedIndex === index
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>

          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-5 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              Reopen Drawer
            </button>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only a visible title, supplied child content, and
            close intent. Panel selection, cast data, Chronicle State data,
            Story Room runtime behavior, APIs, routing, and persistence remain
            application-owned.
          </p>
        </section>
      </div>

      {open ? (
        <StoryRoomMobileDrawerView
          {...selected.props}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </main>
  );
}
