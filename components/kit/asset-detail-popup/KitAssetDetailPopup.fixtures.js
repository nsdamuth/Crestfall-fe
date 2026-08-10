// Draft-asset fixture art (public/tmp-mockup-images/, gitignored
// interim art), same helpers the card fixtures use.
function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const noop = () => {};

export const kitAssetDetailPopupCharacterFixture = {
  assetKind: "character",
  title: "Lilith",
  subtitle: "Character - by @Crestfall",
  imageSrc: canonArt("Lilith"),
  badges: [{ label: "Canon", variant: "canon" }],
  stats: { plays: 10880, hearts: 2210, saves: 960, followers: null },
  description:
    "A canon character woven into the founding myth of the realm. Her presence anchors any scene she enters.",
  isSaved: false,
  onPrimaryAction: noop,
  onShare: noop,
  onSave: noop,
  onClose: noop,
};

export const kitAssetDetailPopupStoryFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  assetKind: "story",
  title: "The First Exile",
  subtitle: "Story - by @vermillion",
  imageSrc: creatorArt("vermillion-3"),
  badges: [],
  stats: { plays: 9800, hearts: 1240, saves: 510, followers: null },
  description:
    "A community-authored story following the exile of a border scholar, told across three acts.",
};

export const kitAssetDetailPopupAdventureFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  assetKind: "adventure",
  title: "Neon Harbor Cycle",
  subtitle: "Adventure - by @vermillion",
  imageSrc: creatorArt("vermillion-12"),
  badges: [],
  stats: { plays: 512, hearts: 88, saves: 19, followers: null },
  description:
    "A branching adventure through the harbor district, built for repeat play with shifting outcomes.",
};

export const kitAssetDetailPopupSavedFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  isSaved: true,
};

export const kitAssetDetailPopupLongestCopyFixture = {
  ...kitAssetDetailPopupStoryFixture,
  title: "The Lantern-Keeper of the Vermillion Coast, Third Attempt",
  subtitle: "Story - by @whiteviolin, recovered draft, revised twice",
  description:
    "This description is deliberately long to force the panel's body content past a single viewport at 92dvh, proving the frame's internal scroll stays fixed while this content scrolls independently underneath the header art and above the footer actions. It keeps going for a while longer, covering a lantern-keeper's watch over a coastline that never sleeps, the ships she has turned away, and the one she let through against every order she was given, and what that decision cost the harbor in the seasons that followed.",
};

export const kitAssetDetailPopupNoImageFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  title: "Untitled Draft",
  subtitle: "Character - by @unknown",
  imageSrc: null,
  badges: [],
};
