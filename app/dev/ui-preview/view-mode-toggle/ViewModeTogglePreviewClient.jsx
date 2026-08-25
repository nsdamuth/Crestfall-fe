"use client";

import { useState } from "react";

import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import {
  viewModeToggleCustomLabelFixture,
  viewModeToggleGridFixture,
  viewModeToggleListFixture,
  viewModeToggleLongLabelFixture,
  viewModeToggleNoLabelFixture,
} from "@/components/studio/view-mode-toggle/ViewModeToggle.fixtures";

const PREVIEW_STATES = {
  grid: {
    label: "Grid Active",
    props: viewModeToggleGridFixture,
  },
  list: {
    label: "List Active",
    props: viewModeToggleListFixture,
  },
  customLabel: {
    label: "Custom Label",
    props: viewModeToggleCustomLabelFixture,
  },
  longLabel: {
    label: "Long Label",
    props: viewModeToggleLongLabelFixture,
  },
  noLabel: {
    label: "No Label",
    props: viewModeToggleNoLabelFixture,
  },
};

function cloneFixture(fixture) {
  return { ...fixture };
}

export default function ViewModeTogglePreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("grid");
  const [toggleProps, setToggleProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.grid.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No collection layout or saved preference is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setToggleProps(cloneFixture(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function changeViewMode(nextValue) {
    setToggleProps((current) => ({
      ...current,
      value: nextValue,
    }));
    setLastAction(`Selected ${nextValue} in local preview state.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">View Mode Toggle</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the shared portable View directly from
            contract-shaped fixtures. Grid and List selection changes local
            preview state only; no Story Room or Game preference is persisted.
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
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-6">
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-white/10 bg-black/30 p-6">
            <ViewModeToggleView
              {...toggleProps}
              onChange={changeViewMode}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:hidden">
            At this width, the component intentionally displays only its icons.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only the controlled Grid/List value, the
            accessible group label, and semantic selection intent. Collection
            layout, persistent preferences, filtering, APIs, and routing
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
