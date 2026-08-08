"use client";

// DEMO SCAFFOLDING pending CR-017 (docs/CONTRACT-REQUESTS.md). Paired
// with studioTopBarNotifications.mock.js: this hook is what makes the
// mock rows interactive (per-row dismiss, clear all) in the running
// app, entirely in memory, for the current browser session only. It
// mutates no data layer and persists nothing across reloads. Delete
// this file together with studioTopBarNotifications.mock.js and its
// one import in StudioTopBar.jsx when the real feed lands; a real
// dismiss/clear-all needs a services-api mutation instead (see
// CR-017's dev handoff).

import { useState } from "react";

export function useStudioTopBarNotificationsDemoState(initialNotifications = []) {
  const [notifications, setNotifications] = useState(initialNotifications);

  function dismissNotification(id) {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }

  function clearAllNotifications() {
    setNotifications([]);
  }

  return {
    notifications,
    onDismissNotification: dismissNotification,
    onClearAllNotifications: clearAllNotifications,
  };
}
