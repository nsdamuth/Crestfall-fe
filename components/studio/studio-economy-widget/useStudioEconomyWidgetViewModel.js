"use client";

import { useState } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";

function formatCoins(value) {
  const amount = Number.parseInt(value, 10);

  if (!Number.isFinite(amount)) return "0";

  return amount.toLocaleString();
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
    buyInfoOpen,
    notificationsInfoOpen,
    onOpenBuyInfo: () => setBuyInfoOpen(true),
    onCloseBuyInfo: () => setBuyInfoOpen(false),
    onOpenNotificationsInfo: () => setNotificationsInfoOpen(true),
    onCloseNotificationsInfo: () => setNotificationsInfoOpen(false),
  };
}
