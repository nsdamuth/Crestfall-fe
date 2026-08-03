"use client";

import { useState } from "react";

import CreationShareButtonView from "@/components/studio/creations/creation-share-button/CreationShareButton.view";
import {
  creationShareButtonCopiedFixture,
  creationShareButtonCustomLabelFixture,
  creationShareButtonDefaultFixture,
  creationShareButtonDisabledFixture,
  creationShareButtonErrorFixture,
  creationShareButtonLongLabelFixture,
} from "@/components/studio/creations/creation-share-button/CreationShareButton.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: creationShareButtonDefaultFixture,
  },
  copied: {
    label: "Copied",
    props: creationShareButtonCopiedFixture,
  },
  error: {
    label: "Copy Failed",
    props: creationShareButtonErrorFixture,
  },
  disabled: {
    label: "Disabled",
    props: creationShareButtonDisabledFixture,
  },
  custom: {
    label: "Custom Label",
    props: creationShareButtonCustomLabelFixture,
  },
  long: {
    label: "Long Label",
    props: creationShareButtonLongLabelFixture,
  },
};

export default function CreationShareButtonPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState(PREVIEW_STATES.default.props);
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or click Share to simulate local copy feedback."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps(nextState.props);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function simulateShare() {
    if (viewProps.disabled) return;

    setViewProps((current) => ({
      ...current,
      buttonLabel: "Copied",
    }));
    setLastAction("Simulated copying a creation URL in local preview state.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Share Button
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable share button directly from
            contract-shaped fixtures. It never accesses the browser clipboard.
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
          <CreationShareButtonView
            {...viewProps}
            onShare={viewProps.disabled ? null : simulateShare}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready button text, disabled state, and
            semantic share intent. URL construction, browser-origin resolution,
            clipboard access, fallback copying, timers, and application records
            remain outside the portable View.
          </p>
        </section>
      </div>
    </main>
  );
}
