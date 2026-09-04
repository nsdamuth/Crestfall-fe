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

// Default Rendering Style, QUICK field ADDED per docs/STUDIO-SPEC.md
// section 2.2 (10 Aug 2026, Studio brief S2). Options mirror the
// image-creator kit's Render Style list verbatim
// (components/kit/image-creator-panel/KitImageCreatorPanel.fixtures.js),
// values copied not imported since this package is a separate LOOM
// feature. CR-002 carries the backend schema catch-up, still Nick's.
export const RENDERING_STYLE_OPTIONS = [
  { value: "auto", label: "Auto / Character Default" },
  { value: "crestfall_fantasy", label: "Crestfall Fantasy" },
  { value: "crestfall_realistic", label: "Crestfall Realistic" },
  { value: "crestfall_anime_anime", label: "Crestfall Anime" },
  { value: "crestfall_fantasy_realistic", label: "Crestfall Illustrative" },
  { value: "crestfall_fantasy_realism", label: "Crestfall Heroic" },
  { value: "crestfall_realistic_fantasy", label: "Crestfall Cinematic" },
];

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
