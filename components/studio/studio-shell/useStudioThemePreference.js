"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getNextStudioThemeMode,
  normalizeStudioThemeMode,
  persistStudioThemeMode,
  STUDIO_THEME_MODES,
} from "./studioThemePreference";

export function useStudioThemePreference(initialThemeMode = STUDIO_THEME_MODES.DARK) {
  const [themeMode, setThemeMode] = useState(() =>
    normalizeStudioThemeMode(initialThemeMode),
  );

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.body.dataset.theme = themeMode;
    document.documentElement.style.colorScheme =
      themeMode === STUDIO_THEME_MODES.EGGSHELL ? "light" : "dark";

    return undefined;
  }, [themeMode]);

  useEffect(
    () => () => {
      if (typeof document === "undefined") return;
      delete document.body.dataset.theme;
      document.documentElement.style.removeProperty("color-scheme");
    },
    [],
  );

  const onToggleTheme = useCallback(() => {
    setThemeMode((currentThemeMode) => {
      const nextThemeMode = getNextStudioThemeMode(currentThemeMode);
      persistStudioThemeMode(nextThemeMode);
      return nextThemeMode;
    });
  }, []);

  return {
    themeMode,
    onToggleTheme,
  };
}
