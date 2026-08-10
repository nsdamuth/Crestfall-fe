// Fixture art: the draft assets Brian moved into the repo
// (public/tmp-mockup-images/, gitignored interim art). Canon
// characters feed canon fixtures; alpha-test creator renders feed
// community-work fixtures.
function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const noop = () => {};

const baseCallbacks = {
  onOpenImageOverlay: noop,
  onOpenAssetDetail: noop,
  onLike: noop,
  onBookmark: noop,
};

export const kitCreationCardCharacterFixture = {
  layout: "grid",
  assetKind: "character",
  title: "Elowen",
  subtitle: "Character · by @Crestfall",
  imageSrc: canonArt("Elowen"),
  badges: [{ label: "Canon", variant: "canon" }],
  stats: { plays: 412, hearts: 96, saves: 21, followers: null },
  liked: false,
  bookmarked: false,
  isDisabled: false,
  ...baseCallbacks,
};

export const kitCreationCardStoryFixture = {
  ...kitCreationCardCharacterFixture,
  assetKind: "story",
  title: "The First Exile",
  subtitle: "Story · by @vermillion",
  imageSrc: creatorArt("vermillion-3"),
  badges: [],
};

export const kitCreationCardAdventureFixture = {
  ...kitCreationCardCharacterFixture,
  assetKind: "adventure",
  title: "Neon Harbor Cycle",
  subtitle: "Adventure · by @whiteviolin",
  imageSrc: creatorArt("whiteviolin"),
  badges: [],
};

export const kitCreationCardImageFixture = {
  ...kitCreationCardCharacterFixture,
  assetKind: "image",
  title: "Vesper Ash Render",
  subtitle: "Image · by @vermillion",
  imageSrc: creatorArt("vermillion-8"),
  badges: [],
  stats: { plays: null, hearts: 14, saves: 3, followers: null },
};

export const kitCreationCardCanonOverArtFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Lilith",
  subtitle: "Character · by @Crestfall",
  imageSrc: canonArt("Lilith"),
  badges: [{ label: "Canon", variant: "canon" }],
  liked: true,
};

// Own-work context: a visibility badge informs here (tag economy,
// docs/BUILD-BLUEPRINT.md 2.16(c)); it never appears on the public
// Community fixtures above.
export const kitCreationCardOwnWorkFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Saeha Veyrune",
  subtitle: "Character · draft",
  imageSrc: canonArt("Saeha Veyrune"),
  badges: [{ label: "Private", variant: "status" }],
};

export const kitCreationCardNoImageFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Neon Harbor",
  subtitle: "Story · draft",
  assetKind: "story",
  imageSrc: null,
  badges: [{ label: "Private", variant: "status" }],
  stats: { plays: null, hearts: null, saves: null, followers: null },
};

export const kitCreationCardLongestTitleFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Aniyya Seraphina Devereaux, Third Warden of the Vermillion Coast",
  subtitle: "Character · a very long supporting line that must still truncate cleanly",
  imageSrc: canonArt("Aniyya Seraphina Devereaux"),
  badges: [{ label: "Canon", variant: "canon" }],
};

export const kitCreationCardDisabledFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Archived Draft",
  imageSrc: canonArt("The Seer"),
  badges: [],
  isDisabled: true,
};

export const kitCreationCardListDefaultFixture = {
  ...kitCreationCardCharacterFixture,
  layout: "list",
  title: "Maya Chen",
  subtitle: "Character · by @Crestfall",
  imageSrc: canonArt("Maya Chen"),
};

export const kitCreationCardListNoImageFixture = {
  ...kitCreationCardNoImageFixture,
  layout: "list",
};

export const kitCreationCardListDisabledFixture = {
  ...kitCreationCardDisabledFixture,
  layout: "list",
};
