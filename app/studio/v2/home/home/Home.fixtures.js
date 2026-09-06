// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5). Built directly from useHomeViewModel's shape
// rather than re-deriving from homeContent.mock.js, so these exercise
// the View in isolation without mounting the hook. Reshaped 6 Sep 2026
// (Home fine-tuning batch 1, contract 4.0.0): section rails replace the
// destination tiles and the four named rails.
import {
  HOME_CREATORS_TO_FOLLOW_ITEMS,
  HOME_FROM_THE_COMMUNITY_ITEMS,
  HOME_RECENTLY_ADDED_ITEMS,
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
  ctaLabel: "Open Stories",
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

const CREATION_SORT_OPTIONS = [
  { value: "plays", label: "Most plays" },
  { value: "likes", label: "Most likes" },
  { value: "saves", label: "Most saved" },
  { value: "newest", label: "Newest" },
];

// Creators data carries likes only (creatorPresentation: plays null,
// no saves, recency 0), so its rail offers the one option that works.
const CREATOR_SORT_OPTIONS = [{ value: "likes", label: "Most likes" }];

function sortControl(options) {
  return options.length
    ? { options, selectedValue: options[0].value, onChange: noop }
    : null;
}

function sectionRail(id, label, items, options = CREATION_SORT_OPTIONS) {
  return {
    id,
    label,
    viewAllLabel: "View all",
    onViewAll: noop,
    items: items.map(decorate),
    sortControl: sortControl(options),
  };
}

const SECTION_RAILS = [
  sectionRail("stories", "Stories", HOME_TOP_RATED_ITEMS),
  sectionRail("adventures", "Adventures", HOME_RECENTLY_ADDED_ITEMS),
  // Studio and Images have no list data source anywhere in the app
  // (reported data gaps); their rails are empty and render nothing.
  sectionRail("studio", "Studio", [], []),
  sectionRail("images", "Images", [], []),
  sectionRail("vault", "Vault", HOME_FROM_THE_COMMUNITY_ITEMS),
  sectionRail("community", "Community", HOME_TOP_RATED_ITEMS),
  sectionRail("creators", "Creators", HOME_CREATORS_TO_FOLLOW_ITEMS, CREATOR_SORT_OPTIONS),
  sectionRail("lore", "Lore", HOME_RECENTLY_ADDED_ITEMS, CREATION_SORT_OPTIONS.slice(1)),
];

// Full page: every section populated, the ruled default state. With
// continueItem present, the one top banner shows the continue-state
// content (RULED 10 Aug 2026, docs/SPRINT-H-PLAN.md 1a).
export const homeFullPageFixture = {
  topBanner: TOP_BANNER,
  continueItem: CONTINUE_ITEM,
  welcomeName: "Player",
  sectionRails: SECTION_RAILS,
  bottomBanner: BOTTOM_BANNER,
  errorMessage: null,
  warningMessage: null,
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
// banner falls back to the general hero), leaving only the top banner
// and the bottom banner.
export const homeEmptyRailsFixture = {
  ...homeFullPageFixture,
  continueItem: null,
  sectionRails: SECTION_RAILS.map((rail) => ({ ...rail, items: [], sortControl: null })),
};

// Error: load failed (10 Aug 2026 parity audit, section 2 fix). A
// KitAlertStrip danger banner replaces the rails; no page had this
// state before this pass.
export const homeErrorFixture = {
  ...homeEmptyRailsFixture,
  errorMessage: "Home could not be loaded.",
};
