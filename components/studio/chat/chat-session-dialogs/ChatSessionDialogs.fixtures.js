import {
  CHAT_EXPORT_FORMAT_OPTIONS,
  CHAT_EXPORT_RANGE_PRESETS,
  CHAT_REPORT_REASON_OPTIONS,
  CHAT_SESSION_DELETE_STORY_CONFIRMATION,
} from "./ChatSessionDialogs.contract";

function noop() {}

const MESSAGE_OPTIONS = [
  { id: "msg-101", label: "Turn 1 · Kestrel: \"The gate is sealed.\"" },
  { id: "msg-104", label: "Turn 2 · Vale: \"Then we go around.\"" },
  { id: "msg-108", label: "Turn 3 · Kestrel: \"There is no around.\"" },
];

const LONGEST_MESSAGE_OPTIONS = [
  {
    id: "msg-201",
    label:
      "Turn 128 · The Unreasonably Long Chronicle of the Lantern Keepers Beneath the Western Observatory, Negotiation at the threshold",
  },
  {
    id: "msg-214",
    label: "Turn 129 · Resolve the disputed passage without exposing the hidden registry participant",
  },
];

const REPORT_BASE = {
  kind: "REPORT",
  open: true,
  speaker: "Kestrel",
  reasonOptions: CHAT_REPORT_REASON_OPTIONS,
  reasonCode: "OUT_OF_CHARACTER",
  comment: "",
  pending: false,
  error: "",
  onReasonCodeChange: noop,
  onCommentChange: noop,
  onSubmit: noop,
  onClose: noop,
};

const EXPORT_BASE = {
  kind: "EXPORT",
  open: true,
  presets: CHAT_EXPORT_RANGE_PRESETS,
  preset: "RECENT_50",
  formats: CHAT_EXPORT_FORMAT_OPTIONS,
  format: "TXT",
  customRange: false,
  messageOptions: MESSAGE_OPTIONS,
  startMessageId: MESSAGE_OPTIONS[0].id,
  endMessageId: MESSAGE_OPTIONS[MESSAGE_OPTIONS.length - 1].id,
  pending: false,
  error: "",
  onPresetChange: noop,
  onFormatChange: noop,
  onStartMessageChange: noop,
  onEndMessageChange: noop,
  onSubmit: noop,
  onClose: noop,
};

const SHARE_BASE = {
  kind: "SHARE",
  open: true,
  mode: "TEMPORARY",
  presets: CHAT_EXPORT_RANGE_PRESETS,
  preset: "RECENT_50",
  customRange: false,
  messageOptions: MESSAGE_OPTIONS,
  startMessageId: MESSAGE_OPTIONS[0].id,
  endMessageId: MESSAGE_OPTIONS[MESSAGE_OPTIONS.length - 1].id,
  result: null,
  copied: false,
  pending: false,
  error: "",
  revokeConfirmOpen: false,
  onModeChange: noop,
  onPresetChange: noop,
  onStartMessageChange: noop,
  onEndMessageChange: noop,
  onSubmit: noop,
  onCopy: noop,
  onRequestRevoke: noop,
  onConfirmRevoke: noop,
  onCancelRevoke: noop,
  onClose: noop,
};

const DELETE_CONFIRM_BASE = {
  kind: "DELETE_CONFIRM",
  open: true,
  message: CHAT_SESSION_DELETE_STORY_CONFIRMATION,
  pending: false,
  error: "",
  onConfirm: noop,
  onCancel: noop,
};

const NO_SUMMARY_PENDING = { visible: false, eyebrow: "Scene Recap", message: "" };

function withDialog(activeDialog, summaryPending = NO_SUMMARY_PENDING) {
  return { activeDialog, summaryPending };
}

// Report
export const chatReportRestFixture = withDialog(REPORT_BASE);

export const chatReportNearLimitFixture = withDialog({
  ...REPORT_BASE,
  comment: "A".repeat(1650),
});

export const chatReportAtLimitFixture = withDialog({
  ...REPORT_BASE,
  reasonCode: "INAPPROPRIATE_CONTENT",
  comment: "A".repeat(2000),
});

export const chatReportPendingFixture = withDialog({
  ...REPORT_BASE,
  reasonCode: "LOW_QUALITY",
  comment: "This reply contradicted the established timeline from two scenes earlier.",
  pending: true,
});

