"use client";

import { useState } from "react";

import StudioAccountMetricsView from "@/components/studio/account/studio-account-metrics/StudioAccountMetrics.view";
import {
  studioAccountMetricsEmptyFixture,
  studioAccountMetricsErrorFixture,
  studioAccountMetricsLargeValuesFixture,
  studioAccountMetricsReadyFixture,
  studioAccountMetricsWideLayoutFixture,
} from "@/components/studio/account/studio-account-metrics/StudioAccountMetrics.fixtures";

const PREVIEW_STATES = {
  ready: {
    label: "Ready",
    props: studioAccountMetricsReadyFixture,
  },
  empty: {
    label: "Zero Values",
    props: studioAccountMetricsEmptyFixture,
  },
  error: {
    label: "Load Error",
    props: studioAccountMetricsErrorFixture,
  },
  largeValues: {
    label: "Large Values",
    props: studioAccountMetricsLargeValuesFixture,
  },
  wideLayout: {
    label: "Responsive Layout",
    props: studioAccountMetricsWideLayoutFixture,
  },
};

export default function StudioAccountMetricsPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("ready");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No account metrics are connected."
  );

  const activeState = PREVIEW_STATES[activeStateKey];

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Studio Account Metrics
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load a profile, or request account
            metrics.
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <StudioAccountMetricsView {...activeState.props} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready metric labels and values only. API
            requests, payload compatibility, fallback values, and number
            formatting remain outside the View.
          </p>
        </section>
      </div>
    </main>
  );
}
