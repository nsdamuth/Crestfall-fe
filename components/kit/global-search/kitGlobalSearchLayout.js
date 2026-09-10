// The two height caps of the global search, defined once here and read
// by the View (RULED, FE/GLOBAL-SEARCH follow-up 1, 10 Sep 2026):
// the View carries no numeric literal for either.
//
// Desktop panel (R1): about five rows of "Your items" plus its section
// title before the list scrolls, expressed as six times the ruled
// control height (--control-md, 44px, the row minimum), and never
// taller than the space below the sticky top bar.
export const KIT_GLOBAL_SEARCH_PANEL_CAP =
  "min(calc(var(--control-md) * 6), calc(100dvh - var(--topbar-h) - var(--space-6)))";

// Phone sheet (R2): the sheet opens at about 80 percent of the
// viewport, the input stays the sticky first child, the list scrolls
// inside. Nothing in the design system names a viewport fraction, so
// the ruled fraction lives here once; the frame's own header row
// (control height, its
// padding, its divider) is subtracted so the whole sheet, header
// included, lands at that height.
export const KIT_GLOBAL_SEARCH_SHEET_CAP =
  "calc(80dvh - var(--control-md) - var(--space-3) * 2 - 1px)";
