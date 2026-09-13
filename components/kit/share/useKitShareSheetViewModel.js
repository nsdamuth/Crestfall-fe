"use client";

// Pass-through ViewModel for KitShareSheet (contract 1.0.0): every
// prop the View reads is accepted here, normalized, and returned. The
// status line copy lives here, not in the View.

const STATUS_MESSAGES = Object.freeze({
  idle: "",
  copied: "Link copied.",
  shared: "Shared.",
  error: "Share unavailable.",
});

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function callback(value) {
  return typeof value === "function" ? value : null;
}

export function getShareStatusMessage(status) {
  return STATUS_MESSAGES[text(status)] ?? "";
}

export function useKitShareSheetViewModel(props = {}) {
  const status = STATUS_MESSAGES[text(props.status)] === undefined ? "idle" : text(props.status);

  return {
    kind: text(props.kind) || "link",
    hasCard: props.hasCard === true,
    cardImageSrc: text(props.cardImageSrc) || null,
    previewImageSrc: text(props.previewImageSrc),
    title: text(props.title),
    byline: text(props.byline),
    shareUrl: text(props.shareUrl),
    canNativeShare: props.canNativeShare === true,
    status,
    statusMessage: text(props.statusMessage) || getShareStatusMessage(status),
    blockedMessage: text(props.blockedMessage) || null,
    note: text(props.note) || null,
    onCopyLink: callback(props.onCopyLink),
    onNativeShare: callback(props.onNativeShare),
    onClose: callback(props.onClose),
  };
}
