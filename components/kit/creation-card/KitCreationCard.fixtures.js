function previewSvg(stopA, stopB) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${stopA}" />
          <stop offset="0.5" stop-color="${stopB}" />
          <stop offset="1" stop-color="${stopA}" />
        </linearGradient>
      </defs>
      <rect width="720" height="960" fill="url(#g)" />
      <circle cx="360" cy="305" r="150" fill="#d9bd82" opacity="0.82" />
      <path d="M115 960c20-255 125-390 245-390s225 135 245 390" fill="#21170f" />
    </svg>
  `);
  return `data:image/svg+xml,${svg}`;
}

const CHARACTER_IMAGE = previewSvg("#100d0a", "#5b4321");
const STORY_IMAGE = previewSvg("#0d1016", "#1c2a3a");
const ADVENTURE_IMAGE = previewSvg("#101017", "#241c10");
const IMAGE_IMAGE = previewSvg("#0d1410", "#1a2f22");

const noop = () => {};

const baseCallbacks = {
  onOpenImageOverlay: noop,
  onOpenAssetDetail: noop,
  onShare: noop,
  onLike: noop,
  onBookmark: noop,
  onDownload: noop,
  onDelete: noop,
};

export const kitCreationCardCharacterFixture = {
  layout: "grid",
  assetKind: "character",
  title: "Alina Vale",
  subtitle: "Wayfarer · by crestfallen",
  imageSrc: CHARACTER_IMAGE,
  badges: [{ label: "Public", variant: "status" }],
  stats: { plays: 412, hearts: 96, saves: 21, followers: 8 },
  liked: false,
  bookmarked: false,
  allowDownload: false,
  isDisabled: false,
  ...baseCallbacks,
};

export const kitCreationCardStoryFixture = {
  ...kitCreationCardCharacterFixture,
  assetKind: "story",
  title: "The First Exile",
  subtitle: "Story · by crestfallen",
  imageSrc: STORY_IMAGE,
  badges: [{ label: "Public", variant: "status" }],
};

export const kitCreationCardAdventureFixture = {
  ...kitCreationCardCharacterFixture,
  assetKind: "adventure",
  title: "Neon Harbor Cycle",
  subtitle: "Adventure · by crestfallen",
  imageSrc: ADVENTURE_IMAGE,
  badges: [{ label: "Internal", variant: "status" }],
};

export const kitCreationCardImageFixture = {
  ...kitCreationCardCharacterFixture,
  assetKind: "image",
  title: "Render #4821",
  subtitle: "Image · by crestfallen",
  imageSrc: IMAGE_IMAGE,
  badges: [],
  stats: { plays: null, hearts: 14, saves: 3, followers: null },
};

export const kitCreationCardCanonOverArtFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Lilith",
  subtitle: "Character · by @Crestfall",
  badges: [{ label: "Canon", variant: "canon" }],
  liked: true,
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
  title: "The Lantern-Keeper of the Vermillion Coast, Third Cycle",
  subtitle: "Character · a very long supporting line that must still truncate cleanly",
  badges: [
    { label: "Internal", variant: "status" },
    { label: "Edited", variant: "meta" },
  ],
};

export const kitCreationCardDisabledFixture = {
  ...kitCreationCardCharacterFixture,
  title: "Archived Draft",
  isDisabled: true,
};

export const kitCreationCardWithDownloadFixture = {
  ...kitCreationCardImageFixture,
  title: "Vesper Ash Render",
  allowDownload: true,
  bookmarked: true,
};

export const kitCreationCardListDefaultFixture = {
  ...kitCreationCardCharacterFixture,
  layout: "list",
  title: "Orrin Stone",
  subtitle: "Warden · Community",
};

export const kitCreationCardListNoImageFixture = {
  ...kitCreationCardNoImageFixture,
  layout: "list",
};

export const kitCreationCardListDisabledFixture = {
  ...kitCreationCardDisabledFixture,
  layout: "list",
};
