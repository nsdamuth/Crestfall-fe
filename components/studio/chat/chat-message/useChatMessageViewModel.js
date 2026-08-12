"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  CHAT_MESSAGE_BODY_MODES,
  CHAT_MESSAGE_COPY_STATES,
  CHAT_MESSAGE_SURFACE_TONES,
} from "./ChatMessage.contract";

const COPY_FEEDBACK_MS = 1800;

function getPlainTextForCopy({ bodyMode, legacyBody, semanticSegments }) {
  if (bodyMode === CHAT_MESSAGE_BODY_MODES.SEMANTIC) {
    return (Array.isArray(semanticSegments) ? semanticSegments : [])
      .map((segment) => String(segment?.text || ""))
      .join("");
  }

  return String(legacyBody || "");
}

async function copyTextToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }

  document.body.removeChild(textarea);
  return succeeded;
}

/**
 * Defensive pass-through ViewModel for the portable chat-message View.
 * This package receives already contract-shaped message props from its
 * caller (the chat-transcript package today, the chat page shell once C5
 * lands); it does not map raw story-room domain records itself. Its own
 * application behavior is limited to the copy-to-clipboard feedback loop,
 * a self-contained browser interaction with no Crestfall data dependency.
 */
export function useChatMessageViewModel(props = {}) {
  const {
    surfaceTone = CHAT_MESSAGE_SURFACE_TONES.CHARACTER,
    bodyMode = CHAT_MESSAGE_BODY_MODES.LEGACY,
    legacyBody = "",
    semanticSegments = [],
    statusBlocks = [],
    canCopy,
    onCopy = null,
    enableFixturePaletteDemo = false,
    paletteRoleOverrides = null,
    ...rest
  } = props;

  const [copyState, setCopyState] = useState(null);
  const feedbackTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const safeSemanticSegments = Array.isArray(semanticSegments) ? semanticSegments : [];
  const safeStatusBlocks = Array.isArray(statusBlocks) ? statusBlocks : [];
  const plainTextForCopy = getPlainTextForCopy({
    bodyMode,
    legacyBody,
    semanticSegments: safeSemanticSegments,
  });
  const resolvedCanCopy =
    typeof canCopy === "boolean" ? canCopy : Boolean(plainTextForCopy.trim());

  const handleCopy = useCallback(async () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    const succeeded = await copyTextToClipboard(plainTextForCopy);
    setCopyState(
      succeeded ? CHAT_MESSAGE_COPY_STATES.COPIED : CHAT_MESSAGE_COPY_STATES.FAILED
    );

    feedbackTimeoutRef.current = setTimeout(() => {
      setCopyState(null);
    }, COPY_FEEDBACK_MS);

    if (succeeded) {
      onCopy?.();
    }
  }, [plainTextForCopy, onCopy]);

  return {
    ...rest,
    surfaceTone,
    bodyMode,
    legacyBody,
    semanticSegments: safeSemanticSegments,
    statusBlocks: safeStatusBlocks,
    enableFixturePaletteDemo,
    paletteRoleOverrides,
    canCopy: resolvedCanCopy,
    copyState,
    onCopy: resolvedCanCopy ? handleCopy : null,
  };
}
