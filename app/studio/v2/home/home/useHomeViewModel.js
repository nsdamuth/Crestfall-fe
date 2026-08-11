"use client";

// Normalizes the CR-029 mock feed into Home.view.jsx props and owns
// every piece of presentation-only local state: like/save toggles on
// the rail cards, the top rail's sort selection, and the R4
// fixture-action notice. Routing is not owned here: the Shell passes
// onNavigate (real Next.js navigation for built destinations) and
// this hook decides, per control, whether to call it or open the
// honest stub notice instead.
import { useMemo, useState } from "react";

import {
  HOME_CONTINUE_ITEM,
  HOME_CREATORS_TO_FOLLOW_ITEMS,
  HOME_DESTINATION_TILES,
  HOME_FROM_THE_COMMUNITY_ITEMS,
  HOME_RECENTLY_ADDED_ITEMS,
  HOME_SORT_OPTIONS,
  HOME_TOP_RATED_ITEMS,
} from "./homeContent.mock";

const TOP_BANNER = {
  eyebrow: "Crestfall Chronicles",
  title: "The realm under one sky.",
  ctaLabel: "Start exploring",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
};

const BOTTOM_BANNER = {
  eyebrow: "Play",
  title: "Worlds worth committing to.",
  ctaLabel: "Browse Stories",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
};

export function useHomeViewModel({ fixtureMode = "full", onNavigate = null } = {}) {
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [sortValue, setSortValue] = useState(HOME_SORT_OPTIONS[0].value);
  const [notice, setNotice] = useState(null);

  function toggleId(setter) {
    return (id) =>
      setter((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }

  const toggleLiked = toggleId(setLikedIds);
  const toggleSaved = toggleId(setSavedIds);
  const toggleFollowing = toggleId(setFollowingIds);

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

  const continueItem = useMemo(() => {
    if (fixtureMode === "emptyContinue" || fixtureMode === "emptyRails" || fixtureMode === "error") return null;
    return {
      ...HOME_CONTINUE_ITEM,
      onContinue: () =>
        openNotice(
          "Continue",
          `Resuming "${HOME_CONTINUE_ITEM.title}" opens its chat when live wiring lands. Nothing was opened in this preview.`
        ),
    };
  }, [fixtureMode]);

  const destinationTiles = useMemo(
    () =>
      fixtureMode === "error"
        ? []
        : HOME_DESTINATION_TILES.map((tile) => ({
            id: tile.id,
            label: tile.label,
            supportingLine: tile.supportingLine,
            imageSrc: tile.imageSrc,
            onOpen: () => navigateOrStub(tile.route, tile.label),
          })),
    [fixtureMode]
  );

  function decorateCreationItem(item) {
    return {
      ...item,
      liked: likedIds.includes(item.id),
      bookmarked: savedIds.includes(item.id),
      onOpenImageOverlay: () =>
        openNotice(item.title, `Opening "${item.title}" happens on its own page when live wiring lands.`),
      onOpenAssetDetail: () =>
        openNotice(item.title, `Opening "${item.title}" happens on its own page when live wiring lands.`),
      onLike: () => toggleLiked(item.id),
      onBookmark: () => toggleSaved(item.id),
    };
  }

  function decorateCreatorItem(item) {
    return {
      ...item,
      isFollowing: followingIds.includes(item.id) || item.isFollowing,
      onThumbnailOpen: () =>
        openNotice(item.handle, `Opening ${item.handle}'s work happens on its own page when live wiring lands.`),
      onFollow: () => toggleFollowing(item.id),
      onViewProfile: () =>
        openNotice(item.handle, `${item.handle}'s profile opens when live wiring lands. Nothing was opened in this preview.`),
    };
  }

  function decorate(item) {
    return item.cardKind === "creator" ? decorateCreatorItem(item) : decorateCreationItem(item);
  }

  const railItemSource = fixtureMode === "emptyRails" || fixtureMode === "error" ? [] : null;

  // Error state (10 Aug 2026 parity audit, section 2): no v2 page had
  // one; this restores the KitAlertStrip danger banner every fixture-
  // driven page now carries under fixtureMode "error".
  const errorMessage = fixtureMode === "error" ? "Home could not be loaded." : null;

  const topRatedRail = useMemo(
    () => ({
      label: "Top rated",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub(null, "Top rated"),
      items: (railItemSource ?? HOME_TOP_RATED_ITEMS).map(decorate),
    }),
    [railItemSource, likedIds, savedIds]
  );

  const recentlyAddedRail = useMemo(
    () => ({
      label: "Recently added",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub(null, "Recently added"),
      items: (railItemSource ?? HOME_RECENTLY_ADDED_ITEMS).map(decorate),
    }),
    [railItemSource, likedIds, savedIds]
  );

  const fromTheCommunityRail = useMemo(
    () => ({
      label: "From the community",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub("/studio/v2/community", "From the community"),
      items: (railItemSource ?? HOME_FROM_THE_COMMUNITY_ITEMS).map(decorate),
    }),
    [railItemSource, likedIds, savedIds]
  );

  const creatorsToFollowRail = useMemo(
    () => ({
      label: "Creators to follow",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub("/studio/v2/creators", "Creators to follow"),
      items: (railItemSource ?? HOME_CREATORS_TO_FOLLOW_ITEMS).map(decorate),
    }),
    [railItemSource, followingIds]
  );

  const sortControl = {
    options: HOME_SORT_OPTIONS,
    selectedValue: sortValue,
    onChange: setSortValue,
  };

  const topBanner = {
    ...TOP_BANNER,
    onCtaClick: () =>
      openNotice(TOP_BANNER.ctaLabel, "This banner routes into the journey loop when live wiring lands. Nothing was opened in this preview."),
  };

  const bottomBanner = {
    ...BOTTOM_BANNER,
    onCtaClick: () => navigateOrStub("/studio/v2/stories", "Browse Stories"),
  };

  return {
    topBanner,
    continueItem,
    destinationTiles,
    topRatedRail,
    recentlyAddedRail,
    fromTheCommunityRail,
    creatorsToFollowRail,
    sortControl,
    bottomBanner,
    errorMessage,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
