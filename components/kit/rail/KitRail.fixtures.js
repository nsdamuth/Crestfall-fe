// Card children are built from KitCreationCardView and KitCreatorCardView
// with props drawn from those packages' own fixtures, via relative
// sibling imports (the precedented View-to-View pattern, no card-level
// work in this package).
import KitCreationCardView from "../creation-card/KitCreationCard.view";
import {
  kitCreationCardAdventureFixture,
  kitCreationCardCanonOverArtFixture,
  kitCreationCardCharacterFixture,
  kitCreationCardImageFixture,
  kitCreationCardLongestTitleFixture,
  kitCreationCardNoImageFixture,
  kitCreationCardOwnWorkFixture,
  kitCreationCardStoryFixture,
} from "../creation-card/KitCreationCard.fixtures";
import KitCreatorCardView from "../creator-card/KitCreatorCard.view";
import {
  kitCreatorCardFollowedFixture,
  kitCreatorCardLongestHandleFixture,
  kitCreatorCardOneImageFixture,
  kitCreatorCardThreeImagesFixture,
  kitCreatorCardZeroImagesFixture,
} from "../creator-card/KitCreatorCard.fixtures";
import KitDropdownView from "../dropdown/KitDropdown.view";
import { kitDropdownSortFixture } from "../dropdown/KitDropdown.fixtures";

const noop = () => {};

const MIXED_CREATION_FIXTURES = [
  kitCreationCardCharacterFixture,
  kitCreationCardStoryFixture,
  kitCreationCardAdventureFixture,
  kitCreationCardImageFixture,
  kitCreationCardCanonOverArtFixture,
  kitCreationCardOwnWorkFixture,
  kitCreationCardNoImageFixture,
  kitCreationCardLongestTitleFixture,
];

function creationCards(fixtures) {
  return fixtures.map((fixture, index) => (
    <KitCreationCardView key={`${fixture.title}-${index}`} {...fixture} />
  ));
}

function creatorCards(fixtures) {
  return fixtures.map((fixture, index) => (
    <KitCreatorCardView key={`${fixture.handle}-${index}`} {...fixture} />
  ));
}

export const kitRailTopRatedFixture = {
  label: "Top rated",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: <KitDropdownView {...kitDropdownSortFixture} />,
  children: creationCards(MIXED_CREATION_FIXTURES),
};

export const kitRailRecentlyAddedFixture = {
  label: "Recently added",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: creationCards([...MIXED_CREATION_FIXTURES].reverse()),
};

export const kitRailFromTheCommunityFixture = {
  label: "From the community",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: creationCards([
    ...MIXED_CREATION_FIXTURES.slice(4),
    ...MIXED_CREATION_FIXTURES.slice(0, 4),
  ]),
};

export const kitRailCreatorsToFollowFixture = {
  label: "Creators to follow",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: creatorCards([
    kitCreatorCardThreeImagesFixture,
    kitCreatorCardOneImageFixture,
    kitCreatorCardZeroImagesFixture,
    kitCreatorCardFollowedFixture,
    kitCreatorCardLongestHandleFixture,
    { ...kitCreatorCardZeroImagesFixture, handle: "@secondwind" },
  ]),
};

export const kitRailOneCardFixture = {
  label: "One card",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: creationCards([kitCreationCardCharacterFixture]),
};

export const kitRailTwoCardFixture = {
  label: "Two cards",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: creationCards([kitCreationCardCharacterFixture, kitCreationCardStoryFixture]),
};

export const kitRailEmptyFixture = {
  label: "Empty rail",
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: null,
};

const LONGEST_LABEL = "The longest possible rail head label this system will ever render";

export const kitRailLongestContentFixture = {
  label: LONGEST_LABEL,
  viewAllLabel: "View all",
  onViewAll: noop,
  headControlSlot: null,
  children: creationCards([
    ...Array.from({ length: 12 }, (_, index) => ({
      ...kitCreationCardLongestTitleFixture,
      title: `${kitCreationCardLongestTitleFixture.title} ${index + 1}`,
    })),
  ]),
};
