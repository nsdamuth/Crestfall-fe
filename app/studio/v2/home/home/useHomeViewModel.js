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

// Cold-start hero, RULED 11 Aug 2026 (Home top banner empty state):
// with nothing in progress the top banner is the cold-start
// invitation, not a hidden surface, per Continue's existing
// fallback-not-placeholder law.
const TOP_BANNER = {
  eyebrow: "Crestfall Chronicles",
  title: "Start something worth finishing.",
  ctaLabel: "Browse stories",
  secondaryCtaLabel: "See what others made",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
};

const BOTTOM_BANNER = {
  eyebrow: "Play",
  title: "Worlds worth committing to.",
  ctaLabel: "Browse Stories",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
};

// Rail item cap, RULED (Scale Review H, finding B1): each rail caps
// its mounted items at a fixed length rather than rendering an
// unbounded source array; KitRailView has no windowing or
// virtualization, so an uncapped source mounts every card at once.
// "View all" is the sanctioned overflow path to the full paginated
// page. KitRail itself is unchanged; only its caller's input is
// capped, here.
const RAIL_ITEM_CAP = 12;

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
      // Secondary CTA, RULED 11 Aug 2026: quiet ghost action beside
      // Continue, filled state only (the empty-state fallback CTA is
      // a separate open decision, untouched here).
      secondaryCtaLabel: "Explore recent stories",
      onSecondaryCtaClick: () => navigateOrStub("/studio/v2/stories", "Explore recent stories"),
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
      items: (railItemSource ?? HOME_TOP_RATED_ITEMS).slice(0, RAIL_ITEM_CAP).map(decorate),
    }),
    [railItemSource, likedIds, savedIds]
  );

  const recentlyAddedRail = useMemo(
    () => ({
      label: "Recently added",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub(null, "Recently added"),
      items: (railItemSource ?? HOME_RECENTLY_ADDED_ITEMS).slice(0, RAIL_ITEM_CAP).map(decorate),
    }),
    [railItemSource, likedIds, savedIds]
  );

  const fromTheCommunityRail = useMemo(
    () => ({
      label: "From the community",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub("/studio/v2/community", "From the community"),
      items: (railItemSource ?? HOME_FROM_THE_COMMUNITY_ITEMS).slice(0, RAIL_ITEM_CAP).map(decorate),
    }),
    [railItemSource, likedIds, savedIds]
  );

  const creatorsToFollowRail = useMemo(
    () => ({
      label: "Creators to follow",
      viewAllLabel: "View all",
      onViewAll: () => navigateOrStub("/studio/v2/creators", "Creators to follow"),
      items: (railItemSource ?? HOME_CREATORS_TO_FOLLOW_ITEMS).slice(0, RAIL_ITEM_CAP).map(decorate),
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
    onCtaClick: () => navigateOrStub("/studio/v2/stories", TOP_BANNER.ctaLabel),
    onSecondaryCtaClick: () => navigateOrStub("/studio/v2/community", TOP_BANNER.secondaryCtaLabel),
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
