"use client";

import { useState } from "react";

import {
  CHARACTER_COLOR_PALETTES,
  DEFAULT_CHARACTER_COLOR_PALETTE_ID,
  getCharacterColorPalette,
} from "@/components/studio/create/character/constants/characterColorPalettes";

const PALETTE_FAMILIES = ["Crestfall", "Winter", "Spring", "Summer", "Autumn"];

function toViewPalette(palette) {
  const colors = palette?.colors || {};

  return {
    id: palette?.id || "",
    label: palette?.label || "Untitled Palette",
    description: palette?.description || "",
    swatches: [
      colors.dialogue,
      colors.narration,
      colors.emphasis,
      colors.strong,
      colors.whisper,
    ].filter(Boolean),
    previewColors: {
      dialogue: colors.dialogue || "var(--foreground)",
      narration: colors.narration || "var(--muted)",
      emphasis: colors.emphasis || "var(--muted-gold)",
      strong: colors.strong || "var(--foreground)",
      whisper: colors.whisper || "var(--muted)",
      speaker: colors.speaker || "var(--foreground)",
      border: colors.border || "transparent",
    },
  };
}

function toViewFamily(family) {
  return {
    id: family.toUpperCase(),
    label: family,
    palettes: CHARACTER_COLOR_PALETTES.filter(
      (palette) => palette.family === family
    ).map(toViewPalette),
  };
}

export function useCharacterColorPaletteModalViewModel({
  value = DEFAULT_CHARACTER_COLOR_PALETTE_ID,
  onChange = null,
} = {}) {
  const [open, setOpen] = useState(false);
  const selectedPalette = getCharacterColorPalette(value);

  function choosePalette(paletteId) {
    onChange?.(paletteId);
    setOpen(false);
  }

  return {
    open,
    triggerEyebrow: "Character Color Palette",
    triggerPalette: toViewPalette(selectedPalette),
    triggerDescription:
      "Used for this character's chat presentation and future character UI accents.",
    modalAriaLabel: "Select character color palette",
    modalEyebrow: "Character Preference",
    modalTitle: "Choose a Color Palette",
    modalDescription:
      "Select one curated seasonal palette. This preference controls chat presentation and may support other character-facing UI later. It is not inferred from appearance and does not affect image generation.",
    selectedPaletteId: selectedPalette.id,
    paletteFamilies: PALETTE_FAMILIES.map(toViewFamily).filter(
      (family) => family.palettes.length > 0
    ),
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onChoosePalette: choosePalette,
  };
}
