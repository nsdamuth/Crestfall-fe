const noop = () => {};

export const kitAlertStripSuccessFixture = {
  tone: "success",
  title: "Saved",
  body: "Your changes are live.",
};

export const kitAlertStripWarningFixture = {
  tone: "warning",
  title: "Draft only",
  body: "This creation has not been published yet.",
};

export const kitAlertStripDangerFixture = {
  tone: "danger",
  title: "Publish failed",
  body: "Check your connection and try again.",
};

export const kitAlertStripNeutralFixture = {
  tone: "neutral",
  title: "About Advanced Mode",
  body: "Advanced fields are optional. Quick create covers most characters.",
};

export const kitAlertStripSuccessWithActionFixture = {
  ...kitAlertStripSuccessFixture,
  actionLabel: "View creation",
  onAction: noop,
};

export const kitAlertStripDangerWithActionFixture = {
  ...kitAlertStripDangerFixture,
  actionLabel: "Retry",
  onAction: noop,
  onDismiss: noop,
};

export const kitAlertStripLongestCopyFixture = {
  tone: "warning",
  title: "This submission is pending review by the Crestfall canon team",
  body: "Approval notices like this one can carry a full sentence or two of supporting copy, and the strip must wrap that copy cleanly instead of overflowing its bed at any width, from 390 up through the widest desktop layout.",
  actionLabel: "Learn about the review process",
  onAction: noop,
  onDismiss: noop,
};
