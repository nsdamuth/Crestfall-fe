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
  creator: { handle: "@Crestfall", href: "/studio/profile/Crestfall" },
  media: media(canonArt("Lilith")),
  badges: [{ label: "Canon", variant: "canon" }],
  stats: { plays: 10880, hearts: 2210, saves: 960, followers: null },
  description:
    "A canon character woven into the founding myth of the realm. Her presence anchors any scene she enters.",
  tags: ["Founding Myth", "Canon", "Realm Anchor"],
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
  // Five credits (R1, kit polish 3 pass, plan 1.3): exercises the
  // collapsed row's count and the credits modal's own scroll.
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
    {
      id: "credit-outfit",
      kindLabel: "Outfit",
      creatorHandle: "@golden_thread",
      creatorHref: "/studio/profile/golden_thread",
      assetTitle: "Harborwatch Coat",
    },
    {
      id: "credit-pose",
      kindLabel: "Pose",
      creatorHandle: "@anonymous_contributor",
      creatorHref: null,
      assetTitle: null,
    },
    {
      id: "credit-score",
      kindLabel: "Score",
      creatorHandle: "@map_room",
      creatorHref: "/studio/profile/map_room",
      assetTitle: "Neon Harbor Theme",
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
  creator: { handle: "@unknown", href: null },
  media: [],
  badges: [],
};

// Own-work fixture, ADDED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5,
// Studio brief S5): the only fixture that passes onEdit, exercising
// the five-action footer. Every other fixture omits it deliberately,
// pixel-stable at the four-action footer.
export const kitAssetDetailPopupOwnWorkFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  onEdit: noop,
};

// Exercises the honest-stub path: no creator link, no tags row. This
// is the real /studio/v2/community state today (CR-037, tags data
// does not exist yet on any fixture creation).
export const kitAssetDetailPopupNoCreatorNoTagsFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  creator: null,
  tags: [],
};

// Many-media fixture, ADDED (Scale Review H, finding D3): nine media
// items push the carousel's slide count (media plus the catalogue
// slide) past CAROUSEL_DOTS_MAX, exercising the numeric "1 of N"
// readout in place of the dot row.
export const kitAssetDetailPopupManyMediaFixture = {
  ...kitAssetDetailPopupCharacterFixture,
  title: "Neon Harbor Cycle",
  subtitle: "Adventure - by @vermillion",
  media: media(
    creatorArt("vermillion-3"),
    creatorArt("vermillion-8"),
    creatorArt("vermillion-12"),
    creatorArt("vermillion-13"),
    creatorArt("vermillion-14"),
    creatorArt("vermillion-15"),
    creatorArt("vermillion-3"),
    creatorArt("vermillion-8"),
    creatorArt("vermillion-12")
  ),
};
