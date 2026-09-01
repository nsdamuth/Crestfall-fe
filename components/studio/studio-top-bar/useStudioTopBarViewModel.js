"use client";

import { useRef, useState } from "react";

import { fetchStudioNotifications } from "@/lib/client/studio/notifications/studioNotificationsClient";

import {
  projectStudioNotification,
} from "./studioTopBarNotificationPresentation";

export const STUDIO_TOP_BAR_COPY = Object.freeze({
  searchPlaceholder: "Search characters, stories, and adventures",
  notificationsLabel: "Notifications",
  openMenuAriaLabel: "Open menu",
  eggshellThemeLabel: "Switch to Eggshell theme",
  darkThemeLabel: "Switch to Night theme",
});

export function getStudioTopBarAccountLabel(user = {}) {
  return typeof user?.email === "string" && user.email.trim()
    ? user.email.trim()
    : "Account";
}

export function getStudioTopBarAccountInitial(user = {}) {
  const email = typeof user?.email === "string" ? user.email.trim() : "";
  return email ? email.charAt(0).toUpperCase() : "?";
}

export function getStudioTopBarThemeToggleLabel(themeMode = "dark") {
  return themeMode === "light"
    ? STUDIO_TOP_BAR_COPY.darkThemeLabel
    : STUDIO_TOP_BAR_COPY.eggshellThemeLabel;
}

export function getStudioTopBarAccountHref(pathname = "") {
  return pathname === "/studio" || pathname.startsWith("/studio/v2")
    ? "/studio/v2/account"
    : "/studio/account";
}

export function useStudioTopBarViewModel({
  user,
  pathname = "",
  themeMode = "dark",
  onToggleTheme = () => {},
  onOpenMenu = () => {},
  loadNotifications = fetchStudioNotifications,
} = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [notificationsView, setNotificationsView] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsStatus, setNotificationsStatus] = useState("idle");
  const [notificationsLoadError, setNotificationsLoadError] = useState("");
  const bellRef = useRef(null);

  async function openNotifications() {
    setNotificationsView("compact");
    setNotificationsStatus("loading");
    setNotificationsLoadError("");

    try {
      const feed = await loadNotifications({ limit: 20 });
      setNotifications(
        (Array.isArray(feed) ? feed : [])
          .map((notification) => projectStudioNotification(notification))
          .filter(Boolean)
      );
      setNotificationsStatus("loaded");
    } catch (error) {
      setNotifications([]);
      setNotificationsStatus("error");
      setNotificationsLoadError(
        error?.message || "Notifications could not be loaded."
      );
    }
  }

  function closeNotifications() {
    setNotificationsView(null);
    bellRef.current?.focus();
  }

  return {
    searchValue,
    searchPlaceholder: STUDIO_TOP_BAR_COPY.searchPlaceholder,
    onSearchChange: setSearchValue,
    notifications,
    notificationsStatus,
    notificationsLoadError,
    notificationsLabel: STUDIO_TOP_BAR_COPY.notificationsLabel,
    notificationsView,
    bellRef,
    themeMode: themeMode === "light" ? "light" : "dark",
    themeToggleAriaLabel: getStudioTopBarThemeToggleLabel(themeMode),
    onToggleTheme,
    onOpenNotifications: openNotifications,
    onCloseNotifications: closeNotifications,
    accountHref: getStudioTopBarAccountHref(pathname),
    accountAriaLabel: getStudioTopBarAccountLabel(user),
    accountInitial: getStudioTopBarAccountInitial(user),
    openMenuAriaLabel: STUDIO_TOP_BAR_COPY.openMenuAriaLabel,
    onOpenMenu,
  };
}
