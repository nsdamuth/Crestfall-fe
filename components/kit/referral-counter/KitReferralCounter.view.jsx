"use client";

// KitReferralCounter.view: stateless presentation of the referral bonus
// row (contract 1.1.0). One line inside the coins block, left-aligned:
// the label, then the number in the balance ink one type step up, then
// the "i" tip, one small gap between each, nothing right-justified
// (follow-up 2, item 4). The tip anchors to this row (the row is the
// positioned ancestor, the InfoTip recipe), left-aligned, so it opens
// above the row inside the panel and inside the viewport. The "i" is
// 44px at coarse pointers through the shared InfoTip recipe. No coin
// number anywhere; no link.
import { InfoTip } from "../form-field/InfoTip";

export default function KitReferralCounterView({
  label = "Referral bonus",
  count = "0",
  tipLabel = "About the referral bonus",
  tipText = "",
}) {
  return (
    <div
      className="relative flex min-w-0 items-center justify-start gap-[var(--space-2)]"
      data-testid="kit-referral-counter"
    >
      <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{label}</p>
      <p className="shrink-0 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">{count}</p>
      <InfoTip label={tipLabel} text={tipText} align="left" />
    </div>
  );
}
