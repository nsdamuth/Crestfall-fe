const baseVisibilityOptions = [
  {
    value: "PRIVATE",
    label: "PRIVATE",
    active: true,
    disabled: false,
  },
  {
    value: "UNLISTED",
    label: "UNLISTED",
    active: false,
    disabled: false,
  },
];

const basePublicVisibility = {
  active: false,
  disabled: true,
  title: "Public visibility is granted through review approval.",
  label: "Public",
};

const hiddenAction = {
  visible: false,
  disabled: true,
  busy: false,
  label: "",
  busyLabel: "",
};

const baseSaveAction = {
  visible: true,
  disabled: false,
  busy: false,
  label: "Save Changes",
  busyLabel: "Saving...",
};

export const creationEditStickyActionBarDraftFixture = {
  eyebrow: "Visibility & Save",
  visibilityLabel: "PRIVATE",
  lifecycleStatusLabel: "DRAFT",
  canonStatusLabel: "NONE",
  editLockMessage: null,
  visibilityOptions: baseVisibilityOptions,
  publicVisibility: basePublicVisibility,
  reviewAction: {
    disabled: false,
    label: "Review Actions",
  },
  unlistAction: hiddenAction,
  saveAction: baseSaveAction,
  cancelReviewAction: hiddenAction,
  saveFeedback: null,
};

export const creationEditStickyActionBarApprovedInternalFixture = {
  ...creationEditStickyActionBarDraftFixture,
  visibilityLabel: "UNLISTED",
  lifecycleStatusLabel: "APPROVED",
  visibilityOptions: baseVisibilityOptions.map((option) => ({
    ...option,
    active: option.value === "UNLISTED",
  })),
  reviewAction: {
    disabled: false,
    label: "Review / Resubmit",
  },
};

export const creationEditStickyActionBarPublicFixture = {
  ...creationEditStickyActionBarDraftFixture,
  visibilityLabel: "PUBLIC",
  lifecycleStatusLabel: "APPROVED",
  editLockMessage:
    "This creation is public. Unlist it to make changes, then submit it for review again before returning it to public discovery.",
  visibilityOptions: baseVisibilityOptions.map((option) => ({
    ...option,
    active: false,
    disabled: true,
  })),
  publicVisibility: {
    ...basePublicVisibility,
    active: true,
  },
  reviewAction: {
    disabled: true,
    label: "Public Live",
  },
  unlistAction: {
    visible: true,
    disabled: false,
    busy: false,
    label: "Unlist for Editing",
    busyLabel: "Unlisting...",
  },
  saveAction: {
    ...baseSaveAction,
    disabled: true,
  },
};

export const creationEditStickyActionBarReviewFixture = {
  ...creationEditStickyActionBarDraftFixture,
  visibilityLabel: "UNLISTED",
  lifecycleStatusLabel: "IN_REVIEW",
  editLockMessage:
    "This creation is currently in review. Editing is paused until review is resolved.",
  visibilityOptions: baseVisibilityOptions.map((option) => ({
    ...option,
    active: option.value === "UNLISTED",
    disabled: true,
  })),
  reviewAction: {
    disabled: true,
    label: "In Review Queue",
  },
  saveAction: {
    ...baseSaveAction,
    disabled: true,
  },
  cancelReviewAction: {
    visible: true,
    disabled: false,
    busy: false,
    label: "Cancel Review",
    busyLabel: "Cancelling...",
  },
};

export const creationEditStickyActionBarArchivedFixture = {
  ...creationEditStickyActionBarDraftFixture,
  lifecycleStatusLabel: "ARCHIVED",
  editLockMessage: "Archived creations are locked from normal editing.",
  visibilityOptions: baseVisibilityOptions.map((option) => ({
    ...option,
    disabled: true,
  })),
  reviewAction: {
    disabled: true,
    label: "Archived",
  },
  saveAction: {
    ...baseSaveAction,
    disabled: true,
  },
};

export const creationEditStickyActionBarCanonFixture = {
  ...creationEditStickyActionBarDraftFixture,
  lifecycleStatusLabel: "DRAFT",
  canonStatusLabel: "OFFICIAL",
  editLockMessage:
    "Official canon creations are preserved under canon stewardship.",
  visibilityOptions: baseVisibilityOptions.map((option) => ({
    ...option,
    disabled: true,
  })),
  reviewAction: {
    disabled: true,
    label: "Official Canon Locked",
  },
  saveAction: {
    ...baseSaveAction,
    disabled: true,
  },
};

export const creationEditStickyActionBarSavingFixture = {
  ...creationEditStickyActionBarDraftFixture,
  saveAction: {
    ...baseSaveAction,
    disabled: true,
    busy: true,
  },
};

export const creationEditStickyActionBarFeedbackFixture = {
  ...creationEditStickyActionBarDraftFixture,
  saveFeedback: {
    message: "Changes saved successfully.",
    tone: "success",
  },
};

export const creationEditStickyActionBarErrorFixture = {
  ...creationEditStickyActionBarDraftFixture,
  saveFeedback: {
    message: "The creation could not be saved.",
    tone: "error",
  },
};
