import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("mobile Story chat uses the authoritative top-bar height for its overlap", () => {
  const theme = read("app/theme.css");
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");

  assert.match(theme, /--topbar-h:\s*calc\(var\(--control-md\) \+ var\(--space-3\) \* 2 \+ 1px\)/);
  assert.match(view, /-mt-\[var\(--topbar-h\)\]/);
  assert.doesNotMatch(view, /-mt-\[var\(--space-20\)\]/);
});

test("mobile Story chat claims the full dynamic viewport after overlapping the top bar", () => {
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");

  assert.match(view, /flex h-\[100dvh\] min-h-0 flex-col overflow-hidden/);
  assert.doesNotMatch(view, /h-\[calc\(100dvh-var\(--space-20\)\)\]/);
  assert.match(view, /lg:mt-0/);
  assert.match(view, /lg:h-\[calc\(100dvh-5rem\)\]/);
  assert.match(view, /xl:h-\[calc\(100vh-7rem\)\]/);
});
