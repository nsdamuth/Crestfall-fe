"use client";

import { useEffect, useState } from "react";

function getDefaultViewMode(storageKey, desktopDefault = "grid", mobileDefault = "list") {
  if (typeof window === "undefined") return desktopDefault;

  const saved = window.localStorage.getItem(storageKey);

  if (saved === "grid" || saved === "list") {
    return saved;
  }

  return window.matchMedia("(max-width: 768px)").matches
    ? mobileDefault
    : desktopDefault;
}

export default function usePersistentViewMode({
  storageKey,
  desktopDefault = "grid",
  mobileDefault = "list",
}) {
  const [viewMode, setViewMode] = useState(() =>
    getDefaultViewMode(storageKey, desktopDefault, mobileDefault)
  );

  function updateViewMode(nextMode) {
    setViewMode(nextMode);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, nextMode);
    }
  }

  return [viewMode, updateViewMode];
}