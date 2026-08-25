// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5): the three states named by
// docs/SPRINT-H-PLAN.md's Adventures brief (default, empty catalog,
// longest content). Built directly from useAdventuresViewModel's
// shape rather than re-deriving from adventuresContent.mock.js, so
// these exercise the View in isolation (preview route, section 1
// item 6) without mounting the hook.
import { ADVENTURES_CATALOG_ITEMS, ADVENTURES_SORT_OPTIONS } from "./adventuresContent.mock";

const noop = () => {};

function decorate(item) {
  return { ...item, liked: false, bookmarked: false, onOpenAssetDetail: noop, onLike: noop, onBookmark: noop };
}

// Banner art mirrors useAdventuresViewModel.js, RULED 11 Aug 2026
// (banner-anchor ruling, CC5 banner-audit sitting): see that file's
// banner comments and docs/reviews/BANNER-AUDIT.md.
const TOP_BANNER = {
  eyebrow: "Adventures",
  title: "Seasons worth committing to.",
  ctaLabel: "Build an Adventure",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Saeha Veyrune.png"),
  onCtaClick: noop,
};

const BOTTOM_BANNER = {
  eyebrow: "Create",
  title: "Every Adventure starts in Studio.",
  ctaLabel: "Open Studio",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Enox Nix.png"),
  onCtaClick: noop,
};

const FILTER_BAR = {
  searchValue: "",
  searchPlaceholder: "Search Adventures",
  onSearchChange: noop,
  sortOptions: ADVENTURES_SORT_OPTIONS,
  selectedSort: ADVENTURES_SORT_OPTIONS[0].value,
  onSortChange: noop,
};

const LOAD_MORE = {
  isLoading: false,
  hasMore: true,
  remainingCount: 3,
  onLoadMore: noop,
};

// Default: the ruled catalog, first page visible, load-more available.
export const adventuresDefaultFixture = {
  topBanner: TOP_BANNER,
  filterBar: FILTER_BAR,
  catalogItems: ADVENTURES_CATALOG_ITEMS.slice(0, 6).map(decorate),
  emptyMessage: null,
  errorMessage: null,
  loadMore: LOAD_MORE,
  bottomBanner: BOTTOM_BANNER,
  isBuilderOpen: false,
  onCloseBuilder: noop,
  notice: null,
  onCloseNotice: noop,
};

// Empty catalog: nothing published yet. Ruled empty-state law
// (matching Home's empty-rail precedent): a message, not a fabricated
// placeholder card.
export const adventuresEmptyCatalogFixture = {
  ...adventuresDefaultFixture,
  catalogItems: [],
  emptyMessage: "No Adventures have been published yet.",
  loadMore: { ...LOAD_MORE, hasMore: false, remainingCount: null },
};

// Longest content: the longest title/subtitle fixture, full catalog
// visible, load-more exhausted.
export const adventuresLongestContentFixture = {
  ...adventuresDefaultFixture,
  catalogItems: ADVENTURES_CATALOG_ITEMS.map(decorate),
  loadMore: { isLoading: false, hasMore: false, remainingCount: null, onLoadMore: noop },
};

// Error: load failed (10 Aug 2026 parity audit, section 2 fix). A
// KitAlertStrip danger banner replaces the grid; no page had this
// state before this pass.
export const adventuresErrorFixture = {
  ...adventuresDefaultFixture,
  catalogItems: [],
  emptyMessage: null,
  errorMessage: "Adventures could not be loaded.",
  loadMore: { ...LOAD_MORE, hasMore: false, remainingCount: null },
};
