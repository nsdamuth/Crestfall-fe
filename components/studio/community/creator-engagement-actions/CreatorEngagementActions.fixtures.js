export const creatorEngagementActionsDefaultFixture = {
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

export const creatorEngagementActionsEngagedFixture = {
  ...creatorEngagementActionsDefaultFixture,
  liked: true,
  bookmarked: true,
  followed: true,
};

export const creatorEngagementActionsCompactFixture = {
  ...creatorEngagementActionsDefaultFixture,
  liked: true,
  compact: true,
};

export const creatorEngagementActionsPartialFixture = {
  ...creatorEngagementActionsDefaultFixture,
  bookmarked: true,
  canFollow: false,
};

export const creatorEngagementActionsFollowOnlyFixture = {
  ...creatorEngagementActionsDefaultFixture,
  canLike: false,
  canBookmark: false,
  followed: true,
};

export const creatorEngagementActionsUnavailableFixture = {
  ...creatorEngagementActionsDefaultFixture,
  canLike: false,
  canBookmark: false,
  canFollow: false,
};
