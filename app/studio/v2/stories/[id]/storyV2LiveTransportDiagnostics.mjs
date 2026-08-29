import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 Story Chat binds the live Story Room runtime instead of mock transport", () => {
  const vm = read("app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js");

  assert.match(vm, /useStoryRoomChat\(id\)/);
  assert.match(vm, /chat\.sendMessage/);
  assert.match(vm, /deleteStoryRoom\(id\)/);
  assert.doesNotMatch(vm, /resolveChatV2StoryMock/);
  assert.doesNotMatch(vm, /mock engine/i);
  assert.doesNotMatch(vm, /setTimeout/);
});

test("V2 transcript projects persisted player semantics through the shared semantic presenter", () => {
  const adapter = read("app/studio/v2/stories/[id]/storyRoomV2LiveAdapter.js");

  assert.match(adapter, /buildPlayerChatMessagePresentation/);
  assert.match(adapter, /metadata:\s*safeMessage\.metadata/);
  assert.match(adapter, /autoEventMedia/);
  assert.match(adapter, /chat\.responsePresentation\.v1/);
  assert.match(adapter, /getCharacterColorPalette/);
});

test("V2 Stories preserve the accepted live Story Room runtime boundary", () => {
  const stories = read("app/studio/v2/stories/StoriesV2Live.jsx");
  const page = read("app/studio/v2/stories/[id]/page.jsx");
  const controller = read("components/studio/story-rooms/hooks/useStoryLaunchController.js");

  assert.match(stories, /router\.push\(`\/studio\/story-rooms\/\$\{encodeURIComponent\(item\.roomId\)\}`\)/);
  assert.doesNotMatch(stories, /resolvePostCreateHref:/);
  assert.match(page, /redirect\(`\/studio\/story-rooms\/\$\{encodeURIComponent\(id\)\}`\)/);
  assert.match(controller, /resolvePostCreateHref = resolveStoryPostCreateNavigationHref/);
  assert.match(controller, /push\(resolvePostCreateHref\(\{ room, roomId \}\)\)/);
});

test("V2 Story authoring enters and exits through V2 editor routes", () => {
  const stories = read("app/studio/v2/stories/StoriesV2Live.jsx");
  const editorNew = read("app/studio/v2/editor/new/page.jsx");
  const wrapper = read("app/studio/v2/editor/V2RoomTemplateBuilderClient.jsx");

  assert.match(stories, /\/studio\/v2\/editor\/new\?type=ROOM_TEMPLATE&origin=stories/);
  assert.match(editorNew, /type === "ROOM_TEMPLATE"/);
  assert.match(editorNew, /V2RoomTemplateBuilderClient/);
  assert.match(wrapper, /RoomTemplateBuilderShell/);
  assert.match(wrapper, /\/studio\/v2\/editor\/\$\{encodeURIComponent\(creation\.id\)\}\?origin=stories/);
  assert.doesNotMatch(stories, /\/studio\/create\/room-template/);
});

test("V2 live adapter stays behind existing same-origin Story Room client boundary", () => {
  const vm = read("app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js");
  const client = read("lib/client/studio/story-rooms/storyRoomClient.js");

  assert.doesNotMatch(vm, /fetch\s*\(/);
  assert.doesNotMatch(vm, /postgraphile/i);
  assert.doesNotMatch(vm, /supabase/i);
  assert.match(client, /endpoint:\s*`\/api\/studio\/story-rooms\/\$\{encodeURIComponent\(roomId\)\}\/messages`/);
});

test("V2 live transport does not mutate or import a V1 Story Room View", () => {
  const vm = read("app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js");
  const page = read("app/studio/v2/stories/[id]/StoryChatPage.jsx");

  assert.doesNotMatch(vm, /story-room-chat-shell|story-room-message|story-room-state-panel|story-room-cast-panel/);
  assert.doesNotMatch(page, /story-room-chat-shell|story-room-message|story-room-state-panel|story-room-cast-panel/);
  assert.match(page, /ChatShell/);
});
