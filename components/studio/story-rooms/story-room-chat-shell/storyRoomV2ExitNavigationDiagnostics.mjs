import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("live Story Room exit navigation returns to the V2 Stories surface", () => {
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

test("V2 Stories still opens the current live Story Room runtime", () => {
  const stories = read("app/studio/v2/stories/StoriesV2Live.jsx");

  assert.match(
    stories,
    /router\.push\(`\/studio\/story-rooms\/\$\{encodeURIComponent\(item\.roomId\)\}`\)/
  );
  assert.doesNotMatch(
    stories,
    /router\.push\(`\/studio\/v2\/stories\/\$\{encodeURIComponent\(item\.roomId\)\}`\)/
  );
});
