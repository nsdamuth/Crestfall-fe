import {
  CHAT_EXPORT_FORMAT_OPTIONS,
  CHAT_EXPORT_RANGE_PRESETS,
  CHAT_SESSION_DIALOG_KINDS,
  CHAT_SHARE_LINK_STATES,
  CHAT_SHARE_MODES,
} from "../../chat/chat-session-dialogs/ChatSessionDialogs.contract.js";

export const STORY_SHARE_EXPORT_C4_BINDING_CONTRACT_VERSION =
  "story_share_export_c4_binding_v1";

export const STORY_SHARE_EXPORT_DEFAULT_PRESET = "RECENT_50";
export const STORY_SHARE_EXPORT_DEFAULT_FORMAT = "TXT";
export const STORY_SHARE_DEFAULT_MODE = "TEMPORARY";

export const STORY_SHARE_EXPORT_CALLBACK_KEYS = Object.freeze([
  "onExportPresetChange",
  "onExportFormatChange",
  "onExportStartMessageChange",
  "onExportEndMessageChange",
  "onExportSubmit",
  "onExportClose",
  "onShareModeChange",
  "onSharePresetChange",
  "onShareStartMessageChange",
  "onShareEndMessageChange",
  "onShareSubmit",
  "onShareCopy",
  "onShareRequestRevoke",
  "onShareConfirmRevoke",
  "onShareCancelRevoke",
  "onShareClose",
]);

const RANGE_PRESET_IDS = new Set(
  CHAT_EXPORT_RANGE_PRESETS.map((preset) => preset.id)
);
const EXPORT_FORMAT_IDS = new Set(
  CHAT_EXPORT_FORMAT_OPTIONS.map((format) => format.id)
);
const SHARE_MODE_IDS = new Set(Object.values(CHAT_SHARE_MODES));
const SHARE_LINK_STATE_IDS = new Set(
  Object.values(CHAT_SHARE_LINK_STATES)
);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePreset(value) {
  const normalized = text(value).toUpperCase();
  return RANGE_PRESET_IDS.has(normalized)
    ? normalized
    : STORY_SHARE_EXPORT_DEFAULT_PRESET;
}

function normalizeFormat(value) {
  const normalized = text(value).toUpperCase();
  return EXPORT_FORMAT_IDS.has(normalized)
    ? normalized
    : STORY_SHARE_EXPORT_DEFAULT_FORMAT;
}

function normalizeShareMode(value) {
  const normalized = text(value).toUpperCase();
  return SHARE_MODE_IDS.has(normalized)
    ? normalized
    : STORY_SHARE_DEFAULT_MODE;
}

function normalizeShareStatus(value) {
  const normalized = text(value).toUpperCase();
  return SHARE_LINK_STATE_IDS.has(normalized)
    ? normalized
    : "FAILED";
}

export function buildStorySessionVisibleMessageOptions(messages = []) {
  return array(messages)
    .filter((message) => {
      const body = text(message?.body);
      const type = text(message?.type).toLowerCase();

      return Boolean(body) && type !== "system";
    })
    .map((message, index) => {
      const body = text(message.body)
        .replace(/\s+/g, " ")
        .trim();
      const preview =
        body.length > 72
          ? `${body.slice(0, 72)}…`
          : body;

      return {
        id: String(message.id),
        label:
          `${index + 1}. ${text(message.speaker) || "Story"} — ${preview}`,
      };
    });
}

export function getStorySessionDefaultRangeBoundaries(
  messageOptions = []
) {
  const options = array(messageOptions);

  return {
    startMessageId: text(options[0]?.id),
    endMessageId: text(options.at(-1)?.id),
  };
}

export function validateStorySessionRangeSelection({
  preset = STORY_SHARE_EXPORT_DEFAULT_PRESET,
  startMessageId = "",
  endMessageId = "",
} = {}) {
  const normalizedPreset = normalizePreset(preset);
  const customRange = normalizedPreset === "CUSTOM";

  if (
    customRange &&
    (!text(startMessageId) || !text(endMessageId))
  ) {
    return {
      valid: false,
      preset: normalizedPreset,
      customRange,
      error:
        "Choose both a start message and an end message.",
    };
  }

  return {
    valid: true,
    preset: normalizedPreset,
    customRange,
    error: "",
  };
}

export function buildStorySessionExportIntent({
  preset = STORY_SHARE_EXPORT_DEFAULT_PRESET,
  format = STORY_SHARE_EXPORT_DEFAULT_FORMAT,
  startMessageId = "",
  endMessageId = "",
} = {}) {
  const range = validateStorySessionRangeSelection({
    preset,
    startMessageId,
    endMessageId,
  });

  if (!range.valid) {
    return {
      valid: false,
      error: range.error,
      payload: null,
    };
  }

  return {
    valid: true,
    error: "",
    payload: {
      preset: range.preset,
      startMessageId:
        range.customRange ? text(startMessageId) : null,
      endMessageId:
        range.customRange ? text(endMessageId) : null,
      format: normalizeFormat(format),
    },
  };
}

export function buildStorySessionShareIntent({
  mode = STORY_SHARE_DEFAULT_MODE,
  preset = STORY_SHARE_EXPORT_DEFAULT_PRESET,
  startMessageId = "",
  endMessageId = "",
} = {}) {
  const range = validateStorySessionRangeSelection({
    preset,
    startMessageId,
    endMessageId,
  });

  if (!range.valid) {
    return {
      valid: false,
      error: range.error,
      payload: null,
    };
  }

  return {
    valid: true,
    error: "",
    payload: {
      mode: normalizeShareMode(mode),
      preset: range.preset,
      startMessageId:
        range.customRange ? text(startMessageId) : null,
      endMessageId:
        range.customRange ? text(endMessageId) : null,
    },
  };
}

