import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CHAT_EXPORT_FORMAT_OPTIONS,
  CHAT_EXPORT_RANGE_PRESETS,
  CHAT_SESSION_DIALOG_KINDS,
  CHAT_SHARE_MODES,
} from "../../chat/chat-session-dialogs/ChatSessionDialogs.contract.js";

import {
  STORY_SHARE_EXPORT_C4_BINDING_CONTRACT_VERSION,
  STORY_SHARE_EXPORT_CALLBACK_KEYS,
  STORY_SHARE_EXPORT_DEFAULT_FORMAT,
  STORY_SHARE_EXPORT_DEFAULT_PRESET,
  STORY_SHARE_DEFAULT_MODE,
  buildStorySessionExportIntent,
  buildStorySessionShareIntent,
  buildStorySessionVisibleMessageOptions,
  getStorySessionDefaultRangeBoundaries,
  projectStorySessionExportDialog,
  projectStorySessionShareDialog,
  projectStorySessionShareExportActions,
  projectStorySessionShareResult,
  validateStorySessionRangeSelection,
} from "./StoryShareExportC4Binding.contract.js";

import {
  storyExportCustomMarkdownFixture,
  storyExportIncompleteCustomFixture,
  storyExportRecent50Fixture,
  storyShareExportActionsFixture,
  storyShareExportMessagesFixture,
  storySharePersistentActiveFixture,
  storySharePersistentFailedFixture,
  storySharePersistentRejectedFixture,
  storyShareRevokeConfirmFixture,
  storyShareRevokedFixture,
  storyShareTemporaryActiveFixture,
} from "./StoryShareExportC4Binding.fixtures.js";

assert.equal(
  STORY_SHARE_EXPORT_C4_BINDING_CONTRACT_VERSION,
  "story_share_export_c4_binding_v1"
);
assert.equal(
  STORY_SHARE_EXPORT_DEFAULT_PRESET,
  "RECENT_50"
);
assert.equal(
  STORY_SHARE_EXPORT_DEFAULT_FORMAT,
  "TXT"
);
assert.equal(
  STORY_SHARE_DEFAULT_MODE,
  "TEMPORARY"
);

assert.deepEqual(
  CHAT_EXPORT_RANGE_PRESETS.map((preset) => preset.id),
  [
    "CURRENT_BEAT",
    "CURRENT_SCENE",
    "RECENT_25",
    "RECENT_50",
    "CUSTOM",
  ]
);
assert.deepEqual(
  CHAT_EXPORT_FORMAT_OPTIONS.map((format) => format.id),
  ["TXT", "MARKDOWN"]
);
assert.deepEqual(CHAT_SHARE_MODES, {
  TEMPORARY: "TEMPORARY",
  PERSISTENT_REVIEWED: "PERSISTENT_REVIEWED",
});

const messageOptions =
  buildStorySessionVisibleMessageOptions(
    storyShareExportMessagesFixture
  );

assert.equal(messageOptions.length, 3);
assert.equal(messageOptions[0].id, "m1");
assert.match(
  messageOptions[0].label,
  /^1\. Mira Quill — /
);
assert.equal(messageOptions[1].id, "m3");
assert.match(
  messageOptions[1].label,
  /^2\. You — /
);
assert.equal(messageOptions[2].id, "m4");
assert.match(
  messageOptions[2].label,
  /^3\. Kessa Cindervell — /
);
assert.equal(
  messageOptions.some((option) => option.id === "m2"),
  false
);
assert.equal(
  messageOptions.some((option) => option.id === "m5"),
  false
);

assert.deepEqual(
  getStorySessionDefaultRangeBoundaries(messageOptions),
  {
    startMessageId: "m1",
    endMessageId: "m4",
  }
);

const validCustom =
  validateStorySessionRangeSelection({
    preset: "CUSTOM",
    startMessageId: "m1",
    endMessageId: "m4",
  });

assert.equal(validCustom.valid, true);
assert.equal(validCustom.customRange, true);

const invalidCustom =
  validateStorySessionRangeSelection({
    preset: "CUSTOM",
    startMessageId: "",
    endMessageId: "m4",
  });

assert.equal(invalidCustom.valid, false);
assert.equal(
  invalidCustom.error,
  "Choose both a start message and an end message."
);

const recentExportIntent =
  buildStorySessionExportIntent({
    preset: "RECENT_50",
    format: "TXT",
    startMessageId: "m1",
    endMessageId: "m4",
  });

assert.deepEqual(recentExportIntent, {
  valid: true,
  error: "",
  payload: {
    preset: "RECENT_50",
    startMessageId: null,
    endMessageId: null,
    format: "TXT",
  },
});

const customExportIntent =
  buildStorySessionExportIntent(
    storyExportCustomMarkdownFixture
  );

assert.deepEqual(customExportIntent.payload, {
  preset: "CUSTOM",
  startMessageId: "m1",
  endMessageId: "m4",
  format: "MARKDOWN",
});

assert.equal(
  buildStorySessionExportIntent(
    storyExportIncompleteCustomFixture
  ).valid,
  false
);

const temporaryShareIntent =
  buildStorySessionShareIntent({
    mode: "TEMPORARY",
    preset: "RECENT_25",
    startMessageId: "m1",
    endMessageId: "m4",
  });

assert.deepEqual(temporaryShareIntent.payload, {
  mode: "TEMPORARY",
  preset: "RECENT_25",
  startMessageId: null,
  endMessageId: null,
});

const customPersistentShareIntent =
  buildStorySessionShareIntent({
    mode: "PERSISTENT_REVIEWED",
    preset: "CUSTOM",
    startMessageId: "m1",
    endMessageId: "m4",
  });

