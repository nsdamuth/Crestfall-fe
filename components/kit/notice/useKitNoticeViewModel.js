"use client";

// Pass-through ViewModel for KitNotice (contract 1.0.0). Normalizes
// whatever a consumer hands it into display-ready props; the copy
// itself always comes from the caller (create, rename, move, add,
// remove, and delete each state their own words, R5 of the
// ASSET-FOLDERS brief), never authored here.
import { useEffect, useRef, useState } from "react";

const TONES = new Set(["neutral", "danger"]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function callback(value) {
  return typeof value === "function" ? value : null;
}

export function toNoticeTone(tone) {
  const value = text(tone);
  return TONES.has(value) ? value : "neutral";
}

export function useKitNoticeViewModel(props = {}) {
  return {
    message: text(props.message),
    tone: toNoticeTone(props.tone),
    onDismiss: callback(props.onDismiss),
  };
}

// The auto-clear timer, matching components/kit/share/
// useKitShareController.js:18 (STATUS_RESET_MS, 1600ms) so a
// confirmation note and the share sheet's "Link copied" line read at
// the same pace. Not wired into any page by this package (AF5 and
// AF6 do that); exported so both consumers time their notes the same
// way instead of each re-deriving the window.
export const NOTICE_AUTO_CLEAR_MS = 1600;

// Holds one message for NOTICE_AUTO_CLEAR_MS, then clears itself.
// Calling `show(nextMessage)` while a timer is already running resets
// the window rather than stacking a second note (no stacking, per
// contract). `clear()` dismisses immediately, for a consumer wiring
// KitNotice's own dismiss control.
export function useKitNoticeAutoClear(durationMs = NOTICE_AUTO_CLEAR_MS) {
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function show(nextMessage) {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setMessage(text(nextMessage));
    timerRef.current = window.setTimeout(() => setMessage(""), durationMs);
  }

  function clear() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setMessage("");
  }

  return { message, show, clear };
}
