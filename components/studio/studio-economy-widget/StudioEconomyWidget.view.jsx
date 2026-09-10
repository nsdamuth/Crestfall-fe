import { Bell, Coins } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

// Migrated onto KitModalFrame, RULED (Brian live walk, polish item
// 4): the raw fixed-inset dialog lost the panel-lift gradient and
// the mobile bottom-anchor law. KitModalFrame supplies both, plus
// the circular close control, so this stays a one-panel primitive.
function UtilityModal({ title = "", body = "", onClose = null }) {
  // Inset moved off the panel onto an inner content box, RULED 6 Sep
  // 2026 (sidebar batch 2 fixes, item 4): the frame's panel recipe
  // zeroes the panel's bottom padding at desktop widths (and swaps it
  // for the safe-area inset on mobile), which overrode the panel-level
  // padding and left the Got it button flush at the edges. The content
  // box carries --space-6 on all sides, the frame's own confirm-block
  // inset, so the copy and the button share one equal inset.
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabelledBy="studio-economy-utility-title"
      panelClassName="w-full max-w-sm"
    >
      <div className="p-[var(--space-6)]">
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
          className="cf-btn cf-btn--primary cf-btn--sm mt-5 w-full"
        >
          Got it
        </button>
      </div>
    </KitModalFrame>
  );
}

// Upgrade CTA, RULED 6 Sep 2026 (sidebar batch 2, GO corrections and
// the batch 2 fixes): the one gold filled primary button in the rail,
// label "Upgrade" in every state, opening the existing coin purchase
// flow for now. Expanded uses the shared .cf-btn--primary recipe as
// is (its own case and weight, no icon), full block width. Collapsed
// keeps a token-built gold square because the recipe's horizontal
// padding (--space-6 each side) is wider than the collapsed rail's
// inner width.
const UPGRADE_LABEL = "Upgrade";
const COLLAPSED_UPGRADE_BUTTON_CLASS =
  "inline-flex h-[var(--control-md)] w-full touch-manipulation items-center justify-center rounded-[var(--radius-md)] bg-[var(--gold-action)] bg-[image:var(--grad-gold)] bg-no-repeat text-[var(--tag-fill-ink)] transition hover:shadow-[var(--glow-hover)]";

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
  // Collapsed, RULED 6 Sep 2026 (sidebar batch 2 fixes, item 2): only
  // the gold coin button, tooltip "Upgrade". No balance number or
  // badge anywhere in this mode; lowBalance has no collapsed
  // presentation.
  if (layoutMode === "collapsed") {
    return (
      <>
        <div className="flex flex-col items-center py-[var(--space-2)]">
          <button
            type="button"
            onClick={() => onOpenBuyInfo?.()}
            title={UPGRADE_LABEL}
            aria-label={UPGRADE_LABEL}
            className={COLLAPSED_UPGRADE_BUTTON_CLASS}
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
        {/* Glyph and number share the rail's standard ornament gold,
            RULED 6 Sep 2026 (coin balance gold fix); amber only in
            the low state, which never fires at zero. */}
        <span
          className={`inline-flex items-center justify-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] tabular-nums ${
            lowBalance ? "text-[var(--status-warning-text)]" : "text-[var(--gold-ornament)]"
          }`}
        >
          <Coins size={16} aria-hidden="true" />
          {balanceLabel}
        </span>

        <button
          type="button"
          onClick={() => onOpenBuyInfo?.()}
          // Smaller than the stock primary, RULED 10 Sep 2026 (browser
          // review rounds 6 and 7, screenshots): the recipe's own small
          // step, .cf-btn--sm (--control-sm height, --text-label label).
          // Utility overrides cannot do this: design-system.css imports
          // after the Tailwind layer, so .cf-btn's height and font-size
          // win over same-specificity h-/text- utilities. Gold recipe,
          // full block width, and the label are unchanged.
          className="cf-btn cf-btn--primary cf-btn--sm mt-[var(--space-2)] w-full"
        >
          {UPGRADE_LABEL}
        </button>
      </div>

      {modals}
    </>
  );
}
