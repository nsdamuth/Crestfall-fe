"use client";

import { useRef, useState } from "react";

export const STUDIO_TOP_BAR_COPY = Object.freeze({
  searchPlaceholder: "Search characters, stories, and adventures",
  notificationsLabel: "Notifications",
});

export function getStudioTopBarAccountLabel(user = {}) {
  return typeof user?.email === "string" && user.email.trim()
    ? user.email.trim()
    : "Account";
}

// No notification source exists in the app yet (no contract, no
// endpoint); an empty list is the honest default until CR-017 is
// answered. See StudioTopBar/README.md.
export function useStudioTopBarViewModel({ user, notifications = [] } = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [notificationsView, setNotificationsView] = useState(null);
  const bellRef = useRef(null);

  function openNotifications() {
    setNotificationsView("compact");
  }

  function openNotificationCenter() {
    setNotificationsView("full");
  }

  function closeNotifications() {
    setNotificationsView(null);
    bellRef.current?.focus();
  }

  return {
    searchValue,
    searchPlaceholder: STUDIO_TOP_BAR_COPY.searchPlaceholder,
    onSearchChange: setSearchValue,
    notifications: Array.isArray(notifications) ? notifications : [],
    notificationsLabel: STUDIO_TOP_BAR_COPY.notificationsLabel,
    notificationsView,
    bellRef,
    onOpenNotifications: openNotifications,
    onOpenNotificationCenter: openNotificationCenter,
    onCloseNotifications: closeNotifications,
    accountHref: "/studio/account",
    accountAriaLabel: getStudioTopBarAccountLabel(user),
  };
}
