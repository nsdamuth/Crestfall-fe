/**
 * Crestfall-owned legacy cover artwork retained as reusable media inventory.
 *
 * These assets are intentionally NOT creation fallbacks. A creation without
 * explicitly assigned artwork should render a semantic identity treatment.
 * This catalogue is the presentation-side seed for a future Crestfall Stock
 * picker, where choosing one of these images is an explicit creator action.
 */
export const CRESTFALL_LEGACY_STOCK_MEDIA = Object.freeze([
  Object.freeze({
    id: "crestfall-stock-camellia",
    title: "Camellia",
    src: "/assets/covers/crestfall-camellia-cover.png",
    category: "Art & Ornament",
    orientation: "portrait",
    description: "Botanical Crestfall cover art with a dark ornamental mood.",
    tags: Object.freeze(["botanical", "ornamental", "floral", "dark"]),
  }),
  Object.freeze({
    id: "crestfall-stock-compass",
    title: "Compass",
    src: "/assets/covers/crestfall-compass-cover.png",
    category: "Worlds & Places",
    orientation: "portrait",
    description: "Antique navigation artwork for travel, locations, and worldbuilding.",
    tags: Object.freeze(["cartography", "travel", "world", "location"]),
  }),
  Object.freeze({
    id: "crestfall-stock-statue",
    title: "Statue",
    src: "/assets/covers/crestfall-statue-cover.png",
    category: "Worlds & Places",
    orientation: "portrait",
    description: "Monumental figure artwork suited to history, landmarks, and settings.",
    tags: Object.freeze(["monument", "history", "world", "location"]),
  }),
  Object.freeze({
    id: "crestfall-stock-book",
    title: "Book",
    src: "/assets/covers/crestfall-book-cover.png",
    category: "Story & Lore",
    orientation: "portrait",
    description: "Antique book artwork for stories, chronicles, codices, and lore.",
    tags: Object.freeze(["book", "lore", "story", "codex"]),
  }),
  Object.freeze({
    id: "crestfall-stock-sundial",
    title: "Sundial",
    src: "/assets/covers/crestfall-sundial-cover.png",
    category: "Worlds & Places",
    orientation: "portrait",
    description: "Timeworn sundial artwork for chronology, mechanics, and world history.",
    tags: Object.freeze(["time", "mechanics", "world", "history"]),
  }),
  Object.freeze({
    id: "crestfall-stock-ballerina",
    title: "Ballerina",
    src: "/assets/covers/crestfall-ballerina-cover.png",
    category: "Figures & Portraits",
    orientation: "portrait",
    description: "Figure-focused artwork for characters, performers, and pose-driven creations.",
    tags: Object.freeze(["pose", "figure", "character", "performance"]),
  }),
  Object.freeze({
    id: "crestfall-stock-cloak",
    title: "Cloak",
    src: "/assets/covers/crestfall-cloak-cover.png",
    category: "Objects & Wardrobe",
    orientation: "portrait",
    description: "Garment-focused artwork for outfits, objects, and equipment.",
    tags: Object.freeze(["clothing", "outfit", "object", "wardrobe"]),
  }),
  Object.freeze({
    id: "crestfall-stock-drawings",
    title: "Drawings",
    src: "/assets/covers/crestfall-drawings-cover.png",
    category: "Art & Ornament",
    orientation: "portrait",
    description: "Sketchbook-style artwork for templates, concepts, and generation tools.",
    tags: Object.freeze(["sketch", "template", "generation", "concept"]),
  }),
  Object.freeze({
    id: "crestfall-stock-scrolls",
    title: "Scrolls",
    src: "/assets/covers/crestfall-scrolls-cover.png",
    category: "Story & Lore",
    orientation: "portrait",
    description: "Archival scroll artwork for lore, registries, records, and histories.",
    tags: Object.freeze(["archive", "registry", "lore", "history"]),
  }),
  Object.freeze({
    id: "crestfall-stock-painting",
    title: "Painting",
    src: "/assets/covers/crestfall-painting-cover.png",
    category: "Art & Ornament",
    orientation: "portrait",
    description: "Painterly visual artwork for images, art-focused assets, and presentation.",
    tags: Object.freeze(["art", "image", "visual", "painting"]),
  }),
]);

export const CRESTFALL_LEGACY_STOCK_MEDIA_PATHS = Object.freeze(
  CRESTFALL_LEGACY_STOCK_MEDIA.map((item) => item.src)
);

const CRESTFALL_LEGACY_STOCK_MEDIA_BY_PATH = new Map(
  CRESTFALL_LEGACY_STOCK_MEDIA.map((item) => [item.src, item])
);

export function getCrestfallLegacyStockMediaByPath(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized ? CRESTFALL_LEGACY_STOCK_MEDIA_BY_PATH.get(normalized) || null : null;
}