export function projectStorySessionShareResult({
  result = null,
  requestedMode = STORY_SHARE_DEFAULT_MODE,
  shareUrl = "",
} = {}) {
  if (!result) return null;

  const source = object(result);
  const shareMode = normalizeShareMode(
    source.shareMode || requestedMode
  );
  const status = normalizeShareStatus(source.status);
  const active = status === "ACTIVE";

  return {
    status,
    shareUrl: active ? text(shareUrl || source.shareUrl) : "",
    shareMode,
    expiresAt:
      active && shareMode === "TEMPORARY"
        ? text(source.expiresAt)
        : "",
  };
}

export function projectStorySessionExportDialog({
  open = false,
  preset = STORY_SHARE_EXPORT_DEFAULT_PRESET,
  format = STORY_SHARE_EXPORT_DEFAULT_FORMAT,
  startMessageId = "",
  endMessageId = "",
  messages = [],
  pending = false,
  error = "",
  callbacks = {},
} = {}) {
  const messageOptions =
    buildStorySessionVisibleMessageOptions(messages);
  const normalizedPreset = normalizePreset(preset);
  const callbackSource = object(callbacks);

  return {
    kind: CHAT_SESSION_DIALOG_KINDS.EXPORT,
    open: Boolean(open),
    presets: CHAT_EXPORT_RANGE_PRESETS.map((presetOption) => ({
      ...presetOption,
    })),
    preset: normalizedPreset,
    formats: CHAT_EXPORT_FORMAT_OPTIONS.map((formatOption) => ({
      ...formatOption,
    })),
    format: normalizeFormat(format),
    customRange: normalizedPreset === "CUSTOM",
    messageOptions,
    startMessageId: text(startMessageId),
    endMessageId: text(endMessageId),
    pending: Boolean(pending),
    error: text(error),
    onPresetChange:
      callbackSource.onExportPresetChange || null,
    onFormatChange:
      callbackSource.onExportFormatChange || null,
    onStartMessageChange:
      callbackSource.onExportStartMessageChange || null,
    onEndMessageChange:
      callbackSource.onExportEndMessageChange || null,
    onSubmit:
      callbackSource.onExportSubmit || null,
    onClose:
      callbackSource.onExportClose || null,
  };
}

export function projectStorySessionShareDialog({
  open = false,
  mode = STORY_SHARE_DEFAULT_MODE,
  preset = STORY_SHARE_EXPORT_DEFAULT_PRESET,
  startMessageId = "",
  endMessageId = "",
  messages = [],
  result = null,
  shareUrl = "",
  copied = false,
  pending = false,
  error = "",
  revokeConfirmOpen = false,
  callbacks = {},
} = {}) {
  const messageOptions =
    buildStorySessionVisibleMessageOptions(messages);
  const normalizedMode = normalizeShareMode(mode);
  const normalizedPreset = normalizePreset(preset);
  const callbackSource = object(callbacks);

  return {
    kind: CHAT_SESSION_DIALOG_KINDS.SHARE,
    open: Boolean(open),
    mode: normalizedMode,
    presets: CHAT_EXPORT_RANGE_PRESETS.map((presetOption) => ({
      ...presetOption,
    })),
    preset: normalizedPreset,
    customRange: normalizedPreset === "CUSTOM",
    messageOptions,
    startMessageId: text(startMessageId),
    endMessageId: text(endMessageId),
    result: projectStorySessionShareResult({
      result,
      requestedMode: normalizedMode,
      shareUrl,
    }),
    copied: Boolean(copied),
    pending: Boolean(pending),
    error: text(error),
    revokeConfirmOpen: Boolean(revokeConfirmOpen),
    onModeChange:
      callbackSource.onShareModeChange || null,
    onPresetChange:
      callbackSource.onSharePresetChange || null,
    onStartMessageChange:
      callbackSource.onShareStartMessageChange || null,
    onEndMessageChange:
      callbackSource.onShareEndMessageChange || null,
    onSubmit:
      callbackSource.onShareSubmit || null,
    onCopy:
      callbackSource.onShareCopy || null,
    onRequestRevoke:
      callbackSource.onShareRequestRevoke || null,
    onConfirmRevoke:
      callbackSource.onShareConfirmRevoke || null,
    onCancelRevoke:
      callbackSource.onShareCancelRevoke || null,
    onClose:
      callbackSource.onShareClose || null,
  };
}

export function projectStorySessionShareExportActions({
  roomId = "",
  messages = [],
  canExport = false,
  canCreateTemporaryShare = false,
} = {}) {
  const messageOptions =
    buildStorySessionVisibleMessageOptions(messages);
  const hasRoom = Boolean(text(roomId));
  const hasMessages = messageOptions.length > 0;

  return {
    export: {
      id: "export-chat",
      label: "Export Chat",
      enabled:
        hasRoom &&
        hasMessages &&
        Boolean(canExport),
    },
    share: {
      id: "share-snapshot",
      label: "Share Snapshot",
      enabled:
        hasRoom &&
        hasMessages &&
        Boolean(canCreateTemporaryShare),
    },
    messageOptions,
    defaultRange:
      getStorySessionDefaultRangeBoundaries(messageOptions),
  };
}
