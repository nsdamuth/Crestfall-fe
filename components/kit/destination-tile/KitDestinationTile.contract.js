export const KIT_DESTINATION_TILE_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Stable portable UI boundary for the Home destination tile kit piece
 * (docs/SPRINT-G-PLAN.md OPEN item 37, ruled option A: a new kit
 * package, built once, consumed eight times by Home, one tile per
 * non-Home section). New package, contract authorized none to 1.0.0
 * at this gate.
 *
 * What the tile renders itself: the existing single tappable full-bleed art
 * surface carrying the section label and one short supporting line over the
 * background, plus its own hover/focus states. When no explicit art is
 * assigned, a semantic Crestfall identity background fills that same surface.
 *
 * What the tile delegates: routing (onOpen, the page owns navigation
 * to the destination section); all data. The tile fetches nothing and
 * holds no application state.
 *
 * @typedef {Object} KitDestinationTileViewProps
 * @property {string} label The destination section's display name.
 * @property {string} supportingLine One short supporting line under the label.
 * @property {string|null} imageSrc Explicit tile art. Null renders the semantic identity surface.
 * @property {string|null} [identityKey] Optional semantic destination key for the no-art identity treatment.
 * @property {(() => void)|null} onOpen Routes outward on tap. Null is a safe no-op (fixture use only; Home always supplies a real callback).
 *
 * v1.0.1, RULED 11 Aug 2026: the no-art fallback adopted the shared
 * KitArtPlaceholder camellia mark.
 *
 * v1.1.0 introduced optional semantic `identityKey`. v1.2.0 clarifies that
 * this is a background-only substitution: the existing full-bleed 4/3 tile
 * geometry and overlay text placement remain unchanged, while legacy stock
 * cover art is no longer required merely to give a destination tile visual
 * structure.
 */

export {};
