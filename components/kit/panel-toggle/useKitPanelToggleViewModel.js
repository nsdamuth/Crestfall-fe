"use client";

// Pass-through ViewModel for KitPanelToggle (contract 1.0.0).
// Normalizes side and open the same way the original
// RailPanelGlyph's default destructuring did, so a caller feeding
// anything else (undefined, a stray string) still renders the
// resting left-closed glyph rather than throwing.

const SIDES = new Set(["left", "right"]);

export function toPanelToggleSide(side) {
  return SIDES.has(side) ? side : "left";
}

export function useKitPanelToggleViewModel(props = {}) {
  return {
    side: toPanelToggleSide(props.side),
    open: props.open === true,
  };
}
