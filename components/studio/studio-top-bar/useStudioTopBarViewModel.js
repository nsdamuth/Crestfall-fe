"use client";

import { useRef, useState } from "react";

export const STUDIO_TOP_BAR_COPY = Object.freeze({
  searchPlaceholder: "Search characters, stories, and adventures",
  notificationsLabel: "Notifications",
  openMenuAriaLabel: "Open menu",
});

export function getStudioTopBarAccountLabel(user = {}) {
  return typeof user?.email === "string" && user.email.trim()
    ? user.email.trim()
    : "Account";
}

// Same initial-from-name recipe as the sidebar's signed-in footer
// (StudioSidebar.view.jsx): first character of the account email,
// uppercased, or "?" when there is none.
export function getStudioTopBarAccountInitial(user = {}) {
  const email = typeof user?.email === "string" ? user.email.trim() : "";
  return email ? email.charAt(0).toUpperCase() : "?";
}

// No notification source exists in the app yet (no contract, no
// endpoint); an empty list is the honest default until CR-017 is
// answered. See StudioTopBar/README.md.
export function useStudioTopBarViewModel({
  user,
  notifications = [],
  onOpenMenu = () => {},
} = {}) {
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
    accountInitial: getStudioTopBarAccountInitial(user),
    openMenuAriaLabel: STUDIO_TOP_BAR_COPY.openMenuAriaLabel,
    onOpenMenu,
  };
}