export const chatReportErrorFixture = withDialog({
  ...REPORT_BASE,
  reasonCode: "OTHER",
  comment: "Repeated network failure while submitting.",
  error: "The report could not be submitted. Try again.",
});

export const chatReportLongestFixture = withDialog({
  ...REPORT_BASE,
  speaker: "The Unnamed Keeper of the Western Observatory Archive",
  reasonCode: "CONTINUITY_ERROR",
  comment:
    "This is the longest content case for the report comment field, filled to the full two thousand character ceiling to verify the textarea, the counter, and the at-limit danger state all hold their layout at 390 and 1440 without overflow. ".repeat(
      8
    ).slice(0, 2000),
});

// Export
export const chatExportRestFixture = withDialog(EXPORT_BASE);

export const chatExportCustomRangeFixture = withDialog({
  ...EXPORT_BASE,
  preset: "CUSTOM",
  customRange: true,
});

export const chatExportMarkdownFixture = withDialog({
  ...EXPORT_BASE,
  preset: "CURRENT_SCENE",
  format: "MARKDOWN",
});

export const chatExportPendingFixture = withDialog({
  ...EXPORT_BASE,
  preset: "CURRENT_BEAT",
  pending: true,
});

export const chatExportErrorFixture = withDialog({
  ...EXPORT_BASE,
  error: "The export could not be prepared. Try again.",
});

export const chatExportLongestFixture = withDialog({
  ...EXPORT_BASE,
  preset: "CUSTOM",
  customRange: true,
  messageOptions: LONGEST_MESSAGE_OPTIONS,
  startMessageId: LONGEST_MESSAGE_OPTIONS[0].id,
  endMessageId: LONGEST_MESSAGE_OPTIONS[1].id,
});

// Share
export const chatShareTemporaryFormFixture = withDialog(SHARE_BASE);

export const chatSharePersistentFormFixture = withDialog({
  ...SHARE_BASE,
  mode: "PERSISTENT_REVIEWED",
  preset: "CUSTOM",
  customRange: true,
});

export const chatShareActiveTemporaryFixture = withDialog({
  ...SHARE_BASE,
  result: {
    status: "ACTIVE",
    shareUrl: "https://crestfall.app/share/chat/9f1c2a7b",
    shareMode: "TEMPORARY",
    expiresAt: "1 hour from now",
  },
});

export const chatShareActiveTemporaryCopiedFixture = withDialog({
  ...SHARE_BASE,
  copied: true,
  result: {
    status: "ACTIVE",
    shareUrl: "https://crestfall.app/share/chat/9f1c2a7b",
    shareMode: "TEMPORARY",
    expiresAt: "1 hour from now",
  },
});

export const chatShareActivePersistentFixture = withDialog({
  ...SHARE_BASE,
  mode: "PERSISTENT_REVIEWED",
  result: {
    status: "ACTIVE",
    shareUrl: "https://crestfall.app/share/chat/7a3e0d51",
    shareMode: "PERSISTENT_REVIEWED",
    expiresAt: "",
  },
});

export const chatShareRejectedFixture = withDialog({
  ...SHARE_BASE,
  mode: "PERSISTENT_REVIEWED",
  result: { status: "REJECTED", shareUrl: "", shareMode: "PERSISTENT_REVIEWED", expiresAt: "" },
});

export const chatShareFailedFixture = withDialog({
  ...SHARE_BASE,
  mode: "PERSISTENT_REVIEWED",
  result: { status: "FAILED", shareUrl: "", shareMode: "PERSISTENT_REVIEWED", expiresAt: "" },
});

export const chatShareRevokedFixture = withDialog({
  ...SHARE_BASE,
  result: { status: "REVOKED", shareUrl: "", shareMode: "TEMPORARY", expiresAt: "" },
});

export const chatShareRevokeConfirmFixture = withDialog({
  ...SHARE_BASE,
  revokeConfirmOpen: true,
  result: {
    status: "ACTIVE",
    shareUrl: "https://crestfall.app/share/chat/9f1c2a7b",
    shareMode: "TEMPORARY",
    expiresAt: "1 hour from now",
  },
});

export const chatSharePendingFixture = withDialog({
  ...SHARE_BASE,
  pending: true,
});

