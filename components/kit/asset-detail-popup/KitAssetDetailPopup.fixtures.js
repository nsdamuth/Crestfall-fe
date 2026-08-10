// Draft-asset fixture art (public/tmp-mockup-images/, gitignored
// interim art), same helpers the card fixtures use.
function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

function media(...srcs) {
  return srcs.map((src, index) => ({ id: `media-${index + 1}`, src }));
}

const noop = () => {};

export const kitAssetDetailPopupCharacterFixture = {
  assetKind: "character",
  title: "Lilith",
  subtitle: "Character - by @Crestfall",
  media: media(canonArt("Lilith")),
  badges: [{ label: "Canon", variant: "canon" }],
  stats: { plays: 10880, hearts: 2210, saves: 960, followers: null },
  description:
    "A canon character woven into the founding myth of the realm. Her presence anchors any scene she enters.",
  isLiked: false,
  isSaved: false,
  onLike: noop,
  onPrimaryAction: noop,
  onShare: noop,
  onSave: noop,
  onViewCatalogue: noop,
  onClose: noop,
};

export const kitAssetDetailPopupStoryFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  assetKind: "story",
  title: "The First Exile",
  subtitle: "Story - by @vermillion",
  media: media(creatorArt("vermillion-3"), creatorArt("vermillion-8")),
  badges: [],
  stats: { plays: 9800, hearts: 1240, saves: 510, followers: null },
  description:
    "A community-authored story following the exile of a border scholar, told across three acts.",
  credits: [
    {
      id: "credit-narrator",
      kindLabel: "Narrator",
      creatorHandle: "@vermillion",
      creatorHref: "/studio/profile/vermillion",
      assetTitle: null,
    },
  ],
};

export const kitAssetDetailPopupAdventureFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  assetKind: "adventure",
  title: "Neon Harbor Cycle",
  subtitle: "Adventure - by @vermillion",
  media: media(
    creatorArt("vermillion-12"),
    creatorArt("vermillion-13"),
    creatorArt("vermillion-14"),
    creatorArt("vermillion-15")
  ),
  badges: [],
  stats: { plays: 512, hearts: 88, saves: 19, followers: null },
  description:
    "A branching adventure through the harbor district, built for repeat play with shifting outcomes.",
  credits: [
    {
      id: "credit-location",
      kindLabel: "Location",
      creatorHandle: "@vermillion",
      creatorHref: "/studio/profile/vermillion",
      assetTitle: "Neon Harbor District",
    },
    {
      id: "credit-character",
      kindLabel: "Character",
      creatorHandle: "@Crestfall",
      creatorHref: "/studio/profile/Crestfall",
      assetTitle: "Lilith",
    },
  ],
};

export const kitAssetDetailPopupLikedAndSavedFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  isLiked: true,
  isSaved: true,
};

export const kitAssetDetailPopupLongestCopyFixture = {
  ...kitAssetDetailPopupStoryFixture,
  title: "The Lantern-Keeper of the Vermillion Coast, Third Attempt",
  subtitle: "Story - by @whiteviolin, recovered draft, revised twice",
  description:
    "This description is deliberately long to force the See more control: it keeps going for a while, covering a lantern-keeper's watch over a coastline that never sleeps, the ships she has turned away, and the one she let through against every order she was given, and what that decision cost the harbor in the seasons that followed.",
};

export const kitAssetDetailPopupNoImageFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  title: "Untitled Draft",
  subtitle: "Character - by @unknown",
  media: [],
  badges: [],
};
