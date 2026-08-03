"use client";

import { useState } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";

export const STUDIO_TOP_BAR_COPY = Object.freeze({
  eyebrow: "Studio",
  description: "Manage creations, images, rooms, and account tools.",
  buyCoinsLabel: "Buy Coins",
  notificationsLabel: "Notifications",
  buyCoinsModalTitle: "Buy Coins",
  buyCoinsModalBody:
    "Coin purchases are coming later. For private testing, an admin can manually add coins to your account.",
  notificationsModalTitle: "Notifications",
  notificationsModalBody:
    "Notifications are coming later. This will eventually show review updates, system messages, and creator activity.",
  dismissLabel: "Got it",
});

export function formatStudioCoinBalance(value) {
  const amount = Number.parseInt(value, 10);

  if (!Number.isFinite(amount)) return "0";

  return amount.toLocaleString();
}

export function getStudioTopBarAccountLabel(user = {}) {
  return typeof user?.email === "string" && user.email.trim()
    ? user.email.trim()
    : "Account";
}

export function useStudioTopBarViewModel({ user } = {}) {
  const { coinBalance, accountStatus } = useStudioAccount();
  const [activeUtility, setActiveUtility] = useState(null);

  const formattedCoins =
    accountStatus === "loading" ? "..." : formatStudioCoinBalance(coinBalance);

  return {
    eyebrow: STUDIO_TOP_BAR_COPY.eyebrow,
    description: STUDIO_TOP_BAR_COPY.description,
    formattedCoins,
    buyCoinsLabel: STUDIO_TOP_BAR_COPY.buyCoinsLabel,
    notificationsLabel: STUDIO_TOP_BAR_COPY.notificationsLabel,
    accountHref: "/studio/account",
    accountAriaLabel: getStudioTopBarAccountLabel(user),
    utilityModal:
      activeUtility === "buy"
        ? {
            title: STUDIO_TOP_BAR_COPY.buyCoinsModalTitle,
            body: STUDIO_TOP_BAR_COPY.buyCoinsModalBody,
            dismissLabel: STUDIO_TOP_BAR_COPY.dismissLabel,
          }
        : activeUtility === "notifications"
          ? {
              title: STUDIO_TOP_BAR_COPY.notificationsModalTitle,
              body: STUDIO_TOP_BAR_COPY.notificationsModalBody,
              dismissLabel: STUDIO_TOP_BAR_COPY.dismissLabel,
            }
          : null,
    onOpenBuyCoins: () => setActiveUtility("buy"),
    onOpenNotifications: () => setActiveUtility("notifications"),
    onCloseUtility: () => setActiveUtility(null),
  };
}
