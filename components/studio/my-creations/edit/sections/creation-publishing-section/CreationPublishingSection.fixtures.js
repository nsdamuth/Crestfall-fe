const visibilityOptions = [
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
];

const contentRatingOptions = [
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
];

const sharedCopy = {
  sectionEyebrow: "Publishing",
  sectionTitle: "Publishing & Review",
  sectionDescription:
    "Visibility and review actions belong here, not on compact cards. This avoids accidental deletion or moderation queue spam.",
  visibilityLabel: "Visibility",
  visibilityValue: "PRIVATE",
  visibilityOptions,
  contentRatingLabel: "Content Rating",
  contentRatingValue: "SFW",
  contentRatingOptions,
  templateEyebrow: "Template Management",
  templateTitle: "Convert Character To Template",
  templateDescription:
    "Convert this character into a reusable template that can prefill future character creation flows.",
  templateActions: [
    {
      id: "convert-to-template",
      label: "Convert To Template Soon",
      disabled: true,
      emphasis: "primary",
    },
  ],
  publicReviewTitle: "Public Review",
  publicReviewDescription:
    "Submit this creation for public discovery after it has been tested and refined. Approval tools will be built later.",
  publicReviewButtonLabel: "Submit for Public Review",
  publicReviewDisabled: false,
  canonReviewTitle: "Canon Review",
  canonReviewDescription:
    "Canon review is optional and only for creations voluntarily submitted to become part of official Crestfall continuity.",
  canonReviewButtonLabel: "Submit for Canon Review",
  canonReviewDisabled: false,
  reviewMessage: "",
  reviewMessageTone: "success",
  unlistTitle: "Unlist for Editing",
  unlistDescription:
    "Pull this creation back to private so you can keep editing it. It leaves public discovery until you resubmit.",
  showUnlist: false,
  unlistButtonLabel: "Unlist for editing",
  unlistDisabled: false,
  showCancelReview: false,
  cancelReviewButtonLabel: "Cancel review",
  cancelReviewDisabled: false,
};

export const creationPublishingSectionDraftFixture = {
  ...sharedCopy,
};

export const creationPublishingSectionTemplateFixture = {
  ...sharedCopy,
  templateTitle: "Template Operations",
  templateDescription:
    "Templates can later be duplicated, shared, edited, or used during character creation.",
  templateActions: [
    {
      id: "duplicate-template",
      label: "Duplicate Template Soon",
      disabled: true,
      emphasis: "secondary",
    },
    {
      id: "use-template",
      label: "Use Template Soon",
      disabled: true,
      emphasis: "secondary",
    },
  ],
};

export const creationPublishingSectionInReviewFixture = {
  ...sharedCopy,
  visibilityValue: "UNLISTED",
  publicReviewButtonLabel: "In Review",
  publicReviewDisabled: true,
  canonReviewButtonLabel: "In Review",
  canonReviewDisabled: true,
  reviewMessage: "Submitted for public review.",
  showCancelReview: true,
};

export const creationPublishingSectionUnlistableFixture = {
  ...sharedCopy,
  visibilityValue: "PUBLIC",
  showUnlist: true,
};

export const creationPublishingSectionOfficialCanonFixture = {
  ...sharedCopy,
  publicReviewDisabled: true,
  canonReviewButtonLabel: "Official Canon",
  canonReviewDisabled: true,
};

export const creationPublishingSectionSavingFixture = {
  ...sharedCopy,
  publicReviewButtonLabel: "Submitting...",
  publicReviewDisabled: true,
  canonReviewDisabled: true,
};

export const creationPublishingSectionErrorFixture = {
  ...sharedCopy,
  reviewMessage: "This creation could not be submitted for review.",
  reviewMessageTone: "error",
};

export const creationPublishingSectionMatureFixture = {
  ...sharedCopy,
  visibilityValue: "UNLISTED",
  contentRatingValue: "MATURE",
};

export const creationPublishingSectionMissingCallbacksFixture = {
  ...sharedCopy,
  onSelectVisibility: null,
  onSelectContentRating: null,
  onSubmitPublicReview: null,
  onSubmitCanonReview: null,
};
