import { Bell, Coins, ShoppingBag } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

// Migrated onto KitModalFrame, RULED (Brian live walk, polish item
// 4): the raw fixed-inset dialog lost the panel-lift gradient and
// the mobile bottom-anchor law. KitModalFrame supplies both, plus
// the circular close control, so this stays a one-panel primitive.
function UtilityModal({ title = "", body = "", onClose = null }) {
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabelledBy="studio-economy-utility-title"
      panelClassName="w-full max-w-sm p-[var(--space-5)]"
    >
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        Crestfall
      </p>
      <h2 id="studio-economy-utility-title" className="mt-2 font-display text-3xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-[var(--ink-dim)]">{body}</p>

      <button
        type="button"
        onClick={() => onClose?.()}
        className="cf-btn cf-btn--primary mt-5 w-full"
      >
        Got it
      </button>
    </KitModalFrame>
  );
}

export default function StudioEconomyWidgetView({
  layoutMode = "expanded",
  balanceLabel = "0",
  buyInfoOpen = false,
  notificationsInfoOpen = false,
  onOpenBuyInfo = null,
  onCloseBuyInfo = null,
  onOpenNotificationsInfo = null,
  onCloseNotificationsInfo = null,
}) {
  const modals = (
    <>
      {buyInfoOpen ? (
        <UtilityModal
          title="Buy Coins"
          body="Coin purchases are coming later. For private testing, an admin can manually add coins to your account."
          onClose={onCloseBuyInfo}
        />
      ) : null}

      {notificationsInfoOpen ? (
        <UtilityModal
          title="Notifications"
          body="Notifications are coming later. This will eventually show review updates, system messages, and creator activity."
          onClose={onCloseNotificationsInfo}
        />
      ) : null}
    </>
  );

  if (layoutMode === "mobileHeader") {
    return (
      <>
        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-2.5 py-2 text-[10px] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
          aria-label={`Coins: ${balanceLabel}`}
        >
          <Coins size={15} />
          <span>{balanceLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenNotificationsInfo?.()}
          className="rounded-lg p-2 text-[var(--ink-dim)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {modals}
      </>
    );
  }

  if (layoutMode === "collapsed") {
    return (
      <>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onOpenBuyInfo?.()}
            title={`Coins: ${balanceLabel}`}
            className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
          >
            <Coins size={16} />
          </button>

          <button
            type="button"
            onClick={() => onOpenNotificationsInfo?.()}
            title="Notifications"
            className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-[var(--ink-dim)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
          >
            <Bell size={16} />
          </button>
        </div>

        {modals}
      </>
    );
  }

  return (
    <>
      <section className="rounded-xl border border-[var(--gold-ornament)]/15 bg-black/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Coins
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              {balanceLabel}
            </p>
          </div>

          <Coins className="text-[var(--gold-ornament)]" size={18} />
        </div>

        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          className="cf-btn cf-btn--primary mt-3 w-full"
        >
          <ShoppingBag size={14} />
          Buy coins
        </button>

        <button
          type="button"
          onClick={() => onOpenNotificationsInfo?.()}
          className="cf-btn cf-btn--secondary mt-2 w-full"
        >
          <Bell size={14} />
          Notifications
        </button>
      </section>

      {modals}
    </>
  );
}
