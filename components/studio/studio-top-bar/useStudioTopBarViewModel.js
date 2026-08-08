"use client";

import { useState } from "react";

export const STUDIO_TOP_BAR_COPY = Object.freeze({
  searchPlaceholder: "Search tools and builders",
  notificationsLabel: "Notifications",
});

export function getStudioTopBarAccountLabel(user = {}) {
  return typeof user?.email === "string" && user.email.trim()
    ? user.email.trim()
    : "Account";
}

// No notification source exists in the app yet (no contract, no
// endpoint); an empty list is the honest default until CR-xxx is
// answered. See StudioTopBar/README.md.
export function useStudioTopBarViewModel({ user, notifications = [] } = {}) {
  const [searchValue, setSearchValue] = useState("");

  return {
    searchValue,
    searchPlaceholder: STUDIO_TOP_BAR_COPY.searchPlaceholder,
    onSearchChange: setSearchValue,
    notifications: Array.isArray(notifications) ? notifications : [],
    notificationsLabel: STUDIO_TOP_BAR_COPY.notificationsLabel,
    accountHref: "/studio/account",
    accountAriaLabel: getStudioTopBarAccountLabel(user),
  };
}
