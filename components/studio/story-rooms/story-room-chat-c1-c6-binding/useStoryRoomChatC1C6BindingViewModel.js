"use client";

import { useCallback, useMemo, useState } from "react";

import { useChatCastPanelViewModel } from "@/components/studio/chat/chat-cast-panel/useChatCastPanelViewModel";
import { useChatComposerViewModel } from "@/components/studio/chat/chat-composer/useChatComposerViewModel";
import { useStoryRoomCastPanelViewModel } from "@/components/studio/story-rooms/story-room-cast-panel/useStoryRoomCastPanelViewModel";
import { useStoryRoomChatShellViewModel } from "@/components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel";
import { useStoryRoomStatePanelViewModel } from "@/components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel";
import { useStoryRoomTranscriptViewModel } from "@/components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel";
import {
  STORY_SHARE_DEFAULT_MODE,
  STORY_SHARE_EXPORT_DEFAULT_FORMAT,
  STORY_SHARE_EXPORT_DEFAULT_PRESET,
  buildStorySessionExportIntent,
  buildStorySessionShareIntent,
  buildStorySessionVisibleMessageOptions,
  getStorySessionDefaultRangeBoundaries,
  projectStorySessionExportDialog,
  projectStorySessionShareDialog,
  projectStorySessionShareExportActions,
} from "@/components/studio/story-rooms/story-share-export-c4-binding/StoryShareExportC4Binding.contract";
import {
  buildStoryRoomChatStateActions,
  buildStoryRoomChatStatusPills,
  projectStoryRoomReportDialog,
} from "./StoryRoomChatC1C6Binding.contract";

async function copyText(text) {
  if (!text) return false;
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
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}


function errorText(value) {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  if (value && typeof value === "object" && typeof value.message === "string") {
    return value.message;
  }
  return value ? String(value) : "";
}

function buildShareUrl(result) {
  const token = String(result?.token || "").trim();
  if (!token || typeof window === "undefined") return "";
  return `${window.location.origin}/share/chat/${encodeURIComponent(token)}`;
}

