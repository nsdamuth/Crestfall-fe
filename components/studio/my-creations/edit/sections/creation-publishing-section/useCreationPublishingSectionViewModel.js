const VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

const CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

const SUBMITTABLE_LIFECYCLE_STATUSES = new Set(["DRAFT", "REJECTED"]);
const INTERNAL_VISIBILITIES = new Set(["PRIVATE", "UNLISTED"]);

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Publishing",
  sectionTitle: "Publishing & Review",
  sectionDescription:
    "Visibility and review actions belong here, not on compact cards. This avoids accidental deletion or moderation queue spam.",
  visibilityLabel: "Visibility",
  contentRatingLabel: "Content Rating",
  templateEyebrow: "Template Management",
  templateTitle: "Template Operations",
  templateDescription:
    "Templates can later be duplicated, shared, edited, or used during character creation.",
  characterTemplateTitle: "Convert Character To Template",
  characterTemplateDescription:
    "Convert this character into a reusable template that can prefill future character creation flows.",
  publicReviewTitle: "Public Review",
  publicReviewDescription:
    "Submit this creation for public discovery after it has been tested and refined. Approval tools will be built later.",
  canonReviewTitle: "Canon Review",
  canonReviewDescription:
    "Canon review is optional and only for creations voluntarily submitted to become part of official Crestfall continuity.",
  unlistTitle: "Unlist for Editing",
  unlistDescription:
    "Pull this creation back to private so you can keep editing it. It leaves public discovery until you resubmit.",
  unlistButtonLabel: "Unlist for editing",
  cancelReviewButtonLabel: "Cancel review",
});

function normalizeUppercase(value, fallback = "") {
  const normalized = String(value || fallback).trim().toUpperCase();
  return normalized || fallback;
}

export function normalizeCreationPublishingLifecycleStatus(form = {}) {
  return normalizeUppercase(form?.status || form?.reviewStatus, "DRAFT");
}

export function isCreationPublishingSubmittable(form = {}) {
  const lifecycleStatus = normalizeCreationPublishingLifecycleStatus(form);
  const visibility = normalizeUppercase(form?.visibility, "PRIVATE");
  const isOfficialCanon = normalizeUppercase(form?.canonStatus, "NONE") === "OFFICIAL";
  const isInReview = lifecycleStatus === "IN_REVIEW";
  const isArchived = lifecycleStatus === "ARCHIVED";
  const isApprovedInternal =
    lifecycleStatus === "APPROVED" && INTERNAL_VISIBILITIES.has(visibility);

  return (
    !isOfficialCanon &&
    !isInReview &&
    !isArchived &&
    (SUBMITTABLE_LIFECYCLE_STATUSES.has(lifecycleStatus) ||
      isApprovedInternal)
  );
}

function getPublicReviewButtonLabel({ isInReview, reviewAction }) {
  if (isInReview) return "In Review";
  if (reviewAction === "PUBLIC") return "Submitting...";
  return "Submit for Public Review";
}

function getCanonReviewButtonLabel({
  isOfficialCanon,
  isInReview,
  reviewAction,
}) {
  if (isOfficialCanon) return "Official Canon";
  if (isInReview) return "In Review";
  if (reviewAction === "CANON") return "Submitting...";
  return "Submit for Canon Review";
}

// 4.7 composed disabled recipe (D19): the word "Soon" is a tier 8
// meta word the View renders beside a disabled control, never part
// of the label itself.
function getTemplateActions(isTemplate) {
  if (isTemplate) {
    return [
      {
        id: "duplicate-template",
        label: "Duplicate Template",
        disabled: true,
        emphasis: "secondary",
      },
      {
        id: "use-template",
        label: "Use Template",
        disabled: true,
        emphasis: "secondary",
      },
    ];
  }

  return [
    {
      id: "convert-to-template",
      label: "Convert To Template",
      disabled: true,
      emphasis: "primary",
    },
  ];
}

export function getCreationPublishingSectionViewProps({
  form = {},
  updateField = null,
  isTemplate = false,
  onSubmitPublicReview = null,
  onSubmitCanonReview = null,
  reviewStatus = "idle",
  reviewMessage = "",
  reviewAction = "",
  onUnlistForEditing = null,
  onCancelReview = null,
} = {}) {
  const lifecycleStatus = normalizeCreationPublishingLifecycleStatus(form);
  const isOfficialCanon =
    normalizeUppercase(form?.canonStatus, "NONE") === "OFFICIAL";
  const isInReview = lifecycleStatus === "IN_REVIEW";
  const isSubmittable = isCreationPublishingSubmittable(form);
  const isSaving = reviewStatus === "saving";
  const isArchived = lifecycleStatus === "ARCHIVED";
  const visibility = normalizeUppercase(form?.visibility, "PRIVATE");
  // Same formula as the retired sticky action bar's canUnlistForEditing
  // (edit/creation-edit-sticky-action-bar/useCreationEditStickyActionBarViewModel.js),
  // carried here verbatim so unlist eligibility is unchanged by the move.
  const isPublicLive = visibility === "PUBLIC" && lifecycleStatus === "APPROVED";
  const canUnlistForEditing =
    isPublicLive && !isOfficialCanon && !isInReview && !isArchived;

  return {
    ...DEFAULT_COPY,
    visibilityValue: normalizeUppercase(form?.visibility, "PRIVATE"),
    visibilityOptions: VISIBILITY_OPTIONS,
    contentRatingValue: normalizeUppercase(form?.contentRating, "SFW"),
    contentRatingOptions: CONTENT_RATING_OPTIONS,
    templateTitle: isTemplate
      ? DEFAULT_COPY.templateTitle
      : DEFAULT_COPY.characterTemplateTitle,
    templateDescription: isTemplate
      ? DEFAULT_COPY.templateDescription
      : DEFAULT_COPY.characterTemplateDescription,
    templateActions: getTemplateActions(Boolean(isTemplate)),
    publicReviewButtonLabel: getPublicReviewButtonLabel({
      isInReview,
      reviewAction,
    }),
    publicReviewDisabled: !isSubmittable || isSaving,
    canonReviewButtonLabel: getCanonReviewButtonLabel({
      isOfficialCanon,
      isInReview,
      reviewAction,
    }),
    canonReviewDisabled: !isSubmittable || isSaving,
    reviewMessage: String(reviewMessage || ""),
    reviewMessageTone: reviewStatus === "error" ? "error" : "success",
    onSelectVisibility: (value) => updateField?.("visibility", value),
    onSelectContentRating: (value) =>
      updateField?.("contentRating", value),
    onSubmitPublicReview: () => onSubmitPublicReview?.(),
    onSubmitCanonReview: () => onSubmitCanonReview?.(),
    showUnlist: canUnlistForEditing,
    unlistDisabled: isSaving,
    onUnlistForEditing: () => onUnlistForEditing?.(),
    showCancelReview: isInReview,
    cancelReviewDisabled: isSaving,
    onCancelReview: () => onCancelReview?.(),
  };
}

export function useCreationPublishingSectionViewModel(props = {}) {
  return getCreationPublishingSectionViewProps(props);
}
