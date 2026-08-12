// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5): the three states named by
// docs/SPRINT-G-PLAN.md's Home brief. Built directly from
// useHomeViewModel's shape rather than re-deriving from
// homeContent.mock.js, so these exercise the View in isolation
// (preview route, section 1 item 6) without mounting the hook.
import {
  HOME_CREATORS_TO_FOLLOW_ITEMS,
  HOME_DESTINATION_TILES,
  HOME_FROM_THE_COMMUNITY_ITEMS,
  HOME_RECENTLY_ADDED_ITEMS,
  HOME_SORT_OPTIONS,
  HOME_TOP_RATED_ITEMS,
} from "./homeContent.mock";

const noop = () => {};

function decorate(item) {
  return item.cardKind === "creator"
    ? { ...item, onThumbnailOpen: noop, onFollow: noop, onViewProfile: noop }
    : { ...item, onOpenImageOverlay: noop, onOpenAssetDetail: noop, onLike: noop, onBookmark: noop };
}

const TOP_BANNER = {
  eyebrow: "Crestfall Chronicles",
  title: "Start something worth finishing.",
  ctaLabel: "Browse stories",
  secondaryCtaLabel: "See what others made",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
  onCtaClick: noop,
  onSecondaryCtaClick: noop,
};

const BOTTOM_BANNER = {
  eyebrow: "Play",
  title: "Worlds worth committing to.",
  ctaLabel: "Browse Stories",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
  onCtaClick: noop,
};

const CONTINUE_ITEM = {
  id: "home-continue-1",
  title: "The Hollow Road",
  kindLabel: "Story",
  lastPlayedLabel: "2 hours ago",
  imageSrc: HOME_TOP_RATED_ITEMS[1]?.imageSrc ?? null,
  onContinue: noop,
};

function rail(label, items) {
  return { label, viewAllLabel: "View all", onViewAll: noop, items: items.map(decorate) };
}

const SORT_CONTROL = {
  options: HOME_SORT_OPTIONS,
  selectedValue: HOME_SORT_OPTIONS[0].value,
  onChange: noop,
};

const DESTINATION_TILES = HOME_DESTINATION_TILES.map((tile) => ({ ...tile, onOpen: noop }));

// Full page: every section populated, the ruled default state. With
// continueItem present, the one top banner shows the continue-state
// content (RULED 10 Aug 2026, docs/SPRINT-H-PLAN.md 1a).
export const homeFullPageFixture = {
  topBanner: TOP_BANNER,
  continueItem: CONTINUE_ITEM,
  destinationTiles: DESTINATION_TILES,
  topRatedRail: rail("Top rated", HOME_TOP_RATED_ITEMS),
  recentlyAddedRail: rail("Recently added", HOME_RECENTLY_ADDED_ITEMS),
  fromTheCommunityRail: rail("From the community", HOME_FROM_THE_COMMUNITY_ITEMS),
  creatorsToFollowRail: rail("Creators to follow", HOME_CREATORS_TO_FOLLOW_ITEMS),
  sortControl: SORT_CONTROL,
  bottomBanner: BOTTOM_BANNER,
  errorMessage: null,
  notice: null,
  onCloseNotice: noop,
};

// Empty Continue: nothing in progress. Ruled 11 Aug 2026 (Home top
// banner empty state): the one top banner falls back to the
// cold-start invitation (Eden art, galaxy on, "Browse stories"
// primary CTA, "See what others made" ghost CTA) rather than
// rendering a second empty surface.
export const homeEmptyContinueFixture = {
  ...homeFullPageFixture,
  continueItem: null,
};

// Empty rails: every rail has zero cards. Ruled (empty-rail law,
// docs/BUILD-BLUEPRINT.md 2.18): a rail with nothing in it renders
// nothing at all, head included. Continue is also empty here (the top
// banner falls back to the general hero), leaving only the top
// banner, the destination tiles, and the bottom banner.
export const homeEmptyRailsFixture = {
  ...homeFullPageFixture,
  continueItem: null,
  topRatedRail: rail("Top rated", []),
  recentlyAddedRail: rail("Recently added", []),
  fromTheCommunityRail: rail("From the community", []),
  creatorsToFollowRail: rail("Creators to follow", []),
};

// Error: load failed (10 Aug 2026 parity audit, section 2 fix). A
// KitAlertStrip danger banner replaces the destination tiles and
// rails; no page had this state before this pass.
export const homeErrorFixture = {
  ...homeFullPageFixture,
  continueItem: null,
  destinationTiles: [],
  topRatedRail: rail("Top rated", []),
  recentlyAddedRail: rail("Recently added", []),
  fromTheCommunityRail: rail("From the community", []),
  creatorsToFollowRail: rail("Creators to follow", []),
  errorMessage: "Home could not be loaded.",
};
