import { Bell, Coins, ShoppingBag, X } from "lucide-react";

function UtilityModal({ title = "", body = "", onClose = null }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section className="w-full max-w-sm rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              Crestfall
            </p>
            <h2 className="mt-2 font-display text-3xl">{title}</h2>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{body}</p>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="mt-5 w-full rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          Got it
        </button>
      </section>
    </div>
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
          className="inline-flex items-center gap-1 rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-2.5 py-2 text-[10px] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          aria-label={`Coins: ${balanceLabel}`}
        >
          <Coins size={15} />
          <span>{balanceLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenNotificationsInfo?.()}
          className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
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
            className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
          >
            <Coins size={16} />
          </button>

          <button
            type="button"
            onClick={() => onOpenNotificationsInfo?.()}
            title="Notifications"
            className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-[var(--muted)] transition hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
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
      <section className="rounded-xl border border-[var(--muted-gold)]/15 bg-black/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              Coins
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">
              {balanceLabel}
            </p>
          </div>

          <Coins className="text-[var(--muted-gold)]" size={18} />
        </div>

        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <ShoppingBag size={14} />
          Buy Coins
        </button>

        <button
          type="button"
          onClick={() => onOpenNotificationsInfo?.()}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          <Bell size={14} />
          Notifications
        </button>
      </section>

      {modals}
    </>
  );
}
