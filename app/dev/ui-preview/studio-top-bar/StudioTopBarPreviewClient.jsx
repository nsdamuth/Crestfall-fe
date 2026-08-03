"use client";

import { useEffect, useMemo, useState } from "react";

import StudioTopBarView from "@/components/studio/studio-top-bar/StudioTopBar.view";
import {
  studioTopBarBuyCoinsFixture,
  studioTopBarDefaultFixture,
  studioTopBarLoadingFixture,
  studioTopBarNotificationsFixture,
} from "@/components/studio/studio-top-bar/StudioTopBar.fixtures";

const STATES = {
  default: {
    label: "Default",
    fixture: studioTopBarDefaultFixture,
  },
  loading: {
    label: "Loading",
    fixture: studioTopBarLoadingFixture,
  },
  buy: {
    label: "Buy Coins Modal",
    fixture: studioTopBarBuyCoinsFixture,
  },
  notifications: {
    label: "Notifications Modal",
    fixture: studioTopBarNotificationsFixture,
  },
};

export default function StudioTopBarPreviewClient() {
  const [stateKey, setStateKey] = useState("default");
  const [viewState, setViewState] = useState(STATES.default.fixture);
  const [feedback, setFeedback] = useState("Fixture preview ready.");

  useEffect(() => {
    setViewState(STATES[stateKey].fixture);
    setFeedback(`${STATES[stateKey].label} fixture loaded.`);
  }, [stateKey]);

  const viewProps = useMemo(
    () => ({
      ...viewState,
      onOpenBuyCoins: () => {
        setViewState(studioTopBarBuyCoinsFixture);
        setFeedback("Buy Coins callback received.");
      },
      onOpenNotifications: () => {
        setViewState(studioTopBarNotificationsFixture);
        setFeedback("Notifications callback received.");
      },
      onCloseUtility: () => {
        setViewState(studioTopBarDefaultFixture);
        setFeedback("Utility modal closed.");
      },
    }),
    [viewState]
  );

  return (
    <main className="min-h-screen bg-[#080706] p-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-xl border border-[var(--muted-gold)]/25 bg-black/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Studio Top Bar Preview
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

        <StudioTopBarView {...viewProps} />

        <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-sm leading-7 text-[var(--muted)]">
          The production bar is hidden below the large-screen breakpoint. Widen
          the preview window to test the exact desktop layout.
        </div>
      </div>
    </main>
  );
}
