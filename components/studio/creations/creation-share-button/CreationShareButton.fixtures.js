export const creationShareButtonDefaultFixture = {
  buttonLabel: "Share",
  disabled: false,
  onShare: null,
};

export const creationShareButtonCopiedFixture = {
  ...creationShareButtonDefaultFixture,
  buttonLabel: "Copied",
};

export const creationShareButtonErrorFixture = {
  ...creationShareButtonDefaultFixture,
  buttonLabel: "Copy Failed",
};

export const creationShareButtonDisabledFixture = {
  ...creationShareButtonDefaultFixture,
  disabled: true,
};

export const creationShareButtonCustomLabelFixture = {
  ...creationShareButtonDefaultFixture,
  buttonLabel: "Copy Creation Link",
};

export const creationShareButtonLongLabelFixture = {
  ...creationShareButtonDefaultFixture,
  buttonLabel: "Copy This Creation Link to the Clipboard",
};
