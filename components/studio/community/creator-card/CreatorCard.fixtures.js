const availableEngagementActions = {
  liked: false,
  bookmarked: false,
  followed: false,
  canLike: true,
  canBookmark: true,
  canFollow: true,
  compact: false,
  onToggleLike: null,
  onToggleBookmark: null,
  onToggleFollow: null,
};

const defaultStats = [
  { id: "followers", value: 184, label: "followers" },
  { id: "creations", value: 27, label: "creations" },
  { id: "canon", value: 3, label: "canon" },
  { id: "likes", value: 642, label: "likes" },
];

export const creatorCardDefaultFixture = {
  creatorName: "Crestfallen Weaver",
  creatorHandle: "crestfallen_weaver",
  profileHref: "#creator-card-preview",
  avatarInitial: "C",
  tagline: "Dark-fantasy characters and interwoven story worlds.",
  description:
    "Building connected casts, haunted places, and stories designed to evolve across multiple rooms.",
  featured: false,
  canonContributor: false,
  stats: defaultStats,
  engagementActions: availableEngagementActions,
};

export const creatorCardFeaturedFixture = {
  ...creatorCardDefaultFixture,
  creatorName: "The Archive Keeper",
  creatorHandle: "archive_keeper",
  avatarInitial: "T",
  featured: true,
  canonContributor: true,
  engagementActions: {
    ...availableEngagementActions,
    liked: true,
    bookmarked: true,
    followed: true,
  },
};

export const creatorCardEmptyCopyFixture = {
  ...creatorCardDefaultFixture,
  creatorName: "Quiet Cartographer",
  creatorHandle: "quiet_cartographer",
  avatarInitial: "Q",
  tagline: "",
  description: "",
  stats: [
    { id: "followers", value: 0, label: "followers" },
    { id: "creations", value: 0, label: "creations" },
    { id: "canon", value: 0, label: "canon" },
    { id: "likes", value: 0, label: "likes" },
  ],
};

export const creatorCardLongContentFixture = {
  ...creatorCardDefaultFixture,
  creatorName:
    "The Cartographer of the Ninth Lantern and Keeper of Unfinished Roads",
  creatorHandle:
    "cartographer_of_the_ninth_lantern_and_keeper_of_unfinished_roads",
  avatarInitial: "T",
  tagline:
    "Mapping stories that cross kingdoms, centuries, dreamscapes, and the unreliable memories of everyone involved.",
  description:
    "A deliberately long creator description used to verify wrapping, vertical growth, responsive stat layout, engagement actions, and profile navigation inside the card boundary.",
  featured: true,
};

export const creatorCardPartialActionsFixture = {
  ...creatorCardDefaultFixture,
  engagementActions: {
    ...availableEngagementActions,
    bookmarked: true,
    canFollow: false,
  },
};

export const creatorCardNoActionsFixture = {
  ...creatorCardDefaultFixture,
  engagementActions: {
    ...availableEngagementActions,
    canLike: false,
    canBookmark: false,
    canFollow: false,
  },
};
