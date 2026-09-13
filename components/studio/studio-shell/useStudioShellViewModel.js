"use client";

export function useStudioShellViewModel({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  reserveMobileDockSpace = true,
  flush = false,
  themeMode = "dark",
  children = null,
}) {
  return {
    sidebarSlot,
    mobileNavSlot,
    topBarSlot,
    reserveMobileDockSpace: reserveMobileDockSpace !== false,
    flush: flush === true,
    themeMode: themeMode === "light" ? "light" : "dark",
    children,
  };
}
