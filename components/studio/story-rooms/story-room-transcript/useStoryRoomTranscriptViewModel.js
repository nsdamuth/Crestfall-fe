"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  STORY_ROOM_MESSAGE_CONTENT_TYPES,
  STORY_ROOM_MESSAGE_COPY_STATES,
  STORY_ROOM_MESSAGE_SURFACE_TONES,
} from "../story-room-message/StoryRoomMessage.contract";
import { getStoryRoomMessageViewProps } from "../story-room-message/useStoryRoomMessageViewModel";

const COPY_FEEDBACK_DURATION_MS = 1800;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const REPORT_REASON_OPTIONS = Object.freeze([
  { value: "OUT_OF_CHARACTER", label: "Out of character" },
  { value: "CONTINUITY_ERROR", label: "Continuity error" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "LOW_QUALITY", label: "Low quality or incoherent" },
  { value: "OTHER", label: "Other" },
]);

function normalizeErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error ? String(error) : "";
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPersistedMessage(message) {
  const id = normalizeText(message?.id);
  return Boolean(id && UUID_PATTERN.test(id) && !message?.metadata?.optimistic);
}

function isAssistantActionTarget(message) {
  return (
    isPersistedMessage(message) &&
    ["character", "narrator"].includes(
      normalizeText(message?.type).toLowerCase()
    ) &&
    normalizeText(message?.kind).toUpperCase() === "CHAT" &&
    Boolean(normalizeText(message?.body))
  );
}

function isReportableMessage(message) {
  return (
    isPersistedMessage(message) &&
    ["player", "character", "narrator"].includes(
      normalizeText(message?.type).toLowerCase()
    ) &&
    ["CHAT", "OPENING_SCENE"].includes(
      normalizeText(message?.kind || "CHAT").toUpperCase()
    ) &&
    Boolean(normalizeText(message?.body))
  );
}

function getCopyText(viewProps) {
  if (viewProps?.bodyMode === "SEMANTIC") {
    return (Array.isArray(viewProps?.semanticSegments)
      ? viewProps.semanticSegments
      : []
    )
      .map((segment) => String(segment?.text || ""))
      .join("")
      .trim();
  }

  return normalizeText(viewProps?.legacyBody);
}

function canCopyMessage(viewProps, copyText) {
  return (
    viewProps?.contentType === STORY_ROOM_MESSAGE_CONTENT_TYPES.TEXT &&
    Boolean(copyText) &&
    [
      STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER,
      STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING,
      STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR,
      STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER,
    ].includes(viewProps?.surfaceTone)
  );
}

