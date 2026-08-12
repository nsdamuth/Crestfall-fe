export const KIT_DESTINATION_TILE_VIEW_CONTRACT_VERSION = "1.0.1";

/**
 * Stable portable UI boundary for the Home destination tile kit piece
 * (docs/SPRINT-G-PLAN.md OPEN item 37, ruled option A: a new kit
 * package, built once, consumed eight times by Home, one tile per
 * non-Home section). New package, contract authorized none to 1.0.0
 * at this gate.
 *
 * What the tile renders itself: a single tappable art-bleed surface
 * carrying the section label and one short supporting line over the
 * art, the no-art fallback surface, and its own hover/focus states.
 *
 * What the tile delegates: routing (onOpen, the page owns navigation
 * to the destination section); all data. The tile fetches nothing and
 * holds no application state.
 *
 * @typedef {Object} KitDestinationTileViewProps
 * @property {string} label The destination section's display name.
 * @property {string} supportingLine One short supporting line under the label.
 * @property {string|null} imageSrc Tile art. Null renders the no-art fallback surface.
 * @property {(() => void)|null} onOpen Routes outward on tap. Null is a safe no-op (fixture use only; Home always supplies a real callback).
 *
 * v1.0.1, RULED 11 Aug 2026 (Sprint H render review, item 5): the
 * no-art fallback swaps its generic icon for the shared
 * KitArtPlaceholder camellia mark. No prop change.
 */

export {};
