export const profileShareButtonDefaultFixture = {
  buttonLabel: "Share",
  onShare: null,
};

export const profileShareButtonCopiedFixture = {
  ...profileShareButtonDefaultFixture,
  buttonLabel: "Copied",
};

export const profileShareButtonErrorFixture = {
  ...profileShareButtonDefaultFixture,
  buttonLabel: "Copy Failed",
};

export const profileShareButtonUnavailableActionFixture = {
  ...profileShareButtonDefaultFixture,
  onShare: null,
};

export const profileShareButtonLongLabelFixture = {
  ...profileShareButtonDefaultFixture,
  buttonLabel: "Copy This Public Creator Profile Link",
};
