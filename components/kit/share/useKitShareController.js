"use client";

// The page-facing share controller (fe/share-og brief 1). A page mounts
// <KitShareSheet {...share.sheetProps} /> once and calls
// share.open(asset) from every share button it carries. The type rule
// decides everything about the intent; this hook owns only the open
// state, the copy action (the one share action since follow-up 2: no
// native share), the review submission on a blocked share (follow-up
// 1), and the status timer. No page carries share logic of its own
// (gate G1).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { submitCreationReview } from "@/lib/client/studio/creations/creationClient";

import { SHARE_REVIEW_STATES, buildShareIntent } from "./shareTypeRule.js";

const STATUS_RESET_MS = 1600;

function copyWithFallback(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

async function copyText(value) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  copyWithFallback(value);
}

export function useKitShareController({ sharerUsername = "", origin = "" } = {}) {
  const [intent, setIntent] = useState(null);
  const [status, setStatus] = useState("idle");
  const [reviewState, setReviewState] = useState(SHARE_REVIEW_STATES.IDLE);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  const settle = useCallback((nextStatus) => {
    setStatus(nextStatus);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus("idle"), STATUS_RESET_MS);
  }, []);

  const open = useCallback(
    (asset) => {
      const resolvedOrigin = origin || (typeof window !== "undefined" ? window.location.origin : "");
      const nextIntent = buildShareIntent(asset || {}, { sharerUsername, origin: resolvedOrigin });
      setStatus("idle");
      setReviewState(nextIntent.reviewState || SHARE_REVIEW_STATES.IDLE);
      setIntent(nextIntent);
    },
    [origin, sharerUsername]
  );

  const close = useCallback(() => {
    setIntent(null);
    setStatus("idle");
    setReviewState(SHARE_REVIEW_STATES.IDLE);
  }, []);

  const copyLink = useCallback(async () => {
    if (!intent?.url) return;
    try {
      await copyText(intent.url);
      settle("copied");
    } catch {
      settle("error");
    }
  }, [intent, settle]);

  // The blocked sheet's primary: the existing publication review path
  // (the creation editor's Publishing section posts the same call),
  // PUBLIC review only. A payload that answers 200 with an error body
  // (CR-005) reads as a failure here, never as a submission.
  const submitForReview = useCallback(async () => {
    if (!intent?.id || !intent?.blockedMessage) return;
    if (reviewState === SHARE_REVIEW_STATES.SUBMITTING || reviewState === SHARE_REVIEW_STATES.SUBMITTED) {
      return;
    }
    setReviewState(SHARE_REVIEW_STATES.SUBMITTING);
    try {
      const payload = await submitCreationReview(intent.id, "PUBLIC");
      if (payload?.error) throw new Error(payload.error.message || "Could not submit for review.");
      setReviewState(SHARE_REVIEW_STATES.SUBMITTED);
    } catch {
      setReviewState(SHARE_REVIEW_STATES.ERROR);
    }
  }, [intent, reviewState]);

  const sheetProps = useMemo(
    () =>
      intent
        ? {
            intent,
            status,
            reviewState,
            onCopyLink: copyLink,
            onSubmitForReview: submitForReview,
            onClose: close,
          }
        : { intent: null },
    [close, copyLink, intent, reviewState, status, submitForReview]
  );

  return {
    isOpen: Boolean(intent),
    intent,
    status,
    reviewState,
    open,
    close,
    copyLink,
    submitForReview,
    sheetProps,
  };
}
