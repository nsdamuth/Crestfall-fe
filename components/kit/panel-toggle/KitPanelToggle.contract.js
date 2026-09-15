export const KIT_PANEL_TOGGLE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared panel toggle glyph kit
 * piece (ASSET-FOLDERS plan, package AF2, lifted 14 Sep 2026 from
 * `components/studio/story-rooms/story-room-chat-shell/
 * RailPanelGlyph.jsx`, unchanged: the primary sidebar's collapse
 * toggle, the story chat shell's two rail edge toggles, and the
 * composer's mobile story list button share this one drawing so none
 * of them drift; the Folders trigger (AF5, AF6) is the next consumer).
 *
 * One glyph, never mirrored: the panel line sits on the left. Open
 * and closed differ by a 180 degree turn over `--dur-fast`, so the
 * direction always reads: the line faces the panel while it is open
 * and turns away when it is closed. For a panel on the left edge
 * (the primary sidebar, a story list) open is the resting
 * orientation; for a panel on the right edge (a details rail) open
 * is the turned one, set through `side`.
 *
 * The View renders only the glyph, an inert SVG (`aria-hidden`). It
 * is never itself a button: a consumer wraps it in its own `<button>`
 * carrying the click handler, `aria-label`, and `aria-expanded`, using
 * the co-exported `BARE_ICON_BUTTON_CLASS` for that button's 44px
 * bare-icon recipe (no circle, no fill, dim ink at rest, gold on
 * hover, deep gold pressed, the global focus ring). Reduced motion is
 * covered by the existing global `transition-duration` rule
 * (`app/design-system.css`); no component-level rule is added here.
 *
 * @typedef {Object} KitPanelToggleViewProps
 * @property {"left"|"right"} [side] which edge the panel sits on;
 *   default "left"
 * @property {boolean} [open] whether the panel is currently open;
 *   default false
 */

export {};