export function useStoryRoomChatC1C6BindingViewModel({
  roomId,
  chat,
  coinBalance = 0,
  onRoomDeleted,
} = {}) {
  const safeChat = chat && typeof chat === "object" ? chat : {};

  const application = useStoryRoomChatShellViewModel({
    roomId,
    chat: safeChat,
    confirmDelete: () => true,
    onRoomDeleted,
  });

  const transcript = useStoryRoomTranscriptViewModel(application.transcriptProps);
  const storyCast = useStoryRoomCastPanelViewModel(application.castPanelProps);
  const castPanel = useChatCastPanelViewModel({
    ...storyCast.viewProps,
    deletePending: Boolean(storyCast.viewProps?.deleteAction?.busy),
    onDeleteRoom: storyCast.viewProps?.onDeleteRoom,
  });

  const composerSource = application.composerProps || {};
  const composer = useChatComposerViewModel({
    mode: composerSource.inputMode,
    setMode: composerSource.setInputMode,
    speakerId: composerSource.nextSpeaker,
    setSpeakerId: composerSource.setNextSpeaker,
    speakerOptions: composerSource.nextSpeakerOptions,
    draft: composerSource.draft,
    setDraft: composerSource.setDraft,
    participantMentions: composerSource.participantMentions,
    setParticipantMentions: composerSource.setParticipantMentions,
    participantMentionOptions: composerSource.participantMentionOptions,
    locationMentions: composerSource.locationMentions,
    setLocationMentions: composerSource.setLocationMentions,
    locationMentionOptions: composerSource.locationMentionOptions,
    onSend: composerSource.onSend,
    onOpenCast: null,
    onOpenState: null,
    isSending: composerSource.isSending,
    disabled: composerSource.disabled,
    streamingSupported: false,
    sceneImage: { available: false },
    useCurrentScene: { available: false },
  });

  const stateBase = useStoryRoomStatePanelViewModel({
    room: application.room,
    snapshot: safeChat.snapshot || null,
  });

  const messages = Array.isArray(safeChat.messages) ? safeChat.messages : [];
  const messageOptions = useMemo(
    () => buildStorySessionVisibleMessageOptions(messages),
    [messages]
  );
  const defaultRange = useMemo(
    () => getStorySessionDefaultRangeBoundaries(messageOptions),
    [messageOptions]
  );

  const [exportOpen, setExportOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState(STORY_SHARE_EXPORT_DEFAULT_PRESET);
  const [exportFormat, setExportFormat] = useState(STORY_SHARE_EXPORT_DEFAULT_FORMAT);
  const [exportStartMessageId, setExportStartMessageId] = useState("");
  const [exportEndMessageId, setExportEndMessageId] = useState("");
  const [exportPending, setExportPending] = useState(false);
  const [exportError, setExportError] = useState("");

  const [shareOpen, setShareOpen] = useState(false);
  const [shareMode, setShareMode] = useState(STORY_SHARE_DEFAULT_MODE);
  const [sharePreset, setSharePreset] = useState(STORY_SHARE_EXPORT_DEFAULT_PRESET);
  const [shareStartMessageId, setShareStartMessageId] = useState("");
  const [shareEndMessageId, setShareEndMessageId] = useState("");
  const [sharePending, setSharePending] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareRawResult, setShareRawResult] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);

  const openExport = useCallback(() => {
    setExportStartMessageId((current) => current || defaultRange.startMessageId);
    setExportEndMessageId((current) => current || defaultRange.endMessageId);
    setExportError("");
    setShareOpen(false);
    setExportOpen(true);
  }, [defaultRange]);

  const closeExport = useCallback(() => {
    if (exportPending) return;
    setExportOpen(false);
    setExportError("");
  }, [exportPending]);

  const submitExport = useCallback(async () => {
    if (exportPending || typeof safeChat.exportTranscript !== "function") return;
    const intent = buildStorySessionExportIntent({
      preset: exportPreset,
      format: exportFormat,
      startMessageId: exportStartMessageId,
      endMessageId: exportEndMessageId,
    });
    if (!intent.valid) {
      setExportError(intent.error);
      return;
    }
    setExportPending(true);
    setExportError("");
    try {
      await safeChat.exportTranscript(intent.payload);
      setExportOpen(false);
    } catch (error) {
      setExportError(error?.message || "Transcript could not be exported.");
    } finally {
      setExportPending(false);
    }
  }, [exportEndMessageId, exportFormat, exportPending, exportPreset, exportStartMessageId, safeChat]);

  const openShare = useCallback(() => {
    setShareStartMessageId((current) => current || defaultRange.startMessageId);
    setShareEndMessageId((current) => current || defaultRange.endMessageId);
    setShareError("");
    setShareRawResult(null);
    setShareUrl("");
    setShareCopied(false);
    setRevokeConfirmOpen(false);
    setExportOpen(false);
    setShareOpen(true);
  }, [defaultRange]);

  const closeShare = useCallback(() => {
    if (sharePending) return;
    setShareOpen(false);
    setShareError("");
    setRevokeConfirmOpen(false);
  }, [sharePending]);

  const submitShare = useCallback(async () => {
    if (sharePending) return;
    const createShare = shareMode === "PERSISTENT_REVIEWED"
      ? safeChat.createPersistentShare
      : safeChat.createTemporaryShare;
    if (typeof createShare !== "function") return;
    const intent = buildStorySessionShareIntent({
      mode: shareMode,
      preset: sharePreset,
      startMessageId: shareStartMessageId,
      endMessageId: shareEndMessageId,
    });
    if (!intent.valid) {
      setShareError(intent.error);
      return;
    }
    setSharePending(true);
    setShareError("");
    setShareCopied(false);
    try {
      const result = await createShare(intent.payload);
      setShareRawResult(result || null);
      setShareUrl(buildShareUrl(result));
    } catch (error) {
      setShareError(error?.message || "Story snapshot could not be shared.");
    } finally {
      setSharePending(false);
    }
  }, [safeChat, shareEndMessageId, shareMode, sharePending, sharePreset, shareStartMessageId]);

  const copyShare = useCallback(async () => {
    try {
      const copied = await copyText(shareUrl);
      setShareCopied(copied);
      if (!copied) setShareError("The share link could not be copied.");
    } catch {
      setShareError("The share link could not be copied.");
    }
  }, [shareUrl]);

  const confirmRevokeShare = useCallback(async () => {
    const shareId = String(shareRawResult?.shareId || "").trim();
    if (!shareId || sharePending) return;
    const effectiveMode = String(shareRawResult?.shareMode || shareMode).toUpperCase();
    const revoke = effectiveMode === "PERSISTENT_REVIEWED"
      ? safeChat.revokePersistentShare
      : safeChat.revokeTemporaryShare;
    if (typeof revoke !== "function") return;
    setSharePending(true);
    setShareError("");
    try {
      await revoke(shareId);
      setShareRawResult((current) => current ? { ...current, status: "REVOKED" } : current);
      setRevokeConfirmOpen(false);
    } catch (error) {
      setShareError(error?.message || "Share link could not be revoked.");
    } finally {
      setSharePending(false);
    }
  }, [safeChat, shareMode, sharePending, shareRawResult]);

  const actionProjection = useMemo(
    () => projectStorySessionShareExportActions({
      roomId,
      messages,
      canExport: typeof safeChat.exportTranscript === "function",
      canCreateTemporaryShare: typeof safeChat.createTemporaryShare === "function",
    }),
    [messages, roomId, safeChat]
  );

  const stateActions = useMemo(
    () => buildStoryRoomChatStateActions({
      actionProjection,
      onOpenExport: openExport,
      onOpenShare: openShare,
    }),
    [actionProjection, openExport, openShare]
  );

  const exportDialog = projectStorySessionExportDialog({
    open: exportOpen,
    preset: exportPreset,
    format: exportFormat,
    startMessageId: exportStartMessageId,
    endMessageId: exportEndMessageId,
    messages,
    pending: exportPending,
    error: exportError,
    callbacks: {
      onExportPresetChange: setExportPreset,
      onExportFormatChange: setExportFormat,
      onExportStartMessageChange: setExportStartMessageId,
      onExportEndMessageChange: setExportEndMessageId,
      onExportSubmit: submitExport,
      onExportClose: closeExport,
    },
  });

  const shareDialog = projectStorySessionShareDialog({
    open: shareOpen,
    mode: shareMode,
    preset: sharePreset,
    startMessageId: shareStartMessageId,
    endMessageId: shareEndMessageId,
    messages,
    result: shareRawResult,
    shareUrl,
    copied: shareCopied,
    pending: sharePending,
    error: shareError,
    revokeConfirmOpen,
    callbacks: {
      onShareModeChange: (nextMode) => {
        setShareMode(nextMode);
        setShareRawResult(null);
        setShareUrl("");
        setShareCopied(false);
      },
      onSharePresetChange: setSharePreset,
      onShareStartMessageChange: setShareStartMessageId,
      onShareEndMessageChange: setShareEndMessageId,
      onShareSubmit: submitShare,
      onShareCopy: copyShare,
      onShareRequestRevoke: () => setRevokeConfirmOpen(true),
      onShareConfirmRevoke: confirmRevokeShare,
      onShareCancelRevoke: () => setRevokeConfirmOpen(false),
      onShareClose: closeShare,
    },
  });

  const reportDialog = projectStoryRoomReportDialog(transcript.reportDialog);
  const activeDialog = reportDialog || (exportOpen ? exportDialog : shareOpen ? shareDialog : null);

  return {
    shellProps: {
      backHref: "/studio/story-rooms",
      backLabel: "Stories",
      eyebrow: "Story",
      title: application.room?.title || "Private Story",
      scenarioLabel: application.room?.scenario || "",
      modeLabel: application.room?.roomMode || "",
      statusPills: buildStoryRoomChatStatusPills(application.room),
      coinBalanceLabel: Number.isFinite(Number(coinBalance))
        ? Math.max(0, Number(coinBalance)).toLocaleString()
        : "0",
      loading: Boolean(safeChat.loading),
      errorMessage: errorText(safeChat.error),
      transcript: {
        openingHeroImage: transcript.openingHeroImage,
        messageItems: transcript.messageItems,
        loading: transcript.loading,
        sending: transcript.sending,
        summaryPending: transcript.summaryPending,
        errorMessage: transcript.errorMessage,
      },
      composer,
      castPanel,
      statePanel: {
        ...stateBase,
        actions: stateActions,
      },
      sessionDialogs: {
        activeDialog,
        summaryPending: {
          visible: false,
          eyebrow: "Scene Recap",
          message: "Crestfall Engine is preparing the current scene recap...",
        },
      },
      libraryPassUpsell: null,
    },
    playerCharacterPickerProps: storyCast.playerCharacterPickerProps,
    runtimeMechanicsPanelProps: application.runtimeMechanicsPanelProps,
    composerHelpPanel: application.composerHelpPanel,
    commands: application.commands,
    onCloseComposerHelpPanel: application.onCloseComposerHelpPanel,
  };
}
