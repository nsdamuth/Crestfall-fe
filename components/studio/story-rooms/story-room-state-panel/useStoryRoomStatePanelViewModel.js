"use client";

import { useCallback, useMemo, useState } from "react";

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
} from "../story-share-export-c4-binding/StoryShareExportC4Binding.contract";

function displayValue(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function createRow(id, label, value, fallback = "") {
  return {
    id,
    label,
    value: displayValue(value, fallback),
  };
}

function buildSections(room = {}) {
  return [
    {
      id: "world-state",
      iconKey: "world",
      title: "World State",
      rows: [
        createRow("location", "Location", room?.location, "Unknown"),
        createRow("time", "Time", room?.timeLabel, "Unknown"),
        createRow("weather", "Weather", room?.weather, "Unknown"),
      ],
    },
  ];
}

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

function buildShareUrl(result) {
  const token = String(result?.token || "").trim();
  if (!token || typeof window === "undefined") return "";
  return `${window.location.origin}/share/chat/${encodeURIComponent(token)}`;
}

export function useStoryRoomStatePanelViewModel({
  room,
  roomId = "",
  messages = [],
  onExportTranscript,
  onCreateTemporaryShare,
  onRevokeTemporaryShare,
  onCreatePersistentShare,
  onRevokePersistentShare,
  onClose,
} = {}) {
  const messageOptions = useMemo(
    () => buildStorySessionVisibleMessageOptions(messages),
    [messages]
  );
  const defaultRange = useMemo(
    () => getStorySessionDefaultRangeBoundaries(messageOptions),
    [messageOptions]
  );

  const [exportOpen, setExportOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState(
    STORY_SHARE_EXPORT_DEFAULT_PRESET
  );
  const [exportFormat, setExportFormat] = useState(
    STORY_SHARE_EXPORT_DEFAULT_FORMAT
  );
  const [exportStartMessageId, setExportStartMessageId] = useState("");
  const [exportEndMessageId, setExportEndMessageId] = useState("");
  const [exportPending, setExportPending] = useState(false);
  const [exportError, setExportError] = useState("");

  const [shareOpen, setShareOpen] = useState(false);
  const [shareMode, setShareMode] = useState(STORY_SHARE_DEFAULT_MODE);
  const [sharePreset, setSharePreset] = useState(
    STORY_SHARE_EXPORT_DEFAULT_PRESET
  );
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
    if (exportPending || typeof onExportTranscript !== "function") return;

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
      await onExportTranscript(intent.payload);
      setExportOpen(false);
    } catch (error) {
      setExportError(error?.message || "Transcript could not be exported.");
    } finally {
      setExportPending(false);
    }
  }, [
    exportEndMessageId,
    exportFormat,
    exportPending,
    exportPreset,
    exportStartMessageId,
    onExportTranscript,
  ]);

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

    const createShare =
      shareMode === "PERSISTENT_REVIEWED"
        ? onCreatePersistentShare
        : onCreateTemporaryShare;

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
  }, [
    onCreatePersistentShare,
    onCreateTemporaryShare,
    shareEndMessageId,
    shareMode,
    sharePending,
    sharePreset,
    shareStartMessageId,
  ]);

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

    const effectiveMode = String(
      shareRawResult?.shareMode || shareMode
    ).toUpperCase();
    const revokeShare =
      effectiveMode === "PERSISTENT_REVIEWED"
        ? onRevokePersistentShare
        : onRevokeTemporaryShare;

    if (typeof revokeShare !== "function") return;

    setSharePending(true);
    setShareError("");

    try {
      await revokeShare(shareId);
      setShareRawResult((current) =>
        current ? { ...current, status: "REVOKED" } : current
      );
      setRevokeConfirmOpen(false);
    } catch (error) {
      setShareError(error?.message || "Share link could not be revoked.");
    } finally {
      setSharePending(false);
    }
  }, [
    onRevokePersistentShare,
    onRevokeTemporaryShare,
    shareMode,
    sharePending,
    shareRawResult,
  ]);

  const actionProjection = useMemo(
    () =>
      projectStorySessionShareExportActions({
        roomId,
        messages,
        canExport: typeof onExportTranscript === "function",
        canCreateTemporaryShare: typeof onCreateTemporaryShare === "function",
      }),
    [messages, onCreateTemporaryShare, onExportTranscript, roomId]
  );

  const actions = useMemo(
    () => [
      {
        id: actionProjection.export.id,
        iconKey: "download",
        label: actionProjection.export.label,
        disabled: !actionProjection.export.enabled,
        onPress: actionProjection.export.enabled ? openExport : null,
      },
      {
        id: actionProjection.share.id,
        iconKey: "share",
        label: actionProjection.share.label,
        disabled: !actionProjection.share.enabled,
        onPress: actionProjection.share.enabled ? openShare : null,
      },
    ],
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

  return {
    eyebrow: "Chronicle State",
    title: "Story Data",
    sections: buildSections(room),
    actions,
    showCloseControl: typeof onClose === "function",
    onClosePanel: typeof onClose === "function" ? onClose : null,
    sessionDialogs: {
      activeDialog: exportOpen ? exportDialog : shareOpen ? shareDialog : null,
      summaryPending: {
        visible: false,
        eyebrow: "Scene Recap",
        message: "Crestfall Engine is preparing the current scene recap...",
      },
    },
  };
}
