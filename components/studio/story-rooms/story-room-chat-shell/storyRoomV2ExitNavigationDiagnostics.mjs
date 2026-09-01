import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildLegacyStoryChatHref,
  buildStoryChatHref,
  STORY_CHAT_CANONICAL_ROUTE_PREFIX,
  STORY_CHAT_LEGACY_ROUTE_PREFIX,
} from "../../../../lib/shared/story-rooms/storyRoomRouteAuthority.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

test("Story Chat route helpers establish V2 as canonical while preserving legacy links", () => {
  assert.equal(STORY_CHAT_CANONICAL_ROUTE_PREFIX, "/studio/v2/stories");
  assert.equal(STORY_CHAT_LEGACY_ROUTE_PREFIX, "/studio/story-rooms");
  assert.equal(buildStoryChatHref("room 1"), "/studio/v2/stories/room%201");
  assert.equal(buildLegacyStoryChatHref("room 1"), "/studio/story-rooms/room%201");
  assert.equal(buildStoryChatHref(""), "");
});

test("canonical V2 Story route mounts the established Story Room stack directly", () => {
  const route = read("app/studio/v2/stories/[id]/page.jsx");
  const binding = read("app/studio/v2/stories/[id]/StoryChatPage.jsx");

  assert.match(route, /import StoryChatPage from "\.\/StoryChatPage"/);
  assert.match(route, /return <StoryChatPage id=\{id\} \/>/);
  assert.doesNotMatch(route, /redirect\(/);
  assert.match(
    binding,
    /import StoryRoomChatShell from "@\/components\/studio\/story-rooms\/StoryRoomChatShell"/
  );
  assert.match(binding, /return <StoryRoomChatShell roomId=\{id\} \/>/);
});

test("legacy Story Room route is a compatibility alias to the canonical binding", () => {
  const legacyRoute = read("app/studio/story-rooms/[id]/page.js");

  assert.match(
    legacyRoute,
    /import StoryChatPage from "@\/app\/studio\/v2\/stories\/\[id\]\/StoryChatPage"/
  );
  assert.match(legacyRoute, /return <StoryChatPage id=\{id\} \/>/);
  assert.doesNotMatch(legacyRoute, /StoryRoomChatShell/);
});

test("the superseded parallel V2 chat implementation is retired", () => {
  const obsoleteFiles = [
    "app/studio/v2/stories/[id]/chatV2StoryMock.js",
    "app/studio/v2/stories/[id]/storyRoomV2LiveAdapter.js",
    "app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js",
    "app/studio/v2/stories/[id]/useStoryRoomV2MessageActions.js",
  ];

  for (const relativePath of obsoleteFiles) {
    assert.equal(exists(relativePath), false, `${relativePath} should be retired`);
  }
});

test("live Story Room exit navigation still returns to the V2 Stories surface", () => {
  const castViewModel = read(
    "components/studio/story-rooms/story-room-cast-panel/useStoryRoomCastPanelViewModel.js"
  );
  const castView = read(
    "components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx"
  );
  const shell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");

  assert.match(castViewModel, /roomListHref: "\/studio\/v2\/stories"/);
  assert.match(castView, /roomListHref = "\/studio\/v2\/stories"/);
  assert.match(castView, /roomListHref \|\| "\/studio\/v2\/stories"/);
  assert.match(shell, /router\.push\("\/studio\/v2\/stories"\)/);
});

test("V2 Stories continues rooms through the canonical V2 Story Chat route", () => {
  const stories = read("app/studio/v2/stories/StoriesV2Live.jsx");

  assert.match(stories, /router\.push\(buildStoryChatHref\(item\.roomId\)\)/);
  assert.doesNotMatch(stories, /router\.push\(`\/studio\/story-rooms\//);
});
