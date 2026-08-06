import { CHARACTER_COLOR_PALETTES } from "../../constants/characterColorPalettes";

export const VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
];

export const CONTENT_RATING_OPTIONS = [
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
];

export const MINIMUM_ADULT_AGE = 18;

export const COLOR_PALETTE_OPTIONS = CHARACTER_COLOR_PALETTES.map(
  (palette) => ({
    value: palette.id,
    label: palette.label,
    color: palette.colors?.emphasis || palette.colors?.dialogue,
  })
);

// Mirrors normalizeAdultAgeValue in
// components/studio/create/character/review-step/useCharacterReviewStepViewModel.js
export function normalizeAdultAge(value) {
  if (value && Number(value) < MINIMUM_ADULT_AGE) {
    return String(MINIMUM_ADULT_AGE);
  }
  return value;
}