assert.deepEqual(customPersistentShareIntent.payload, {
  mode: "PERSISTENT_REVIEWED",
  preset: "CUSTOM",
  startMessageId: "m1",
  endMessageId: "m4",
});

const exportDialog =
  projectStorySessionExportDialog(
    storyExportRecent50Fixture
  );

assert.equal(
  exportDialog.kind,
  CHAT_SESSION_DIALOG_KINDS.EXPORT
);
assert.equal(exportDialog.preset, "RECENT_50");
assert.equal(exportDialog.format, "TXT");
assert.equal(exportDialog.customRange, false);
assert.equal(exportDialog.messageOptions.length, 3);
assert.equal(exportDialog.pending, false);
assert.equal(exportDialog.error, "");

const customExportDialog =
  projectStorySessionExportDialog(
    storyExportCustomMarkdownFixture
  );

assert.equal(customExportDialog.customRange, true);
assert.equal(customExportDialog.format, "MARKDOWN");

const temporaryShareDialog =
  projectStorySessionShareDialog(
    storyShareTemporaryActiveFixture
  );

assert.equal(
  temporaryShareDialog.kind,
  CHAT_SESSION_DIALOG_KINDS.SHARE
);
assert.equal(temporaryShareDialog.mode, "TEMPORARY");
assert.deepEqual(temporaryShareDialog.result, {
  status: "ACTIVE",
  shareUrl:
    "https://crestfall-studio.com/share/chat/temporary-token",
  shareMode: "TEMPORARY",
  expiresAt: "2026-08-18T05:00:00.000Z",
});
assert.equal(
  temporaryShareDialog.revokeConfirmOpen,
  false
);

const persistentShareDialog =
  projectStorySessionShareDialog(
    storySharePersistentActiveFixture
  );

assert.equal(
  persistentShareDialog.mode,
  "PERSISTENT_REVIEWED"
);
assert.deepEqual(persistentShareDialog.result, {
  status: "ACTIVE",
  shareUrl:
    "https://crestfall-studio.com/share/chat/persistent-token",
  shareMode: "PERSISTENT_REVIEWED",
  expiresAt: "",
});

const rejected =
  projectStorySessionShareDialog(
    storySharePersistentRejectedFixture
  );

assert.equal(rejected.result.status, "REJECTED");
assert.equal(rejected.result.shareUrl, "");
assert.equal(rejected.result.expiresAt, "");

const failed =
  projectStorySessionShareDialog(
    storySharePersistentFailedFixture
  );

assert.equal(failed.result.status, "FAILED");
assert.equal(failed.result.shareUrl, "");

const revoked =
  projectStorySessionShareDialog(
    storyShareRevokedFixture
  );

assert.equal(revoked.result.status, "REVOKED");
assert.equal(revoked.result.shareUrl, "");
assert.equal(revoked.result.expiresAt, "");

const revokeConfirm =
  projectStorySessionShareDialog(
    storyShareRevokeConfirmFixture
  );

assert.equal(revokeConfirm.revokeConfirmOpen, true);

assert.deepEqual(
  projectStorySessionShareResult({
    result: {
      status: "ACTIVE",
      expiresAt: "soon",
    },
    requestedMode: "TEMPORARY",
    shareUrl: "https://example.test/share",
  }),
  {
    status: "ACTIVE",
    shareUrl: "https://example.test/share",
    shareMode: "TEMPORARY",
    expiresAt: "soon",
  }
);

const actions =
  projectStorySessionShareExportActions(
    storyShareExportActionsFixture
  );

assert.equal(actions.export.enabled, true);
assert.equal(actions.share.enabled, true);
assert.equal(actions.messageOptions.length, 3);
assert.deepEqual(actions.defaultRange, {
  startMessageId: "m1",
  endMessageId: "m4",
});

assert.equal(
  projectStorySessionShareExportActions({
    ...storyShareExportActionsFixture,
    roomId: "",
  }).export.enabled,
  false
);
assert.equal(
  projectStorySessionShareExportActions({
    ...storyShareExportActionsFixture,
    messages: [],
  }).share.enabled,
  false
);

assert.deepEqual(
  STORY_SHARE_EXPORT_CALLBACK_KEYS,
  [
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
  ]
);

const source = fs.readFileSync(
  new URL(
    "./StoryShareExportC4Binding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "window.location",
  "navigator.clipboard",
  "URL.createObjectURL",
  "document.createElement",
  "createTemporaryStoryRoomShare",
  "createPersistentStoryRoomShare",
  "revokeTemporaryStoryRoomShare",
  "revokePersistentStoryRoomShare",
  "exportStoryRoomTranscript",
  "Llama",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "story_share_export_c4_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STORY_SHARE_EXPORT_C4_BINDING_CONTRACT_VERSION,
  c4RangePresetCount:
    CHAT_EXPORT_RANGE_PRESETS.length,
  c4ExportFormatCount:
    CHAT_EXPORT_FORMAT_OPTIONS.length,
  c4ShareModeCount:
    Object.keys(CHAT_SHARE_MODES).length,
  currentRecent50TxtDefaultsCovered: true,
  visibleMessageBoundaryProjectionCovered: true,
  customRangeValidationCovered: true,
  temporaryShareResultNormalizationCovered: true,
  persistentReviewStatesCovered: true,
  revokeConfirmationStateCovered: true,
  c4ProtectedPackageUnmodified: true,
  apiClipboardUrlConstructionExcluded: true,
}, null, 2));
