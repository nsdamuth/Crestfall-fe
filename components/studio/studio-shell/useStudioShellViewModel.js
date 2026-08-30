"use client";

export function useStudioShellViewModel({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  reserveMobileDockSpace = true,
  children = null,
}) {
  return {
    sidebarSlot,
    mobileNavSlot,
    topBarSlot,
    reserveMobileDockSpace: reserveMobileDockSpace !== false,
    children,
  };
}
