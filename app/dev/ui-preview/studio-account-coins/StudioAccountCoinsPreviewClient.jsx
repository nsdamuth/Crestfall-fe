"use client";

import { useState } from "react";

import StudioAccountCoinsView from "@/components/studio/account/studio-account-coins/StudioAccountCoins.view";
import {
  studioAccountCoinsErrorFixture,
  studioAccountCoinsLargeBalanceFixture,
  studioAccountCoinsLoadingFixture,
  studioAccountCoinsPurchaseInfoFixture,
  studioAccountCoinsReadyFixture,
} from "@/components/studio/account/studio-account-coins/StudioAccountCoins.fixtures";

const PREVIEW_STATES = {
  ready: {
    label: "Ready",
    props: studioAccountCoinsReadyFixture,
  },
  loading: {
    label: "Loading",
    props: studioAccountCoinsLoadingFixture,
  },
  error: {
    label: "Load Error",
    props: studioAccountCoinsErrorFixture,
  },
  purchaseInfo: {
    label: "Purchase Info Open",
    props: studioAccountCoinsPurchaseInfoFixture,
  },
  largeBalance: {
    label: "Large Values",
    props: studioAccountCoinsLargeBalanceFixture,
  },
};

export default function StudioAccountCoinsPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("ready");
  const [purchaseInfoOpen, setPurchaseInfoOpen] = useState(false);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No account or coin balance is connected."
  );

  const activeState = PREVIEW_STATES[activeStateKey];
  const previewProps = {
    ...activeState.props,
    purchaseInfoOpen:
      activeStateKey === "purchaseInfo" ? true : purchaseInfoOpen,
  };

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setPurchaseInfoOpen(false);
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
            Studio Account Coins
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load a profile, retrieve a live coin
            balance, or make a purchase.
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

        <StudioAccountCoinsView
          {...previewProps}
          onOpenPurchaseInfo={() => {
            setPurchaseInfoOpen(true);
            setLastAction(
              "Purchase information opened. No purchase workflow was started."
            );
          }}
          onClosePurchaseInfo={() => {
            setPurchaseInfoOpen(false);
            if (activeStateKey === "purchaseInfo") {
              setActiveStateKey("ready");
            }
            setLastAction("Purchase information closed.");
          }}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready balance and metric labels only.
            Account loading, profile payload parsing, API errors, and coin
            storage remain outside the View.
          </p>
        </section>
      </div>
    </main>
  );
}
