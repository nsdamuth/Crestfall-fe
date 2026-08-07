"use client";

export function useStudioShellViewModel({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  children = null,
}) {
  return {
    sidebarSlot,
    mobileNavSlot,
    topBarSlot,
    children,
  };
}
