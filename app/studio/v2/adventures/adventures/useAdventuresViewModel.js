"use client";

// Normalizes the CR-023 mock catalog into Adventures.view.jsx props
// and owns every piece of presentation-only local state: like/save
// toggles on the catalog cards, search text, sort selection, the
// load-more batch size, the builder-modal open flag, and the R4
// fixture-action notice. Routing is not owned here: the Shell passes
// onNavigate (real Next.js navigation for built destinations) and
// this hook decides, per control, whether to call it or open the
// honest stub notice instead.
import { useMemo, useState } from "react";

import { ADVENTURES_CATALOG_ITEMS, ADVENTURES_SORT_OPTIONS } from "./adventuresContent.mock";

const PAGE_SIZE = 6;

const TOP_BANNER = {
  eyebrow: "Adventures",
  title: "Seasons worth committing to.",
  ctaLabel: "Build an Adventure",
};

// Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5 banner-audit
// sitting): Enox Nix.png, reassigned off Lux.png. Lux.png doubled as
// this banner's art and Studio's door art in the same session; the
// portrait also crops narrow in the widest desktop treatment. Enox
// Nix.png is otherwise unused across every banner slot (see
// docs/reviews/BANNER-AUDIT.md).
const BOTTOM_BANNER = {
  eyebrow: "Create",
  title: "Every Adventure starts in Studio.",
  ctaLabel: "Open Studio",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Enox Nix.png"),
};

function sortItems(items, sortValue) {
  const sorted = [...items];
  if (sortValue === "most-played") {
    sorted.sort((a, b) => (b.stats.plays ?? 0) - (a.stats.plays ?? 0));
  } else if (sortValue === "recently-added") {
    sorted.reverse();
  } else {
    sorted.sort((a, b) => (b.stats.hearts ?? 0) - (a.stats.hearts ?? 0));
  }
  return sorted;
}

export function useAdventuresViewModel({ fixtureMode = "full", onNavigate = null } = {}) {
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(ADVENTURES_SORT_OPTIONS[0].value);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  function toggleId(setter) {
    return (id) =>
      setter((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }

  const toggleLiked = toggleId(setLikedIds);
  const toggleSaved = toggleId(setSavedIds);

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  function navigateOrStub(route, label) {
    if (route) {
      onNavigate?.(route);
      return;
    }
    openNotice(label, `${label} opens once this section is built. Nothing was opened in this preview.`);
  }

  const sourceItems =
    fixtureMode === "emptyCatalog" || fixtureMode === "error" ? [] : ADVENTURES_CATALOG_ITEMS;

  const filteredItems = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const scoped = query
      ? sourceItems.filter((item) => item.title.toLowerCase().includes(query))
      : sourceItems;
    return sortItems(scoped, sortValue);
  }, [sourceItems, searchValue, sortValue]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  const catalogItems = useMemo(
    () =>
      visibleItems.map((item) => ({
        ...item,
        liked: likedIds.includes(item.id),
        bookmarked: savedIds.includes(item.id),
        onOpenAssetDetail: () =>
          openNotice(item.title, `Opening "${item.title}" happens on its own page when live wiring lands.`),
        onLike: () => toggleLiked(item.id),
        onBookmark: () => toggleSaved(item.id),
        // Contextual third face action (RULED 11 Aug 2026): every
        // catalog item here is an Adventure, so every card gets the
        // play action. Same honest-stub posture as the page's other
        // controls, no live destination exists yet.
        onPlay: () =>
          openNotice("Start Chat", `Starting "${item.title}" begins its session when live wiring lands. Nothing was started in this preview.`),
      })),
    [visibleItems, likedIds, savedIds]
  );

  const hasMore = visibleCount < filteredItems.length;
  const remainingCount = hasMore ? filteredItems.length - visibleCount : null;

  const emptyMessage =
    filteredItems.length === 0 && fixtureMode !== "error"
      ? searchValue.trim()
        ? `No Adventures match "${searchValue.trim()}".`
        : "No Adventures have been published yet."
      : null;

  // Error state (10 Aug 2026 parity audit, section 2): no v2 page had
  // one; this restores the KitAlertStrip danger banner every fixture-
  // driven page now carries under fixtureMode "error".
  const errorMessage = fixtureMode === "error" ? "Adventures could not be loaded." : null;

  const filterBar = {
    searchValue,
    searchPlaceholder: "Search Adventures",
    onSearchChange: (value) => {
      setSearchValue(value);
      setVisibleCount(PAGE_SIZE);
    },
    sortOptions: ADVENTURES_SORT_OPTIONS,
    selectedSort: sortValue,
    onSortChange: (value) => {
      setSortValue(value);
      setVisibleCount(PAGE_SIZE);
    },
  };

  const loadMore = {
    isLoading: false,
    hasMore,
    remainingCount,
    onLoadMore: () => setVisibleCount((current) => current + PAGE_SIZE),
  };

  // Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
  // banner-audit sitting): Saeha Veyrune.png, reassigned off
  // whiteviolin.png. whiteviolin.png doubled as this banner's art and
  // Studio's door art in the same session; Saeha Veyrune.png is
  // otherwise unused across every banner slot and reads as an
  // adventurer, fitting the copy (see docs/reviews/BANNER-AUDIT.md).
  const topBanner = {
    ...TOP_BANNER,
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Saeha Veyrune.png"),
    onCtaClick: () => setIsBuilderOpen(true),
  };

  const bottomBanner = {
    ...BOTTOM_BANNER,
    onCtaClick: () => navigateOrStub(null, "Open Studio"),
  };

  return {
    topBanner,
    filterBar,
    catalogItems,
    emptyMessage,
    errorMessage,
    loadMore,
    bottomBanner,
    isBuilderOpen,
    onCloseBuilder: () => setIsBuilderOpen(false),
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
