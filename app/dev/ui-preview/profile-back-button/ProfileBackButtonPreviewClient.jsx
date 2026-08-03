"use client";

import { useState } from "react";

import ProfileBackButtonView from "@/components/studio/profile/profile-back-button/ProfileBackButton.view";
import {
  profileBackButtonCustomLabelFixture,
  profileBackButtonDefaultFixture,
  profileBackButtonUnavailableActionFixture,
} from "@/components/studio/profile/profile-back-button/ProfileBackButton.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: profileBackButtonDefaultFixture,
  },
  customLabel: {
    label: "Custom Accessibility Label",
    props: profileBackButtonCustomLabelFixture,
  },
  unavailable: {
    label: "No Action",
    props: profileBackButtonUnavailableActionFixture,
  },
};

export default function ProfileBackButtonPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or click the back button to simulate local navigation intent."
  );

  const activeState = PREVIEW_STATES[activeStateKey];
  const actionAvailable = activeStateKey !== "unavailable";

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function simulateBack() {
    setLastAction(
      "Simulated back navigation in local preview state. No route was changed."
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Profile Back Button</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable profile back control directly from
            contract-shaped fixtures. It never inspects browser history or
            changes routes.
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
          <ProfileBackButtonView
            {...activeState.props}
            onGoBack={actionAvailable ? simulateBack : null}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only the accessible label and semantic back intent.
            Browser history, Next.js routing, fallback destinations, and profile
            navigation remain outside the portable View.
          </p>
        </section>
      </div>
    </main>
  );
}
