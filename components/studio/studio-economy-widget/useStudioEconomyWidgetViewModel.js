"use client";

import { useState } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { IMAGE_GENERATION_COIN_COST } from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";

// Low-balance threshold, RULED 6 Sep 2026 (sidebar batch 2, item 4):
// the cost of one standard generation, read from the existing image
// generation cost constant so the value lives in one place until the
// Chassis serves it.
export const LOW_BALANCE_THRESHOLD = IMAGE_GENERATION_COIN_COST;

export function isLowBalance(value) {
  const amount = Number.parseInt(value, 10);
  return Number.isFinite(amount) && amount < LOW_BALANCE_THRESHOLD;
}

// Coin display law, RULED 6 Sep 2026 (sidebar batch 1, item 6): full
// numbers with thousands separators up to 99,999; from 100,000 the
// compact form (100k, 1.2M, 999.9M) so the label never exceeds six
// characters and never wraps or crowds the Buy Coins button.
const COMPACT_THRESHOLD = 100000;
const COMPACT_UNITS = Object.freeze([
  Object.freeze({ divisor: 1e9, suffix: "B" }),
  Object.freeze({ divisor: 1e6, suffix: "M" }),
  Object.freeze({ divisor: 1e3, suffix: "k" }),
]);

function formatCompact(amount) {
  for (let index = 0; index < COMPACT_UNITS.length; index += 1) {
    const { divisor, suffix } = COMPACT_UNITS[index];
    if (amount < divisor) continue;

    const scaled = Math.round((amount / divisor) * 10) / 10;
    // Rounding can carry into the next unit (999,950 reads 1M, not
    // 1000k); promote when a bigger unit exists.
    if (scaled >= 1000 && index > 0) {
      return formatCompact(divisor * 1000);
    }

    return `${Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1)}${suffix}`;
  }

  return amount.toLocaleString("en-US");
}

export function formatCoins(value) {
  const amount = Number.parseInt(value, 10);

  if (!Number.isFinite(amount)) return "0";
  if (Math.abs(amount) >= COMPACT_THRESHOLD) {
    return `${amount < 0 ? "-" : ""}${formatCompact(Math.abs(amount))}`;
  }

  return amount.toLocaleString("en-US");
}

function resolveLayoutMode({ variant, collapsed }) {
  if (variant === "mobileHeader") return "mobileHeader";
  if (collapsed) return "collapsed";

  return "expanded";
}

export function useStudioEconomyWidgetViewModel({
  variant = "sidebar",
  collapsed = false,
} = {}) {
  const { coinBalance, accountStatus } = useStudioAccount();
  const [buyInfoOpen, setBuyInfoOpen] = useState(false);
  const [notificationsInfoOpen, setNotificationsInfoOpen] = useState(false);

  return {
    layoutMode: resolveLayoutMode({ variant, collapsed }),
    balanceLabel:
      accountStatus === "loading" ? "..." : formatCoins(coinBalance),
    lowBalance: accountStatus !== "loading" && isLowBalance(coinBalance),
    buyInfoOpen,
    notificationsInfoOpen,
    onOpenBuyInfo: () => setBuyInfoOpen(true),
    onCloseBuyInfo: () => setBuyInfoOpen(false),
    onOpenNotificationsInfo: () => setNotificationsInfoOpen(true),
    onCloseNotificationsInfo: () => setNotificationsInfoOpen(false),
  };
}
