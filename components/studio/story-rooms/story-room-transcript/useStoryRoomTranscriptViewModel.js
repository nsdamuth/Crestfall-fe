"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STORY_ROOM_MESSAGE_CONTENT_TYPES, STORY_ROOM_MESSAGE_COPY_STATES, STORY_ROOM_MESSAGE_SURFACE_TONES } from "../story-room-message/StoryRoomMessage.contract";
import { getStoryRoomMessageViewProps } from "../story-room-message/useStoryRoomMessageViewModel";
import { projectStoryRoomAutoEventMediaTranscriptBinding } from "./auto-event-media-binding/StoryRoomAutoEventMediaTranscriptBinding.contract.js";

const COPY_FEEDBACK_DURATION_MS = 1800;
const REPORT_REASON_OPTIONS = Object.freeze([
  { value: "OUT_OF_CHARACTER", label: "Out of character" },
  { value: "CONTINUITY_ERROR", label: "Continuity error" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "LOW_QUALITY", label: "Low quality or incoherent" },
  { value: "OTHER", label: "Other" },
]);

function normalizeErrorMessage(error) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return error ? String(error) : "";
}

function getCopyText(viewProps) {
  if (viewProps.bodyMode === "SEMANTIC") {
    return viewProps.semanticSegments.map((segment) => String(segment?.text || "")).join("").trim();
  }
  return String(viewProps.legacyBody || "").trim();
}

function canCopyMessage(viewProps, copyText) {
  if (viewProps.contentType !== STORY_ROOM_MESSAGE_CONTENT_TYPES.TEXT || !copyText) return false;
  return [STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER, STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING, STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR, STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER].includes(viewProps.surfaceTone);
}

async function writeTextToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) throw new Error("Clipboard copy was not accepted by the browser.");
}

export function useStoryRoomTranscriptViewModel({
  openingHeroImage = null, messages, loading = false, sending = false, summaryPending = false, error = null,
  onRegenerateMessage = null, onContinueMessage = null, onReportMessage = null, messageActionState = {},
} = {}) {
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [reportDraft, setReportDraft] = useState(null);
  const [reportReasonCode, setReportReasonCode] = useState("OUT_OF_CHARACTER");
  const [reportComment, setReportComment] = useState("");
  const copyFeedbackTimerRef = useRef(null);
  const mediaBinding = useMemo(() => projectStoryRoomAutoEventMediaTranscriptBinding({ openingHeroImage, messages }), [messages, openingHeroImage]);
  const latestRegenerableId = useMemo(() => [...mediaBinding.messageItems].reverse().map((item) => item.rawMessage).find((message) => ["character", "narrator"].includes(message?.type))?.id || null, [mediaBinding.messageItems]);

  useEffect(() => () => { if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current); }, []);

  const copyMessage = useCallback(async (messageId, text) => {
    if (!text) return;
    if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
    try {
      await writeTextToClipboard(text);
      setCopyFeedback({ messageId, state: STORY_ROOM_MESSAGE_COPY_STATES.COPIED });
    } catch {
      setCopyFeedback({ messageId, state: STORY_ROOM_MESSAGE_COPY_STATES.FAILED });
    }
    copyFeedbackTimerRef.current = setTimeout(() => { setCopyFeedback(null); copyFeedbackTimerRef.current = null; }, COPY_FEEDBACK_DURATION_MS);
  }, []);

  const openReport = useCallback((messageId, speakerLabel) => {
    setReportDraft({ messageId, speaker: speakerLabel || "Message" });
    setReportReasonCode("OUT_OF_CHARACTER");
    setReportComment("");
  }, []);
  const closeReport = useCallback(() => { setReportDraft(null); setReportComment(""); }, []);
  const submitReport = useCallback(async () => {
    if (!reportDraft?.messageId || typeof onReportMessage !== "function") return;
    const result = await onReportMessage(reportDraft.messageId, { reasonCode: reportReasonCode, comment: reportComment });
    if (result) closeReport();
  }, [closeReport, onReportMessage, reportComment, reportDraft, reportReasonCode]);
  const reportDialog = useMemo(() => {
    if (!reportDraft) return null;
    const actionState = messageActionState?.[reportDraft.messageId] || {};
    return {
      open: true, speaker: reportDraft.speaker, reasonOptions: REPORT_REASON_OPTIONS, reasonCode: reportReasonCode, comment: reportComment,
      pending: Boolean(actionState.pending) && actionState.pendingAction === "REPORT_MESSAGE",
      error: actionState.errorAction === "REPORT_MESSAGE" ? actionState.error || "" : "",
      onReasonCodeChange: setReportReasonCode, onCommentChange: setReportComment, onCancel: closeReport, onSubmit: submitReport,
    };
  }, [closeReport, messageActionState, reportComment, reportDraft, reportReasonCode, submitReport]);

  return {
    openingHeroImage: mediaBinding.openingHeroImage,
    messageItems: mediaBinding.messageItems.map((item) => {
      if (item.kind === "AUTO_EVENT_MEDIA") {
        return { id: item.id, message: { surfaceTone: item.media.surfaceTone, contentType: item.media.contentType, speakerLabel: item.media.speakerLabel, media: item.media.media } };
      }
      const id = item.id;
      const viewProps = getStoryRoomMessageViewProps(item.rawMessage);
      const copyText = getCopyText(viewProps);
      const canCopy = canCopyMessage(viewProps, copyText);
      const actionState = messageActionState?.[id] || {};
      const isLatestAssistantResponse = id === String(latestRegenerableId || "");
      const assistantTone = [STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR, STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER].includes(viewProps.surfaceTone);
      const canRegenerate = isLatestAssistantResponse && assistantTone && typeof onRegenerateMessage === "function";
      const canContinue = isLatestAssistantResponse && assistantTone && typeof onContinueMessage === "function";
      const canReport = canCopy && typeof onReportMessage === "function";
      const pendingAction = actionState.pendingAction || "";
      const errorAction = actionState.errorAction || "";
      return {
        id,
        message: {
          ...viewProps,
          canCopy, copyState: copyFeedback?.messageId === id ? copyFeedback.state : null, onCopy: canCopy ? () => copyMessage(id, copyText) : null,
          canRegenerate, regeneratePending: Boolean(actionState.pending) && pendingAction === "REGENERATE_RESPONSE", regenerateError: errorAction === "REGENERATE_RESPONSE" ? actionState.error || "" : "", onRegenerate: canRegenerate ? () => onRegenerateMessage(id) : null,
          canContinue, continuePending: Boolean(actionState.pending) && pendingAction === "CONTINUE_RESPONSE", continueError: errorAction === "CONTINUE_RESPONSE" ? actionState.error || "" : "", onContinue: canContinue ? () => onContinueMessage(id) : null,
          canReport, reportPending: Boolean(actionState.pending) && pendingAction === "REPORT_MESSAGE", reportSubmitted: Boolean(actionState.reported), reportError: errorAction === "REPORT_MESSAGE" ? actionState.error || "" : "", onReport: canReport ? () => openReport(id, viewProps.speakerLabel) : null,
        },
      };
    }),
    loading: Boolean(loading), sending: Boolean(sending), summaryPending: Boolean(summaryPending), errorMessage: normalizeErrorMessage(error), reportDialog,
  };
}
