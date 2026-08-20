import {
  buildStoryRoomChatStateActions,
  buildStoryRoomChatStatusPills,
  projectStoryRoomReportDialog,
} from "./StoryRoomChatC1C6Binding.contract.js";

const noop = () => {};

export const storyRoomChatC1C6StatusFixture = buildStoryRoomChatStatusPills({
  turnCount: 12,
  rawRoom: {
    content_rating: "SFW",
    visibility: "PRIVATE",
  },
});

export const storyRoomChatC1C6ActionsFixture = buildStoryRoomChatStateActions({
  actionProjection: {
    export: { id: "export-chat", label: "Export Chat", enabled: true },
    share: { id: "share-snapshot", label: "Share Snapshot", enabled: true },
  },
  onOpenExport: noop,
  onOpenShare: noop,
});

export const storyRoomChatC1C6ReportFixture = projectStoryRoomReportDialog({
  open: true,
  speaker: "Mira Quill",
  reasonOptions: [{ value: "OTHER", label: "Other" }],
  reasonCode: "OTHER",
  comment: "Continuity issue",
  onCancel: noop,
  onSubmit: noop,
});
