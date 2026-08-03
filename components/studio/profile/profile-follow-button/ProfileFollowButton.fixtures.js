export const profileFollowButtonDefaultFixture = {
  isVisible: true,
  isFollowing: false,
  isSaving: false,
  onToggleFollow: null,
};

export const profileFollowButtonFollowingFixture = {
  ...profileFollowButtonDefaultFixture,
  isFollowing: true,
};

export const profileFollowButtonSavingFollowFixture = {
  ...profileFollowButtonDefaultFixture,
  isSaving: true,
};

export const profileFollowButtonSavingUnfollowFixture = {
  ...profileFollowButtonFollowingFixture,
  isSaving: true,
};

export const profileFollowButtonHiddenFixture = {
  ...profileFollowButtonDefaultFixture,
  isVisible: false,
};
