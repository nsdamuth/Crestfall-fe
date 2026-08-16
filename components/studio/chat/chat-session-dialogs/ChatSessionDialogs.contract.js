export const CHAT_SESSION_DIALOGS_VIEW_CONTRACT_VERSION = "1.0.0";

export const CHAT_SESSION_DIALOG_KINDS = Object.freeze({
  REPORT: "REPORT",
  EXPORT: "EXPORT",
  SHARE: "SHARE",
  DELETE_CONFIRM: "DELETE_CONFIRM",
});

export const CHAT_REPORT_REASON_OPTIONS = Object.freeze([
  { value: "OUT_OF_CHARACTER", label: "Out of character" },
  { value: "CONTINUITY_ERROR", label: "Continuity error" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "LOW_QUALITY", label: "Low quality or incoherent" },
  { value: "OTHER", label: "Other" },
]);

export const CHAT_REPORT_COMMENT_MAX_LENGTH = 2000;

export const CHAT_EXPORT_RANGE_PRESETS = Object.freeze([
  { id: "CURRENT_BEAT", label: "Current beat" },
  { id: "CURRENT_SCENE", label: "Current scene" },
  { id: "RECENT_25", label: "Most recent 25 messages" },
  { id: "RECENT_50", label: "Most recent 50 messages" },
  { id: "CUSTOM", label: "Custom start / stop" },
]);

export const CHAT_EXPORT_FORMAT_OPTIONS = Object.freeze([
  { id: "TXT", label: "Plain text (.txt)" },
  { id: "MARKDOWN", label: "Markdown (.md)" },
]);

export const CHAT_SHARE_MODES = Object.freeze({
  TEMPORARY: "TEMPORARY",
  PERSISTENT_REVIEWED: "PERSISTENT_REVIEWED",
});

export const CHAT_SHARE_LINK_STATES = Object.freeze({
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  FAILED: "FAILED",
  REVOKED: "REVOKED",
});

// Ported unchanged from the crestfall-main baseline
// (StoryRoomCastPanel's CHAT_CAST_PANEL_DELETE_CONFIRMATION source
// text, useStoryRoomChatShellViewModel.js). This package carries its
// own copy of the same baseline string because wave C3's
// chat-cast-panel already ships its own inline confirm sheet wired to
// its own Delete Story trigger; this package's Delete Story dialog is
// the portable, standalone version of the same confirm step for
// callers that do not compose the cast panel (the FABLE-GATE-PLAN.md
// wave C4 file list names delete-confirm explicitly as part of this
// package). Both strings must stay identical; a change to one is a
// change to the other.
export const CHAT_SESSION_DELETE_STORY_CONFIRMATION = [
  "Delete this Story?",
  "",
  "This permanently deletes this chat session and all messages.",
  "Underlying characters, templates, scenarios, narrators, and locations are not deleted.",
  "Interaction totals will remain.",
  "",
  "This cannot be undone.",
].join("\n");