async function writeTextToClipboard(text) {
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
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

export function useStoryRoomTranscriptViewModel({
  messages,
  loading = false,
  sending = false,
  error = null,
  persistentStatusSurfaceDomains = [],
  playerCharacterPrompt = null,
  onRegenerateMessage = null,
  onContinueMessage = null,
  chatGenerationAllowed = true,
  chatGenerationDisabledReason = "",
  onReportMessage = null,
  messageActionState = {},
} = {}) {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [reportDraft, setReportDraft] = useState(null);
  const [reportReasonCode, setReportReasonCode] = useState("OUT_OF_CHARACTER");
  const [reportComment, setReportComment] = useState("");
  const copyFeedbackTimerRef = useRef(null);

  const latestAssistantActionMessageId = useMemo(
    () =>
      normalizeText(
        [...safeMessages].reverse().find(isAssistantActionTarget)?.id
      ),
    [safeMessages]
  );

  useEffect(() => {
    return () => {
      if (copyFeedbackTimerRef.current) {
        clearTimeout(copyFeedbackTimerRef.current);
      }
    };
  }, []);

  const copyMessage = useCallback(async (messageId, text) => {
    if (!text) return;

    if (copyFeedbackTimerRef.current) {
      clearTimeout(copyFeedbackTimerRef.current);
    }

    const copied = await writeTextToClipboard(text);

    setCopyFeedback({
      messageId,
      state: copied
        ? STORY_ROOM_MESSAGE_COPY_STATES.COPIED
        : STORY_ROOM_MESSAGE_COPY_STATES.FAILED,
    });

    copyFeedbackTimerRef.current = setTimeout(() => {
      setCopyFeedback(null);
      copyFeedbackTimerRef.current = null;
    }, COPY_FEEDBACK_DURATION_MS);
  }, []);

  const openReport = useCallback((messageId, speakerLabel) => {
    setReportDraft({
      messageId,
      speaker: speakerLabel || "Message",
    });
    setReportReasonCode("OUT_OF_CHARACTER");
    setReportComment("");
  }, []);

  const closeReport = useCallback(() => {
    setReportDraft(null);
    setReportComment("");
  }, []);

  const submitReport = useCallback(async () => {
    if (!reportDraft?.messageId || typeof onReportMessage !== "function") {
      return;
    }

    const result = await onReportMessage(reportDraft.messageId, {
      reasonCode: reportReasonCode,
      comment: reportComment,
    });

    if (result) {
      closeReport();
    }
  }, [
    closeReport,
    onReportMessage,
    reportComment,
    reportDraft,
    reportReasonCode,
  ]);

  const reportDialog = useMemo(() => {
    if (!reportDraft) return null;

    const actionState = messageActionState?.[reportDraft.messageId] || {};

    return {
      open: true,
      speaker: reportDraft.speaker,
      reasonOptions: REPORT_REASON_OPTIONS,
      reasonCode: reportReasonCode,
      comment: reportComment,
      pending:
        Boolean(actionState.pending) &&
        actionState.pendingAction === "REPORT_MESSAGE",
      error:
        actionState.errorAction === "REPORT_MESSAGE"
          ? actionState.error || ""
          : "",
      onReasonCodeChange: setReportReasonCode,
      onCommentChange: setReportComment,
      onCancel: closeReport,
      onSubmit: submitReport,
    };
  }, [
    closeReport,
    messageActionState,
    reportComment,
    reportDraft,
    reportReasonCode,
    submitReport,
  ]);

  const messageItems = useMemo(
    () =>
      safeMessages.map((message, index) => {
        const id = String(message?.id ?? `story-room-message-${index}`);
        const viewProps = getStoryRoomMessageViewProps(message, {
          persistentStatusSurfaceDomains,
        });

        if (
          viewProps.contentType === STORY_ROOM_MESSAGE_CONTENT_TYPES.AUTO_EVENT_MEDIA
        ) {
          return {
            id,
            message: viewProps,
          };
        }

        const copyText = getCopyText(viewProps);
        const canCopy = canCopyMessage(viewProps, copyText);
        const actionState = messageActionState?.[id] || {};
        const pendingAction = actionState.pendingAction || "";
        const errorAction = actionState.errorAction || "";
        const isLatestAssistant = id === latestAssistantActionMessageId;
        const canRegenerate =
          isLatestAssistant && typeof onRegenerateMessage === "function";
        const canContinue =
          isLatestAssistant && typeof onContinueMessage === "function";
        const canReport =
          isReportableMessage(message) &&
          typeof onReportMessage === "function";

        return {
          id,
          message: {
            ...viewProps,
            canCopy,
            copyState:
              copyFeedback?.messageId === id ? copyFeedback.state : null,
            onCopy: canCopy ? () => copyMessage(id, copyText) : null,
            canRegenerate,
            regenerateDisabled: !chatGenerationAllowed,
            regenerateDisabledReason: !chatGenerationAllowed
              ? String(chatGenerationDisabledReason || "Chat is not available for this account.")
              : "",
            regeneratePending:
              Boolean(actionState.pending) &&
              pendingAction === "REGENERATE_RESPONSE",
            regenerateError:
              errorAction === "REGENERATE_RESPONSE"
                ? actionState.error || ""
                : "",
            onRegenerate: canRegenerate
              ? () => onRegenerateMessage(id)
              : null,
            canContinue,
            continueDisabled: !chatGenerationAllowed,
            continueDisabledReason: !chatGenerationAllowed
              ? String(chatGenerationDisabledReason || "Chat is not available for this account.")
              : "",
            continuePending:
              Boolean(actionState.pending) &&
              pendingAction === "CONTINUE_RESPONSE",
            continueError:
              errorAction === "CONTINUE_RESPONSE"
                ? actionState.error || ""
                : "",
            onContinue: canContinue ? () => onContinueMessage(id) : null,
            canReport,
            reportPending:
              Boolean(actionState.pending) &&
              pendingAction === "REPORT_MESSAGE",
            reportSubmitted: Boolean(actionState.reported),
            reportError:
              errorAction === "REPORT_MESSAGE"
                ? actionState.error || ""
                : "",
            onReport: canReport
              ? () => openReport(id, viewProps.speakerLabel)
              : null,
          },
        };
      }),
    [
      chatGenerationAllowed,
      chatGenerationDisabledReason,
      copyFeedback,
      copyMessage,
      latestAssistantActionMessageId,
      messageActionState,
      onContinueMessage,
      onRegenerateMessage,
      onReportMessage,
      openReport,
      persistentStatusSurfaceDomains,
      safeMessages,
    ]
  );

  return {
    messageItems,
    loading: Boolean(loading),
    sending: Boolean(sending),
    errorMessage: normalizeErrorMessage(error),
    playerCharacterPrompt:
      playerCharacterPrompt && typeof playerCharacterPrompt === "object"
        ? playerCharacterPrompt
        : null,
    reportDialog,
  };
}
