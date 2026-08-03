"use client";

import { useState } from "react";

import StudioEconomyWidgetView from "@/components/studio/studio-economy-widget/StudioEconomyWidget.view";
import {
  studioEconomyWidgetBuyInfoFixture,
  studioEconomyWidgetCollapsedFixture,
  studioEconomyWidgetExpandedFixture,
  studioEconomyWidgetLargeBalanceFixture,
  studioEconomyWidgetLoadingFixture,
  studioEconomyWidgetMobileHeaderFixture,
  studioEconomyWidgetNotificationsInfoFixture,
} from "@/components/studio/studio-economy-widget/StudioEconomyWidget.fixtures";

const PREVIEW_STATES = {
  expanded: {
    label: "Expanded Sidebar",
    props: studioEconomyWidgetExpandedFixture,
  },
  collapsed: {
    label: "Collapsed Sidebar",
    props: studioEconomyWidgetCollapsedFixture,
  },
  mobileHeader: {
    label: "Mobile Header",
    props: studioEconomyWidgetMobileHeaderFixture,
  },
  loading: {
    label: "Loading",
    props: studioEconomyWidgetLoadingFixture,
  },
  buyInfo: {
    label: "Buy Coins Open",
    props: studioEconomyWidgetBuyInfoFixture,
  },
  notificationsInfo: {
    label: "Notifications Open",
    props: studioEconomyWidgetNotificationsInfoFixture,
  },
  largeBalance: {
    label: "Large Balance",
    props: studioEconomyWidgetLargeBalanceFixture,
  },
};

export default function StudioEconomyWidgetPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("expanded");
  const [buyInfoOpen, setBuyInfoOpen] = useState(false);
  const [notificationsInfoOpen, setNotificationsInfoOpen] = useState(false);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Studio account is connected."
  );

  const activeState = PREVIEW_STATES[activeStateKey];
  const previewProps = {
    ...activeState.props,
    buyInfoOpen: activeStateKey === "buyInfo" ? true : buyInfoOpen,
    notificationsInfoOpen:
      activeStateKey === "notificationsInfo" ? true : notificationsInfoOpen,
  };

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setBuyInfoOpen(false);
    setNotificationsInfoOpen(false);
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
            Studio Economy Widget
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixtures. It
            does not authenticate a user, load a Studio account, or perform a
            coin purchase.
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
          <div
            className={
              previewProps.layoutMode === "expanded"
                ? "max-w-[14rem]"
                : previewProps.layoutMode === "collapsed"
                  ? "w-14"
                  : "flex items-center gap-3"
            }
          >
            <StudioEconomyWidgetView
              {...previewProps}
              onOpenBuyInfo={() => {
                setBuyInfoOpen(true);
                setNotificationsInfoOpen(false);
                setLastAction(
                  "Buy Coins information opened. No purchase workflow was started."
                );
              }}
              onCloseBuyInfo={() => {
                setBuyInfoOpen(false);
                if (activeStateKey === "buyInfo") {
                  setActiveStateKey("expanded");
                }
                setLastAction("Buy Coins information closed.");
              }}
              onOpenNotificationsInfo={() => {
                setNotificationsInfoOpen(true);
                setBuyInfoOpen(false);
                setLastAction(
                  "Notifications information opened. No notification data was loaded."
                );
              }}
              onCloseNotificationsInfo={() => {
                setNotificationsInfoOpen(false);
                if (activeStateKey === "notificationsInfo") {
                  setActiveStateKey("expanded");
                }
                setLastAction("Notifications information closed.");
              }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only a display-ready balance, layout mode, and
            information-dialog state. Studio account context, loading status,
            balance parsing, and host-variant translation remain outside the
            View.
          </p>
        </section>
      </div>
    </main>
  );
}
