// Fixture art: reuses the same draft asset set as the other kit
// packages (public/tmp-mockup-images/, gitignored interim art). No
// section-specific art exists yet for the eight Home destinations;
// these are stand-ins.
function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

const noop = () => {};

export const kitDestinationTileStoriesFixture = {
  label: "Stories",
  supportingLine: "Resume where you left off, or start something new.",
  imageSrc: canonArt("Elowen"),
  onOpen: noop,
};

export const kitDestinationTileAdventuresFixture = {
  label: "Adventures",
  supportingLine: "Published seasons worth committing to.",
  imageSrc: canonArt("Charlotte Steele"),
  onOpen: noop,
};

export const kitDestinationTileStudioFixture = {
  label: "Studio",
  supportingLine: "Create fast, or refine with the full toolset.",
  imageSrc: canonArt("Chloe Reis"),
  onOpen: noop,
};

export const kitDestinationTileImagesFixture = {
  label: "Images",
  supportingLine: "Craft the look, pin it, stay on model.",
  imageSrc: canonArt("Crash Santosa"),
  onOpen: noop,
};

export const kitDestinationTileVaultFixture = {
  label: "Vault",
  supportingLine: "Everything yours, and everything you have claimed.",
  imageSrc: canonArt("Dalethia"),
  onOpen: noop,
};

export const kitDestinationTileCommunityFixture = {
  label: "Community",
  supportingLine: "Discover, claim, and make it yours.",
  imageSrc: canonArt("Danielle Desire"),
  onOpen: noop,
};

export const kitDestinationTileCreatorsFixture = {
  label: "Creators",
  supportingLine: "Find whose worlds you love and keep them close.",
  imageSrc: canonArt("Djuna Smith"),
  onOpen: noop,
};

export const kitDestinationTileLoreFixture = {
  label: "Lore",
  supportingLine: "Read the world, write into it.",
  imageSrc: canonArt("Aniyya Seraphina Devereaux"),
  onOpen: noop,
};

// The eight-tile Home set, in journey order (Play/Create/Explore,
// Home itself excluded), for the "all eight" preview state.
export const KIT_DESTINATION_TILE_HOME_SET = [
  kitDestinationTileStoriesFixture,
  kitDestinationTileAdventuresFixture,
  kitDestinationTileStudioFixture,
  kitDestinationTileImagesFixture,
  kitDestinationTileVaultFixture,
  kitDestinationTileCommunityFixture,
  kitDestinationTileCreatorsFixture,
  kitDestinationTileLoreFixture,
];

export const kitDestinationTileNoArtFixture = {
  label: "Adventures",
  supportingLine: "Published seasons worth committing to.",
  imageSrc: null,
  onOpen: noop,
};

export const kitDestinationTileLongestLabelFixture = {
  label: "The Longest Possible Destination Section Name",
  supportingLine: "A short line under a label that must still truncate cleanly.",
  imageSrc: canonArt("Elizabeth"),
  onOpen: noop,
};

export const kitDestinationTileLongestLineFixture = {
  label: "Stories",
  supportingLine:
    "A very long supporting line that keeps going well past what a single short line would normally carry, to confirm it clamps rather than overflowing the tile.",
  imageSrc: canonArt("Enox Nix"),
  onOpen: noop,
};
