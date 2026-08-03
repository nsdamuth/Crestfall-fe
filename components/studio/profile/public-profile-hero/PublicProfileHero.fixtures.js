const previewStats = [
  { value: "12", label: "Characters" },
  { value: "4", label: "Rooms" },
  { value: "86", label: "Images" },
  { value: "1,240", label: "Likes" },
];

export const publicProfileHeroCompleteFixture = Object.freeze({
  creatorEyebrow: "Crestfall Creator",
  bannerPlaceholderEyebrow: "Banner Slot",
  bannerPlaceholderDescription:
    "Generated profile banner will appear here.",
  username: "crestfall",
  displayName: "Crestfall",
  bannerUrl: "/assets/covers/banner.png",
  bio: "Worldbuilder, character designer, and systems-focused storyteller creating connected Crestfall settings and reusable narrative assets.",
  stats: previewStats,
  followersCount: 384,
  followingCount: 42,
});

export const publicProfileHeroAliasFixture = Object.freeze({
  ...publicProfileHeroCompleteFixture,
  username: "aethelgard_archivist",
  displayName: "Aethelgard_archivist",
  bio: "Cataloguing locations, registries, stories, and the people who move between them.",
  stats: [
    { value: "7", label: "Characters" },
    { value: "2", label: "Rooms" },
    { value: "31", label: "Images" },
    { value: "402", label: "Likes" },
  ],
  followersCount: 91,
  followingCount: 18,
});

export const publicProfileHeroFallbackFixture = Object.freeze({
  creatorEyebrow: "Crestfall Creator",
  bannerPlaceholderEyebrow: "Banner Slot",
  bannerPlaceholderDescription:
    "Generated profile banner will appear here.",
  username: "crestfallen_creator",
  displayName: "Crestfallen_creator",
  bannerUrl: null,
  bio: "No public bio yet.",
  stats: [
    { value: "0", label: "Characters" },
    { value: "0", label: "Rooms" },
    { value: "0", label: "Images" },
    { value: "0", label: "Likes" },
  ],
  followersCount: 0,
  followingCount: 0,
});
