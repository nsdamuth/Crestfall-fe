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

  // Notifications REMOVED from the expanded and collapsed modes,
  // RULED 23 Aug 2026 (build-0823 pass 4, sidebar refinement):
  // notifications live in the top bar bell only. mobileHeader (above)
  // keeps its own bell for its own consumers; onOpenNotificationsInfo
  // / onCloseNotificationsInfo / notificationsInfoOpen stay in the
  // contract for that mode.
  if (layoutMode === "collapsed") {
    return (
      <>
        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          title={`Coins: ${balanceLabel}`}
          className="flex w-full items-center justify-center rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-2)] text-[var(--gold-ornament)] transition hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)]"
        >
          <Coins size={16} aria-hidden="true" />
        </button>

        {modals}
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] py-[var(--space-2)]">
        <span className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] text-[var(--ink)]">
          <Coins size={16} className="text-[var(--gold-ornament)]" aria-hidden="true" />
          {balanceLabel}
        </span>

        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          className="inline-flex h-[var(--control-sm)] touch-manipulation items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] [@media(pointer:coarse)]:h-[var(--control-md)]"
        >
          <ShoppingBag size={13} aria-hidden="true" />
          Buy Coins
        </button>
      </div>

      {modals}
    </>
  );
}
