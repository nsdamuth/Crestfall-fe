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
    tags: Object.freeze(["botanical", "character", "ornamental"]),
  }),
  Object.freeze({
    id: "crestfall-stock-compass",
    title: "Compass",
    src: "/assets/covers/crestfall-compass-cover.png",
    tags: Object.freeze(["cartography", "travel", "world"]),
  }),
  Object.freeze({
    id: "crestfall-stock-statue",
    title: "Statue",
    src: "/assets/covers/crestfall-statue-cover.png",
    tags: Object.freeze(["monument", "history", "world"]),
  }),
  Object.freeze({
    id: "crestfall-stock-book",
    title: "Book",
    src: "/assets/covers/crestfall-book-cover.png",
    tags: Object.freeze(["book", "lore", "story"]),
  }),
  Object.freeze({
    id: "crestfall-stock-sundial",
    title: "Sundial",
    src: "/assets/covers/crestfall-sundial-cover.png",
    tags: Object.freeze(["time", "mechanics", "world"]),
  }),
  Object.freeze({
    id: "crestfall-stock-ballerina",
    title: "Ballerina",
    src: "/assets/covers/crestfall-ballerina-cover.png",
    tags: Object.freeze(["pose", "figure", "character"]),
  }),
  Object.freeze({
    id: "crestfall-stock-cloak",
    title: "Cloak",
    src: "/assets/covers/crestfall-cloak-cover.png",
    tags: Object.freeze(["clothing", "outfit", "object"]),
  }),
  Object.freeze({
    id: "crestfall-stock-drawings",
    title: "Drawings",
    src: "/assets/covers/crestfall-drawings-cover.png",
    tags: Object.freeze(["sketch", "template", "generation"]),
  }),
  Object.freeze({
    id: "crestfall-stock-scrolls",
    title: "Scrolls",
    src: "/assets/covers/crestfall-scrolls-cover.png",
    tags: Object.freeze(["archive", "registry", "lore"]),
  }),
  Object.freeze({
    id: "crestfall-stock-painting",
    title: "Painting",
    src: "/assets/covers/crestfall-painting-cover.png",
    tags: Object.freeze(["art", "image", "visual"]),
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
