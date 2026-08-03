"use client";

import { useState } from "react";

export function useResponsiveFilterPanelViewModel({
  eyebrow,
  body,
  actions = null,
  children,
  mobileDefaultOpen = false,
  desktopDefaultOpen = true,
  showMobileBody = false,
} = {}) {
  const [mobileOpen, setMobileOpen] = useState(mobileDefaultOpen);
  const [desktopOpen, setDesktopOpen] = useState(desktopDefaultOpen);

  return {
    eyebrow,
    body,
    actions,
    children,
    showMobileBody,
    mobileOpen,
    desktopOpen,
    onToggleMobileFilters: () =>
      setMobileOpen((current) => !current),
    onToggleDesktopFilters: () =>
      setDesktopOpen((current) => !current),
  };
}
