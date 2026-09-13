"use client";

// Pass-through ViewModel for KitReferralCounter (contract 1.0.0). Turns
// the account snapshot's referral field into display-ready props: a
// missing, null, or malformed count reads as 0, never as hidden. The
// copy lives here, not in the View.

export const REFERRAL_COUNTER_COPY = Object.freeze({
  label: "Referral bonus",
  tipLabel: "About the referral bonus",
  tipText: "Earn coins when someone who opened your share link subscribes.",
});

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

// referral.creditedCount from the account snapshot: a non-negative
// integer when served, anything else (undefined while CR-073 is open,
// null, a string, a negative) folds to 0.
export function toReferralCreditedCount(referral) {
  const source = referral && typeof referral === "object" ? referral : {};
  const raw = source.creditedCount ?? source.credited_count;
  const number = typeof raw === "number" ? raw : Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.floor(number);
}

export function formatReferralCount(count) {
  return new Intl.NumberFormat().format(toReferralCreditedCount({ creditedCount: count }));
}

export function useKitReferralCounterViewModel(props = {}) {
  const creditedCount = toReferralCreditedCount(props.referral ?? { creditedCount: props.creditedCount });

  return {
    label: text(props.label) || REFERRAL_COUNTER_COPY.label,
    count: formatReferralCount(creditedCount),
    tipLabel: text(props.tipLabel) || REFERRAL_COUNTER_COPY.tipLabel,
    tipText: text(props.tipText) || REFERRAL_COUNTER_COPY.tipText,
  };
}
