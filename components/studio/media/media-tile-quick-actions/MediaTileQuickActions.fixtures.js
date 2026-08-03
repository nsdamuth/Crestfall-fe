const noop = () => {};

const baseFixture = {
  liked: false,
  bookmarked: false,
  likeLabel: "Like",
  bookmarkLabel: "Bookmark",
  expandLabel: "Expand",
  onLike: noop,
  onBookmark: noop,
  onExpand: noop,
};

export const mediaTileQuickActionsDefaultFixture = {
  ...baseFixture,
};

export const mediaTileQuickActionsActiveFixture = {
  ...baseFixture,
  liked: true,
  bookmarked: true,
  likeLabel: "Unlike",
  bookmarkLabel: "Remove bookmark",
};

export const mediaTileQuickActionsReadOnlyFixture = {
  ...baseFixture,
  onLike: null,
  onBookmark: null,
  onExpand: null,
};
