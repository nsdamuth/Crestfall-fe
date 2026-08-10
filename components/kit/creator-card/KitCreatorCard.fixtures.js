function previewSvg(seed) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#1c1712" />
      <circle cx="${100 + (seed % 3) * 60}" cy="180" r="90" fill="#9a7434" opacity="0.7" />
    </svg>
  `);
  return `data:image/svg+xml,${svg}`;
}

const noop = () => {};

const THUMBNAILS = [
  { id: "t1", imageSrc: previewSvg(1), alt: "Lilith" },
  { id: "t2", imageSrc: previewSvg(2), alt: "Lux" },
  { id: "t3", imageSrc: previewSvg(3), alt: "Isabella Santosa" },
];

export const kitCreatorCardThreeImagesFixture = {
  handle: "@Crestfall",
  avatarSrc: null,
  stats: { followers: 12400, plays: 41200, works: 31 },
  thumbnails: THUMBNAILS,
  isFollowing: false,
  onThumbnailOpen: noop,
  onFollow: noop,
  onViewProfile: noop,
};

export const kitCreatorCardOneImageFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@yagirltee",
  stats: { followers: 880, plays: 4100, works: 1 },
  thumbnails: THUMBNAILS.slice(0, 1),
};

export const kitCreatorCardZeroImagesFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@rev",
  stats: { followers: 120, plays: 890, works: 1 },
  thumbnails: [],
};

export const kitCreatorCardFollowedFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@vermillion",
  stats: { followers: 2100, plays: 9700, works: 24 },
  isFollowing: true,
};

export const kitCreatorCardLongestHandleFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@the-vermillion-cartographers-guild",
  thumbnails: THUMBNAILS.slice(0, 2),
};
