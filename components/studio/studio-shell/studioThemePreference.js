export const STUDIO_THEME_COOKIE = "crestfall_studio_theme";
export const STUDIO_THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const STUDIO_THEME_MODES = Object.freeze({
  DARK: "dark",
  EGGSHELL: "light",
});

export function normalizeStudioThemeMode(value) {
  return String(value || "").trim().toLowerCase() === STUDIO_THEME_MODES.EGGSHELL
    ? STUDIO_THEME_MODES.EGGSHELL
    : STUDIO_THEME_MODES.DARK;
}

export function getNextStudioThemeMode(value) {
  return normalizeStudioThemeMode(value) === STUDIO_THEME_MODES.EGGSHELL
    ? STUDIO_THEME_MODES.DARK
    : STUDIO_THEME_MODES.EGGSHELL;
}

export function persistStudioThemeMode(value) {
  if (typeof document === "undefined") return;

  const normalized = normalizeStudioThemeMode(value);
  document.cookie = `${STUDIO_THEME_COOKIE}=${normalized}; Path=/studio; Max-Age=${STUDIO_THEME_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}
