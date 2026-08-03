export const profileBackButtonDefaultFixture = {
  ariaLabel: "Go back",
  onGoBack: null,
};

export const profileBackButtonCustomLabelFixture = {
  ...profileBackButtonDefaultFixture,
  ariaLabel: "Return to the creator community",
};

export const profileBackButtonUnavailableActionFixture = {
  ...profileBackButtonDefaultFixture,
  onGoBack: null,
};
