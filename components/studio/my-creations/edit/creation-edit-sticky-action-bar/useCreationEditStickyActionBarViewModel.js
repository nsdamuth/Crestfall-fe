const OWNER_VISIBILITY_OPTIONS = ["PRIVATE", "UNLISTED"];

function createAction({
  visible = true,
  disabled = false,
  busy = false,
  label = "",
  busyLabel = "",
} = {}) {
  return {
    visible: Boolean(visible),
    disabled: Boolean(disabled),
    busy: Boolean(busy),
    label,
    busyLabel,
  };
}

export function getCreationEditStickyActionBarViewProps({
  form = {},
  updateField,
  onSave,
  saveStatus = "",
  saveMessage = "",
  onOpenPublishing,
  onUnlistForEditing,
  onCancelReview,
  reviewStatus = "",
} = {}) {
  const lifecycleStatus = form?.status || form?.reviewStatus || "DRAFT";
  const canonStatus = form?.canonStatus || "NONE";
  const visibility = form?.visibility || "PRIVATE";

  const isInReview = lifecycleStatus === "IN_REVIEW";
  const isArchived = lifecycleStatus === "ARCHIVED";
  const isOfficialCanon = canonStatus === "OFFICIAL";
  const isPublicLive = visibility === "PUBLIC" && lifecycleStatus === "APPROVED";
  const isApprovedInternal =
    lifecycleStatus === "APPROVED" &&
    OWNER_VISIBILITY_OPTIONS.includes(visibility);

  const canEditOwnerFields =
    (["DRAFT", "REJECTED"].includes(lifecycleStatus) || isApprovedInternal) &&
    !isInReview &&
    !isArchived &&
    !isOfficialCanon &&
    OWNER_VISIBILITY_OPTIONS.includes(visibility);

  const canUnlistForEditing =
    isPublicLive && !isOfficialCanon && !isInReview && !isArchived;

  const isSaving = saveStatus === "saving";
  const isCancellingReview = reviewStatus === "saving";
  const canSave = canEditOwnerFields && !isSaving;
  const canOpenPublishing = canEditOwnerFields;

  let reviewButtonLabel = "Review Actions";

  if (isInReview) {
    reviewButtonLabel = "In Review Queue";
  } else if (isPublicLive) {
    reviewButtonLabel = "Public Live";
  } else if (isApprovedInternal) {
    reviewButtonLabel = "Review / Resubmit";
  } else if (isArchived) {
    reviewButtonLabel = "Archived";
  } else if (isOfficialCanon) {
    reviewButtonLabel = "Official Canon Locked";
  } else if (lifecycleStatus === "REJECTED") {
    reviewButtonLabel = "Review / Resubmit";
  }

  let editLockMessage = null;

  if (!canEditOwnerFields) {
    if (isInReview) {
      editLockMessage =
        "This creation is currently in review. Editing is paused until review is resolved.";
    } else if (isPublicLive) {
      editLockMessage =
        "This creation is public. Unlist it to make changes, then submit it for review again before returning it to public discovery.";
    } else if (isArchived) {
      editLockMessage = "Archived creations are locked from normal editing.";
    } else if (isOfficialCanon) {
      editLockMessage =
        "Official canon creations are preserved under canon stewardship.";
    } else {
      editLockMessage =
        "This creation is not currently editable from owner tools.";
    }
  }

  return {
    eyebrow: "Visibility & Save",
    visibilityLabel: String(form?.visibility || ""),
    lifecycleStatusLabel: String(lifecycleStatus),
    canonStatusLabel: String(canonStatus),
    editLockMessage,
    visibilityOptions: OWNER_VISIBILITY_OPTIONS.map((value) => ({
      value,
      label: value,
      active: form?.visibility === value,
      disabled: !canEditOwnerFields,
    })),
    publicVisibility: {
      active: form?.visibility === "PUBLIC",
      disabled: true,
      title: "Public visibility is granted through review approval.",
      label: "Public",
    },
    reviewAction: {
      disabled: !canOpenPublishing,
      label: reviewButtonLabel,
    },
    unlistAction: createAction({
      visible: canUnlistForEditing,
      disabled: isSaving,
      busy: false,
      label: "Unlist for Editing",
      busyLabel: "",
    }),
    saveAction: createAction({
      visible: true,
      disabled: !canSave,
      busy: isSaving,
      label: "Save Changes",
      busyLabel: "Saving...",
    }),
    cancelReviewAction: createAction({
      visible: isInReview,
      disabled: isCancellingReview,
      busy: isCancellingReview,
      label: "Cancel Review",
      busyLabel: "Cancelling...",
    }),
    saveFeedback: saveMessage
      ? {
          message: String(saveMessage),
          tone: saveStatus === "error" ? "error" : "success",
        }
      : null,
    onSelectVisibility: (nextVisibility) => {
      if (!OWNER_VISIBILITY_OPTIONS.includes(nextVisibility)) return;
      updateField?.("visibility", nextVisibility);
    },
    onOpenReviewActions: () => onOpenPublishing?.(),
    onUnlistForEditing: () => onUnlistForEditing?.(),
    onSaveChanges: () => onSave?.(),
    onCancelReview: () => onCancelReview?.(),
  };
}

export function useCreationEditStickyActionBarViewModel(props = {}) {
  return getCreationEditStickyActionBarViewProps(props);
}
