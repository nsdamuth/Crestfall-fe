export const storyShareExportMessagesFixture = Object.freeze([
  {
    id: "m1",
    type: "assistant",
    speaker: "Mira Quill",
    body:
      "The bronze seal ticks softly on the counter while Mira watches the doorway.",
  },
  {
    id: "m2",
    type: "system",
    speaker: "System",
    body: "Hidden system bookkeeping should not become a custom-range boundary.",
  },
  {
    id: "m3",
    type: "user",
    speaker: "You",
    body:
      "I ask whether the seal arrived with the crate and whether anyone else handled it.",
  },
  {
    id: "m4",
    type: "assistant",
    speaker: "Kessa Cindervell",
    body:
      "Kessa leans closer, careful not to touch the seal, and says the second tick was warmer than the first.",
  },
  {
    id: "m5",
    type: "assistant",
    speaker: "Story",
    body: "",
  },
]);

export const storyExportRecent50Fixture = Object.freeze({
  open: true,
  preset: "RECENT_50",
  format: "TXT",
  startMessageId: "m1",
  endMessageId: "m4",
  messages: storyShareExportMessagesFixture,
  pending: false,
  error: "",
});

export const storyExportCustomMarkdownFixture = Object.freeze({
  open: true,
  preset: "CUSTOM",
  format: "MARKDOWN",
  startMessageId: "m1",
  endMessageId: "m4",
  messages: storyShareExportMessagesFixture,
  pending: false,
  error: "",
});

export const storyExportIncompleteCustomFixture = Object.freeze({
  open: true,
  preset: "CUSTOM",
  format: "TXT",
  startMessageId: "",
  endMessageId: "m4",
  messages: storyShareExportMessagesFixture,
});

export const storyShareTemporaryActiveFixture = Object.freeze({
  open: true,
  mode: "TEMPORARY",
  preset: "RECENT_50",
  startMessageId: "m1",
  endMessageId: "m4",
  messages: storyShareExportMessagesFixture,
  result: {
    version: "chat_temporary_share_result_v1",
    shareId: "temporary-share-1",
    token: "temporary-token",
    status: "ACTIVE",
    expiresAt: "2026-08-18T05:00:00.000Z",
    messageCount: 4,
  },
  shareUrl:
    "https://crestfall-studio.com/share/chat/temporary-token",
  copied: false,
  pending: false,
  error: "",
  revokeConfirmOpen: false,
});

export const storySharePersistentActiveFixture = Object.freeze({
  open: true,
  mode: "PERSISTENT_REVIEWED",
  preset: "CURRENT_SCENE",
  startMessageId: "m1",
  endMessageId: "m4",
  messages: storyShareExportMessagesFixture,
  result: {
    version: "chat_persistent_share_result_v1",
    shareId: "persistent-share-1",
    token: "persistent-token",
    status: "ACTIVE",
    shareMode: "PERSISTENT_REVIEWED",
    reviewDecision: "ALLOW",
    messageCount: 4,
  },
  shareUrl:
    "https://crestfall-studio.com/share/chat/persistent-token",
});

export const storySharePersistentRejectedFixture = Object.freeze({
  ...storySharePersistentActiveFixture,
  result: {
    version: "chat_persistent_share_result_v1",
    shareId: "persistent-share-2",
    token: null,
    status: "REJECTED",
    shareMode: "PERSISTENT_REVIEWED",
    reviewDecision: "BLOCK",
    messageCount: 4,
  },
  shareUrl: "",
});

export const storySharePersistentFailedFixture = Object.freeze({
  ...storySharePersistentActiveFixture,
  result: {
    version: "chat_persistent_share_result_v1",
    shareId: "persistent-share-3",
    token: null,
    status: "FAILED",
    shareMode: "PERSISTENT_REVIEWED",
    reviewDecision: "UNKNOWN",
    messageCount: 4,
  },
  shareUrl: "",
});

export const storyShareRevokedFixture = Object.freeze({
  ...storyShareTemporaryActiveFixture,
  result: {
    ...storyShareTemporaryActiveFixture.result,
    status: "REVOKED",
  },
  revokeConfirmOpen: false,
});

export const storyShareRevokeConfirmFixture = Object.freeze({
  ...storyShareTemporaryActiveFixture,
  revokeConfirmOpen: true,
});

export const storyShareExportActionsFixture = Object.freeze({
  roomId: "room-1",
  messages: storyShareExportMessagesFixture,
  canExport: true,
  canCreateTemporaryShare: true,
});
