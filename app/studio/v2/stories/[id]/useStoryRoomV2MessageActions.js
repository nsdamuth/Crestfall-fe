"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CHAT_MESSAGE_BODY_MODES,
  CHAT_MESSAGE_CONTENT_TYPES,
  CHAT_MESSAGE_COPY_STATES,
  CHAT_MESSAGE_SURFACE_TONES,
} from "@/components/studio/chat/chat-message/ChatMessage.contract";
import { CHAT_REPORT_REASON_OPTIONS } from "@/components/studio/chat/chat-session-dialogs/ChatSessionDialogs.contract";

const COPY_FEEDBACK_MS = 1800;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getCopyText(message = {}) {
  if (message.bodyMode === CHAT_MESSAGE_BODY_MODES.SEMANTIC) {
    return normalizeArray(message.semanticSegments)
      .map((segment) => String(segment?.text || ""))
      .join("")
      .trim();
  }

  return normalizeText(message.legacyBody);
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

async function writeTextToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === "undefined") return false;

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

/**
 * V2 Story message-action binding.
 *
 * The Story Room transport hook remains the network/runtime owner for
 * Regenerate, Continue, and Report. This hook only projects those live
 * operations plus browser-local Copy feedback into the portable chat-message
 * contract and the existing report dialog contract.
 */
export function useStoryRoomV2MessageActions({
  messages = [],
  projectedMessageItems = [],
  regenerateMessage = null,
  continueMessage = null,
  reportMessage = null,
  messageActionState = {},
} = {}) {
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [reportDraft, setReportDraft] = useState(null);
  const [reportReasonCode, setReportReasonCode] = useState("OUT_OF_CHARACTER");
  const [reportComment, setReportComment] = useState("");
  const copyFeedbackTimerRef = useRef(null);

  const rawMessages = useMemo(() => normalizeArray(messages), [messages]);
  const projectedItems = useMemo(
    () => normalizeArray(projectedMessageItems),
    [projectedMessageItems]
  );

  const rawMessageById = useMemo(() => {
    const entries = rawMessages
      .map((message) => [normalizeText(message?.id), message])
      .filter(([id]) => id);
    return new Map(entries);
  }, [rawMessages]);

  const latestAssistantActionMessageId = useMemo(
    () =>
      normalizeText(
        [...rawMessages].reverse().find(isAssistantActionTarget)?.id
      ),
    [rawMessages]
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
        ? CHAT_MESSAGE_COPY_STATES.COPIED
        : CHAT_MESSAGE_COPY_STATES.FAILED,
    });

    copyFeedbackTimerRef.current = setTimeout(() => {
      setCopyFeedback(null);
      copyFeedbackTimerRef.current = null;
    }, COPY_FEEDBACK_MS);
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
    if (!reportDraft?.messageId || typeof reportMessage !== "function") {
      return;
    }

    const result = await reportMessage(reportDraft.messageId, {
      reasonCode: reportReasonCode,
      comment: reportComment,
    });

    if (result) closeReport();
  }, [closeReport, reportComment, reportDraft, reportMessage, reportReasonCode]);

  const reportDialog = useMemo(() => {
    if (!reportDraft) return null;

    const actionState = messageActionState?.[reportDraft.messageId] || {};

    return {
      kind: "REPORT",
      open: true,
      speaker: reportDraft.speaker,
      reasonOptions: CHAT_REPORT_REASON_OPTIONS,
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
      onSubmit: submitReport,
      onClose: closeReport,
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
      projectedItems.map((item) => {
        const id = normalizeText(item?.id);
        const message = item?.message || {};

        if (
          !id ||
          message.contentType === CHAT_MESSAGE_CONTENT_TYPES.AUTO_EVENT_MEDIA
        ) {
          return item;
        }

        const rawMessage = rawMessageById.get(id) || null;
        const copyText = getCopyText(message);
        const canCopy =
          Boolean(copyText) &&
          [
            CHAT_MESSAGE_SURFACE_TONES.PLAYER,
            CHAT_MESSAGE_SURFACE_TONES.OPENING,
            CHAT_MESSAGE_SURFACE_TONES.NARRATOR,
            CHAT_MESSAGE_SURFACE_TONES.CHARACTER,
          ].includes(message.surfaceTone);
        const actionState = messageActionState?.[id] || {};
        const pendingAction = actionState.pendingAction || "";
        const errorAction = actionState.errorAction || "";
        const isLatestAssistant = id === latestAssistantActionMessageId;
        const canRegenerate =
          isLatestAssistant && typeof regenerateMessage === "function";
        const canContinue =
          isLatestAssistant && typeof continueMessage === "function";
        const canReport =
          isReportableMessage(rawMessage) && typeof reportMessage === "function";

        return {
          ...item,
          message: {
            ...message,
            canCopy,
            copyState:
              copyFeedback?.messageId === id ? copyFeedback.state : null,
            onCopy: canCopy ? () => copyMessage(id, copyText) : null,
            canRegenerate,
            regeneratePending:
              Boolean(actionState.pending) &&
              pendingAction === "REGENERATE_RESPONSE",
            regenerateError:
              errorAction === "REGENERATE_RESPONSE"
                ? actionState.error || ""
                : "",
            onRegenerate: canRegenerate
              ? () => regenerateMessage(id)
              : null,
            canContinue,
            continuePending:
              Boolean(actionState.pending) &&
              pendingAction === "CONTINUE_RESPONSE",
            continueError:
              errorAction === "CONTINUE_RESPONSE"
                ? actionState.error || ""
                : "",
            onContinue: canContinue ? () => continueMessage(id) : null,
            canReport,
            reportPending:
              Boolean(actionState.pending) && pendingAction === "REPORT_MESSAGE",
            reportSubmitted: Boolean(actionState.reported),
            reportError:
              errorAction === "REPORT_MESSAGE" ? actionState.error || "" : "",
            onReport: canReport
              ? () => openReport(id, message.speakerLabel)
              : null,
          },
        };
      }),
    [
      continueMessage,
      copyFeedback,
      copyMessage,
      latestAssistantActionMessageId,
      messageActionState,
      openReport,
      projectedItems,
      rawMessageById,
      regenerateMessage,
      reportMessage,
    ]
  );

  return {
    messageItems,
    reportDialog,
  };
}
