"use client";

import { useEffect, useState } from "react";

import { fetchCurrentStudioAccount } from "@/lib/client/studio/profile/studioAccountClient";

const STAT_ITEMS = [
  { id: "characters", value: "0", label: "Characters" },
  { id: "canon", value: "0", label: "Canon" },
  { id: "messages", value: "0", label: "Messages" },
  { id: "likes", value: "0", label: "Likes" },
];

function formatCoins(value) {
  const amount = Number.parseInt(value, 10);

  if (!Number.isFinite(amount)) return "0";

  return amount.toLocaleString();
}

export function useStudioAccountCoinsViewModel() {
  const [coinBalance, setCoinBalance] = useState(0);
  const [status, setStatus] = useState("idle");
  const [purchaseInfoOpen, setPurchaseInfoOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCoins() {
      setStatus("loading");

      try {
        const account = await fetchCurrentStudioAccount();

        if (cancelled) return;

        setCoinBalance(account?.coinBalance || 0);
        setStatus("loaded");
      } catch {
        if (cancelled) return;

        setCoinBalance(0);
        setStatus("error");
      }
    }

    loadCoins();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    balanceLabel: status === "loading" ? "..." : formatCoins(coinBalance),
    balanceErrorMessage:
      status === "error" ? "Coin balance could not be loaded." : "",
    statItems: STAT_ITEMS,
    purchaseInfoOpen,
    onOpenPurchaseInfo: () => setPurchaseInfoOpen(true),
    onClosePurchaseInfo: () => setPurchaseInfoOpen(false),
  };
}