export const chatShareErrorFixture = withDialog({
  ...SHARE_BASE,
  error: "The share link could not be created. Try again.",
});

export const chatShareLongestFixture = withDialog({
  ...SHARE_BASE,
  mode: "PERSISTENT_REVIEWED",
  result: {
    status: "ACTIVE",
    shareUrl:
      "https://crestfall.app/share/chat/9f1c2a7b4e6d0f3a8c1b5e2d7f4a9c6b1e8d3f0a5c2b7e4d1f8a3c6b9e0d5f2a",
    shareMode: "PERSISTENT_REVIEWED",
    expiresAt: "",
  },
});

// Delete confirm
export const chatDeleteConfirmRestFixture = withDialog(DELETE_CONFIRM_BASE);

export const chatDeleteConfirmPendingFixture = withDialog({
  ...DELETE_CONFIRM_BASE,
  pending: true,
});

export const chatDeleteConfirmErrorFixture = withDialog({
  ...DELETE_CONFIRM_BASE,
  error: "The Story could not be deleted. Try again.",
});

// Summary pending, and no dialog open at all
export const chatSessionDialogsNoneOpenFixture = withDialog(null);

export const chatSessionDialogsSummaryPendingFixture = withDialog(null, {
  visible: true,
  eyebrow: "Scene Recap",
  message: "Crestfall Engine is preparing the current scene recap",
});

export const chatSessionDialogsFixtures = [
  { id: "report-rest", label: "Report, rest", props: chatReportRestFixture },
  { id: "report-near-limit", label: "Report, near limit (counter shown)", props: chatReportNearLimitFixture },
  { id: "report-at-limit", label: "Report, at limit (danger)", props: chatReportAtLimitFixture },
  { id: "report-pending", label: "Report, pending", props: chatReportPendingFixture },
  { id: "report-error", label: "Report, error", props: chatReportErrorFixture },
  { id: "report-longest", label: "Report, longest content", props: chatReportLongestFixture },

  { id: "export-rest", label: "Export, rest (Recent 50 / TXT)", props: chatExportRestFixture },
  { id: "export-custom-range", label: "Export, custom range", props: chatExportCustomRangeFixture },
  { id: "export-markdown", label: "Export, Markdown format", props: chatExportMarkdownFixture },
  { id: "export-pending", label: "Export, pending", props: chatExportPendingFixture },
  { id: "export-error", label: "Export, error", props: chatExportErrorFixture },
  { id: "export-longest", label: "Export, longest content", props: chatExportLongestFixture },

  { id: "share-temporary-form", label: "Share, temporary form", props: chatShareTemporaryFormFixture },
  { id: "share-persistent-form", label: "Share, persistent form (custom range)", props: chatSharePersistentFormFixture },
  { id: "share-active-temporary", label: "Share, ACTIVE (temporary)", props: chatShareActiveTemporaryFixture },
  { id: "share-active-temporary-copied", label: "Share, ACTIVE, copied", props: chatShareActiveTemporaryCopiedFixture },
  { id: "share-active-persistent", label: "Share, ACTIVE (persistent)", props: chatShareActivePersistentFixture },
  { id: "share-rejected", label: "Share, REJECTED", props: chatShareRejectedFixture },
  { id: "share-failed", label: "Share, FAILED", props: chatShareFailedFixture },
  { id: "share-revoked", label: "Share, REVOKED", props: chatShareRevokedFixture },
  { id: "share-revoke-confirm", label: "Share, revoke confirm step", props: chatShareRevokeConfirmFixture },
  { id: "share-pending", label: "Share, pending", props: chatSharePendingFixture },
  { id: "share-error", label: "Share, error", props: chatShareErrorFixture },
  { id: "share-longest", label: "Share, longest content", props: chatShareLongestFixture },

  { id: "delete-confirm-rest", label: "Delete Story, rest", props: chatDeleteConfirmRestFixture },
  { id: "delete-confirm-pending", label: "Delete Story, pending", props: chatDeleteConfirmPendingFixture },
  { id: "delete-confirm-error", label: "Delete Story, error", props: chatDeleteConfirmErrorFixture },

  { id: "none-open", label: "No dialog open", props: chatSessionDialogsNoneOpenFixture },
  { id: "summary-pending", label: "Summary pending composition", props: chatSessionDialogsSummaryPendingFixture },
];
