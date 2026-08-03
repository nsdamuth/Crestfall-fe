const availableEngagementActions = {
  liked: false,
  bookmarked: false,
  followed: false,
  canLike: true,
  canBookmark: true,
  canFollow: true,
  compact: true,
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

export const creatorListRowDefaultFixture = {
  creatorName: "Crestfallen Weaver",
  creatorHandle: "crestfallen_weaver",
  profileHref: "#creator-list-row-preview",
  avatarInitial: "C",
  summary: "Dark-fantasy characters, locations, and interwoven story worlds.",
  featured: false,
  canonContributor: false,
  stats: defaultStats,
  engagementActions: availableEngagementActions,
};

export const creatorListRowFeaturedFixture = {
  ...creatorListRowDefaultFixture,
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

export const creatorListRowFallbackSummaryFixture = {
  ...creatorListRowDefaultFixture,
  creatorName: "Quiet Cartographer",
  creatorHandle: "quiet_cartographer",
  avatarInitial: "Q",
  summary: "Crestfall creator.",
  stats: [
    { id: "followers", value: 0, label: "followers" },
    { id: "creations", value: 0, label: "creations" },
    { id: "canon", value: 0, label: "canon" },
    { id: "likes", value: 0, label: "likes" },
  ],
};

export const creatorListRowLongContentFixture = {
  ...creatorListRowDefaultFixture,
  creatorName:
    "The Cartographer of the Ninth Lantern and Keeper of Unfinished Roads",
  creatorHandle:
    "cartographer_of_the_ninth_lantern_and_keeper_of_unfinished_roads",
  avatarInitial: "T",
  summary:
    "A deliberately long creator summary used to verify that list-mode content remains constrained without pushing engagement actions and profile navigation outside the row.",
  featured: true,
};

export const creatorListRowPartialActionsFixture = {
  ...creatorListRowDefaultFixture,
  engagementActions: {
    ...availableEngagementActions,
    bookmarked: true,
    canFollow: false,
  },
};

export const creatorListRowNoActionsFixture = {
  ...creatorListRowDefaultFixture,
  engagementActions: {
    ...availableEngagementActions,
    canLike: false,
    canBookmark: false,
    canFollow: false,
  },
};
