"use client";

export function useStudioShellViewModel({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  reserveMobileDockSpace = true,
  themeMode = "dark",
  children = null,
}) {
  return {
    sidebarSlot,
    mobileNavSlot,
    topBarSlot,
    reserveMobileDockSpace: reserveMobileDockSpace !== false,
    themeMode: themeMode === "light" ? "light" : "dark",
    children,
  };
}
