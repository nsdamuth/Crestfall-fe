"use client";

// The page-facing share controller (fe/share-og brief 1). A page mounts
// <KitShareSheet {...share.sheetProps} /> once and calls
// share.open(asset) from every share button it carries. The type rule
// decides everything about the intent; this hook owns only the open
// state, the copy and native actions, and the status timer. No page
// carries share logic of its own (gate G1).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildShareIntent } from "./shareTypeRule.js";

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
  const [canNativeShare, setCanNativeShare] = useState(false);
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
      setStatus("idle");
      setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
      setIntent(buildShareIntent(asset || {}, { sharerUsername, origin: resolvedOrigin }));
    },
    [origin, sharerUsername]
  );

  const close = useCallback(() => {
    setIntent(null);
    setStatus("idle");
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

  const nativeShare = useCallback(async () => {
    if (!intent?.nativeShare || typeof navigator === "undefined" || typeof navigator.share !== "function") {
      return;
    }
    try {
      await navigator.share(intent.nativeShare);
      settle("shared");
    } catch (error) {
      if (error?.name !== "AbortError") settle("error");
    }
  }, [intent, settle]);

  const sheetProps = useMemo(
    () =>
      intent
        ? {
            intent,
            status,
            canNativeShare,
            onCopyLink: copyLink,
            onNativeShare: nativeShare,
            onClose: close,
          }
        : { intent: null },
    [canNativeShare, close, copyLink, intent, nativeShare, status]
  );

  return {
    isOpen: Boolean(intent),
    intent,
    status,
    open,
    close,
    copyLink,
    nativeShare,
    sheetProps,
  };
}
