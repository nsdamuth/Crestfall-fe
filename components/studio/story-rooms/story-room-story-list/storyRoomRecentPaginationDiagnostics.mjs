import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("story_room_recent_pagination_v1: Recent uses 10 mobile and 25 desktop with one-row lookahead", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-story-list/useStoryRoomStoryListViewModel.js"
  );

  assert.match(vm, /STORY_ROOM_STORY_LIST_MOBILE_PAGE_SIZE = 10/);
  assert.match(vm, /STORY_ROOM_STORY_LIST_DESKTOP_PAGE_SIZE = 25/);
  assert.match(vm, /STORY_ROOM_STORY_LIST_DESKTOP_QUERY = "\(min-width: 48rem\)"/);
  assert.match(vm, /limit: pageSize \+ 1/);
  assert.match(vm, /offset: rooms\.length/);
  assert.match(vm, /safeRooms\.slice\(0, pageSize\)/);
  assert.match(vm, /setHasMore\(safeRooms\.length > pageSize\)/);
});

test("story_room_recent_pagination_v1: Load more is explicit and search preserves full-list semantics", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-story-list/useStoryRoomStoryListViewModel.js"
  );
  const view = read(
    "components/studio/story-rooms/story-room-story-list/StoryRoomStoryList.view.jsx"
  );

  assert.match(vm, /async function loadSearchRooms/);
  assert.match(vm, /const nextRooms = await loadStoryRooms\(\);/);
  assert.match(vm, /hasMore: !normalizedQuery && hasMore/);
  assert.match(vm, /onLoadMore/);
  assert.match(view, /hasMore \? \(/);
  assert.match(view, /onClick=\{\(\) => onLoadMore\?\.\(\)\}/);
  assert.match(view, /Loading…/);
});

test("story_room_recent_pagination_v1: client and FE API forward limit and offset without changing unpaged callers", () => {
  const client = read("lib/client/studio/story-rooms/storyRoomClient.js");
  const route = read("app/api/studio/story-rooms/route.js");

  assert.match(client, /fetchStoryRooms\(\{ limit = null, offset = null \} = \{\}\)/);
  assert.match(client, /query\.set\("limit"/);
  assert.match(client, /query\.set\("offset"/);
  assert.match(client, /\/api\/studio\/story-rooms\$\{suffix\}/);
  assert.match(route, /export async function GET\(request\)/);
  assert.match(route, /incoming\.get\("limit"\)/);
  assert.match(route, /incoming\.get\("offset"\)/);
  assert.match(route, /\/v1\/studio\/story-rooms\$\{suffix\}/);
});
