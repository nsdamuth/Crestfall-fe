// CR-029 mock module (docs/CONTRACT-REQUESTS.md, filed at the Sprint G
// planning gate): Home feed data for the Continue strip and the four
// KitRail instances. Open with Nick, non-blocking; Home builds
// fixture-first per the standing Nick rule
// (docs/CRESTFALL-DESIGN-CONTEXT.md). Delete this module and its one
// import in useHomeViewModel.js once CR-029 lands a real feed.
//
// Content mirrors the existing kit fixtures (creation-card,
// creator-card, destination-tile) rather than inventing new draft
// art, matching the ruled precedent that KitRail "holds existing
// cards; no card-level work is needed"
// (docs/CRESTFALL-DESIGN-CONTEXT.md, 10 Aug 2026 ruling). Plain data
// only, no callbacks; useHomeViewModel.js attaches every onX handler.
import {
  kitCreationCardAdventureFixture,
  kitCreationCardCanonOverArtFixture,
  kitCreationCardCharacterFixture,
  kitCreationCardImageFixture,
  kitCreationCardLongestTitleFixture,
  kitCreationCardOwnWorkFixture,
  kitCreationCardStoryFixture,
} from "@/components/kit/creation-card/KitCreationCard.fixtures";
import {
  kitCreatorCardFollowedFixture,
  kitCreatorCardLongestHandleFixture,
  kitCreatorCardOneImageFixture,
  kitCreatorCardThreeImagesFixture,
  kitCreatorCardZeroImagesFixture,
} from "@/components/kit/creator-card/KitCreatorCard.fixtures";
import { KIT_DESTINATION_TILE_HOME_SET } from "@/components/kit/destination-tile/KitDestinationTile.fixtures";

function stripCallbacks({ onOpenImageOverlay, onOpenAssetDetail, onLike, onBookmark, ...data }) {
  return data;
}

function creationItem(id, fixture) {
  return { cardKind: "creation", id, ...stripCallbacks(fixture) };
}

function creatorItem(id, fixture) {
  const { onThumbnailOpen, onFollow, onViewProfile, ...data } = fixture;
  return { cardKind: "creator", id, ...data };
}

// Built pages route by their live /studio/v2/<page> address; the
// three not yet built (Studio, Adventures, Lore) carry a null route,
// which the ViewModel reads as "stub the tap, do not navigate."
const BUILT_DESTINATION_ROUTES = {
  Stories: "/studio/v2/stories",
  Adventures: null,
  Studio: null,
  Images: "/studio/v2/images",
  Vault: "/studio/v2/vault",
  Community: "/studio/v2/community",
  Creators: "/studio/v2/creators",
  Lore: null,
};

export const HOME_CONTINUE_ITEM = {
  id: "home-continue-1",
  title: "The Hollow Road",
  kindLabel: "Story",
  lastPlayedLabel: "2 hours ago",
  imageSrc: kitCreationCardStoryFixture.imageSrc,
};

// Eight tiles, journey order, Home excluded (Play, Create, Explore):
// Stories, Adventures, Studio, Images, Vault, Community, Creators,
// Lore. Matches KIT_DESTINATION_TILE_HOME_SET order exactly.
export const HOME_DESTINATION_TILES = KIT_DESTINATION_TILE_HOME_SET.map((fixture) => ({
  id: fixture.label.toLowerCase(),
  label: fixture.label,
  supportingLine: fixture.supportingLine,
  imageSrc: fixture.imageSrc,
  route: BUILT_DESTINATION_ROUTES[fixture.label] ?? null,
}));

export const HOME_TOP_RATED_ITEMS = [
  creationItem("top-rated-1", kitCreationCardCanonOverArtFixture),
  creationItem("top-rated-2", kitCreationCardStoryFixture),
  creationItem("top-rated-3", kitCreationCardAdventureFixture),
  creationItem("top-rated-4", kitCreationCardImageFixture),
  creationItem("top-rated-5", kitCreationCardCharacterFixture),
];

export const HOME_RECENTLY_ADDED_ITEMS = [
  creationItem("recent-1", kitCreationCardImageFixture),
  creationItem("recent-2", kitCreationCardAdventureFixture),
  creationItem("recent-3", kitCreationCardStoryFixture),
  creationItem("recent-4", kitCreationCardLongestTitleFixture),
  creationItem("recent-5", kitCreationCardCanonOverArtFixture),
];

export const HOME_FROM_THE_COMMUNITY_ITEMS = [
  creationItem("community-1", kitCreationCardOwnWorkFixture),
  creationItem("community-2", kitCreationCardCharacterFixture),
  creationItem("community-3", kitCreationCardImageFixture),
  creationItem("community-4", kitCreationCardStoryFixture),
];

export const HOME_CREATORS_TO_FOLLOW_ITEMS = [
  creatorItem("creator-1", kitCreatorCardThreeImagesFixture),
  creatorItem("creator-2", kitCreatorCardFollowedFixture),
  creatorItem("creator-3", kitCreatorCardOneImageFixture),
  creatorItem("creator-4", kitCreatorCardZeroImagesFixture),
  creatorItem("creator-5", kitCreatorCardLongestHandleFixture),
];

export const HOME_SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most played" },
  { value: "recent", label: "Newest" },
];
