// Draft-asset fixture art (public/tmp-mockup-images/, gitignored
// interim art): alpha-test creator renders feed the work strips,
// canon character art feeds avatars where one is wanted.
function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

const noop = () => {};

const THUMBNAILS = [
  { id: "t1", imageSrc: creatorArt("vermillion-2"), alt: "Vermillion render 2" },
  { id: "t2", imageSrc: creatorArt("vermillion-5"), alt: "Vermillion render 5" },
  { id: "t3", imageSrc: creatorArt("vermillion-9"), alt: "Vermillion render 9" },
];

export const kitCreatorCardThreeImagesFixture = {
  handle: "@Crestfall",
  avatarSrc: canonArt("Lux"),
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
  avatarSrc: null,
  stats: { followers: 880, plays: 4100, works: 1 },
  thumbnails: [{ id: "t1", imageSrc: creatorArt("yagirltee"), alt: "Yagirltee render" }],
};

export const kitCreatorCardZeroImagesFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@rev",
  avatarSrc: null,
  stats: { followers: 120, plays: 890, works: 1 },
  thumbnails: [],
};

export const kitCreatorCardFollowedFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@vermillion",
  avatarSrc: creatorArt("vermillion"),
  stats: { followers: 2100, plays: 9700, works: 24 },
  isFollowing: true,
};

export const kitCreatorCardLongestHandleFixture = {
  ...kitCreatorCardThreeImagesFixture,
  handle: "@the-vermillion-cartographers-guild",
  avatarSrc: null,
  thumbnails: [
    { id: "t1", imageSrc: creatorArt("whiteviolin"), alt: "Whiteviolin render" },
    { id: "t2", imageSrc: creatorArt("whiteviolin-2"), alt: "Whiteviolin render 2" },
  ],
};