/**
 * Portable View contract, wave C4 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline's four
 * session dialogs (message report, transcript export, share
 * snapshot, delete story) plus a portable summary-pending
 * composition. Composed entirely on KitModalFrame (R4 full-screen at
 * 390, R7 sheet close header where the sheet variant is used); the
 * View never knows the Story snapshot shape, engine APIs, Llama Guard
 * review process, or persistence. Every consequential action carries
 * a confirmation step; the destructive law applies to Delete Story
 * and to Share's Revoke action (quiet trigger, filled danger only
 * inside the confirming button, never `window.confirm`).
 *
 * @typedef {Object} ChatReportDialogProps
 * @property {"REPORT"} kind
 * @property {boolean} open
 * @property {string} speaker Display name of the reported message's speaker.
 * @property {{value:string,label:string}[]} reasonOptions The five ruled reason codes.
 * @property {string} reasonCode
 * @property {string} comment Up to CHAT_REPORT_COMMENT_MAX_LENGTH (2000) characters.
 * @property {boolean} pending
 * @property {string} error
 * @property {((code: string) => void)|null} onReasonCodeChange
 * @property {((comment: string) => void)|null} onCommentChange
 * @property {(() => void)|null} onSubmit
 * @property {(() => void)|null} onClose
 *
 * @typedef {Object} ChatExportDialogProps
 * @property {"EXPORT"} kind
 * @property {boolean} open
 * @property {{id:string,label:string}[]} presets The five range presets (beat, scene, recent 25, recent 50, custom).
 * @property {string} preset
 * @property {{id:string,label:string}[]} formats TXT and MARKDOWN.
 * @property {string} format
 * @property {boolean} customRange True when preset === "CUSTOM"; reveals the start/end selects.
 * @property {{id:string,label:string}[]} messageOptions Boundary choices for custom start/end.
 * @property {string} startMessageId
 * @property {string} endMessageId
 * @property {boolean} pending
 * @property {string} error
 * @property {((preset: string) => void)|null} onPresetChange
 * @property {((format: string) => void)|null} onFormatChange
 * @property {((messageId: string) => void)|null} onStartMessageChange
 * @property {((messageId: string) => void)|null} onEndMessageChange
 * @property {(() => void)|null} onSubmit Triggers the blob download.
 * @property {(() => void)|null} onClose
 *
 * @typedef {Object} ChatShareResult
 * @property {"ACTIVE"|"REJECTED"|"FAILED"|"REVOKED"} status
 * @property {string} shareUrl Present when status is ACTIVE.
 * @property {"TEMPORARY"|"PERSISTENT_REVIEWED"} shareMode
 * @property {string} expiresAt Present when shareMode is TEMPORARY and status is ACTIVE.
 *
 * @typedef {Object} ChatShareDialogProps
 * @property {"SHARE"} kind
 * @property {boolean} open
 * @property {"TEMPORARY"|"PERSISTENT_REVIEWED"} mode
 * @property {{id:string,label:string}[]} presets Same five range presets as export.
 * @property {string} preset
 * @property {boolean} customRange
 * @property {{id:string,label:string}[]} messageOptions
 * @property {string} startMessageId
 * @property {string} endMessageId
 * @property {ChatShareResult|null} result Null before a link is created.
 * @property {boolean} copied
 * @property {boolean} pending
 * @property {string} error
 * @property {boolean} revokeConfirmOpen Destructive law: Revoke opens this confirm step before firing onRevoke.
 * @property {((mode: string) => void)|null} onModeChange
 * @property {((preset: string) => void)|null} onPresetChange
 * @property {((messageId: string) => void)|null} onStartMessageChange
 * @property {((messageId: string) => void)|null} onEndMessageChange
 * @property {(() => void)|null} onSubmit Creates the link.
 * @property {(() => void)|null} onCopy
 * @property {(() => void)|null} onRequestRevoke Opens the revoke confirm step.
 * @property {(() => void)|null} onConfirmRevoke Fires the actual revoke.
 * @property {(() => void)|null} onCancelRevoke
 * @property {(() => void)|null} onClose
 *
 * @typedef {Object} ChatDeleteConfirmDialogProps
 * @property {"DELETE_CONFIRM"} kind
 * @property {boolean} open
 * @property {string} message Baseline copy, CHAT_SESSION_DELETE_STORY_CONFIRMATION.
 * @property {boolean} pending
 * @property {string} error
 * @property {(() => void)|null} onConfirm
 * @property {(() => void)|null} onCancel
 *
 * @typedef {Object} ChatSummaryPendingProps
 * @property {boolean} visible
 * @property {string} eyebrow
 * @property {string} message
 *
 * @typedef {ChatReportDialogProps|ChatExportDialogProps|ChatShareDialogProps|ChatDeleteConfirmDialogProps} ChatSessionActiveDialog
 *
 * @typedef {Object} ChatSessionDialogsViewProps
 * @property {ChatSessionActiveDialog|null} activeDialog At most one dialog frame open at a time; null renders nothing but the summary-pending composition (if visible).
 * @property {ChatSummaryPendingProps} summaryPending Portable version of the live-region "preparing the current scene recap" card; chat-transcript (wave C1) renders its own inline copy of the same state, this is the composable primitive for callers that need it standalone (e.g. beside a Summarize entry point).
 */

export {};
