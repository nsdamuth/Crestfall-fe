const previewCardSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#100d0a" />
        <stop offset="0.5" stop-color="#5b4321" />
        <stop offset="1" stop-color="#15100a" />
      </linearGradient>
    </defs>
    <rect width="720" height="960" fill="url(#g)" />
    <circle cx="360" cy="305" r="150" fill="#d9bd82" opacity="0.82" />
    <path d="M115 960c20-255 125-390 245-390s225 135 245 390" fill="#21170f" />
  </svg>
`);
const previewCardImageSrc = `data:image/svg+xml,${previewCardSvg}`;

const noop = () => {};

export const kitCreationCardGridDefaultFixture = {
  layout: "grid",
  title: "Alina Vale",
  subtitle: "Wayfarer · by crestfallen",
  imageSrc: previewCardImageSrc,
  badges: [{ label: "Public", variant: "status" }],
  stats: { plays: 412, hearts: 96, saves: 21, followers: 8 },
  liked: false,
  bookmarked: false,
  allowDownload: false,
  isDisabled: false,
  onOpen: noop,
  onShare: noop,
  onLike: noop,
  onBookmark: noop,
  onDownload: noop,
  onDelete: noop,
};

export const kitCreationCardGridCanonFixture = {
  ...kitCreationCardGridDefaultFixture,
  title: "The First Exile",
  subtitle: "Adventure · Official",
  badges: [{ label: "Canon", variant: "canon" }],
  liked: true,
};

export const kitCreationCardGridNoImageFixture = {
  ...kitCreationCardGridDefaultFixture,
  title: "Neon Harbor",
  subtitle: "Story · draft",
  imageSrc: null,
  badges: [{ label: "Private", variant: "status" }],
  stats: { plays: null, hearts: null, saves: null, followers: null },
};

export const kitCreationCardGridLongestTitleFixture = {
  ...kitCreationCardGridDefaultFixture,
  title: "The Lantern-Keeper of the Vermillion Coast, Third Cycle",
  subtitle: "Location · a very long supporting line that must still truncate cleanly",
  badges: [
    { label: "Internal", variant: "status" },
    { label: "Edited", variant: "meta" },
  ],
};

export const kitCreationCardGridDisabledFixture = {
  ...kitCreationCardGridDefaultFixture,
  title: "Archived Draft",
  isDisabled: true,
};

export const kitCreationCardGridWithDownloadFixture = {
  ...kitCreationCardGridDefaultFixture,
  title: "Vesper Ash",
  allowDownload: true,
  bookmarked: true,
};

export const kitCreationCardListDefaultFixture = {
  ...kitCreationCardGridDefaultFixture,
  layout: "list",
  title: "Orrin Stone",
  subtitle: "Warden · Community",
};

export const kitCreationCardListNoImageFixture = {
  ...kitCreationCardGridNoImageFixture,
  layout: "list",
};

export const kitCreationCardListDisabledFixture = {
  ...kitCreationCardGridDisabledFixture,
  layout: "list",
};
