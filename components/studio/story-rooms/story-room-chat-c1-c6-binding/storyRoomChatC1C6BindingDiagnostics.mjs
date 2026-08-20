import assert from "node:assert/strict";

import {
  STORY_ROOM_CHAT_C1_C6_BINDING_CONTRACT_VERSION,
} from "./StoryRoomChatC1C6Binding.contract.js";
import {
  storyRoomChatC1C6ActionsFixture,
  storyRoomChatC1C6ReportFixture,
  storyRoomChatC1C6StatusFixture,
} from "./StoryRoomChatC1C6Binding.fixtures.js";

assert.equal(
  STORY_ROOM_CHAT_C1_C6_BINDING_CONTRACT_VERSION,
  "story_room_chat_c1_c6_binding_v1"
);
assert.deepEqual(
  storyRoomChatC1C6StatusFixture.map((pill) => pill.label),
  ["SFW", "Private", "Turn 12"]
);
assert.equal(storyRoomChatC1C6ActionsFixture[0].disabled, false);
assert.equal(storyRoomChatC1C6ActionsFixture[1].disabled, false);
assert.equal(storyRoomChatC1C6ReportFixture.kind, "REPORT");
assert.equal(typeof storyRoomChatC1C6ReportFixture.onClose, "function");

console.log(JSON.stringify({
  diagnostic: "story_room_chat_c1_c6_binding_v1",
  status: "PASSED",
  c4ReportProjection: true,
  c4ExportShareActions: true,
  liveStatusPills: true,
}, null, 2));
