import { Bell, Coins } from "lucide-react";

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

// Upgrade CTA, RULED 6 Sep 2026 (sidebar batch 2, GO corrections):
// the one gold filled primary button in the rail, label "Upgrade" in
// every state, opening the existing coin purchase flow for now. Built
// from the gold primary tokens directly because the shared .cf-btn
// recipe forces normal case and cannot be overridden from outside.
const UPGRADE_LABEL = "Upgrade";
const UPGRADE_BUTTON_CLASS =
  "inline-flex h-[var(--control-md)] w-full touch-manipulation items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] bg-[var(--gold-action)] bg-[image:var(--grad-gold)] bg-no-repeat text-[length:var(--text-label)] font-[var(--weight-bold)] uppercase tracking-[var(--track-label)] text-[var(--tag-fill-ink)] transition hover:shadow-[var(--glow-hover)]";

export default function StudioEconomyWidgetView({
  layoutMode = "expanded",
  balanceLabel = "0",
  lowBalance = false,
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
  // Collapsed, RULED 6 Sep 2026 (sidebar batch 2, item 5): the coin
  // glyph becomes the gold Upgrade button with the balance as a small
  // badge centered directly above it, so the block keeps the expanded
  // block's height and the dividers land at the same heights. Low
  // balance turns the badge number amber (base status token, badge
  // tier); the gold button is unchanged; tooltip reads "Upgrade".
  if (layoutMode === "collapsed") {
    return (
      <>
        <div className="flex flex-col items-center py-[var(--space-2)]">
          <span
            title={`Coins: ${balanceLabel}`}
            className={`inline-flex h-[var(--lh-ui)] items-center rounded-[var(--radius-full)] border border-[var(--line-strong)] bg-[var(--surface-3)] px-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] tabular-nums ${
              lowBalance ? "text-[var(--status-warning)]" : "text-[var(--ink)]"
            }`}
          >
            {balanceLabel}
          </span>

          <button
            type="button"
            onClick={() => onOpenBuyInfo?.()}
            title={UPGRADE_LABEL}
            aria-label={UPGRADE_LABEL}
            className={`mt-[var(--space-2)] ${UPGRADE_BUTTON_CLASS}`}
          >
            <Coins size={16} aria-hidden="true" />
          </button>
        </div>

        {modals}
      </>
    );
  }

  // Count stacked above a full-width button, RULED 6 Sep 2026 (sidebar
  // batch 1, item 6): the one-row form could not hold the widest label
  // (six characters) beside the button at the expanded sidebar width
  // without wrapping the button label. Batch 2 (same day, items 1 to
  // 4): balance row centered over the Upgrade button on one axis; low
  // balance switches the glyph and number to the warning amber text
  // token while the button stays gold. Same block in the mobile
  // drawer, so both match.
  return (
    <>
      <div className="flex flex-col items-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] py-[var(--space-2)]">
        <span
          className={`inline-flex items-center justify-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] tabular-nums ${
            lowBalance ? "text-[var(--status-warning-text)]" : "text-[var(--ink)]"
          }`}
        >
          <Coins
            size={16}
            className={lowBalance ? "text-[var(--status-warning-text)]" : "text-[var(--gold-ornament)]"}
            aria-hidden="true"
          />
          {balanceLabel}
        </span>

        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          className={`mt-[var(--space-2)] ${UPGRADE_BUTTON_CLASS}`}
        >
          {UPGRADE_LABEL}
        </button>
      </div>

      {modals}
    </>
  );
}
