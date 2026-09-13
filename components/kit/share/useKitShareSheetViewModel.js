"use client";

// Pass-through ViewModel for KitShareSheet (contract 1.1.0): every
// prop the View reads is accepted here, normalized, and returned. The
// status line copy and the review button copy live here, not in the
// View.

import { SHARE_COPY, SHARE_REVIEW_STATES } from "./shareTypeRule.js";

const STATUS_MESSAGES = Object.freeze({
  idle: "",
  copied: "Link copied.",
  shared: "Shared.",
  error: "Share unavailable.",
});

const REVIEW_STATES = new Set(Object.values(SHARE_REVIEW_STATES));

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function callback(value) {
  return typeof value === "function" ? value : null;
}

export function getShareStatusMessage(status) {
  return STATUS_MESSAGES[text(status)] ?? "";
}

// The blocked sheet's primary reads the submission state: the action
// label until it is sent, Submitted for review once it lands (and the
// button disables), the action label again after a failure with the
// failure line beneath.
export function getShareReviewCopy(reviewState) {
  const state = REVIEW_STATES.has(text(reviewState)) ? text(reviewState) : SHARE_REVIEW_STATES.IDLE;
  return {
    reviewState: state,
    reviewButtonLabel:
      state === SHARE_REVIEW_STATES.SUBMITTED ? SHARE_COPY.submittedForReview : SHARE_COPY.submitForReview,
    reviewButtonDisabled:
      state === SHARE_REVIEW_STATES.SUBMITTED || state === SHARE_REVIEW_STATES.SUBMITTING,
    reviewMessage: state === SHARE_REVIEW_STATES.ERROR ? SHARE_COPY.submitFailed : "",
  };
}

export function useKitShareSheetViewModel(props = {}) {
  const status = STATUS_MESSAGES[text(props.status)] === undefined ? "idle" : text(props.status);
  const review = getShareReviewCopy(props.reviewState);

  return {
    kind: text(props.kind) || "link",
    hasCard: props.hasCard === true,
    cardImageSrc: text(props.cardImageSrc) || null,
    previewImageSrc: text(props.previewImageSrc),
    previewImageLargeSrc: text(props.previewImageLargeSrc),
    title: text(props.title),
    byline: text(props.byline),
    shareUrl: text(props.shareUrl),
    canNativeShare: props.canNativeShare === true,
    status,
    statusMessage: text(props.statusMessage) || getShareStatusMessage(status),
    blockedMessage: text(props.blockedMessage) || null,
    reviewState: review.reviewState,
    reviewButtonLabel: text(props.reviewButtonLabel) || review.reviewButtonLabel,
    reviewButtonDisabled:
      typeof props.reviewButtonDisabled === "boolean" ? props.reviewButtonDisabled : review.reviewButtonDisabled,
    reviewMessage: text(props.reviewMessage) || review.reviewMessage,
    onCopyLink: callback(props.onCopyLink),
    onNativeShare: callback(props.onNativeShare),
    onSubmitForReview: callback(props.onSubmitForReview),
    onClose: callback(props.onClose),
  };
}
