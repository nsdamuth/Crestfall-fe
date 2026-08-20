import { CHAT_SESSION_DIALOG_KINDS } from "../../chat/chat-session-dialogs/ChatSessionDialogs.contract.js";

export const STORY_ROOM_CHAT_C1_C6_BINDING_CONTRACT_VERSION =
  "story_room_chat_c1_c6_binding_v1";

function text(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function labelize(value) {
  const normalized = text(value);
  if (/^[A-Z0-9]{2,6}$/.test(normalized)) return normalized;
  return normalized
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function buildStoryRoomChatStatusPills(room = {}) {
  const rawRoom = room?.rawRoom && typeof room.rawRoom === "object"
    ? room.rawRoom
    : {};
  const rating = text(rawRoom.contentRating || rawRoom.content_rating);
  const visibility = text(rawRoom.visibility || rawRoom.roomVisibility || rawRoom.room_visibility);
  const turnCount = Number(room?.turnCount);
  const pills = [];

  if (rating) {
    pills.push({ id: "rating", label: labelize(rating), tone: "neutral" });
  }

  if (visibility) {
    pills.push({ id: "visibility", label: labelize(visibility), tone: "gold" });
  }

  if (Number.isFinite(turnCount)) {
    pills.push({ id: "turn", label: `Turn ${Math.max(0, Math.trunc(turnCount))}`, tone: "neutral" });
  }

  return pills;
}

export function buildStoryRoomChatStateActions({
  actionProjection = {},
  onOpenExport = null,
  onOpenShare = null,
} = {}) {
  const exportAction = actionProjection?.export || {};
  const shareAction = actionProjection?.share || {};

  return [
    {
      id: exportAction.id || "export-chat",
      iconKey: "download",
      label: exportAction.label || "Export Chat",
      disabled: !exportAction.enabled,
      onPress: exportAction.enabled ? onOpenExport : null,
    },
    {
      id: shareAction.id || "share-snapshot",
      iconKey: "share",
      label: shareAction.label || "Share Snapshot",
      disabled: !shareAction.enabled,
      onPress: shareAction.enabled ? onOpenShare : null,
    },
  ];
}

export function projectStoryRoomReportDialog(reportDialog = null) {
  if (!reportDialog?.open) return null;

  return {
    kind: CHAT_SESSION_DIALOG_KINDS.REPORT,
    open: true,
    speaker: text(reportDialog.speaker) || "Message",
    reasonOptions: Array.isArray(reportDialog.reasonOptions)
      ? reportDialog.reasonOptions
      : [],
    reasonCode: text(reportDialog.reasonCode),
    comment: text(reportDialog.comment),
    pending: Boolean(reportDialog.pending),
    error: text(reportDialog.error),
    onReasonCodeChange: reportDialog.onReasonCodeChange || null,
    onCommentChange: reportDialog.onCommentChange || null,
    onSubmit: reportDialog.onSubmit || null,
    onClose: reportDialog.onClose || reportDialog.onCancel || null,
  };
}
