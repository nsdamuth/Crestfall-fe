"use client";

// KitReferralCounter.view: stateless presentation of the referral bonus
// row (contract 1.0.0). One row inside the single column at 390: the
// label with its "i" tip on the left, the count on the right. The tip
// anchors to this row (the row is the positioned ancestor, the InfoTip
// recipe), right-aligned, so it opens above the row inside the panel
// and inside the viewport. The "i" is 44px at coarse pointers through
// the shared InfoTip recipe. No coin number anywhere; no link.
import { InfoTip } from "../form-field/InfoTip";

export default function KitReferralCounterView({
  label = "Referral bonus",
  count = "0",
  tipLabel = "About the referral bonus",
  tipText = "",
}) {
  return (
    <div
      className="relative flex min-w-0 items-center justify-between gap-[var(--space-3)]"
      data-testid="kit-referral-counter"
    >
      <div className="flex min-w-0 items-center gap-[var(--space-1)]">
        <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{label}</p>
        <InfoTip label={tipLabel} text={tipText} align="left" />
      </div>
      <p className="shrink-0 font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
        {count}
      </p>
    </div>
  );
}
