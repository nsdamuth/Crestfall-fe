const defaultActions = {
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

export const publicProfileEngagementDefaultFixture = {
  isVisible: true,
  className: "mt-4",
  errorMessage: "",
  engagementActions: {
    ...defaultActions,
  },
};

export const publicProfileEngagementActiveFixture = {
  ...publicProfileEngagementDefaultFixture,
  engagementActions: {
    ...defaultActions,
    liked: true,
    bookmarked: true,
    followed: true,
  },
};

export const publicProfileEngagementErrorFixture = {
  ...publicProfileEngagementDefaultFixture,
  errorMessage:
    "Crestfall could not update this creator action. Your previous state is still shown.",
};

export const publicProfileEngagementPartialFixture = {
  ...publicProfileEngagementDefaultFixture,
  engagementActions: {
    ...defaultActions,
    canFollow: false,
  },
};

export const publicProfileEngagementNoActionsFixture = {
  ...publicProfileEngagementDefaultFixture,
  engagementActions: {
    ...defaultActions,
    canLike: false,
    canBookmark: false,
    canFollow: false,
  },
};

export const publicProfileEngagementHiddenFixture = {
  ...publicProfileEngagementDefaultFixture,
  isVisible: false,
};

export const publicProfileEngagementContentsFixture = {
  ...publicProfileEngagementDefaultFixture,
  className: "contents",
};
